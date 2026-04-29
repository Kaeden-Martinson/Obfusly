/* Wait Until Page Is Ready */
document.addEventListener("DOMContentLoaded", function () {

    let webSocket = null;

    /* Globally Defined Variables */
    const diagonalRemove = Math.sqrt(.5);
    var objectPositions = [];
    var filteredCameraObjects = [];
    var timeoutsArray = [500];
    var movementInterval = false;
    var lastTime = 0;
    var TARGET_FPS = 120;
    var MOVE_TPS = 60;
    var NETWORK_TPS = 10;
    var networkInterval = null; /* null = suspended, true = running (RAF-driven) */
    var _tickAccum = 0;        /* accumulated ms since last local tick */
    var fpsFrames = 0;
    var fpsLastTime = 0;
    var fpsDisplay = 0;
    var showFps  = true;
    var showPing = true;
    var _fpsStat  = null;
    var _pingStat = null;
    var _hudScoreEl = null;
    var _hudLevelEl = null;
    var drawJoystick = function () {};
    var _joyUpdateCenter = function () {};
    var _time = 0;
    var showServerGhost = false;
    var _isMobile = 'ontouchstart' in window;
    /* FPS simulator: cap render rate to a fixed target for testing */
    var _fpsCapEnabled = false;
    var _fpsCapTarget  = 30;   /* fps */
    var _fpsCapLastAt  = 0;    /* performance.now() of last rendered frame */
    /* Lag simulation: disabled by default, toggled via checkbox */
    var _lagSimEnabled = false;
    var _lagSimMs = 100;
    var _currentLat = 0;
    function getSimLatency() {
        if (!_lagSimEnabled) { _currentLat = 0; return 0; }
        _currentLat = _lagSimMs;
        return _lagSimMs;
    }
    var _td = new TextDecoder();
    var _pingBuf = new Uint8Array([3]);
    var _pingSentAt = 0;   /* performance.now() when last ping was sent */
    var _pingRtt   = 0;   /* last measured round-trip time in ms */
    var _pingTimer = null; /* setInterval handle for 5-second ping loop */
    /* Pre-allocated input packet: [0x01][move:u8][seq:u32LE] */
    var _dirPkt = new Uint8Array(6);
    var _dirPktView = new DataView(_dirPkt.buffer);
    _dirPkt[0] = 1;

    /* Direction-based movement state */
    var _move = 0;         /* active move bitmask — only changes at tick boundary */
    var _pendingMove = 0;  /* desired move bitmask from key events — queued until next tick */
    var _tickStep = null;                    /* pixels per tick per axis — set on spawn */
    var _prevTickX = null, _prevTickY = null;/* player position at start of last tick */
    var _currTickX = null, _currTickY = null;/* player position advanced this tick */
    var _lastLocalTickAt = 0;                /* performance.now() timestamp of last local tick */
    var _nextInputSeq = 0;
    var _lastSentMove = -1; /* last move value actually transmitted; -1 forces first send */
    var _lastServerAckSeq = 0;
    var _pendingInputs = [];
    var _reconcileThresholdSq = 4;
    var _localVisualOffsetX = 0, _localVisualOffsetY = 0;
    var _packetMode = 'prod';
    var _listenersActivated = false;
    var _awaitingTabResync = false;

    function delaySend(data) {
        var msg = JSON.stringify(data);
        var lat = getSimLatency();
        if (lat > 0) {
            setTimeout(function () { if (webSocket && webSocket.readyState === 1) webSocket.send(msg); }, lat);
        } else {
            webSocket.send(msg);
        }
    }

    function sendPingPacket() {
        if (!webSocket || webSocket.readyState !== 1) return;
        _pingSentAt = performance.now();
        if (_packetMode === 'dev') {
            delaySend({ type: 'ping' });
        } else {
            webSocket.send(_pingBuf);
        }
    }

    function sendInputPacket(move, seq) {
        if (_packetMode === 'dev') {
            delaySend({ type: 'input', move: move, seq: seq >>> 0 });
            return;
        }
        _dirPkt[1] = move;
        _dirPktView.setUint32(2, seq >>> 0, true);
        webSocket.send(_dirPkt);
    }

    /* Create chat input */
    let chat = document.createElement("input");
    chat.type = "text";
    chat.placeholder = "Say something...";
    chat.maxLength = 120;
    chat.setAttribute("autocomplete", "off");
    chat.setAttribute("autocorrect", "off");
    chat.setAttribute("autocapitalize", "off");
    chat.setAttribute("spellcheck", "false");
    var _chatOpen = false;

    /* Creating Canvas */
    var _dpr = Math.min(window.devicePixelRatio || 1, 2); /* cap at 2× — beyond that costs 4× fillrate for minimal visual gain */
    let canvas = document.createElement("canvas");
    canvas.width  = window.innerWidth  * _dpr;
    canvas.height = window.innerHeight * _dpr;
    canvas.style.width  = '100vw';
    canvas.style.height = '100vh';
    canvas.id = "gameCanvas";
    document.body.appendChild(canvas);
    let ctx = canvas.getContext("2d");

    /* Game Objects */
    let mapSize = {
        Width: null,
        Height: null
    };

    let myPlayer = {
        id: null,
        x: null,
        y: null,
        renderX: null,
        renderY: null,
        renderVelX: 0,
        renderVelY: 0,
        animVx: 0,
        animVy: 0,
        name: null,
        width: 50,
        height: 50,
        speed: null,
        message: null,
    };
    var _baseZoom = _isMobile ? 0.45 : 0.9375;
    let camera = {
        x: null,
        y: null,
        zoom: _baseZoom,
        width: (canvas.width / _dpr / _baseZoom) - myPlayer.width,
        height: (canvas.height / _dpr / _baseZoom) - myPlayer.width
    };

    let globalPlayers = [];
    let globalLeaderboard = [];
    let globalOrbs = [];

    /* ── Orb sprite (pre-rendered once, reused every frame) ─────────────
     * shadowBlur on every draw call is extremely expensive; baking the
     * glow into an offscreen canvas and blitting with drawImage is ~10x
     * faster for large orb counts. */
    var _orbSprite   = null; /* offscreen Canvas */
    var _orbSpriteSZ = 22;   /* canvas size: 20px shape + 1px stroke each side, no shadow bleed */
    var _orbSpriteHW = 11;   /* half of _orbSpriteSZ — used to centre on orb position */

    function _buildOrbSprite() {
        /* 22×22 sprite: 20×20 roundRect inset 1px for the 2px stroke.
         * No shadow — orbs are densely packed (25px cell) so shadowBlur bleeds
         * into every neighbour and makes clearRect erases corrupt adjacent orbs. */
        var oc = document.createElement('canvas');
        oc.width = oc.height = _orbSpriteSZ; /* 22 */
        var ox = oc.getContext('2d');
        ox.fillStyle   = '#b0ccd8';
        ox.strokeStyle = '#e8f4f8';
        ox.lineWidth   = 2;
        ox.beginPath();
        ox.roundRect(1, 1, 20, 20, 3.5); /* 1px inset so stroke stays inside the 22px canvas */
        ox.fill();
        ox.stroke();
        _orbSprite = oc;
    }

    function _orbWorldPaint(orb) {
        if (!_orbWorldCtx || !orb || orb.x == null || orb.y == null) return;
        if (!_orbSprite) _buildOrbSprite();
        /* Snap to nearest pixel so paint and erase coordinates are identical */
        _orbWorldCtx.drawImage(_orbSprite, Math.round(orb.x) - _orbSpriteHW, Math.round(orb.y) - _orbSpriteHW);
    }

    function _orbWorldErase(orb) {
        if (!_orbWorldCtx || !orb || orb.x == null || orb.y == null) return;
        /* Clear exactly the same pixel-snapped area that was painted — no more, no less */
        _orbWorldCtx.clearRect(Math.round(orb.x) - _orbSpriteHW, Math.round(orb.y) - _orbSpriteHW, _orbSpriteSZ, _orbSpriteSZ);
    }

    /* pre-rendered static map layer (bg + grid + walls) */
    var mapLayerCanvas = null;
    /* World-space orb layer — painted once per orb received, erased on consume/removal.
     * updateOrbs() does a single drawImage viewport-blit per frame instead of N draws. */
    var _orbWorldCanvas = null, _orbWorldCtx = null;
    /* leaderboard offscreen cache */
    var _lbOff = null, _lbOffCtx = null, _lbLastJson = '';
    function _resolveBufferedRender(player, dt) {
        if (player.renderX == null || player.renderY == null) {
            player.renderX = player.x;
            player.renderY = player.y;
            player._iRenderVX = 0; player._iRenderVY = 0;
            player.animVx = 0;    player.animVy = 0;
        } else {
            var dx = player.x - player.renderX;
            var dy = player.y - player.renderY;
            var distSq = dx * dx + dy * dy;
            if (distSq > 220 * 220 || dt > 0.12) {
                player.renderX = player.x; player.renderY = player.y;
                player._iRenderVX = 0; player._iRenderVY = 0;
                player.animVx = 0;    player.animVy = 0;
            } else {
                var sx = _smoothDamp(player.renderX, player.x, player._iRenderVX || 0, 0.067, dt);
                var sy = _smoothDamp(player.renderY, player.y, player._iRenderVY || 0, 0.067, dt);
                player.renderX = sx.value;
                player.renderY = sy.value;
                player._iRenderVX = sx.velocity;
                player._iRenderVY = sy.velocity;
                var animAlpha = 1 - Math.exp(-18 * dt);
                player.animVx = (player.animVx || 0) + (sx.velocity * 0.0035 - (player.animVx || 0)) * animAlpha;
                player.animVy = (player.animVy || 0) + (sy.velocity * 0.0035 - (player.animVy || 0)) * animAlpha;
            }
        }
        return { x: player.renderX, y: player.renderY };
    }

    function _smoothDamp(current, target, velocity, smoothTime, dt) {
        if (smoothTime < 0.0001) smoothTime = 0.0001;
        var omega = 2 / smoothTime;
        var x = omega * dt;
        var exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
        var change = current - target;
        var temp = (velocity + omega * change) * dt;
        var nextVelocity = (velocity - omega * temp) * exp;
        var nextValue = target + (change + temp) * exp;
        return { value: nextValue, velocity: nextVelocity };
    }

    function _resolveMyPlayerRender(dt) {
        /* Sub-tick interpolation: advance smoothly between the previous and current
         * predicted tick positions based on real elapsed time.  This makes motion
         * continuous at any TPS — the visual target moves at render-framerate speed
         * instead of jumping once per tick, so 10 TPS looks as smooth as 30 TPS. */
        var baseX, baseY;
        if (_prevTickX !== null && _currTickX !== null && _lastLocalTickAt > 0) {
            var _tickMs = 1000 / NETWORK_TPS;
            var _alpha = Math.min((performance.now() - _lastLocalTickAt) / _tickMs, 1.0);
            baseX = _prevTickX + (_currTickX - _prevTickX) * _alpha;
            baseY = _prevTickY + (_currTickY - _prevTickY) * _alpha;
        } else {
            baseX = myPlayer.x != null ? myPlayer.x : 0;
            baseY = myPlayer.y != null ? myPlayer.y : 0;
        }
        /* Decay the visual offset toward zero so any residual reconcile correction
         * self-corrects smoothly over ~120ms instead of persisting indefinitely. */
        var _offsetDecay = Math.exp(-8 * dt);
        _localVisualOffsetX *= _offsetDecay;
        _localVisualOffsetY *= _offsetDecay;
        var targetX = baseX + _localVisualOffsetX;
        var targetY = baseY + _localVisualOffsetY;
        if (myPlayer.renderX == null || myPlayer.renderY == null) {
            myPlayer.renderX = targetX;
            myPlayer.renderY = targetY;
            myPlayer.renderVelX = 0;
            myPlayer.renderVelY = 0;
            myPlayer.animVx = 0;
            myPlayer.animVy = 0;
        } else {
            var dx = targetX - myPlayer.renderX;
            var dy = targetY - myPlayer.renderY;
            var distSq = dx * dx + dy * dy;
            if (distSq > 220 * 220 || dt > 0.12 || _awaitingTabResync) {
                myPlayer.renderX = targetX;
                myPlayer.renderY = targetY;
                myPlayer.renderVelX = 0;
                myPlayer.renderVelY = 0;
                myPlayer.animVx = 0;
                myPlayer.animVy = 0;
            } else {
                var sx = _smoothDamp(myPlayer.renderX, targetX, myPlayer.renderVelX, 0.067, dt);
                var sy = _smoothDamp(myPlayer.renderY, targetY, myPlayer.renderVelY, 0.067, dt);
                myPlayer.renderX = sx.value;
                myPlayer.renderY = sy.value;
                myPlayer.renderVelX = sx.velocity;
                myPlayer.renderVelY = sy.velocity;
                /* animVx target is velocity-normalised (px/s ÷ max px/s) so the value
                 * is identical regardless of frame rate.  0.0035 ≈ 0.42 / 120fps ref. */
                var animAlpha = 1 - Math.exp(-30 * dt);
                myPlayer.animVx += (sx.velocity * 0.0035 - myPlayer.animVx) * animAlpha;
                myPlayer.animVy += (sy.velocity * 0.0035 - myPlayer.animVy) * animAlpha;
            }
        }
        return { x: myPlayer.renderX, y: myPlayer.renderY };
    }

    function _resolveServerGhostRender(player, dt) {
        if (player.ghostRenderX == null || player.ghostRenderY == null) {
            player.ghostRenderX = player.x;
            player.ghostRenderY = player.y;
            player.ghostVelX = 0;
            player.ghostVelY = 0;
            player.ghostAnimVx = 0;
            player.ghostAnimVy = 0;
        } else {
            var dx = player.x - player.ghostRenderX;
            var dy = player.y - player.ghostRenderY;
            var distSq = dx * dx + dy * dy;
            if (distSq > 220 * 220 || dt > 0.12 || _awaitingTabResync) {
                player.ghostRenderX = player.x;
                player.ghostRenderY = player.y;
                player.ghostVelX = 0;
                player.ghostVelY = 0;
                player.ghostAnimVx = 0;
                player.ghostAnimVy = 0;
            } else {
                var sx = _smoothDamp(player.ghostRenderX, player.x, player.ghostVelX || 0, 0.067, dt);
                var sy = _smoothDamp(player.ghostRenderY, player.y, player.ghostVelY || 0, 0.067, dt);
                player.ghostRenderX = sx.value;
                player.ghostRenderY = sy.value;
                player.ghostVelX = sx.velocity;
                player.ghostVelY = sy.velocity;
                var animAlpha = 1 - Math.exp(-18 * dt);
                player.ghostAnimVx = (player.ghostAnimVx || 0) + (sx.velocity * 0.0035 - (player.ghostAnimVx || 0)) * animAlpha;
                player.ghostAnimVy = (player.ghostAnimVy || 0) + (sy.velocity * 0.0035 - (player.ghostAnimVy || 0)) * animAlpha;
            }
        }
        return { x: player.ghostRenderX, y: player.ghostRenderY };
    }

    function _simulateLocalStep(baseX, baseY, move) {
        var dx, dy;
        if (move >= 16 && move <= 23) {
            /* Intermediate mobile directions — unit vectors at 22.5° increments.
               cos(22.5°)≈0.9239, sin(22.5°)≈0.3827 */
            var C = 0.9239, S = 0.3827;
            var _dirs16 = [
                [ C, -S], [ S, -C], [-S, -C], [-C, -S],
                [-C,  S], [-S,  C], [ S,  C], [ C,  S]
            ];
            var d = _dirs16[move - 16];
            dx = d[0]; dy = d[1];
        } else {
            dx = (move & 2 ? 1 : 0) - (move & 1 ? 1 : 0);
            dy = (move & 4 ? 1 : 0) - (move & 8 ? 1 : 0);
        }
        var nx = baseX, ny = baseY;
        if (dx !== 0 || dy !== 0) {
            var step = _tickStep;
            var mx = dx * step, my = dy * step;
            if (move < 16 && dx !== 0 && dy !== 0) { mx *= diagonalRemove; my *= diagonalRemove; }
            nx += mx;
            ny += my;
        }
        /* Always apply collision — even when stationary — mirrors server _applyOneStep
         * so any floating-point residue nudging the player into a wall is corrected
         * every tick and during reconciliation replay of move=0 inputs. */
        myPlayer.x = nx; myPlayer.y = ny;
        _movementWallCollisions(myPlayer);
        borderCollisions(myPlayer);
        nx = myPlayer.x; ny = myPlayer.y;
        return { x: nx, y: ny };
    }

    function _reconcileToServer(serverX, serverY, ackSeq) {
        if (_currTickX === null) return;
        ackSeq = ackSeq >>> 0;
        if (!_awaitingTabResync && ackSeq < _lastServerAckSeq) return;

        if (_awaitingTabResync) {
            _awaitingTabResync = false;
            _lastServerAckSeq = ackSeq;
            _pendingInputs.length = 0;
            _move = 0;
            _pendingMove = 0;
            /* Correct server position through collision before storing —
             * ensures the player is never placed inside a wall on reconnect. */
            myPlayer.x = serverX;
            myPlayer.y = serverY;
            _movementWallCollisions(myPlayer);
            borderCollisions(myPlayer);
            var _syncX = myPlayer.x;
            var _syncY = myPlayer.y;
            _prevTickX = _syncX;
            _prevTickY = _syncY;
            _currTickX = _syncX;
            _currTickY = _syncY;
            myPlayer.renderX = _syncX;
            myPlayer.renderY = _syncY;
            myPlayer.renderVelX = 0;
            myPlayer.renderVelY = 0;
            myPlayer.animVx = 0;
            myPlayer.animVy = 0;
            _localVisualOffsetX = 0;
            _localVisualOffsetY = 0;
            if (globalPlayers[myPlayer.id]) {
                globalPlayers[myPlayer.id].ghostRenderX = _syncX;
                globalPlayers[myPlayer.id].ghostRenderY = _syncY;
                globalPlayers[myPlayer.id].ghostVelX = 0;
                globalPlayers[myPlayer.id].ghostVelY = 0;
                globalPlayers[myPlayer.id].ghostAnimVx = 0;
                globalPlayers[myPlayer.id].ghostAnimVy = 0;
            }
            _lastLocalTickAt = performance.now();
            return;
        }

        _lastServerAckSeq = ackSeq;

        while (_pendingInputs.length > 0 && _pendingInputs[0].seq <= ackSeq) {
            _pendingInputs.shift();
        }

        var rx = serverX, ry = serverY;
        for (var i = 0; i < _pendingInputs.length; i++) {
            var replayed = _simulateLocalStep(rx, ry, _pendingInputs[i].move);
            rx = replayed.x;
            ry = replayed.y;
        }

        var renderX = (myPlayer.x != null ? myPlayer.x : _currTickX) + _localVisualOffsetX;
        var renderY = (myPlayer.y != null ? myPlayer.y : _currTickY) + _localVisualOffsetY;
        var errX = rx - _currTickX;
        var errY = ry - _currTickY;
        var errSq = errX * errX + errY * errY;

        _prevTickX = rx;
        _prevTickY = ry;
        _currTickX = rx;
        _currTickY = ry;
        myPlayer.x = rx;
        myPlayer.y = ry;
        if (errSq > _reconcileThresholdSq) {
            _localVisualOffsetX += renderX - rx;
            _localVisualOffsetY += renderY - ry;
            if (_localVisualOffsetX > 140) _localVisualOffsetX = 140;
            else if (_localVisualOffsetX < -140) _localVisualOffsetX = -140;
            if (_localVisualOffsetY > 140) _localVisualOffsetY = 140;
            else if (_localVisualOffsetY < -140) _localVisualOffsetY = -140;
        }
    }

    /* Decode binary entity buffer from server
     * Per-entity: [id:u16LE][typeflags:u8][...data]
     * typeflags: bits 7-6 = type, bits 5-0 = flags */
    function processEntityBinary(buf) {
        var dv = new DataView(buf);
        var off = 0, len = buf.byteLength;
        while (off < len) {
            var id = dv.getUint16(off, true); off += 2;
            var tf = dv.getUint8(off); off++;
            var type = tf >> 6;
            var flags = tf & 63;
            if (flags & 32) {
                if (type === 0) delete globalPlayers[id];
                else {
                    var _dying = globalOrbs[id];
                    if (_dying) {
                        _orbWorldErase(_dying);
                    }
                    globalOrbs[id] = void 0;
                }
                continue;
            }
            var target;
            var _isNewOrb = false;
            if (type === 0) {
                target = globalPlayers[id];
                if (!target) { target = {}; globalPlayers[id] = target; }
            } else {
                target = globalOrbs[id];
                if (!target) { target = {}; globalOrbs[id] = target; _isNewOrb = true; }
            }
            target.type = type;
            target.id = id;
            if (flags & 1) { var nlen = dv.getUint8(off); off++; target.name = _td.decode(new Uint8Array(buf, off, nlen)); off += nlen; }
            if (flags & 2) { target.x = dv.getFloat32(off, true); off += 4; }
            if (flags & 4) { target.y = dv.getFloat32(off, true); off += 4; }
            if (flags & 8) { var mlen = dv.getUint8(off); off++; target.message = _td.decode(new Uint8Array(buf, off, mlen)); off += mlen; }
            if (flags & 16) { target.speed = dv.getUint8(off); off++; }
            if (_isNewOrb && target.x != null && target.y != null) {
                _orbWorldPaint(target);
            }
        }
    }

    /* Process dev-mode JSON entity updates from server */
    function processEntityDev(updates) {
        for (var i = 0; i < updates.length; i++) {
            var u = updates[i];
            if (u.remove) {
                if (u.entityType === 0) {
                    delete globalPlayers[u.id];
                } else {
                    var dying = globalOrbs[u.id];
                    if (dying) {
                        _orbWorldErase(dying);
                    }
                    globalOrbs[u.id] = void 0;
                }
            } else if (u.entityType === 0) {
                var p = globalPlayers[u.id];
                if (!p) { p = {}; globalPlayers[u.id] = p; }
                p.id = u.id; p.type = 0;
                if (u.name    !== undefined) p.name    = u.name;
                if (u.x       !== undefined) p.x       = u.x;
                if (u.y       !== undefined) p.y       = u.y;
                if (u.speed   !== undefined) p.speed   = u.speed;
                if (u.message !== undefined) p.message = u.message;
            } else {
                var isNew = !globalOrbs[u.id];
                var o = globalOrbs[u.id];
                if (!o) { o = {}; globalOrbs[u.id] = o; }
                o.id = u.id; o.type = 1; o.x = u.x; o.y = u.y;
                if (isNew) {
                    _orbWorldPaint(o);
                }
            }
        }
    }

    let userInfo = {
        playingGame: false,
        startMovementUpdate: false,
    };

    function decompressMap(compressed) {
        const map = [];
        for (let i = 0; i < compressed.length; i += 4) {
            const x = compressed[i] * 100;
            const y = compressed[i + 1] * 100;
            const sizeX = compressed[i + 2] * 100;
            const sizeY = compressed[i + 3] * 100;
            map.push([x, y, sizeX, sizeY]);
        };
        return map;
    };

    /* Clear The Canvas For Drawing */
    function clearCanvas() {
        ctx.setTransform(_dpr, 0, 0, _dpr, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        var _lw = canvas.width / _dpr, _lh = canvas.height / _dpr;
        ctx.clearRect(0, 0, _lw, _lh);
        ctx.fillStyle = '#050a14';
        ctx.fillRect(0, 0, _lw, _lh);
        ctx.scale(camera.zoom, camera.zoom);
    };

    /* Draw The Canvas Map */
    function drawBlankCanvas() {
        if (mapLayerCanvas) {
            var viewW = canvas.width / _dpr / camera.zoom;
            var viewH = canvas.height / _dpr / camera.zoom;
            var sx = Math.max(0, Math.floor(camera.x));
            var sy = Math.max(0, Math.floor(camera.y));
            var dx = sx - camera.x;
            var dy = sy - camera.y;
            var sw = Math.min(mapSize.Width - sx, Math.ceil(viewW - dx));
            var sh = Math.min(mapSize.Height - sy, Math.ceil(viewH - dy));
            if (sw > 0 && sh > 0) ctx.drawImage(mapLayerCanvas, sx, sy, sw, sh, dx, dy, sw, sh);
        } else {
            SQ.drawMapBackground(ctx, camera.x, camera.y, mapSize.Width, mapSize.Height);
        }
    };

    /* Draw The Random Objects */
    function drawMapObjects() {
        /* Maintain a nearby wall list for collisions only; rendering comes from mapLayerCanvas */
        if (Date.now() - timeoutsArray[0] >= 500) {
            timeoutsArray[0] = Date.now();
            filteredCameraObjects = [];
            for (var i = 0; i < objectPositions.length; i++) {
                var obj = objectPositions[i];
                var cullW = canvas.width / _dpr / camera.zoom / 2 + 200;
                var cullH = canvas.height / _dpr / camera.zoom / 2 + 200;
                if (Math.abs(myPlayer.x - obj[0]) < cullW && Math.abs(myPlayer.y - obj[1]) < cullH) filteredCameraObjects.push(obj);
            };
        };
    };

    /* Draw Player */
    function drawPlayer(player, tag, dt) {
        var x, y, animVx = 0, animVy = 0;
        var resolved;
        if (tag === 'myPlayer') resolved = _resolveMyPlayerRender(dt);
        else if (tag === 'serverGhost') resolved = _resolveServerGhostRender(player, dt);
        else resolved = _resolveBufferedRender(player, dt);
        x = resolved.x;
        y = resolved.y;
        if (tag === 'myPlayer') {
            animVx = Math.max(-1, Math.min(1, myPlayer.animVx || 0));
            animVy = Math.max(-1, Math.min(1, myPlayer.animVy || 0));
        } else if (tag === 'serverGhost') {
            animVx = Math.max(-1, Math.min(1, player.ghostAnimVx || 0));
            animVy = Math.max(-1, Math.min(1, player.ghostAnimVy || 0));
        } else {
            animVx = Math.max(-1, Math.min(1, player.animVx || 0));
            animVy = Math.max(-1, Math.min(1, player.animVy || 0));
        }
        var cx = x - camera.x + 25;
        var cy = y - camera.y + 25;
        if (tag === 'myPlayer') {
            SQ.drawPlayerSprite(ctx, cx, cy, 50, animVx, animVy, _time);
        } else if (tag === 'serverGhost') {
            SQ.drawPlayerSprite(ctx, cx, cy, 50, animVx, animVy, _time, {
                bodyColor: '#420814',
                coreColor: '#ff7aa9',
                strokeColor: '#ffb4cf',
                frameColor: 'rgba(255,120,169,0.62)',
                blurColor: '#ff77aa'
            });
        } else {
            SQ.drawPlayerSprite(ctx, cx, cy, 50, animVx, animVy, _time, {
                bodyColor: '#2a0918',
                coreColor: '#ff5d96',
                strokeColor: SQ.C.pink,
                frameColor: 'rgba(255,45,120,0.38)',
                blurColor: SQ.C.pink
            });
        }
        drawPlayerName(player, x, y);
        drawMessage(player, x, y);
    }

    function drawPlayerName(player, x, y) {
        if (!player.name) return;
        ctx.save();
        /* Convert world-centre of player to logical screen coords (CSS pixels) */
        var sx = (x - camera.x + 25) * camera.zoom;
        var sy = (y - camera.y) * camera.zoom - 13;
        /* Draw in screen space — size is fixed regardless of zoom level */
        ctx.setTransform(_dpr, 0, 0, _dpr, 0, 0);
        ctx.font = "600 13px 'Exo 2', sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var tw = ctx.measureText(player.name).width;
        /* Semi-transparent dark pill — much cleaner than a stroked outline */
        var ph = 16, pw = tw + 10;
        ctx.fillStyle = 'rgba(5,10,20,0.72)';
        ctx.beginPath();
        ctx.roundRect(sx - pw / 2, sy - ph / 2, pw, ph, 4);
        ctx.fill();
        /* Cyan text with subtle glow */
        ctx.fillStyle = '#00f5ff';
        ctx.shadowColor = '#00f5ff';
        ctx.shadowBlur = 7;
        ctx.fillText(player.name, sx, sy);
        ctx.restore();
    };

    /* Fog of War — rectangular, matching the server's axis-aligned cull.
     * Server removes entities at |dx| > 1280 OR |dy| > 720 world units.
     *
     * Four gradient strips, each spanning the FULL canvas in their perpendicular
     * direction. No interior rectangle boundaries = no visible chunk seams.
     * Gradient colour-stop clamping naturally produces solid fog beyond the
     * cutoff edge — no separate solid fillRect calls needed. */
    function drawFog() {
        ctx.save();
        ctx.setTransform(_dpr, 0, 0, _dpr, 0, 0);

        var cw = canvas.width / _dpr, ch = canvas.height / _dpr;
        var cx = cw / 2, cy = ch / 2;

        var fogW = 1280 * camera.zoom;
        var fogH = 720  * camera.zoom;

        /* Fog is fully opaque from this distance outward (78% of render dist).
         * Entities and their glow are fully hidden well before server cull. */
        var cutW = fogW * 0.78,  cutH = fogH * 0.78;
        /* Fog is fully transparent inside this distance (45% of render dist). */
        var fadeW = fogW * 0.45, fadeH = fogH * 0.45;

        var cutL = cx - cutW,  cutR = cx + cutW;
        var cutT = cy - cutH,  cutB = cy + cutH;
        var fadeL = cx - fadeW, fadeR = cx + fadeW;
        var fadeT = cy - fadeH, fadeB = cy + fadeH;

        /* Left — full canvas height; gradient solid→clear between cutL and fadeL.
         * Alpha is clamped to 1 for all x < cutL (solid fog beyond cutoff). */
        if (fadeL > 0) {
            var gL = ctx.createLinearGradient(cutL, 0, fadeL, 0);
            gL.addColorStop(0, 'rgba(5,10,20,1)');
            gL.addColorStop(1, 'rgba(5,10,20,0)');
            ctx.fillStyle = gL;
            ctx.fillRect(0, 0, fadeL, ch);
        }

        /* Right — full canvas height */
        if (fadeR < cw) {
            var gR = ctx.createLinearGradient(fadeR, 0, cutR, 0);
            gR.addColorStop(0, 'rgba(5,10,20,0)');
            gR.addColorStop(1, 'rgba(5,10,20,1)');
            ctx.fillStyle = gR;
            ctx.fillRect(fadeR, 0, cw - fadeR, ch);
        }

        /* Top — full canvas width */
        if (fadeT > 0) {
            var gT = ctx.createLinearGradient(0, cutT, 0, fadeT);
            gT.addColorStop(0, 'rgba(5,10,20,1)');
            gT.addColorStop(1, 'rgba(5,10,20,0)');
            ctx.fillStyle = gT;
            ctx.fillRect(0, 0, cw, fadeT);
        }

        /* Bottom — full canvas width */
        if (fadeB < ch) {
            var gB = ctx.createLinearGradient(0, fadeB, 0, cutB);
            gB.addColorStop(0, 'rgba(5,10,20,0)');
            gB.addColorStop(1, 'rgba(5,10,20,1)');
            ctx.fillStyle = gB;
            ctx.fillRect(0, fadeB, cw, ch - fadeB);
        }

        ctx.restore();
    }

    function updateCamera(dt) {
        /* Updating Camera Position (frame-rate independent) */
        var camFactor = 1 - Math.pow(0.965, dt * TARGET_FPS);
        var followX = (myPlayer.renderX != null) ? myPlayer.renderX : myPlayer.x;
        var followY = (myPlayer.renderY != null) ? myPlayer.renderY : myPlayer.y;
        camera.x += (followX - camera.width / 2 - camera.x) * camFactor;
        camera.y += (followY - camera.height / 2 - camera.y) * camFactor;
    }

    function borderCollisions(myPlayer) {
        let { x: x, y: y } = myPlayer;
        if (x < 0) x = 0;
        else if (x > mapSize.Width - myPlayer.width) x = mapSize.Width - myPlayer.width;
        if (y < 0) y = 0;
        else if (y > mapSize.Height - myPlayer.height) y = mapSize.Height - myPlayer.height;
        myPlayer.x = x;
        myPlayer.y = y;
    };

    /* Movement collision against ALL walls — identical to server _applyWallCollisions.
     * Must NOT use filteredCameraObjects (stale 500ms cache) because the server
     * checks every wall every tick; any difference causes real positional desync. */
    function _movementWallCollisions(target) {
        var pw = target.width, ph = target.height;
        /* 3 passes: resolves corner/wedge cases where a single push
         * into wall A clips the player into wall B. */
        for (var pass = 0; pass < 3; pass++) {
            var x = target.x, y = target.y;
            var hit = false;
            for (var i = 0; i < objectPositions.length; i++) {
                var w = objectPositions[i]; /* [x, y, sizeX, sizeY] */
                if (x < w[0] + w[2] && x + pw > w[0] && y < w[1] + w[3] && y + ph > w[1]) {
                    var overlapX = (x < w[0]) ? x + pw - w[0] : w[0] + w[2] - x;
                    var overlapY = (y < w[1]) ? y + ph - w[1] : w[1] + w[3] - y;
                    if (overlapX < overlapY) {
                        x = (x < w[0]) ? x - overlapX : x + overlapX;
                    } else {
                        y = (y < w[1]) ? y - overlapY : y + overlapY;
                    }
                    hit = true;
                }
            }
            target.x = x;
            target.y = y;
            if (!hit) break; /* no overlaps remain — early out */
        }
    };

    /* Local tick — runs at NETWORK_TPS rate (same as server).
     * Every tick becomes an input with its own sequence number so the server
     * can ack exactly what it processed and the client can replay the rest. */
    /* Called by key events — updates the pending direction that will be
     * committed at the next tick boundary, never mid-step. */
    function _updatePendingDir() {
        var move = 0;
        var keys = keyBoard.keysDown;
        for (var i = 0; i < keys.length; i++) {
            switch (keys[i]) {
                case 'a': case 'arrowleft':  move |= 1; break;
                case 'd': case 'arrowright': move |= 2; break;
                case 's': case 'arrowdown':  move |= 4; break;
                case 'w': case 'arrowup':    move |= 8; break;
            }
        }
        _pendingMove = move;
    }

    function _localMoveTick() {
        _move = _pendingMove;
        _nextInputSeq = (_nextInputSeq + 1) >>> 0;
        if (_move !== 0 || _lastSentMove !== 0) {
            sendInputPacket(_move, _nextInputSeq);
            _lastSentMove = _move;
        }
        _pendingInputs.push({ seq: _nextInputSeq, move: _move });
        if (_pendingInputs.length > 240) _pendingInputs.shift();

        _prevTickX = _currTickX;
        _prevTickY = _currTickY;
        var stepped = _simulateLocalStep(_currTickX, _currTickY, _move);
        _currTickX = stepped.x;
        _currTickY = stepped.y;
        _lastLocalTickAt = performance.now();
    };

    function _startLocalTickLoop(runImmediate) {
        /* RAF-driven — no setInterval; ticks fire inside animationLoop via _tickAccum */
        networkInterval = true;
        _tickAccum = 0;
        if (runImmediate) _localMoveTick();
    }

    function _suspendLocalTickLoop() {
        if (!movementInterval || _currTickX === null) return;
        if (networkInterval) {
            networkInterval = null;
            _tickAccum = 0;
        }
        if (_awaitingTabResync) return;

        _awaitingTabResync = true;
        keyBoard.keysDown.length = 0;
        _move = 0;
        _pendingMove = 0;
        _nextInputSeq = (_nextInputSeq + 1) >>> 0;
        sendInputPacket(0, _nextInputSeq);
        _pendingInputs.push({ seq: _nextInputSeq, move: 0 });
        if (_pendingInputs.length > 240) _pendingInputs.shift();
        _prevTickX = _currTickX;
        _prevTickY = _currTickY;
        myPlayer.x = _currTickX;
        myPlayer.y = _currTickY;
        _lastLocalTickAt = performance.now();
    }

    function _resumeLocalTickLoop() {
        if (!movementInterval || _currTickX === null || networkInterval || document.hidden) return;
        _lastLocalTickAt = performance.now();
        _tickAccum = 0;
        networkInterval = true;
    }

    /* Resizes Canvas */
    function resizeCanvas() {
        var newDpr = Math.min(window.devicePixelRatio || 1, 2); /* cap at 2× — beyond that gains nothing visually but costs 4× fillrate */
        var dprChanged = (newDpr !== _dpr);
        _dpr = newDpr;
        canvas.width   = window.innerWidth  * _dpr;
        canvas.height  = window.innerHeight * _dpr;
        canvas.style.width  = '100vw';
        canvas.style.height = '100vh';
        camera.width  = (canvas.width  / _dpr / camera.zoom) - myPlayer.width;
        camera.height = (canvas.height / _dpr / camera.zoom) - myPlayer.height;
        if (dprChanged) {
            /* Leaderboard offscreen canvas was built for old DPR — invalidate so it redraws at correct resolution */
            _lbOff = null;
            _lbLastJson = '';
            _lbScale = _lbDisplayScale * _dpr;
        }
        if (typeof _joyUpdateCenter === 'function') _joyUpdateCenter();
    };

    /* Keyboard Class */
    var keyBoard = new class KeyBoard {
        constructor() {
            this.keysDown = [];
        };
        /* Adds Key To Array */
        addKey = function (key) {
            if (!this.keysDown.includes(key)) this.keysDown.push(key);
            this.resolveMovementKeys(key);
        };
        /* Removes Key From Array */
        removeKey = function (key) {
            if (this.keysDown.includes(key)) {
                var index = this.keysDown.indexOf(key);
                if (index !== -1) this.keysDown.splice(index, 1);
            }
        };
        /* Prevents Use Of [Up And Down] Or [Left And Right] Keys Being Used At The Same Time */
        resolveMovementKeys = function (key) {
            for (let i = 0; i < keyBoard.keysDown.length; i++) {
                let keyPressed = keyBoard.keysDown[i];
                switch (key) {
                    case 'w': case "arrowup": if (keyPressed == 's' || keyPressed == 'arrowdown') this.removeKey(keyPressed); break;
                    case 'a': case "arrowleft": if (keyPressed == 'd' || keyPressed == 'arrowright') this.removeKey(keyPressed); break;
                    case 's': case "arrowdown": if (keyPressed == 'w' || keyPressed == 'arrowup') this.removeKey(keyPressed); break;
                    case 'd': case "arrowright": if (keyPressed == 'a' || keyPressed == 'arrowleft') this.removeKey(keyPressed); break;
                };
            };
        };
        /* Chat Key Event */
        conductKeyPress = function (key) {
            if (key === 'enter') {
                const chat = document.getElementById('chat');
                if (chat && chat.style.display !== "none") {
                    if (chat.value.trim() !== "") {
                        delaySend([2, chat.value]);
                        chat.value = "";
                    }
                    closeChat();
                } else {
                    openChat();
                };
            };
        };
    };

    function activateListeners() {
        if (_listenersActivated) return;
        _listenersActivated = true;

        /* Event Listeners For Keypressed */
        document.addEventListener("keydown", function (event) { if (event.isTrusted && !_chatOpen) { keyBoard.addKey(event.key.toLowerCase()); _updatePendingDir(); } });
        document.addEventListener("keyup",   function (event) { if (event.isTrusted && !_chatOpen) { keyBoard.removeKey(event.key.toLowerCase()); _updatePendingDir(); } });
        document.addEventListener("keypress", function (event) {
            if (!event.isTrusted) return;
            var k = event.key.toLowerCase();
            if (k === 'enter' && _chatOpen) event.preventDefault();
            keyBoard.conductKeyPress(k);
        });
        window.addEventListener('blur', function () {
            _suspendLocalTickLoop();
        });
        window.addEventListener('focus', function () {
            _resumeLocalTickLoop();
        });
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) _suspendLocalTickLoop();
            else _resumeLocalTickLoop();
        });

        /* Mobile visual joystick (octagon, fixed position) */
        if (_isMobile) document.body.classList.add('mobile');
        var _joyActive = false;
        var _joyTouchId = null;
        var _joyFreeMode = false; /* false = Stuck (default), true = Free */
        var _joySize = 40;
        /* Octagon cut: how much to trim corners (size * 0.4142 ≈ tan(22.5°)) */
        var _joyCut = Math.round(_joySize * 0.4142);
        var _joyKnobSize = 13;
        var _joyKnobCut = Math.round(_joyKnobSize * 0.4142);
        var _joyDeadzone = 7;
        /* Fixed position: bottom-left with separate x/y padding */
        var _joyPadX = 75;  /* left padding  — increase to push right */
        var _joyPadY = 70; /* bottom padding — increase to push up   */
        var _joyDefaultX = _joyPadX + _joySize;
        var _joyDefaultY = 0; /* set on resize */
        var _joyCenterX = _joyDefaultX;
        var _joyCenterY = 0; /* set on resize */
        var _joyKnobX = _joyCenterX;
        var _joyKnobY = 0;

        _joyUpdateCenter = function () {
            _joyDefaultX = _joyPadX + _joySize;
            _joyDefaultY = canvas.height / _dpr - _joyPadY - _joySize;
            if (!_joyActive) {
                _joyCenterX = _joyDefaultX;
                _joyCenterY = _joyDefaultY;
                _joyKnobX = _joyCenterX;
                _joyKnobY = _joyCenterY;
            }
        };

        /* Clamp dx/dy to octagon boundary: square with corners cut */
        function _joyClampOct(dx, dy) {
            var s = _joySize;
            var limit = s + _joyCut; /* diagonal axis limit = s + cut ~= s * 1.4142 but we use s + cut for the octagon edge */
            /* Clamp to square first */
            if (dx > s) dx = s; else if (dx < -s) dx = -s;
            if (dy > s) dy = s; else if (dy < -s) dy = -s;
            /* Cut corners: |dx| + |dy| <= s + joyCut */
            var sum = Math.abs(dx) + Math.abs(dy);
            if (sum > limit) {
                var scale = limit / sum;
                dx *= scale;
                dy *= scale;
            }
            return [dx, dy];
        }

        /* Draw an octagon path centered at cx,cy with half-size s and corner cut c */
        function _drawOctagon(cx, cy, s, c) {
            ctx.beginPath();
            ctx.moveTo(cx - s + c, cy - s);       /* top-left flat */
            ctx.lineTo(cx + s - c, cy - s);       /* top-right flat */
            ctx.lineTo(cx + s,     cy - s + c);   /* right-top flat */
            ctx.lineTo(cx + s,     cy + s - c);   /* right-bottom flat */
            ctx.lineTo(cx + s - c, cy + s);       /* bottom-right flat */
            ctx.lineTo(cx - s + c, cy + s);       /* bottom-left flat */
            ctx.lineTo(cx - s,     cy + s - c);   /* left-bottom flat */
            ctx.lineTo(cx - s,     cy - s + c);   /* left-top flat */
            ctx.closePath();
        }

        if (_isMobile) {
            _joyUpdateCenter();

            canvas.addEventListener('touchstart', function (e) {
                e.preventDefault();
                if (_joyTouchId !== null) return;
                var t = e.changedTouches[0];
                /* Positions stored in CSS pixels; DPR handled by ctx transform */
                var touchCanvasX = t.clientX;
                var touchCanvasY = t.clientY;
                /* Only activate on the left half of the screen */
                if (touchCanvasX > canvas.width / _dpr / 2) return;
                _joyTouchId = t.identifier;
                /* Free mode: move center to thumb; Stuck mode: keep fixed anchor */
                if (_joyFreeMode) {
                    _joyCenterX = touchCanvasX;
                    _joyCenterY = touchCanvasY;
                }
                _joyKnobX = _joyCenterX;
                _joyKnobY = _joyCenterY;
                _joyActive = true;
            }, { passive: false });

            canvas.addEventListener('touchmove', function (e) {
                e.preventDefault();
                for (var i = 0; i < e.changedTouches.length; i++) {
                    var t = e.changedTouches[i];
                    if (t.identifier !== _joyTouchId) continue;
                    /* Positions in CSS pixels — DPR handled by ctx transform */
                    var dx = t.clientX - _joyCenterX;
                    var dy = t.clientY - _joyCenterY;
                    /* Clamp knob to octagon bounds */
                    var clamped = _joyClampOct(dx, dy);
                    dx = clamped[0];
                    dy = clamped[1];
                    _joyKnobX = _joyCenterX + dx;
                    _joyKnobY = _joyCenterY + dy;
                    /* 16-direction mapping — sector boundaries at every 22.5°.
                       Ratio thresholds (ady/adx): tan(11.25°)≈0.199, tan(33.75°)≈0.668,
                       tan(56.25°)≈1.497, tan(78.75°)≈5.027.
                       Move codes 0-15: existing bitmask (keyboard-compatible).
                       Move codes 16-23: intermediate mobile-only unit vectors. */
                    if (Math.abs(dx) > _joyDeadzone || Math.abs(dy) > _joyDeadzone) {
                        var adx = Math.abs(dx), ady = Math.abs(dy);
                        var ratio = (adx > 0) ? ady / adx : 99999;
                        var move16;
                        if (ratio < 0.199) {
                            /* ~0° — pure cardinal horizontal */
                            move16 = (dx > 0) ? 2 : 1;
                        } else if (ratio < 0.668) {
                            /* ~22.5° — mostly horizontal, slight vertical */
                            if (dx > 0) move16 = (dy < 0) ? 16 : 23;
                            else         move16 = (dy < 0) ? 19 : 20;
                        } else if (ratio < 1.497) {
                            /* ~45° — diagonal */
                            if      (dx > 0 && dy < 0) move16 = 10;
                            else if (dx > 0)           move16 = 6;
                            else if (dy < 0)           move16 = 9;
                            else                       move16 = 5;
                        } else if (ratio < 5.027) {
                            /* ~67.5° — mostly vertical, slight horizontal */
                            if (dy < 0) move16 = (dx > 0) ? 17 : 18;
                            else         move16 = (dx > 0) ? 22 : 21;
                        } else {
                            /* ~90° — pure cardinal vertical */
                            move16 = (dy < 0) ? 8 : 4;
                        }
                        _pendingMove = move16;
                    } else {
                        _pendingMove = 0;
                    }
                }
            }, { passive: false });

            function releaseJoystick(e) {
                for (var i = 0; i < e.changedTouches.length; i++) {
                    if (e.changedTouches[i].identifier === _joyTouchId) {
                        _joyTouchId = null;
                        _joyActive = false;
                        /* Reset center to default anchor */
                        _joyCenterX = _joyDefaultX;
                        _joyCenterY = _joyDefaultY;
                        _joyKnobX = _joyCenterX;
                        _joyKnobY = _joyCenterY;
                        _pendingMove = 0;
                    }
                }
            }
            canvas.addEventListener('touchend', releaseJoystick);
            canvas.addEventListener('touchcancel', releaseJoystick);
        }

        /* Draw joystick overlay (called from animation loop) */
        drawJoystick = function () {
            if (!_isMobile) return;
            ctx.save();
            ctx.setTransform(_dpr, 0, 0, _dpr, 0, 0);
            /* Always show outer octagon when playing */
            _drawOctagon(_joyCenterX, _joyCenterY, _joySize, _joyCut);
            ctx.fillStyle = 'rgba(0,245,255,0.15)';
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(0,245,255,0.7)';
            ctx.shadowColor = '#00f5ff';
            ctx.shadowBlur = 16;
            ctx.stroke();
            /* Inner knob octagon */
            _drawOctagon(_joyKnobX, _joyKnobY, _joyKnobSize, _joyKnobCut);
            ctx.fillStyle = _joyActive ? 'rgba(0,245,255,0.75)' : 'rgba(0,245,255,0.45)';
            ctx.fill();
            ctx.strokeStyle = _joyActive ? 'rgba(0,245,255,1.0)' : 'rgba(0,245,255,0.75)';
            ctx.shadowBlur = _joyActive ? 22 : 12;
            ctx.stroke();
            ctx.restore();
        };
    };


    function openChat() {
        if (!document.getElementById('chat')) (document.getElementById('uiLayer') || document.body).appendChild(chat);
        chat.id = 'chat';

        /* Width: narrower on mobile, capped on desktop */
        var chatW = Math.min(270, Math.max(180, window.innerWidth * 0.55));
        var chatH = 36;
        var gap   = 10; /* px between chat bottom and name pill top */

        /* Name pill centre in CSS pixels — same formula as drawPlayerName */
        var rX = (myPlayer.renderX != null) ? myPlayer.renderX : myPlayer.x;
        var rY = (myPlayer.renderY != null) ? myPlayer.renderY : myPlayer.y;
        if (rX != null && rY != null) {
            var nameSX = (rX - camera.x + 25) * camera.zoom;        /* horizontal centre */
            var nameSY = (rY - camera.y)       * camera.zoom - 13;  /* vertical centre of name pill */
            var left   = nameSX - chatW / 2;
            var top    = nameSY - 8 - gap - chatH; /* 8 = half name-pill height */
            /* Clamp to viewport */
            left = Math.max(8, Math.min(window.innerWidth  - chatW - 8, left));
            top  = Math.max(8, Math.min(window.innerHeight - chatH - 8, top));
            chat.style.left  = left + 'px';
            chat.style.top   = top  + 'px';
        }
        chat.style.width   = chatW + 'px';
        chat.style.display = 'block';
        _chatOpen = true;
        chat.focus();
    };

    function closeChat() {
        const chatEl = document.getElementById("chat");
        if (chatEl) chatEl.style.display = "none";
        _chatOpen = false;
        /* Clear any stale held-key state accumulated while chat was open */
        keyBoard.keysDown = [];
        _updatePendingDir();
    };

    function animationLoop(currentTime) {

        /* FPS cap: skip render work until the minimum frame interval has elapsed */
        if (_fpsCapEnabled) {
            var _fpsCapInterval = 1000 / _fpsCapTarget;
            if (currentTime - _fpsCapLastAt < _fpsCapInterval) {
                requestAnimationFrame(animationLoop);
                return;
            }
            _fpsCapLastAt = currentTime;
        }

        if (!lastTime) lastTime = currentTime;
        var deltaTime = (currentTime - lastTime) / 1000;
        if (deltaTime > 0.1) deltaTime = 0.1;
        lastTime = currentTime;
        _time = currentTime / 1000;

        /* Loop Through Function Every Frame */
        requestAnimationFrame(animationLoop);

        if (userInfo.playingGame) {
            var _offsetDecay = Math.pow(0.8, deltaTime * TARGET_FPS);
            _localVisualOffsetX *= _offsetDecay;
            _localVisualOffsetY *= _offsetDecay;
            if (Math.abs(_localVisualOffsetX) < 0.01) _localVisualOffsetX = 0;
            if (Math.abs(_localVisualOffsetY) < 0.01) _localVisualOffsetY = 0;

            /* On first frame after spawn: initialise tick state */
            if (userInfo.startMovementUpdate) {
                userInfo.startMovementUpdate = false;
                movementInterval = true;
                _move = 0; _pendingMove = 0;
                _prevTickX = myPlayer.x; _prevTickY = myPlayer.y;
                _currTickX = myPlayer.x; _currTickY = myPlayer.y;
                _lastLocalTickAt = performance.now();
                _nextInputSeq = 0;
                _lastServerAckSeq = 0;
                _pendingInputs = [];
                _awaitingTabResync = false;
                _localVisualOffsetX = 0;
                _localVisualOffsetY = 0;
                myPlayer.renderX = myPlayer.x;
                myPlayer.renderY = myPlayer.y;
                myPlayer.renderVelX = 0;
                myPlayer.renderVelY = 0;
                myPlayer.animVx = 0;
                myPlayer.animVy = 0;
                /* step = speed × (MOVE_TPS / NETWORK_TPS) — must match server tickStep */
                _tickStep = myPlayer.speed * MOVE_TPS / NETWORK_TPS;
                _startLocalTickLoop(false);
            }

            /* RAF-driven local tick accumulator — fires at NETWORK_TPS regardless
             * of frame rate.  Mobile setInterval is throttled; RAF is not. */
            if (networkInterval && _currTickX !== null) {
                _tickAccum += deltaTime * 1000;
                var _tickInterval = 1000 / NETWORK_TPS;
                /* Cap at 3 ticks per frame to avoid spiral-of-death on heavy frames */
                var _maxTicks = 3;
                while (_tickAccum >= _tickInterval && _maxTicks-- > 0) {
                    _localMoveTick();
                    _tickAccum -= _tickInterval;
                }
                /* Clamp accumulator so a long freeze doesn't burst many ticks on resume */
                if (_tickAccum > _tickInterval) _tickAccum = _tickInterval;
            }

            /* Keep myPlayer.x/y at the latest predicted tick position.
             * Dedicated visual smoothing is applied in drawPlayer() for the
             * local player and self ghost only. */
            if (movementInterval && _currTickX !== null) {
                myPlayer.x = _currTickX;
                myPlayer.y = _currTickY;
            }

            /* Clear Canvas */
            clearCanvas();

            /* Canvas Backround */
            drawBlankCanvas();

            /* Update the Orbs */
            updateOrbs();

            /* Draw Server Side Players */
            for (var i = 0; i < globalPlayers.length; i++) {
                if (!globalPlayers[i]) continue;
                if (myPlayer.id == globalPlayers[i].id) {
                    if (showServerGhost) {
                        ctx.globalAlpha = 0.72;
                        drawPlayer(globalPlayers[i], 'serverGhost', deltaTime);
                        ctx.globalAlpha = 1.0;
                    }
                } else {
                    drawPlayer(globalPlayers[i], 'serverPlayers', deltaTime);
                }
            }

            /* My Player */
            drawPlayer(myPlayer, 'myPlayer', deltaTime);

            /* Draw Map */
            drawMapObjects();

            /* Update Camera Position */
            updateCamera(deltaTime);

            /* Fog — hides render-distance edges, drawn in screen space before UI */
            drawFog();

            /* Reset transform for screen-space UI */
            ctx.setTransform(_dpr, 0, 0, _dpr, 0, 0);

            /* Update the Leaderboard */
            updateLeaderboard(globalLeaderboard);

            /* Draw joystick overlay (mobile) */
            drawJoystick();

            /* FPS Counter */
            fpsFrames++;
            if (currentTime - fpsLastTime >= 1000) {
                fpsDisplay = fpsFrames;
                fpsFrames = 0;
                fpsLastTime = currentTime;
            }
            if (!_fpsStat)  _fpsStat  = document.getElementById('fpsStat');
            if (!_pingStat) _pingStat = document.getElementById('pingStat');
            if (_fpsStat)  { _fpsStat.textContent  = fpsDisplay + ' FPS'; _fpsStat.style.display  = showFps  ? '' : 'none'; }
            if (_pingStat) { _pingStat.textContent = _currentLat + ' MS';  _pingStat.style.display = showPing ? '' : 'none'; }

        };
    };

    /* Start The Animation Loop — wait for @font-face rules to register (ready),
     * then explicitly download each canvas variant (load), then render.
     * Without chaining ready→load, load() can resolve immediately with [] if the
     * Google Fonts stylesheet hasn't been parsed yet. */
    document.fonts.ready
        .then(function () {
            return Promise.all([
                document.fonts.load("700 18px 'Exo 2'"),
                document.fonts.load("600 16px 'Exo 2'"),
                document.fonts.load("500 15px 'Exo 2'"),
            ]);
        })
        .catch(function () {}) /* always start even if font fetch fails */
        .then(function () { animationLoop(); });



    function updateOrbs() {
        /* Single viewport blit from the world-space orb canvas — O(1) draw calls */
        if (!_orbWorldCanvas) return;
        var viewW = canvas.width  / _dpr / camera.zoom;
        var viewH = canvas.height / _dpr / camera.zoom;
        var sx = Math.max(0, Math.floor(camera.x));
        var sy = Math.max(0, Math.floor(camera.y));
        var dx = sx - camera.x;
        var dy = sy - camera.y;
        var sw = Math.min(mapSize.Width  - sx, Math.ceil(viewW - dx));
        var sh = Math.min(mapSize.Height - sy, Math.ceil(viewH - dy));
        if (sw > 0 && sh > 0) ctx.drawImage(_orbWorldCanvas, sx, sy, sw, sh, dx, dy, sw, sh);
    };

    /* Update the Leaderboard — offscreen-cached, redraws only when data changes */
    var _lbDisplayScale = _isMobile ? 0.72 : 1;
    var _lbScale = _lbDisplayScale * _dpr;
    function updateLeaderboard(Leaderboard) {
        if (!Array.isArray(Leaderboard)) Leaderboard = [Leaderboard];
        if (!Leaderboard || Leaderboard.length === 0) return;
        var lbW = 240;
        var lbY = 12;
        var json = JSON.stringify(Leaderboard);
        if (json !== _lbLastJson || !_lbOff) {
            _lbLastJson = json;
            var lbH = 52 + Leaderboard.length * 32 + 14;
            if (!_lbOff) {
                _lbOff = document.createElement('canvas');
                _lbOffCtx = _lbOff.getContext('2d');
            }
            _lbOff.width  = Math.round(lbW * _lbScale);
            _lbOff.height = Math.round(lbH * _lbScale);
            _lbOffCtx.scale(_lbScale, _lbScale);
            SQ.drawLeaderboard(_lbOffCtx, 0, 0, lbW, Leaderboard);
        }
        var dispW = _lbOff.width  / _dpr;
        var dispH = _lbOff.height / _dpr;
        ctx.drawImage(_lbOff, canvas.width / _dpr - dispW - 12, lbY, dispW, dispH);
    };

    function drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };

    function spawnPacket(playerName) {
        /* Spawn Packet */
        delaySend([0, playerName, Number(serverDropdown.value)]);
    };

    /* Debounced resize */
    var _resizeTimer = null;
    function _debouncedResize() {
        if (_resizeTimer !== null) clearTimeout(_resizeTimer);
        _resizeTimer = setTimeout(function () {
            _resizeTimer = null;
            resizeCanvas();
        }, 120);
    }

    /* Canvas Element Resizing */
    window.addEventListener('resize', _debouncedResize);
    /* Orientation change: skip debounce, give browser 250ms to settle new dimensions */
    window.addEventListener('orientationchange', function () {
        setTimeout(resizeCanvas, 250);
    });



    /* ── SETTINGS COG + PANEL ─────────────────────────────────────── */
    var settingsCog = document.createElement('button');
    settingsCog.id = 'settingsCog';
    settingsCog.setAttribute('aria-label', 'Settings');
    settingsCog.innerHTML = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
    (document.getElementById('uiLayer') || document.body).appendChild(settingsCog);

    var settingsPanel = document.createElement('div');
    settingsPanel.id = 'settingsPanel';
    settingsPanel.innerHTML =
        '<div class="sq-set-title">Settings</div>' +
        '<div class="sq-set-folder sq-open" id="sfHud">' +
          '<div class="sq-set-folder-hdr" id="sfHudHdr">' +
            '<span style="font-size:0.9rem">&#9643;</span> HUD' +
            '<span class="sq-set-folder-arrow">&#8250;</span>' +
          '</div>' +
          '<div class="sq-set-folder-body">' +
            '<div class="sq-set-row">' +
              '<span class="sq-set-row-lbl">Show FPS</span>' +
              '<label class="sq-tog"><input type="checkbox" id="sqFpsChk" checked><div class="sq-tog-track"></div><div class="sq-tog-thumb"></div></label>' +
            '</div>' +
            '<div class="sq-set-row">' +
              '<span class="sq-set-row-lbl">Show Ping</span>' +
              '<label class="sq-tog"><input type="checkbox" id="sqPingChk" checked><div class="sq-tog-track"></div><div class="sq-tog-thumb"></div></label>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="sq-set-folder sq-open" id="sfDev">'  +
          '<div class="sq-set-folder-hdr" id="sfDevHdr">' +
            '<span style="font-size:0.9rem">&#10689;</span> Developer' +
            '<span class="sq-set-folder-arrow">&#8250;</span>' +
          '</div>' +
          '<div class="sq-set-folder-body">' +
            '<div class="sq-set-row">' +
              '<span class="sq-set-row-lbl" id="sqLagLbl">Lag Sim: OFF</span>' +
              '<label class="sq-tog"><input type="checkbox" id="sqLagChk"><div class="sq-tog-track"></div><div class="sq-tog-thumb"></div></label>' +
            '</div>' +
            '<div class="sq-set-subrow" id="sqLagSub">' +
              '<input type="range" id="sqLagSlider" min="10" max="1000" step="10" value="100">' +
              '<span class="sq-set-subrow-val" id="sqLagVal">100ms</span>' +
            '</div>' +
            '<div class="sq-set-row">' +
              '<span class="sq-set-row-lbl" id="sqFpsCapLbl">FPS Cap: OFF</span>' +
              '<label class="sq-tog"><input type="checkbox" id="sqFpsCapChk"><div class="sq-tog-track"></div><div class="sq-tog-thumb"></div></label>' +
            '</div>' +
            '<div class="sq-set-subrow" id="sqFpsCapSub">' +
              '<input type="range" id="sqFpsCapSlider" min="5" max="120" step="5" value="30">' +
              '<span class="sq-set-subrow-val" id="sqFpsCapVal">30 fps</span>' +
            '</div>' +
            '<div class="sq-set-row">' +
              '<span class="sq-set-row-lbl">Server Pos</span>' +
              '<label class="sq-tog"><input type="checkbox" id="sqSrvChk"><div class="sq-tog-track"></div><div class="sq-tog-thumb"></div></label>' +
            '</div>' +
          '</div>' +
        '</div>' +
        (_isMobile ?
          '<div class="sq-set-folder sq-open" id="sfMobile">' +
            '<div class="sq-set-folder-hdr" id="sfMobileHdr">' +
              '<span style="font-size:0.9rem">&#9654;</span> Mobile' +
              '<span class="sq-set-folder-arrow">&#8250;</span>' +
            '</div>' +
            '<div class="sq-set-folder-body">' +
              '<div class="sq-set-row">' +
                '<span class="sq-set-row-lbl" id="sqJoyModeLbl">Joystick: Stuck</span>' +
                '<label class="sq-tog"><input type="checkbox" id="sqJoyModeChk"><div class="sq-tog-track"></div><div class="sq-tog-thumb"></div></label>' +
              '</div>' +
            '</div>' +
          '</div>'
        : '');
    (document.getElementById('uiLayer') || document.body).appendChild(settingsPanel);

    /* Cog toggle */
    settingsCog.addEventListener('click', function () {
        var isOpen = settingsPanel.classList.toggle('sq-open');
        settingsCog.classList.toggle('sq-open', isOpen);
    });

    /* Close panel when clicking outside */
    document.addEventListener('click', function (e) {
        if (!settingsCog.contains(e.target) && !settingsPanel.contains(e.target)) {
            settingsPanel.classList.remove('sq-open');
            settingsCog.classList.remove('sq-open');
        }
    });

    /* HUD folder collapse */
    document.getElementById('sfHudHdr').addEventListener('click', function () {
        document.getElementById('sfHud').classList.toggle('sq-open');
    });

    /* FPS / Ping toggles */
    var sqFpsChk  = document.getElementById('sqFpsChk');
    var sqPingChk = document.getElementById('sqPingChk');
    sqFpsChk.addEventListener('change',  function () { showFps  = sqFpsChk.checked;  if (_fpsStat)  _fpsStat.style.display  = showFps  ? '' : 'none'; });
    sqPingChk.addEventListener('change', function () { showPing = sqPingChk.checked; if (_pingStat) _pingStat.style.display = showPing ? '' : 'none'; });

    /* Developer folder collapse */
    document.getElementById('sfDevHdr').addEventListener('click', function () {
        document.getElementById('sfDev').classList.toggle('sq-open');
    });

    /* Lag Sim controls */
    var sqLagChk    = document.getElementById('sqLagChk');
    var sqLagLbl    = document.getElementById('sqLagLbl');
    var sqLagSlider = document.getElementById('sqLagSlider');
    var sqLagSub    = document.getElementById('sqLagSub');
    var sqLagVal    = document.getElementById('sqLagVal');
    sqLagChk.addEventListener('change', function () {
        _lagSimEnabled = sqLagChk.checked;
        sqLagSub.classList.toggle('sq-vis', sqLagChk.checked);
        sqLagLbl.textContent = sqLagChk.checked ? 'Lag Sim: ON' : 'Lag Sim: OFF';
    });
    sqLagSlider.addEventListener('input', function () {
        _lagSimMs = parseInt(sqLagSlider.value);
        sqLagVal.textContent = _lagSimMs + 'ms';
    });

    /* FPS Cap controls */
    var sqFpsCapChk    = document.getElementById('sqFpsCapChk');
    var sqFpsCapLbl    = document.getElementById('sqFpsCapLbl');
    var sqFpsCapSlider = document.getElementById('sqFpsCapSlider');
    var sqFpsCapSub    = document.getElementById('sqFpsCapSub');
    var sqFpsCapVal    = document.getElementById('sqFpsCapVal');
    sqFpsCapChk.addEventListener('change', function () {
        _fpsCapEnabled = sqFpsCapChk.checked;
        _fpsCapLastAt  = 0;
        sqFpsCapSub.classList.toggle('sq-vis', _fpsCapEnabled);
        sqFpsCapLbl.textContent = _fpsCapEnabled ? 'FPS Cap: ON' : 'FPS Cap: OFF';
    });
    sqFpsCapSlider.addEventListener('input', function () {
        _fpsCapTarget = parseInt(sqFpsCapSlider.value);
        sqFpsCapVal.textContent = _fpsCapTarget + ' fps';
    });

    /* Server Pos control */
    var sqSrvChk = document.getElementById('sqSrvChk');
    sqSrvChk.addEventListener('change', function () { showServerGhost = sqSrvChk.checked; });

    /* Mobile folder + joystick mode toggle */
    if (_isMobile) {
        document.getElementById('sfMobileHdr').addEventListener('click', function () {
            document.getElementById('sfMobile').classList.toggle('sq-open');
        });
        var sqJoyModeChk = document.getElementById('sqJoyModeChk');
        var sqJoyModeLbl = document.getElementById('sqJoyModeLbl');
        sqJoyModeChk.addEventListener('change', function () {
            _joyFreeMode = sqJoyModeChk.checked;
            sqJoyModeLbl.textContent = _joyFreeMode ? 'Joystick: Free' : 'Joystick: Stuck';
            /* Reset center to anchor when switching back to Stuck */
            if (!_joyFreeMode) {
                _joyCenterX = _joyDefaultX;
                _joyCenterY = _joyDefaultY;
                _joyKnobX   = _joyCenterX;
                _joyKnobY   = _joyCenterY;
            }
        });
    }

    /* Shim: latencyContainer.style.display still used at handshake + returnToHomePage */
    var latencyContainer = { style: {} };
    Object.defineProperty(latencyContainer.style, 'display', {
        set: function (v) {
            settingsCog.style.display = (v === 'none') ? 'none' : 'flex';
            if (v === 'none') {
                settingsPanel.classList.remove('sq-open');
                settingsCog.classList.remove('sq-open');
            }
        },
        get: function () { return settingsCog.style.display; }
    });

    function drawMessage(player, x, y) {
        /* Add Client MyPlayer Message */
        if (player.id == myPlayer.id) myPlayer.message = player.message;
        if (player.message) {
            ctx.save();
            ctx.font = "500 15px 'Exo 2', sans-serif";
            const textWidth = ctx.measureText(player.message).width;
            const textX = x - camera.x - textWidth / 2 + 25;
            const textY = y - camera.y - 32;
            /* chat bubble background */
            ctx.fillStyle = 'rgba(0,8,22,0.82)';
            ctx.strokeStyle = 'rgba(0,245,255,0.4)';
            ctx.lineWidth = 1.5;
            drawRoundedRect(ctx, textX - 8, textY - 16, textWidth + 16, 22, 4);
            ctx.fillStyle = '#e8f4f8';
            ctx.shadowBlur = 0;
            ctx.fillText(player.message, textX, textY);
            ctx.restore();
        };
    };

    function UserAlert(message) {
        /* Change later */
        alert(message);
    };

    /* Pre-render the entire static map (background + grid + walls) onto one
     * offscreen canvas.  Each frame becomes a single ctx.drawImage() call. */
    function buildMapLayer() {
        var W = mapSize.Width, H = mapSize.Height;
        mapLayerCanvas = document.createElement('canvas');
        mapLayerCanvas.width  = W;
        mapLayerCanvas.height = H;
        var mc = mapLayerCanvas.getContext('2d');
        mc.imageSmoothingEnabled = true;

        /* base gradient */
        var grad = mc.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0,   '#060e1c');
        grad.addColorStop(0.5, '#09152a');
        grad.addColorStop(1,   '#060e1c');
        mc.fillStyle = grad;
        mc.fillRect(0, 0, W, H);

        /* grid — single batched path */
        mc.strokeStyle = 'rgba(0,245,255,0.045)';
        mc.lineWidth = 1;
        mc.beginPath();
        for (var gx = 0; gx <= W; gx += 100) { mc.moveTo(gx, 0); mc.lineTo(gx, H); }
        for (var gy = 0; gy <= H; gy += 100) { mc.moveTo(0, gy); mc.lineTo(W, gy); }
        mc.stroke();

        /* map border */
        mc.strokeStyle = SQ.C.purple;
        mc.lineWidth   = 4;
        mc.shadowColor = SQ.C.purple;
        mc.shadowBlur  = 14;
        mc.strokeRect(2, 2, W - 4, H - 4);
        mc.shadowBlur  = 0;

        /* walls rendered once into the static map texture using cached wall sprites */
        for (var i = 0; i < objectPositions.length; i++) {
            var obj = objectPositions[i];
            SQ.drawWall(mc, obj[0], obj[1], obj[2], obj[3]);
        }
    };

    function loadMenu() {
        /* Main Menu Element — uses CSS classes from index.html */
        const menuContainer = document.createElement('div');
        menuContainer.id = 'menuContainer';

        /* logo */
        const gameTitle = document.createElement('div');
        gameTitle.className = 'sq-logo';
        gameTitle.innerHTML = 'SQUARIX<span>.IO</span>';
        const tagline = document.createElement('div');
        tagline.className = 'sq-tagline';
        tagline.textContent = 'BATTLE · COLLECT · DOMINATE';

        /* card */
        const card = document.createElement('div');
        card.className = 'sq-card';

        /* name input */
        const nameLabel = document.createElement('div');
        nameLabel.className = 'sq-label';
        nameLabel.textContent = 'Player Name';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'nameInput';
        nameInput.className = 'sq-input';
        nameInput.placeholder = 'Enter name...';
        nameInput.maxLength = 24;

        /* server dropdown */
        const serverLabel = document.createElement('div');
        serverLabel.className = 'sq-label';
        serverLabel.textContent = 'Server';
        const serverDropdown = document.createElement('select');
        serverDropdown.id = 'serverDropdown';
        serverDropdown.className = 'sq-select';
        const selectWrap = document.createElement('div');
        selectWrap.className = 'sq-select-wrap';
        selectWrap.appendChild(serverDropdown);

        /* Create all servers */
        let Servers;
        fetch('http://' + location.hostname + ':8001/gamemodes')
            .then(response => response.json())
            .then(data => {
                Servers = data.ExportGameData;
                for (let index in Servers) {
                    const Server = Servers[index];
                    const serverOption = document.createElement('option');
                    serverOption.textContent = Server.Name + '  ·  ' + Server.PlayerCount + ' players  ·  ' + Server.tps + ' TPS';
                    serverOption.value = Server.GameServerID;
                    serverDropdown.appendChild(serverOption);
                };
            })
            .catch(error => {
                console.error('Error fetching gamemodes:', error);
            });

        /* play button */
        const playButton = document.createElement('button');
        playButton.id = 'playButton';
        playButton.className = 'sq-btn-play';
        playButton.innerHTML = '<span>▶  PLAY</span>';

        card.appendChild(nameLabel);
        card.appendChild(nameInput);
        card.appendChild(serverLabel);
        card.appendChild(selectWrap);
        card.appendChild(playButton);

        menuContainer.appendChild(gameTitle);
        menuContainer.appendChild(tagline);
        menuContainer.appendChild(card);

        playButton.addEventListener('click', () => {
            const playerName = nameInput.value.trim();
            let WebSocketPort;
            for (let index in Servers) {
                const Server = Servers[index];
                if (Server.GameServerID === Number(serverDropdown.value)) {
                    WebSocketPort = Server.port;
                };
            };
            webSocket = new WebSocket('ws://' + location.hostname + ':' + WebSocketPort);
            webSocket.binaryType = 'arraybuffer';
            /* Open Event Listener */
            webSocket.addEventListener('open', (event) => {
                if (event.isTrusted) {
                    /* Close Event Listener */
                    webSocket.addEventListener('close', (event) => {
                        if (event.isTrusted) {
                            console.log('WebSocket Closed', event.code)
                        };
                    });
                    /* Message Event Listener */
                    webSocket.addEventListener('message', (event) => {
                        if (event.isTrusted) {
                            function processMessage() {
                            var d = event.data;
                            /* Binary prod frames: [flags:u8]
                             * bit0 reconcile [x:f32LE][y:f32LE][ack:u32LE]
                             * bit1 score     [score:u32LE][level:u8]
                             * bit2 leaderboard [len:u16LE][payload]
                             * bit3 entities  [entity diff bytes to end of frame] */
                            if (d instanceof ArrayBuffer) {
                                if (d.byteLength <= 0) return;
                                /* 1-byte 0x02 = pong response to our ping */
                                if (d.byteLength === 1 && new DataView(d).getUint8(0) === 2) {
                                    if (_pingSentAt > 0) {
                                        _pingRtt = Math.round(performance.now() - _pingSentAt);
                                        _pingSentAt = 0;
                                        _currentLat = _pingRtt;
                                    }
                                    return;
                                }
                                var dv = new DataView(d);
                                var flags = dv.getUint8(0);
                                var off = 1;
                                if (flags & 1) {
                                    if (off + 12 > d.byteLength) return;
                                    _reconcileToServer(dv.getFloat32(off, true), dv.getFloat32(off + 4, true), dv.getUint32(off + 8, true));
                                    off += 12;
                                }
                                if (flags & 2) {
                                    if (off + 5 > d.byteLength) return;
                                    var playerScore = dv.getUint32(off, true);
                                    var playerLevel = dv.getUint8(off + 4);
                                    if (!_hudScoreEl) _hudScoreEl = document.getElementById('hudScoreVal');
                                    if (!_hudLevelEl) _hudLevelEl = document.getElementById('hudLevelVal');
                                    if (_hudScoreEl) _hudScoreEl.textContent = playerScore;
                                    if (_hudLevelEl) _hudLevelEl.textContent = String(playerLevel).padStart(2, '0');
                                    off += 5;
                                }
                                if (flags & 4) {
                                    if (off + 2 > d.byteLength) return;
                                    var lbLen = dv.getUint16(off, true); off += 2;
                                    if (off + lbLen > d.byteLength) return;
                                    var lbOff = off;
                                    var count = dv.getUint8(lbOff); lbOff++;
                                    var lb = [];
                                    for (var i = 0; i < count; i++) {
                                        var score = dv.getUint16(lbOff, true); lbOff += 2;
                                        var rank = dv.getUint8(lbOff); lbOff++;
                                        var nlen = dv.getUint8(lbOff); lbOff++;
                                        var name = _td.decode(new Uint8Array(d, lbOff, nlen)); lbOff += nlen;
                                        lb.push([score, rank, name]);
                                    }
                                    globalLeaderboard = lb;
                                    off += lbLen;
                                }
                                if ((flags & 8) && off < d.byteLength) {
                                    processEntityBinary(d.slice(off));
                                }
                                return;
                            }
                            /* Text frames: JSON */
                            var Message = JSON.parse(d);
                            /* Dev-mode per-tick combined packet */
                            if (Message.type === 'tick') {
                                if (Message.updates) processEntityDev(Message.updates);
                                if (Message.reconcile) _reconcileToServer(Message.reconcile.x, Message.reconcile.y, Message.reconcile.ackSeq);
                                if (Message.score) {
                                    if (!_hudScoreEl) _hudScoreEl = document.getElementById('hudScoreVal');
                                    if (!_hudLevelEl) _hudLevelEl = document.getElementById('hudLevelVal');
                                    if (_hudScoreEl) _hudScoreEl.textContent = Message.score.score;
                                    if (_hudLevelEl) _hudLevelEl.textContent = String(Message.score.level).padStart(2, '0');
                                }
                                if (Message.leaderboard) {
                                    globalLeaderboard = Message.leaderboard.map(function(e) { return [e.score, e.rank, e.name]; });
                                }
                                return;
                            }
                            if (Message.type === 'ping') {
                                if (_pingSentAt > 0) {
                                    _pingRtt = Math.round(performance.now() - _pingSentAt);
                                    _pingSentAt = 0;
                                    _currentLat = _pingRtt;
                                }
                                return;
                            }
                            /* Handshake / death (legacy JSON arrays) */
                                switch (Message[0]) {
                                    case 0: /* Handshake */
                                        /* Reset Variables */
                                        filteredCameraObjects = [];
                                        userInfo.playingGame = true;
                                        userInfo.startMovementUpdate = true;
                                        latencyContainer.style.display = 'flex';
                                        /* Start 5-second ping/pong RTT loop */
                                        if (_pingTimer) clearInterval(_pingTimer);
                                        sendPingPacket();
                                        _pingTimer = setInterval(sendPingPacket, 5000);
                                        myPlayer.name = Message[1];
                                        myPlayer.x = Message[2];
                                        myPlayer.y = Message[3];
                                        mapSize.Width = Message[4][0];
                                        mapSize.Height = Message[4][1];
                                        objectPositions = decompressMap(Message[4][2]);
                                        buildMapLayer();
                                        /* World-space orb canvas — starts blank; orbs painted as packets arrive */
                                        _orbWorldCanvas = document.createElement('canvas');
                                        _orbWorldCanvas.width  = mapSize.Width;
                                        _orbWorldCanvas.height = mapSize.Height;
                                        _orbWorldCtx = _orbWorldCanvas.getContext('2d');
                                        _orbWorldCtx.imageSmoothingEnabled = false;
                                        myPlayer.id = Message[5];
                                        myPlayer.speed = Message[6];
                                        /* Server TPS from handshake (index 9) — used to normalise
                                         * local prediction rate and tickStep to match the server.
                                         * logical speed × (60 / serverTPS) = pixels per tick,
                                         * giving the same pixels/second at any TPS (30 TPS baseline). */
                                        NETWORK_TPS = Message[9] || 30;
                                        /* Create the LeaderBoard */
                                        globalLeaderboard = Message[7];
                                        _packetMode = Message[8] || 'prod';
                                        _nextInputSeq = 0;
                                        _lastServerAckSeq = 0;
                                        _pendingInputs = [];
                                        _localVisualOffsetX = 0;
                                        myPlayer.renderX = myPlayer.x;
                                        myPlayer.renderY = myPlayer.y;
                                        myPlayer.renderVelX = 0;
                                        myPlayer.renderVelY = 0;
                                        myPlayer.animVx = 0;
                                        myPlayer.animVy = 0;
                                        _localVisualOffsetY = 0;
                                        if (globalPlayers[myPlayer.id]) {
                                            globalPlayers[myPlayer.id].ghostRenderX = globalPlayers[myPlayer.id].x;
                                            globalPlayers[myPlayer.id].ghostRenderY = globalPlayers[myPlayer.id].y;
                                            globalPlayers[myPlayer.id].ghostVelX = 0;
                                            globalPlayers[myPlayer.id].ghostVelY = 0;
                                            globalPlayers[myPlayer.id].ghostAnimVx = 0;
                                            globalPlayers[myPlayer.id].ghostAnimVy = 0;
                                        }
                                        /* Single Use Functions */
                                        activateListeners();
                                        break;
                                    case 1: /* Messages */
                                        UserAlert(Message[1]);
                                        returnToHomePage();
                                        break;
                                };
                            } /* end processMessage */
                            var rlat = getSimLatency();
                            if (rlat > 0) {
                                setTimeout(processMessage, rlat);
                            } else {
                                processMessage();
                            }
                        };
                    });
                };
            });

            webSocket.onopen = function () {
                spawnPacket(playerName);
                menuContainer.remove();
                var gridBg = document.querySelector('.sq-grid-bg');
                if (gridBg) gridBg.style.display = 'none';
                var hudEl = document.getElementById('hud');
                if (hudEl) hudEl.classList.add('active');
            };
        });

        (document.getElementById('uiLayer') || document.body).appendChild(menuContainer);
    };

    function returnToHomePage() {
        latencyContainer.style.display = 'none';
        var hudEl = document.getElementById('hud');
        if (hudEl) hudEl.classList.remove('active');
        var gridBg = document.querySelector('.sq-grid-bg');
        if (gridBg) gridBg.style.display = '';
        /* reset per-session caches */
        mapLayerCanvas = null;
        _lbOff = null; _lbLastJson = '';
        _orbWorldCanvas = null; _orbWorldCtx = null;
        userInfo = {
            playingGame: false,
            startMovementUpdate: false,
        };
        _pendingInputs = [];
        _nextInputSeq = 0;
        _lastServerAckSeq = 0;
        _awaitingTabResync = false;
        _localVisualOffsetX = 0;
        _localVisualOffsetY = 0;
        if (networkInterval) clearInterval(networkInterval);
        networkInterval = null;
        /* Stop ping loop */
        if (_pingTimer) { clearInterval(_pingTimer); _pingTimer = null; }
        _pingSentAt = 0; _pingRtt = 0; _currentLat = 0;
        myPlayer.ghostRenderX = null;
        myPlayer.ghostRenderY = null;
        myPlayer.renderX = null;
        myPlayer.renderY = null;
        myPlayer.renderVelX = 0;
        myPlayer.renderVelY = 0;
        myPlayer.animVx = 0;
        myPlayer.animVy = 0;
        loadMenu();
    };

    loadMenu();

});