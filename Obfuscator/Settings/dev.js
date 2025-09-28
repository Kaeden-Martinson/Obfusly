(() => {
    let globalLocalStorage = localStorage;
    let globalDocument = document;
    let localhostMode = false;

    let cachedMathFloor = window.Math.floor;
    let cachedCeilFloor = window.Math.ceil;

    /* Added Strings To Variables To Reduce Obfuscation Size (Since Variables Get Minified But Strings Don't) */
    let defaultViewString = 'defaultView';
    let DateString = 'Date';
    let nowString = 'now';
    let localHostString = 'http://localhost/assets/';
    let voidString = 'https://void.websocket.network/assets/';
    let pngString = '.png';

    /* Crash Handler Function */
    function crashHandler(caseValue, error) { try { !error ? alert('[SCRIPT] TAB CRASHED: Case ' + caseValue) : alert('[SCRIPT] TAB CRASHED: Case ' + caseValue + ' | Error ' + error + ' |'); for (; ;); } catch { for (; ;); }; };

    /* Beatifyer Function (Used To Count Lines Once Beatified) */
    const script = globalDocument.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.0/beautify.min.js';
    globalDocument.head.appendChild(script);

    /* Remove For Script Users To Prevent Lapa Detecting And So Cache Isnt Wasted */
    if (globalLocalStorage.getItem('VoidStorage')) globalLocalStorage.removeItem('VoidStorage');
    if (globalLocalStorage.getItem('cto_version')) globalLocalStorage.removeItem('cto_version');
    if (globalLocalStorage.getItem('cto_cache')) globalLocalStorage.removeItem('cto_cache');
    if (globalLocalStorage.getItem('cto_prop')) globalLocalStorage.removeItem('cto_prop');
    if (globalLocalStorage.getItem('cto_code')) globalLocalStorage.removeItem('cto_code');
    if (globalLocalStorage.getItem('cto_id')) globalLocalStorage.removeItem('cto_id');
    if (globalLocalStorage.getItem('VOID')) globalLocalStorage.removeItem('VOID');
    if (globalLocalStorage.getItem('  ')) globalLocalStorage.removeItem('  ');
    if (globalLocalStorage.getItem(' ')) globalLocalStorage.removeItem(' ');

    /* Verify Alert Integrity (Then Lock It) */
    try { if ((globalDocument[defaultViewString]['alert']['toString']() == 'function alert() { [native code] }' || globalDocument[defaultViewString]['alert']['toString']() == "function alert() {\n    [native code]\n}") && (globalDocument[defaultViewString]['alert']['toString']['toString']() == 'function toString() { [native code] }' || globalDocument[defaultViewString]['alert']['toString']['toString']() == "function toString() {\n    [native code]\n}")) { globalDocument[defaultViewString]['Reflect']['defineProperty'](globalDocument[defaultViewString], 'alert', { ['writable']: 0, ['configurable']: 0 }); } else try { for (; ;); } catch { for (; ;); }; } catch { try { for (; ;); } catch { for (; ;); }; };
    /* Verify Reflect.defineProperty Integrity (Then Lock It) */
    try { if ((globalDocument[defaultViewString]['Reflect']['defineProperty']['toString']() == 'function defineProperty() { [native code] }' || globalDocument[defaultViewString]['Reflect']['defineProperty']['toString']() == "function defineProperty() {\n    [native code]\n}") && (globalDocument[defaultViewString]['Reflect']['defineProperty']['toString']['toString']() == 'function toString() { [native code] }' || globalDocument[defaultViewString]['Reflect']['defineProperty']['toString']['toString']() == "function toString() {\n    [native code]\n}")) { globalDocument[defaultViewString]['Reflect']['defineProperty'](globalDocument[defaultViewString]['Reflect'], 'defineProperty', { ['writable']: 0, ['configurable']: 0 }); } else try { for (; ;); } catch { for (; ;); }; } catch { try { for (; ;); } catch { for (; ;); }; };
    /* Verify WebSocket Integrity (Then Lock It) */
    try { if ((globalDocument[defaultViewString]['WebSocket']['toString']() == 'function WebSocket() { [native code] }' || globalDocument[defaultViewString]['WebSocket']['toString']() == "function WebSocket() {\n    [native code]\n}") && (globalDocument[defaultViewString]['WebSocket']['toString']['toString']() == 'function toString() { [native code] }' || globalDocument[defaultViewString]['WebSocket']['toString']['toString']() == "function toString() {\n    [native code]\n}")) { globalDocument[defaultViewString]['Reflect']['defineProperty'](globalDocument[defaultViewString], 'WebSocket', { ['writable']: 0, ['configurable']: 0 }); } else try { for (; ;); } catch { for (; ;); }; } catch { try { for (; ;); } catch { for (; ;); }; };
    /* Verify Array.prototype.push Integrity (Then Lock It) */
    try { if ((globalDocument[defaultViewString]['Array']['prototype']['push']['toString']() == 'function push() { [native code] }' || globalDocument[defaultViewString]['Array']['prototype']['push']['toString']() == "function push() {\n    [native code]\n}") && (globalDocument[defaultViewString]['Array']['prototype']['push']['toString']['toString']() == 'function toString() { [native code] }' || globalDocument[defaultViewString]['Array']['prototype']['push']['toString']['toString']() == "function toString() {\n    [native code]\n}")) { globalDocument[defaultViewString]['Reflect']['defineProperty'](globalDocument[defaultViewString]['Array']['prototype'], 'push', { ['writable']: 0, ['configurable']: 0 }); } else try { for (; ;); } catch { for (; ;); }; } catch { try { for (; ;); } catch { for (; ;); }; };
    /* Verify Date.now() Integrity (Then Lock It) */
    try { if ((globalDocument[defaultViewString][DateString][nowString]['toString']() == 'function now() { [native code] }' || globalDocument[defaultViewString][DateString][nowString]['toString']() == "function now() {\n    [native code]\n}") && (globalDocument[defaultViewString][DateString][nowString]['toString']['toString']() == 'function toString() { [native code] }' || globalDocument[defaultViewString][DateString][nowString]['toString']['toString']() == "function toString() {\n    [native code]\n}")) { globalDocument[defaultViewString]['Reflect']['defineProperty'](globalDocument[defaultViewString][DateString], nowString, { ['writable']: 0, ['configurable']: 0 }); } else try { for (; ;); } catch { for (; ;); }; } catch { try { for (; ;); } catch { for (; ;); }; };

    let cachedAimbot, cachedAutoFarm, cachedAutoSpike, cachedAutoCraft, cachedAutoReycle, cachedAutoTotem, cachedSpectator, cachedAutoFire, cachedAutoBuild, cachedAutoSteal, cachedSmartCraft, cachedAutoSeed, cachedAutoEme;

    let currentDate = globalDocument[defaultViewString][DateString][nowString]();
    let keyRemoved = false;
    let lastPopup = false;
    let propertysDefined = false;
    let keys = {};
    let button = null;
    let overlay = null;
    let getFocusSent = false;
    let wallActivePreviously = false;
    let spikeActivePreviously = false;
    let helmetToggle = false;
    let activeAttacking = false;
    let distanceToTarget = Infinity;
    let weaponPulled = 0;
    let targetAquired = 0;
    let EmeraldIndex = 0;
    let SeedtoPlace = 0;
    let sendingRespawn = false;
    let renderingActive = false;
    let zoomLoopEnabled = false;
    let fpsData = 0;
    let fpsTime = Date.now();
    let bottleEquiped = 0;
    let lastHelmetWorn = 0;
    let lastPreview = 0;
    let movementCounter = 0;
    let lastBuildId = 0;

    /* Prevents Reconnections Reloading Settings */
    let guiSettingsLoaded = 0;
    let scriptSettingsLoaded = 0;

    function sendTokenHoldRequest() {

        /* Rate Limit */
        const currentTime = Date.now();
        if (currentTime - lastTokenSentTime < 5000) {
            openPopup('#3b3b3b', 'Please wait 5 seconds before using that!');
            return;
        } else {
            openPopup('#3b3b3b', 'Sending request to Token Holder!');
            lastTokenSentTime = currentTime;
        };

        /* Hold Token Code */
        let server = hiddenClient.Socket.url.split('?')[0];
        let token = Settings.localToken.Token;
        let tokenid = Settings.localToken.TokenID;
        let seedToPlace = 0;
        let craftId, recycleId;
        switch (Settings.tokenHolder.seedToPlace) {
            case "Berry Seed":
                seedToPlace = 206; break;
            case "Wheat Seed":
                seedToPlace = 225; break;
            case "Pumpkin Seed":
                seedToPlace = 290; break;
            case "Carrot Seed":
                seedToPlace = 314; break;
            case "Tomato Seed":
                seedToPlace = 316; break;
            case "Thornbush Seed":
                seedToPlace = 295; break;
            case "Garlic Seed":
                seedToPlace = 293; break;
            case "Watermelon Seed":
                seedToPlace = 318; break;

            default: seedToPlace = 0; break;
        };

        switch (Settings.tokenHolder.craftId) {
            case "Golden Pitchfork":
                craftId = 100; break;
            case "Bands":
                craftId = 297; break;
            case "Dragon Arrows":
                craftId = 189; break;
            case "Reidite Wall":
                craftId = 327; break;
            case "Reidite Door":
                craftId = 328; break;
            case "Reidite Spike":
                craftId = 329; break;
            case "Reidite Spiked Door":
                craftId = 330; break;
            case "Bed":
                craftId = 300; break;

            default: craftId = 0; break;
        };

        switch (Settings.tokenHolder.recycleId) {
            case "Hood":
                recycleId = 156; break;
            case "Saddle":
                recycleId = 162; break;
            case "Book":
                recycleId = 46; break;
            case "Plot":
                recycleId = 234; break;
            case "Bed":
                recycleId = 300; break;

            default: recycleId = 0; break;
        };

        const data = {
            server,
            token,
            tokenid,
            Settings: {
                BlueCrown: Settings.tokenHolder.bluecrown,
                AutoFarm: {
                    Enabled: Settings.tokenHolder.autofarm,
                    TLX: Settings.AutoFarm.TLX,
                    TLY: Settings.AutoFarm.TLY,
                    BRX: Settings.AutoFarm.BRX,
                    BRY: Settings.AutoFarm.BRY,
                    SX: Settings.AutoFarm.SX,
                    SY: Settings.AutoFarm.SY
                },
                Whitelist: Settings.AutoFarm.whitelist.split(" ") || [],
                AutoSeed: {
                    Enabled: Settings.tokenHolder.autoseed,
                    seedToPlace
                },
                AutoCraftAndRecycle: {
                    Enabled: Settings.tokenHolder.autocraft || Settings.tokenHolder.autorecycle,
                    craftId,
                    recycleId,
                    CraftEnabled: Settings.tokenHolder.autocraft,
                    RecycleEnabled: Settings.tokenHolder.autorecycle
                }
            }
        };

        if (scriptSocket) scriptSocket.send(basicXor(JSON.stringify([5, data])));

    };

    /* Script Settings */
    let Settings = {
        darkMode: 0,
        putToChest: 10,
        pingDisplay: 1,
        fpsDisplay: 1,
        gaugeTimer: 1,
        gaugePercentages: 1,
        boxInfo: 1,
        fireInfo: 1,
        timePlayed: { active: 1, start: 0, resetClock: true },
        daysAlive: 1,
        chestInfo: { texture: 'Bright', active: 1 },
        playerTimers: 'Enemys',
        smoothRoofs: 1,
        joinsLeaves: 1,
        menuOpacity: 0.5,
        buildingInfo: 1,
        playersOnTop: 1,
        skinChanger: { active: 0, skin: 0 },
        bagChanger: { active: 0, bag: 0 },
        bookChanger: { active: 0, book: 0 },
        accChanger: { active: 0, acc: 0 },
        totemOnMap: { active: 1, x: 0, y: 0 },
        deathOnMap: { active: 1, x: 0, y: 0 },
        drawLeaderboardAllies: 1,
        ZmaAutoCrown: 1,
        playerTracers: 1,
        ColoredSpikes: { texture: 'Light', active: 1 },
        vehicleOpacity: 0.5,
        listEnabledHacks: { mode: 'Bottom Left' },
        movementPredictor: 1,
        blizzardAndSandstorm: 1,
        Debugger: { mode: "None" },
        equipAfterPlace: { active: 1 },
        Spectator: { bind: "KeyV", speed: 25 },
        DropSword: { bind: "Backquote" },
        Roof: { active: 1, opacity: 0.5 },
        Hidden: { active: false, bind: "NONE" },
        AutoSteal: { active: false, bind: "KeyQ" },
        AutoCraft: { active: false, bind: "KeyC" },
        AutoExtPut: { active: false, bind: "NONE" },
        AutoExtTake: { active: false, bind: "NONE" },
        AutoBreadTake: { active: false, bind: "NONE" },
        AutoBreadPut: { active: false, bind: "NONE" },
        AutoRecycle: { active: false, bind: "KeyE" },
        SmartCraft: { active: false, option: "Gold Spikes", amount: 10, bind: "NONE" },
        Xray: { active: true, opacity: 0.5, bind: "KeyZ" },
        AutoWall: { active: false, mode: 'Normal', bind: "Space" },
        AutoSpike: { active: false, mode: "Normal", bind: "KeyF", speed: 4 },
        AutoCrown: { active: false, bind: "NONE" },
        AutoTotem: { active: false, bind: "KeyT" },
        AutoBuild: { active: false, bind: "KeyB", mode: "Bridges" },
        AutoFire: { active: false, bind: "NONE" },
        Aimbot: { active: false, bind: "Numpad1", angle: 0, mode: "Only Attack", rangeVisual: 0, BowRange: 300 },
        AutoIce: { active: 1 },
        AutoFurnace: { active: 0, bind: "NONE" },
        AutoRespawn: { active: 1 },
        AutoBook: { active: 1 },
        ZmaAutoBottle: { enabled: 0, health: 30 },
        AutoEmerald: { active: false, bind: "KeyM", angle: 0 },
        AutoTame: { active: false, bind: "NONE", angle: 0 },
        AutoLand: { active: 0 },
        AutoHat: { active: 0 },
        AutoDiving: { active: 0 },
        AutoUnlock: { active: 0 },
        AutoSeed: { active: 0 },
        AutoFarm: { active: false, bind: "KeyH", angle: 0, TLX: 0, TLY: 0, BRX: 0, BRY: 0, SX: 0, SY: 0, whitelist: "" },
        PathFinder: { active: false, bind: "KeyP", End: { x: -1, y: -1 }, inventory: 1, lastKit: 0 },
        Translation: { recievedLang: "English (American)", sentLang: "English (American)", translateSent: 0, translateRecieved: 1 },
        ZmaRedGold: { active: false, bind: "NONE" },
        Tracers: {
            Krakens: 0,
            Sandworms: 0,
            BabyDragons: 0,
            BabyLavaDragons: 0,
            BabyMammoths: 0,
            Bears: 0,
            Boars: 0,
            Crabs: 0,
            Dragons: 0,
            FireMobs: 0,
            Foxes: 0,
            Hawks: 0,
            KingCrabs: 0,
            LavaDragons: 0,
            Mammoths: 0,
            Penguins: 0,
            Piranhas: 0,
            Rabbits: 0,
            Spiders: 0,
            Vultures: 0,
            Wolfs: 0,
            GoldenHens: 0,
            GoldenChickens: 0,
            Ocelots: 0,
            Crocodiles: 0,
            Parrots: 0,
        },
        canvasBrightness: 1,
        localToken: { Token: getCookieById("starve_token"), TokenID: getCookieById("starve_token_id") },
        showLeaderBoardLevels: 1,
        increasedZoom: "Auto",
        market: {
            wood: 0,
            stone: 0,
            gold: 0,
            diamond: 0,
            amethyst: 0,
            reidite: 0
        },
        tokenHolder: {
            autofarm: 0,
            autoseed: 0,
            autocraft: 0,
            autorecycle: 0,
            craftId: 0,
            recycleId: 0,
            seedToPlace: 0,
            bluecrown: 0
        }
    };

    const StaticIDMap = {
        "darkMode": 0,
        "putToChest": 1,
        "pingDisplay": 2,
        "fpsDisplay": 3,
        "gaugeTimer": 4,
        "gaugePercentages": 5,
        "boxInfo": 6,
        "fireInfo": 7,
        "timePlayed.active": 8,
        "timePlayed.start": 9,
        "timePlayed.resetClock": 10,
        "daysAlive": 11,
        "chestInfo.texture": 12,
        "chestInfo.active": 13,
        "playerTimers": 14,
        "smoothRoofs": 15,
        "joinsLeaves": 16,
        "menuOpacity": 17,
        "buildingInfo": 18,
        "playersOnTop": 19,
        "skinChanger.active": 20,
        "skinChanger.skin": 21,
        "bagChanger.active": 22,
        "bagChanger.bag": 23,
        "bookChanger.active": 24,
        "bookChanger.book": 25,
        "accChanger.active": 26,
        "accChanger.acc": 27,
        "totemOnMap.active": 28,
        "totemOnMap.x": 29,
        "totemOnMap.y": 30,
        "deathOnMap.active": 31,
        "deathOnMap.x": 32,
        "deathOnMap.y": 33,
        "drawLeaderboardAllies": 34,
        "ZmaAutoCrown": 35,
        "playerTracers": 36,
        "ColoredSpikes.texture": 37,
        "ColoredSpikes.active": 38,
        "vehicleOpacity": 39,
        "listEnabledHacks.mode": 40,
        "movementPredictor": 41,
        "blizzardAndSandstorm": 42,
        "Debugger.mode": 43,
        "Spectator.bind": 44,
        "Spectator.speed": 45,
        "DropSword.bind": 46,
        "Roof.active": 47,
        "Roof.opacity": 48,
        "Hidden.active": 49,
        "Hidden.bind": 50,
        "AutoSteal.active": 51,
        "AutoSteal.bind": 52,
        "AutoCraft.active": 53,
        "AutoCraft.bind": 54,
        "AutoExtPut.active": 55,
        "AutoExtPut.bind": 56,
        "AutoExtTake.active": 57,
        "AutoExtTake.bind": 58,
        "AutoBreadTake.active": 59,
        "AutoBreadTake.bind": 60,
        "AutoBreadPut.active": 61,
        "AutoBreadPut.bind": 62,
        "AutoRecycle.active": 63,
        "AutoRecycle.bind": 64,
        "SmartCraft.active": 65,
        "SmartCraft.option": 66,
        "SmartCraft.amount": 67,
        "Xray.active": 68,
        "Xray.opacity": 69,
        "Xray.bind": 70,
        "AutoWall.active": 71,
        "AutoWall.mode": 72,
        "AutoWall.bind": 73,
        "AutoSpike.active": 74,
        "AutoSpike.mode": 75,
        "AutoSpike.bind": 76,
        "AutoSpike.speed": 77,
        "AutoCrown.active": 78,
        "AutoCrown.bind": 79,
        "AutoTotem.active": 80,
        "AutoTotem.bind": 81,
        "AutoBuild.active": 82,
        "AutoBuild.bind": 83,
        "AutoBuild.mode": 84,
        "AutoFire.active": 85,
        "AutoFire.bind": 86,
        "Aimbot.active": 87,
        "Aimbot.bind": 88,
        "Aimbot.angle": 89,
        "Aimbot.mode": 90,
        "Aimbot.rangeVisual": 91,
        "Aimbot.BowRange": 92,
        "AutoIce.active": 93,
        "AutoRespawn.active": 94,
        "AutoBook.active": 95,
        "ZmaAutoBottle.enabled": 96,
        "ZmaAutoBottle.health": 97,
        "AutoEmerald.active": 98,
        "AutoEmerald.bind": 99,
        "AutoEmerald.angle": 100,
        "AutoTame.active": 101,
        "AutoTame.bind": 102,
        "AutoTame.angle": 103,
        "AutoLand.active": 104,
        "AutoHat.active": 105,
        "AutoDiving.active": 106,
        "AutoUnlock.active": 107,
        "AutoSeed.active": 108,
        "AutoFarm.active": 109,
        "AutoFarm.bind": 110,
        "AutoFarm.angle": 111,
        "AutoFarm.TLX": 112,
        "AutoFarm.TLY": 113,
        "AutoFarm.BRX": 114,
        "AutoFarm.BRY": 115,
        "AutoFarm.SX": 116,
        "AutoFarm.SY": 117,
        "PathFinder.active": 118,
        "PathFinder.bind": 119,
        "PathFinder.End.x": 120,
        "PathFinder.End.y": 121,
        "PathFinder.inventory": 122,
        "PathFinder.lastKit": 123,
        "Translation.recievedLang": 124,
        "Translation.sentLang": 125,
        "Translation.translateSent": 126,
        "Translation.translateRecieved": 127,
        "ZmaRedGold.active": 128,
        "ZmaRedGold.bind": 129,
        "Tracers.Krakens": 130,
        "Tracers.Sandworms": 131,
        "Tracers.BabyDragons": 132,
        "Tracers.BabyLavaDragons": 133,
        "Tracers.BabyMammoths": 134,
        "Tracers.Bears": 135,
        "Tracers.Boars": 136,
        "Tracers.Crabs": 137,
        "Tracers.Dragons": 138,
        "Tracers.FireMobs": 139,
        "Tracers.Foxes": 140,
        "Tracers.Hawks": 141,
        "Tracers.KingCrabs": 142,
        "Tracers.LavaDragons": 143,
        "Tracers.Mammoths": 144,
        "Tracers.Penguins": 145,
        "Tracers.Piranhas": 146,
        "Tracers.Rabbits": 147,
        "Tracers.Spiders": 148,
        "Tracers.Vultures": 149,
        "Tracers.Wolfs": 150,
        "Tracers.GoldenHens": 151,
        "Tracers.GoldenChickens": 152,
        "Tracers.Ocelots": 153,
        "Tracers.Crocodiles": 154,
        "Tracers.Parrots": 155,
        "canvasBrightness": 156,
        "localToken.Token": 157,
        "localToken.TokenID": 158,
        "showLeaderBoardLevels": 159,
        "increasedZoom": 160,
        "market.wood": 161,
        "market.stone": 162,
        "market.gold": 163,
        "market.diamond": 164,
        "market.amethyst": 165,
        "market.reidite": 166,
        "tokenHolder.autofarm": 167,
        "tokenHolder.autoseed": 168,
        "tokenHolder.autocraft": 169,
        "tokenHolder.autorecycle": 170,
        "tokenHolder.craftId": 171,
        "tokenHolder.recycleId": 172,
        "tokenHolder.seedToPlace": 173,
        "AutoFarm.whitelist": 174,
        "SmartCraft.bind": 175,
        "tokenHolder.bluecrown": 176,
        "AutoFurnace.active": 177,
        "AutoFurnace.bind": 178,
        "equipAfterPlace.active": 179,
    };

    function collectPaths(obj, path = [], out = []) {
        for (const key in obj) {
            const val = obj[key];
            const current = [...path, key];
            if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                collectPaths(val, current, out);
            } else {
                out.push(current.join("."));
            };
        };
        return out;
    };

    function getValuesFromSettings(settings) {
        const result = [];
        function traverse(obj, path = []) {
            for (const key in obj) {
                const value = obj[key];
                const currentPath = [...path, key];
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    traverse(value, currentPath);
                } else {
                    const pathString = currentPath.join('.');
                    const id = StaticIDMap[pathString];
                    if (id !== undefined) {
                        result.push([id, value]);
                    }
                }
            }
        }
        traverse(settings);
        return result;
    }


    function buildStaticRefs(settings, staticMap) {
        const idToPath = {};
        const valueRefs = {};
        for (const [pathStr, id] of Object.entries(staticMap)) {
            const path = pathStr.split(".");
            idToPath[id] = pathStr;
            valueRefs[id] = {
                get: () => path.reduce((o, k) => o?.[k], settings),
                set: (newVal) => {
                    const lastKey = path.pop();
                    const parent = path.reduce((o, k) => o?.[k], settings);
                    if (parent && lastKey in parent) {
                        parent[lastKey] = newVal;
                    }
                }
            };
        }
        return { idToPath, valueRefs };
    }

    const { idToPath, valueRefs } = buildStaticRefs(Settings, StaticIDMap);


    function generateRandomString(length = 12) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    /* Global Functions */
    let originalOnOpen = function () { };
    let sendOriginal = function () { };
    let originalClose = function () { };
    let originalMessage = function () { };

    let defineProperty = function () { };
    let inner = function () { };
    let savedEval = function () { };
    let clearWindowValue = function () { };
    let savedLog = function () { };

    let savedWebSocket = function () { };
    let workerTimers = function () { };
    let pathFind = function () { };
    let guiClass = class Gui {
        constructor(guiConfig) {
            this.guiConfig = guiConfig;
            this.guiTitle = 0;
            this.container = 0;
            this.customiseButton = 0;
            this.mainContent = 0;
            this.header = 0;
            this.secondOverlay = 0;
            this.guiButton = 0;
            this.overlay = 0;
            this.subfolderLabel = [];
            this.checkBoxLabel = [];
            this.rangeWrapper = [];
            this.rangeLabel = [];
            this.range = [];
            this.rangeValueDisplay = [];
            this.bindWrapper = [];
            this.bindLabel = [];
            this.bindButton = [];
            this.selectWrapper = [];
            this.selectLabel = [];
            this.select = [];
            this.buttonWrapper = [];
            this.button = [];
            this.textWrapper = [];
            this.textLabel = [];
            this.textInput = [];
            this.folderButton = [];
            this.realIndex = [];
            this.previousFolderName = null;
            this.cachedSavedValues = getValuesFromSettings(Settings);
        };
        saveSettings() {
            const currentTime = Date.now();
            if (currentTime - lastSaveTimestamp < 100 && saveTimeout) clearTimeout(saveTimeout);
            lastSaveTimestamp = currentTime;
            saveTimeout = workerTimers.setTimeout(() => {
                const orderedValues = getValuesFromSettings(Settings);
                const changedValues = [];
                for (let i = 0; i < orderedValues.length; i++) {
                    const [id, value] = orderedValues[i];
                    const cached = this.cachedSavedValues[i];
                    if (!cached || cached[1] !== value) changedValues.push([id, value]);
                }
                this.cachedSavedValues = orderedValues;
                if (changedValues.length > 0) {
                    if (scriptSocket.readyState === 1) {
                        scriptSocket.send(basicXor(JSON.stringify([3, changedValues])));
                        this.updateGuiValues();
                    };
                };
            }, 100);
        };
        saveGuiSettings() {
            const guiSettings = Object.keys(this.guiConfig).filter(key => key !== 'folders' && key !== 'title');
            const guiSettingsValues = guiSettings.map(setting => this.guiConfig[setting]);
            if (scriptSocket.readyState === 1) {
                scriptSocket.send(basicXor(JSON.stringify([4, guiSettingsValues])));
            };
        };
        xor(str) { return Array.from(str).map(char => String.fromCharCode(char.charCodeAt(0) ^ 9999999999)).join(''); };
        updateGuiValues() {
            this.realIndex = 0;
            const contentBox = globalDocument.getElementById(this.xor('content'));
            if (!contentBox) return workerTimers.setTimeout(() => { this.updateGuiValues(); }, 500);
            Object.keys(this.guiConfig.folders).forEach(folderName => {
                this.guiConfig.folders[folderName].forEach((item) => {
                    if (item.type === 'subfolder') {
                        this.handleSubfolder(contentBox, item.subfolder, folderName);
                    } else {
                        this.handleItem(contentBox, item, folderName, this.realIndex);
                        this.realIndex++;
                    }
                });
            });
        };
        handleSubfolder(contentBox, subfolderItems, parentFolderName) {
            subfolderItems.forEach((subItem) => {
                this.handleItem(contentBox, subItem, parentFolderName, this.realIndex);
                this.realIndex++;
            });
        }
        handleItem(contentBox, item, folderName, index) {
            if (this.previousFolderName != folderName) { this.realIndex = 0; index = 0; };
            this.previousFolderName = folderName;
            if (item.type === 'checkbox') {
                const checkbox = contentBox.querySelector('input[type="checkbox"][id="' + this.xor(index + folderName) + '"]');
                if (checkbox) checkbox.checked = item.property ? item.object[item.property] : item.object;
            } else if (item.type === 'range') {
                const rangeSlider = contentBox.querySelector('input[type="range"][id="' + this.xor(index + folderName) + '"]');
                const rangeInput = contentBox.querySelector('input[type="number"][id="' + this.xor(index + folderName) + '"]');
                if (rangeSlider && rangeInput) {
                    rangeSlider.value = item.property ? item.object[item.property] : item.object;
                    rangeInput.value = item.property ? item.object[item.property] : item.object;
                };
            } else if (item.type === 'select') {
                const selectBox = contentBox.querySelector('select[id="' + this.xor(index + folderName) + '"]');
                if (selectBox) selectBox.value = item.property ? item.object[item.property] : item.object;
            } else if (item.type === 'text') {
                const textInput = contentBox.querySelector('input[type="text"][id="' + this.xor(index + folderName) + '"]');
                if (textInput) textInput.value = item.property ? item.object[item.property] : item.object;
            }
        }
        build() {
            let classThis = this;
            const link = globalDocument.createElement('link');
            link.href = 'https://fonts.googleapis.com/css2?family=Baloo+Paaji&display=swap';
            link.rel = 'stylesheet';
            link.onload = function () {
                const container = globalDocument.createElement('div');
                classThis.container = container;
                container.id = classThis.xor("gui");
                container.style.position = 'fixed';
                container.style.width = classThis.guiConfig.width + 'px';
                container.style.height = classThis.guiConfig.height + 'px';
                container.style.backgroundColor = 'rgb(20, 20, 20)';
                container.style.border = '8px solid rgb(20, 20, 20)';
                container.style.borderRadius = '8px';
                container.style.zIndex = '9999';
                container.style.boxShadow = '0px 6px 12px rgba(0, 0, 0, 0.4)';
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.boxSizing = 'border-box';
                container.style.lineHeight = 1.5;
                container.style.opacity = classThis.guiConfig.opacity;
                if (classThis.guiConfig.align == 'left') { container.style.top = '0%'; container.style.left = '0%'; container.style.transform = 'translate(0%, 0%)'; container.style.borderTopLeftRadius = '0px'; container.style.borderTopRightRadius = '8px'; } else if (classThis.guiConfig.align == 'right') { container.style.top = '0%'; container.style.right = '0%'; container.style.transform = 'translate(0%, 0%)'; container.style.borderTopLeftRadius = '8px'; container.style.borderTopRightRadius = '0px'; } else if (classThis.guiConfig.align == 'middle' || classThis.guiConfig.align == 'center') { container.style.top = '50%'; container.style.left = '50%'; container.style.transform = 'translate(-50%, -50%)'; container.style.borderTopLeftRadius = '8px'; container.style.borderTopRightRadius = '8px'; };
                container.style.cursor = classThis.guiConfig.draggable ? 'grab' : 'default';
                globalDocument.body.appendChild(container);
                const guiTitle = globalDocument.createElement('div');
                classThis.guiTitle = guiTitle;
                guiTitle.id = classThis.xor("guiTitle");
                guiTitle.textContent = classThis.guiConfig.title;
                guiTitle.style.backgroundColor = 'rgb(20, 20, 20)';
                guiTitle.style.color = '#fff';
                guiTitle.style.fontSize = classThis.guiConfig.fontSize + 8 + 'px';
                guiTitle.style.padding = '12px';
                guiTitle.style.textAlign = 'left';
                guiTitle.style.borderTopLeftRadius = '0px';
                guiTitle.style.borderTopRightRadius = '0px';
                guiTitle.style.marginBottom = '3px';
                guiTitle.style.display = 'flex';
                guiTitle.style.justifyContent = 'space-between';
                guiTitle.style.alignItems = 'center';
                container.appendChild(guiTitle);
                let isDragging = false;
                let offsetX, offsetY;
                const rangeInputs = container.querySelectorAll('input[type="range"]');
                rangeInputs.forEach((range) => { range.addEventListener('mousedown', (e) => { e.stopPropagation(); }); });
                container.addEventListener('mousedown', (e) => { if (!e.target.classList.contains('no-drag') && e.target.type !== 'range' && classThis.guiConfig.draggable) { isDragging = true; offsetX = e.clientX - container.offsetLeft; offsetY = e.clientY - container.offsetTop; if (classThis.container) classThis.container.style.cursor = 'grabbing'; const elements = { rangeWrapper: classThis.rangeWrapper, rangeLabel: classThis.rangeLabel, bindWrapper: classThis.bindWrapper, selectWrapper: classThis.selectWrapper, selectLabel: classThis.selectLabel, buttonWrapper: classThis.buttonWrapper, textWrapper: classThis.textWrapper, textLabel: classThis.textLabel, }; for (const [key, element] of Object.entries(elements)) { if (Array.isArray(element) && element.length > 0) { element.forEach((item) => { if (item) { item.style.cursor = 'grabbing'; } }); } } }; });
                container.addEventListener('mousemove', (e) => { if (isDragging && classThis.guiConfig.draggable) { container.style.left = e.clientX - offsetX + 'px'; container.style.top = e.clientY - offsetY + 'px'; }; });
                container.addEventListener('mouseup', () => { if (!classThis.guiConfig.draggable) return; isDragging = false; if (classThis.container) classThis.container.style.cursor = 'grab'; const elements = { rangeWrapper: classThis.rangeWrapper, rangeLabel: classThis.rangeLabel, bindWrapper: classThis.bindWrapper, selectWrapper: classThis.selectWrapper, selectLabel: classThis.selectLabel, buttonWrapper: classThis.buttonWrapper, textWrapper: classThis.textWrapper, textLabel: classThis.textLabel, }; for (const [key, element] of Object.entries(elements)) { if (Array.isArray(element) && element.length > 0) { element.forEach((item) => { if (item) { item.style.cursor = 'grab'; } }); } } });
                const mainContent = globalDocument.createElement('div');
                classThis.mainContent = mainContent;
                mainContent.style.display = 'flex';
                mainContent.style.height = classThis.guiConfig.height - 85 + 'px';
                mainContent.style.borderRadius = '15px';
                mainContent.style.boxSizing = 'border-box';
                mainContent.style.lineHeight = 1.5;
                container.appendChild(mainContent);
                const sidebar = globalDocument.createElement('div');
                sidebar.id = classThis.xor("sidebar");
                sidebar.style.width = '35%';
                sidebar.style.color = '#fff';
                sidebar.style.borderRadius = '8px';
                sidebar.style.overflowY = 'auto';
                sidebar.style.boxSizing = 'border-box';
                sidebar.style.lineHeight = 1.5;
                sidebar.style.fontSize = classThis.guiConfig.fontSize + 6 + 'px';
                mainContent.appendChild(sidebar);
                const contentBox = globalDocument.createElement('div');
                contentBox.id = classThis.xor("content");
                contentBox.style.width = '80%';
                contentBox.style.backgroundColor = 'rgb(30, 30, 30)';
                contentBox.style.color = '#fff';
                contentBox.style.padding = '8px';
                contentBox.style.overflowY = 'auto';
                contentBox.style.display = 'flex';
                contentBox.style.flexDirection = 'column';
                contentBox.style.borderRadius = '12px';
                contentBox.style.boxSizing = 'border-box';
                contentBox.style.lineHeight = 1.5;
                mainContent.appendChild(contentBox);
                const customiseButton = globalDocument.createElement('button');
                classThis.customiseButton = customiseButton;
                customiseButton.textContent = 'Customise';
                customiseButton.style.backgroundColor = 'rgb(45, 45, 45)';
                customiseButton.style.color = '#fff';
                customiseButton.style.border = 'none';
                customiseButton.style.borderRadius = '5px';
                customiseButton.style.padding = '8px 12px';
                customiseButton.style.cursor = 'pointer';
                customiseButton.style.marginLeft = 'auto';
                customiseButton.style.fontSize = classThis.guiConfig.fontSize + 'px';
                customiseButton.style.fontFamily = 'Baloo Paaji';
                customiseButton.style.display = 'flex';
                customiseButton.style.alignItems = 'center';
                const secondOverlay = globalDocument.createElement('div');
                overlay = secondOverlay;
                classThis.secondOverlay = secondOverlay;
                secondOverlay.style.id = classThis.xor("overlay");
                secondOverlay.style.position = 'fixed';
                secondOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.333)';
                secondOverlay.style.zIndex = '10000';
                secondOverlay.style.display = 'none';
                secondOverlay.style.alignItems = 'center';
                secondOverlay.style.justifyContent = 'center';
                secondOverlay.style.top = '0';
                secondOverlay.style.left = '0';
                secondOverlay.style.width = '100%';
                secondOverlay.style.height = '100%';
                let stopPropagationOverlay = (event) => { event.stopPropagation(); };
                secondOverlay.addEventListener('mouseup', stopPropagationOverlay, false);
                secondOverlay.addEventListener('mousedown', stopPropagationOverlay, false);
                secondOverlay.addEventListener('keydown', stopPropagationOverlay, false);
                secondOverlay.addEventListener('keyup', stopPropagationOverlay, false);
                const customizeBox = globalDocument.createElement('div');
                customizeBox.style.backgroundColor = 'rgb(30, 30, 30)';
                customizeBox.style.padding = '20px';
                customizeBox.style.borderRadius = '12px';
                customizeBox.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.7)';
                customizeBox.style.color = '#fff';
                customizeBox.style.display = 'flex';
                customizeBox.style.flexDirection = 'row';
                customizeBox.style.width = '500px';
                customizeBox.style.maxWidth = '90%';
                const contents = globalDocument.createElement('div');
                contents.style.flex = '1';
                contents.style.display = 'flex';
                contents.style.flexDirection = 'column';
                contents.style.justifyContent = 'space-between';
                const title = globalDocument.createElement('h1');
                title.textContent = 'Gui Customization';
                title.style.margin = '0';
                title.style.fontSize = '20px';
                title.style.marginBottom = '30px';
                contents.appendChild(title);
                const guiButton = globalDocument.createElement('div');
                button = guiButton;
                classThis.guiButton = guiButton;
                guiButton.style.display = classThis.guiConfig.toggleGuiButton ? 'flex' : 'none';
                guiButton.style.position = 'fixed';
                guiButton.style.top = '0';
                guiButton.style.right = '0';
                guiButton.style.width = '20px';
                guiButton.style.height = '20px';
                guiButton.style.backgroundColor = 'rgb(0, 0, 0)';
                guiButton.style.cursor = 'pointer';
                guiButton.style.zIndex = '10000';
                guiButton.style.opacity = '0.69';
                guiButton.style.borderBottomLeftRadius = '4px';
                guiButton.onmouseover = function () { guiButton.style.opacity = '1'; };
                guiButton.onmouseout = function () { guiButton.style.opacity = '0.69'; };
                guiButton.onclick = function () { const guiHidden = globalDocument.getElementById(classThis.xor("gui")).style.display === 'none'; globalDocument.getElementById(classThis.xor("gui")).style.display = guiHidden ? 'flex' : 'none'; classThis.secondOverlay.style.display = 'none'; };
                guiButton.addEventListener('mouseup', stopPropagationOverlay, false);
                guiButton.addEventListener('mousedown', stopPropagationOverlay, false);
                guiButton.addEventListener('keydown', stopPropagationOverlay, false);
                guiButton.addEventListener('keyup', stopPropagationOverlay, false);
                globalDocument.body.appendChild(guiButton);
                function createBindButton(labelText, property) { const bindContainer = globalDocument.createElement('div'); bindContainer.style.marginBottom = '16px'; bindContainer.style.display = 'flex'; const label = globalDocument.createElement('label'); label.textContent = labelText; label.style.color = '#fff'; label.style.fontSize = '14px'; label.style.display = 'flex'; label.style.width = '100px'; label.style.alignItems = 'center'; const button = globalDocument.createElement('button'); button.textContent = classThis.guiConfig[property] || 'Set Key Bind'; button.style.backgroundColor = '#333'; button.style.color = '#fff'; button.style.border = 'none'; button.style.borderRadius = '4px'; button.style.padding = '2px 12px'; button.style.cursor = 'pointer'; button.style.fontSize = '14px'; button.style.fontFamily = 'Baloo Paaji'; button.style.height = '24px'; button.addEventListener('click', () => { button.textContent = 'Press any key... (Escape to remove)'; button.blur(); function onKeydown(e) { const bindValue = (e.code === 'Escape') ? 'NONE' : e.code; button.textContent = bindValue; classThis.guiConfig[property] = bindValue; globalDocument.removeEventListener('keydown', onKeydown); button.blur(); } globalDocument.addEventListener('keydown', onKeydown); }); bindContainer.appendChild(label); bindContainer.appendChild(button); contents.appendChild(bindContainer); };
                function createSlider(labelText, property, min = 0.1, max = 100, step = 1, unit = 'px') { const sliderContainer = globalDocument.createElement('div'); sliderContainer.style.marginBottom = '16px'; sliderContainer.style.display = 'flex'; sliderContainer.style.alignItems = 'center'; const label = globalDocument.createElement('label'); label.textContent = labelText; label.style.color = '#fff'; label.style.fontSize = '14px'; label.style.width = '100px'; label.style.height = '24px'; const slider = globalDocument.createElement('input'); slider.type = 'range'; slider.min = min; slider.max = max; slider.step = step; slider.value = classThis.guiConfig[property]; slider.style.flex = '1'; slider.style.marginRight = '10px'; slider.style.cursor = 'pointer'; const valueDisplay = globalDocument.createElement('span'); valueDisplay.textContent = slider.value + unit; valueDisplay.style.color = '#fff'; valueDisplay.style.width = '10%'; slider.addEventListener('input', (e) => { classThis.guiConfig[property] = e.target.value; valueDisplay.textContent = e.target.value + unit; container.style[property] = e.target.value + unit; classThis.mainContent.style.height = classThis.guiConfig.height - 85 + 'px'; if (property === 'fontSize') { classThis.guiConfig[property] = parseInt(e.target.value, 10); container.style.fontSize = classThis.guiConfig[property] + 'px'; if (classThis.folderButton.length) classThis.folderButton.forEach((folderButton) => { folderButton.style.fontSize = classThis.guiConfig.fontSize + 6 + 'px'; }); if (classThis.guiTitle) classThis.guiTitle.style.fontSize = classThis.guiConfig.fontSize + 8 + 'px'; if (classThis.customiseButton) classThis.customiseButton.style.fontSize = classThis.guiConfig.fontSize + 'px'; if (classThis.header) classThis.header.style.fontSize = classThis.guiConfig.fontSize + 4 + 'px'; if (classThis.checkBoxLabel.length) classThis.checkBoxLabel.forEach((checkBoxLabel) => { checkBoxLabel.style.fontSize = classThis.guiConfig.fontSize + 2 + 'px'; }); if (classThis.subfolderLabel.length) classThis.subfolderLabel.forEach((subfolderLabel) => { subfolderLabel.style.fontSize = classThis.guiConfig.fontSize + 2 + 'px'; }); if (classThis.rangeLabel.length) classThis.rangeLabel.forEach((rangeLabel) => { rangeLabel.style.fontSize = classThis.guiConfig.fontSize + 2 + 'px'; }); if (classThis.range.length) classThis.range.forEach((range) => { range.style.height = classThis.guiConfig.fontSize - 8 + 'px'; }); if (classThis.rangeValueDisplay.length) classThis.rangeValueDisplay.forEach((rangeValueDisplay) => { rangeValueDisplay.style.fontSize = classThis.guiConfig.fontSize - 2 + 'px'; }); if (classThis.bindLabel.length) classThis.bindLabel.forEach((bindLabel) => { bindLabel.style.fontSize = classThis.guiConfig.fontSize + 2 + 'px' }); if (classThis.bindButton.length) classThis.bindButton.forEach((bindButton) => { bindButton.style.fontSize = classThis.guiConfig.fontSize - 2 + 'px'; bindButton.style.height = classThis.guiConfig.fontSize + 10 + 'px'; }); if (classThis.overlay.length) classThis.overlay.forEach((overlay) => { overlay.style.fontSize = classThis.guiConfig.fontSize + 6 + 'px'; }); if (classThis.selectLabel.length) classThis.selectLabel.forEach((selectLabel) => { selectLabel.style.fontSize = classThis.guiConfig.fontSize + 2 + 'px'; }); if (classThis.select.length) classThis.select.forEach((select) => { select.style.fontSize = classThis.guiConfig.fontSize - 2 + 'px'; select.style.height = classThis.guiConfig.fontSize + 10 + 'px'; }); if (classThis.button.length) classThis.button.forEach((button) => { button.style.fontSize = classThis.guiConfig.fontSize - 2 + 'px'; button.style.height = classThis.guiConfig.fontSize + 10 + 'px'; }); if (classThis.textInput.length) classThis.textInput.forEach((textInput) => { textInput.style.fontSize = classThis.guiConfig.fontSize - 2 + 'px'; }); if (classThis.textLabel.length) classThis.textLabel.forEach((textLabel) => { textLabel.style.fontSize = classThis.guiConfig.fontSize + 2 + 'px'; }); }; slider.blur(); }); sliderContainer.appendChild(label); sliderContainer.appendChild(slider); sliderContainer.appendChild(valueDisplay); contents.appendChild(sliderContainer); };
                function createSelect(labelText, property, options) { const selectContainer = globalDocument.createElement('div'); selectContainer.style.marginBottom = '16px'; selectContainer.style.display = 'flex'; const label = globalDocument.createElement('label'); label.textContent = labelText; label.style.color = '#fff'; label.style.fontSize = '14px'; label.style.width = '100px'; label.style.display = 'flex'; label.style.alignItems = 'center'; const select = globalDocument.createElement('select'); select.style.backgroundColor = '#333'; select.style.fontSize = '14px'; select.style.fontFamily = 'Baloo Paaji'; select.style.color = '#fff'; select.style.border = 'none'; select.style.borderRadius = '4px'; select.style.padding = '0px 8px'; select.style.width = '100%'; select.style.height = '24px'; select.style.cursor = 'pointer'; select.style.flex = '1'; options.forEach(option => { const opt = globalDocument.createElement('option'); opt.value = option.value; opt.textContent = option.text; select.appendChild(opt); }); select.value = classThis.guiConfig[property]; select.addEventListener('change', (e) => { classThis.guiConfig[property] = e.target.value; if (e.target.value === 'left') { container.style.top = '0%'; container.style.left = '0%'; container.style.right = ''; container.style.transform = ''; container.style.borderTopLeftRadius = '0px'; container.style.borderTopRightRadius = '8px'; classThis.guiButton.style.left = '0%'; classThis.guiButton.style.right = ''; guiButton.style.borderBottomLeftRadius = '0px'; guiButton.style.borderBottomRightRadius = '4px'; } else if (e.target.value === 'right') { container.style.top = '0%'; container.style.right = '0%'; container.style.left = ''; container.style.transform = ''; container.style.borderTopLeftRadius = '8px'; container.style.borderTopRightRadius = '0px'; classThis.guiButton.style.right = '0%'; classThis.guiButton.style.left = ''; guiButton.style.borderBottomLeftRadius = '4px'; guiButton.style.borderBottomRightRadius = '0px'; } else { container.style.top = '50%'; container.style.left = '50%'; container.style.transform = 'translate(-50%, -50%)'; container.style.borderTopLeftRadius = '8px'; container.style.borderTopRightRadius = '8px'; classThis.guiButton.style.right = '0%'; classThis.guiButton.style.left = ''; guiButton.style.borderBottomLeftRadius = '4px'; guiButton.style.borderBottomRightRadius = '0px'; }; select.blur(); }); selectContainer.appendChild(label); selectContainer.appendChild(select); contents.appendChild(selectContainer); };
                function createCheckbox(labelText, property) { const checkboxContainer = globalDocument.createElement('div'); checkboxContainer.style.marginBottom = '16px'; checkboxContainer.style.display = 'flex'; const label = globalDocument.createElement('label'); label.textContent = labelText; label.style.color = '#fff'; label.style.fontSize = '14px'; label.style.display = 'flex'; label.style.alignItems = 'center'; label.style.width = '100px'; label.style.height = '24px'; const checkbox = globalDocument.createElement('input'); checkbox.type = 'checkbox'; checkbox.checked = classThis.guiConfig[property]; checkbox.addEventListener('change', (e) => { classThis.guiConfig[property] = e.target.checked; if (!classThis.guiConfig.draggable) { if (classThis.guiConfig.align === 'left') { classThis.guiButton.style.left = '0%'; classThis.guiButton.style.right = ''; guiButton.style.borderBottomLeftRadius = '0px'; guiButton.style.borderBottomRightRadius = '4px'; container.style.top = '0%'; container.style.left = '0%'; container.style.right = ''; container.style.transform = ''; container.style.borderTopLeftRadius = '0px'; container.style.borderTopRightRadius = '8px'; } else if (classThis.guiConfig.align === 'right') { classThis.guiButton.style.right = '0%'; classThis.guiButton.style.left = ''; guiButton.style.borderBottomLeftRadius = '4px'; guiButton.style.borderBottomRightRadius = '0px'; container.style.top = '0%'; container.style.right = '0%'; container.style.left = ''; container.style.transform = ''; container.style.borderTopLeftRadius = '8px'; container.style.borderTopRightRadius = '0px'; } else { classThis.guiButton.style.right = '0%'; classThis.guiButton.style.left = ''; guiButton.style.borderBottomLeftRadius = '4px'; guiButton.style.borderBottomRightRadius = '0px'; container.style.top = '50%'; container.style.left = '50%'; container.style.transform = 'translate(-50%, -50%)'; container.style.borderTopLeftRadius = '8px'; container.style.borderTopRightRadius = '8px'; }; }; classThis.guiButton.style.display = classThis.guiConfig.toggleGuiButton ? 'flex' : 'none'; classThis.container.style.cursor = classThis.guiConfig.draggable ? 'grab' : 'default'; const options = { rangeWrapper: classThis.rangeWrapper, rangeLabel: classThis.rangeLabel, bindWrapper: classThis.bindWrapper, selectWrapper: classThis.selectWrapper, selectLabel: classThis.selectLabel, buttonWrapper: classThis.buttonWrapper, textWrapper: classThis.textWrapper, textLabel: classThis.textLabel, }; for (const [key, element] of Object.entries(options)) { if (Array.isArray(element) && element.length > 0) element.forEach((item) => { if (item) item.style.cursor = classThis.guiConfig.draggable ? 'grab' : 'default';; }); }; }); label.appendChild(checkbox); checkboxContainer.appendChild(label); checkboxContainer.appendChild(checkbox); contents.appendChild(checkboxContainer); };
                createBindButton('Toggle GUI:', 'toggleGuiKey');
                createSlider('Width:', 'width', 400, 1000, 10);
                createSlider('Height:', 'height', 300, 1000, 10);
                createSlider('Font Size:', 'fontSize', 10, 18, 1);
                createSlider('Opacity:', 'opacity', 0.1, 1.0, 0.01, '');
                createSelect('Align:', 'align', [{ value: 'left', text: 'Left' }, { value: 'center', text: 'Center' }, { value: 'right', text: 'Right' },]);
                createCheckbox('Gui Button:', 'toggleGuiButton');
                createCheckbox('Draggable:', 'draggable');
                globalDocument.addEventListener('keydown', (e) => { if (e.code === classThis.guiConfig.toggleGuiKey) { const guiHidden = globalDocument.getElementById(classThis.xor("gui")).style.display === 'none'; globalDocument.getElementById(classThis.xor("gui")).style.display = guiHidden ? 'flex' : 'none'; classThis.secondOverlay.style.display = 'none'; }; });
                const closeButton = globalDocument.createElement('button');
                closeButton.style.fontFamily = 'Baloo Paaji';
                closeButton.textContent = 'Close';
                closeButton.style.marginTop = '20px';
                closeButton.style.backgroundColor = 'rgb(45, 45, 45)';
                closeButton.style.color = '#fff';
                closeButton.style.border = 'none';
                closeButton.style.borderRadius = '4px';
                closeButton.style.padding = '10px 16px';
                closeButton.style.cursor = 'pointer';
                closeButton.style.fontSize = '14px';
                closeButton.style.transition = 'background-color 0.3s';
                closeButton.addEventListener('mouseover', () => { closeButton.style.backgroundColor = 'rgb(55, 55, 55)'; });
                closeButton.addEventListener('mouseout', () => { closeButton.style.backgroundColor = 'rgb(45, 45, 45)'; });
                closeButton.addEventListener('click', () => { classThis.secondOverlay.style.display = 'none'; classThis.saveGuiSettings(); });
                contents.appendChild(closeButton);
                customizeBox.appendChild(contents);
                secondOverlay.appendChild(customizeBox);
                globalDocument.body.appendChild(secondOverlay);
                customiseButton.addEventListener('click', () => { classThis.secondOverlay.style.display = 'flex'; customiseButton.blur(); });
                guiTitle.appendChild(customiseButton);
                const style = globalDocument.createElement('style');
                style.innerHTML = "div.checkbox-wrapper:hover input[type='checkbox']:not(:checked) { background: #444; border-color: white; } div { font-family: 'Baloo Paaji', sans-serif; } input[type='checkbox'] { font-family: 'Baloo Paaji', sans-serif; } #" + classThis.xor('sidebar') + " button { font-family: 'Baloo Paaji', sans-serif; } #" + classThis.xor('sidebar') + " h3 { font-family: 'Baloo Paaji', sans-serif; } label { font-family: 'Baloo Paaji', sans-serif; } div::-webkit-scrollbar { width: 8px; border-radius: 15px; } div::-webkit-scrollbar-track { background: #444; border-radius: 15px; } div::-webkit-scrollbar-thumb { background-color: #888; border-radius: 15px; border: 3.5px solid #888; } input[type='checkbox'] { appearance: none; width: 20px; height: 20px; border: 3px solid #444; border-radius: 4px; outline: none; cursor: pointer; transition: background 0.2s, border-color 0.2s; } input[type='checkbox']:checked { background: #444; border-color: #00ff00; } input[type='checkbox']:checked::after { content: ''; } * { user-select: none; } #" + classThis.xor('sidebar') + " { background-color: rgb(30, 30, 30); padding: 8px; border-right: 3.5px solid #1e1e1e; display: flex; flex-direction: column; gap: 10px; } #" + classThis.xor('sidebar') + " button { background-color: rgb(51, 51, 51); color: #f0f0f0; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease; text-align: left; display: flex; align-items: center; gap: 12px; box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25); position: relative; overflow: hidden; min-height: 30px; } #" + classThis.xor('sidebar') + " button:hover { background-color: #4a4a4a; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4); } #" + classThis.xor('sidebar') + " button:active { transform: scale(0.96); box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25); } #" + classThis.xor('sidebar') + " button.active { background-color: #555; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4); outline: 3.5px solid #888; } #" + classThis.xor('sidebar') + " button:before { content: ''; position: absolute; left: -50%; top: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 10%, transparent 40%); transition: opacity 0.5s, transform 0.5s; opacity: 0; transform: scale(0); z-index: 0; } #" + classThis.xor('sidebar') + " button:hover:before { opacity: 1; transform: scale(1.2); } ";
                globalDocument.head.appendChild(style);
                function renderFolderContents(folderName, contents) {
                    classThis.checkBoxLabel = [];
                    classThis.subfolderLabel = [];
                    classThis.rangeWrapper = [];
                    classThis.rangeLabel = [];
                    classThis.range = [];
                    classThis.rangeValueDisplay = [];
                    classThis.bindWrapper = [];
                    classThis.bindLabel = [];
                    classThis.bindButton = [];
                    classThis.selectWrapper = [];
                    classThis.selectLabel = [];
                    classThis.select = [];
                    classThis.buttonWrapper = [];
                    classThis.button = [];
                    classThis.textWrapper = [];
                    classThis.textLabel = [];
                    classThis.textInput = [];
                    contentBox.innerHTML = '';
                    const header = globalDocument.createElement('h69');
                    classThis.header = header;
                    header.textContent = folderName;
                    header.style.color = '#fff';
                    header.style.marginTop = '0px';
                    header.style.marginBottom = '8px';
                    header.style.fontSize = classThis.guiConfig.fontSize + 4 + 'px';
                    header.style.fontFamily = 'Baloo Paaji';
                    header.style.padding = '10px 15px';
                    header.style.backgroundColor = '#333';
                    header.style.borderRadius = '5px';
                    header.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
                    contentBox.appendChild(header);
                    classThis.realIndex = 0;
                    let index = 0;
                    if (contents[0]) contents.forEach((item) => {
                        if (item.type === 'subfolder') { classThis.realIndex--; index = classThis.realIndex; };
                        if (item.type === 'checkbox') {
                            const checkboxWrapper = globalDocument.createElement('div');
                            checkboxWrapper.className = 'checkbox-wrapper';
                            checkboxWrapper.style.marginLeft = '0px';
                            checkboxWrapper.style.marginBottom = '4px';
                            checkboxWrapper.style.display = 'flex';
                            checkboxWrapper.style.alignItems = 'center';
                            checkboxWrapper.style.backgroundColor = '#2a2a2a';
                            checkboxWrapper.style.padding = '2px 10px';
                            checkboxWrapper.style.borderRadius = '4px';
                            checkboxWrapper.style.transition = 'background-color 0.3s';
                            checkboxWrapper.style.cursor = 'pointer';
                            checkboxWrapper.style.lineHeight = 1.5;
                            checkboxWrapper.addEventListener('mouseenter', () => { checkboxWrapper.style.backgroundColor = '#444'; });
                            checkboxWrapper.addEventListener('mouseleave', () => { checkboxWrapper.style.backgroundColor = '#2a2a2a'; });
                            const checkBoxLabel = globalDocument.createElement('label');
                            classThis.checkBoxLabel.push(checkBoxLabel);
                            checkBoxLabel.textContent = item.label;
                            checkBoxLabel.style.color = '#fff';
                            checkBoxLabel.style.fontSize = classThis.guiConfig.fontSize + 2 + 'px';
                            checkBoxLabel.style.cursor = 'pointer';
                            checkBoxLabel.style.flexGrow = '1';
                            const checkbox = globalDocument.createElement('input');
                            checkbox.type = 'checkbox';
                            checkbox.checked = item.property ? item.object[item.property] : item.object;
                            checkbox.id = classThis.xor(index + folderName);
                            checkbox.style.margin = '0px';
                            checkboxWrapper.addEventListener('click', (e) => { if (e.target !== checkbox) { checkbox.checked = !checkbox.checked; item.property ? item.object[item.property] = Number(checkbox.checked) : item.object = Number(checkbox.checked); item.onChange ? item.onChange(Number(checkbox.checked)) : void 0; item.action ? item.action(Number(checkbox.checked)) : void 0; classThis.updateGuiValues(); }; });
                            checkbox.addEventListener('change', () => { checkbox.blur(); item.property ? item.object[item.property] = Number(checkbox.checked) : item.object = Number(checkbox.checked); item.onChange ? item.onChange(Number(checkbox.checked)) : void 0; item.action ? item.action(Number(checkbox.checked)) : void 0; classThis.updateGuiValues(); });
                            checkboxWrapper.appendChild(checkBoxLabel);
                            checkboxWrapper.appendChild(checkbox);
                            contentBox.appendChild(checkboxWrapper);
                            classThis.realIndex++;
                            index = classThis.realIndex;
                        } else if (item.type === 'range') {
                            const rangeWrapper = globalDocument.createElement('div');
                            classThis.rangeWrapper.push(rangeWrapper);
                            rangeWrapper.style.marginLeft = '0px'
                            rangeWrapper.style.marginBottom = '4px';
                            rangeWrapper.style.backgroundColor = '#2a2a2a';
                            rangeWrapper.style.padding = '10px 10px';
                            rangeWrapper.style.borderRadius = '4px';
                            rangeWrapper.style.transition = 'background-color 0.3s';
                            rangeWrapper.style.cursor = classThis.guiConfig.draggable ? 'grab' : 'default';
                            rangeWrapper.addEventListener('mouseenter', () => { rangeWrapper.style.backgroundColor = '#444'; });
                            rangeWrapper.addEventListener('mouseleave', () => { rangeWrapper.style.backgroundColor = '#2a2a2a'; });
                            const labelValueWrapper = globalDocument.createElement('div');
                            labelValueWrapper.style.display = 'flex';
                            labelValueWrapper.style.justifyContent = 'space-between';
                            labelValueWrapper.style.alignItems = 'center';
                            labelValueWrapper.style.width = '100%';
                            labelValueWrapper.style.marginBottom = '10px';
                            const rangeLabel = globalDocument.createElement('label');
                            classThis.rangeLabel.push(rangeLabel);
                            rangeLabel.textContent = ' ' + item.label;
                            rangeLabel.style.color = '#fff';
                            rangeLabel.style.fontSize = classThis.guiConfig.fontSize + 2 - 2 + 'px';
                            rangeLabel.style.cursor = classThis.guiConfig.draggable ? 'grab' : 'default';
                            rangeLabel.style.flexShrink = '0';
                            const rangeValueDisplay = globalDocument.createElement('input');
                            classThis.rangeValueDisplay.push(rangeValueDisplay);
                            rangeValueDisplay.type = 'number';
                            rangeValueDisplay.id = classThis.xor(index + folderName);
                            rangeValueDisplay.value = item.property ? item.object[item.property] : item.object;
                            rangeValueDisplay.min = item.min;
                            rangeValueDisplay.max = item.max;
                            rangeValueDisplay.step = item.step || 1;
                            rangeValueDisplay.style.width = '80px';
                            rangeValueDisplay.style.color = '#fff';
                            rangeValueDisplay.style.backgroundColor = '#444';
                            rangeValueDisplay.style.border = '3.5px solid #555';
                            rangeValueDisplay.style.borderRadius = '4px';
                            rangeValueDisplay.style.fontSize = classThis.guiConfig.fontSize - 2 - 2 + 'px';
                            rangeValueDisplay.style.textAlign = 'center';
                            rangeValueDisplay.style.paddingLeft = '10px';
                            rangeValueDisplay.style.boxSizing = 'border-box';
                            rangeValueDisplay.style.padding = '0px 0px 0px 12px';
                            rangeValueDisplay.style.lineHeight = 1.5;
                            rangeValueDisplay.style.fontFamily = 'Baloo Paaji';
                            rangeValueDisplay.style.width = '25%';
                            rangeValueDisplay.style.minHeight = '20px';
                            rangeValueDisplay.style.flexShrink = '0';
                            labelValueWrapper.appendChild(rangeLabel);
                            labelValueWrapper.appendChild(rangeValueDisplay);
                            const rangeSliderWrapper = globalDocument.createElement('div');
                            rangeSliderWrapper.style.width = '100%';
                            const range = globalDocument.createElement('input');
                            classThis.range.push(range);
                            range.type = 'range';
                            range.min = item.min;
                            range.max = item.max;
                            range.step = item.step || 1;
                            range.value = item.property ? item.object[item.property] : item.object;
                            range.id = classThis.xor(index + folderName);
                            range.style.width = '100%';
                            range.style.borderRadius = '5px';
                            range.style.outline = 'none';
                            range.style.transition = 'background 0.3s';
                            range.style.cursor = 'pointer';
                            range.style.margin = '0px';
                            range.style.minHeight = '6px';
                            range.style.height = classThis.guiConfig.fontSize - 8 - 2 + 'px';
                            rangeSliderWrapper.appendChild(range);
                            let isDragging = false;
                            let lastValue = range.value;
                            range.addEventListener('input', () => { range.blur(); rangeValueDisplay.value = range.value; });
                            range.addEventListener('mousedown', () => { isDragging = true; });
                            range.addEventListener('mouseup', () => { if (isDragging) { isDragging = false; let newValue = Number(rangeValueDisplay.value); if (newValue !== lastValue) { lastValue = newValue; range.value = newValue; item.property ? item.object[item.property] = Number(range.value) : item.object = Number(range.value); if (item.onChange) item.onChange(newValue); if (item.action) item.action(newValue); } classThis.updateGuiValues(); } });
                            rangeValueDisplay.addEventListener('focusout', () => { rangeValueDisplay.blur(); let newValue = Number(rangeValueDisplay.value); if (newValue !== lastValue) { lastValue = newValue; if (isNaN(newValue) || newValue < item.min || newValue > item.max) { newValue = Number(lastValue); } range.value = newValue; item.property ? item.object[item.property] = Number(range.value) : item.object = Number(range.value); if (item.onChange) item.onChange(newValue); if (item.action) item.action(newValue); classThis.updateGuiValues(); } });
                            rangeValueDisplay.addEventListener('keyup', (event) => { if (event.key === 'Enter') rangeValueDisplay.blur(); });
                            rangeWrapper.appendChild(labelValueWrapper);
                            rangeWrapper.appendChild(rangeSliderWrapper);
                            contentBox.appendChild(rangeWrapper);
                        } else if (item.type === 'bind') {
                            const bindWrapper = globalDocument.createElement('div');
                            classThis.bindWrapper.push(bindWrapper);
                            bindWrapper.style.marginLeft = '0px';
                            bindWrapper.style.display = 'flex';
                            bindWrapper.style.alignItems = 'center';
                            bindWrapper.style.marginBottom = '4px';
                            bindWrapper.style.backgroundColor = '#2a2a2a';
                            bindWrapper.style.padding = '2px 10px';
                            bindWrapper.style.borderRadius = '4px';
                            bindWrapper.style.transition = 'background-color 0.3s';
                            bindWrapper.style.cursor = classThis.guiConfig.draggable ? 'grab' : 'default';
                            bindWrapper.style.lineHeight = 1.5;
                            bindWrapper.addEventListener('mouseenter', () => { bindWrapper.style.backgroundColor = '#444'; });
                            bindWrapper.addEventListener('mouseleave', () => { bindWrapper.style.backgroundColor = '#2a2a2a'; });
                            const bindLabel = globalDocument.createElement('span');
                            classThis.bindLabel.push(bindLabel);
                            bindLabel.textContent = item.label;
                            bindLabel.style.color = '#fff';
                            bindLabel.style.fontSize = classThis.guiConfig.fontSize + 2 + 'px';
                            bindLabel.style.marginRight = '8px';
                            bindLabel.style.flexGrow = '1';
                            const bindButton = globalDocument.createElement('div');
                            classThis.bindButton.push(bindButton);
                            bindButton.textContent = item.buttonTextObject && item.buttonTextProperty ? item.buttonTextObject[item.buttonTextProperty] : 'Click Me';
                            bindButton.style.backgroundColor = '#444';
                            bindButton.style.padding = '2px';
                            bindButton.style.color = '#fff';
                            bindButton.style.border = '3.5px solid #555';
                            bindButton.style.borderRadius = '4px';
                            bindButton.style.cursor = 'pointer';
                            bindButton.style.minWidth = container.width / 8 + 'px';
                            bindButton.style.minWidth = '20%';
                            bindButton.style.transition = 'background 0.3s, transform 0.2s';
                            bindButton.style.fontSize = classThis.guiConfig.fontSize - 2 + 'px';
                            bindButton.style.height = classThis.guiConfig.fontSize + 10 + 'px';
                            bindButton.style.boxSizing = 'border-box';
                            bindButton.style.lineHeight = 1.5;
                            bindButton.id = classThis.xor(index + folderName);
                            bindButton.addEventListener('mouseenter', () => { bindButton.style.backgroundColor = '#555'; });
                            bindButton.addEventListener('mouseleave', () => { bindButton.style.backgroundColor = '#444'; });
                            const overlay = globalDocument.createElement('div');
                            classThis.overlay = overlay;
                            overlay.style.position = 'absolute';
                            overlay.style.top = '0';
                            overlay.style.left = '0';
                            overlay.style.width = '100%';
                            overlay.style.height = '100%';
                            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                            overlay.style.display = 'flex';
                            overlay.style.justifyContent = 'center';
                            overlay.style.alignItems = 'center';
                            overlay.style.color = '#fff';
                            overlay.style.fontSize = classThis.guiConfig.fontSize + 6 + 'px';
                            overlay.style.textAlign = 'center';
                            overlay.style.zIndex = '9999';
                            overlay.style.backdropFilter = 'blur(5px)';
                            overlay.style.display = 'none';
                            const overlayText = globalDocument.createElement('div');
                            overlayText.innerHTML = 'Press any key:<br>Hold Escape to clear the bind (NONE)<br>Press Escape to cancel';
                            overlay.appendChild(overlayText);
                            const guiContainer = globalDocument.getElementById(classThis.xor('gui'));
                            guiContainer.appendChild(overlay);
                            let escapeHoldTimeout = null;
                            const bindKeyListener = (event) => { if (event.code === 'Escape') { escapeHoldTimeout = workerTimers.setTimeout(() => { bindButton.textContent = 'NONE'; if (item.buttonTextObject && item.buttonTextProperty) item.buttonTextObject[item.buttonTextProperty] = 'NONE'; classThis.overlay.style.display = 'none'; globalDocument.removeEventListener('keydown', bindKeyListener); if (item.onChange) item.onChange(); if (item.action) item.action(); }, 250); } else { const newBind = event.code; bindButton.textContent = newBind; if (item.buttonTextObject && item.buttonTextProperty) item.buttonTextObject[item.buttonTextProperty] = newBind; classThis.overlay.style.display = 'none'; globalDocument.removeEventListener('keydown', bindKeyListener); clearTimeout(escapeHoldTimeout); if (item.onChange) item.onChange(); if (item.action) item.action(); }; };
                            const escapeKeyListener = (event) => { if (event.code === 'Escape') { clearTimeout(escapeHoldTimeout); classThis.overlay.style.display = 'none'; globalDocument.removeEventListener('keydown', bindKeyListener); } };
                            bindButton.addEventListener('click', () => { classThis.overlay.style.display = 'flex'; globalDocument.addEventListener('keydown', bindKeyListener); globalDocument.addEventListener('keyup', escapeKeyListener); });
                            bindWrapper.appendChild(bindLabel);
                            bindWrapper.appendChild(bindButton);
                            contentBox.appendChild(bindWrapper);
                            classThis.realIndex++;
                            index = classThis.realIndex;
                        } else if (item.type === 'select') {
                            const selectWrapper = globalDocument.createElement('div');
                            classThis.selectWrapper.push(selectWrapper);
                            selectWrapper.style.marginLeft = '0px';
                            selectWrapper.style.marginBottom = '4px';
                            selectWrapper.style.display = 'flex';
                            selectWrapper.style.alignItems = 'center';
                            selectWrapper.style.backgroundColor = '#2a2a2a';
                            selectWrapper.style.padding = '2px 10px';
                            selectWrapper.style.borderRadius = '4px';
                            selectWrapper.style.transition = 'background-color 0.3s';
                            selectWrapper.style.cursor = classThis.guiConfig.draggable ? 'grab' : 'default';
                            selectWrapper.style.lineHeight = 1.5;
                            selectWrapper.addEventListener('mouseenter', () => { selectWrapper.style.backgroundColor = '#444'; });
                            selectWrapper.addEventListener('mouseleave', () => { selectWrapper.style.backgroundColor = '#2a2a2a'; });
                            const selectLabel = globalDocument.createElement('label');
                            classThis.selectLabel.push(selectLabel);
                            selectLabel.textContent = item.label;
                            selectLabel.style.color = '#fff';
                            selectLabel.style.fontSize = classThis.guiConfig.fontSize + 2 + 'px';
                            selectLabel.style.cursor = classThis.guiConfig.draggable ? 'grab' : 'default';
                            selectLabel.style.marginRight = '8px';
                            selectLabel.style.flexGrow = '1';
                            selectLabel.style.lineHeight = 1.5;
                            const select = globalDocument.createElement('select');
                            classThis.select.push(select);
                            select.style.backgroundColor = '#444';
                            select.style.color = '#fff';
                            select.style.border = '3.5px solid #555';
                            select.style.borderRadius = '4px';
                            select.style.fontSize = classThis.guiConfig.fontSize - 2 + 'px';
                            select.style.cursor = 'pointer';
                            select.style.width = '35%';
                            select.style.height = classThis.guiConfig.fontSize + 10 + 'px';
                            select.style.marginLeft = '4px';
                            select.style.fontFamily = 'Baloo Paaji';
                            select.style.lineHeight = 1.5;
                            select.id = classThis.xor(index + folderName);
                            item.options.forEach(option => { const optionElement = globalDocument.createElement('option'); optionElement.value = option; optionElement.textContent = option; select.appendChild(optionElement); });
                            select.value = item.property ? item.object[item.property] : item.object;
                            select.addEventListener('change', () => { select.blur(); item.property ? item.object[item.property] = select.value : item.object = select.value; item.onChange ? item.onChange(select.value) : void 0; item.action ? item.action(select.value) : void 0; });
                            selectWrapper.appendChild(selectLabel);
                            selectWrapper.appendChild(select);
                            contentBox.appendChild(selectWrapper);
                            classThis.realIndex++;
                            index = classThis.realIndex;
                        } else if (item.type === 'button') {
                            const buttonWrapper = globalDocument.createElement('div');
                            classThis.buttonWrapper.push(buttonWrapper);
                            buttonWrapper.style.marginLeft = '0px';
                            buttonWrapper.style.marginBottom = '4px';
                            buttonWrapper.style.display = 'flex';
                            buttonWrapper.style.alignItems = 'center';
                            buttonWrapper.style.backgroundColor = '#2a2a2a';
                            buttonWrapper.style.padding = '2px 10px';
                            buttonWrapper.style.borderRadius = '4px';
                            buttonWrapper.style.transition = 'background-color 0.3s';
                            buttonWrapper.style.cursor = classThis.guiConfig.draggable ? 'grab' : 'default';
                            buttonWrapper.style.lineHeight = 1.5;
                            buttonWrapper.addEventListener('mouseenter', () => { buttonWrapper.style.backgroundColor = '#444'; });
                            buttonWrapper.addEventListener('mouseleave', () => { buttonWrapper.style.backgroundColor = '#2a2a2a'; });
                            const button = globalDocument.createElement('button');
                            classThis.button.push(button);
                            button.textContent = item.label;
                            button.style.backgroundColor = '#444';
                            button.style.color = '#fff';
                            button.style.border = '3.5px solid #555';
                            button.style.borderRadius = '4px';
                            button.style.cursor = 'pointer';
                            button.style.minWidth = container.width / 8 + 'px';
                            button.style.transition = 'background 0.3s, transform 0.2s';
                            button.style.padding = '1px';
                            button.style.flexGrow = '1';
                            button.style.lineHeight = 1.5;
                            button.style.fontSize = classThis.guiConfig.fontSize - 2 + 'px';
                            button.style.fontFamily = 'Baloo Paaji';
                            button.style.height = classThis.guiConfig.fontSize + 10 + 'px';
                            button.id = classThis.xor(index + folderName);
                            button.addEventListener('mouseenter', () => { button.style.backgroundColor = '#555'; });
                            button.addEventListener('mouseleave', () => { button.style.backgroundColor = '#444'; });
                            button.addEventListener('click', () => { item.action ? item.action() : void 0; classThis.updateGuiValues(); });
                            buttonWrapper.appendChild(button);
                            contentBox.appendChild(buttonWrapper);
                            classThis.realIndex++;
                            index = classThis.realIndex;
                        } else if (item.type === 'text') {
                            const textWrapper = globalDocument.createElement('div');
                            classThis.textWrapper.push(textWrapper);
                            textWrapper.style.marginLeft = '0px';
                            textWrapper.style.marginBottom = '4px';
                            textWrapper.style.display = 'flex';
                            textWrapper.style.alignItems = 'center';
                            textWrapper.style.backgroundColor = '#2a2a2a';
                            textWrapper.style.padding = '2px 10px';
                            textWrapper.style.borderRadius = '4px';
                            textWrapper.style.cursor = classThis.guiConfig.draggable ? 'grab' : 'default';
                            textWrapper.style.lineHeight = 1.5;
                            const textLabel = globalDocument.createElement('label');
                            classThis.textLabel.push(textLabel);
                            textLabel.textContent = item.label;
                            textLabel.style.color = '#fff';
                            textLabel.style.fontSize = classThis.guiConfig.fontSize + 2 + 'px';
                            textLabel.style.marginRight = '8px';
                            textLabel.style.flexGrow = '1';
                            textLabel.style.cursor = classThis.guiConfig.draggable ? 'grab' : 'default';
                            textLabel.style.lineHeight = 1.5;
                            const textInput = globalDocument.createElement('input');
                            classThis.textInput.push(textInput);
                            textInput.type = 'text';
                            textInput.value = item.property ? item.object[item.property] : item.object;
                            textInput.style.padding = '0px 0px 0px 4px';
                            textInput.style.fontSize = classThis.guiConfig.fontSize - 2 + 'px';
                            textInput.style.border = '3.5px solid #555';
                            textInput.style.borderRadius = '4px';
                            textInput.style.backgroundColor = '#444';
                            textInput.style.color = '#fff';
                            textInput.style.lineHeight = 1.5;
                            textInput.style.fontFamily = 'Baloo Paaji';
                            textInput.style.width = '40%';
                            textInput.style.minHeight = '20px';
                            textInput.id = classThis.xor(index + folderName);
                            let originalValue = textInput.value;
                            textInput.addEventListener('focus', () => { originalValue = textInput.value; });
                            const handleValueChange = () => { const newValue = textInput.value; if (newValue !== originalValue) { if (item.property) item.object[item.property] = newValue; else item.object = newValue; item.onChange ? item.onChange(newValue) : void 0; item.action ? item.action(newValue) : void 0; }; };
                            textInput.addEventListener('focusout', handleValueChange);
                            textInput.addEventListener('keyup', () => { if (event.key === 'Enter') { textInput.blur(); }; });
                            textWrapper.appendChild(textLabel);
                            textWrapper.appendChild(textInput);
                            contentBox.appendChild(textWrapper);
                            classThis.realIndex++;
                            index = classThis.realIndex;
                        } else if (item.type === 'subfolder') {
                            const subfolderWrapper = globalDocument.createElement('div');
                            subfolderWrapper.style.marginLeft = '0px';
                            subfolderWrapper.style.backgroundColor = '#2a2a2a';
                            subfolderWrapper.style.padding = '0px';
                            subfolderWrapper.style.marginBottom = '4px';
                            subfolderWrapper.style.borderRadius = '4px';
                            subfolderWrapper.style.cursor = 'pointer';
                            subfolderWrapper.style.lineHeight = '1.5';
                            subfolderWrapper.style.display = 'flex';
                            subfolderWrapper.style.flexDirection = 'column';
                            const subfolderTopHalf = globalDocument.createElement('div');
                            subfolderTopHalf.style.flex = '1';
                            subfolderTopHalf.style.display = 'flex';
                            subfolderTopHalf.style.alignItems = 'center';
                            subfolderTopHalf.style.padding = '2px 10px';
                            subfolderTopHalf.style.transition = 'background-color 0.3s';
                            subfolderTopHalf.style.position = 'relative';
                            subfolderTopHalf.style.zIndex = '1';
                            subfolderTopHalf.style.borderRadius = '4px';
                            const subfolderLabel = globalDocument.createElement('label');
                            classThis.subfolderLabel.push(subfolderLabel);
                            subfolderLabel.textContent = item.label;
                            subfolderLabel.style.color = '#fff';
                            subfolderLabel.style.fontSize = classThis.guiConfig.fontSize + 2 + 'px';
                            subfolderLabel.style.cursor = 'pointer';
                            subfolderLabel.style.flexGrow = '1';
                            subfolderTopHalf.appendChild(subfolderLabel);
                            const toggleIcon = globalDocument.createElement('span');
                            toggleIcon.textContent = '+';
                            toggleIcon.style.color = '#444';
                            toggleIcon.style.width = '20px';
                            toggleIcon.style.height = '20px';
                            toggleIcon.style.borderRadius = '50%';
                            toggleIcon.style.display = 'flex';
                            toggleIcon.style.alignItems = 'center';
                            toggleIcon.style.justifyContent = 'center';
                            toggleIcon.style.fontSize = '25px';
                            toggleIcon.style.cursor = 'pointer';
                            toggleIcon.style.transition = 'background-color 0.3s, color 0.3s';
                            toggleIcon.style.marginLeft = '10px';
                            subfolderTopHalf.appendChild(toggleIcon);
                            const subfolderContent = globalDocument.createElement('div');
                            subfolderContent.style.display = 'none';
                            subfolderContent.style.backgroundColor = 'rgb(55, 55, 55)';
                            subfolderContent.style.borderRadius = '4px';
                            subfolderContent.style.padding = '10px 10px 6px 0px';
                            const toggleSubfolder = () => { const isOpen = subfolderContent.style.display === 'block'; subfolderContent.style.display = isOpen ? 'none' : 'block'; toggleIcon.textContent = isOpen ? '+' : '-'; };
                            subfolderTopHalf.addEventListener('click', toggleSubfolder);
                            subfolderWrapper.addEventListener('mouseenter', () => { toggleIcon.style.color = '#fff'; });
                            subfolderWrapper.addEventListener('mouseleave', () => { toggleIcon.style.color = '#444'; });
                            subfolderTopHalf.addEventListener('mouseenter', () => { subfolderTopHalf.style.backgroundColor = '#444'; });
                            subfolderTopHalf.addEventListener('mouseleave', () => { subfolderTopHalf.style.backgroundColor = 'transparent'; });
                            subfolderWrapper.appendChild(subfolderTopHalf);
                            subfolderWrapper.appendChild(subfolderContent);
                            item.subfolder?.forEach((subItem) => {
                                classThis.realIndex++;
                                index = classThis.realIndex;
                                if (subItem.type === 'checkbox') {
                                    const checkboxWrapper = globalDocument.createElement('div');
                                    checkboxWrapper.className = 'checkbox-wrapper';
                                    checkboxWrapper.style.marginLeft = '15px'
                                    checkboxWrapper.style.marginBottom = '4px';
                                    checkboxWrapper.style.display = 'flex';
                                    checkboxWrapper.style.alignItems = 'center';
                                    checkboxWrapper.style.backgroundColor = '#2a2a2a';
                                    checkboxWrapper.style.padding = '2px 10px';
                                    checkboxWrapper.style.borderRadius = '4px';
                                    checkboxWrapper.style.transition = 'background-color 0.3s';
                                    checkboxWrapper.style.cursor = 'pointer';
                                    checkboxWrapper.style.lineHeight = 1.5;
                                    checkboxWrapper.addEventListener('mouseenter', () => { checkboxWrapper.style.backgroundColor = '#444'; });
                                    checkboxWrapper.addEventListener('mouseleave', () => { checkboxWrapper.style.backgroundColor = '#2a2a2a'; });
                                    const checkBoxLabel = globalDocument.createElement('label');
                                    classThis.checkBoxLabel.push(checkBoxLabel);
                                    checkBoxLabel.textContent = ' ' + subItem.label;
                                    checkBoxLabel.style.color = '#fff';
                                    checkBoxLabel.style.fontSize = classThis.guiConfig.fontSize + 2 - 2 + 'px';
                                    checkBoxLabel.style.cursor = 'pointer';
                                    checkBoxLabel.style.flexGrow = '1';
                                    const checkbox = globalDocument.createElement('input');
                                    checkbox.type = 'checkbox';
                                    checkbox.checked = subItem.property ? subItem.object[subItem.property] : subItem.object;
                                    checkbox.id = classThis.xor(index + folderName);
                                    checkbox.style.margin = '0px';
                                    checkboxWrapper.addEventListener('click', (e) => { if (e.target !== checkbox) { checkbox.checked = !checkbox.checked; subItem.property ? subItem.object[subItem.property] = Number(checkbox.checked) : subItem.object = Number(checkbox.checked); subItem.onChange ? subItem.onChange(Number(checkbox.checked)) : void 0; subItem.action ? subItem.action(Number(checkbox.checked)) : void 0; classThis.updateGuiValues(); }; });
                                    checkbox.addEventListener('change', () => { checkbox.blur(); subItem.property ? subItem.object[subItem.property] = Number(checkbox.checked) : subItem.object = Number(checkbox.checked); subItem.onChange ? subItem.onChange(Number(checkbox.checked)) : void 0; subItem.action ? subItem.action(Number(checkbox.checked)) : void 0; classThis.updateGuiValues(); });
                                    checkboxWrapper.appendChild(checkBoxLabel);
                                    checkboxWrapper.appendChild(checkbox);
                                    subfolderContent.appendChild(checkboxWrapper);
                                } else if (subItem.type === 'range') {
                                    const rangeWrapper = globalDocument.createElement('div');
                                    classThis.rangeWrapper.push(rangeWrapper);
                                    rangeWrapper.style.marginLeft = '15px'
                                    rangeWrapper.style.marginBottom = '4px';
                                    rangeWrapper.style.backgroundColor = '#2a2a2a';
                                    rangeWrapper.style.padding = '10px 10px';
                                    rangeWrapper.style.borderRadius = '4px';
                                    rangeWrapper.style.transition = 'background-color 0.3s';
                                    rangeWrapper.style.cursor = classThis.guiConfig.draggable ? 'grab' : 'default';
                                    rangeWrapper.addEventListener('mouseenter', () => { rangeWrapper.style.backgroundColor = '#444'; });
                                    rangeWrapper.addEventListener('mouseleave', () => { rangeWrapper.style.backgroundColor = '#2a2a2a'; });
                                    const labelValueWrapper = globalDocument.createElement('div');
                                    labelValueWrapper.style.display = 'flex';
                                    labelValueWrapper.style.justifyContent = 'space-between';
                                    labelValueWrapper.style.alignItems = 'center';
                                    labelValueWrapper.style.width = '100%';
                                    labelValueWrapper.style.marginBottom = '10px';
                                    const rangeLabel = globalDocument.createElement('label');
                                    classThis.rangeLabel.push(rangeLabel);
                                    rangeLabel.textContent = ' ' + subItem.label;
                                    rangeLabel.style.color = '#fff';
                                    rangeLabel.style.fontSize = classThis.guiConfig.fontSize + 2 - 2 + 'px';
                                    rangeLabel.style.cursor = classThis.guiConfig.draggable ? 'grab' : 'default';
                                    rangeLabel.style.flexShrink = '0';
                                    const rangeValueDisplay = globalDocument.createElement('input');
                                    classThis.rangeValueDisplay.push(rangeValueDisplay);
                                    rangeValueDisplay.type = 'number';
                                    rangeValueDisplay.id = classThis.xor(index + folderName);
                                    rangeValueDisplay.value = subItem.property ? subItem.object[subItem.property] : subItem.object;
                                    rangeValueDisplay.min = subItem.min;
                                    rangeValueDisplay.max = subItem.max;
                                    rangeValueDisplay.step = subItem.step || 1;
                                    rangeValueDisplay.style.width = '80px';
                                    rangeValueDisplay.style.color = '#fff';
                                    rangeValueDisplay.style.backgroundColor = '#444';
                                    rangeValueDisplay.style.border = '3.5px solid #555';
                                    rangeValueDisplay.style.borderRadius = '4px';
                                    rangeValueDisplay.style.fontSize = classThis.guiConfig.fontSize - 2 - 2 + 'px';
                                    rangeValueDisplay.style.textAlign = 'center';
                                    rangeValueDisplay.style.paddingLeft = '10px';
                                    rangeValueDisplay.style.boxSizing = 'border-box';
                                    rangeValueDisplay.style.padding = '0px 0px 0px 12px';
                                    rangeValueDisplay.style.lineHeight = 1.5;
                                    rangeValueDisplay.style.fontFamily = 'Baloo Paaji';
                                    rangeValueDisplay.style.width = '25%';
                                    rangeValueDisplay.style.minHeight = '20px';
                                    rangeValueDisplay.style.flexShrink = '0';
                                    labelValueWrapper.appendChild(rangeLabel);
                                    labelValueWrapper.appendChild(rangeValueDisplay);
                                    const rangeSliderWrapper = globalDocument.createElement('div');
                                    rangeSliderWrapper.style.width = '100%';
                                    const range = globalDocument.createElement('input');
                                    classThis.range.push(range);
                                    range.type = 'range';
                                    range.min = subItem.min;
                                    range.max = subItem.max;
                                    range.step = subItem.step || 1;
                                    range.value = subItem.property ? subItem.object[subItem.property] : subItem.object;
                                    range.id = classThis.xor(index + folderName);
                                    range.style.width = '100%';
                                    range.style.borderRadius = '5px';
                                    range.style.outline = 'none';
                                    range.style.transition = 'background 0.3s';
                                    range.style.cursor = 'pointer';
                                    range.style.margin = '0px';
                                    range.style.minHeight = '6px';
                                    range.style.height = classThis.guiConfig.fontSize - 8 - 2 + 'px';
                                    rangeSliderWrapper.appendChild(range);
                                    let isDragging = false;
                                    let lastValue = range.value;
                                    range.addEventListener('input', () => { range.blur(); rangeValueDisplay.value = range.value; });
                                    range.addEventListener('mousedown', () => { isDragging = true; });
                                    range.addEventListener('mouseup', () => { if (isDragging) { isDragging = false; let newValue = Number(rangeValueDisplay.value); if (newValue !== lastValue) { lastValue = newValue; range.value = newValue; subItem.property ? subItem.object[subItem.property] = Number(range.value) : subItem.object = Number(range.value); if (subItem.onChange) subItem.onChange(newValue); if (subItem.action) subItem.action(newValue); } classThis.updateGuiValues(); } });
                                    rangeValueDisplay.addEventListener('focusout', () => { rangeValueDisplay.blur(); let newValue = Number(rangeValueDisplay.value); if (newValue !== lastValue) { lastValue = newValue; if (isNaN(newValue) || newValue < subItem.min || newValue > subItem.max) { newValue = Number(lastValue); } range.value = newValue; subItem.property ? subItem.object[subItem.property] = Number(range.value) : subItem.object = Number(range.value); if (subItem.onChange) subItem.onChange(newValue); if (subItem.action) subItem.action(newValue); classThis.updateGuiValues(); } });
                                    rangeValueDisplay.addEventListener('keyup', (event) => { if (event.key === 'Enter') rangeValueDisplay.blur(); });
                                    rangeWrapper.appendChild(labelValueWrapper);
                                    rangeWrapper.appendChild(rangeSliderWrapper);
                                    subfolderContent.appendChild(rangeWrapper);
                                } else if (subItem.type === 'bind') {
                                    const bindWrapper = globalDocument.createElement('div');
                                    classThis.bindWrapper.push(bindWrapper);
                                    bindWrapper.style.marginLeft = '15px'
                                    bindWrapper.style.display = 'flex';
                                    bindWrapper.style.alignItems = 'center';
                                    bindWrapper.style.marginBottom = '4px';
                                    bindWrapper.style.backgroundColor = '#2a2a2a';
                                    bindWrapper.style.padding = '2px 10px';
                                    bindWrapper.style.borderRadius = '4px';
                                    bindWrapper.style.transition = 'background-color 0.3s';
                                    bindWrapper.style.cursor = classThis.guiConfig.draggable ? 'grab' : 'default';
                                    bindWrapper.style.lineHeight = 1.5;
                                    bindWrapper.addEventListener('mouseenter', () => { bindWrapper.style.backgroundColor = '#444'; });
                                    bindWrapper.addEventListener('mouseleave', () => { bindWrapper.style.backgroundColor = '#2a2a2a'; });
                                    const bindLabel = globalDocument.createElement('span');
                                    classThis.bindLabel.push(bindLabel);
                                    bindLabel.textContent = ' ' + subItem.label;
                                    bindLabel.style.color = '#fff';
                                    bindLabel.style.fontSize = classThis.guiConfig.fontSize + 2 - 2 + 'px';
                                    bindLabel.style.marginRight = '8px';
                                    bindLabel.style.flexGrow = '1';
                                    const bindButton = globalDocument.createElement('div');
                                    classThis.bindButton.push(bindButton);
                                    bindButton.textContent = subItem.buttonTextObject && subItem.buttonTextProperty ? subItem.buttonTextObject[subItem.buttonTextProperty] : 'Click Me';
                                    bindButton.style.backgroundColor = '#444';
                                    bindButton.style.padding = '2px';
                                    bindButton.style.color = '#fff';
                                    bindButton.style.border = '3.5px solid #555';
                                    bindButton.style.borderRadius = '4px';
                                    bindButton.style.cursor = 'pointer';
                                    bindButton.style.minWidth = container.width / 8 + 'px';
                                    bindButton.style.minWidth = '20%';
                                    bindButton.style.transition = 'background 0.3s, transform 0.2s';
                                    bindButton.style.fontSize = classThis.guiConfig.fontSize - 2 - 2 + 'px';
                                    bindButton.style.height = classThis.guiConfig.fontSize + 10 - 2 + 'px';
                                    bindButton.style.boxSizing = 'border-box';
                                    bindButton.style.lineHeight = 1.5;
                                    bindButton.id = classThis.xor(index + folderName);
                                    bindButton.addEventListener('mouseenter', () => { bindButton.style.backgroundColor = '#555'; });
                                    bindButton.addEventListener('mouseleave', () => { bindButton.style.backgroundColor = '#444'; });
                                    const overlay = globalDocument.createElement('div');
                                    classThis.overlay = overlay;
                                    overlay.style.position = 'absolute';
                                    overlay.style.top = '0';
                                    overlay.style.left = '0';
                                    overlay.style.width = '100%';
                                    overlay.style.height = '100%';
                                    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                                    overlay.style.display = 'flex';
                                    overlay.style.justifyContent = 'center';
                                    overlay.style.alignItems = 'center';
                                    overlay.style.color = '#fff';
                                    overlay.style.fontSize = classThis.guiConfig.fontSize + 6 - 2 + 'px';
                                    overlay.style.textAlign = 'center';
                                    overlay.style.zIndex = '9999';
                                    overlay.style.backdropFilter = 'blur(5px)';
                                    overlay.style.display = 'none';
                                    const overlayText = globalDocument.createElement('div');
                                    overlayText.innerHTML = 'Press any key:<br>Hold Escape to clear the bind (NONE)<br>Press Escape to cancel';
                                    overlay.appendChild(overlayText);
                                    const guiContainer = globalDocument.getElementById(classThis.xor('gui'));
                                    guiContainer.appendChild(overlay);
                                    let escapeHoldTimeout = null;
                                    const bindKeyListener = (event) => { if (event.code === 'Escape') { escapeHoldTimeout = workerTimers.setTimeout(() => { bindButton.textContent = 'NONE'; if (subItem.buttonTextObject && subItem.buttonTextProperty) subItem.buttonTextObject[subItem.buttonTextProperty] = 'NONE'; classThis.overlay.style.display = 'none'; globalDocument.removeEventListener('keydown', bindKeyListener); if (subItem.onChange) subItem.onChange(); if (subItem.action) subItem.action(); }, 250); } else { const newBind = event.code; bindButton.textContent = newBind; if (subItem.buttonTextObject && subItem.buttonTextProperty) subItem.buttonTextObject[subItem.buttonTextProperty] = newBind; classThis.overlay.style.display = 'none'; globalDocument.removeEventListener('keydown', bindKeyListener); clearTimeout(escapeHoldTimeout); if (subItem.onChange) subItem.onChange(); if (subItem.action) subItem.action(); }; };
                                    const escapeKeyListener = (event) => { if (event.code === 'Escape') { clearTimeout(escapeHoldTimeout); classThis.overlay.style.display = 'none'; globalDocument.removeEventListener('keydown', bindKeyListener); } };
                                    bindButton.addEventListener('click', () => { classThis.overlay.style.display = 'flex'; globalDocument.addEventListener('keydown', bindKeyListener); globalDocument.addEventListener('keyup', escapeKeyListener); });
                                    bindWrapper.appendChild(bindLabel);
                                    bindWrapper.appendChild(bindButton);
                                    subfolderContent.appendChild(bindWrapper);
                                } else if (subItem.type === 'select') {
                                    const selectWrapper = globalDocument.createElement('div');
                                    classThis.selectWrapper.push(selectWrapper);
                                    selectWrapper.style.marginLeft = '15px'
                                    selectWrapper.style.marginBottom = '4px';
                                    selectWrapper.style.display = 'flex';
                                    selectWrapper.style.alignItems = 'center';
                                    selectWrapper.style.backgroundColor = '#2a2a2a';
                                    selectWrapper.style.padding = '2px 10px';
                                    selectWrapper.style.borderRadius = '4px';
                                    selectWrapper.style.transition = 'background-color 0.3s';
                                    selectWrapper.style.cursor = classThis.guiConfig.draggable ? 'grab' : 'default';
                                    selectWrapper.style.lineHeight = 1.5;
                                    selectWrapper.addEventListener('mouseenter', () => { selectWrapper.style.backgroundColor = '#444'; });
                                    selectWrapper.addEventListener('mouseleave', () => { selectWrapper.style.backgroundColor = '#2a2a2a'; });
                                    const selectLabel = globalDocument.createElement('label');
                                    classThis.selectLabel.push(selectLabel);
                                    selectLabel.textContent = ' ' + subItem.label;
                                    selectLabel.style.color = '#fff';
                                    selectLabel.style.fontSize = classThis.guiConfig.fontSize + 2 - 2 + 'px';
                                    selectLabel.style.cursor = classThis.guiConfig.draggable ? 'grab' : 'default';
                                    selectLabel.style.marginRight = '8px';
                                    selectLabel.style.flexGrow = '1';
                                    selectLabel.style.lineHeight = 1.5;
                                    const select = globalDocument.createElement('select');
                                    classThis.select.push(select);
                                    select.style.backgroundColor = '#444';
                                    select.style.color = '#fff';
                                    select.style.border = '3.5px solid #555';
                                    select.style.borderRadius = '4px';
                                    select.style.fontSize = classThis.guiConfig.fontSize - 2 - 2 + 'px';
                                    select.style.cursor = 'pointer';
                                    select.style.width = '35%';
                                    select.style.height = classThis.guiConfig.fontSize + 10 - 2 + 'px';
                                    select.style.marginLeft = '4px';
                                    select.style.fontFamily = 'Baloo Paaji';
                                    select.style.lineHeight = 1.5;
                                    select.id = classThis.xor(index + folderName);
                                    subItem.options.forEach(option => { const optionElement = globalDocument.createElement('option'); optionElement.value = option; optionElement.textContent = option; select.appendChild(optionElement); });
                                    select.value = subItem.property ? subItem.object[subItem.property] : subItem.object;
                                    select.addEventListener('change', () => { select.blur(); subItem.property ? subItem.object[subItem.property] = select.value : subItem.object = select.value; subItem.onChange ? subItem.onChange(select.value) : void 0; subItem.action ? subItem.action(select.value) : void 0; });
                                    selectWrapper.appendChild(selectLabel);
                                    selectWrapper.appendChild(select);
                                    subfolderContent.appendChild(selectWrapper);
                                } else if (subItem.type === 'button') {
                                    const buttonWrapper = globalDocument.createElement('div');
                                    classThis.buttonWrapper.push(buttonWrapper);
                                    buttonWrapper.style.marginLeft = '15px'
                                    buttonWrapper.style.marginBottom = '4px';
                                    buttonWrapper.style.display = 'flex';
                                    buttonWrapper.style.alignItems = 'center';
                                    buttonWrapper.style.backgroundColor = '#2a2a2a';
                                    buttonWrapper.style.padding = '2px 10px';
                                    buttonWrapper.style.borderRadius = '4px';
                                    buttonWrapper.style.transition = 'background-color 0.3s';
                                    buttonWrapper.style.cursor = classThis.guiConfig.draggable ? 'grab' : 'default';
                                    buttonWrapper.style.lineHeight = 1.5;
                                    buttonWrapper.addEventListener('mouseenter', () => { buttonWrapper.style.backgroundColor = '#444'; });
                                    buttonWrapper.addEventListener('mouseleave', () => { buttonWrapper.style.backgroundColor = '#2a2a2a'; });
                                    const button = globalDocument.createElement('button');
                                    classThis.button.push(button);
                                    button.textContent = ' ' + subItem.label;
                                    button.style.backgroundColor = '#444';
                                    button.style.color = '#fff';
                                    button.style.border = '3.5px solid #555';
                                    button.style.borderRadius = '4px';
                                    button.style.cursor = 'pointer';
                                    button.style.minWidth = container.width / 8 + 'px';
                                    button.style.transition = 'background 0.3s, transform 0.2s';
                                    button.style.padding = '1px';
                                    button.style.flexGrow = '1';
                                    button.style.lineHeight = 1.5;
                                    button.style.fontSize = classThis.guiConfig.fontSize - 2 - 2 + 'px';
                                    button.style.fontFamily = 'Baloo Paaji';
                                    button.style.height = classThis.guiConfig.fontSize + 10 - 2 + 'px';
                                    button.id = classThis.xor(index + folderName);
                                    button.addEventListener('mouseenter', () => { button.style.backgroundColor = '#555'; });
                                    button.addEventListener('mouseleave', () => { button.style.backgroundColor = '#444'; });
                                    button.addEventListener('click', () => { subItem.action ? subItem.action() : void 0; classThis.updateGuiValues(); });
                                    buttonWrapper.appendChild(button);
                                    subfolderContent.appendChild(buttonWrapper);
                                } else if (subItem.type === 'text') {
                                    const textWrapper = globalDocument.createElement('div');
                                    classThis.textWrapper.push(textWrapper);
                                    textWrapper.style.marginLeft = '15px'
                                    textWrapper.style.marginBottom = '4px';
                                    textWrapper.style.display = 'flex';
                                    textWrapper.style.alignItems = 'center';
                                    textWrapper.style.backgroundColor = '#2a2a2a';
                                    textWrapper.style.padding = '2px 10px';
                                    textWrapper.style.borderRadius = '4px';
                                    textWrapper.style.cursor = classThis.guiConfig.draggable ? 'grab' : 'default';
                                    textWrapper.style.lineHeight = 1.5;
                                    const textLabel = globalDocument.createElement('label');
                                    classThis.textLabel.push(textLabel);
                                    textLabel.textContent = ' ' + subItem.label;
                                    textLabel.style.color = '#fff';
                                    textLabel.style.fontSize = classThis.guiConfig.fontSize + 2 - 2 + 'px';
                                    textLabel.style.marginRight = '8px';
                                    textLabel.style.flexGrow = '1';
                                    textLabel.style.cursor = classThis.guiConfig.draggable ? 'grab' : 'default';
                                    textLabel.style.lineHeight = 1.5;
                                    const textInput = globalDocument.createElement('input');
                                    classThis.textInput.push(textInput);
                                    textInput.type = 'text';
                                    textInput.value = subItem.property ? subItem.object[subItem.property] : subItem.object;
                                    textInput.style.padding = '0px 0px 0px 4px';
                                    textInput.style.fontSize = classThis.guiConfig.fontSize - 2 - 2 + 'px';
                                    textInput.style.border = '3.5px solid #555';
                                    textInput.style.borderRadius = '4px';
                                    textInput.style.backgroundColor = '#444';
                                    textInput.style.color = '#fff';
                                    textInput.style.lineHeight = 1.5;
                                    textInput.style.fontFamily = 'Baloo Paaji';
                                    textInput.style.width = '40%';
                                    textInput.style.minHeight = '20px';
                                    textInput.id = classThis.xor(index + folderName);
                                    let originalValue = textInput.value;
                                    textInput.addEventListener('focus', () => { originalValue = textInput.value; });
                                    const handleValueChange = () => { const newValue = textInput.value; if (newValue !== originalValue) { if (subItem.property) subItem.object[subItem.property] = newValue; else subItem.object = newValue; subItem.onChange ? subItem.onChange(newValue) : void 0; subItem.action ? subItem.action(newValue) : void 0; }; };
                                    textInput.addEventListener('focusout', handleValueChange);
                                    textInput.addEventListener('keyup', () => { if (event.key === 'Enter') { textInput.blur(); }; });
                                    textWrapper.appendChild(textLabel);
                                    textWrapper.appendChild(textInput);
                                    subfolderContent.appendChild(textWrapper);
                                }
                            });
                            contentBox.appendChild(subfolderWrapper);
                            classThis.realIndex++;
                            index = classThis.realIndex;
                        };
                    });
                };
                Object.keys(classThis.guiConfig.folders).forEach(folder => {
                    const folderButton = globalDocument.createElement('button');
                    classThis.folderButton.push(folderButton);
                    folderButton.textContent = folder;
                    folderButton.style.backgroundColor = 'rgb(51, 51, 51)';
                    folderButton.style.color = '#fff';
                    folderButton.style.border = 'none';
                    folderButton.style.padding = '4px';
                    folderButton.style.fontSize = classThis.guiConfig.fontSize + 6 + 'px';
                    folderButton.style.borderRadius = '3px';
                    folderButton.style.cursor = 'pointer';
                    folderButton.addEventListener('click', () => { renderFolderContents(folder, classThis.guiConfig.folders[folder]); folderButton.blur(); });
                    sidebar.appendChild(folderButton);
                });
                if (Object.keys(classThis.guiConfig.folders).length > 0) { const firstFolder = Object.keys(classThis.guiConfig.folders)[0]; renderFolderContents(firstFolder, classThis.guiConfig.folders[firstFolder]); };
                const buttons = globalDocument.querySelectorAll('#' + classThis.xor('sidebar') + ' button');
                buttons[0] ? buttons[0].classList.add('active') : void 0;
                buttons[0] ? buttons.forEach(button => { button.addEventListener('click', function () { buttons.forEach(btn => btn.classList.remove('active')); this.classList.add('active'); }); }) : void 0;
                const guiElement = globalDocument.getElementById(classThis.xor('gui'));
                const stopPropagation = (event) => { event.stopPropagation(); };
                guiElement.addEventListener('mouseup', stopPropagation, false);
                guiElement.addEventListener('mousedown', stopPropagation, false);
                guiElement.addEventListener('keydown', stopPropagation, false);
                guiElement.addEventListener('keyup', stopPropagation, false);
            };
            globalDocument.head.appendChild(link);
        };
    };

    let originalWelcome = function () { };
    let originalSendChat = function () { };
    let originalChat = function () { };
    let originalSelectInv = function () { };

    /* Users Script Password */
    let scriptPassword = '';
    let scriptGui = null;

    /* Protection Variables */
    let dateNowIntegrity = false;
    let loadVerified = false;
    let verifiedToggle = false;

    /* Display Whether Code Is Developer Code */
    let devMODE = false; if ('{{EXPIRY_DATE_PLACEHOLDER}}'.includes('EXPIRY_DATE_PLACEHOLDER')) devMODE = true;
    let disableLogs = false;
    let spawnPacketSent = false;

    let scriptSocket = null, info;
    let domainLock = 'websocket.network';
    let globalProps = [];
    let hooksFound = false;
    let client = 0, game = 0, ui = 0, world = 0, user = 0;
    let hiddenClient = {}, hiddenGame = {}, hiddenUi = {}, hiddenWorld = {}, hiddenUser = {};
    let specialProps = {};
    let map = { width: 0, height: 0 };
    let SPRITE = { LEADERBOARD: 388, BIGMAP: 654 };

    let sendIDS = {};
    let lastSocketValue = null;
    let hookInterval;

    /* General Variables */
    let can, ctx, canw2, canh2;
    let Spectator = false;
    let pingSent = false;
    let pingStart = 0;
    let currentPing = 0;
    let pingInterval = 0;
    let inBedDetected = 0;
    let healTick = 0;
    let timerInterval = globalDocument[defaultViewString][DateString][nowString]();
    let arrayOfPlayersToDraw = [], arrayOfVehiclesToDraw = [], arrayOfCratesToDraw = [];
    let savedFunctions = {};
    let definePlayerProps = true;
    let defineAnimationProps = true;
    let defineChestProps = true;
    let defineRoofProps = true;
    let delta = 0, old_timestamp = 0;
    let lastCrafted = -1;
    let lastRecycled = -1;
    let lastSmartCraft = -1;
    let joinRateLimit = Date.now();
    let awaitingJoin = 0;
    let playingGame = 0;
    let internetOn = true;
    let onopenCalled = false;
    let backupHoldINT = 0;
    let reconnectLoop = 0;
    let gameQuitCalled = 0;
    let playerIntervals = {};
    let savedWelcomeMessage = '';
    let backToLobby = false;
    let lastSaveTimestamp = 0;
    let saveTimeout = null;
    let guiConfiguration = {};
    let lastTokenSentTime = 0;
    let guiCreated = false;
    let playerPropeties = { bag: void 0, book: void 0, acc: void 0, skin: void 0 };
    let originalBook = 0;
    let originalAcc = 0;
    let originalBag = 0;
    let originalSkin = 0;
    let changeableSkin = 0;

    let JoinLeave = {
        Join: [],
        Leave: [],
        newPlayerInt: false,
        newPlayerToggle: false,
        killPlayerInt: false,
        killPlayerToggle: false
    };

    let joinArgs = {};

    /* SandStorm Blizzard And Chest Images */
    let sandstorm, blizzard, chestAlly, chestEnemy;
    sandstorm = new Image();
    blizzard = new Image();
    chestAlly = new Image();
    chestEnemy = new Image();

    /* Spike Image Creation */
    SPRITE.WOOD_SPIKE_ALLY = new Image();
    SPRITE.STONE_SPIKE_ALLY = new Image();
    SPRITE.GOLD_SPIKE_ALLY = new Image();
    SPRITE.DIAMOND_SPIKE_ALLY = new Image();
    SPRITE.AMETHYST_SPIKE_ALLY = new Image();
    SPRITE.REIDITE_SPIKE_ALLY = new Image();
    SPRITE.WOOD_SPIKE_ENEMY = new Image();
    SPRITE.STONE_SPIKE_ENEMY = new Image();
    SPRITE.GOLD_SPIKE_ENEMY = new Image();
    SPRITE.DIAMOND_SPIKE_ENEMY = new Image();
    SPRITE.AMETHYST_SPIKE_ENEMY = new Image();
    SPRITE.REIDITE_SPIKE_ENEMY = new Image();
    SPRITE.WOOD_DOOR_ALLY = new Image();
    SPRITE.STONE_DOOR_ALLY = new Image();
    SPRITE.GOLD_DOOR_ALLY = new Image();
    SPRITE.DIAMOND_DOOR_ALLY = new Image();
    SPRITE.AMETHYST_DOOR_ALLY = new Image();
    SPRITE.REIDITE_DOOR_ALLY = new Image();
    SPRITE.WOOD_DOOR_ENEMY = new Image();
    SPRITE.STONE_DOOR_ENEMY = new Image();
    SPRITE.GOLD_DOOR_ENEMY = new Image();
    SPRITE.DIAMOND_DOOR_ENEMY = new Image();
    SPRITE.AMETHYST_DOOR_ENEMY = new Image();
    SPRITE.REIDITE_DOOR_ENEMY = new Image();
    SPRITE.SPIKED_WOOD_DOOR_ALLY = new Image();
    SPRITE.SPIKED_STONE_DOOR_ALLY = new Image();
    SPRITE.SPIKED_GOLD_DOOR_ALLY = new Image();
    SPRITE.SPIKED_DIAMOND_DOOR_ALLY = new Image();
    SPRITE.SPIKED_AMETHYST_DOOR_ALLY = new Image();
    SPRITE.SPIKED_REIDITE_DOOR_ALLY = new Image();
    SPRITE.SPIKED_WOOD_DOOR_ENEMY = new Image();
    SPRITE.SPIKED_STONE_DOOR_ENEMY = new Image();
    SPRITE.SPIKED_GOLD_DOOR_ENEMY = new Image();
    SPRITE.SPIKED_DIAMOND_DOOR_ENEMY = new Image();
    SPRITE.SPIKED_AMETHYST_DOOR_ENEMY = new Image();
    SPRITE.SPIKED_REIDITE_DOOR_ENEMY = new Image();

    function loadIconTextures() {
        sandstorm.src = localhostMode ? (localHostString + '62' + pngString) : (voidString + '62' + pngString);
        blizzard.src = localhostMode ? (localHostString + '8' + pngString) : (voidString + '8' + pngString);
    };

    /* Colored Spikes Image Textures */
    function loadSpikeTextures() {
        if (Settings.ColoredSpikes.texture == 'Light') {
            if (SPRITE.WOOD_SPIKE_ALLY) {
                SPRITE.WOOD_SPIKE_ALLY.src = localhostMode ? (localHostString + '69' + pngString) : (voidString + "69" + pngString);
                SPRITE.STONE_SPIKE_ALLY.src = localhostMode ? (localHostString + '65' + pngString) : (voidString + "65" + pngString);
                SPRITE.GOLD_SPIKE_ALLY.src = localhostMode ? (localHostString + '54' + pngString) : (voidString + "54" + pngString);
                SPRITE.DIAMOND_SPIKE_ALLY.src = localhostMode ? (localHostString + '38' + pngString) : (voidString + "38" + pngString);
                SPRITE.AMETHYST_SPIKE_ALLY.src = localhostMode ? (localHostString + '3' + pngString) : (voidString + "3" + pngString);
                SPRITE.REIDITE_SPIKE_ALLY.src = localhostMode ? (localHostString + '58' + pngString) : (voidString + "58" + pngString);
                SPRITE.WOOD_SPIKE_ENEMY.src = localhostMode ? (localHostString + '72' + pngString) : (voidString + "72" + pngString);
                SPRITE.STONE_SPIKE_ENEMY.src = localhostMode ? (localHostString + '68' + pngString) : (voidString + "68" + pngString);
                SPRITE.GOLD_SPIKE_ENEMY.src = localhostMode ? (localHostString + '57' + pngString) : (voidString + "57" + pngString);
                SPRITE.DIAMOND_SPIKE_ENEMY.src = localhostMode ? (localHostString + '41' + pngString) : (voidString + "41" + pngString);
                SPRITE.AMETHYST_SPIKE_ENEMY.src = localhostMode ? (localHostString + '6' + pngString) : (voidString + "6" + pngString);
                SPRITE.REIDITE_SPIKE_ENEMY.src = localhostMode ? (localHostString + '61' + pngString) : (voidString + "61" + pngString);
                SPRITE.WOOD_DOOR_ALLY.src = localhostMode ? (localHostString + '53' + pngString) : (voidString + "53" + pngString);
                SPRITE.STONE_DOOR_ALLY.src = localhostMode ? (localHostString + '50' + pngString) : (voidString + "50" + pngString);
                SPRITE.GOLD_DOOR_ALLY.src = localhostMode ? (localHostString + '47' + pngString) : (voidString + "47" + pngString);
                SPRITE.DIAMOND_DOOR_ALLY.src = localhostMode ? (localHostString + '45' + pngString) : (voidString + "45" + pngString);
                SPRITE.AMETHYST_DOOR_ALLY.src = localhostMode ? (localHostString + '42' + pngString) : (voidString + "42" + pngString);
                SPRITE.REIDITE_DOOR_ALLY.src = localhostMode ? (localHostString + '49' + pngString) : (voidString + "49" + pngString);
                SPRITE.WOOD_DOOR_ENEMY.src = localhostMode ? (localHostString + '52' + pngString) : (voidString + "52" + pngString);
                SPRITE.STONE_DOOR_ENEMY.src = localhostMode ? (localHostString + '51' + pngString) : (voidString + "51" + pngString);
                SPRITE.GOLD_DOOR_ENEMY.src = localhostMode ? (localHostString + '46' + pngString) : (voidString + "46" + pngString);
                SPRITE.DIAMOND_DOOR_ENEMY.src = localhostMode ? (localHostString + '44' + pngString) : (voidString + "44" + pngString);
                SPRITE.AMETHYST_DOOR_ENEMY.src = localhostMode ? (localHostString + '43' + pngString) : (voidString + "43" + pngString);
                SPRITE.REIDITE_DOOR_ENEMY.src = localhostMode ? (localHostString + '48' + pngString) : (voidString + "48" + pngString);
                SPRITE.SPIKED_WOOD_DOOR_ALLY.src = localhostMode ? (localHostString + '70' + pngString) : (voidString + "70" + pngString);
                SPRITE.SPIKED_STONE_DOOR_ALLY.src = localhostMode ? (localHostString + '66' + pngString) : (voidString + "66" + pngString);
                SPRITE.SPIKED_GOLD_DOOR_ALLY.src = localhostMode ? (localHostString + '55' + pngString) : (voidString + "55" + pngString);
                SPRITE.SPIKED_DIAMOND_DOOR_ALLY.src = localhostMode ? (localHostString + '39' + pngString) : (voidString + "39" + pngString);
                SPRITE.SPIKED_AMETHYST_DOOR_ALLY.src = localhostMode ? (localHostString + '4' + pngString) : (voidString + "4" + pngString);
                SPRITE.SPIKED_REIDITE_DOOR_ALLY.src = localhostMode ? (localHostString + '59' + pngString) : (voidString + "59" + pngString);
                SPRITE.SPIKED_WOOD_DOOR_ENEMY.src = localhostMode ? (localHostString + '71' + pngString) : (voidString + "71" + pngString);
                SPRITE.SPIKED_STONE_DOOR_ENEMY.src = localhostMode ? (localHostString + '67' + pngString) : (voidString + "67" + pngString);
                SPRITE.SPIKED_GOLD_DOOR_ENEMY.src = localhostMode ? (localHostString + '56' + pngString) : (voidString + "56" + pngString);
                SPRITE.SPIKED_DIAMOND_DOOR_ENEMY.src = localhostMode ? (localHostString + '40' + pngString) : (voidString + "40" + pngString);
                SPRITE.SPIKED_AMETHYST_DOOR_ENEMY.src = localhostMode ? (localHostString + '5' + pngString) : (voidString + "5" + pngString);
                SPRITE.SPIKED_REIDITE_DOOR_ENEMY.src = localhostMode ? (localHostString + '60' + pngString) : (voidString + "60" + pngString);
            };
        } else if (Settings.ColoredSpikes.texture == 'Dark') {
            if (SPRITE.WOOD_SPIKE_ALLY) {
                SPRITE.WOOD_SPIKE_ALLY.src = localhostMode ? (localHostString + '34' + pngString) : (voidString + "34" + pngString);
                SPRITE.STONE_SPIKE_ALLY.src = localhostMode ? (localHostString + '30' + pngString) : (voidString + "30" + pngString);
                SPRITE.GOLD_SPIKE_ALLY.src = localhostMode ? (localHostString + '22' + pngString) : (voidString + "22" + pngString);
                SPRITE.DIAMOND_SPIKE_ALLY.src = localhostMode ? (localHostString + '17' + pngString) : (voidString + "17" + pngString);
                SPRITE.AMETHYST_SPIKE_ALLY.src = localhostMode ? (localHostString + '13' + pngString) : (voidString + "13" + pngString);
                SPRITE.REIDITE_SPIKE_ALLY.src = localhostMode ? (localHostString + '26' + pngString) : (voidString + "26" + pngString);
                SPRITE.WOOD_SPIKE_ENEMY.src = localhostMode ? (localHostString + '37' + pngString) : (voidString + "37" + pngString);
                SPRITE.STONE_SPIKE_ENEMY.src = localhostMode ? (localHostString + '33' + pngString) : (voidString + "33" + pngString);
                SPRITE.GOLD_SPIKE_ENEMY.src = localhostMode ? (localHostString + '25' + pngString) : (voidString + "25" + pngString);
                SPRITE.DIAMOND_SPIKE_ENEMY.src = localhostMode ? (localHostString + '21' + pngString) : (voidString + "21" + pngString);
                SPRITE.AMETHYST_SPIKE_ENEMY.src = localhostMode ? (localHostString + '16' + pngString) : (voidString + "16" + pngString);
                SPRITE.REIDITE_SPIKE_ENEMY.src = localhostMode ? (localHostString + '29' + pngString) : (voidString + "29" + pngString);
                SPRITE.WOOD_DOOR_ALLY.src = localhostMode ? (localHostString + '53' + pngString) : (voidString + "53" + pngString);
                SPRITE.STONE_DOOR_ALLY.src = localhostMode ? (localHostString + '50' + pngString) : (voidString + "50" + pngString);
                SPRITE.GOLD_DOOR_ALLY.src = localhostMode ? (localHostString + '47' + pngString) : (voidString + "47" + pngString);
                SPRITE.DIAMOND_DOOR_ALLY.src = localhostMode ? (localHostString + '45' + pngString) : (voidString + "45" + pngString);
                SPRITE.AMETHYST_DOOR_ALLY.src = localhostMode ? (localHostString + '42' + pngString) : (voidString + "42" + pngString);
                SPRITE.REIDITE_DOOR_ALLY.src = localhostMode ? (localHostString + '49' + pngString) : (voidString + "49" + pngString);
                SPRITE.WOOD_DOOR_ENEMY.src = localhostMode ? (localHostString + '52' + pngString) : (voidString + "52" + pngString);
                SPRITE.STONE_DOOR_ENEMY.src = localhostMode ? (localHostString + '51' + pngString) : (voidString + "51" + pngString);
                SPRITE.GOLD_DOOR_ENEMY.src = localhostMode ? (localHostString + '46' + pngString) : (voidString + "46" + pngString);
                SPRITE.DIAMOND_DOOR_ENEMY.src = localhostMode ? (localHostString + '44' + pngString) : (voidString + "44" + pngString);
                SPRITE.AMETHYST_DOOR_ENEMY.src = localhostMode ? (localHostString + '43' + pngString) : (voidString + "43" + pngString);
                SPRITE.REIDITE_DOOR_ENEMY.src = localhostMode ? (localHostString + '48' + pngString) : (voidString + "48" + pngString);
                SPRITE.SPIKED_WOOD_DOOR_ALLY.src = localhostMode ? (localHostString + '35' + pngString) : (voidString + "35" + pngString);
                SPRITE.SPIKED_STONE_DOOR_ALLY.src = localhostMode ? (localHostString + '31' + pngString) : (voidString + "31" + pngString);
                SPRITE.SPIKED_GOLD_DOOR_ALLY.src = localhostMode ? (localHostString + '23' + pngString) : (voidString + "23" + pngString);
                SPRITE.SPIKED_DIAMOND_DOOR_ALLY.src = localhostMode ? (localHostString + '19' + pngString) : (voidString + "19" + pngString);
                SPRITE.SPIKED_AMETHYST_DOOR_ALLY.src = localhostMode ? (localHostString + '14' + pngString) : (voidString + "14" + pngString);
                SPRITE.SPIKED_REIDITE_DOOR_ALLY.src = localhostMode ? (localHostString + '27' + pngString) : (voidString + "27" + pngString);
                SPRITE.SPIKED_WOOD_DOOR_ENEMY.src = localhostMode ? (localHostString + '36' + pngString) : (voidString + "36" + pngString);
                SPRITE.SPIKED_STONE_DOOR_ENEMY.src = localhostMode ? (localHostString + '32' + pngString) : (voidString + "32" + pngString);
                SPRITE.SPIKED_GOLD_DOOR_ENEMY.src = localhostMode ? (localHostString + '24' + pngString) : (voidString + "24" + pngString);
                SPRITE.SPIKED_DIAMOND_DOOR_ENEMY.src = localhostMode ? (localHostString + '20' + pngString) : (voidString + "20" + pngString);
                SPRITE.SPIKED_AMETHYST_DOOR_ENEMY.src = localhostMode ? (localHostString + '15' + pngString) : (voidString + "15" + pngString);
                SPRITE.SPIKED_REIDITE_DOOR_ENEMY.src = localhostMode ? (localHostString + '28' + pngString) : (voidString + "28" + pngString);
            };
        };
    };

    function loadChestTextures() {
        if (Settings.chestInfo.texture == 'Bright') {
            /* Bright */
            chestAlly.src = localhostMode ? (localHostString + '9' + pngString) : (voidString + '9' + pngString);
            chestEnemy.src = localhostMode ? (localHostString + '12' + pngString) : (voidString + '12' + pngString);
        } else if (Settings.chestInfo.texture == 'Light') {
            /* Light */
            chestAlly.src = localhostMode ? (localHostString + '1' + pngString) : (voidString + '1' + pngString);
            chestEnemy.src = localhostMode ? (localHostString + '2' + pngString) : (voidString + '2' + pngString);
        } else if (Settings.chestInfo.texture == 'Dark') {
            /* Dark */
            chestAlly.src = localhostMode ? (localHostString + '10' + pngString) : (voidString + '10' + pngString);
            chestEnemy.src = localhostMode ? (localHostString + '11' + pngString) : (voidString + '11' + pngString);
        };
    };

    /* WORLD UNITS IDS */
    const ITEMS = { PLAYERS: 0, FIRE: 1, WORKBENCH: 2, SEED: 3, WALL: 4, SPIKE: 5, BIG_FIRE: 6, STONE_WALL: 7, GOLD_WALL: 8, DIAMOND_WALL: 9, WOOD_DOOR: 10, CHEST: 11, STONE_SPIKE: 12, GOLD_SPIKE: 13, DIAMOND_SPIKE: 14, STONE_DOOR: 15, GOLD_DOOR: 16, DIAMOND_DOOR: 17, FURNACE: 18, AMETHYST_WALL: 19, AMETHYST_SPIKE: 20, AMETHYST_DOOR: 21, RESURRECTION: 22, EMERALD_MACHINE: 23, EXTRACTOR_MACHINE_STONE: 24, EXTRACTOR_MACHINE_GOLD: 25, EXTRACTOR_MACHINE_DIAMOND: 26, EXTRACTOR_MACHINE_AMETHYST: 27, EXTRACTOR_MACHINE_REIDITE: 28, EXTRACTOR_MACHINE_EMERALD: 29, EXTRACTOR_MACHINE_COPPER: 30, EXTRACTOR_MACHINE_IRON: 31, EXTRACTOR_MACHINE_TOPAZ: 32, EXTRACTOR_MACHINE_SAPPHIRE: 33, EXTRACTOR_MACHINE_JADE: 34, EXTRACTOR_MACHINE_RUBY: 35, EXTRACTOR_MACHINE_COAL: 36, EXTRACTOR_MACHINE_AQUAMARINE: 37, TOTEM: 38, WHEAT_SEED: 40, WINDMILL: 41, BREAD_OVEN: 43, WELL: 44, PUMPKIN_SEED: 46, ROOF: 47, GARLIC_SEED: 48, THORNBUSH_SEED: 49, BED: 50, TOMATO_SEED: 52, CARROT_SEED: 53, WOOD_DOOR_SPIKE: 54, STONE_DOOR_SPIKE: 55, GOLD_DOOR_SPIKE: 56, DIAMOND_DOOR_SPIKE: 57, AMETHYST_DOOR_SPIKE: 58, REIDITE_WALL: 59, REIDITE_DOOR: 60, REIDITE_SPIKE: 61, REIDITE_DOOR_SPIKE: 62, WATERMELON_SEED: 63, ALOE_VERA_SEED: 64, WOLF: 67, SPIDER: 68, FOX: 69, BEAR: 70, DRAGON: 71, PIRANHA: 72, KRAKEN: 73, CRAB: 74, FLAME: 75, LAVA_DRAGON: 76, BOAR: 77, CRAB_BOSS: 78, BABY_DRAGON: 79, BABY_LAVA: 80, HAWK: 81, VULTURE: 82, SAND_WORM: 83, BABY_MAMMOTH: 84, MAMMOTH: 85, PARROT: 86, OCELOT: 87, CROCODILE: 88, GOLDEN_CHICKEN: 89, GOLDEN_HEN: 90, RABBIT: 92, TREASURE_CHEST: 93, DEAD_BOX: 94, THORNBUSH_MOB: 97, CRATE: 98, GIFT: 99, PENGUIN: 100, ALOE_VERA_MOB: 101 };
    /* INVENTORY IDS */
    let COUNTER = 0; const INV = { SWORD: COUNTER++, PICK: COUNTER++, FUR: COUNTER++, PICK_GOLD: COUNTER++, PICK_DIAMOND: COUNTER++, SWORD_GOLD: COUNTER++, SWORD_DIAMOND: COUNTER++, HAND: COUNTER++, PICK_WOOD: COUNTER++, PIRATE_SWORD: COUNTER++, EARMUFFS: COUNTER++, COAT: COUNTER++, WOOD_SPEAR: COUNTER++, SPEAR: COUNTER++, GOLD_SPEAR: COUNTER++, DIAMOND_SPEAR: COUNTER++, DRAGON_SPEAR: COUNTER++, LAVA_SPEAR: COUNTER++, CRAB_SPEAR: COUNTER++, EMERALD_SPEAR: COUNTER++, COPPER_SPEAR: COUNTER++, IRON_SPEAR: COUNTER++, TOPAZ_SPEAR: COUNTER++, SAPPHIRE_SPEAR: COUNTER++, JADE_SPEAR: COUNTER++, RUBY_SPEAR: COUNTER++, COAL_SPEAR: COUNTER++, AQUAMARINE_SPEAR: COUNTER++, REIDITE_SWORD: COUNTER++, DIAMOND_PROTECTION: COUNTER++, AMETHYST_PROTECTION: COUNTER++, REIDITE_PROTECTION: COUNTER++, EXPLORER_HAT: COUNTER++, PIRATE_HAT: COUNTER++, STONE_HELMET: COUNTER++, GOLD_HELMET: COUNTER++, DIAMOND_HELMET: COUNTER++, EMERALD_HELMET: COUNTER++, COPPER_HELMET: COUNTER++, IRON_HELMET: COUNTER++, TOPAZ_HELMET: COUNTER++, SAPPHIRE_HELMET: COUNTER++, JADE_HELMET: COUNTER++, RUBY_HELMET: COUNTER++, COAL_HELMET: COUNTER++, AQUAMARINE_HELMET: COUNTER++, BOOK: COUNTER++, BAG: COUNTER++, SWORD_AMETHYST: COUNTER++, PICK_AMETHYST: COUNTER++, PICK_REIDITE: COUNTER++, PICK_EMERALD: COUNTER++, PICK_COPPER: COUNTER++, PICK_IRON: COUNTER++, PICK_TOPAZ: COUNTER++, PICK_SAPPHIRE: COUNTER++, PICK_JADE: COUNTER++, PICK_RUBY: COUNTER++, PICK_COAL: COUNTER++, PICK_AQUAMARINE: COUNTER++, AMETHYST_SPEAR: COUNTER++, REIDITE_SPEAR: COUNTER++, HAMMER: COUNTER++, HAMMER_GOLD: COUNTER++, HAMMER_DIAMOND: COUNTER++, HAMMER_AMETHYST: COUNTER++, HAMMER_REIDITE: COUNTER++, CAP_SCARF: COUNTER++, CHRISTMAS_HAT: COUNTER++, ELF_HAT: COUNTER++, AMETHYST_HELMET: COUNTER++, REIDITE_HELMET: COUNTER++, SUPER_HAMMER: COUNTER++, HAMMER_EMERALD: COUNTER++, HAMMER_COPPER: COUNTER++, HAMMER_IRON: COUNTER++, HAMMER_TOPAZ: COUNTER++, HAMMER_SAPPHIRE: COUNTER++, HAMMER_JADE: COUNTER++, HAMMER_RUBY: COUNTER++, HAMMER_COAL: COUNTER++, HAMMER_AQUAMARINE: COUNTER++, SHOVEL: COUNTER++, SUPER_DIVING_SUIT: COUNTER++, DIVING_MASK: COUNTER++, WATERING_CAN_FULL: COUNTER++, SHOVEL_GOLD: COUNTER++, SHOVEL_DIAMOND: COUNTER++, SHOVEL_AMETHYST: COUNTER++, SHOVEL_REIDITE: COUNTER++, SHOVEL_EMERALD: COUNTER++, SHOVEL_COPPER: COUNTER++, SHOVEL_IRON: COUNTER++, SHOVEL_TOPAZ: COUNTER++, SHOVEL_SAPPHIRE: COUNTER++, SHOVEL_JADE: COUNTER++, SHOVEL_RUBY: COUNTER++, SHOVEL_COAL: COUNTER++, SHOVEL_AQUAMARINE: COUNTER++, PITCHFORK: COUNTER++, PITCHFORK2: COUNTER++, SPANNER: COUNTER++, MACHETE: COUNTER++, SWORD_WOOD: COUNTER++, WOOD_HELMET: COUNTER++, DRAGON_HELMET: COUNTER++, LAVA_HELMET: COUNTER++, CROWN_CRAB: COUNTER++, DRAGON_SWORD: COUNTER++, LAVA_SWORD: COUNTER++, SWORD_EMERALD: COUNTER++, SWORD_COPPER: COUNTER++, SWORD_IRON: COUNTER++, SWORD_TOPAZ: COUNTER++, SWORD_SAPPHIRE: COUNTER++, SWORD_JADE: COUNTER++, SWORD_RUBY: COUNTER++, SWORD_COAL: COUNTER++, SWORD_AQUAMARINE: COUNTER++, WOOD_BOW: COUNTER++, STONE_BOW: COUNTER++, GOLD_BOW: COUNTER++, DIAMOND_BOW: COUNTER++, AMETHYST_BOW: COUNTER++, REIDITE_BOW: COUNTER++, DRAGON_BOW: COUNTER++, EMERALD_BOW: COUNTER++, COPPER_BOW: COUNTER++, IRON_BOW: COUNTER++, TOPAZ_BOW: COUNTER++, SAPPHIRE_BOW: COUNTER++, JADE_BOW: COUNTER++, RUBY_BOW: COUNTER++, COAL_BOW: COUNTER++, AQUAMARINE_BOW: COUNTER++, WOOD_SHIELD: COUNTER++, STONE_SHIELD: COUNTER++, GOLD_SHIELD: COUNTER++, DIAMOND_SHIELD: COUNTER++, AMETHYST_SHIELD: COUNTER++, REIDITE_SHIELD: COUNTER++, EMERALD_SHIELD: COUNTER++, COPPER_SHIELD: COUNTER++, IRON_SHIELD: COUNTER++, TOPAZ_SHIELD: COUNTER++, SAPPHIRE_SHIELD: COUNTER++, JADE_SHIELD: COUNTER++, RUBY_SHIELD: COUNTER++, COAL_SHIELD: COUNTER++, AQUAMARINE_SHIELD: COUNTER++, CROWN_GREEN: COUNTER++, CROWN_ORANGE: COUNTER++, CROWN_BLUE: COUNTER++, TURBAN1: COUNTER++, TURBAN2: COUNTER++, PILOT_HELMET: COUNTER++, HOOD: COUNTER++, PEASANT: COUNTER++, WINTER_HOOD: COUNTER++, WINTER_PEASANT: COUNTER++, FLOWER_HAT: COUNTER++, FUR_HAT: COUNTER++, SADDLE: COUNTER++, WITCH: COUNTER++, NIMBUS: COUNTER++, WAND1: COUNTER++, WAND2: COUNTER++, WOOD_AXE: COUNTER++, STONE_AXE: COUNTER++, GOLD_AXE: COUNTER++, DIAMOND_AXE: COUNTER++, AMETHYST_AXE: COUNTER++, REIDITE_AXE: COUNTER++, EMERALD_AXE: COUNTER++, COPPER_AXE: COUNTER++, IRON_AXE: COUNTER++, TOPAZ_AXE: COUNTER++, SAPPHIRE_AXE: COUNTER++, JADE_AXE: COUNTER++, RUBY_AXE: COUNTER++, COAL_AXE: COUNTER++, AQUAMARINE_AXE: COUNTER++, FIREFLY: COUNTER++, WOOD_ARROW: COUNTER++, STONE_ARROW: COUNTER++, GOLD_ARROW: COUNTER++, DIAMOND_ARROW: COUNTER++, AMETHYST_ARROW: COUNTER++, REIDITE_ARROW: COUNTER++, DRAGON_ARROW: COUNTER++, EMERALD_ARROW: COUNTER++, COPPER_ARROW: COUNTER++, IRON_ARROW: COUNTER++, TOPAZ_ARROW: COUNTER++, SAPPHIRE_ARROW: COUNTER++, JADE_ARROW: COUNTER++, RUBY_ARROW: COUNTER++, COAL_ARROW: COUNTER++, AQUAMARINE_ARROW: COUNTER++, STONE: COUNTER++, WOOD: COUNTER++, PLANT: COUNTER++, GOLD: COUNTER++, DIAMOND: COUNTER++, FIRE: COUNTER++, WORKBENCH: COUNTER++, SEED: COUNTER++, MEAT: COUNTER++, COOKED_MEAT: COUNTER++, BIG_FIRE: COUNTER++, FURNACE: COUNTER++, PAPER: COUNTER++, AMETHYST: COUNTER++, AMETHYST_WALL: COUNTER++, AMETHYST_SPIKE: COUNTER++, AMETHYST_DOOR: COUNTER++, BRIDGE: COUNTER++, SAND: COUNTER++, BOTTLE_FULL: COUNTER++, randomshit1: COUNTER++, randomshit2: COUNTER++, BOTTLE_EMPTY: COUNTER++, KRAKEN_SKIN: COUNTER++, WATERING_CAN: COUNTER++, FLOUR: COUNTER++, WHEAT_SEED: COUNTER++, COOKIE: COUNTER++, WILD_WHEAT: COUNTER++, WINDMILL: COUNTER++, CAKE: COUNTER++, FOODFISH: COUNTER++, FOODFISH_COOKED: COUNTER++, SCALES: COUNTER++, GROUND: COUNTER++, PLOT: COUNTER++, ICE: COUNTER++, BREAD: COUNTER++, BREAD_OVEN: COUNTER++, SANDWICH: COUNTER++, FUR_WINTER: COUNTER++, BLUE_CORD: COUNTER++, LOCK: COUNTER++, DRAGON_HEART: COUNTER++, LAVA_HEART: COUNTER++, RESURRECTION: COUNTER++, EMERALD_MACHINE: COUNTER++, EXTRACTOR_MACHINE_STONE: COUNTER++, EXTRACTOR_MACHINE_GOLD: COUNTER++, EXTRACTOR_MACHINE_DIAMOND: COUNTER++, EXTRACTOR_MACHINE_AMETHYST: COUNTER++, EXTRACTOR_MACHINE_REIDITE: COUNTER++, EXTRACTOR_MACHINE_EMERALD: COUNTER++, EXTRACTOR_MACHINE_COPPER: COUNTER++, EXTRACTOR_MACHINE_IRON: COUNTER++, EXTRACTOR_MACHINE_TOPAZ: COUNTER++, EXTRACTOR_MACHINE_SAPPHIRE: COUNTER++, EXTRACTOR_MACHINE_JADE: COUNTER++, EXTRACTOR_MACHINE_RUBY: COUNTER++, EXTRACTOR_MACHINE_COAL: COUNTER++, EXTRACTOR_MACHINE_AQUAMARINE: COUNTER++, LOCKPICK: COUNTER++, TOTEM: COUNTER++, SPIKE: COUNTER++, CORD: COUNTER++, WALL: COUNTER++, STONE_WALL: COUNTER++, GOLD_WALL: COUNTER++, DIAMOND_WALL: COUNTER++, WOOD_DOOR: COUNTER++, CHEST: COUNTER++, STONE_SPIKE: COUNTER++, GOLD_SPIKE: COUNTER++, DIAMOND_SPIKE: COUNTER++, STONE_DOOR: COUNTER++, GOLD_DOOR: COUNTER++, DIAMOND_DOOR: COUNTER++, FUR_WOLF: COUNTER++, GEMME_GREEN: COUNTER++, GEMME_ORANGE: COUNTER++, GEMME_BLUE: COUNTER++, SPECIAL_FUR: COUNTER++, SPECIAL_FUR_2: COUNTER++, BUCKET_FULL: COUNTER++, BUCKET_EMPTY: COUNTER++, WELL: COUNTER++, SIGN: COUNTER++, DRAGON_CUBE: COUNTER++, DRAGON_ORB: COUNTER++, LAVA_CUBE: COUNTER++, LAVA_ORB: COUNTER++, PUMPKIN_SEED: COUNTER++, PUMPKIN: COUNTER++, ROOF: COUNTER++, GARLIC_SEED: COUNTER++, GARLIC: COUNTER++, THORNBUSH_SEED: COUNTER++, THORNBUSH: COUNTER++, BANDAGE: COUNTER++, CRAB_STICK: COUNTER++, CRAB_LOOT: COUNTER++, BED: COUNTER++, SUGAR_CAN: COUNTER++, CANDY: COUNTER++, GARLAND: COUNTER++, REIDITE: COUNTER++, FLAME: COUNTER++, COPPER: COUNTER++, IRON: COUNTER++, TOPAZ: COUNTER++, SAPPHIRE: COUNTER++, JADE: COUNTER++, RUBY: COUNTER++, COAL: COUNTER++, AQUAMARINE: COUNTER++, CARROT_SEED: COUNTER++, CARROT: COUNTER++, TOMATO_SEED: COUNTER++, TOMATO: COUNTER++, WATERMELON_SEED: COUNTER++, WATERMELON: COUNTER++, ALOE_VERA_SEED: COUNTER++, ALOE_VERA: COUNTER++, WOOD_DOOR_SPIKE: COUNTER++, STONE_DOOR_SPIKE: COUNTER++, GOLD_DOOR_SPIKE: COUNTER++, DIAMOND_DOOR_SPIKE: COUNTER++, AMETHYST_DOOR_SPIKE: COUNTER++, REIDITE_WALL: COUNTER++, REIDITE_DOOR: COUNTER++, REIDITE_SPIKE: COUNTER++, REIDITE_DOOR_SPIKE: COUNTER++, WOOD_TOWER: COUNTER++, PENGUIN_FEATHER: COUNTER++, BOAT: COUNTER++, SLED: COUNTER++, MOUNT_BOAR: COUNTER++, CRAB_BOSS: COUNTER++, BABY_DRAGON: COUNTER++, BABY_LAVA: COUNTER++, HAWK: COUNTER++, PLANE: COUNTER++, HAWK_FEATHER: COUNTER++, VULTURE_FEATHER: COUNTER++, CACTUS: COUNTER++, randomshit3: COUNTER++, PITCHFORK_PART: COUNTER++, PILOT_GLASSES: COUNTER++, FUR_BOAR: COUNTER++, SANDWORM_JUICE: COUNTER++, BABY_MAMMOTH: COUNTER++, FUR_MAMMOTH: COUNTER++, FUR_CROCODILE: COUNTER++, PARROT_FEATHER: COUNTER++, FUR_OCELOT: COUNTER++, PARROT: COUNTER++, VULTURE: COUNTER++, BANANA: COUNTER++, randomshit4: COUNTER++, GOLDEN_HEN: COUNTER++ };
    /* STATE INFO IDS */
    let STATE = { DELETE: 1, HURT: 2, COLD: 4, HUNGER: 8, ATTACK: 16, WALK: 32, IDLE: 64, HEAL: 128, WEB: 256 };

    class createText {
        constructor(width, height, buildType) { this.canvas = globalDocument.createElement("canvas"); this.ctx = this.canvas.getContext("2d"); this.canvas.width = width; this.canvas.height = height; this.buildType = buildType; };
        drawText(text, size, color, buildStringType) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.font = size + 'px Baloo Paaji';
            this.ctx.strokeStyle = color;
            if (this.buildType == 3) this.ctx.fillStyle = ((text[1] & 16) >> 4) ? "red" : "green";
            else this.ctx.fillStyle = !Settings.darkMode ? 'white' : '#BBB';
            this.ctx.lineWidth = 7;
            switch (this.buildType) {
                /* Extractors And Windmills */
                case 1:
                    this.ctx.strokeText('x' + (text & 255), 15, 30);
                    this.ctx.fillText('x' + (text & 255), 15, 30);
                    this.ctx.strokeText('x' + ((text & 65280) >> 8), 15, 50);
                    this.ctx.fillText('x' + ((text & 65280) >> 8), 15, 50);
                    this.ctx.strokeText((((Math.round((text & 255) / 2) * 10) / 60) >= 1 ? ((Math.round((text & 255) / 2) * 10) / 60).toFixed(0) + 'm' : (Math.round((text & 255) / 2) * 10) + 's'), 15, 70);
                    this.ctx.fillText((((Math.round((text & 255) / 2) * 10) / 60) >= 1 ? ((Math.round((text & 255) / 2) * 10) / 60).toFixed(0) + 'm' : (Math.round((text & 255) / 2) * 10) + 's'), 15, 70);
                    break;
                /* Ovens */
                case 2:
                    this.ctx.strokeText('x' + (text & 31), 15, 30);
                    this.ctx.fillText('x' + (text & 31), 15, 30);
                    this.ctx.strokeText('x' + ((text & 992) >> 5), 15, 50);
                    this.ctx.fillText('x' + ((text & 992) >> 5), 15, 50);
                    this.ctx.strokeText('x' + ((text & 31744) >> 10), 15, 70);
                    this.ctx.fillText('x' + ((text & 31744) >> 10), 15, 70);
                    this.ctx.strokeText(((((Math.min((text & 31), ((text & 992) >> 5)) * 10)) / 60) >= 1 ? ((Math.min((text & 31), ((text & 992) >> 5)) * 10) / 60).toFixed(0) + 'm' : ((Math.min((text & 31), ((text & 992) >> 5))) * 10) + 's'), 15, 90);
                    this.ctx.fillText(((((Math.min((text & 31), ((text & 992) >> 5)) * 10)) / 60) >= 1 ? ((Math.min((text & 31), ((text & 992) >> 5)) * 10) / 60).toFixed(0) + 'm' : ((Math.min((text & 31), ((text & 992) >> 5))) * 10) + 's'), 15, 90);
                    break;
                /* Totem */
                case 3:
                    this.ctx.strokeText(text[0], 15, 40);
                    this.ctx.fillText(text[0], 15, 40);
                    this.ctx.strokeText((text[1] & 16) >> 4 ? "Locked" : "Unlocked", 15, 60);
                    this.ctx.fillText((text[1] & 16) >> 4 ? "Locked" : "Unlocked", 15, 60);
                    this.ctx.strokeText((text[1] & 16) >> 4 ? text[1] - 16 : text[1], 15, 80);
                    this.ctx.fillText((text[1] & 16) >> 4 ? text[1] - 16 : text[1], 15, 80);
                    break;
                /* Furnaces And Wells */
                case 4:
                    this.ctx.strokeText('x' + text, 15, buildStringType == 'furnace' ? 30 : 40);
                    this.ctx.fillText('x' + text, 15, buildStringType == 'furnace' ? 30 : 40);
                    if (buildStringType == 'furnace') {
                        this.ctx.strokeText((((text * 5) / 60) >= 1) ? (((text * 5) / 60).toFixed(0) + 'm') : ((text * 5) + 's'), 15, 50);
                        this.ctx.fillText((((text * 5) / 60) >= 1) ? (((text * 5) / 60).toFixed(0) + 'm') : ((text * 5) + 's'), 15, 50);
                    };
                    break;
                /* Emerald Machines And Limit */
                default:
                    if (buildStringType == 'machine') {
                        this.ctx.strokeText(text[0], 15, 30);
                        this.ctx.fillText(text[0], 15, 30);
                        if (text[1] != '0k') {
                            this.ctx.strokeText(text[1], 15, 50);
                            this.ctx.fillText(text[1], 15, 50);
                        };
                    } else {
                        this.ctx.strokeText(text, 15, 40);
                        this.ctx.fillText(text, 15, 40);
                    };
                    break;
            };
        };
    };

    let Limit = { L: 0, I: new createText(250, 70, 0), E: false };
    /* Functions */
    let allowedKeys = ['t', 'b', 'f', 's', 'g', 'd', 'a', 're', 'plm', 'p', 'cs', 'c', 'm'];
    let waterKeys = ['wtb', 'r', 'l']
    let waterTiles = [];
    function inGrid(player, entity, number) {
        const playerGridX = Math.floor(player.x / 100);
        const playerGridY = Math.floor(player.y / 100);
        const entityGridX = Math.floor(entity.x / 100);
        const entityGridY = Math.floor(entity.y / 100);
        const deltaX = Math.abs(playerGridX - entityGridX);
        const deltaY = Math.abs(playerGridY - entityGridY);
        return deltaX <= number && deltaY <= number;
    }
    function basicXor(str) { str = str.toString(); let result = ''; for (let i = 0; i < str.length; i++) result += String.fromCharCode(str.charCodeAt(i) ^ 6900); return result; };
    function extractMap(mapArray) { const objectsWithPositions = []; waterTiles = []; for (let y = 0; y < mapArray.length; y++) { for (let x = 0; x < mapArray[y].length; x++) { const tile = mapArray[y][x]; if (!Array.isArray(tile)) { for (let key in tile) { if (tile.hasOwnProperty(key)) { if (allowedKeys.includes(key)) objectsWithPositions.push([x, y, key]); else if (waterKeys.includes(key)) waterTiles.push([x, y, key]); }; }; }; }; }; return objectsWithPositions; };
    function beautifyAndCount(inputCode) { const beautifiedCode = globalDocument[defaultViewString]['js_beautify'](inputCode); const lineCount = beautifiedCode.split('\n').length; return lineCount; };
    let previousPopup = 0;
    let previousTimeout = 0;
    function openPopup(color, messageContent, popupType = 0, onConfirm = null) {
        if (lastPopup) return;
        if (keyRemoved) lastPopup = true;
        if (globalDocument.visibilityState != 'visible') return;
        /* Remove Any Previous Popups */
        if (previousPopup && previousPopup.style && previousPopup.style.opacity) {
            // if (previousTimeout) workerTimers.cleatTimeout(previousTimeout);
            globalDocument.body.removeChild(previousPopup);
        };
        let popup = globalDocument.createElement('div');
        previousPopup = popup;
        popup.style.userSelect = "none";
        popup.style.position = 'fixed';
        popup.style.top = '20px';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.padding = '10px 20px';
        popup.style.backgroundColor = color;
        popup.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        popup.style.zIndex = '1000';
        popup.style.textAlign = 'left';
        popup.style.color = '#fff';
        popup.style.borderRadius = '10px';
        popup.style.opacity = '0';
        popup.style.transition = 'opacity 0.3s';
        let message = globalDocument.createElement('p');
        message.textContent = messageContent;
        message.style.margin = '0';
        message.style.fontSize = '18px';
        message.style.fontFamily = 'Baloo Paaji, cursive';
        message.style.textShadow = "0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black";
        popup.appendChild(message);
        if (popupType === 1) {
            let buttonContainer = globalDocument.createElement('div');
            buttonContainer.style.marginTop = '10px';
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'space-between';
            let yesButton = globalDocument.createElement('button');
            yesButton.textContent = 'Yes';
            yesButton.style.flex = '1';
            yesButton.style.marginRight = '5px';
            yesButton.style.padding = '5px';
            yesButton.style.border = 'none';
            yesButton.style.borderRadius = '5px';
            yesButton.style.backgroundColor = '#4CAF50';
            yesButton.style.color = '#fff';
            yesButton.style.cursor = 'pointer';
            yesButton.style.fontFamily = 'Baloo Paaji, cursive';
            yesButton.style.textShadow = "0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black";
            yesButton.style.fontSize = '14px';
            yesButton.addEventListener('click', () => {
                if (!lastPopup) closePopup();
                if (onConfirm) onConfirm(true);
            });
            let noButton = globalDocument.createElement('button');
            noButton.textContent = 'No';
            noButton.style.flex = '1';
            noButton.style.padding = '5px';
            noButton.style.border = 'none';
            noButton.style.borderRadius = '5px';
            noButton.style.backgroundColor = '#f44336';
            noButton.style.color = '#fff';
            noButton.style.cursor = 'pointer';
            noButton.style.fontFamily = 'Baloo Paaji, cursive';
            noButton.style.textShadow = "0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black";
            noButton.style.fontSize = '14px';
            noButton.addEventListener('click', () => {
                if (!lastPopup) closePopup();
                if (onConfirm) onConfirm(false);
            });
            buttonContainer.appendChild(yesButton);
            buttonContainer.appendChild(noButton);
            popup.appendChild(buttonContainer);
        } else if (popupType === 2) {
            let inputField = globalDocument.createElement('input');
            inputField.type = 'text';
            inputField.style.width = '100%';
            inputField.style.marginTop = '10px';
            inputField.style.padding = '5px';
            inputField.style.borderRadius = '5px';
            inputField.style.border = '1px solid #ddd';
            inputField.style.boxSizing = 'border-box';
            popup.appendChild(inputField);
            inputField.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    let inputValue = inputField.value;
                    if (!lastPopup) closePopup();
                    if (onConfirm) onConfirm(inputValue);
                }
            });
        }
        globalDocument.body.appendChild(popup);
        popup.style.opacity = '1';
        let closePopup = () => {
            if (popup && popup.style && popup.style.opacity) popup.style.opacity = '0';
            previousTimeout = workerTimers.setTimeout(() => {
                previousPopup = 0;
                if (popup && popup.style && popup.style.opacity) globalDocument.body.removeChild(popup);
            }, 300);
        };
        if (popupType === 0) {
            if (!lastPopup) previousTimeout = workerTimers.setTimeout(closePopup, 3700);
        }
    };
    function holdingWeapon(RightHandItem) { switch (RightHandItem) { case INV.SWORD: case INV.SWORD_GOLD: case INV.SWORD_DIAMOND: case INV.REIDITE_SWORD: case INV.SWORD_AMETHYST: case INV.SWORD_WOOD: case INV.DRAGON_SWORD: case INV.LAVA_SWORD: case INV.SWORD_EMERALD: case INV.SWORD_COPPER: case INV.SWORD_IRON: case INV.SWORD_TOPAZ: case INV.SWORD_SAPPHIRE: case INV.SWORD_JADE: case INV.SWORD_RUBY: case INV.SWORD_COAL: case INV.SWORD_AQUAMARINE: return 1; case INV.WOOD_SPEAR: case INV.SPEAR: case INV.GOLD_SPEAR: case INV.DIAMOND_SPEAR: case INV.DRAGON_SPEAR: case INV.LAVA_SPEAR: case INV.CRAB_SPEAR: case INV.EMERALD_SPEAR: case INV.COPPER_SPEAR: case INV.IRON_SPEAR: case INV.TOPAZ_SPEAR: case INV.SAPPHIRE_SPEAR: case INV.JADE_SPEAR: case INV.RUBY_SPEAR: case INV.COAL_SPEAR: case INV.AQUAMARINE_SPEAR: case INV.AMETHYST_SPEAR: case INV.REIDITE_SPEAR: return 2; case INV.WOOD_AXE: case INV.STONE_AXE: case INV.GOLD_AXE: case INV.DIAMOND_AXE: case INV.AMETHYST_AXE: case INV.REIDITE_AXE: case INV.EMERALD_AXE: case INV.COPPER_AXE: case INV.IRON_AXE: case INV.TOPAZ_AXE: case INV.SAPPHIRE_AXE: case INV.JADE_AXE: case INV.RUBY_AXE: case INV.COAL_AXE: case INV.AQUAMARINE_AXE: return 3; case INV.SUPER_HAMMER: return 4; case INV.PIRATE_SWORD: return 5; case INV.WOOD_BOW: case INV.STONE_BOW: case INV.GOLD_BOW: case INV.DIAMOND_BOW: case INV.AMETHYST_BOW: case INV.REIDITE_BOW: case INV.DRAGON_BOW: case INV.EMERALD_BOW: case INV.COPPER_BOW: case INV.IRON_BOW: case INV.TOPAZ_BOW: case INV.SAPPHIRE_BOW: case INV.JADE_BOW: case INV.RUBY_BOW: case INV.COAL_BOW: case INV.AQUAMARINE_BOW: return 6 }; };
    function getAngle(o1, o2) { const dx = o1.x - o2.x; const dy = o1.y - o2.y; return Math.atan2(dy, dx); };
     function findTarget() {
     let players = Settings.Aimbot.mode == "Rabbit Chase" ? hiddenWorld.Units[ITEMS.RABBIT] : hiddenWorld.Units[ITEMS.PLAYERS];
     let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
     let closestPlayer;
     let closestDistance = 550;
     for (let i = 0; i < players.length; i++) {
         if (!CheckAlly(players[i][specialProps.pid]) || Settings.Aimbot.mode == "Rabbit Chase") {
             if (myPlayer[specialProps.fly] == 0 && players[i][specialProps.fly] == 1 && Settings.Aimbot.mode !== "Rabbit Chase") {
                 continue;
             } else if (myPlayer[specialProps.fly] == 1 && players[i][specialProps.fly] == 0 && Settings.Aimbot.mode !== "Rabbit Chase") {
                 continue;
             } else if (players[i][specialProps.ghost]) {
                 continue;
             };
             let distance = DistanceToObj(myPlayer, players[i]);
             if (distance < closestDistance) {
                 closestPlayer = players[i];
                 closestDistance = distance;
             };
         };
     };
     return [closestPlayer, closestDistance];
 };
    async function executeAfterFinished(func, ...args) { return await new Promise(async (resolve, reject) => { try { await func(...args); resolve(); } catch (error) { reject(error); } }); };
    let propertysClaimed = [];
    let propertyIndexes = [];
    function findIndex(key, propName, propertyIndexes) { for (let j = 0; j < propertyIndexes.length; j++) { const [combinedKey, i] = propertyIndexes[j]; if (combinedKey === key + propName) { return i; }; } return null; };
    function countFunctionCallsWithoutArgs(codeString) { const cleanedCodeString = codeString.replace(/function\s*\(\s*\)\s*{/g, ''); const functionCallPattern = /[^\s()]+\s*\(\s*\)/g; const matches = cleanedCodeString.match(functionCallPattern); return matches ? matches.length : 0; };
    function decodeASCII(str) { str = str.replace(/\\(\d{1,3})/g, (match, dec) => { return String.fromCharCode(parseInt(dec, 8)); }); str = str.replace(/\\x([0-9A-Fa-f]{2})/g, (match, hex) => { return String.fromCharCode(parseInt(hex, 16)); }); str = str.replace(/\\u([\dA-Fa-f]{4})/g, (match, unicode) => { return String.fromCharCode(parseInt(unicode, 16)); }); return str; };
    function extractQuotedStrings(decodedString) { const quoteRegex = /['"`]([^'"`]+)['"`]/g; const matches = []; let match; while ((match = quoteRegex.exec(decodedString)) !== null) { matches.push(match[1]); } return matches; };
    function matchesCriteria(value, criteria) { if (typeof value === 'object' && value !== null) { const keys = Object.keys(criteria); return keys.every(key => { if (key in value) { if (criteria[key] === 'any') return true; return typeof value[key] === typeof criteria[key]; } return false; }); }; return false; };
    function getLength(value) { return Array.isArray(value) ? value.length : Object.keys(value).length; };
    function compareFunctions(func1, func2) { const func1Counts = countCharacters(func1); const func2Counts = countCharacters(func2); const sameSemicolon = func1Counts.semicolon === func2Counts.semicolon; const sameSlash = func1Counts.slash === func2Counts.slash; const sameEquals = func1Counts.equals === func2Counts.equals; const matchCount = (sameSemicolon ? 1 : 0) + (sameSlash ? 1 : 0) + (sameEquals ? 1 : 0); const percentage = (matchCount / 3) * 100; let resultPercentage = 33; if (percentage === 100) resultPercentage = 100; else if (percentage >= 66) resultPercentage = 66; return resultPercentage; };
    function countCharacters(code) { const counts = { semicolon: 0, slash: 0, equals: 0 }; counts.semicolon = (code.match(/;/g) || []).length; counts.slash = (code.match(/\//g) || []).length; counts.equals = (code.match(/=/g) || []).length; return counts; }
    function ctxDrawImage(ctx, img, b, c, d, e, f, g, h, i) { if (img.tryLoad === void 0 || img.tryLoad() === 1) { if (i !== void 0) { if (img.naturalWidth) { ctx.drawImage(img, b, c, Math.max(1, d), Math.max(1, e), f, g, h, i); }; } else if (e !== void 0) { if (img.naturalWidth) { ctx.drawImage(img, b, c, d, e); }; } else { if (img.naturalWidth) { ctx.drawImage(img, b, c); }; }; }; };
    function getCookieById(cookieId) { const name = cookieId + '='; const decodedCookies = decodeURIComponent(globalDocument.cookie); const cookiesArray = decodedCookies.split('; '); for (let i = 0; i < cookiesArray.length; i++) { let cookie = cookiesArray[i].trim(); if (cookie.indexOf(name) === 0) { return cookie.substring(name.length, cookie.length); } } return null; };
     function setCookieById(cookieId, value, days = 7) { const expires = new Date(); expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000)); document.cookie = `${encodeURIComponent(cookieId)}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`; }   
    function create_roof(scale, draw_shadow, color) { let can = globalDocument.createElement("canvas"); let ctx = can.getContext("2d"); can.width = 248 * scale; can.height = 247 * scale; ctx.save(); ctx.translate(69.5 * scale, 145 * scale); round_rect(ctx, -8.5 * scale, -63 * scale, 17 * scale, 127 * scale, 1 * scale); ctx.restore(); fill_path(ctx, color[0]); ctx.save(); ctx.translate(183 * scale, 145 * scale); round_rect(ctx, -8 * scale, -63 * scale, 16 * scale, 126 * scale, 1 * scale); ctx.restore(); fill_path(ctx, color[0]); ctx.save(); ctx.translate(123.5 * scale, 62.5 * scale); ctx.rotate(6.28); round_rect(ctx, -84.5 * scale, -25.5 * scale, 169 * scale, 51 * scale, 5 * scale); ctx.restore(); fill_path(ctx, color[2], color[1], 6 * scale); ctx.save(); ctx.translate(123.5 * scale, 118 * scale); ctx.rotate(6.24); round_rect(ctx, -85.5 * scale, -24 * scale, 169 * scale, 48 * scale, 5 * scale); ctx.restore(); fill_path(ctx, color[3], color[1], 6 * scale); ctx.save(); ctx.translate(122 * scale, 177.5 * scale); ctx.rotate(6.32); round_rect(ctx, -84 * scale, -23.5 * scale, 169 * scale, 47 * scale, 5 * scale); ctx.restore(); fill_path(ctx, color[2], color[1], 6 * scale); ctx.beginPath(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.moveTo(37 * scale, 157 * scale); ctx.bezierCurveTo(49 * scale, 160 * scale, 49 * scale, 160 * scale, 61 * scale, 163 * scale); ctx.bezierCurveTo(49.5 * scale, 165.5 * scale, 49.5 * scale, 165.5 * scale, 38 * scale, 168 * scale); ctx.closePath(); fill_path(ctx, color[1]); ctx.beginPath(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.moveTo(205 * scale, 175 * scale); ctx.bezierCurveTo(192.5 * scale, 180 * scale, 192.5 * scale, 180 * scale, 180 * scale, 185 * scale); ctx.bezierCurveTo(193 * scale, 188 * scale, 193 * scale, 188 * scale, 206 * scale, 191 * scale); ctx.closePath(); fill_path(ctx, color[1]); return can; };
    function create_roof1(scale, draw_shadow, color) { let can = globalDocument.createElement("canvas"); let ctx = can.getContext("2d"); can.width = 248 * scale; can.height = 247 * scale; ctx.save(); ctx.translate(182 * scale, 120 * scale); round_rect(ctx, -8 * scale, -67 * scale, 16 * scale, 134 * scale, 1 * scale); ctx.restore(); fill_path(ctx, color[0]); ctx.save(); ctx.translate(68.5 * scale, 127.5 * scale); round_rect(ctx, -8.5 * scale, -70.5 * scale, 17 * scale, 141 * scale, 1 * scale); ctx.restore(); fill_path(ctx, color[0]); ctx.save(); ctx.translate(123.5 * scale, 68 * scale); round_rect(ctx, -82.5 * scale, -24 * scale, 165 * scale, 48 * scale, 4 * scale); ctx.restore(); fill_path(ctx, color[2], color[1], 6 * scale); ctx.save(); ctx.translate(123 * scale, 179.5 * scale); round_rect(ctx, -83 * scale, -24.5 * scale, 166 * scale, 49 * scale, 4 * scale); ctx.restore(); fill_path(ctx, color[2], color[1], 6 * scale); ctx.save(); ctx.translate(123.5 * scale, 123.5 * scale); ctx.rotate(6.24); round_rect(ctx, -82.5 * scale, -24.5 * scale, 165 * scale, 49 * scale, 4 * scale); ctx.restore(); fill_path(ctx, color[3], color[1], 6 * scale); ctx.beginPath(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.moveTo(204 * scale, 112 * scale); ctx.bezierCurveTo(149 * scale, 121.5 * scale, 96 * scale, 130 * scale, 94 * scale, 131 * scale); ctx.bezierCurveTo(149.5 * scale, 127.5 * scale, 149.5 * scale, 127.5 * scale, 205 * scale, 124 * scale); ctx.closePath(); fill_path(ctx, color[1]); return can; }
    function create_roof2(scale, draw_shadow, color) { let can = globalDocument.createElement("canvas"); let ctx = can.getContext("2d"); can.width = 248 * scale; can.height = 247 * scale; ctx.save(); ctx.translate(183 * scale, 107 * scale); round_rect(ctx, -8 * scale, -70.5 * scale, 16 * scale, 141 * scale, 1 * scale); ctx.restore(); fill_path(ctx, color[0]); ctx.save(); ctx.translate(69.5 * scale, 110 * scale); round_rect(ctx, -8.5 * scale, -71 * scale, 17 * scale, 143 * scale, 1 * scale); ctx.restore(); fill_path(ctx, color[0]); ctx.save(); ctx.translate(123.5 * scale, 181 * scale); round_rect(ctx, -84.5 * scale, -26 * scale, 169 * scale, 52 * scale, 5 * scale); ctx.restore(); fill_path(ctx, color[2], color[1], 6 * scale); ctx.beginPath(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.moveTo(41 * scale, 95 * scale); ctx.bezierCurveTo(105 * scale, 96 * scale, 113 * scale, 99 * scale, 134 * scale, 102 * scale); ctx.bezierCurveTo(147 * scale, 106 * scale, 173 * scale, 100 * scale, 207 * scale, 105 * scale); ctx.bezierCurveTo(210 * scale, 105 * scale, 207 * scale, 140 * scale, 207 * scale, 154 * scale); ctx.bezierCurveTo(123.5 * scale, 151.5 * scale, 123.5 * scale, 151.5 * scale, 40 * scale, 149 * scale); ctx.bezierCurveTo(37 * scale, 145 * scale, 39 * scale, 95 * scale, 41 * scale, 96 * scale); ctx.closePath(); fill_path(ctx, color[2], color[1], 6 * scale); ctx.beginPath(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.moveTo(68 * scale, 75 * scale); ctx.bezierCurveTo(54 * scale, 72.5 * scale, 54 * scale, 72.5 * scale, 40 * scale, 70 * scale); ctx.bezierCurveTo(38 * scale, 46 * scale, 40 * scale, 46 * scale, 53 * scale, 46 * scale); ctx.bezierCurveTo(201 * scale, 41 * scale, 201 * scale, 41 * scale, 201 * scale, 42 * scale); ctx.bezierCurveTo(211 * scale, 40 * scale, 208 * scale, 53 * scale, 208 * scale, 72 * scale); ctx.bezierCurveTo(209 * scale, 91 * scale, 210 * scale, 96 * scale, 194 * scale, 94 * scale); ctx.bezierCurveTo(119 * scale, 97 * scale, 119 * scale, 97 * scale, 44 * scale, 100 * scale); ctx.bezierCurveTo(39 * scale, 99 * scale, 40 * scale, 96 * scale, 40 * scale, 80 * scale); ctx.bezierCurveTo(54 * scale, 77.5 * scale, 54 * scale, 77.5 * scale, 68 * scale, 75 * scale); ctx.closePath(); fill_path(ctx, color[3], color[1], 6 * scale); return can; };
    function create_roof_reduceTextures(scale, draw_shadow, color) { let can = globalDocument.createElement("canvas"); let ctx = can.getContext("2d"); can.width = 248 * scale; can.height = 247 * scale; ctx.save(); ctx.translate(123.5 * scale, 62.5 * scale); ctx.rotate(6.28); ctx.rect(-84.5 * scale, -25.5 * scale, 169 * scale, 169 * scale); ctx.restore(); fill_path(ctx, color[2]); return can; };
    function loadRoofTextures() { SPRITE.ROOF = [[], [], [], []]; SPRITE.ROOF[0][0] = CTI(create_roof(0.59, true, ["#0d1b1c", "#44301b", "#57442a", "#523e26"])); SPRITE.ROOF[0][1] = CTI(create_roof(0.59, true, ["#0c0c0d", "#062124", "#10373d", "#0f3333"])); SPRITE.ROOF[1][0] = CTI(create_roof1(0.59, true, ["#0d1b1c", "#44301b", "#57442a", "#523e26"])); SPRITE.ROOF[1][1] = CTI(create_roof1(0.59, true, ["#0c0c0d", "#062124", "#10373d", "#0f3333"])); SPRITE.ROOF[2][0] = CTI(create_roof2(0.59, true, ["#0d1b1c", "#44301b", "#57442a", "#523e26"])); SPRITE.ROOF[2][1] = CTI(create_roof2(0.59, true, ["#0c0c0d", "#062124", "#10373d", "#0f3333"])); SPRITE.ROOF[3][0] = CTI(create_roof_reduceTextures(0.59, true, ["#0d1b1c", "#57442a", "#57442a", "#523e26"])); SPRITE.ROOF[3][1] = CTI(create_roof_reduceTextures(0.59, true, ["#0c0c0d", "#10373d", "#10373d", "#0f3333"])) }; loadRoofTextures();
    function CheckAlly(structureID) { if (structureID === user.id) return 1; for (let i = 0; i < hiddenUser.Team.length; i++) { if (hiddenUser.Team[i] == structureID) return 1; } return 0; };
    function DistanceToObj(MyPlayer, Obj) { if (MyPlayer && Obj) { return Math.sqrt((MyPlayer.x - Obj.x) ** 2 + (MyPlayer.y - Obj.y) ** 2); }; return null; };
    function drawRoof(roof) { ctx.save(); ctx.translate(hiddenUser.Cam.x + roof.x, hiddenUser.Cam.y + roof.y); ctx.rotate(roof.angle); /* Hit Animations */ let x, y; if (roof[specialProps.hit][specialProps.update]) { if (roof[specialProps.hit][specialProps.anim][specialProps.update]() && (false == roof[specialProps.hit][specialProps.anim][specialProps.o])) roof[specialProps.hit][specialProps.update] = false; let v = delta * (600 * ((1 - roof[specialProps.hit][specialProps.anim][specialProps.v]))); x = v * Math.sin(roof[specialProps.hit].angle - roof.angle); y = Math.cos(roof[specialProps.hit].angle - roof.angle) * v; } else { x = 0; y = 0; } let roofImage = SPRITE.ROOF[Settings.smoothRoofs ? 3 : ((roof[specialProps.j] + roof[specialProps.i] % 2) % 3)][specialProps.time]; let old = -1; if (Settings.Roof.active) { ctx.globalAlpha = Number(Settings.Roof.opacity); } else { let myPlayer = hiddenWorld.FastUnits[specialProps.uid]; if (myPlayer && CheckAlly(roof[specialProps.pid])) { if (DistanceToObj(roof, myPlayer) < 550) roof[specialProps.opacity] = Math.max(roof[specialProps.opacity] - delta, 0.30); else roof[specialProps.opacity] = Math.min(roof[specialProps.opacity] + delta, 1); } else if (myPlayer && (DistanceToObj(roof, myPlayer) < 150)) roof[specialProps.opacity] = Math.max(roof[specialProps.opacity] - delta, 0.30); else roof[specialProps.opacity] = Math.min(roof[specialProps.opacity] + delta, 1); old = ctx.globalAlpha; ctx.globalAlpha *= roof[specialProps.opacity]; }; ctxDrawImage(ctx, roofImage, roofImage.width / 2 + x, roofImage.height / 2 + y, -roofImage.width, -roofImage.height); if (old != -1) ctx.globalAlpha = old; ctx.restore(); };
    function drawSpike(spike) { ctx.save(); ctx.translate(hiddenUser.Cam.x + spike.x, hiddenUser.Cam.y + spike.y); ctx.rotate(spike.angle); /* Hit Animations */ let x, y; if (spike[specialProps.hit][specialProps.update]) { if (spike[specialProps.hit][specialProps.anim][specialProps.update]() && (false == spike[specialProps.hit][specialProps.anim][specialProps.o])) spike[specialProps.hit][specialProps.update] = false; let v = delta * (600 * ((1 - spike[specialProps.hit][specialProps.anim][specialProps.v]))); x = v * Math.sin(spike[specialProps.hit].angle - spike.angle); y = Math.cos(spike[specialProps.hit].angle - spike.angle) * v; } else { x = 0; y = 0; } let spikeImage; switch (spike.type) { /* Spikes */ case ITEMS.SPIKE: spikeImage = [SPRITE.WOOD_SPIKE_ALLY, SPRITE.WOOD_SPIKE_ENEMY]; break; case ITEMS.STONE_SPIKE: spikeImage = [SPRITE.STONE_SPIKE_ALLY, SPRITE.STONE_SPIKE_ENEMY]; break; case ITEMS.GOLD_SPIKE: spikeImage = [SPRITE.GOLD_SPIKE_ALLY, SPRITE.GOLD_SPIKE_ENEMY]; break; case ITEMS.DIAMOND_SPIKE: spikeImage = [SPRITE.DIAMOND_SPIKE_ALLY, SPRITE.DIAMOND_SPIKE_ENEMY]; break; case ITEMS.AMETHYST_SPIKE: spikeImage = [SPRITE.AMETHYST_SPIKE_ALLY, SPRITE.AMETHYST_SPIKE_ENEMY]; break; case ITEMS.REIDITE_SPIKE: spikeImage = [SPRITE.REIDITE_SPIKE_ALLY, SPRITE.REIDITE_SPIKE_ENEMY]; break; default: break; }; spikeImage = CheckAlly(spike[specialProps.pid]) ? spikeImage[0] : spikeImage[1]; ctxDrawImage(ctx, spikeImage, spikeImage.width / 2 + x, spikeImage.height / 2 + y, -spikeImage.width, -spikeImage.height); ctx.restore(); };
    function drawDoor(door) { ctx.save(); ctx.translate(hiddenUser.Cam.x + door.x, hiddenUser.Cam.y + door.y); ctx.rotate(door.angle); /* Hit Animations */ let x, y; if (door[specialProps.hit][specialProps.update]) { if (door[specialProps.hit][specialProps.anim][specialProps.update]() && (false == door[specialProps.hit][specialProps.anim][specialProps.o])) door[specialProps.hit][specialProps.update] = false; let v = delta * (600 * ((1 - door[specialProps.hit][specialProps.anim][specialProps.v]))); x = v * Math.sin(door[specialProps.hit].angle - door.angle); y = Math.cos(door[specialProps.hit].angle - door.angle) * v; } else { x = 0; y = 0; } let doorImage; switch (door.type) { /* Doors */ case ITEMS.WOOD_DOOR: doorImage = [SPRITE.WOOD_DOOR_ALLY, SPRITE.WOOD_DOOR_ENEMY]; break; case ITEMS.STONE_DOOR: doorImage = [SPRITE.STONE_DOOR_ALLY, SPRITE.STONE_DOOR_ENEMY]; break; case ITEMS.GOLD_DOOR: doorImage = [SPRITE.GOLD_DOOR_ALLY, SPRITE.GOLD_DOOR_ENEMY]; break; case ITEMS.DIAMOND_DOOR: doorImage = [SPRITE.DIAMOND_DOOR_ALLY, SPRITE.DIAMOND_DOOR_ENEMY]; break; case ITEMS.AMETHYST_DOOR: doorImage = [SPRITE.AMETHYST_DOOR_ALLY, SPRITE.AMETHYST_DOOR_ENEMY]; break; case ITEMS.REIDITE_DOOR: doorImage = [SPRITE.REIDITE_DOOR_ALLY, SPRITE.REIDITE_DOOR_ENEMY]; break; /* Spiked Doors */ case ITEMS.WOOD_DOOR_SPIKE: doorImage = [SPRITE.SPIKED_WOOD_DOOR_ALLY, SPRITE.SPIKED_WOOD_DOOR_ENEMY]; break; case ITEMS.STONE_DOOR_SPIKE: doorImage = [SPRITE.SPIKED_STONE_DOOR_ALLY, SPRITE.SPIKED_STONE_DOOR_ENEMY]; break; case ITEMS.GOLD_DOOR_SPIKE: doorImage = [SPRITE.SPIKED_GOLD_DOOR_ALLY, SPRITE.SPIKED_GOLD_DOOR_ENEMY]; break; case ITEMS.DIAMOND_DOOR_SPIKE: doorImage = [SPRITE.SPIKED_DIAMOND_DOOR_ALLY, SPRITE.SPIKED_DIAMOND_DOOR_ENEMY]; break; case ITEMS.AMETHYST_DOOR_SPIKE: doorImage = [SPRITE.SPIKED_AMETHYST_DOOR_ALLY, SPRITE.SPIKED_AMETHYST_DOOR_ENEMY]; break; case ITEMS.REIDITE_DOOR_SPIKE: doorImage = [SPRITE.SPIKED_REIDITE_DOOR_ALLY, SPRITE.SPIKED_REIDITE_DOOR_ENEMY]; break; default: break; }; doorImage = CheckAlly(door[specialProps.pid]) ? doorImage[0] : doorImage[1]; ctxDrawImage(ctx, doorImage, doorImage.width / 2 + x, doorImage.height / 2 + y, -doorImage.width, -doorImage.height); ctx.restore(); };
    function createMarketItem(r, e) { var t, e = e[r]; const n = hiddenGame.Market.items.find(e => { if (e.name === r) return e }); let a; for (t in n) if ("number" == typeof n[t] && "a" !== t && "b" !== t && "id" !== t) { a = t; break } return n[a] = e, n }
    function drawTracers(animalGroup, color) {
        const myPlayer = hiddenWorld.FastUnits[specialProps.uid];
        if (!myPlayer) return;
        const camX = hiddenUser.Cam.x;
        const camY = hiddenUser.Cam.y;
        for (let i = 0; i < animalGroup.length; ++i) {
            const animal = animalGroup[i];
            ctx.save();
            ctx.strokeStyle = color;
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.moveTo(camX + myPlayer.x, camY + myPlayer.y);
            ctx.lineTo(camX + animal.x, camY + animal.y);
            ctx.stroke();
            ctx.restore();
        };
    };
    function chatOpen() { return (globalDocument.getElementById("chat_block").style.display == "inline-block" || globalDocument.getElementById("commandMainBox").style.display == "inline-block") };
    function delay(ms) { if (devMODE) savedLog("Join Queued: " + ms + 'ms'); return new Promise(resolve => workerTimers.setTimeout(resolve, ms)); o };
    function create_text(scale, text, h, color, shadow, dist, rounded, radius, max, stroke, line) { if (line === void 0) line = 0; let can = globalDocument.createElement("canvas"); let ctx = can.getContext("2d"); dist = (!dist) ? 0 : dist * scale; let height, width; height = Math.floor(scale * h); ctx.font = height + "px Baloo Paaji"; ctx.lineJoin = "round"; radius = radius * scale; let gap = ((rounded) ? radius * 2 : 0); if (max) width = Math.min(ctx.measureText(text).width + 2 * scale + gap, max); else width = ctx.measureText(text).width + 2 * scale + gap + line * scale * 2; height = (height + dist + line) * scale + gap; can.width = width; can.heigh = height; if (rounded) { ctx.fillStyle = rounded; round_rect(ctx, 0, 0, width, height, radius * 2); ctx.fill(); ctx.translate(radius, radius); } ctx.textBaseline = "middle"; ctx.font = h + "px Baloo Paaji"; ctx.lineJoin = "round"; if (shadow) { ctx.beginPath(); ctx.fillStyle = shadow; ctx.fillText(text, 0, height / 2 + dist - gap / 2, width); } ctx.beginPath(); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = line; ctx.strokeText(text, line, (height - gap) / 2, width); } ctx.fillStyle = color; ctx.fillText(text, line, (height - gap) / 2, width); return can; };
    function create_leaderboard(scale) { var can = document.createElement("canvas"); var ctx = can.getContext("2d"); var w = 200 * scale; var h = 270 * scale; var r = 8 * scale; can.width = w; can.height = h + 20; ctx.beginPath(); round_rect(ctx, 0, 0, 200 * scale, h - r, r); ctx.globalAlpha = 1; var text = create_text(scale, "Leaderboard", 25, "#FFF"); ctx.drawImage(text, (w - text.width) / 2, scale * 5); return can; };
    function createSimpleTime(time) { if (time >= 3600) return (time / 3600).toFixed(2) + "h"; if (time >= 60) return (time / 60).toFixed(2) + "m"; return time + "s"; };
    function websocketAuthCode(length = 15) { const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; let result = ''; for (let i = 0; i < length; i++) { const randomIndex = Math.floor(Math.random() * characters.length); result += characters[randomIndex]; } return result; };
    function simplify_number(t) { if ("number" != typeof t) return "0"; if (1e4 <= t) { var r = Math.floor(Math.log10(t)) - 2, r = Math.max(0, 3 - r), n = Math.floor(t / 1e3).toString(); if (r) { for (var e = (n += "." + (t % 1e3 / 1e3).toString().substring(2).substring(0, r)).length - 1, i = 0; 0 < e && "0" == n[e]; e--)i++; "." == (n = n.substring(0, n.length - i))[n.length - 1] && (n = n.substring(0, n.length - 1)) } return n += "k" } return t.toString() };
    function forceUpdateBuildings() {
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        for (let j = 0, extractors = [...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_STONE], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_GOLD], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_DIAMOND], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_AMETHYST], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_REIDITE], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_EMERALD], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_COPPER], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_IRON], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_TOPAZ], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_SAPPHIRE], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_JADE], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_RUBY], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_COAL], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_AQUAMARINE]], len = extractors.length; j < len; j++) {
            let extractor = extractors[j];
            extractor[specialProps.update]();
        };
        for (let j = 0, breadOvens = hiddenWorld.Units[ITEMS.BREAD_OVEN], len = breadOvens.length; j < len; j++) {
            let oven = breadOvens[j];
            oven[specialProps.update]();
        };
        for (let j = 0, totems = hiddenWorld.Units[ITEMS.TOTEM], len = totems.length; j < len; j++) {
            let totem = totems[j];
            totem[specialProps.update]();
        };
        for (let j = 0, windmills = hiddenWorld.Units[ITEMS.WINDMILL], len = windmills.length; j < len; j++) {
            let windmill = windmills[j];
            windmill[specialProps.update]();
        };
        for (let j = 0, furnaces = hiddenWorld.Units[ITEMS.FURNACE], len = furnaces.length; j < len; j++) {
            let furnace = furnaces[j];
            furnace[specialProps.update]();
        };
        for (let j = 0, wells = hiddenWorld.Units[ITEMS.WELL], len = wells.length; j < len; j++) {
            let well = wells[j];
            well[specialProps.update]();
        };
        for (let j = 0, machines = hiddenWorld.Units[ITEMS.EMERALD_MACHINE], len = machines.length; j < len; j++) {
            let machine = machines[j];
            machine[specialProps.update]();
        };
    };
    function menuOpacitys() {
        /* Define Panel Opacity */
        if (!Settings.Hidden.active) {
            globalDocument.getElementById("shop_market").style.setProperty("opacity", Number(Settings.menuOpacity));
            globalDocument.getElementById("option_in_game").style.setProperty("opacity", Number(Settings.menuOpacity));
            globalDocument.getElementById("sure_delete").style.setProperty("opacity", Number(Settings.menuOpacity));
            globalDocument.getElementById("cancel_sure_delete").style.setProperty("opacity", Number(Settings.menuOpacity));
            globalDocument.getElementById("shop_starterkit").style.setProperty("opacity", Number(Settings.menuOpacity));
            globalDocument.getElementById("recipe_craft").style.setProperty("opacity", Number(Settings.menuOpacity));
            globalDocument.getElementById("home_craft").style.setProperty("opacity", Number(Settings.menuOpacity));
            globalDocument.getElementById("chronoquest").style.setProperty("opacity", Number(Settings.menuOpacity));
            globalDocument.getElementById("sign_window").style.setProperty("opacity", Number(Settings.menuOpacity));
            globalDocument.getElementById("team_box").style.setProperty("opacity", Number(Settings.menuOpacity));
        } else {
            globalDocument.getElementById("shop_market").style.setProperty("opacity", 1);
            globalDocument.getElementById("option_in_game").style.setProperty("opacity", 1);
            globalDocument.getElementById("sure_delete").style.setProperty("opacity", 1);
            globalDocument.getElementById("cancel_sure_delete").style.setProperty("opacity", 1);
            globalDocument.getElementById("shop_starterkit").style.setProperty("opacity", 1);
            globalDocument.getElementById("recipe_craft").style.setProperty("opacity", 1);
            globalDocument.getElementById("home_craft").style.setProperty("opacity", 1);
            globalDocument.getElementById("chronoquest").style.setProperty("opacity", 1);
            globalDocument.getElementById("sign_window").style.setProperty("opacity", 1);
            globalDocument.getElementById("team_box").style.setProperty("opacity", 1);
        };
    };
    function drawVehicleWithoutAnimations(drawVehicle) { ctx.save(); ctx.globalAlpha = (!Settings.Hidden.active && playingGame) ? Number(Settings.vehicleOpacity) : 1; drawVehicle(); ctx.restore(); };
    const hoodNameCache = {};
    const hoodLevelCache = {};
    function drawHoodNames(player) { if (Settings.Hidden.active || !playingGame) return; if ((player[specialProps.clothe] == INV.HOOD || player[specialProps.clothe] == INV.WINTER_HOOD || player[specialProps.ghost])) { ctx.save(); ctx.translate(hiddenUser.Cam.x + player.x, hiddenUser.Cam.y + player.y); const playerId = player[specialProps.pid]; const playerName = Object.values(hiddenWorld.Players[playerId])[0]; const playerLevel = hiddenWorld.Players[playerId].level; const nameCacheKey = '' + playerId + '_' + playerName + ''; const levelCacheKey = '' + playerId + '_level_' + playerLevel + ''; let img = hoodNameCache[nameCacheKey]; if (!img) { img = create_text(1, playerName, 20, player[specialProps.dist_winter] > 0 ? "#187484" : "#FFF", "#000", 2, null, null, 300); hoodNameCache[nameCacheKey] = img; } let x = Math.floor(-img.width / 2); let y = Math.floor(-img.height / 2 - 6); ctx.drawImage(img, x, y); let levelImg = hoodLevelCache[levelCacheKey]; if (!levelImg) { levelImg = create_text(1, "[" + playerLevel + "]", 20, "#F9E8A2", "#000", 2, null, null, 50); hoodLevelCache[levelCacheKey] = levelImg; } let x2 = x + img.width + 5; if (playerLevel > 0) ctx.drawImage(levelImg, x2, y); ctx.restore(); }; };
    function drawPlayerOnTop(player, drawPlayer, spd) {
        /* Draw players */
        if (player[specialProps.vehicle] !== INV.PARROT && player[specialProps.vehicle] !== INV.GOLDEN_HEN && player[specialProps.vehicle] !== INV.BABY_DRAGON && player[specialProps.vehicle] !== INV.BABY_LAVA && player[specialProps.vehicle] !== INV.HAWK && player[specialProps.vehicle] !== INV.PLANE && player[specialProps.vehicle] !== INV.NIMBUS) { if (player[specialProps.tower] === 0) { if (player[specialProps.tower_fx] > 0.001) { spd = 1 + 0.18 * Math.min(1, Math.max(player[specialProps.tower_fx], 0) / 100); ctx.save(); ctx.scale(spd, spd); hiddenUser.Cam.x /= spd; hiddenUser.Cam.y /= spd; player.x /= spd; player.y /= spd; player.r.x /= spd; player.r.y /= spd; drawPlayer(); hiddenUser.Cam.x *= spd; hiddenUser.Cam.y *= spd; player.x *= spd; player.y *= spd; player.r.x *= spd; player.r.y *= spd; ctx.restore(); } else drawPlayer(); } } else if (player[specialProps.speed] <= 180) { spd = 1 + 0.35 * Math.min(1, Math.max(player[specialProps.vehicle_fx5] - 30, 0) / 180); ctx.save(); ctx.scale(spd, spd); hiddenUser.Cam.x /= spd; hiddenUser.Cam.y /= spd; player.x /= spd; player.y /= spd; player.r.x /= spd; player.r.y /= spd; drawPlayer(); hiddenUser.Cam.x *= spd; hiddenUser.Cam.y *= spd; player.x *= spd; player.y *= spd; player.r.x *= spd; player.r.y *= spd; ctx.restore(); };
        /* Draw Player On Tower */
        if (player[specialProps.tower] === 1 && (player[specialProps.speed] < 180 || (player[specialProps.vehicle] !== INV.PARROT && player[specialProps.vehicle] !== INV.GOLDEN_HEN && player[specialProps.vehicle] !== INV.BABY_DRAGON && player[specialProps.vehicle] !== INV.BABY_LAVA && player[specialProps.vehicle] !== INV.NIMBUS && player[specialProps.vehicle] !== INV.HAWK && player[specialProps.vehicle] !== INV.PLANE))) { spd = 1 + 0.18 * Math.min(1, Math.max(player[specialProps.tower_fx], 0) / 100); ctx.save(); ctx.scale(spd, spd); hiddenUser.Cam.x /= spd; hiddenUser.Cam.y /= spd; player.x /= spd; player.y /= spd; player.r.x /= spd; player.r.y /= spd; drawPlayer(); hiddenUser.Cam.x *= spd; hiddenUser.Cam.y *= spd; player.x *= spd; player.y *= spd; player.r.x *= spd; player.r.y *= spd; ctx.restore(); };
        /* Draw Flying Player */
        if ((player[specialProps.vehicle] === INV.PARROT || player[specialProps.vehicle] === INV.GOLDEN_HEN || player[specialProps.vehicle] === INV.BABY_DRAGON || player[specialProps.vehicle] === INV.BABY_LAVA || player[specialProps.vehicle] === INV.NIMBUS || player[specialProps.vehicle] === INV.HAWK || player[specialProps.vehicle] === INV.PLANE) && player[specialProps.speed] > 180) { spd = 1 + 0.35 * Math.min(1, Math.max(player[specialProps.vehicle_fx5] - 30, 0) / 180); ctx.save(); ctx.scale(spd, spd); hiddenUser.Cam.x /= spd; hiddenUser.Cam.y /= spd; player.x /= spd; player.y /= spd; player.r.x /= spd; player.r.y /= spd; drawPlayer(); hiddenUser.Cam.x *= spd; hiddenUser.Cam.y *= spd; player.x *= spd; player.y *= spd; player.r.x *= spd; player.r.y *= spd; ctx.restore(); };
    };
    function drawVehicle(player, drawPlayer, spd) {
        /* Draw players */
        if (player[specialProps.vehicle] !== INV.PARROT && player[specialProps.vehicle] !== INV.GOLDEN_HEN && player[specialProps.vehicle] !== INV.BABY_DRAGON && player[specialProps.vehicle] !== INV.BABY_LAVA && player[specialProps.vehicle] !== INV.HAWK && player[specialProps.vehicle] !== INV.PLANE && player[specialProps.vehicle] !== INV.NIMBUS) { if (player[specialProps.tower] === 0) { if (player[specialProps.tower_fx] > 0.001) { spd = 1 + 0.18 * Math.min(1, Math.max(player[specialProps.tower_fx], 0) / 100); ctx.save(); ctx.globalAlpha = Number(Settings.vehicleOpacity); ctx.scale(spd, spd); hiddenUser.Cam.x /= spd; hiddenUser.Cam.y /= spd; player.x /= spd; player.y /= spd; player.r.x /= spd; player.r.y /= spd; drawPlayer(); hiddenUser.Cam.x *= spd; hiddenUser.Cam.y *= spd; player.x *= spd; player.y *= spd; player.r.x *= spd; player.r.y *= spd; ctx.restore(); } else drawPlayer(); } } else if (player[specialProps.speed] <= 180) { spd = 1 + 0.35 * Math.min(1, Math.max(player[specialProps.vehicle_fx5] - 30, 0) / 180); ctx.save(); ctx.globalAlpha = Number(Settings.vehicleOpacity); ctx.scale(spd, spd); hiddenUser.Cam.x /= spd; hiddenUser.Cam.y /= spd; player.x /= spd; player.y /= spd; player.r.x /= spd; player.r.y /= spd; drawPlayer(); hiddenUser.Cam.x *= spd; hiddenUser.Cam.y *= spd; player.x *= spd; player.y *= spd; player.r.x *= spd; player.r.y *= spd; ctx.restore(); };
        /* Draw Player On Tower */
        if (player[specialProps.tower] === 1 && (player[specialProps.speed] < 180 || (player[specialProps.vehicle] !== INV.PARROT && player[specialProps.vehicle] !== INV.GOLDEN_HEN && player[specialProps.vehicle] !== INV.BABY_DRAGON && player[specialProps.vehicle] !== INV.BABY_LAVA && player[specialProps.vehicle] !== INV.NIMBUS && player[specialProps.vehicle] !== INV.HAWK && player[specialProps.vehicle] !== INV.PLANE))) { spd = 1 + 0.18 * Math.min(1, Math.max(player[specialProps.tower_fx], 0) / 100); ctx.save(); ctx.globalAlpha = Number(Settings.vehicleOpacity); ctx.scale(spd, spd); hiddenUser.Cam.x /= spd; hiddenUser.Cam.y /= spd; player.x /= spd; player.y /= spd; player.r.x /= spd; player.r.y /= spd; drawPlayer(); hiddenUser.Cam.x *= spd; hiddenUser.Cam.y *= spd; player.x *= spd; player.y *= spd; player.r.x *= spd; player.r.y *= spd; ctx.restore(); };
        /* Draw Flying Player */
        if ((player[specialProps.vehicle] === INV.PARROT || player[specialProps.vehicle] === INV.GOLDEN_HEN || player[specialProps.vehicle] === INV.BABY_DRAGON || player[specialProps.vehicle] === INV.BABY_LAVA || player[specialProps.vehicle] === INV.NIMBUS || player[specialProps.vehicle] === INV.HAWK || player[specialProps.vehicle] === INV.PLANE) && player[specialProps.speed] > 180) { spd = 1 + 0.35 * Math.min(1, Math.max(player[specialProps.vehicle_fx5] - 30, 0) / 180); ctx.save(); ctx.globalAlpha = Number(Settings.vehicleOpacity); ctx.scale(spd, spd); hiddenUser.Cam.x /= spd; hiddenUser.Cam.y /= spd; player.x /= spd; player.y /= spd; player.r.x /= spd; player.r.y /= spd; drawPlayer(); hiddenUser.Cam.x *= spd; hiddenUser.Cam.y *= spd; player.x *= spd; player.y *= spd; player.r.x *= spd; player.r.y *= spd; ctx.restore(); };
    };
    function createSymbolicValue(key, obj, hiddenObj, prop, criteria, expectedValues, expectedArgCount, functionCallsWithoutArguments, functionLineCount, stringToInclude, previewFunction, specializedIndex) {
        let currentIndex = 0;
        for (let i = 0; i < Object.keys(obj).length; i++) {
            const propName = Object.keys(obj)[i];
            const value = obj[propName];
            if (obj[prop]) { propertysClaimed.push(key + prop); return devMODE ? savedLog('%cAssigned %c"' + prop + '"%c To %c"' + prop + '":', 'color: lime;', 'color: yellow;', 'color: lime;', 'color: yellow;', [obj[prop]]) : null; };
            if (typeof criteria === 'function' && typeof value === 'function' && !propertysClaimed.includes(key + propName)) {
                let lines = beautifyAndCount(value.toString());
                if (functionLineCount && (lines != functionLineCount && functionLineCount != 'any')) continue;
                const decodedFunction = decodeASCII(value.toString());
                let decodedStrings = extractQuotedStrings(decodedFunction);
                if (decodedStrings.toString().length > 300 || !decodedStrings.length) decodedStrings = [];
                const hasCommonSubstrings = expectedValues.some(substring => decodedStrings.some(item => item.includes(substring))) || (decodedStrings.length && expectedValues[0] == 'any');
                const functionCalls = countFunctionCallsWithoutArgs(value.toString());
                const argCount = value.length;
                const codeIncludes = value.toString().includes(stringToInclude);
                if ((stringToInclude && stringToInclude.length && codeIncludes || !stringToInclude || !stringToInclude.length || stringToInclude == 'none') && (hasCommonSubstrings || (!expectedValues[0] && hasCommonSubstrings === 0)) && (argCount === expectedArgCount || expectedArgCount == 'any') && (((functionCallsWithoutArguments || functionCallsWithoutArguments == 0) && functionCalls === functionCallsWithoutArguments) || (!functionCallsWithoutArguments && functionCallsWithoutArguments != 0 || functionCallsWithoutArguments == 'any'))) {
                    let differenceThreshold = 25;
                    let difference = previewFunction && value ? Math.abs(previewFunction.toString().length - value.toString().length) : 0;
                    let color = difference ? difference > differenceThreshold ? 'orange' : 'lime' : 'lime';
                    const comparisonResult = previewFunction ? compareFunctions(previewFunction.toString(), value.toString()) : 100;
                    if (devMODE && comparisonResult < 100) color = 'orange';
                    if (devMODE) savedLog('%cAssigned %c"' + prop + '"%c To %c"' + propName + '":', 'color: ' + color + ';', 'color: yellow;', 'color: ' + color + ';', 'color: yellow;', difference > differenceThreshold || comparisonResult < 100 ? value.toString() : [value], 'L:', lines, 'I', i); /* L for Lines | I for Index */
                    if (devMODE && previewFunction && difference > differenceThreshold && comparisonResult == 100) savedLog('%c[DIFFERENCE] --------' + '-'.repeat(prop.length) + '-'.repeat(propName.length) + '>', 'color: red;', previewFunction, 'D:', difference); /* D for Difference */
                    if (comparisonResult < 100) {
                        continue;
                        if (devMODE) savedLog('%c[COMPARISON] --------' + '-'.repeat(prop.length) + '-'.repeat(propName.length) + '>', 'color: red;', previewFunction, 'C:', comparisonResult); /* C for Comparison */
                    };
                    defineProperty(hiddenObj, prop, { get() { return obj[propName]; }, set(data) { obj[propName] = data; } });
                    propertysClaimed.push(key + propName);
                    propertyIndexes.push([key + prop, i]);
                    return;
                };
            };
            if (Array.isArray(value) && Array.isArray(criteria) && (getLength(value) === expectedValues || expectedValues == 'any') && !propertysClaimed.includes(key + propName)) {
                defineProperty(hiddenObj, prop, { get() { return obj[propName]; }, set(data) { obj[propName] = data; } });
                if (devMODE) savedLog('%cAssigned %c"' + prop + '"%c To %c"' + propName + '":', 'color: lime;', 'color: yellow;', 'color: lime;', 'color: yellow;', value);
                propertysClaimed.push(key + propName);
                propertyIndexes.push([key + prop, i]);
                return;
            };
            if (!Array.isArray(criteria) && typeof criteria === 'object' && !Array.isArray(value) && typeof value === 'object' && matchesCriteria(value, criteria) && (getLength(value) === expectedValues || expectedValues == 'any') && !propertysClaimed.includes(key + propName)) {
                defineProperty(hiddenObj, prop, { get() { return obj[propName]; }, set(data) { obj[propName] = data; } });
                if (devMODE) savedLog('%cAssigned %c"' + prop + '"%c To %c"' + propName + '":', 'color: lime;', 'color: yellow;', 'color: lime;', 'color: yellow;', value);
                propertysClaimed.push(key + propName);
                propertyIndexes.push([key + prop, i]);
                return;
            };
            if (typeof criteria === 'boolean' && typeof value === 'boolean' && value === criteria && !propertysClaimed.includes(key + propName)) {
                if (specializedIndex) {
                    currentIndex++;
                };

                if (specializedIndex && specializedIndex !== currentIndex) continue;
                defineProperty(hiddenObj, prop, { get() { return obj[propName]; }, set(data) { obj[propName] = data; } });
                if (devMODE) savedLog('%cAssigned %c"' + prop + '"%c To %c"' + propName + '":', 'color: lime;', 'color: yellow;', 'color: lime;', 'color: yellow;', value);
                propertysClaimed.push(key + propName);
                propertyIndexes.push([key + prop, i]);
                return;
            };
            if (typeof criteria === 'number' && typeof value === 'number' && value === criteria && !propertysClaimed.includes(key + propName) && value === expectedValues) {
                if (specializedIndex) {
                    currentIndex++;
                };

                if (specializedIndex && specializedIndex !== currentIndex) continue;
                defineProperty(hiddenObj, prop, { get() { return obj[propName]; }, set(data) { obj[propName] = data; } });
                if (devMODE) savedLog('%cAssigned %c"' + prop + '"%c To %c"' + propName + '":', 'color: lime;', 'color: yellow;', 'color: lime;', 'color: yellow;', value);
                propertysClaimed.push(key + propName);
                propertyIndexes.push([key + prop, i]);
                return;
            }
        };
        if (devMODE) savedLog('%cFailed To Assign: %c"' + prop + '"%c - No matching property found.', 'color: red;', 'color: yellow;', 'color: red;',);
    };
    function createSymbolicLinkIndex(key, obj, hiddenObj, prop, index) {
        if (obj[prop]) return;
        let counter = 0;
        for (const propName in obj) {
            if (counter === index) {
                propertyIndexes.push([key + prop, index]);
                propertysClaimed.push(key + propName);
                defineProperty(hiddenObj, prop, {
                    get() {
                        return obj[propName];
                    },
                    set(data) {
                        obj[propName] = data;
                    }
                });

                if (devMODE) {
                    if (typeof obj[propName] === 'function') {
                        savedLog('%cAssigned %c"' + prop + '"%c To %c"' + propName + '":', 'color: lime;', 'color: yellow;', 'color: lime;', 'color: yellow;', [obj[propName]], 'L:', beautifyAndCount(obj[propName].toString()), 'I:', index);
                    } else {
                        savedLog('%cAssigned %c"' + prop + '"%c To %c"' + propName + '":', 'color: lime;', 'color: yellow;', 'color: lime;', 'color: yellow;', obj[propName]);
                    };
                }
                return;
            }
            counter++;
        }
        if (devMODE) savedLog('%cFailed To Assign: %c"' + prop + '"%c To Index: %c+' + index + '%c With Object:', 'color: red;', 'color: yellow;', 'color: red;', 'color: yellow;', 'color: red;', obj);
    };
    function CTI(c) { let img = new Image(); img.src = c.toDataURL("image/png"); /* Cross browser */ img.width = c.width; img.height = c.height; img.isLoaded = 1; return img };
    function fill_path(ctx, fill, stroke, width) { if (fill) { ctx.fillStyle = fill; ctx.fill(); }; if (stroke) { ctx.lineWidth = width; ctx.strokeStyle = stroke; ctx.stroke(); } };
    function round_rect(ctx, a, b, d, c, e) { d < 2 * e && (e = d / 2); c < 2 * e && (e = c / 2); 0 > e && (e = 0); ctx.beginPath(); ctx.moveTo(a + e, b); ctx.arcTo(a + d, b, a + d, b + c, e); ctx.arcTo(a + d, b + c, a, b + c, e); ctx.arcTo(a, b + c, a, b, e); ctx.arcTo(a, b, a + d, b, e); ctx.closePath(); };
    function create_roof(scale, draw_shadow, color) { let can = globalDocument.createElement("canvas"); let ctx = can.getContext("2d"); can.width = 248 * scale; can.height = 247 * scale; ctx.save(); ctx.translate(69.5 * scale, 145 * scale); round_rect(ctx, -8.5 * scale, -63 * scale, 17 * scale, 127 * scale, 1 * scale); ctx.restore(); fill_path(ctx, color[0]); ctx.save(); ctx.translate(183 * scale, 145 * scale); round_rect(ctx, -8 * scale, -63 * scale, 16 * scale, 126 * scale, 1 * scale); ctx.restore(); fill_path(ctx, color[0]); ctx.save(); ctx.translate(123.5 * scale, 62.5 * scale); ctx.rotate(6.28); round_rect(ctx, -84.5 * scale, -25.5 * scale, 169 * scale, 51 * scale, 5 * scale); ctx.restore(); fill_path(ctx, color[2], color[1], 6 * scale); ctx.save(); ctx.translate(123.5 * scale, 118 * scale); ctx.rotate(6.24); round_rect(ctx, -85.5 * scale, -24 * scale, 169 * scale, 48 * scale, 5 * scale); ctx.restore(); fill_path(ctx, color[3], color[1], 6 * scale); ctx.save(); ctx.translate(122 * scale, 177.5 * scale); ctx.rotate(6.32); round_rect(ctx, -84 * scale, -23.5 * scale, 169 * scale, 47 * scale, 5 * scale); ctx.restore(); fill_path(ctx, color[2], color[1], 6 * scale); ctx.beginPath(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.moveTo(37 * scale, 157 * scale); ctx.bezierCurveTo(49 * scale, 160 * scale, 49 * scale, 160 * scale, 61 * scale, 163 * scale); ctx.bezierCurveTo(49.5 * scale, 165.5 * scale, 49.5 * scale, 165.5 * scale, 38 * scale, 168 * scale); ctx.closePath(); fill_path(ctx, color[1]); ctx.beginPath(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.moveTo(205 * scale, 175 * scale); ctx.bezierCurveTo(192.5 * scale, 180 * scale, 192.5 * scale, 180 * scale, 180 * scale, 185 * scale); ctx.bezierCurveTo(193 * scale, 188 * scale, 193 * scale, 188 * scale, 206 * scale, 191 * scale); ctx.closePath(); fill_path(ctx, color[1]); return can; };
    function create_roof1(scale, draw_shadow, color) { let can = globalDocument.createElement("canvas"); let ctx = can.getContext("2d"); can.width = 248 * scale; can.height = 247 * scale; ctx.save(); ctx.translate(182 * scale, 120 * scale); round_rect(ctx, -8 * scale, -67 * scale, 16 * scale, 134 * scale, 1 * scale); ctx.restore(); fill_path(ctx, color[0]); ctx.save(); ctx.translate(68.5 * scale, 127.5 * scale); round_rect(ctx, -8.5 * scale, -70.5 * scale, 17 * scale, 141 * scale, 1 * scale); ctx.restore(); fill_path(ctx, color[0]); ctx.save(); ctx.translate(123.5 * scale, 68 * scale); round_rect(ctx, -82.5 * scale, -24 * scale, 165 * scale, 48 * scale, 4 * scale); ctx.restore(); fill_path(ctx, color[2], color[1], 6 * scale); ctx.save(); ctx.translate(123 * scale, 179.5 * scale); round_rect(ctx, -83 * scale, -24.5 * scale, 166 * scale, 49 * scale, 4 * scale); ctx.restore(); fill_path(ctx, color[2], color[1], 6 * scale); ctx.save(); ctx.translate(123.5 * scale, 123.5 * scale); ctx.rotate(6.24); round_rect(ctx, -82.5 * scale, -24.5 * scale, 165 * scale, 49 * scale, 4 * scale); ctx.restore(); fill_path(ctx, color[3], color[1], 6 * scale); ctx.beginPath(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.moveTo(204 * scale, 112 * scale); ctx.bezierCurveTo(149 * scale, 121.5 * scale, 96 * scale, 130 * scale, 94 * scale, 131 * scale); ctx.bezierCurveTo(149.5 * scale, 127.5 * scale, 149.5 * scale, 127.5 * scale, 205 * scale, 124 * scale); ctx.closePath(); fill_path(ctx, color[1]); return can; }
    function create_roof2(scale, draw_shadow, color) { let can = globalDocument.createElement("canvas"); let ctx = can.getContext("2d"); can.width = 248 * scale; can.height = 247 * scale; ctx.save(); ctx.translate(183 * scale, 107 * scale); round_rect(ctx, -8 * scale, -70.5 * scale, 16 * scale, 141 * scale, 1 * scale); ctx.restore(); fill_path(ctx, color[0]); ctx.save(); ctx.translate(69.5 * scale, 110 * scale); round_rect(ctx, -8.5 * scale, -71 * scale, 17 * scale, 143 * scale, 1 * scale); ctx.restore(); fill_path(ctx, color[0]); ctx.save(); ctx.translate(123.5 * scale, 181 * scale); round_rect(ctx, -84.5 * scale, -26 * scale, 169 * scale, 52 * scale, 5 * scale); ctx.restore(); fill_path(ctx, color[2], color[1], 6 * scale); ctx.beginPath(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.moveTo(41 * scale, 95 * scale); ctx.bezierCurveTo(105 * scale, 96 * scale, 113 * scale, 99 * scale, 134 * scale, 102 * scale); ctx.bezierCurveTo(147 * scale, 106 * scale, 173 * scale, 100 * scale, 207 * scale, 105 * scale); ctx.bezierCurveTo(210 * scale, 105 * scale, 207 * scale, 140 * scale, 207 * scale, 154 * scale); ctx.bezierCurveTo(123.5 * scale, 151.5 * scale, 123.5 * scale, 151.5 * scale, 40 * scale, 149 * scale); ctx.bezierCurveTo(37 * scale, 145 * scale, 39 * scale, 95 * scale, 41 * scale, 96 * scale); ctx.closePath(); fill_path(ctx, color[2], color[1], 6 * scale); ctx.beginPath(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.moveTo(68 * scale, 75 * scale); ctx.bezierCurveTo(54 * scale, 72.5 * scale, 54 * scale, 72.5 * scale, 40 * scale, 70 * scale); ctx.bezierCurveTo(38 * scale, 46 * scale, 40 * scale, 46 * scale, 53 * scale, 46 * scale); ctx.bezierCurveTo(201 * scale, 41 * scale, 201 * scale, 41 * scale, 201 * scale, 42 * scale); ctx.bezierCurveTo(211 * scale, 40 * scale, 208 * scale, 53 * scale, 208 * scale, 72 * scale); ctx.bezierCurveTo(209 * scale, 91 * scale, 210 * scale, 96 * scale, 194 * scale, 94 * scale); ctx.bezierCurveTo(119 * scale, 97 * scale, 119 * scale, 97 * scale, 44 * scale, 100 * scale); ctx.bezierCurveTo(39 * scale, 99 * scale, 40 * scale, 96 * scale, 40 * scale, 80 * scale); ctx.bezierCurveTo(54 * scale, 77.5 * scale, 54 * scale, 77.5 * scale, 68 * scale, 75 * scale); ctx.closePath(); fill_path(ctx, color[3], color[1], 6 * scale); return can; };
    function create_roof_reduceTextures(scale, draw_shadow, color) { let can = globalDocument.createElement("canvas"); let ctx = can.getContext("2d"); can.width = 248 * scale; can.height = 247 * scale; ctx.save(); ctx.translate(123.5 * scale, 62.5 * scale); ctx.rotate(6.28); ctx.rect(-84.5 * scale, -25.5 * scale, 169 * scale, 169 * scale); ctx.restore(); fill_path(ctx, color[2]); return can; };
    function loadRoofTextures() { SPRITE.ROOF = [[], [], [], []]; SPRITE.ROOF[0][0] = CTI(create_roof(0.59, true, ["#0d1b1c", "#44301b", "#57442a", "#523e26"])); SPRITE.ROOF[0][1] = CTI(create_roof(0.59, true, ["#0c0c0d", "#062124", "#10373d", "#0f3333"])); SPRITE.ROOF[1][0] = CTI(create_roof1(0.59, true, ["#0d1b1c", "#44301b", "#57442a", "#523e26"])); SPRITE.ROOF[1][1] = CTI(create_roof1(0.59, true, ["#0c0c0d", "#062124", "#10373d", "#0f3333"])); SPRITE.ROOF[2][0] = CTI(create_roof2(0.59, true, ["#0d1b1c", "#44301b", "#57442a", "#523e26"])); SPRITE.ROOF[2][1] = CTI(create_roof2(0.59, true, ["#0c0c0d", "#062124", "#10373d", "#0f3333"])); SPRITE.ROOF[3][0] = CTI(create_roof_reduceTextures(0.59, true, ["#0d1b1c", "#57442a", "#57442a", "#523e26"])); SPRITE.ROOF[3][1] = CTI(create_roof_reduceTextures(0.59, true, ["#0c0c0d", "#10373d", "#10373d", "#0f3333"])) }; loadRoofTextures();
    function circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); };
    function CTI(c) { var img = new Image; img.src = c.toDataURL("image/png"); img.width = c.width; img.height = c.height; img.isLoaded = 1; return img; };

    function checkForSocketChange() {
        if (hiddenClient.Socket !== lastSocketValue && hiddenClient.Socket) {
            /* Try Close Last Socket */
            if (lastSocketValue) lastSocketValue.close();
            originalOnOpen = hiddenClient.Socket.onopen.bind(hiddenClient.Socket);
            sendOriginal = hiddenClient.Socket.send.bind(hiddenClient.Socket);
            originalClose = hiddenClient.Socket.close.bind(hiddenClient.Socket);
            lastSocketValue = hiddenClient.Socket;
            /* Listen To Websocket Closing */
            hiddenClient.Socket.close = function (event) {
                /* Prevent Closing Socket */
                try {
                    if (!playingGame && hiddenClient.Socket.readyState === 1) originalClose();
                } catch (err) { };
            };
            hiddenClient.Socket.onclose = function (event) {
                if (gameQuitCalled) hiddenGame.Quit(gameQuitCalled);
                playerIntervals = {};
                playingGame = 0;
                healTick = false;
                spawnPacketSent = false;
                ui.waiting = false;
                renderingActive = false;
            };
            hiddenClient.Socket.onopen = function () {
                renderingActive = false;
                onopenCalled = true;
                backToLobby = 0;
                if (!dateNowIntegrity) try { crashHandler(6); for (; ;); } catch { for (; ;); };
                if (!loadVerified) try { crashHandler(7); for (; ;); } catch { for (; ;); };

                /** Disable hacks */
                cachedAimbot = Settings.Aimbot.active;
                cachedAutoFarm = Settings.AutoFarm.active;
                cachedAutoSpike = Settings.AutoSpike.active;
                cachedAutoCraft = Settings.AutoCraft.active;
                cachedAutoReycle = Settings.AutoRecycle.active;
                cachedAutoTotem = Settings.AutoTotem.active;
                cachedSpectator = Spectator;
                cachedAutoFire = Settings.AutoFire.active;
                cachedAutoBuild = Settings.AutoBuild.active;
                cachedAutoSteal = Settings.AutoSteal.active;
                cachedSmartCraft = Settings.SmartCraft.active;
                cachedAutoSeed = Settings.AutoSeed.active;
                cachedAutoEme = Settings.AutoEmerald.active;

                Settings.Aimbot.active = false;
                Settings.AutoFarm.active = false;
                Settings.AutoSpike.active = false;
                Settings.AutoCraft.active = false;
                Settings.AutoRecycle.active = false;
                Settings.AutoTotem.active = false;
                Spectator = false;
                Settings.AutoFire.active = false;
                Settings.AutoBuild.active = false;
                Settings.AutoSteal.active = false;
                Settings.SmartCraft.active = false;
                Settings.AutoSeed.active = false;
                Settings.AutoEmerald.active = false;

                originalOnOpen()
            };
            /* Listen To Sent Messages */
            hiddenClient.Socket.send = function (message) {
                /* Require Socket To Be Open */
                if (hiddenClient.Socket.readyState !== 1 || sendingRespawn) return;
                if (spawnPacketSent && (sendIDS.build || sendIDS.build == 0) && ("string" === typeof message && JSON.parse(message)[0] != sendIDS.camera && JSON.parse(message)[0] != sendIDS.build)) return sendOriginal(message);
                if ("string" === typeof message) {
                    let parsed = JSON.parse(message);
                    if (!playingGame && parsed[0] != hiddenUi.Nickname.input.value) return;
                    else playingGame = true;
                    /* Find Camera Message ID */ if (!sendIDS.camera && sendIDS.camera != 0) if (parsed) if (parsed.length == 3) { sendIDS.camera = parsed[0]; };
                    /* Find Build Message ID */ if (!sendIDS.build && sendIDS.build != 0) if (parsed) if (parsed.length == 4) { sendIDS.build = parsed[0]; return; };
                    switch (parsed[0]) {
                        case sendIDS.build:
                            lastBuildId = parsed[1];
                            if (parsed[1] === INV.TOTEM) {
                                let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                                /* Draw on Minimap */
                                Settings.totemOnMap.x = (myPlayer.x / (hiddenWorld.__NW__ * 100));
                                Settings.totemOnMap.y = (myPlayer.y / (hiddenWorld.__NH__ * 100));
                            };

                            sendOriginal(JSON.stringify(parsed));
                            break;
                        case sendIDS.camera:
                            /* Require Socket To Be Open */
                            if (hiddenClient.Socket.readyState !== 1 || !spawnPacketSent) return;
                            /* Hook Build ID */
                            if (!sendIDS.build && sendIDS.build != 0) hiddenClient.SendBuild();
                            /* Modify Camera Position */
                            let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                            /* Loop Through Camera Updates Whilst We Have Zoom Active */
                            //// Temp Disabled It
                            Settings.increasedZoom = "Off"
                            if (myPlayer && myPlayer.x && myPlayer.y && !renderingActive && (devicePixelRatio <= 0.6 && Settings.increasedZoom == "Auto")) {
                                renderingActive = true;
                                function renderLoop() {
                                    zoomLoopEnabled = true;
                                    let increment = 0;
                                    /* Updating Every 250ms (To Reduce Packet Spam) */
                                    let packetInterval = workerTimers.setInterval(() => {
                                        if (Settings.increasedZoom == "Off" || (devicePixelRatio > 0.6 && Settings.increasedZoom == "Auto")) {
                                            renderingActive = false;
                                            if (packetInterval) workerTimers.clearInterval(packetInterval);
                                            return;
                                        };
                                        /* Loop Through Camera Updates Whilst We Have Zoom Active */
                                        let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                                        if (!myPlayer) {
                                            renderingActive = false;
                                            zoomLoopEnabled = false;
                                            return;
                                        };
                                        if (increment >= 4) increment = 1; else increment += 1;
                                        parsed[1] = (myPlayer.x - ((increment == 1 || increment == 4) ? 2100 : 0));
                                        parsed[2] = (myPlayer.y - ((increment == 1 || increment == 2) ? 1400 : 0));
                                        sendOriginal(JSON.stringify(parsed));
                                    }, 250);
                                };
                                renderLoop();
                            } else {
                                /* Modify Camera Position */
                                let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                                if (myPlayer && Math.floor(myPlayer.x / 100) <= 15) { /* Position Camera Left */ parsed[1] += 200; parsed[2] += 180; }
                                else if (myPlayer && (map.width - Math.floor(myPlayer.x / 100) <= 15)) { /* Position Camera Right */ parsed[1] += 400; parsed[2] += 180; }
                                else { /* Position Camera Middle */ parsed[1] += 300; parsed[2] += 180; };
                                return sendOriginal(JSON.stringify(parsed));
                            }
                            return;
                            break;
                        case hiddenUi.Nickname.input.value:
                            playingGame = 1;
                            spawnPacketSent = true;
                            parsed[1] = 3840;
                            parsed[2] = 2160;
                            parsed[4] = Settings.localToken.Token;
                            parsed[5] = Settings.localToken.TokenID;

                            Settings.Aimbot.active = cachedAimbot;
                            Settings.AutoFarm.active = cachedAutoFarm;
                            Settings.AutoSpike.active = cachedAutoSpike;
                            Settings.AutoCraft.active = cachedAutoCraft;
                            Settings.AutoRecycle.active = cachedAutoReycle;
                            Settings.AutoTotem.active = cachedAutoTotem;
                            Spectator = cachedSpectator;
                            Settings.AutoFire.active = cachedAutoFire;
                            Settings.AutoBuild.active = cachedAutoBuild;
                            Settings.AutoSteal.active = cachedAutoSteal;
                            Settings.SmartCraft.active = cachedSmartCraft;
                            Settings.AutoSeed.active = cachedAutoSeed;
                            Settings.AutoEmerald.active = cachedAutoEme;

                            if (devMODE) savedLog("Spawn Packet", parsed);
                            return sendOriginal(JSON.stringify(parsed));
                            break;
                        case 16:
                            savedLog(parsed);
                            return sendOriginal(JSON.stringify(parsed));
                            break;
                        default: return sendOriginal(message); break;
                    }
                } else {
                    return sendOriginal(message);
                }
            };
        };
    };

    function fasterLoadingAnimations() {
        /* Faster Menu Loading Animations AND Avoids Proxy Detection Error Execution Etc */
        const originalSetTimeout = setTimeout;
        setTimeout = function (callback, delay, ...args) {
            if (arguments.length === 0) throw new Error("TypeError: Failed to execute 'setTimeout' on 'Window': 1 argument required, but only 0 present.");
            if (delay === 33 && !Settings.Hidden.active) delay = 0;
            return originalSetTimeout(callback, delay, ...args);
        };
        setTimeout.toString = function () { return 'setTimeout() { [native code] }' };
        let toString; setTimeout.toString.toString = (toString = function () { return 'function toString() { [native code] }'; }).toString = toString;
    };

    async function initHooks() {
        /* Correct The Globals */
        if (!hooksFound) {
            // if (devMODE) savedLog(globalProps);
            for (let i = 0; i < globalProps.length; i++) {
                if ((globalProps[i].connect || globalProps[i].message || globalProps[i].ping || globalProps[i].timeout) && !client) { client = globalProps[i]; };
                if ((globalProps[i].w || globalProps[i].transition) && !world) { world = globalProps[i]; };
                if ((globalProps[i].waiting || globalProps[i].buttons || globalProps[i].unlock) && !ui) { ui = globalProps[i]; };
                if ((globalProps[i].alert || globalProps[i].beta || globalProps[i].control) && !user) { user = globalProps[i]; };
                if ((globalProps[i].options) && !game) {
                    game = globalProps[i];
                };
            };
        };

        if (inner['JSON']['canParse'] != inner['webkitURL']['canParse'] || inner['JSON']['isRawJSON']) for (; ;);
        if (inner['JSON']['canParse'] != inner['webkitURL']['canParse'] || inner['JSON']['isRawJSON']) for (; ;);

        if (client && game && ui && world && user && !hooksFound && globalDocument[defaultViewString]['js_beautify']) {

            /* Cancel Waiting UI Incase They Click It Before Script Loads */
            ui.waiting = false;

            let startTime = performance.now();
            hooksFound = true;
            if (hookInterval) workerTimers.clearInterval(hookInterval);
            if (devMODE) savedLog("%cCLIENT", 'color: blue; font-size: 18px;');
            createSymbolicLinkIndex('client', client, hiddenClient, "Socket", 0); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000001' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000002') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            /* Define Socket Functions Once */
            createSymbolicValue('client', client, hiddenClient, "Timeout", function () { }, [], 0, 3, 'any', 'waiting'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000003' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000004') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "Bandage", function () { }, [], 1, 0, 3, 'none', 'function(bandage){hiddenUser.bandage=bandage;}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000005' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000006') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "BlizzardStatus", function () { }, [], 1, 0, 3, 'none', 'function(blizzard){hiddenUser.blizzard=blizzard;}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000007' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000008') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "Message", function () { }, [], 1, 0, 3, 'none', 'function(msg){this.new_alert(msg);}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000009' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000010') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "RecycleOk", function () { }, [], 1, 0, 4, 'none', 'function(id){hiddenUser.auto_feed.delay=0;hiddenUser.craft.do_recycle(id);}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000011' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000012') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "BuildOk", function () { }, [], 1, 0, 4, 'none', 'function(id){hiddenUser.auto_feed.delay=0;hiddenUser.craft.do_craft(id);}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000013' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000014') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "NewPlayer", function () { }, ["|"], 1, 0, 18, 'none', 'function(msg){let id=msg[1];let players=hiddenWorld.players;players[id].nickname=msg[2];players[id].skin=msg[3];players[id].accessory=msg[4];players[id].baglook=msg[5];players[id].book=msg[6];players[id].crate=msg[7];players[id].dead=msg[8];players[id].level=msg[9];players[id].score=0;players[id].ldb_label=null;players[id].label=null;players[id].label_winter=null;players[id].alive=true;if(SHOW_ID===1)players[id].nickname+="|"+id;}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000015' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000016') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "GetFocus", function () { }, [], 0, 0, 3, 'stringify', 'function(){this.socket[SENDWORD](WINDOW1[JSONWORD1].stringify([11]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000017' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000018') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "EmptyRes", function () { }, [], 0, 0, 3, 'EMPTY', 'function(){this.new_alert(LANG[TEXT.EMPTY]);}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000019' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000020') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "ChooseKit", function () { }, [], 1, 0, 4, 'stringify', 'function(id){this.socket[SENDWORD](WINDOW3[JSONWORD7].stringify([21,id]));hiddenUser.shop.open=false;}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000021' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000022') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "Gauges", function () { }, [], 7, 0, 9, 'none', 'function(life,food,cold,thirst,oxygen,warm,bandage){hiddenUser.gauges.l=life/100;hiddenUser.gauges.h=food/100;hiddenUser.gauges.c=cold/100;hiddenUser.gauges.t=thirst/100;hiddenUser.gauges.o=oxygen/100;hiddenUser.gauges.wa=warm/100;hiddenUser.bandage=bandage;}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000022' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000023') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "GetTime", function () { }, [], 1, 0, 5, 'none', 'function(d){hiddenWorld.time=d;hiddenWorld.transition=true;audio.transition=1;}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000024' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000025') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "KillPlayer", function () { }, [], 1, 0, 4, 'mode', 'function(id){if(hiddenWorld.mode==WORLD.MODE_HUNGER_GAMES&&hiddenWorld.players[id].nickname!=="spectator")this.new_alert(hiddenWorld.players[id].nickname+LANG[TEXT.DEAD]);hiddenWorld.players[id].alive=false;}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000026' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000027') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "SetCam", function () { }, [], 1, 0, 4, 'Uint16Array', 'function(data){let ui16=new Uint16Array(data);player.cam.change(ui16[1],ui16[2]);}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000028' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000029') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "RecoverFocus", function () { }, [], 1, 0, 4, 'Uint16Array', 'function(data){let ui16=new Uint16Array(data);hiddenUser.cam.change(ui16[1],ui16[2]);}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000030' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000031') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "Resurrection", function () { }, [], 0, 0, 3, 'stringify', 'function(){this.socket[SENDWORD](WINDOW2[JSONWORD2].stringify([17,hiddenUser.resurrection.pid,hiddenUser.resurrection.iid,]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000032' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000033') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "GiveWheat", function () { }, [], 2, 0, 3, 'stringify', 'function(windmill,n){this.socket[SENDWORD](WINDOW2[JSONWORD4].stringify([22,n,windmill.pid,windmill.iid]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000034' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000035') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('client', client, hiddenClient, "GiveBreadOven", findIndex('client', "GiveWheat", propertyIndexes) + 1); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000036' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000037') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); }; /* Symbolic Index (Cant Compare) */
            createSymbolicValue('client', client, hiddenClient, "TakeBread", function () { }, [], 1, 0, 3, 'stringify', 'function(bread_oven){this.socket[SENDWORD](WINDOW5[JSONWORD5].stringify([26,bread_oven.pid,bread_oven.iid]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000038' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000039') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "ClaimQuestReward", function () { }, [], 1, 0, 3, 'stringify', 'function(quest){this.socket[SENDWORD](WINDOW5[JSONWORD8].stringify([27,quest]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000040' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000041') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "GiveWell", function () { }, [], 1, 0, 3, 'stringify', 'function(well){this.socket[SENDWORD](WINDOW4[JSONWORD2].stringify([30,well.pid,well.iid]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000042' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000043') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "GiveWoodExtractor", function () { }, [], 2, 0, 3, 'stringify', 'function(extractor,n){this.socket[SENDWORD](WINDOW3[JSONWORD5].stringify([38,n,extractor.pid,extractor.iid,extractor.type,]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000044' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000045') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "GiveWood", function () { }, [], 2, 0, 3, 'stringify', 'function (furnace,n) {this.socket[SENDWORD]( WINDOW3[JSONWORD5].stringify([12,n,furnace.pid,furnace.iid]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000046' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000047') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "GiveItem", function () { }, [], 3, 0, 3, 'stringify', 'function(chest,id,n){this.socket[SENDWORD](WINDOW4[JSONWORD4].stringify([8,id,n,chest.pid,chest.iid]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000048' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000049') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "TakeExtractor", function () { }, [], 1, 0, 3, 'stringify', 'function(extractor){this.socket[SENDWORD](WINDOW5[JSONWORD5].stringify([37,extractor.pid,extractor.iid,extractor.type,]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000050' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000051') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "TakeFlour", function () { }, [], 1, 0, 3, 'stringify', 'function(windmill){this.socket[SENDWORD](WINDOW5[JSONWORD5].stringify([23, windmill.pid, windmill.iid]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000052' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000053') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "TakeChest", function () { }, [], 1, 0, 3, 'stringify', 'function(chest){this.socket[SENDWORD](WINDOW5[JSONWORD5].stringify([9, chest.pid, chest.iid]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000054' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000055') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "UnlockChest", function () { }, [], 1, 0, 3, 'stringify', 'function(chest){this.socket[SENDWORD](WINDOW6[JSONWORD6].stringify([15,chest.pid,chest.iid]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000056' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000057') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "LockChest", function () { }, [], 1, 0, 3, 'stringify', 'function(chest){this.socket[SENDWORD](WINDOW7[JSONWORD7].stringify([16,chest.iid]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000058' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000059') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "KickTeam", function () { }, [], 1, 0, 3, 'stringify', 'function(kick){_this.socket[SENDWORD](WINDOW8[JSONWORD8].stringify([20,hiddenUser.totem.id,hiddenUser.team[kick]]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000060' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000061') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "JoinTeam", function () { }, [], 0, 0, 3, 'stringify', 'function(){_this.socket[SENDWORD](WINDOW9[JSONWORD9].stringify([18,hiddenUser.totem.pid,hiddenUser.totem.id]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000062' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000063') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "LeaveTeam", function () { }, [], 0, 0, 3, 'stringify', 'function(){_this.socket[SENDWORD](WINDOW10[JSONWORD10].stringify([19]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000064' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000065') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "Units", function () { }, [], 3, 1, 'any', 'none'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000066' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000067') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); }; /* Not Comparable */
            createSymbolicValue('client', client, hiddenClient, "Chat", function () { }, [" ...", "... "], 1, 2, 'any', 'none'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000068' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000069') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); }; /* Not Comparable */
            createSymbolicLinkIndex('client', client, hiddenClient, "Welcome", findIndex('client', "Chat", propertyIndexes) - 1); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000070' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000071') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "SelectCraft", function () { }, [], 1, 1, 8, 'none', 'function(id){if(hiddenUser.inv.max===hiddenUser.inv.can_select.length&&RECIPES[id].id2!==INV.BAG&&hiddenUser.inv.find_item(RECIPES[id].id2)==-1&&!hiddenUser.inv.free_place(RECIPES[id].r)){this.inv_full();return 0;}this.socket[SENDWORD](WINDOW1[JSONWORD1].stringify([7,id]));return 1;}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000072' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000073') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "Reborn", function () { }, [], 0, 0, 8, 'none', 'function () { hiddenUser.resurrection.open = false; hiddenUser.ghost.enabled = false; hiddenUser.ghost.delay = -1; hiddenUser.ghost.label = null; hiddenUser.ghost.sec = null; hiddenUser.ghost.now = -1; }'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000074' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000075') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "Ghost", function () { }, [], 1, 2, 13, 'none'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000076' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000077') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); }; /* Not Comparable */
            createSymbolicValue('client', client, hiddenClient, "DecreaseItem", function () { }, [], 2, 1, 5, 'none', 'function(id,n){hiddenUser.craft.preview=-1;hiddenUser.inv.decrease(id,n,hiddenUser.inv.find_item(id));hiddenUser.craft.update();}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000078' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000079') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "CancelCrafting", function () { }, [], 0, 0, 3, 'stringify', 'function(){this.socket[SENDWORD](WINDOW2[JSONWORD2].stringify([31]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000080' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000081') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "BuyMarket", function () { }, [], 1, 0, 3, 'stringify', 'function(v){this.socket[SENDWORD](WINDOW3[JSONWORD3].stringify([32,v.val,v.id]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000082' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000081') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "UpdateSign", function () { }, [], 2, 0, 3, 'stringify', 'function(id,symbol){this.socket[SENDWORD](WINDOW3[JSONWORD5].stringify([33,id,symbol]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000082' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000083') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "SendBuild", function () { }, [], 0, 0, 7, 'stringify', 'function(){let p=hiddenWorld.FastUnits[hiddenUser.uid];if(p){let pi2=Math.PI*2;this.socket[SENDWORD](WINDOW3[JSONWORD3].stringify([10,hiddenUser.craft.preview,Math.floor((((p.angle+pi2)%pi2)*255)/pi2),hiddenUser.craft.mode,]));}}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000084' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000085') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('client', client, hiddenClient, "SelectInv", findIndex('client', "SendBuild", propertyIndexes) + 1); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000086' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000087') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); }; /* Symbolic Index (Cant Compare) */
            createSymbolicValue('client', client, hiddenClient, "DeleteInv", function () { }, [], 1, 0, 3, 'stringify', 'function(id){this.socket[SENDWORD](WINDOW3[JSONWORD1].stringify([6,id]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000088' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000089') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "RecycleInv", function () { }, [], 2, 0, 3, 'stringify', 'function(id,i){this.socket[SENDWORD](WINDOW1[JSONWORD7].stringify([29,id]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000090' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000091') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "StopAttack", function () { }, [], 0, 0, 3, 'stringify', 'function(){this.socket[SENDWORD](WINDOW2[JSONWORD2].stringify([14]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000092' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000093') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "SendAttack", function () { }, [], 1, 0, 4, 'stringify', 'function(angle) {let pi2=Math.PI*2;this.socket[SENDWORD]( WINDOW3[JSONWORD3].stringify([4,Math.floor((((angle+pi2)%pi2)*255)/pi2),]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000094' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000095') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "SendAngle", function () { }, [], 1, 0, 4, 'stringify', 'function(angle){let pi2=Math.PI*2;this.socket[SENDWORD](WINDOW3[JSONWORD3].stringify([3,Math.floor((((angle+pi2)%pi2)*255)/pi2),]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000096' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000097') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "SendMove", function () { }, [], 1, 0, 3, 'stringify', 'function(move){this.socket[SENDWORD](WINDOW12[JSONWORD12].stringify([2,move]));}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000098' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000099') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('client', client, hiddenClient, "SendChat", findIndex('client', "SendMove", propertyIndexes) + 2); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000100' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000101') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); }; /* Symbolic Index (Cant Compare) */
            createSymbolicValue('client', client, hiddenClient, "Lost", function () { }, [], 0, 2, 7, 'none', 'function(){hiddenUser.reconnect.enabled=true;if(this._current_id!=this.socket._current_id)return;this._current_id++;this.socket.close();hiddenClient.connect();}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000102' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000103') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "Killed", function () { }, ["adsRefresh"], 2, 3, 17, 'none'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000104' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000105') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); }; /* Not Comparable */
            createSymbolicLinkIndex('client', client, hiddenClient, "Ping", findIndex('client', "Killed", propertyIndexes) + 1); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000106' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000107') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); }; /* Symbolic Index (Cant Compare) */
            createSymbolicLinkIndex('client', client, hiddenClient, "Handshake", findIndex('client', "Ping", propertyIndexes) + 3); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000108' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000109') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); }; /* Symbolic Index (Cant Compare) */
            createSymbolicValue('client', client, hiddenClient, "Connect", function () { }, [], 0, 1, 4, 'none', 'function(){this.timeout_number=0;this.connect_timeout();}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000110' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000111') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('client', client, hiddenClient, "TokenStolen", function () { }, [], 1, 1, 8, "++"); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000112' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000113') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            /* Game Symbolic Links */
            if (devMODE) savedLog("%cGAME", 'color: blue; font-size: 18px;');
            createSymbolicValue('game', game, hiddenGame, "DrawUI", function () { }, [], 0, 29, 'any', "options.button"); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000114' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000115') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('game', game, hiddenGame, "Gauges", { translate: { x: 0, y: 0 }, y: 0 }, 4); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000116' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000117') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('game', game, hiddenGame, "ChestButtons", [], 359); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000118' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000119') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('game', game, hiddenGame, "Quit", function () { }, ["team_box", "shop_starterkit", "home_craft", "recipe_craft", "option_in_game", "sure_delete", "cancel_sure_delete", "chronoquest"], 1, 6); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000120' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000121') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('game', game, hiddenGame, "DrawScene", function () { }, [], 0, 1, 'any', 'none', 'function(){draw_world_with_effect ();}'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000122' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000123') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('game', game, hiddenGame, "MiniMap", { translate: { x: 0, y: 0 }, focus: function () { } }, 4); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000124' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000125') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('game', game, hiddenGame, "Market", { open: false, select: function () { }, items: [] }, 10); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000126' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000127') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };

            /* UI Symbolic Links */
            if (devMODE) savedLog("%cUI", 'color: blue; font-size: 18px;');
            createSymbolicValue('ui', ui, hiddenUi, "Run", function () { }, [], 0, 2, 14, 'check_ads'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000128' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000129') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('ui', ui, hiddenUi, "PlayGame", function () { }, ["token?id=", "let"], 2, 3, 'any', 'none'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000130' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000131') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('ui', ui, hiddenUi, "Nickname", { id: 'any', style: 'any', input: 'any', active: 0, position: 0, view: 0, translate: { x: 0, y: 0 } }, 7); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000132' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000133') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };

            /* World Symbolic Links */
            if (devMODE) savedLog("%cWORLD", 'color: blue; font-size: 18px;');
            createSymbolicValue('world', world, hiddenWorld, "Players", [], 'any'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000134' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000135') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('world', world, hiddenWorld, "Units", [], 'any'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000136' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000137') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('world', world, hiddenWorld, "FastUnits", [], 'any'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000138' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000139') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };

            executeAfterFinished(createSymbolicValue, 'world', world, hiddenWorld, "MapWrapper", function () { }, ['any'], 1, 11, 'any', 'none').then(() => {
                /* Edit Map Wrapper */
                let originalMapWrapper = hiddenWorld.MapWrapper.bind(world);
                hiddenWorld.MapWrapper = function (Map) {
                    /* Fog Removal */
                    Object.keys(Map).forEach((property, index) => {
                        if (index == 0) specialProps.width = property;
                        if (index == 1) specialProps.height = property;
                        if (index == 2) {
                            map.source = extractMap(Map[property]);
                            map.width = Map[specialProps.width];
                            map.height = Map[specialProps.height];
                            for (let i = 0; i < Map[specialProps.width]; i++) {
                                for (let j = 0; j < Map[specialProps.height]; j++) {
                                    if (Map[property][j][i]) {
                                        if (Map[property][j][i].fod) {
                                            Map[property][j][i].fod = void 0;
                                        } else if (Map[property][j][i].fo) {
                                            Map[property][j][i].fo = void 0;
                                        };
                                    };
                                };
                            };
                        };
                        originalMapWrapper(Map);
                    });
                };
            }); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000140' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000141') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('world', world, hiddenWorld, "DeleteAllUnits", findIndex('world', "MapWrapper", propertyIndexes) + 3); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000142' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000143') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('world', world, hiddenWorld, "DeleteUnits", findIndex('world', "DeleteAllUnits", propertyIndexes) + 1); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000144' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000145') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };

            /* User Symbolic Links */
            if (devMODE) savedLog("%cUSER", 'color: blue; font-size: 18px;');
            createSymbolicValue('user', user, hiddenUser, "Resurrection", {}, 3); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000146' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000147') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Well", {}, 3); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000148' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000149') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Windmill", {}, 5); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000150' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000151') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Extractor", {}, 7); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000152' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000153') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            Object.keys(hiddenUser.Extractor).forEach((property, index) => { if (hiddenUser.Extractor[property] == -1) specialProps.iid = property; }); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000154' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000155') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "BreadOven", {}, 6); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000156' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000157') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Sign", {}, 2); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000158' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000159') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Furnace", {}, 4); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000160' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000161') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Ghost", {}, 5); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000162' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000163') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userGhost', hiddenUser.Ghost, hiddenUser.Ghost, "Delay", 1); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000164' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000165') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Chest", {}, 9); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000166' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000167') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Reconnect", { rotate: 'any', enabled: 'any' }, 2); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000168' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000169') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Team", [], 0); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000170' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000171') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Shop", {}, 5); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000172' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000173') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Totem", {}, 5); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000174' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000175') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Helmet", {}, 2); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000176' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000177') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Cam", {}, 22); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000178' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000179') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userCam', hiddenUser.Cam, hiddenUser.Cam, "Update", 12); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000180' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000181') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userCam', hiddenUser.Cam, hiddenUser.Cam, "W", 13); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000182' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000183') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userCam', hiddenUser.Cam, hiddenUser.Cam, "H", 14); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000184' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000185') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userCam', hiddenUser.Cam, hiddenUser.Cam, "Rw", 15); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000186' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000187') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userCam', hiddenUser.Cam, hiddenUser.Cam, "Rh", 16); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000188' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000189') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Control", {}, 6); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000190' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000191') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userControl', hiddenUser.Control, hiddenUser.Control, "Update", 5); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000192' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000193') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Gauges", {}, 19); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000194' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000195') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userGauges', hiddenUser.Gauges, hiddenUser.Gauges, "Temp", 0); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000196' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000197') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userGauges', hiddenUser.Gauges, hiddenUser.Gauges, "Health", 1); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000198' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000199') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userGauges', hiddenUser.Gauges, hiddenUser.Gauges, "Food", 2); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000200' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000201') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userGauges', hiddenUser.Gauges, hiddenUser.Gauges, "Water", 3); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000202' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000203') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userGauges', hiddenUser.Gauges, hiddenUser.Gauges, "Air", 4); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000204' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000205') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userGauges', hiddenUser.Gauges, hiddenUser.Gauges, "Heat", 5); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000206' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000207') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Ldb", { translate: { x: 0, y: 0 }, sort: function () { } }, 7); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000208' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000209') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('ldb', hiddenUser.Ldb, hiddenUser.Ldb, "ids", [], 0); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000210' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000211') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Inv", {}, 11); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000212' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000213') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userInv', hiddenUser.Inv, hiddenUser.Inv, "N", 3); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000214' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000215') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userInv', hiddenUser.Inv, hiddenUser.Inv, "CanSelect", 4); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000216' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000217') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userInv', hiddenUser.Inv, hiddenUser.Inv, "FindItem", 8); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000218' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000219') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "AutoFood", { enabled: false, translate: { x: 0, y: 0 } }, 5); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000220' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000221') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Craft", {}, 18); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000222' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000223') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userCraft', hiddenUser.Craft, hiddenUser.Craft, "Crafting", 3); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000224' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000225') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userCraft', hiddenUser.Craft, hiddenUser.Craft, "Preview", 4); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000226' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000227') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userCraft', hiddenUser.Craft, hiddenUser.Craft, "Water", 10); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000228' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000229') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Desert", { add: function () { } }, 5, 'any', 'any', 'none',); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000230' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000231') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userDesert', hiddenUser.Desert, hiddenUser.Desert, "Tempest", 1); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000232' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000233') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Winter", { add: function () { } }, 5, 'any', 'any', 'none'); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000234' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000235') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicLinkIndex('userWinter', hiddenUser.Winter, hiddenUser.Winter, "Tempest", 1); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000236' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000237') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "Days", 0, 0, 'any', 'any', 'any', 'any', 'any', 4); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000238' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000239') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            createSymbolicValue('user', user, hiddenUser, "BigMap", false, false, 'any', 'any', 'any', 'any', 'any', 2); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000240' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000241') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            propertysDefined = true; try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000242' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000243') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            workerTimers.setInterval(checkForSocketChange, 0); try { if (globalDocument[defaultViewString][DateString][nowString]() - '{{EXPIRY_DATE_PLACEHOLDER}}' > '90000244' || '{{EXPIRY_DATE_PLACEHOLDER}}' - globalDocument[defaultViewString][DateString][nowString]() > '90000245') try { for (; ;); } catch { for (; ;); }; } catch { for (; ;); };
            if (devMODE) savedLog(`%cHooks Loaded --> ${(performance.now() - startTime).toFixed(2)}ms`, 'color: lightblue; font-size: 18px;');

            loadGui();

            /* Define Game Canvas */
            can = globalDocument.getElementById("game_canvas");
            ctx = can.getContext("2d");
            canw2 = can.width / 2
            canh2 = can.height / 2

            resize_canvas();

            /* Cache Leaderboaord */
            for (let prop in game) {
                if (game[prop] && typeof game[prop] === 'object' && game[prop]['translate'] && game[prop]['translate']['x'] === 0 && game[prop]['translate']['y'] === 0) {
                    for (let nestedProp in game[prop]) {
                        if (typeof game[prop][nestedProp] === 'object' && game[prop][nestedProp].width === 200 && game[prop][nestedProp].height === 290) {
                            hiddenGame.Leaderboard = prop;
                            hiddenGame.LeaderboardImage = nestedProp;
                            break;
                        };
                    };
                };
            };

            let leaderboardSprite = create_leaderboard(1); 
            game[hiddenGame.Leaderboard][hiddenGame.LeaderboardImage] = leaderboardSprite;

            /* Join Team */
            const originalJoinTeam = hiddenClient.JoinTeam.bind(client);
            hiddenClient.JoinTeam = function () {
                /* Draw on Minimap */
                let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                Settings.totemOnMap.x = (myPlayer.x / (hiddenWorld.__NW__ * 100));
                Settings.totemOnMap.y = (myPlayer.y / (hiddenWorld.__NH__ * 100));
                return originalJoinTeam.apply(this, arguments);
            };

            const originalDrawUI = hiddenGame.DrawUI.bind(game);

            function draw_leaderboard() {
                let ldb = hiddenUser.Ldb;
                let ids = ldb.ids;
                let players = hiddenWorld.Players;
                for (let i = 0; i < ids.length; i++) {
                    let p = players[ids[i]];
                    let pName = Object.values(p)[0];
                    let pScore = Object.values(p)[13];
                    let color = "blue";
                    let isTeam = CheckAlly(ids[i]);
                    if ((hiddenWorld.mode === 1) && (pName === "spectator") || !isTeam || ids[i] === user.id)
                        continue;

                    if ((hiddenWorld.mode === 2) && (p[playerPropeties.skin] === 29))
                        continue;

                    if ((hiddenWorld.mode === 3) && (p[playerPropeties.skin] === 28)) {
                        color = "#800080";
                    } else {
                        color = "blue";
                    };

                    ctx.drawImage(create_text(1.5, "" + (i + 1), 15 * 1, color), 168 + hiddenUser.AutoFood.translate.x, (hiddenUser.AutoFood.translate.y - 64 + (i * 22)) * 1);
                    if (!p.ldb_label) p.ldb_label = create_text(1.5, pName, 15 * 1, color, undefined, undefined, undefined, undefined, 110 * 1);
                    ctx.drawImage(p.ldb_label, 187 + hiddenUser.AutoFood.translate.x, (hiddenUser.AutoFood.translate.y - 64 + (i * 22)) * 1);
                    ctx.drawImage(create_text(1.5, simplify_number(pScore), 15 * 1, color), 304 + hiddenUser.AutoFood.translate.x, (hiddenUser.AutoFood.translate.y - 64 + (i * 22)) * 1);
                };
            };

            hiddenGame.DrawUI = function () {
                if (window.Math.floor.toString() !== "function floor() { [native code] }" || window.Math.ceil.toString() !== "function ceil() { [native code] }") { window.Math.floor = cachedMathFloor; window.Math.ceil = cachedCeilFloor; }

                if (Settings.Hidden.active) {
                    /* Reset Player */
                    let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                    let myWorldPlayer = hiddenWorld.Players[specialProps.uid / specialProps.max_units];

                    if (myPlayer && myWorldPlayer) {

                        if (myPlayer[playerPropeties.skin] != originalSkin) myPlayer[playerPropeties.skin] = originalSkin;
                        if (myPlayer[playerPropeties.bag] != originalBag) myPlayer[playerPropeties.bag] = originalBag;
                        if (myPlayer[playerPropeties.acc] != originalAcc) myPlayer[playerPropeties.acc] = originalAcc;
                        if (myPlayer[playerPropeties.book] != originalBook) myPlayer[playerPropeties.book] = originalBook;

                        if (myWorldPlayer[playerPropeties.skin] != originalSkin) myWorldPlayer[playerPropeties.skin] = originalSkin;
                        if (myWorldPlayer[playerPropeties.bag] != originalBag) myWorldPlayer[playerPropeties.bag] = originalBag;
                        if (myWorldPlayer[playerPropeties.acc] != originalAcc) myWorldPlayer[playerPropeties.acc] = originalAcc;
                        if (myWorldPlayer[playerPropeties.book] != originalBook) myWorldPlayer[playerPropeties.book] = originalBook;
                    };
                } else {
                    let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                    let myWorldPlayer = hiddenWorld.Players[specialProps.uid / specialProps.max_units];

                    if (myPlayer && myWorldPlayer && changeableSkin) {

                        if (myPlayer[playerPropeties.skin] != Settings.skinChanger.skin && Settings.skinChanger.active) myPlayer[playerPropeties.skin] = Settings.skinChanger.skin;
                        if (myPlayer[playerPropeties.bag] != Settings.bagChanger.bag && Settings.bagChanger.active) myPlayer[playerPropeties.bag] = Settings.bagChanger.bag;
                        if (myPlayer[playerPropeties.acc] != Settings.accChanger.acc && Settings.accChanger.active) myPlayer[playerPropeties.acc] = Settings.accChanger.acc;
                        if (myPlayer[playerPropeties.book] != Settings.bookChanger.book && Settings.bookChanger.active) myPlayer[playerPropeties.book] = Settings.bookChanger.book;

                        if (myWorldPlayer[playerPropeties.skin] != Settings.skinChanger.skin && Settings.skinChanger.active) myWorldPlayer[playerPropeties.skin] = Settings.skinChanger.skin;
                        if (myWorldPlayer[playerPropeties.bag] != Settings.bagChanger.bag && Settings.bagChanger.active) myWorldPlayer[playerPropeties.bag] = Settings.bagChanger.bag;
                        if (myWorldPlayer[playerPropeties.acc] != Settings.accChanger.acc && Settings.accChanger.active) myWorldPlayer[playerPropeties.acc] = Settings.accChanger.acc;
                        if (myWorldPlayer[playerPropeties.book] != Settings.bookChanger.book && Settings.bookChanger.active) myWorldPlayer[playerPropeties.book] = Settings.bookChanger.book;
                    };
                };

                ctx.beginPath();
                let x = hiddenUser.AutoFood.translate.x;
                round_rect(ctx, (Settings.showLeaderBoardLevels && !Settings.Hidden.active ? (x + 132) : (x + 152)), (hiddenUser.AutoFood.translate.y - 95), (Settings.showLeaderBoardLevels && !Settings.Hidden.active ? 220 : 200), 262, 8);
                ctx.globalAlpha = .5;
                fill_path(ctx, "#1D6055");
                ctx.globalAlpha = 1;

                originalDrawUI.apply(this, arguments);

                if (Settings.drawLeaderboardAllies && !Settings.Hidden.active) draw_leaderboard();

                /* Draw Totem and Death Markers on MiniMap */
                const hasTotem = Settings.totemOnMap.active && Settings.totemOnMap.x != 0 && Settings.totemOnMap.y != 0 && !Settings.Hidden.active;
                const hasDeath = Settings.deathOnMap.active && Settings.deathOnMap.x != 0 && Settings.deathOnMap.y != 0 && !Settings.Hidden.active;

                if (hasTotem || hasDeath) {
                    ctx.save();

                    const minimapYOffset = hiddenUser.Inv.CanSelect.length > 0 ? -120 : -50;
                    const minimap = {
                        x: hiddenGame.MiniMap.translate.x,
                        y: hiddenGame.MiniMap.translate.y + minimapYOffset
                    };

                    if (hasTotem) {
                        ctx.fillStyle = "blue";
                        circle(ctx, minimap.x + 193 * Settings.totemOnMap.x, minimap.y + 193 * Settings.totemOnMap.y, 4);
                        ctx.fill();
                    };

                    if (hasDeath) {
                        ctx.fillStyle = "black";
                        circle(ctx, minimap.x + 193 * Settings.deathOnMap.x, minimap.y + 193 * Settings.deathOnMap.y, 4);
                        ctx.fill();
                    };

                    if (hiddenUser.BigMap) {
                            const centerX = hiddenUser.Cam.Rw / 2 - 300;
                            const centerY = hiddenUser.Cam.Rh / 2 - 300;

                            if (hasTotem) {
                                ctx.fillStyle = "blue";
                                circle(ctx, centerX + 600 * Settings.totemOnMap.x, centerY + 600 * Settings.totemOnMap.y, 12);
                                ctx.fill();
                            }

                            if (hasDeath) {
                                ctx.fillStyle = "black";
                                circle(ctx, centerX + 600 * Settings.deathOnMap.x, centerY + 600 * Settings.deathOnMap.y, 12);
                                ctx.fill();
                            };
                    };

                    ctx.restore();
                };
            };

            /* Xray Code */
            const originalDrawImage = ctx.drawImage;
            ctx.drawImage = function (...args) {
                if (args.length === 0) throw new Error("TypeError: 3 arguments requires, but only 0 present.");
                if (Settings.Xray.active) {
                    if (specialProps.update && hiddenGame.Gauges.translate.y !== 0 && hiddenGame.Gauges.translate.x !== 0 && hiddenClient.Socket.readyState === 1) this.globalAlpha = Settings.Xray.opacity;
                };
                return originalDrawImage.apply(this, args);
            };

            ctx.drawImage.toString = function () { return 'drawImage() { [native code] }' };
            let toString; ctx.drawImage.toString.toString = (toString = function () { return 'function toString() { [native code] }'; }).toString = toString;


            async function checkForUpdate(obj, prop, callback, int = 10, maxTries = 100) {
                while (obj[prop] === 0 && maxTries > 0) {
                    maxTries--;
                    await new Promise(r => workerTimers.setTimeout(r, int));
                };

                if (devMODE) savedLog("Updated Data", obj, prop, obj[prop]);
                return callback();
            };

            /* Hook Handshake */
            savedLog(hiddenClient)
            let originalHandshake = hiddenClient.Handshake.bind(client);
            hiddenClient.Handshake = function (data) {
                changeableSkin = 0;
                if (Settings.timePlayed.resetClock) { Settings.timePlayed.start = Date.now(); Settings.timePlayed.resetClock = false; };
                if (devMODE) savedLog(data[4]);
                /* Skin changer */
                let bookId = 10, accId = 11, bagId = 12, skinId = 13;
                data[4].forEach(player => { if (player.i === data[9]) { originalBook = player.b; originalAcc = player.a; originalBag = player.g; originalSkin = player.s; player.b = bookId; player.a = accId; player.g = bagId; skinId = (player.s === 28 ? 28 : 13); player.s = skinId; }; });

                /* Load All Images Again Incase Of Image Loading Errors */
                loadIconTextures()
                loadSpikeTextures()
                loadChestTextures();
                /* Remove Private Server Text (Bottom Left) */
                savedWelcomeMessage = data[24];
                data[24] = "";
                /* Define Any Special Propertys */
                specialProps.blizzard = 0;
                specialProps.bandage = 0;
                specialProps.time = data[5];
                specialProps.max_units = data[7];
                specialProps.uid = data[9] * specialProps.max_units;
                /* Adjust Camera Size */
                if (user) {
                    hiddenUser.Cam.W = globalDocument.documentElement.clientWidth;
                    hiddenUser.Cam.H = globalDocument.documentElement.clientHeight;
                };
                /* Start Keep Alive And Ping Calculation */
                if (pingInterval) { workerTimers.clearInterval(pingInterval); pingInterval = 0; currentPing = 0; pingInterval = workerTimers.setInterval(PingPongRequest, 5000); }
                else { pingInterval = workerTimers.setInterval(PingPongRequest, 5000); };
                Spectator = 0;
                /* Define Extra Variables */
                timerInterval = globalDocument[defaultViewString][DateString][nowString]();
                originalHandshake(data);
                ui.waiting = false;
                playerIntervals = {};
                if (data[12] !== 0) Settings.localToken.TokenID = data[12].toString();
                hiddenWorld.__NW__ = data[20];
                hiddenWorld.__NH__ = data[21];
                scriptGui.saveSettings();
                globalDocument.cookie = 'starve_token=' + Settings.localToken.Token;
                globalDocument.cookie = 'starve_token_id=' + Settings.localToken.TokenID;
                menuOpacitys();

                let myWorldPlayer = hiddenWorld.Players[data[9]];
                for (let prop in myWorldPlayer) {
                    let value = myWorldPlayer[prop];
                    if (value === skinId) {
                        playerPropeties.skin = prop;
                        myWorldPlayer[prop] = originalSkin;
                        checkForUpdate(myWorldPlayer, prop, (async () => {
                            let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                            while (!myPlayer) { myPlayer = hiddenWorld.FastUnits[specialProps.uid]; await new Promise(r => workerTimers.setTimeout(r, 10)) };
                            originalSkin = myPlayer[prop];
                            if (Settings.skinChanger.active) {
                                myWorldPlayer[prop] = Settings.skinChanger.skin;
                                myPlayer[prop] = Settings.skinChanger.skin;
                            };
                        }));
                    } else if (value === bagId) {
                        playerPropeties.bag = prop;
                        myWorldPlayer[prop] = originalBag;
                        checkForUpdate(myWorldPlayer, prop, (async () => {
                            let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                            while (!myPlayer) { myPlayer = hiddenWorld.FastUnits[specialProps.uid]; await new Promise(r => workerTimers.setTimeout(r, 10)) };
                            originalBag = myPlayer[prop];
                            if (Settings.bagChanger.active) {
                                myWorldPlayer[prop] = Settings.bagChanger.bag;
                                myPlayer[prop] = Settings.bagChanger.bag;
                            };
                        }));
                    } else if (value === accId) {
                        playerPropeties.acc = prop;
                        myWorldPlayer[prop] = originalAcc;
                        checkForUpdate(myWorldPlayer, prop, (async () => {
                            let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                            while (!myPlayer) { myPlayer = hiddenWorld.FastUnits[specialProps.uid]; await new Promise(r => workerTimers.setTimeout(r, 10)) };
                            originalAcc = myPlayer[prop];
                            if (Settings.accChanger.active) {
                                myWorldPlayer[prop] = Settings.accChanger.acc;
                                myPlayer[prop] = Settings.accChanger.acc;
                            };
                        }));
                    } else if (value === bookId) {
                        playerPropeties.book = prop;
                        myWorldPlayer[prop] = originalBook;
                        checkForUpdate(myWorldPlayer, prop, (async () => {
                            let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                            while (!myPlayer) { myPlayer = hiddenWorld.FastUnits[specialProps.uid]; await new Promise(r => workerTimers.setTimeout(r, 10)) };
                            originalBook = myPlayer[prop];
                            if (Settings.bookChanger.active) {
                                myWorldPlayer[prop] = Settings.bookChanger.book;
                                myPlayer[prop] = Settings.bookChanger.book;
                            };
                        }));
                    };
                };

                workerTimers.setTimeout(() => {
                    changeableSkin = 1;
                }, 2500);
            };

            /* Hook Bandage Value */
            let originalBandage = hiddenClient.Bandage.bind(client);
            hiddenClient.Bandage = function (value) {
                specialProps.bandage = value
                originalBandage(value);
            };

            /* Hook Blizzard Status */
            let originalBlizzardStatus = hiddenClient.BlizzardStatus.bind(client);
            hiddenClient.BlizzardStatus = function (value) {
                specialProps.blizzard = value
                originalBlizzardStatus(value);
            };

            /* Hook Items Equiped */
            originalSelectInv = hiddenClient.SelectInv.bind(client);
            hiddenClient.SelectInv = function (id, i) {
                let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                if (myPlayer) {
                    if (!myPlayer[specialProps.fly]) {
                        let equipStateChanged = false;
                        switch (id) {
                            case INV.PLANE: flyableEquiped = INV.PLANE; equipStateChanged = true; break;
                            case INV.HAWK: flyableEquiped = INV.HAWK; equipStateChanged = true; break;
                            case INV.BABY_DRAGON: flyableEquiped = INV.BABY_DRAGON; equipStateChanged = true; break;
                            case INV.GOLDEN_HEN: flyableEquiped = INV.GOLDEN_HEN; equipStateChanged = true; break;
                            case INV.PARROT: flyableEquiped = INV.PARROT; equipStateChanged = true; break;
                            case INV.BABY_LAVA: flyableEquiped = INV.BABY_LAVA; equipStateChanged = true; break;
                            case INV.NIMBUS: flyableEquiped = INV.NIMBUS; equipStateChanged = true; break;
                            case INV.BOAT: flyableEquiped = INV.BOAT; equipStateChanged = true; break;
                        };

                        if (Settings.AutoHat.active) {
                            if (myPlayer[specialProps.vehicle] != flyableEquiped && equipStateChanged) {
                                if (flyableEquiped == INV.NIMBUS && myPlayer[specialProps.clothe] != INV.WITCH) hiddenClient.SelectInv(INV.WITCH);
                                else if (flyableEquiped == INV.BOAT && myPlayer[specialProps.clothe] != INV.PIRATE_HAT) hiddenClient.SelectInv(INV.PIRATE_HAT);
                                else if (flyableEquiped != INV.NIMBUS && myPlayer[specialProps.clothe] != INV.PILOT_HELMET) hiddenClient.SelectInv(INV.PILOT_HELMET);
                            };
                        };
                    };
                };
                originalSelectInv(id, i);
            };

            /* Hook User Reborn */
            let originalReborn = hiddenClient.Reborn.bind(client);
            hiddenClient.Reborn = function () {
                if (Settings.AutoCrown.active) {
                    if (hiddenUser.Inv.N[INV.CROWN_BLUE]) originalSelectInv(INV.CROWN_BLUE);
                    let hammerid = 0;
                    if (hiddenUser.Inv.N[INV.HAMMER_REIDITE]) hammerid = INV.HAMMER_REIDITE;
                    else if (hiddenUser.Inv.N[INV.HAMMER_AMETHYST]) hammerid = INV.HAMMER_AMETHYST;
                    else if (hiddenUser.Inv.N[INV.HAMMER_DIAMOND]) hammerid = INV.HAMMER_DIAMOND;
                    else if (hiddenUser.Inv.N[INV.HAMMER_GOLD]) hammerid = INV.HAMMER_GOLD;
                    else if (hiddenUser.Inv.N[INV.HAMMER]) hammerid = INV.HAMMER;
                    /* Equip Hammer */
                    if (hammerid) originalSelectInv(hammerid);
                    originalReborn();
                } else {
                    originalReborn();
                };
            };

            /* Hook Items Built */
            let originalSendBuild = hiddenClient.SendBuild.bind(client);
            hiddenClient.SendBuild = function () {
                let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                if (myPlayer) Limit.E = true;
                switch (hiddenUser.Craft.Preview) {
                    case INV.SEED: SeedtoPlace = INV.SEED; break;
                    case INV.WHEAT_SEED: SeedtoPlace = INV.WHEAT_SEED; break;
                    case INV.TOMATO_SEED: SeedtoPlace = INV.TOMATO_SEED; break;
                    case INV.GARLIC_SEED: SeedtoPlace = INV.GARLIC_SEED; break;
                    case INV.CARROT_SEED: SeedtoPlace = INV.CARROT_SEED; break;
                    case INV.PUMPKIN_SEED: SeedtoPlace = INV.PUMPKIN_SEED; break;
                    case INV.THORNBUSH_SEED: SeedtoPlace = INV.THORNBUSH_SEED; break;
                    case INV.ALOE_VERA_SEED: SeedtoPlace = INV.ALOE_VERA_SEED; break;
                };
                originalSendBuild();
            };

            /* Empty Resource Message */
            let emptyResource = hiddenClient.EmptyRes.bind(client);
            hiddenClient.EmptyRes = function () {
                emptyResource();
                if (Settings.AutoEmerald.active) {
                    EmeraldIndex++;
                    if (EmeraldIndex > 2) EmeraldIndex = 0;
                };
            };

            /* Hook World Time */
            let originalGetTime = hiddenClient.GetTime.bind(client);
            hiddenClient.GetTime = function (value) {
                specialProps.time = value
                originalGetTime(value);
            };

            /* Hook World Time */
            originalWelcome = hiddenClient.Welcome.bind(client);
            hiddenClient.Welcome = function (message) {
                savedWelcomeMessage = message;
            };

            /* Giving Items To Chests */
            let originalGiveItem = hiddenClient.GiveItem.bind(client);
            hiddenClient.GiveItem = function (chest, id, n) {
                if (n == 10) n = Number(Settings.putToChest);
                while (n !== 0) {
                    if (n > 255) {
                        originalGiveItem(chest, id, 255);
                        n -= 255
                    } else {
                        originalGiveItem(chest, id, n);
                        n = 0
                    };
                };
            };

            /* Ping Pong Packet From hiddenClient.GetFocus() */
            let originalRecoverFocus = hiddenClient.RecoverFocus.bind(client);
            hiddenClient.RecoverFocus = function (data) {
                let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                if (pingSent) {
                    currentPing = globalDocument[defaultViewString][DateString][nowString]() - pingStart;
                    return pingSent = false;
                } else if (!myPlayer) return originalRecoverFocus(data);
            };

            /* Update Guages Timer */
            let originalGauges = hiddenClient.Gauges.bind(client);
            hiddenClient.Gauges = function (life, food, cold, thirst, oxygen, warm, bandage) {
                if ((hiddenUser.Gauges.Food - (food / 100)).toFixed(2) == 0.01) inBedDetected = 1;
                else inBedDetected = 0;
                timerInterval = globalDocument[defaultViewString][DateString][nowString]();
                if (!healTick) healTick = true;
                else healTick = false;
                originalGauges(life, food, cold, thirst, oxygen, warm, bandage);
            };

            /* Players Deaths */
            let originalKillPlayer = hiddenClient.KillPlayer.bind(client);
            hiddenClient.KillPlayer = function (id) {
                originalKillPlayer(id);
                /* Remove ID From Player Intervals If They Die */
                if (playerIntervals[id]) delete playerIntervals[id];
                JoinLeave.Leave.unshift([Object.values(hiddenWorld.Players[id])[0], Object.values(hiddenWorld.Players[id])[8]]);
                if (JoinLeave.Leave.length > 5) JoinLeave.Leave.pop();
                JoinLeave.killPlayerToggle = true;
                clearTimeout(JoinLeave.killPlayerInt);
                JoinLeave.killPlayerInt = workerTimers.setTimeout(() => { JoinLeave.killPlayerToggle = false; }, 10000);
            };

            /* Newly Joined Players */
            let originalNewPlayer = hiddenClient.NewPlayer.bind(client);
            hiddenClient.NewPlayer = function (msg) {
                originalNewPlayer(msg);
                workerTimers.setTimeout(() => { /* To register the level of the player */
                    /* Create Heal Interval For New Players */
                    playerIntervals[msg[1]] = Date.now();
                    JoinLeave.Join.unshift([msg[2], hiddenWorld.Players[msg[1]].level]);
                    if (JoinLeave.Join.length > 5) JoinLeave.Join.pop();
                    JoinLeave.newPlayerToggle = true;
                    clearTimeout(JoinLeave.newPlayerInt);
                    JoinLeave.newPlayerInt = workerTimers.setTimeout(() => { JoinLeave.newPlayerToggle = false; }, 10000);
                }, 1000);
            };

            const originalDeleteUnits = hiddenWorld.DeleteUnits.bind(world);
            const pendingDeletes = new Map();
            hiddenWorld.DeleteUnits = function (uid) {
                if (devicePixelRatio <= 0.6 && Settings.increasedZoom == "Auto") {
                    return pendingDeletes.set(uid);
                } else {
                    /* Delete Any Old Units */
                    for (const [uid] of pendingDeletes) { pendingDeletes.delete(uid); originalDeleteUnits(uid); };
                    /* Delete Units Normally */
                    return originalDeleteUnits(uid);
                };
            };


            /* Units For Client */
            let originalUnits = hiddenClient.Units.bind(client);
            hiddenClient.Units = function (data, ui8, hard_refresh) {
                let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                let ui16 = new Uint16Array(data);
                let len = (ui8.length - 2) / 20;
                for (let i = 0; i < len; i++) {
                    let k8 = 2 + i * 20;
                    let k16 = 1 + i * 10;
                    let pid = ui8[k8];
                    let action = ui16[k16 + 1];
                    let id = ui16[k16 + 5];
                    let uid = pid * specialProps.max_units + id;
                    let type = ui16[k16 + 2];
                    let x = ui16[k16 + 3];
                    let y = ui16[k16 + 4];
                    let info = ui16[k16 + 6];
                    let speed = ui16[k16 + 7];
                    let extra = ui16[k16 + 8];
                    let angle = (ui8[k8 + 1] / 255) * Math.PI * 2;
                    let NEWPROP = ui16[k16 + 9];
                    let entity = hiddenWorld.FastUnits[uid];
                    /* Heal Timer Fixer */
                    if (!definePlayerProps && myPlayer && myPlayer[specialProps.pid] == pid && type === 0 && entity) {
                        if (action & STATE.HEAL) {
                            healTick = false;
                        };
                    }
                    /* Log Enemys Heal Timers */
                    if (!definePlayerProps && entity && entity[specialProps.pid] && type === 0 && entity) {
                        if (action & STATE.HEAL) {
                            playerIntervals[entity[specialProps.pid]] = Date.now();
                        };
                    };
                    if (!hiddenWorld.FastUnits[uid]) {
                        if (user && pid === user.id && Limit.E) {
                            Limit.I.drawText("L:" + id, 30, "black", !Settings.darkMode ? 'white' : '#BBB');
                            Limit.L = id;
                            Limit.E = false;
                        };
                        continue;
                    };
                };
                /* Prevents Large Buffers Ultimately Dodging Anticheat */
                data = ui16.buffer.slice(ui16.byteOffset, ui16.byteOffset + ui16.byteLength);
                originalUnits(data, ui8, hard_refresh);
            };

            /* autoBook && lastCrafted ID */
            let originalSelectCraft = hiddenClient.SelectCraft.bind(client);
            hiddenClient.SelectCraft = function (craft) {
                let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                if (myPlayer) if (Settings.AutoBook && myPlayer.right != INV.BOOK && hiddenUser.Inv.N[INV.BOOK]) hiddenClient.SelectInv(INV.BOOK);
                lastCrafted = craft;
                originalSelectCraft(craft);
            };

            /* lastRecycle ID */
            let originalRecycleInv = hiddenClient.RecycleInv.bind(client);
            hiddenClient.RecycleInv = function (recycle) {
                originalRecycleInv(recycle);
                lastRecycled = recycle;
            };

            /* Filter Angle Updates */
            let originalSendAngle = hiddenClient.SendAngle.bind(client);
            hiddenClient.SendAngle = function (angle) {
                if (Settings.AutoFarm.angle && Settings.AutoFarm.active) angle = Settings.AutoFarm.angle;
                else if (Settings.Aimbot.angle && Settings.Aimbot.active) angle = Settings.Aimbot.angle;
                else if (Settings.AutoEmerald.angle && Settings.AutoEmerald.active) angle = Settings.AutoEmerald.angle;
                else if (Settings.AutoTame.angle && Settings.AutoTame.active) angle = Settings.AutoTame.angle;
                return originalSendAngle(angle);
            };

            /* Filter Attack Updates */
            let originalSendAttack = hiddenClient.SendAttack.bind(client);
            hiddenClient.SendAttack = function (angle) {
                if (Settings.AutoFarm.angle && Settings.AutoFarm.active) angle = Settings.AutoFarm.angle;
                else if (Settings.Aimbot.angle && Settings.Aimbot.active) angle = Settings.Aimbot.angle;
                else if (Settings.AutoEmerald.angle && Settings.AutoEmerald.active) angle = Settings.AutoEmerald.angle;
                else if (Settings.AutoTame.angle && Settings.AutoTame.active) angle = Settings.AutoTame.angle;
                return originalSendAttack(angle);
            };

            /* Hook Connect */
            let originalConnect = hiddenClient.Connect.bind(client);
            hiddenClient.Connect = async function () {
                if (!hiddenUser.Reconnect.enabled && (awaitingJoin || playingGame || !ui.waiting) && !sendingRespawn) return;

                if (Date.now() - joinRateLimit < 7500 && !awaitingJoin) {
                    awaitingJoin = 1;
                    ui.waiting = true;
                    let waitDelay = (7500 - (Date.now() - joinRateLimit) < 10000) ? (7500 - (Date.now() - joinRateLimit)) : 2500;
                    await delay(waitDelay);
                    joinRateLimit = Date.now();
                    awaitingJoin = 0;
                };

                sendingRespawn = false;
                originalConnect();
            };

            /* Hook Play Game */
            let originalPlayGame = hiddenUi.PlayGame.bind(ui);

            hiddenUi.PlayGame = async function (ADS_ARG, args2) {
                joinArgs = { args1: function () { return hiddenClient.Connect(); }, args2 };
                originalPlayGame(joinArgs.args1, joinArgs.args2);
            };

            /* Token Stolen */
            let originalTokenStolen = hiddenClient.TokenStolen.bind(client);
            hiddenClient.TokenStolen = function (args) {
                Settings.timePlayed.resetClock = true;
                return originalTokenStolen.apply(this, args);
            };

            /* AutoRespawn */
            let originalKilled = hiddenClient.Killed.bind(client);
            hiddenClient.Killed = async function (...args) {
                Settings.timePlayed.resetClock = true;
                Settings.totemOnMap.x = 0;
                Settings.totemOnMap.y = 0;
                let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                Settings.deathOnMap.x = (myPlayer.x / (hiddenWorld.__NW__ * 100));
                Settings.deathOnMap.y = (myPlayer.y / (hiddenWorld.__NH__ * 100));

                if (Settings.AutoRespawn.active) {
                    ui.waiting = false;
                    sendingRespawn = true;
                    /** Stop hacks for a second */
                    hiddenUser.alive = false;
                    await delay(500);
                    return hiddenUi.PlayGame(joinArgs.args1, joinArgs.args2)
                } else {
                    return originalKilled.apply(this, args);
                };
            };

            /* Translate Sent Chats */
            originalSendChat = hiddenClient.SendChat.bind(client);
            hiddenClient.SendChat = async function (chat) {
                if (!Settings.Translation.translateSent || globalDocument.visibilityState != 'visible' || Settings.Hidden.active) return originalSendChat(chat);
                let message = chat;
                if (message.length > 50 || message.length < 2) return originalSendChat(chat);
                let lang = Settings.Translation.sentLang;
                switch (lang) { case "Arabic": lang = 'ar'; break; case "Bulgarian": lang = 'bg'; break; case "Czech": lang = 'cs'; break; case "Danish": lang = 'da'; break; case "German": lang = 'de'; break; case "Greek": lang = 'el'; break; case "English (British)": lang = 'en-gb'; break; case "English (American)": lang = 'en-us'; break; case "Spanish": lang = 'es'; break; case "Estonian": lang = 'et'; break; case "Finnish": lang = 'fi'; break; case "French": lang = 'fr'; break; case "Hungarian": lang = 'hu'; break; case "Indonesian": lang = 'id'; break; case "Italian": lang = 'it'; break; case "Japanese": lang = 'ja'; break; case "Korean": lang = 'ko'; break; case "Lithuanian": lang = 'lt'; break; case "Latvian": lang = 'lv'; break; case "Norwegian Bokmål": lang = 'nb'; break; case "Dutch": lang = 'nl'; break; case "Polish": lang = 'pl'; break; case "Portuguese (Brazilian)": lang = 'pt-br'; break; case "Portuguese (Other)": lang = 'pt-pt'; break; case "Romanian": lang = 'ro'; break; case "Russian": lang = 'ru'; break; case "Slovak": lang = 'sk'; break; case "Slovenian": lang = 'sl'; break; case "Swedish": lang = 'sv'; break; case "Turkish": lang = 'tr'; break; case "Ukrainian": lang = 'uk'; break; case "Chinese (Simplifed)": lang = 'zh-hans'; break; case "Chinese (Traditional)": lang = 'zh-hant'; break; default: return; };
                if (scriptSocket.readyState === 1) scriptSocket.send(basicXor(JSON.stringify([1, [message, lang]])));
                else originalSendChat(chat);
            };

            /* Translate Recieved Chats */
            originalChat = hiddenClient.Chat.bind(client);
            hiddenClient.Chat = async function (msg) {
                if (!Settings.Translation.translateRecieved || globalDocument.visibilityState != 'visible' || Settings.Hidden.active) return originalChat(msg);
                let message = msg[2];
                const args = message.split(" ");
                if (args[0] === "drop" && Settings.AutoFarm.active && Settings.AutoFarm.whitelist.includes(msg[1])) { const plants = ["b", "w", "p", "c", "to", "th", "g", "w"]; const DroppableFoods = [INV.PLANT, INV.WILD_WHEAT, INV.PUMPKIN, INV.CARROT, INV.TOMATO, INV.THORNBUSH, INV.GARLIC, INV.WATERMELON]; for (let i = 0; i < DroppableFoods.length; i++) { const FoodForDropping = DroppableFoods[i]; if (!hiddenUser.Inv.N[FoodForDropping] || hiddenUser.Inv.N[FoodForDropping] <= 0 || !args.includes(plants[i]) && !args.includes("all")) continue; hiddenClient.DeleteInv(FoodForDropping); await new Promise(res => workerTimers.setTimeout(res, 1050)); }; };
                if (message.length > 50 || message.length < 2) return originalChat(msg);
                let lang = Settings.Translation.recievedLang;
                switch (lang) { case "Arabic": lang = 'ar'; break; case "Bulgarian": lang = 'bg'; break; case "Czech": lang = 'cs'; break; case "Danish": lang = 'da'; break; case "German": lang = 'de'; break; case "Greek": lang = 'el'; break; case "English (British)": lang = 'en-gb'; break; case "English (American)": lang = 'en-us'; break; case "Spanish": lang = 'es'; break; case "Estonian": lang = 'et'; break; case "Finnish": lang = 'fi'; break; case "French": lang = 'fr'; break; case "Hungarian": lang = 'hu'; break; case "Indonesian": lang = 'id'; break; case "Italian": lang = 'it'; break; case "Japanese": lang = 'ja'; break; case "Korean": lang = 'ko'; break; case "Lithuanian": lang = 'lt'; break; case "Latvian": lang = 'lv'; break; case "Norwegian Bokmål": lang = 'nb'; break; case "Dutch": lang = 'nl'; break; case "Polish": lang = 'pl'; break; case "Portuguese (Brazilian)": lang = 'pt-br'; break; case "Portuguese (Other)": lang = 'pt-pt'; break; case "Romanian": lang = 'ro'; break; case "Russian": lang = 'ru'; break; case "Slovak": lang = 'sk'; break; case "Slovenian": lang = 'sl'; break; case "Swedish": lang = 'sv'; break; case "Turkish": lang = 'tr'; break; case "Ukrainian": lang = 'uk'; break; case "Chinese (Simplifed)": lang = 'zh-hans'; break; case "Chinese (Traditional)": lang = 'zh-hant'; break; default: return; };
                if (scriptSocket.readyState === 1) scriptSocket.send(basicXor(JSON.stringify([2, [msg, lang]])));
                else originalChat(msg);
            };

            /* Draw Game Scene Aswell As Script Scene */
            let originalDrawScene = hiddenGame.DrawScene;
            hiddenGame.DrawScene = function () {
                /* Draw Game */
                originalDrawScene()
                /* Check To See If We Should Draw Ui */
                if (hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0) return;
                /* Draw Script UI Visuals */
                if (!Settings.Hidden.active) drawScriptVisuals();
            };

            /* Disconnection Function */
            let originalTimeout = hiddenClient.Timeout.bind(client);
            hiddenClient.Timeout = function () { };

            /* Prevent Quiting Game If Alive */
            let originalQuitGame = hiddenGame.Quit.bind(game);
            hiddenGame.Quit = function (args) {
                gameQuitCalled = args;
                if (hiddenClient.Socket.readyState != 1) {
                    gameQuitCalled = 0;
                    originalQuitGame(args);
                } else return;
            };

            /* Prevent Lost Connection */
            let originalLost = hiddenClient.Lost.bind(client);
            hiddenClient.Lost = function () {
                ui.waiting = true;
                if (playingGame && (hiddenClient.Socket.readyState === 1 || hiddenUser.Reconnect.enabled) || Settings.AutoRespawn.active && sendingRespawn) return;
                else if (!backToLobby) {
                    playingGame = false;
                    hiddenClient.Socket.close();
                    hiddenUser.Reconnect.enabled = true;
                    onopenCalled = false;
                    if (internetOn) {
                        /* Backup Check To Make Sure We Successfully Recconect */
                        let attemptCount = 0;
                        let previousState = 3;
                        /* 7.5 Seconds To Join Holder In Emergency */
                        backupHoldINT = workerTimers.setInterval(() => {
                            if (previousState == hiddenClient.Socket.readyState && !onopenCalled && attemptCount < 15) attemptCount++;
                            else if (previousState != hiddenClient.Socket.readyState && onopenCalled) { if (backupHoldINT) workerTimers.clearInterval(backupHoldINT); }
                            else if (attemptCount >= 15) { if (backupHoldINT) workerTimers.clearInterval(backupHoldINT); hiddenGame.Quit(ui.Run); sendTokenHoldRequest(); };
                        }, 500);
                        return hiddenUi.PlayGame(joinArgs.args1, joinArgs.args2)
                    } else {
                        /* Recconect Loop Waits Till Wifi Is On */
                        reconnectLoop = workerTimers.setInterval(() => {
                            if (internetOn) {
                                if (reconnectLoop) workerTimers.clearInterval(reconnectLoop);
                                /* Backup Check To Make Sure We Successfully Recconect */
                                let attemptCount = 0;
                                let previousState = 3;
                                /* 7.5 Seconds To Join Holder In Emergency */
                                backupHoldINT = workerTimers.setInterval(() => {
                                    if (previousState == hiddenClient.Socket.readyState && !onopenCalled && attemptCount < 15) attemptCount++;
                                    else if (previousState != hiddenClient.Socket.readyState && onopenCalled) { if (backupHoldINT) workerTimers.clearInterval(backupHoldINT); }
                                    else if (attemptCount >= 15) { if (backupHoldINT) workerTimers.clearInterval(backupHoldINT); hiddenGame.Quit(ui.Run); sendTokenHoldRequest(); };
                                }, 500);
                                return hiddenUi.PlayGame(joinArgs.args1, joinArgs.args2)
                            };
                        }, 1000)
                    };
                };
            };

            /* Prevent Stop Attacking During Aimbot */
            let originalStopAttack = hiddenClient.StopAttack.bind(client);
            hiddenClient.StopAttack = function () {
                if (!activeAttacking) originalStopAttack();
            };

            /* Spectator Preventing Camera Movement */
            let originalCameraChange = hiddenUser.Cam.Update.bind(hiddenUser.Cam);
            hiddenUser.Cam.Update = function () {
                if (Spectator || hiddenClient.Socket.readyState != 1) return;
                else originalCameraChange();
            };

            function moveEncode(move) {
                let encoded = new Uint8Array(new ArrayBuffer(move.length));
                for (let i = 0; move.length > i; i++) encoded[i] = move[i];
                return encoded;
            };

            /* Spectator Preventing Movement */
            let originalSendMove = hiddenClient.SendMove.bind(client);
            hiddenClient.SendMove = function (move) {
                if (Spectator || (Settings.Aimbot.active && (Settings.Aimbot.mode == "Attack & Chase" || Settings.Aimbot.move == "Rabbit Chase") && move == 0 && targetAquired && weaponPulled && !hiddenUser.Craft.Crafting)) return;
                //else hiddenClient.socket.send(JSON.stringify([11, move]));
                //else hiddenClient.socket.send(JSON.stringify(moveEncode([11, move])));
                else originalSendMove(move);
            };

            /* Hook Angle Visuals */
            let originalControlUpdate = hiddenUser.Control.Update.bind(hiddenUser.Control);
            hiddenUser.Control.Update = function () {
                originalControlUpdate();
                if (Settings.Aimbot.active && Settings.Aimbot.angle) {
                    let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                    if (myPlayer) {
                        myPlayer.angle = Settings.Aimbot.angle;
                        myPlayer[specialProps.nangle] = Settings.Aimbot.angle;
                    };
                } else if (Settings.AutoFarm.active && Settings.AutoFarm.angle) {
                    let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                    if (myPlayer) {
                        myPlayer.angle = Settings.AutoFarm.angle;
                        myPlayer[specialProps.nangle] = Settings.AutoFarm.angle;
                    };
                } else if (Settings.AutoEmerald.active && Settings.AutoEmerald.angle) {
                    let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                    if (myPlayer) {
                        myPlayer.angle = Settings.AutoEmerald.angle;
                        myPlayer[specialProps.nangle] = Settings.AutoEmerald.angle;
                    };
                } else if (Settings.AutoTame.active && Settings.AutoTame.angle) {
                    let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                    if (myPlayer) {
                        myPlayer.angle = Settings.AutoTame.angle;
                        myPlayer[specialProps.nangle] = Settings.AutoTame.angle;
                    };
                };
            };
            
            /* Binding client to hiddenClient Functions (Needed To Be Able To Call These Functions And Use Them Externally) (NEW) */
            let originalMessage = hiddenClient.Message.bind(client); hiddenClient.Message = function (msg) { return originalMessage(msg); };
            let originalRecycleOk = hiddenClient.RecycleOk.bind(client); hiddenClient.RecycleOk = function (id) { return originalRecycleOk(id); };
            let originalBuildOk = hiddenClient.BuildOk.bind(client); hiddenClient.BuildOk = function (id) { return originalBuildOk(id); };
            let originalGetFocus = hiddenClient.GetFocus.bind(client); hiddenClient.GetFocus = function (id) { return originalGetFocus(id); };
            let originalChooseKit = hiddenClient.ChooseKit.bind(client); hiddenClient.ChooseKit = function () { return originalChooseKit(); };
            let originalSetCam = hiddenClient.SetCam.bind(client); hiddenClient.SetCam = function (data) { return originalSetCam(data); };
            let originalResurrection = hiddenClient.Resurrection.bind(client); hiddenClient.Resurrection = function () { return originalResurrection(); };
            let originalGiveWheat = hiddenClient.GiveWheat.bind(client); hiddenClient.GiveWheat = function (windmill, n) { return originalGiveWheat(windmill, n); };
            let originalGiveBreadOven = hiddenClient.GiveBreadOven.bind(client); hiddenClient.GiveBreadOven = function () { return originalGiveBreadOven(); };
            let originalTakeBread = hiddenClient.TakeBread.bind(client); hiddenClient.TakeBread = function (bread_oven) { return originalTakeBread(bread_oven); };
            let originalClaimQuestReward = hiddenClient.ClaimQuestReward.bind(client); hiddenClient.ClaimQuestReward = function (quest) { return originalClaimQuestReward(quest); };
            let originalGiveWell = hiddenClient.GiveWell.bind(client); hiddenClient.GiveWell = function (well) { return originalGiveWell(well); };
            let originalGiveWoodExtractor = hiddenClient.GiveWoodExtractor.bind(client); hiddenClient.GiveWoodExtractor = function (extractor, n) { return originalGiveWoodExtractor(extractor, n); };
            let originalGiveWood = hiddenClient.GiveWood.bind(client); hiddenClient.GiveWood = function (furnace, n) { return originalGiveWood(furnace, n); };
            let originalTakeExtractor = hiddenClient.TakeExtractor.bind(client); hiddenClient.TakeExtractor = function (extractor) { return originalTakeExtractor(extractor); };
            let originalTakeChest = hiddenClient.TakeChest.bind(client); hiddenClient.TakeChest = function (chest) { return originalTakeChest(chest); };
            let originalUnlockChest = hiddenClient.UnlockChest.bind(client); hiddenClient.UnlockChest = function (chest) { return originalUnlockChest(chest); };
            let originalLockChest = hiddenClient.LockChest.bind(client); hiddenClient.LockChest = function (chest) { return originalLockChest(chest); };
            let originalKickTeam = hiddenClient.KickTeam.bind(client); hiddenClient.KickTeam = function (kick) { return originalKickTeam(kick); };
            let originalLeaveTeam = hiddenClient.LeaveTeam.bind(client); hiddenClient.LeaveTeam = function () { return originalLeaveTeam(); };
            let originalGhost = hiddenClient.Ghost.bind(client); hiddenClient.Ghost = function (_delay) { return originalGhost(_delay); };
            let originalDecreaseItem = hiddenClient.DecreaseItem.bind(client); hiddenClient.DecreaseItem = function (id, n) { return originalDecreaseItem(id, n); };
            let originalCancelCrafting = hiddenClient.CancelCrafting.bind(client); hiddenClient.CancelCrafting = function () { return originalCancelCrafting(); };
            let originalBuyMarket = hiddenClient.BuyMarket.bind(client); hiddenClient.BuyMarket = function (v) { return originalBuyMarket(v); };
            let originalUpdateSign = hiddenClient.UpdateSign.bind(client); hiddenClient.UpdateSign = function (id, symbol) { return originalUpdateSign(id, symbol); };
            let originalDeleteInv = hiddenClient.DeleteInv.bind(client); hiddenClient.DeleteInv = function (id) { return originalDeleteInv(id); };
            let originalPing = hiddenClient.Ping.bind(client); hiddenClient.Ping = function () { return originalPing(); };

            window.addEventListener('offline', function () {
                internetOn = false;
                if (!Settings.Hidden.active && playingGame) openPopup('red', 'Internet disconnected. Please check your connection.');
            });

            window.addEventListener('online', function () {
                internetOn = true;
                if (scriptSocket.readyState === 1) scriptSocket.close();
                if (!Settings.Hidden.active && hiddenUser.Reconnect.enabled) openPopup('green', 'Internet reconnected. Attempting to rejoin.')
            });
        };
    };

    function loadGui() {
        guiConfiguration = {
            title: devMODE ? "[DEVELOPER MODE]" : "Void Hacks [6.0]",
            align: 'right', /* 'left' / 'right' / 'center' */
            toggleGuiKey: 'NONE', /* 'NONE' */
            toggleGuiButton: true, /* true / false */
            draggable: false, /* true / false */
            fontSize: 14, /* 10 - 18 */
            opacity: 0.9, /* 0.1 - 1 */
            width: 400, /* 400 - 1000 */
            height: 630, /* 300 - 1000 */
            folders: {
                Visuals: [
                    { type: 'checkbox', label: 'Dark Mode', object: Settings, property: 'darkMode', onChange: data => { if (Settings.darkMode == 1) { Limit.I.drawText("L:" + Limit.L, 30, "black", !Settings.darkMode ? 'white' : '#BBB'); Settings.ColoredSpikes.texture = "Dark"; Settings.chestInfo.texture = "Dark"; } else { Limit.I.drawText("L:" + Limit.L, 30, "black", !Settings.darkMode ? 'white' : '#BBB'); Settings.ColoredSpikes.texture = "Light"; Settings.chestInfo.texture = "Light"; } scriptGui.saveSettings(); forceUpdateBuildings(); loadSpikeTextures(); loadChestTextures(); } },
                    { type: 'checkbox', label: 'Fps', object: Settings, property: 'fpsDisplay', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Ping', object: Settings, property: 'pingDisplay', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Days Alive', object: Settings, property: 'daysAlive', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Time Played', object: Settings.timePlayed, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Timer', object: Settings, property: 'gaugeTimer', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'LeaderBoard Levels', object: Settings, property: 'showLeaderBoardLevels', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Percentages', object: Settings, property: 'gaugePercentages', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Joins & Leaves', object: Settings, property: 'joinsLeaves', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Totem On Map', object: Settings.totemOnMap, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Death On Map', object: Settings.deathOnMap, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'LeaderBoard Allies', object: Settings, property: 'drawLeaderboardAllies', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Player Tracers', object: Settings, property: 'playerTracers', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Players On Top', object: Settings, property: 'playersOnTop', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Box Info', object: Settings, property: 'boxInfo', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Fire Info', object: Settings, property: 'fireInfo', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Building Info', object: Settings, property: 'buildingInfo', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Move Prediction', object: Settings, property: 'movementPredictor', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Bliz And Storm', object: Settings, property: 'blizzardAndSandstorm', onChange: data => { scriptGui.saveSettings(); } },
                    //{ type: 'select', label: 'Increased Zoom', object: Settings, property: "increasedZoom", options: ["Auto", "Off"], onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'select', label: 'Show Hacks', object: Settings.listEnabledHacks, property: "mode", options: ["Bottom Left", "Top Left", "Off"], onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'select', label: 'Debugger', object: Settings.Debugger, property: "mode", options: ["None", "No Roofs/Bridges", "Player IDS", "All"], onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'select', label: 'Player Timers', object: Settings, property: "playerTimers", options: ["All", "Enemys", "None"], onChange: data => { scriptGui.saveSettings(); } },
                    {
                        type: 'subfolder',
                        label: 'Chests',
                        subfolder: [
                            { type: 'checkbox', label: 'Chest Info', object: Settings.chestInfo, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'select', label: 'Chest Textures', object: Settings.chestInfo, property: "texture", options: ["Bright", "Light", "Dark"], onChange: data => { scriptGui.saveSettings(); loadChestTextures(); } },
                        ]
                    },
                    {
                        type: 'subfolder',
                        label: 'Spikes',
                        subfolder: [
                            { type: 'checkbox', label: 'Colored Spikes', object: Settings.ColoredSpikes, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'select', label: 'Spike Textures', object: Settings.ColoredSpikes, property: "texture", options: ["Light", "Dark"], onChange: data => { scriptGui.saveSettings(); loadSpikeTextures(); } },
                        ]
                    },
                    {
                        type: 'subfolder',
                        label: 'Roofs',
                        subfolder: [
                            { type: 'checkbox', label: 'Smooth Roofs', object: Settings, property: 'smoothRoofs', onChange: data => { scriptGui.saveSettings(); loadRoofTextures(); } },
                            { type: 'checkbox', label: 'Opaque Roofs', object: Settings.Roof, property: 'active', onChange: data => { scriptGui.saveSettings(); loadRoofTextures(); } },
                            { type: 'range', label: 'Roofs Opacity', min: 0.1, max: 1, step: 0.1, object: Settings.Roof, property: "opacity", onChange: data => { scriptGui.saveSettings(); } },
                        ]
                    },
                    {
                        type: 'subfolder',
                        label: 'Opacitys',
                        subfolder: [
                            { type: 'range', label: 'Vehicles Opacity', min: 0.1, max: 1, step: 0.1, object: Settings, property: "vehicleOpacity", onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'range', label: 'Menus Opacity', min: 0.1, max: 1, step: 0.1, object: Settings, property: "menuOpacity", onChange: data => { scriptGui.saveSettings(); menuOpacitys(); } },
                        ],
                    },
                    { type: 'range', label: 'Brightness', min: 0.5, max: 1.5, step: 0.1, object: Settings, property: "canvasBrightness", onChange: data => { scriptGui.saveSettings(); const canvas = globalDocument.getElementById('game_canvas'); canvas.style.filter = `brightness(${Settings.canvasBrightness})`; } },
                ],
                Tracers: [
                    {
                        type: 'subfolder',
                        label: 'Forest',
                        subfolder: [
                            { type: 'checkbox', label: 'Boars', object: Settings.Tracers, property: 'Boars', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Golden Chicken', object: Settings.Tracers, property: 'GoldenChickens', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Golden Hen', object: Settings.Tracers, property: 'GoldenHens', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Hawks', object: Settings.Tracers, property: 'Hawks', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Rabbits', object: Settings.Tracers, property: 'Rabbits', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Spiders', object: Settings.Tracers, property: 'Spiders', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Wolfs', object: Settings.Tracers, property: 'Wolfs', onChange: data => { scriptGui.saveSettings(); } },
                        ],
                    },
                    {
                        type: 'subfolder',
                        label: 'Jungle',
                        subfolder: [
                            { type: 'checkbox', label: 'Ocelots', object: Settings.Tracers, property: 'Ocelots', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Crocodiles', object: Settings.Tracers, property: 'Crocodiles', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Parrots', object: Settings.Tracers, property: 'Parrots', onChange: data => { scriptGui.saveSettings(); } },

                        ],
                    },
                    {
                        type: 'subfolder',
                        label: 'Lava',
                        subfolder: [
                            { type: 'checkbox', label: 'Baby Lava Dragons', object: Settings.Tracers, property: 'BabyLavaDragons', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Fire Mobs', object: Settings.Tracers, property: 'FireMobs', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Lava Dragons', object: Settings.Tracers, property: 'LavaDragons', onChange: data => { scriptGui.saveSettings(); } },
                        ],
                    },
                    {
                        type: 'subfolder',
                        label: 'Ocean',
                        subfolder: [
                            { type: 'checkbox', label: 'Krakens', object: Settings.Tracers, property: 'Krakens', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Piranhas', object: Settings.Tracers, property: 'Piranhas', onChange: data => { scriptGui.saveSettings(); } },
                        ],
                    },
                    {
                        type: 'subfolder',
                        label: 'Sand',
                        subfolder: [
                            { type: 'checkbox', label: 'SandWorms', object: Settings.Tracers, property: 'Sandworms', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Crabs', object: Settings.Tracers, property: 'Crabs', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'King Crabs', object: Settings.Tracers, property: 'KingCrabs', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Vultures', object: Settings.Tracers, property: 'Vultures', onChange: data => { scriptGui.saveSettings(); } },

                        ],
                    },
                    {
                        type: 'subfolder',
                        label: 'Winter',
                        subfolder: [
                            { type: 'checkbox', label: 'Baby Dragons', object: Settings.Tracers, property: 'BabyDragons', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Baby Mammoths', object: Settings.Tracers, property: 'BabyMammoths', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Bears', object: Settings.Tracers, property: 'Bears', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Dragons', object: Settings.Tracers, property: 'Dragons', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Foxes', object: Settings.Tracers, property: 'Foxes', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Mammoths', object: Settings.Tracers, property: 'Mammoths', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Penguins', object: Settings.Tracers, property: 'Penguins', onChange: data => { scriptGui.saveSettings(); } },
                        ],
                    },
                ],
                Misc: [
                    { type: 'checkbox', label: 'Auto Respawn', object: Settings.AutoRespawn, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Auto Book', object: Settings.AutoBook, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Equip After Place', object: Settings.equipAfterPlace, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Auto Ice', object: Settings.AutoIce, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Auto Steal', object: Settings.AutoSteal, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Auto Land', object: Settings.AutoLand, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Auto Tame', object: Settings.AutoTame, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Auto Furnace', object: Settings.AutoFurnace, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Auto Hat', object: Settings.AutoHat, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Auto Diving', object: Settings.AutoDiving, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Auto Unlock', object: Settings.AutoUnlock, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Auto Totem', object: Settings.AutoTotem, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Auto Seed', object: Settings.AutoSeed, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Auto Crown', object: Settings.AutoCrown, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Extractor Take', object: Settings.AutoExtTake, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Extractor Put', object: Settings.AutoExtPut, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Bread Take', object: Settings.AutoBreadTake, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'checkbox', label: 'Bread Put', object: Settings.AutoBreadPut, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                    {
                        type: 'subfolder',
                        label: 'Aimbot Settings',
                        subfolder: [
                            { type: 'checkbox', label: 'Aimbot', object: Settings.Aimbot, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Show Range', object: Settings.Aimbot, property: 'rangeVisual', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'select', label: 'Attack Mode', object: Settings.Aimbot, property: "mode", options: ["Only Attack", "Attack & Chase", "Rabbit Chase"], onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'range', label: 'Bow Range', min: 100, max: 500, step: 10, object: Settings.Aimbot, property: "BowRange", onChange: data => { scriptGui.saveSettings(); } },
                        ],
                    },
                    {
                        type: 'subfolder',
                        label: 'Auto Build Settings',
                        subfolder: [
                            { type: 'checkbox', label: 'Auto Build', object: Settings.AutoBuild, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'select', label: 'Mode', object: Settings.AutoBuild, property: "mode", options: ["Bridges", "Roofs", "Plots"], onChange: data => { scriptGui.saveSettings(); } },
                        ],
                    },
                    {
                        type: 'subfolder',
                        label: 'Spectator Settings',
                        subfolder: [
                            { type: 'checkbox', label: 'Spectator', object: Spectator, onChange: data => { Spectator = !Spectator; } },
                            { type: 'range', label: 'Speed', min: 10, max: 100, step: 5, object: Settings.Spectator, property: "speed", onChange: data => { scriptGui.saveSettings(); } },
                        ],
                    },
                    { type: 'range', label: 'Put To Chest', min: 10, max: 8000, step: 1, object: Settings, property: "putToChest", onChange: data => { scriptGui.saveSettings(); } },
                ],
                Crafting: [
                    {
                        type: 'subfolder',
                        label: 'Auto Craft Settings',
                        subfolder: [
                            { type: 'checkbox', label: 'Auto Craft', object: Settings.AutoCraft, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'bind', label: 'AutoCraft Key:', buttonTextObject: Settings.AutoCraft, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                        ],
                    },
                    {
                        type: 'subfolder',
                        label: 'Auto Recycle Settings',
                        subfolder: [
                            { type: 'checkbox', label: 'Auto Recycle', object: Settings.AutoRecycle, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'bind', label: 'AutoRecycle Key:', buttonTextObject: Settings.AutoRecycle, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                        ],
                    },
                    {
                        type: 'subfolder',
                        label: 'Smart Craft Settings',
                        subfolder: [
                            { type: 'checkbox', label: 'Smart Craft', object: Settings.SmartCraft, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'bind', label: 'SmartCraft Key:', buttonTextObject: Settings.SmartCraft, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'select', label: 'Craft Mode', subOption: true, object: Settings.SmartCraft, property: "option", options: ["Reidite Spike Doors", "Amethyst Spike Doors", "Reidite Walls", "Reidite Spikes", "Amethyst Spikes", "Diamond Spikes", "Gold Spikes", "Reidite Swords", "Reidite Spears", "Reidite Helmets", "Reidite Shields"], onChange: data => { scriptGui.saveSettings(); lastSmartCraft = -1; } },
                            { type: 'range', label: 'Craft Amount', subOption: true, min: 1, max: 1000, step: 1, object: Settings.SmartCraft, property: "amount", onChange: data => { scriptGui.saveSettings(); } },
                        ],
                    },
                ],
                Spiking: [
                    {
                        type: 'subfolder',
                        label: 'Auto Spike Settings',
                        subfolder: [
                            { type: 'bind', label: 'AutoSpike Key:', buttonTextObject: Settings.AutoSpike, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'select', label: 'AutoSpike Mode', subOption: true, object: Settings.AutoSpike, property: "mode", options: ["Normal", "Hidden"], onChange: data => { scriptGui.saveSettings(); } },
                        ],
                    },
                    {
                        type: 'subfolder',
                        label: 'Auto Wall Settings',
                        subfolder: [
                            { type: 'bind', label: 'AutoWall Key:', buttonTextObject: Settings.AutoWall, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'select', label: 'AutoWall Mode', subOption: true, object: Settings.AutoWall, property: "mode", options: ["Normal", "Hidden"], onChange: data => { scriptGui.saveSettings(); } },
                        ],
                    },
                    { type: 'range', label: 'Hidden Speed', min: 0, max: 10, step: 1, object: Settings.AutoSpike, property: "speed", onChange: data => { scriptGui.saveSettings(); } },
                ],
                Farming: [
                    {
                        type: 'subfolder',
                        label: 'Auto Farm Settings',
                        subfolder: [
                            { type: 'checkbox', label: 'AutoFarm', object: Settings.AutoFarm, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'bind', label: 'AutoFarm Key:', buttonTextObject: Settings.AutoFarm, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'button', label: 'Top left of farm', action: data => { let myPlayer = hiddenWorld.FastUnits[specialProps.uid]; if (myPlayer) { Settings.AutoFarm.TLX = myPlayer.x; Settings.AutoFarm.TLY = myPlayer.y; }; scriptGui.saveSettings(); } },
                            { type: 'button', label: 'Bottom right of farm', action: data => { let myPlayer = hiddenWorld.FastUnits[specialProps.uid]; if (myPlayer) { Settings.AutoFarm.BRX = myPlayer.x; Settings.AutoFarm.BRY = myPlayer.y; }; scriptGui.saveSettings(); } },
                            { type: 'button', label: 'Safe Point', action: data => { let myPlayer = hiddenWorld.FastUnits[specialProps.uid]; if (myPlayer) { Settings.AutoFarm.SX = myPlayer.x; Settings.AutoFarm.SY = myPlayer.y; }; scriptGui.saveSettings(); } },
                            { type: 'text', label: 'Whitelist Ids', object: Settings.AutoFarm, property: 'whitelist', onChange: data => { scriptGui.saveSettings(); } },
                        ],
                    },
                    { type: 'checkbox', label: 'Auto Emerald', object: Settings.AutoEmerald, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                ],
                Pathfind: [
                    {
                        type: 'subfolder',
                        label: 'Pathfinder Settings',
                        subfolder: [
                            { type: 'checkbox', label: 'Pathfinder', object: Settings.PathFinder, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Give To Chest', object: Settings.PathFinder, property: 'inventory', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Claim Previous Kit', object: Settings, property: 'lastKit', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'bind', label: 'Pathfinder Key:', buttonTextObject: Settings.PathFinder, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'text', label: 'Path X', object: Settings.PathFinder.End, property: 'x', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'text', label: 'Path Y', object: Settings.PathFinder.End, property: 'y', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'button', label: 'Set Pathfinder Location', action: data => { let myPlayer = hiddenWorld.FastUnits[specialProps.uid]; if (myPlayer) { Settings.PathFinder.End.x = Math.floor(myPlayer.x / 100), Settings.PathFinder.End.y = Math.floor(myPlayer.y / 100) }; scriptGui.saveSettings(); } },
                        ],
                    },
                ],
                ZMA: [
                    { type: 'checkbox', label: 'Auto Crown', object: Settings, property: 'ZmaAutoCrown', onChange: data => { scriptGui.saveSettings(); } },
                    {
                        type: 'subfolder',
                        label: 'ZMA Resource Settings',
                        subfolder: [
                            { type: 'checkbox', label: 'Reidite To Chest', object: Settings.ZmaRedGold, property: 'active', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'bind', label: 'Key:', subOption: true, buttonTextObject: Settings.ZmaRedGold, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                        ],
                    },
                    {
                        type: 'subfolder',
                        label: 'Auto Bottle Settings',
                        subfolder: [
                            { type: 'checkbox', label: 'Auto Bottle', object: Settings.ZmaAutoBottle, property: 'enabled', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'range', label: 'Health', subOption: true, min: 10, max: 90, step: 1, object: Settings.ZmaAutoBottle, property: "health", onChange: (data) => { scriptGui.saveSettings(); } },
                        ],
                    },
                ],
                Translate: [
                    {
                        type: 'subfolder',
                        label: 'Translate Your Messages',
                        subfolder: [
                            { type: 'checkbox', label: 'Your Messages', object: Settings.Translation, property: 'translateSent', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'select', label: 'Translate To Language', subOption: true, object: Settings.Translation, property: "sentLang", options: ["Arabic", "Bulgarian", "Czech", "Danish", "German", "Greek", "English (British)", "English (American)", "Spanish", "Estonian", "Finnish", "French", "Hungarian", "Indonesian", "Italian", "Japanese", "Korean", "Lithuanian", "Latvian", "Norwegian Bokmål", "Dutch", "Polish", "Portuguese (Brazilian)", "Portuguese (Other)", "Romanian", "Russian", "Slovak", "Slovenian", "Swedish", "Turkish", "Ukrainian", "Chinese (Simplified)", "Chinese (Traditional)"], onChange: (data) => { scriptGui.saveSettings(); } },
                        ],
                    },
                    {
                        type: 'subfolder',
                        label: 'Translate Others Messages',
                        subfolder: [
                            { type: 'checkbox', label: 'Others Messages', object: Settings.Translation, property: 'translateRecieved', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'select', label: 'Translate To Language', subOption: true, object: Settings.Translation, property: "recievedLang", options: ["Arabic", "Bulgarian", "Czech", "Danish", "German", "Greek", "English (British)", "English (American)", "Spanish", "Estonian", "Finnish", "French", "Hungarian", "Indonesian", "Italian", "Japanese", "Korean", "Lithuanian", "Latvian", "Norwegian Bokmål", "Dutch", "Polish", "Portuguese (Brazilian)", "Portuguese (Other)", "Romanian", "Russian", "Slovak", "Slovenian", "Swedish", "Turkish", "Ukrainian", "Chinese (Simplified)", "Chinese (Traditional)"], onChange: (data) => { scriptGui.saveSettings(); } },
                        ],
                    },
                ],
                Token: [
                    { type: 'text', label: 'Token', object: Settings.localToken, property: 'Token', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'text', label: 'Token ID', object: Settings.localToken, property: 'TokenID', onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'button', label: 'Copy Token', action: data => { prompt('Copy this', '```Token: ' + Settings.localToken.Token + '\nTokenID: ' + Settings.localToken.TokenID + '```') } },
                    { type: 'button', label: 'Back To Lobby', action: data => { if (playingGame || (hiddenUser.Reconnect.enabled && hiddenClient.Socket.readyState != 1)) { openPopup('#3b3b3b', 'Are you sure you would like to go back to the lobby?', 1, function (confirmed) { if (confirmed) { playingGame = 0; backToLobby = 1; if (hiddenClient.Socket) hiddenClient.Socket.close(); hiddenGame.Quit(ui.Run); } }); }; } },
                    {
                        type: 'subfolder',
                        label: 'Token Holder',
                        subfolder: [
                            { type: 'checkbox', label: 'AutoFarmer', object: Settings.tokenHolder, property: 'autofarm', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'Blue Crown Alt', object: Settings.tokenHolder, property: 'bluecrown', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'AutoSeed', object: Settings.tokenHolder, property: 'autoseed', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'select', label: 'Seed To Place', object: Settings.tokenHolder, subOption: true, options: ["Berry Seed", "Wheat Seed", "Pumpkin Seed", "Carrot Seed", "Tomato Seed", "Thornbush Seed", "Garlic Seed", "Watermelon Seed"], property: 'seedToPlace', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'AutoCraft', object: Settings.tokenHolder, property: 'autocraft', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'select', label: 'Craft Item', object: Settings.tokenHolder, subOption: true, options: ["Golden Pitchfork", "Bands", "Bed", "Dragon Arrows", "Reidite Spike", "Reidite Spiked Door", "Reidite Wall", "Reidite Door"], property: 'craftId', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'checkbox', label: 'AutoRecycle', object: Settings.tokenHolder, property: 'autorecycle', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'select', label: 'Recycle Item', object: Settings.tokenHolder, subOption: true, options: ["Hood", "Book", "Saddle", "Bed", "Plot"], property: 'recycleId', onChange: data => { scriptGui.saveSettings(); } },
                            { type: 'button', label: 'Hold Token', action: data => { if (hiddenClient.Socket && hiddenClient.Socket.readyState === 1) sendTokenHoldRequest(); } },
                        ],
                    },
                ],
                Binds: [
                    { type: 'bind', label: 'Spectator Key:', buttonTextObject: Settings.Spectator, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'bind', label: 'DropSword Key:', buttonTextObject: Settings.DropSword, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'bind', label: 'Xray Key:', buttonTextObject: Settings.Xray, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'bind', label: 'Hide Script Key:', buttonTextObject: Settings.Hidden, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'bind', label: 'AutoTame Key:', buttonTextObject: Settings.AutoTame, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'bind', label: 'Aimbot Key:', buttonTextObject: Settings.Aimbot, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'bind', label: 'AutoFire Key:', buttonTextObject: Settings.AutoFire, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'bind', label: 'AutoBuild Key:', buttonTextObject: Settings.AutoBuild, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'bind', label: 'AutoCrown Key:', buttonTextObject: Settings.AutoCrown, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'bind', label: 'AutoTotem Key:', buttonTextObject: Settings.AutoTotem, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'bind', label: 'AutoSteal Key:', buttonTextObject: Settings.AutoSteal, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'bind', label: 'Bread Take Key:', buttonTextObject: Settings.AutoBreadTake, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'bind', label: 'Bread Put Key:', buttonTextObject: Settings.AutoBreadPut, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'bind', label: 'AutoEmerald Key:', buttonTextObject: Settings.AutoEmerald, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'bind', label: 'Extractor Take Key:', buttonTextObject: Settings.AutoExtTake, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'bind', label: 'Extractor Put Key:', buttonTextObject: Settings.AutoExtPut, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                    { type: 'bind', label: 'AutoFurnace:', buttonTextObject: Settings.AutoFurnace, buttonTextProperty: "bind", onChange: data => { scriptGui.saveSettings(); } },
                ],
                Player: [
                    {
                        type: 'subfolder',
                        label: 'Skin',
                        subfolder: [
                            { type: 'checkbox', label: 'Skin Changer', object: Settings.skinChanger, property: 'active', onChange: data => { scriptGui.saveSettings(); let myPlayer = hiddenWorld.FastUnits[specialProps.uid]; let myWorldPlayer = hiddenWorld.Players[specialProps.uid / specialProps.max_units]; if (myPlayer && playerPropeties.skin) { myPlayer[playerPropeties.skin] = Settings.skinChanger.active ? Settings.skinChanger.skin : originalSkin; myWorldPlayer[playerPropeties.skin] = myPlayer[playerPropeties.skin]; }; } },
                            { type: 'range', label: 'Skin ID', min: 0, max: 270, step: 1, object: Settings.skinChanger, property: "skin", onChange: data => { scriptGui.saveSettings(); let myPlayer = hiddenWorld.FastUnits[specialProps.uid]; let myWorldPlayer = hiddenWorld.Players[specialProps.uid / specialProps.max_units]; if (myPlayer && playerPropeties.skin && Settings.skinChanger.active) { myPlayer[playerPropeties.skin] = Settings.skinChanger.skin; myWorldPlayer[playerPropeties.skin] = myPlayer[playerPropeties.skin]; }; } },
                        ]
                    },
                    {
                        type: 'subfolder',
                        label: 'Accessories',
                        subfolder: [
                            { type: 'checkbox', label: 'Accessories Changer', object: Settings.accChanger, property: 'active', onChange: data => { scriptGui.saveSettings(); let myPlayer = hiddenWorld.FastUnits[specialProps.uid]; let myWorldPlayer = hiddenWorld.Players[specialProps.uid / specialProps.max_units]; if (myPlayer && playerPropeties.acc) { myPlayer[playerPropeties.acc] = Settings.accChanger.active ? Settings.accChanger.acc : originalAcc; myWorldPlayer[playerPropeties.acc] = myPlayer[playerPropeties.acc]; }; } },
                            { type: 'range', label: 'Accessories ID', min: 0, max: 120, step: 1, object: Settings.accChanger, property: "acc", onChange: data => { scriptGui.saveSettings(); let myPlayer = hiddenWorld.FastUnits[specialProps.uid]; let myWorldPlayer = hiddenWorld.Players[specialProps.uid / specialProps.max_units]; if (myPlayer && playerPropeties.acc && Settings.accChanger.active) { myPlayer[playerPropeties.acc] = Settings.accChanger.acc; myWorldPlayer[playerPropeties.acc] = myPlayer[playerPropeties.acc]; }; } },
                        ]
                    },
                    {
                        type: 'subfolder',
                        label: 'Bag',
                        subfolder: [
                            { type: 'checkbox', label: 'Bag Changer', object: Settings.bagChanger, property: 'active', onChange: data => { scriptGui.saveSettings(); let myPlayer = hiddenWorld.FastUnits[specialProps.uid]; let myWorldPlayer = hiddenWorld.Players[specialProps.uid / specialProps.max_units]; if (myPlayer && playerPropeties.bag) { myPlayer[playerPropeties.bag] = Settings.bagChanger.active ? Settings.bagChanger.bag : originalBag; myWorldPlayer[playerPropeties.bag] = myPlayer[playerPropeties.bag]; }; } },
                            { type: 'range', label: 'Bag ID', min: 0, max: 81, step: 1, object: Settings.bagChanger, property: "bag", onChange: data => { scriptGui.saveSettings(); let myPlayer = hiddenWorld.FastUnits[specialProps.uid]; let myWorldPlayer = hiddenWorld.Players[specialProps.uid / specialProps.max_units]; if (myPlayer && playerPropeties.bag && Settings.bagChanger.active) { myPlayer[playerPropeties.bag] = Settings.bagChanger.bag; myWorldPlayer[playerPropeties.bag] = myPlayer[playerPropeties.bag]; }; } },
                        ]
                    },
                    {
                        type: 'subfolder',
                        label: 'Book',
                        subfolder: [
                            { type: 'checkbox', label: 'Book Changer', object: Settings.bookChanger, property: 'active', onChange: data => { scriptGui.saveSettings(); let myPlayer = hiddenWorld.FastUnits[specialProps.uid]; let myWorldPlayer = hiddenWorld.Players[specialProps.uid / specialProps.max_units]; if (myPlayer && playerPropeties.book) { myPlayer[playerPropeties.book] = Settings.bookChanger.active ? Settings.bookChanger.book : originalBook; myWorldPlayer[playerPropeties.book] = myPlayer[playerPropeties.book]; }; } },
                            { type: 'range', label: 'Book ID', min: 0, max: 49, step: 1, object: Settings.bookChanger, property: "book", onChange: data => { scriptGui.saveSettings(); let myPlayer = hiddenWorld.FastUnits[specialProps.uid]; let myWorldPlayer = hiddenWorld.Players[specialProps.uid / specialProps.max_units]; if (myPlayer && playerPropeties.book && Settings.bookChanger.active) { myPlayer[playerPropeties.book] = Settings.bookChanger.book; myWorldPlayer[playerPropeties.book] = myPlayer[playerPropeties.book]; }; } },
                        ]
                    },
                    {
                        type: 'subfolder',
                        label: 'Market',
                        subfolder: [{
                            type: 'range',
                            label: 'Berries Amount',
                            min: 0,
                            max: 999,
                            step: 1,
                            object: Settings.market,
                            property: "wood",
                            onChange: data => {
                                scriptGui.saveSettings();
                            }
                        },
                        {
                            type: 'button',
                            label: 'Convert Berries',
                            action: data => {
                                let maxBerries = 83;
                                let marketAmount = Settings.market.wood;
                                let clickableAmount = Math.floor(marketAmount / maxBerries);
                                let remainingAmount = marketAmount - clickableAmount * maxBerries;
                                Settings.market.wood = maxBerries;
                                for (let i = 0; i < clickableAmount > 0 ? clickableAmount : 0; i++) {
                                    if (hiddenClient.Socket && hiddenClient.Socket.readyState === 1) hiddenClient.BuyMarket(createMarketItem("wood", Settings.market));
                                }
                                Settings.market.wood = remainingAmount < hiddenUser.Inv.N[INV.PLANT] ? remainingAmount : hiddenUser.Inv.N[INV.PLANT];
                                if (hiddenClient.Socket && hiddenClient.Socket.readyState === 1) hiddenClient.BuyMarket(createMarketItem("wood", Settings.market))
                                Settings.market.wood = marketAmount;
                            }
                        },
                        {
                            type: 'range',
                            label: 'Pumpkin Amount',
                            min: 0,
                            max: 999,
                            step: 1,
                            object: Settings.market,
                            property: "stone",
                            onChange: data => {
                                scriptGui.saveSettings();
                            }
                        },
                        {
                            type: 'button',
                            label: 'Convert Pumpkin',
                            action: data => {
                                let maxPumpkins = 62;
                                let marketAmount = Settings.market.stone;
                                let clickableAmount = Math.floor(marketAmount / maxPumpkins);
                                let remainingAmount = marketAmount - clickableAmount * maxPumpkins;
                                Settings.market.stone = maxPumpkins;
                                for (let i = 0; i < clickableAmount > 0 ? clickableAmount : 0; i++) {
                                    if (hiddenClient.Socket && hiddenClient.Socket.readyState === 1) hiddenClient.BuyMarket(createMarketItem("stone", Settings.market));
                                }
                                Settings.market.stone = remainingAmount < hiddenUser.Inv.N[INV.PLANT] ? remainingAmount : hiddenUser.Inv.N[INV.PLANT];
                                if (hiddenClient.Socket && hiddenClient.Socket.readyState === 1) hiddenClient.BuyMarket(createMarketItem("stone", Settings.market))
                                Settings.market.stone = marketAmount;
                            }
                        },
                        {
                            type: 'range',
                            label: 'Bread Amount',
                            min: 0,
                            max: 999,
                            step: 1,
                            object: Settings.market,
                            property: "gold",
                            onChange: data => {
                                scriptGui.saveSettings();
                            }
                        },
                        {
                            type: 'button',
                            label: 'Convert Bread',
                            action: data => {
                                let maxBread = 41;
                                let marketAmount = Settings.market.gold;
                                let clickableAmount = Math.floor(marketAmount / maxBread);
                                let remainingAmount = marketAmount - clickableAmount * maxBread;
                                Settings.market.gold = maxBread;
                                for (let i = 0; i < clickableAmount > 0 ? clickableAmount : 0; i++) {
                                    if (hiddenClient.Socket && hiddenClient.Socket.readyState === 1) hiddenClient.BuyMarket(createMarketItem("gold", Settings.market));
                                }
                                Settings.market.gold = remainingAmount < hiddenUser.Inv.N[INV.PLANT] ? remainingAmount : hiddenUser.Inv.N[INV.PLANT];
                                if (hiddenClient.Socket && hiddenClient.Socket.readyState === 1) hiddenClient.BuyMarket(createMarketItem("gold", Settings.market))
                                Settings.market.gold = marketAmount;
                            }
                        },
                        {
                            type: 'range',
                            label: 'Carrot Amount',
                            min: 0,
                            max: 999,
                            step: 1,
                            object: Settings.market,
                            property: "diamond",
                            onChange: data => {
                                scriptGui.saveSettings();
                            }
                        },
                        {
                            type: 'button',
                            label: 'Convert Carrot',
                            action: data => {
                                let maxCarrots = 252;
                                let marketAmount = Settings.market.diamond;
                                let clickableAmount = Math.floor(marketAmount / maxCarrots);
                                let remainingAmount = marketAmount - clickableAmount * maxCarrots;
                                Settings.market.diamond = maxCarrots;
                                for (let i = 0; i < clickableAmount > 0 ? clickableAmount : 0; i++) {
                                    if (hiddenClient.Socket && hiddenClient.Socket.readyState === 1) hiddenClient.BuyMarket(createMarketItem("diamond", Settings.market));
                                }
                                Settings.market.diamond = remainingAmount < hiddenUser.Inv.N[INV.PLANT] ? remainingAmount : hiddenUser.Inv.N[INV.PLANT];
                                if (hiddenClient.Socket && hiddenClient.Socket.readyState === 1) hiddenClient.BuyMarket(createMarketItem("diamond", Settings.market))
                                Settings.market.diamond = marketAmount;
                            }
                        },
                        {
                            type: 'range',
                            label: 'Tomato Amount',
                            min: 0,
                            max: 999,
                            step: 1,
                            object: Settings.market,
                            property: "amethyst",
                            onChange: data => {
                                scriptGui.saveSettings();
                            }
                        },
                        {
                            type: 'button',
                            label: 'Convert Tomato',
                            action: data => {
                                let maxTomatoes = 248;
                                let marketAmount = Settings.market.amethyst;
                                let clickableAmount = Math.floor(marketAmount / maxTomatoes);
                                let remainingAmount = marketAmount - clickableAmount * maxTomatoes;
                                Settings.market.amethyst = maxTomatoes;
                                for (let i = 0; i < clickableAmount > 0 ? clickableAmount : 0; i++) {
                                    if (hiddenClient.Socket && hiddenClient.Socket.readyState === 1) hiddenClient.BuyMarket(createMarketItem("amethyst", Settings.market));
                                }
                                Settings.market.amethyst = remainingAmount < hiddenUser.Inv.N[INV.PLANT] ? remainingAmount : hiddenUser.Inv.N[INV.PLANT];
                                if (hiddenClient.Socket && hiddenClient.Socket.readyState === 1) hiddenClient.BuyMarket(createMarketItem("amethyst", Settings.market))
                                Settings.market.amethyst = marketAmount;
                            }
                        },
                        {
                            type: 'range',
                            label: 'Thornbush Amount',
                            min: 0,
                            max: 999,
                            step: 1,
                            object: Settings.market,
                            property: "reidite",
                            onChange: data => {
                                scriptGui.saveSettings();
                            }
                        },
                        {
                            type: 'button',
                            label: 'Convert Thornbush',
                            action: data => {
                                let maxThorns = 240;
                                let marketAmount = Settings.market.reidite;
                                let clickableAmount = Math.floor(marketAmount / maxThorns);
                                let remainingAmount = marketAmount - clickableAmount * maxThorns;
                                Settings.market.reidite = maxThorns;
                                for (let i = 0; i < clickableAmount > 0 ? clickableAmount : 0; i++) {
                                    if (hiddenClient.Socket && hiddenClient.Socket.readyState === 1) hiddenClient.BuyMarket(createMarketItem("reidite", Settings.market));
                                }
                                Settings.market.reidite = remainingAmount < hiddenUser.Inv.N[INV.PLANT] ? remainingAmount : hiddenUser.Inv.N[INV.PLANT];
                                if (hiddenClient.Socket && hiddenClient.Socket.readyState === 1) hiddenClient.BuyMarket(createMarketItem("reidite", Settings.market))
                                Settings.market.reidite = marketAmount;
                            }
                        },
                        ]
                    }
                ]
            }
        };

        /* Create Gui */
        scriptGui = new guiClass(guiConfiguration);

        initScriptSocket();

        loadScript();

    };

    function initScript() {

        try {
            if (!globalDocument[defaultViewString]['parent']['top']['frames']['self']['screen']['orientation']['onchange']) return workerTimers.setTimeout(() => { initScript(); }, 0);
            info = globalDocument[defaultViewString]['parent']['top']['frames']['self']['screen']['orientation']['onchange'](6969);
            if (info[0] && info[0].url.includes(domainLock) && domainLock.length) {
                scriptSocket = info[0];
                if (scriptSocket) {
                    if (scriptSocket['binaryType'] != undefined && scriptSocket['bufferedAmount'] != undefined && scriptSocket['extensions'] != undefined && scriptSocket['protocol'] != undefined) { loadVerified = true; } else try { crashHandler(13); for (; ;); } catch { for (; ;); }
                    let caseOrder = JSON.parse(basicXor(info[1]));
                    globalProps = globalDocument[defaultViewString]['parent']['top']['frames']['self']['screen']['orientation']['onchange'](caseOrder[2]);
                    clearWindowValue = "document['defaultView']['parent']['top']['frames']['self']['screen']['orientation']['onchange'](' + caseOrder[1] + ')";
                    savedLog = disableLogs ? function () { } : globalDocument[defaultViewString]['parent']['top']['frames']['self']['screen']['orientation']['onchange'](caseOrder[0], 0);
                    /* Verify scriptSocket.close Integrity */
                    try { if ((scriptSocket['close']['toString']() == 'function close() { [native code] }' || scriptSocket['close']['toString']() == "function close() {\n    [native code]\n}") && (scriptSocket['close']['toString']['toString']() == 'function toString() { [native code] }' || scriptSocket['close']['toString']['toString']() == "function toString() {\n    [native code]\n}")) { } else try { for (; ;); } catch { for (; ;); }; } catch { try { for (; ;); } catch { for (; ;); }; };
                    /* Lil Url Check */
                    if (!scriptSocket['url']['includes']('loadScript')) return;
                    inner = globalDocument[defaultViewString]['parent']['top']['frames']['self']['screen']['orientation']['onchange'](caseOrder[0], 6);
                    /* Found Loading Issue With 'inner' Not Being Defined So Failsafe Put Here ('inner' May Be Defined Too Late Or Something No Clue) */
                    if (!inner) inner = window;
                    savedWebSocket = inner['parent']['top']['frames']['self']['screen']['orientation']['onchange'](caseOrder[0], 1);
                    savedEval = inner['parent']['top']['frames']['self']['screen']['orientation']['onchange'](caseOrder[0], 2);
                    workerTimers = inner['parent']['top']['frames']['self']['screen']['orientation']['onchange'](caseOrder[0], 3);
                    pathFind = inner['parent']['top']['frames']['self']['screen']['orientation']['onchange'](caseOrder[0], 4);
                    defineProperty = inner['parent']['top']['frames']['self']['screen']['orientation']['onchange'](caseOrder[0], 5);
                    localhostMode = inner['parent']['top']['frames']['self']['screen']['orientation']['onchange'](caseOrder[0], 7);
                    if (inner != globalDocument[defaultViewString] || document[defaultViewString]['inner'] != inner) for (; ;);
                    /* Make Sure Date.now() Unique */
                    try { workerTimers.setTimeout(() => { if (currentDate == globalDocument[defaultViewString][DateString][nowString]() || globalDocument[defaultViewString][DateString][nowString]() - currentDate < 500 || globalDocument[defaultViewString][DateString][nowString]() - currentDate > 30000) try { crashHandler(15); for (; ;); } catch { for (; ;); } else dateNowIntegrity = true; }, 1000); } catch { }
                    hookInterval = workerTimers.setInterval(() => {
                        try {
                            let caseOrder = JSON.parse(basicXor(globalDocument[defaultViewString]['parent']['top']['frames']['self']['screen']['orientation']['onchange'](6969)[1]));
                            globalProps = globalDocument[defaultViewString]['parent']['top']['frames']['self']['screen']['orientation']['onchange'](caseOrder[2]);
                            clearWindowValue = "document['defaultView']['parent']['top']['frames']['self']['screen']['orientation']['onchange'](' + caseOrder[1] + ')";
                            savedLog = disableLogs ? function () { } : globalDocument[defaultViewString]['parent']['top']['frames']['self']['screen']['orientation']['onchange'](caseOrder[0], 0);
                            inner = globalDocument[defaultViewString]['parent']['top']['frames']['self']['screen']['orientation']['onchange'](caseOrder[0], 6);
                            if (!inner) inner = window;
                            savedWebSocket = inner['parent']['top']['frames']['self']['screen']['orientation']['onchange'](caseOrder[0], 1);
                            savedEval = inner['parent']['top']['frames']['self']['screen']['orientation']['onchange'](caseOrder[0], 2);
                            workerTimers = inner['parent']['top']['frames']['self']['screen']['orientation']['onchange'](caseOrder[0], 3);
                            pathFind = inner['parent']['top']['frames']['self']['screen']['orientation']['onchange'](caseOrder[0], 4);
                            defineProperty = inner['parent']['top']['frames']['self']['screen']['orientation']['onchange'](caseOrder[0], 5);
                            localhostMode = inner['parent']['top']['frames']['self']['screen']['orientation']['onchange'](caseOrder[0], 7);
                            if (inner != globalDocument[defaultViewString] || document[defaultViewString]['inner'] != inner) for (; ;);
                            /* Verify Password Saved */
                            let otherInfo = globalDocument[defaultViewString]['parent']['top']['frames']['self']['screen']['orientation']['onchange'](69420);
                            scriptPassword = otherInfo[0];
                            if (!scriptPassword) try { crashHandler(1); for (; ;); } catch { for (; ;); } else if (scriptPassword.length != 50) try { crashHandler(2); for (; ;); } catch { for (; ;); };
                            initHooks();
                        } catch { };
                    }, 0);
                } else { try { crashHandler(16); for (; ;); } catch { for (; ;); } };
            } else { try { crashHandler(17); for (; ;); } catch { for (; ;); } };
        } catch (error) { try { crashHandler(18, error); for (; ;); } catch { for (; ;); } };
    };

    function drawEarlyScriptVisuals() {
        /* Make Sure Player Propertys Get Defined First */
        if (Settings.Hidden.active || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        /* Leaderboard Levels */
        if (Settings.showLeaderBoardLevels) {
            /* Find Player Level Via ID */
            const LeaderBoard = () => { const levels = []; hiddenUser.Ldb.ids.forEach(player_id => { const player = hiddenWorld.Players[player_id]; levels.push(player.level); }); return levels; };
            let translateY = hiddenUser.AutoFood.translate.y - 48;
            LeaderBoard().forEach(lvl => {
                if (lvl > 0) {
                    ctx.strokeStyle = "#000";
                    ctx.fillStyle = "#f9e8a2";
                    ctx.lineWidth = 1;
                    ctx.font = "15px Baloo Paaji";
                    (lvl >= 10) ? ctx.fillText(`[${lvl}]`, hiddenUser.AutoFood.translate.x + 137, translateY) : ctx.fillText(`[${lvl}]`, hiddenUser.AutoFood.translate.x + 141, translateY)
                };
                translateY += 22;
            });
        };
        if (Settings.listEnabledHacks.mode != "Off" && !Settings.Hidden.active) {
            if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
            let YLevel = Settings.listEnabledHacks.mode == 'Bottom Left' ? document[defaultViewString]['innerHeight'] - 25 : 25;
            for (let hack in Settings) {
                if ((Settings[hack].active && Settings[hack].bind)) {
                    ctx.save();
                    ctx.font = '18px Baloo Paaji';
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 7;
                    ctx.fillStyle = !Settings.darkMode ? 'white' : '#BBB';
                    ctx.strokeText(hack, 15, YLevel);
                    ctx.fillText(hack, 15, YLevel);
                    ctx.restore();
                    Settings.listEnabledHacks.mode == 'Bottom Left' ? YLevel -= 20 : YLevel += 20;
                };
            };
        };
    }

    function drawScriptVisuals() {
        /* Define Once */
        let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
        /* Defining Player Propertys */
        if (definePlayerProps) {
            for (let i = 0; i < hiddenWorld.Units[ITEMS.PLAYERS].length; i++) {
                let player = hiddenWorld.Units[ITEMS.PLAYERS][i];
                if (definePlayerProps) {
                    definePlayerProps = false;
                    Object.keys(player).forEach((property, index) => {
                        if (index == 1) specialProps.pid = property;
                        if (index == 6) specialProps.nangle = property;
                        if (index == 12) specialProps.speed = property;
                        if (index == 21) specialProps.dist_winter = property;
                        if (index == 31) specialProps.tower = property;
                        if (index == 34) specialProps.fly = property;
                        if (index == 36) specialProps.draw = property;
                        if (index == 37) specialProps.draw_vehicle = property;
                        if (index == 42) specialProps.vehicle_fx5 = property;
                        if (index == 43) specialProps.tower_fx = property;
                        if (index == 44) specialProps.hit = property;
                        if (index == 63) specialProps.vehicle = property;
                        if (index == 65) specialProps.clothe = property;
                        if (index == 66) specialProps.ghost = property;
                        if (typeof player[property] === 'function') specialProps.update = property;
                        if (myPlayer) flyableEquiped = myPlayer[specialProps.vehicle];
                    });
                };
            };
        };
        /* Defining Chest Propertys */
        if (defineAnimationProps || defineChestProps) {
            for (let k = 0; hiddenWorld.Units[ITEMS.CHEST].length > k; k++) {
                let chest = hiddenWorld.Units[ITEMS.CHEST][k];
                /* Animation Propertys */
                if (defineAnimationProps) {
                    Object.keys(chest[specialProps.hit]).forEach((property, index) => {
                        if (index == 0) {
                            specialProps.anim = property;
                            Object.keys(chest[specialProps.hit][specialProps.anim]).forEach((property, index) => {
                                if (index == 0) specialProps.o = property;
                                if (index == 1) specialProps.v = property;
                                defineAnimationProps = false;
                            });
                        };
                    });
                };
                /* Chest Propertys */
                if (defineChestProps) {
                    if (hiddenGame.ChestButtons[chest.action / 2 - 1] && hiddenGame.ChestButtons[chest.action / 2 - 1].info) {
                        Object.keys(hiddenGame.ChestButtons[chest.action / 2 - 1].info).forEach((property, index) => {
                            if (index == 2) {
                                specialProps.img = property;
                                Object.keys(hiddenGame.ChestButtons[chest.action / 2 - 1].info[specialProps.img][0]).forEach((property, index) => {
                                    if (index == 3) { specialProps.src = property; defineChestProps = false; };
                                });
                            };
                        });
                    };
                };
            };
        };
        /* Defining Roof Propertys */
        if (defineRoofProps) {
            for (let j = 0, roofs = [...hiddenWorld.Units[ITEMS.ROOF]], len = roofs.length; j < len; j++) {
                let roof = roofs[j];
                if (roof) {
                    /* Animation Propertys */
                    Object.keys(roof).forEach((property, index) => {
                        if (index == 15) specialProps.j = property;
                        if (index == 16) specialProps.i = property;
                        if (index == 18) specialProps.opacity = property;
                        defineRoofProps = false;
                    });
                    Object.keys(roof[specialProps.hit]).forEach((property, index) => {
                        if (index == 0) {
                            specialProps.anim = property;
                            Object.keys(roof[specialProps.hit][specialProps.anim]).forEach((property, index) => {
                                if (index == 0) specialProps.o = property;
                                if (index == 1) specialProps.v = property;
                                defineAnimationProps = false;
                            });
                        };
                    });
                };
            };
        };
        /* Smooth Or Opaque Roofs */
        if (Settings.smoothRoofs || Settings.Roof.active) {
            /* Modify Draw Call For Roof */
            for (let j = 0, roofs = [...hiddenWorld.Units[ITEMS.ROOF]], len = roofs.length; j < len; j++) {
                let roof = roofs[j];
                if (!roof.checked) { try { if (!savedFunctions.drawRoof) savedFunctions.drawRoof = roof[specialProps.draw]; roof[specialProps.draw] = function (args) { if (!Settings.Hidden.active && (Settings.smoothRoofs || Settings.Roof.active)) return drawRoof(roof); else savedFunctions.drawRoof.call(this, args); }; roof.checked = true; } catch (err) { savedLog('Failed To Bind Roof Drawing', err); }; };
            };
        };
        if (Settings.ColoredSpikes.active) {
            try {
                for (let j = 0, doors = [...hiddenWorld.Units[ITEMS.WOOD_DOOR], ...hiddenWorld.Units[ITEMS.STONE_DOOR], ...hiddenWorld.Units[ITEMS.GOLD_DOOR], ...hiddenWorld.Units[ITEMS.DIAMOND_DOOR], ...hiddenWorld.Units[ITEMS.AMETHYST_DOOR], ...hiddenWorld.Units[ITEMS.REIDITE_DOOR], ...hiddenWorld.Units[ITEMS.WOOD_DOOR_SPIKE], ...hiddenWorld.Units[ITEMS.STONE_DOOR_SPIKE], ...hiddenWorld.Units[ITEMS.GOLD_DOOR_SPIKE], ...hiddenWorld.Units[ITEMS.DIAMOND_DOOR_SPIKE], ...hiddenWorld.Units[ITEMS.AMETHYST_DOOR_SPIKE], ...hiddenWorld.Units[ITEMS.REIDITE_DOOR_SPIKE]], len = doors.length; j < len; j++) {
                    let door = doors[j];
                    if (door) {
                        /* Animation Propertys */
                        if (defineAnimationProps) {
                            Object.keys(door[specialProps.hit]).forEach((property, index) => {
                                if (index == 0) {
                                    specialProps.anim = property;
                                    Object.keys(door[specialProps.hit][specialProps.anim]).forEach((property, index) => {
                                        if (index == 0) specialProps.o = property;
                                        if (index == 1) specialProps.v = property;
                                        defineAnimationProps = false;
                                    });
                                };
                            });
                        };
                        /* Modify Draw Call For Doors */
                        if (!door.checked) { try { if (!savedFunctions.drawDoor) savedFunctions.drawDoor = door[specialProps.draw]; door[specialProps.draw] = function (args) { if (Settings.ColoredSpikes.active && !(door.info & 1) && !Settings.Hidden.active) return drawDoor(door); else return savedFunctions.drawDoor.call(this, args); }; door.checked = true; } catch (err) { savedLog('Failed To Bind Door Drawing', err); }; };
                    };
                };
            } catch (err) { savedLog('Failed To Define Door Drawing', err); };
            try {
                for (let j = 0, spikes = [...hiddenWorld.Units[ITEMS.SPIKE], ...hiddenWorld.Units[ITEMS.STONE_SPIKE], ...hiddenWorld.Units[ITEMS.GOLD_SPIKE], ...hiddenWorld.Units[ITEMS.DIAMOND_SPIKE], ...hiddenWorld.Units[ITEMS.AMETHYST_SPIKE], ...hiddenWorld.Units[ITEMS.REIDITE_SPIKE]], len = spikes.length; j < len; j++) {
                    let spike = spikes[j];
                    if (spike) {
                        /* Animation Propertys */
                        if (defineAnimationProps) {
                            Object.keys(spike[specialProps.hit]).forEach((property, index) => {
                                if (index == 0) {
                                    specialProps.anim = property;
                                    Object.keys(spike[specialProps.hit][specialProps.anim]).forEach((property, index) => {
                                        if (index == 0) specialProps.o = property;
                                        if (index == 1) specialProps.v = property;
                                        defineAnimationProps = false;
                                    });
                                };
                            });
                        };
                        /* Modify Draw Call For Spikes */
                        if (!spike.checked) { try { if (!savedFunctions.drawSpike) savedFunctions.drawSpike = spike[specialProps.draw]; spike[specialProps.draw] = function (args) { if (Settings.ColoredSpikes.active && !Settings.Hidden.active) return drawSpike(spike); else return savedFunctions.drawSpike.call(this, args); }; spike.checked = true; } catch (err) { savedLog('Failed To Bind Spike Drawing', err); }; };
                    };
                };
            } catch (err) { savedLog('Failed To Define Spike Drawing'); };
        };
        /* Building Info */
        if (Settings.buildingInfo) {
            try {
                for (let j = 0, extractors = [...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_STONE], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_GOLD], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_DIAMOND], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_AMETHYST], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_REIDITE], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_EMERALD], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_COPPER], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_IRON], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_TOPAZ], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_SAPPHIRE], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_JADE], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_RUBY], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_COAL], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_AQUAMARINE]], len = extractors.length; j < len; j++) {
                    let extractor = extractors[j];
                    if (extractor) {
                        /* Update Extractor Info */
                        if (!extractor.img) { extractor.img = new createText(90, 90, 1); if (extractor.info) extractor.img.drawText(extractor.info, 18, "black"); extractor[specialProps.update] = function () { if (extractor.info) extractor.img.drawText(extractor.info, 18, "black"); }; };
                        /* Draw Extractor Info */
                        if (extractor.info) { ctx.save(); ctx.drawImage(extractor.img.canvas, hiddenUser.Cam.x + extractor.x - 30, hiddenUser.Cam.y + extractor.y - 40); ctx.restore(); };
                    };
                };
            } catch (err) { savedLog('Failed To Draw Extractor Building Info', err); }
            try {
                for (let j = 0, breadOvens = hiddenWorld.Units[ITEMS.BREAD_OVEN], len = breadOvens.length; j < len; j++) {
                    let oven = breadOvens[j];
                    if (oven) {
                        /* Update Oven Info */
                        if (!oven.img) { oven.img = new createText(90, 90, 2); if (oven.info) oven.img.drawText(oven.info, 18, "black"); oven[specialProps.update] = function () { if (oven.info) oven.img.drawText(oven.info, 18, "black"); }; };
                        /* Draw Oven Info */
                        if (oven.info) { ctx.save(); ctx.drawImage(oven.img.canvas, hiddenUser.Cam.x + oven.x - 33, hiddenUser.Cam.y + oven.y - 47); ctx.restore(); };
                    };
                };
            } catch (err) { savedLog('Failed To Draw Bread Oven Building Info', err); }
            try {
                for (let j = 0, totems = hiddenWorld.Units[ITEMS.TOTEM], len = totems.length; j < len; j++) {
                    let totem = totems[j];
                    if (totem) {
                        /* Update Totem Info */
                        if (!totem.img) { totem.img = new createText(200, 100, 3); if (totem.info) totem.img.drawText(['[' + Object.values(hiddenWorld.Players[totem[specialProps.pid]])[0] + ']', totem.info], 18, "black"); totem[specialProps.update] = function () { if (totem.info) totem.img.drawText(['[' + Object.values(hiddenWorld.Players[totem[specialProps.pid]])[0] + ']', totem.info], 18, "black"); }; };
                        /* Draw Totem Info */
                        if (totem.info) { ctx.save(); ctx.drawImage(totem.img.canvas, hiddenUser.Cam.x + totem.x - 45, hiddenUser.Cam.y + totem.y - 45); ctx.restore(); };
                    };
                };
            } catch (err) { savedLog('Failed To Draw Totem Building Info', err); }
            try {
                for (let j = 0, windmills = hiddenWorld.Units[ITEMS.WINDMILL], len = windmills.length; j < len; j++) {
                    let windmill = windmills[j];
                    if (windmill) {
                        /* Update Windmill Info */
                        if (!windmill.img) { windmill.img = new createText(90, 90, 1); if (windmill.info) windmill.img.drawText(windmill.info, 18, "black"); windmill[specialProps.update] = function () { if (windmill.info) windmill.img.drawText(windmill.info, 18, "black"); }; };
                        /* Draw Windmill Info */
                        if (windmill.info) {
                            ctx.save(); ctx.drawImage(windmill.img.canvas, hiddenUser.Cam.x + windmill.x - 30, hiddenUser.Cam.y + windmill.y - 40); ctx.restore();
                        };
                    };
                };
            } catch (err) { savedLog('Failed To Draw Windmill Building Info', err); }
            try {
                for (let j = 0, furnaces = hiddenWorld.Units[ITEMS.FURNACE], len = furnaces.length; j < len; j++) {
                    let furnace = furnaces[j];
                    if (furnace) {
                        /* Update Furnace Info */
                        if (!furnace.img) { furnace.img = new createText(90, 70, 4); if (furnace.info) { furnace.img.drawText(furnace.info, 18, "black", "furnace"); }; let originalUpdate = furnace[specialProps.update]; furnace[specialProps.update] = function () { if (furnace.info) { furnace.img.drawText(furnace.info, 18, "black", "furnace"); }; return originalUpdate.apply(this, arguments); }; };
                        /* Draw Furnace Info */
                        if (furnace.info) ctx.save(); ctx.drawImage(furnace.img.canvas, hiddenUser.Cam.x + furnace.x - 30, hiddenUser.Cam.y + furnace.y - 33); ctx.restore();
                    };
                };
            } catch (err) { savedLog('Failed To Draw Furnace Building Info', err); }
            try {
                for (let j = 0, wells = hiddenWorld.Units[ITEMS.WELL], len = wells.length; j < len; j++) {
                    let well = wells[j];
                    if (well) {
                        /* Update Well Info */
                        if (!well.img) { well.img = new createText(90, 70, 4); if (well.info) well.img.drawText(well.info, 18, "black"); well[specialProps.update] = function () { if (well.info) well.img.drawText(well.info, 18, "black"); }; };
                        /* Draw Well Info */
                        if (well.info) { ctx.save(); ctx.drawImage(well.img.canvas, hiddenUser.Cam.x + well.x - 30, hiddenUser.Cam.y + well.y - 33); ctx.restore(); };
                    };
                };
            } catch (err) { savedLog('Failed To Draw Well Well Info', err); }
            try {
                for (let j = 0, machines = hiddenWorld.Units[ITEMS.EMERALD_MACHINE], len = machines.length; j < len; j++) {
                    let machine = machines[j];
                    if (machine) {
                        /* Update Machine Info */
                        if (!machine.img) { machine.img = new createText(200, 60, 0); machine.score = Object.values(hiddenWorld.Players[machine[specialProps.pid]])[13]; machine.img.drawText(['[' + Object.values(hiddenWorld.Players[machine[specialProps.pid]])[0] + ']', Object.values(hiddenWorld.Players[machine[specialProps.pid]])[13] / 1000 + 'k'], 18, "black", "machine"); machine[specialProps.update] = function () { if (machine.info) machine.img.drawText(['[' + Object.values(hiddenWorld.Players[machine[specialProps.pid]])[0] + ']', Object.values(hiddenWorld.Players[machine[specialProps.pid]])[13] / 1000 + 'k'], 18, "black", "machine"); }; };
                        /* Draw Machine Info */
                        if (machine.info) { if (machine.score != Object.values(hiddenWorld.Players[machine[specialProps.pid]])[13]) machine[specialProps.update](); ctx.save(); ctx.drawImage(machine.img.canvas, hiddenUser.Cam.x + machine.x - 55, hiddenUser.Cam.y + machine.y - 35); ctx.restore(); };
                    };
                };
            } catch (err) { savedLog('Failed To Draw Emerald Machine Info', err); }
        };
        /* Draw Chest Info */
        if (Settings.chestInfo.active) {
            for (let k = 0; hiddenWorld.Units[ITEMS.CHEST].length > k; k++) {
                let chest = hiddenWorld.Units[ITEMS.CHEST][k];
                /* Modify Draw Call For Chests */
                if (!chest.checked) { if (!savedFunctions.drawChest) savedFunctions.drawChest = chest[specialProps.draw]; try { chest[specialProps.draw] = function () { if (Settings.chestInfo.active && !Settings.Hidden.active) return; else return savedFunctions.drawChest.call(this); }; chest.checked = true; } catch (err) { savedLog('Failed To Bind Chest Drawing', err); }; };
                /* Draw Chests (Red / Green) */
                try {
                    if (Settings.chestInfo.active) {
                        ctx.save();
                        ctx.translate(hiddenUser.Cam.x + chest.x, hiddenUser.Cam.y + chest.y);
                        ctx.rotate(chest.angle);
                        /* Hit Animations */
                        let x = 0; let y = 0;
                        if (chest[specialProps.hit][specialProps.update]) { if (chest[specialProps.hit][specialProps.anim][specialProps.update]() && chest[specialProps.hit][specialProps.anim][specialProps.o] == false) chest[specialProps.hit][specialProps.update] = false; let v = (1 - chest[specialProps.hit][specialProps.anim][specialProps.v]) * delta * 600; x = Math.cos(chest[specialProps.hit].angle - chest.angle) * v; y = Math.sin(chest[specialProps.hit].angle - chest.angle) * v; };
                        let chestImage = chest.lock ? chestEnemy : chestAlly;
                        ctxDrawImage(ctx, chestImage, chestImage.width / 2 + x, chestImage.height / 2 + y, -chestImage.width, -chestImage.height);
                        ctx.restore();
                    };
                } catch (err) { savedLog('Failed To Draw Ally Chest Images', err); }
                /* Draw Chest Images */
                if (chest.action && chest.info && Settings.chestInfo.active) {
                    try {
                        ctx.save();
                        ctx.globalAlpha = 0.9;
                        let image = hiddenGame.ChestButtons[chest.action / 2 - 1] ? hiddenGame.ChestButtons[chest.action / 2 - 1].info[specialProps.img][0] : false;
                        if (image && image.src) {
                            ctxDrawImage(ctx, image, hiddenUser.Cam.x + chest.x + 25, hiddenUser.Cam.y + chest.y + 15, -hiddenGame.ChestButtons[chest.action / 2 - 1].info.width + 25, -hiddenGame.ChestButtons[chest.action / 2 - 1].info.height + 25);
                            ctx.globalAlpha = 1;
                            ctx.font = '18px Baloo Paaji';
                            ctx.strokeStyle = "black";
                            ctx.lineWidth = 7;
                            ctx.strokeText("x" + chest.info, hiddenUser.Cam.x + chest.x - 32, hiddenUser.Cam.y + chest.y + 20);
                            ctx.fillStyle = !Settings.darkMode ? 'white' : '#BBB';
                            ctx.fillText("x" + chest.info, hiddenUser.Cam.x + chest.x - 32, hiddenUser.Cam.y + chest.y + 20);
                        } else {
                            /* Fix Image Loading Issues */
                            if (!hiddenGame.ChestButtons[chest.action / 2 - 1]) continue;
                            let img = new Image();
                            img.src = hiddenGame.ChestButtons[chest.action / 2 - 1].info[specialProps.img][0][specialProps.src];
                            hiddenGame.ChestButtons[chest.action / 2 - 1].info[specialProps.img][0] = img;
                        };
                        ctx.restore();
                    } catch (err) { savedLog('Failed To Draw Chest Images', err); };
                };
            };
        };
        /* Draw Fire Info */
        if (Settings.fireInfo) {
            try {
                for (let j = 0, Fires = [...hiddenWorld.Units[ITEMS.FIRE], ...hiddenWorld.Units[ITEMS.BIG_FIRE]], len = Fires.length; j < len; j++) {
                    let fire = Fires[j];

                    if (fire) {
                        if (!fire.time && fire.time != 0) (fire.type === ITEMS.BIG_FIRE ? fire.time = 360 : fire.type === ITEMS.FIRE && fire.info === 0 ? fire.time = 120 : fire.time = 120, workerTimers.setInterval(() => { fire.time = (fire.time - 0.1).toFixed(1); }, 100));

                        ctx.save();
                        ctx.font = '18px Baloo Paaji';
                        ctx.strokeStyle = 'black';
                        ctx.lineWidth = 7;
                        ctx.textAlign = "center";
                        ctx.strokeText(fire.time + "s", hiddenUser.Cam.x + fire.x, hiddenUser.Cam.y + fire.y + 5);
                        ctx.fillStyle = !Settings.darkMode ? 'white' : '#BBB';
                        ctx.fillText(fire.time + "s", hiddenUser.Cam.x + fire.x, hiddenUser.Cam.y + fire.y + 5);
                        ctx.restore();
                    };
                };
            } catch (err) { savedLog('Failed To Draw Fire Info', err); };
        };
        /* Draw Box Info */
        if (Settings.boxInfo) {
            for (let i = 0; arrayOfCratesToDraw.length > i; i++) { let crate = arrayOfCratesToDraw[i]; crate[0](crate[1], crate[2]); };
            if (arrayOfCratesToDraw.length) arrayOfCratesToDraw = [];
            try {
                for (let j = 0, boxes = [...hiddenWorld.Units[ITEMS.DEAD_BOX], ...hiddenWorld.Units[ITEMS.CRATE], ...hiddenWorld.Units[ITEMS.GIFT]], len = boxes.length; j < len; j++) {
                    let box = boxes[j];
                    if (!box.checked) { if (!savedFunctions.drawCrate) savedFunctions.drawCrate = box[specialProps.draw]; try { box[specialProps.draw] = function (id, _hurt) { if (Settings.boxInfo && !Settings.Hidden.active) return arrayOfCratesToDraw.push([savedFunctions.drawCrate.bind(box), id, _hurt]); else return savedFunctions.drawCrate.call(this, id, _hurt); }; box.checked = true; } catch (err) { savedLog('Failed To Bind Box Drawing', err); }; };
                    if (box) {
                        /* Animal Dead Boxes (Skins Can Ruin This And Updates With New IDS) */
                        let animalSkin;
                        if (box.type === ITEMS.DEAD_BOX && (box.info == 55 || box.info == 56 || box.info == 57 || box.info == 72 || box.info == 58 || box.info == 74 || box.info == 64 || box.info == 66 || box.info == 65 || box.info == 63 || box.info == 73 || box.info == 71 || box.info == 68 || box.info == 60 || box.info == 59 || box.info == 62 || box.info == 61 || box.info == 69 || box.info == 67 || box.info == 70 || box.info == 75 || box.info == 82 || box.info == 83 || box.info == 83 || box.info == 79 || box.info == 80 || box.info == 81)) {
                            animalSkin = true;
                        } else {
                            animalSkin = false;
                        }
                        if (!box.time && box.time != 0) (box.type === ITEMS.CRATE ? box.time = 16 : box.type === ITEMS.GIFT ? box.time = 500 : box.type === ITEMS.DEAD_BOX && !animalSkin ? box.time = 240 : box.time = 28, workerTimers.setInterval(() => { box.time = (box.time - 0.1).toFixed(1); }, 100));
                        if (!box.hits && box.hits != 0) box.hits = 0;
                        if (box.action != 0 && !box.hitActive) { box.hits++; box.hitActive = 1; } else if (box.action == 0) box.hitActive = 0;
                        ctx.save();
                        ctx.font = '18px Baloo Paaji';
                        ctx.strokeStyle = 'black';
                        ctx.lineWidth = 7;
                        ctx.textAlign = "center";
                        ctx.strokeText(box.type === ITEMS.CRATE ? 'Drop Box' : box.type === ITEMS.GIFT ? "Gift Box" : box.type === ITEMS.DEAD_BOX && !animalSkin ? "Dead Box" : "Animal Box", hiddenUser.Cam.x + box.x, hiddenUser.Cam.y + box.y - 10); ctx.strokeText('Hits: ' + box.hits, hiddenUser.Cam.x + box.x, hiddenUser.Cam.y + box.y + 10);
                        ctx.strokeText('Time: ' + box.time + "s", hiddenUser.Cam.x + box.x, hiddenUser.Cam.y + box.y + 30);
                        ctx.fillStyle = !Settings.darkMode ? 'white' : '#BBB';
                        ctx.fillText(box.type === ITEMS.CRATE ? 'Drop Box' : box.type === ITEMS.GIFT ? "Gift Box" : box.type === ITEMS.DEAD_BOX && !animalSkin ? "Dead Box" : "Animal Box", hiddenUser.Cam.x + box.x, hiddenUser.Cam.y + box.y - 10);
                        ctx.fillText('Hits: ' + box.hits, hiddenUser.Cam.x + box.x, hiddenUser.Cam.y + box.y + 10);
                        ctx.fillText('Time: ' + box.time + "s", hiddenUser.Cam.x + box.x, hiddenUser.Cam.y + box.y + 30);
                        ctx.restore();
                    };
                };
            } catch (err) { savedLog('Failed To Draw Box Info', err); };
        };
        /* Draw PlayerOnTop */
        if (Settings.playersOnTop || Settings.playerTracers) {

            /* Draw Vehicles */
            if (Settings.playersOnTop) { for (let i = 0; arrayOfVehiclesToDraw.length > i; i++) { let vehicle = arrayOfVehiclesToDraw[i]; drawVehicle(vehicle[0], vehicle[1]); }; if (arrayOfVehiclesToDraw.length) arrayOfVehiclesToDraw = []; };
            /* Draw Players */
            if (Settings.playersOnTop) { for (let i = 0; arrayOfPlayersToDraw.length > i; i++) { let player = arrayOfPlayersToDraw[i]; drawPlayerOnTop(player[0], player[1]); drawHoodNames(player[0]); }; if (arrayOfPlayersToDraw.length) arrayOfPlayersToDraw = []; };

            for (let i = 0; i < hiddenWorld.Units[ITEMS.PLAYERS].length; i++) {
                let player = hiddenWorld.Units[ITEMS.PLAYERS][i];
                /* Player Function Binding */
                if (!player.checked) {
                    let originalDraw = player[specialProps.draw];
                    let originalDrawVehicle = player[specialProps.draw_vehicle];
                    let originalUpdate = player[specialProps.update];
                    try {
                        player[specialProps.draw] = function () { if (!Settings.Hidden.active) drawHoodNames(player); if (!Settings.playersOnTop || Settings.Hidden.active) { return originalDraw.call(this); } else arrayOfPlayersToDraw.push([player, originalDraw.bind(player)]); };
                        player[specialProps.draw_vehicle] = function () { if (!Settings.playersOnTop || Settings.Hidden.active) return drawVehicleWithoutAnimations(originalDrawVehicle.bind(player)); else arrayOfVehiclesToDraw.push([player, originalDrawVehicle.bind(player)]); };
                        player[specialProps.update] = function () { originalUpdate.call(this); if (player[specialProps.ghost] && ((60 - (Date.now() - player.ghostTime) / 1000).toFixed(1) < 0 || !player.ghostTime)) player.ghostTime = Date.now(); else if (!player[specialProps.ghost]) player.ghostTime = null; }
                        player.checked = true;
                    } catch (err) { savedLog('Failed To Bind Player Functions', err); };
                };
                /* Ghost Timers */
                if (player.ghostTime > 0) {
                    if (myPlayer[specialProps.pid] == player[specialProps.pid]) player.ghostTime = hiddenUser.Ghost.Delay;
                    ctx.save();
                    ctx.font = '30px Baloo Paaji';
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 7;
                    ctx.strokeText((60 - (Date.now() - player.ghostTime) / 1000).toFixed(1), hiddenUser.Cam.x + player.x - 25, hiddenUser.Cam.y + player.y + 20);
                    ctx.fillStyle = !Settings.darkMode ? 'white' : '#BBB';
                    ctx.fillText((60 - (Date.now() - player.ghostTime) / 1000).toFixed(1), hiddenUser.Cam.x + player.x - 25, hiddenUser.Cam.y + player.y + 20);
                    ctx.restore();
                };
                /* Player Tracers */
                if (Settings.playerTracers && myPlayer) {
                    if (myPlayer[specialProps.pid] != player[specialProps.pid]) {
                        ctx.strokeStyle = CheckAlly(player[specialProps.pid]) ? "#66ff00" : "#ff2e2e";
                        ctx.lineWidth = 3.5;
                        ctx.beginPath();
                        ctx.moveTo(hiddenUser.Cam.x + myPlayer.x, hiddenUser.Cam.y + myPlayer.y);
                        ctx.lineTo(hiddenUser.Cam.x + player.x, hiddenUser.Cam.y + player.y);
                        ctx.stroke();
                    };
                };
                if (Settings.playerTimers != 'None' && myPlayer) {
                    /* Set Our Players Timer Interval */
                    if (Settings.playerTimers == 'Enemys') if (CheckAlly(player[specialProps.pid])) continue;
                    if (myPlayer[specialProps.pid] == player[specialProps.pid] && !healTick) playerIntervals[myPlayer[specialProps.pid]] = timerInterval;
                    if (playerIntervals[player[specialProps.pid]]) {
                        /* Reset Timer If Less Than Or Equal To 0 Or Fix Timers After Being Tabbed Out */
                        let timerCalculated = (10 - (Date.now() - playerIntervals[player[specialProps.pid]]) / 1000);
                        while (timerCalculated <= 0) { playerIntervals[player[specialProps.pid]] += 10000; timerCalculated = (10 - (Date.now() - playerIntervals[player[specialProps.pid]]) / 1000); };
                        ctx.save();
                        ctx.font = '25px Baloo Paaji';
                        ctx.strokeStyle = "black";
                        ctx.lineWidth = 7.5;
                        ctx.strokeText(timerCalculated.toFixed(1), hiddenUser.Cam.x + player.x - 15, hiddenUser.Cam.y + player.y + 40);
                        ctx.fillStyle = timerCalculated >= 7.5 ? "#FF0000" : timerCalculated >= 5 ? "#FFA500" : timerCalculated >= 2.5 ? "#FFFF00" : "#00FF00"
                        ctx.fillText(timerCalculated.toFixed(1), hiddenUser.Cam.x + player.x - 15, hiddenUser.Cam.y + player.y + 40);
                        ctx.restore();
                    };
                };
            };
        };

        /* Animal Counters */
        try {
            const animalTypes = [
                { name: "Krakens", setting: "Krakens", units: hiddenWorld.Units[ITEMS.KRAKEN] },
                { name: "Sand Worms", setting: "Sandworms", units: hiddenWorld.Units[ITEMS.SAND_WORM] },
                { name: "Baby Dragons", setting: "BabyDragons", units: hiddenWorld.Units[ITEMS.BABY_DRAGON] },
                { name: "Baby Lavas", setting: "BabyLavaDragons", units: hiddenWorld.Units[ITEMS.BABY_LAVA] },
                { name: "Baby Mammoths", setting: "BabyMammoths", units: hiddenWorld.Units[ITEMS.BABY_MAMMOTH] },
                { name: "Bears", setting: "Bears", units: hiddenWorld.Units[ITEMS.BEAR] },
                { name: "Boars", setting: "Boars", units: hiddenWorld.Units[ITEMS.BOAR] },
                { name: "Crabs", setting: "Crabs", units: hiddenWorld.Units[ITEMS.CRAB] },
                { name: "Dragons", setting: "Dragons", units: hiddenWorld.Units[ITEMS.DRAGON] },
                { name: "Flames", setting: "FireMobs", units: hiddenWorld.Units[ITEMS.FLAME] },
                { name: "Foxs", setting: "Foxes", units: hiddenWorld.Units[ITEMS.FOX] },
                { name: "Hawks", setting: "Hawks", units: hiddenWorld.Units[ITEMS.HAWK] },
                { name: "Crab Boss", setting: "KingCrabs", units: hiddenWorld.Units[ITEMS.CRAB_BOSS] },
                { name: "Lava Dragons", setting: "LavaDragons", units: hiddenWorld.Units[ITEMS.LAVA_DRAGON] },
                { name: "Mammoths", setting: "Mammoths", units: hiddenWorld.Units[ITEMS.MAMMOTH] },
                { name: "Penguins", setting: "Penguins", units: hiddenWorld.Units[ITEMS.PENGUIN] },
                { name: "Piranhas", setting: "Piranhas", units: hiddenWorld.Units[ITEMS.PIRANHA] },
                { name: "Rabbits", setting: "Rabbits", units: hiddenWorld.Units[ITEMS.RABBIT] },
                { name: "Spiders", setting: "Spiders", units: hiddenWorld.Units[ITEMS.SPIDER] },
                { name: "Vultures", setting: "Vultures", units: hiddenWorld.Units[ITEMS.VULTURE] },
                { name: "Wolfs", setting: "Wolfs", units: hiddenWorld.Units[ITEMS.WOLF] },
                { name: "Crocodiles", setting: "Crocodiles", units: hiddenWorld.Units[ITEMS.CROCODILE] },
                { name: "Golden Chickens", setting: "GoldenChickens", units: hiddenWorld.Units[ITEMS.GOLDEN_CHICKEN] },
                { name: "Golden Hens", setting: "GoldenHens", units: hiddenWorld.Units[ITEMS.GOLDEN_HEN] },
                { name: "Ocelots", setting: "Ocelots", units: hiddenWorld.Units[ITEMS.OCELOT] },
                { name: "Parrots", setting: "Parrots", units: hiddenWorld.Units[ITEMS.PARROT] }
            ];
            const startY = window.innerHeight / 2;
            const lineHeight = 25;
            ctx.font = '18px Baloo Paaji';
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            let displayIndex = 0;
            for (let i = 0; i < animalTypes.length; i++) {
                const { name, setting, units } = animalTypes[i];
                if (Settings.Tracers[setting] && units && units.length > 0) {
                    const y = startY + displayIndex * lineHeight;
                    const text = `${name}: ${units.length}`;
                    ctx.save();
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 7;
                    ctx.strokeText(text, 0, y);
                    ctx.fillStyle = !Settings.darkMode ? 'white' : '#BBB';
                    ctx.fillText(text, 0, y);
                    ctx.restore();
                    displayIndex++;
                }
            }
        } catch (err) {
            savedLog('Failed To Draw Tracer Animal Counts', err);
        }

        /* Animal Tracers */
        try {
            if (Settings.Tracers.Krakens && hiddenWorld.Units[ITEMS.KRAKEN]) drawTracers(hiddenWorld.Units[ITEMS.KRAKEN], '#000000');
            if (Settings.Tracers.Sandworms && hiddenWorld.Units[ITEMS.SAND_WORM]) drawTracers(hiddenWorld.Units[ITEMS.SAND_WORM], '#000000');
            if (Settings.Tracers.BabyDragons && hiddenWorld.Units[ITEMS.BABY_DRAGON]) drawTracers(hiddenWorld.Units[ITEMS.BABY_DRAGON], '#949494');
            if (Settings.Tracers.BabyLavaDragons && hiddenWorld.Units[ITEMS.BABY_LAVA]) drawTracers(hiddenWorld.Units[ITEMS.BABY_LAVA], '#660000');
            if (Settings.Tracers.BabyMammoths && hiddenWorld.Units[ITEMS.BABY_MAMMOTH]) drawTracers(hiddenWorld.Units[ITEMS.BABY_MAMMOTH], '#949494');
            if (Settings.Tracers.Bears && hiddenWorld.Units[ITEMS.BEAR]) drawTracers(hiddenWorld.Units[ITEMS.BEAR], '#949494');
            if (Settings.Tracers.Boars && hiddenWorld.Units[ITEMS.BOAR]) drawTracers(hiddenWorld.Units[ITEMS.BOAR], '#007512');
            if (Settings.Tracers.Crabs && hiddenWorld.Units[ITEMS.CRAB]) drawTracers(hiddenWorld.Units[ITEMS.CRAB], '#948f00');
            if (Settings.Tracers.Dragons && hiddenWorld.Units[ITEMS.DRAGON]) drawTracers(hiddenWorld.Units[ITEMS.DRAGON], '#949494');
            if (Settings.Tracers.FireMobs && hiddenWorld.Units[ITEMS.FLAME]) drawTracers(hiddenWorld.Units[ITEMS.FLAME], '#660000');
            if (Settings.Tracers.Foxes && hiddenWorld.Units[ITEMS.FOX]) drawTracers(hiddenWorld.Units[ITEMS.FOX], '#949494');
            if (Settings.Tracers.Hawks && hiddenWorld.Units[ITEMS.HAWK]) drawTracers(hiddenWorld.Units[ITEMS.HAWK], '#007512');
            if (Settings.Tracers.KingCrabs && hiddenWorld.Units[ITEMS.CRAB_BOSS]) drawTracers(hiddenWorld.Units[ITEMS.CRAB_BOSS], '#948f00');
            if (Settings.Tracers.LavaDragons && hiddenWorld.Units[ITEMS.LAVA_DRAGON]) drawTracers(hiddenWorld.Units[ITEMS.LAVA_DRAGON], '#660000');
            if (Settings.Tracers.Mammoths && hiddenWorld.Units[ITEMS.MAMMOTH]) drawTracers(hiddenWorld.Units[ITEMS.MAMMOTH], '#949494');
            if (Settings.Tracers.Penguins && hiddenWorld.Units[ITEMS.PENGUIN]) drawTracers(hiddenWorld.Units[ITEMS.PENGUIN], '#949494');
            if (Settings.Tracers.Piranhas && hiddenWorld.Units[ITEMS.PIRANHA]) drawTracers(hiddenWorld.Units[ITEMS.PIRANHA], '#000c78');
            if (Settings.Tracers.Rabbits && hiddenWorld.Units[ITEMS.RABBIT]) drawTracers(hiddenWorld.Units[ITEMS.RABBIT], '#007512');
            if (Settings.Tracers.Spiders && hiddenWorld.Units[ITEMS.SPIDER]) drawTracers(hiddenWorld.Units[ITEMS.SPIDER], '#007512');
            if (Settings.Tracers.Vultures && hiddenWorld.Units[ITEMS.VULTURE]) drawTracers(hiddenWorld.Units[ITEMS.VULTURE], '#948f00');
            if (Settings.Tracers.Wolfs && hiddenWorld.Units[ITEMS.WOLF]) drawTracers(hiddenWorld.Units[ITEMS.WOLF], '#007512');
            if (Settings.Tracers.Crocodiles && hiddenWorld.Units[ITEMS.CROCODILE]) drawTracers(hiddenWorld.Units[ITEMS.CROCODILE], '#003c12');
            if (Settings.Tracers.GoldenChickens && hiddenWorld.Units[ITEMS.GOLDEN_CHICKEN]) drawTracers(hiddenWorld.Units[ITEMS.GOLDEN_CHICKEN], '#007512');
            if (Settings.Tracers.GoldenHens && hiddenWorld.Units[ITEMS.GOLDEN_HEN]) drawTracers(hiddenWorld.Units[ITEMS.GOLDEN_HEN], '#007512');
            if (Settings.Tracers.Ocelots && hiddenWorld.Units[ITEMS.OCELOT]) drawTracers(hiddenWorld.Units[ITEMS.OCELOT], '#003c12');
            if (Settings.Tracers.Parrots && hiddenWorld.Units[ITEMS.PARROT]) drawTracers(hiddenWorld.Units[ITEMS.PARROT], '#003c12');
        } catch (err) { savedLog('Failed To Draw Animal Tracers', err); };
        /* Movement Predictor And Entity Health */
        if (Settings.movementPredictor) {
            try {
                for (let i = 0, objects = [...hiddenWorld.Units[ITEMS.PARROT], ...hiddenWorld.Units[ITEMS.GOLDEN_HEN], ...hiddenWorld.Units[ITEMS.DEAD_BOX], ...hiddenWorld.Units[ITEMS.TREASURE_CHEST], ...hiddenWorld.Units[ITEMS.CRATE], ...hiddenWorld.Units[ITEMS.PENGUIN], ...hiddenWorld.Units[ITEMS.FOX], ...hiddenWorld.Units[ITEMS.BEAR], ...hiddenWorld.Units[ITEMS.PIRANHA], ...hiddenWorld.Units[ITEMS.CRAB], ...hiddenWorld.Units[ITEMS.FLAME], ...hiddenWorld.Units[ITEMS.LAVA_DRAGON], ...hiddenWorld.Units[ITEMS.BOAR], ...hiddenWorld.Units[ITEMS.CRAB_BOSS], ...hiddenWorld.Units[ITEMS.BABY_DRAGON], ...hiddenWorld.Units[ITEMS.BABY_LAVA], ...hiddenWorld.Units[ITEMS.BABY_MAMMOTH], ...hiddenWorld.Units[ITEMS.MAMMOTH], ...hiddenWorld.Units[ITEMS.PLAYERS], ...hiddenWorld.Units[ITEMS.RABBIT], ...hiddenWorld.Units[ITEMS.SAND_WORM], ...hiddenWorld.Units[ITEMS.WOLF], ...hiddenWorld.Units[ITEMS.SPIDER], ...hiddenWorld.Units[ITEMS.HAWK], ...hiddenWorld.Units[ITEMS.VULTURE], ...hiddenWorld.Units[ITEMS.DRAGON], ...hiddenWorld.Units[ITEMS.KRAKEN]], length = objects.length; i < length; ++i) {
                    let entity = objects[i];
                    if (entity.x != entity.r.x || entity.y != entity.r.y) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.lineWidth = 3.5;
                        ctx.moveTo(hiddenUser.Cam.x + entity.x, hiddenUser.Cam.y + entity.y);
                        ctx.lineTo(hiddenUser.Cam.x + entity.r.x, hiddenUser.Cam.y + entity.r.y);
                        ctx.strokeStyle = "#ff2e2e";
                        ctx.stroke();
                        ctx.restore();
                    };
                };
            } catch (err) { savedLog('Failed To Draw Entity Health Or Movement Predictor Info', err); };
        };
        /* Debugger */
        if (Settings.Debugger.mode != "None") {
            try {
                ctx.save();
                ctx.font = '18px Baloo Paaji';
                ctx.strokeStyle = "black";
                ctx.lineWidth = 4;
                ctx.fillStyle = !Settings.darkMode ? 'white' : '#BBB';
                ctx.globalAlpha = 0.8
                for (let i = 0; i < hiddenWorld.Units.length; i++) {
                    let entitylist = hiddenWorld.Units[i];
                    if (typeof entitylist == "object") {
                        if (entitylist.length == 0) continue;
                        for (let q = 0; q < entitylist.length; q++) {
                            let entity = entitylist[q];
                            /* Ignore Roofs And Bridges */
                            if (Settings.Debugger.mode == "No Roofs/Bridges") if (entity.type == 30) continue;
                            if (Settings.Debugger.mode == "No Roofs/Bridges") if (entity.type == 38) continue
                            let x = hiddenUser.Cam.x + entity.x - 150;
                            let y1 = hiddenUser.Cam.y + entity.y - 30 + 15;
                            let y = hiddenUser.Cam.y + entity.y - 30;
                            if (Settings.Debugger.mode == "All" || Settings.Debugger.mode == "No Roofs/Bridges") {
                                if (entity.type != 0) ctx.strokeText(Object.values(hiddenWorld.Players[entity[specialProps.pid]])[0], x + 100, y);
                                if (entity.type != 0) ctx.fillText(Object.values(hiddenWorld.Players[entity[specialProps.pid]])[0], x + 100, y);
                                if (entity.type == 0) ctx.strokeText('ID: ' + entity[specialProps.pid], x + 100, y1);
                                if (entity.type == 0) ctx.fillText('ID: ' + entity[specialProps.pid], x + 100, y1);
                                if (entity.type == 0) ctx.strokeText('X: ' + entity.x, x + 100, y1 + 15);
                                if (entity.type == 0) ctx.fillText('X: ' + entity.x, x + 100, y1 + 15);
                                if (entity.type == 0) ctx.strokeText('Y: ' + entity.y, x + 100, y1 + 30);
                                if (entity.type == 0) ctx.fillText('Y: ' + entity.y, x + 100, y1 + 30);
                                if (entity.type != 0 && entity[specialProps.pid] != 0) ctx.strokeText('ID: ' + entity[specialProps.pid], x + 100, y1);
                                if (entity.type != 0 && entity[specialProps.pid] != 0) ctx.fillText('ID: ' + entity[specialProps.pid], x + 100, y1);
                                if (entity.type != 0) ctx.strokeText('Type: ' + entity.type, x + 100, y1 + 15);
                                if (entity.type != 0) ctx.fillText('Type: ' + entity.type, x + 100, y1 + 15);
                            } else {
                                ctx.lineWidth = 10;
                                if (entity[specialProps.pid] < 10) {
                                    if (entity.type == 0) ctx.strokeText(entity[specialProps.pid], x + 145, y1 + 22);
                                    if (entity.type == 0) ctx.fillText(entity[specialProps.pid], x + 145, y1 + 22);
                                } else {
                                    if (entity.type == 0) ctx.strokeText(entity[specialProps.pid], x + 139, y1 + 22);
                                    if (entity.type == 0) ctx.fillText(entity[specialProps.pid], x + 139, y1 + 22);
                                };
                            };
                        };
                    };
                };
                ctx.restore();
            } catch (err) { savedLog('Failed To Use Debugger', err); };
        };
        if (Settings.blizzardAndSandstorm || Limit.I.canvas) {
            ctx.save();
            let y = 0;
            if (hiddenUser.AutoFood.enabled) y += 70;
            if (specialProps.bandage > 0) y += 70;
            if (specialProps.blizzard == 1) y += 70;
            else if (hiddenUser.Gauges.Temp < 0.25 || hiddenUser.Gauges.Food < 0.25 || hiddenUser.Gauges.Water < 0.25 || hiddenUser.Gauges.Air < 0.25 || hiddenUser.Gauges.Heat < 0.25) y += 70;
            if (hiddenUser.Winter.Tempest && Settings.blizzardAndSandstorm) { if (blizzard.naturalWidth) { ctx.drawImage(blizzard, hiddenUser.AutoFood.translate.x, hiddenUser.AutoFood.translate.y + y); y += 70; }; };
            if (hiddenUser.Desert.Tempest && Settings.blizzardAndSandstorm) { if (sandstorm.naturalWidth) { ctx.drawImage(sandstorm, hiddenUser.AutoFood.translate.x, hiddenUser.AutoFood.translate.y + y); y += 70; }; };
            /* Limit */ if (Limit.I.canvas) { ctx.drawImage(Limit.I.canvas, hiddenUser.AutoFood.translate.x, hiddenUser.AutoFood.translate.y + y); if (Limit.L) y += 50; };
            let Bed = hiddenWorld.Units[ITEMS.BED];
            if (Bed.length) {
                if (myPlayer) {
                    try {
                        for (let i = 0; i < Bed.length; i++) {
                            let distance = DistanceToObj(myPlayer, Bed[i])
                            if (distance) {
                                if (distance <= 35 || distance <= 36 && inBedDetected) {
                                    ctx.font = '30px Baloo Paaji';
                                    ctx.strokeStyle = "black";
                                    ctx.lineWidth = 7;
                                    ctx.strokeText('B', hiddenUser.AutoFood.translate.x + 20, hiddenUser.AutoFood.translate.y + y + 20);
                                    ctx.fillStyle = !Settings.darkMode ? 'white' : '#BBB';
                                    ctx.fillText('B', hiddenUser.AutoFood.translate.x + 20, hiddenUser.AutoFood.translate.y + y + 20);
                                    /* Break Loop To Prevent Looping Through Incase There Is Alot Of Beds */
                                    break;
                                };
                            };
                        };
                    } catch (err) { savedLog('Failed To Show Bed Info', err); };
                };
            };
            ctx.restore();
        };
        /* Fps Visual */
        if (Settings.fpsDisplay) {
            ctx.save();
            ctx.font = '30px Baloo Paaji';
            ctx.lineWidth = !Settings.darkMode ? 7 : 7.5;
            ctx.strokeStyle = 'black';
            ctx.strokeText(fpsData, hiddenUser.AutoFood.translate.x + -120, hiddenUser.AutoFood.translate.y + -50);
            ctx.fillStyle = !Settings.darkMode ? 'white' : '#BBB';
            ctx.fillText(fpsData, hiddenUser.AutoFood.translate.x + -120, hiddenUser.AutoFood.translate.y + -50);
            ctx.restore();
        };
        /* Ping Visual */
        if (Settings.pingDisplay && currentPing) {
            ctx.save();
            ctx.font = '30px Baloo Paaji';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = !Settings.darkMode ? 7 : 7.5;
            ctx.strokeText(currentPing + 'ms', hiddenUser.AutoFood.translate.x + -120, hiddenUser.AutoFood.translate.y + (Settings.fpsDisplay ? -20 : -50));
            ctx.fillStyle = !Settings.darkMode ? 'white' : '#BBB';
            ctx.fillText(currentPing + 'ms', hiddenUser.AutoFood.translate.x + -120, hiddenUser.AutoFood.translate.y + (Settings.fpsDisplay ? -20 : -50));
            ctx.restore();
        };
        /* Days Alive */
        if (Settings.daysAlive) {
            ctx.save();
            ctx.font = '30px Baloo Paaji';
            ctx.lineWidth = !Settings.darkMode ? 7 : 7.5;
            ctx.strokeStyle = 'black';
            ctx.strokeText(`${hiddenUser.Days} Day${hiddenUser.Days > 1 ? "s" : ""}`, hiddenUser.AutoFood.translate.x + -120, hiddenUser.AutoFood.translate.y + 10 + (Settings.fpsDisplay ? 0 : -30) + (Settings.pingDisplay && currentPing ? 0 : -30));
            ctx.fillStyle = !Settings.darkMode ? 'white' : '#BBB';
            ctx.fillText(`${hiddenUser.Days} Day${hiddenUser.Days > 1 ? "s" : ""}`, hiddenUser.AutoFood.translate.x + -120, hiddenUser.AutoFood.translate.y + 10 + (Settings.fpsDisplay ? 0 : -30) + (Settings.pingDisplay && currentPing ? 0 : -30));
            ctx.restore();
        };
        /* Time Played */
        if (Settings.timePlayed.active) {
            ctx.save();
            ctx.font = '30px Baloo Paaji';
            ctx.lineWidth = !Settings.darkMode ? 7 : 7.5;
            ctx.strokeStyle = 'black';
            ctx.strokeText(createSimpleTime(Math.round((Date.now() - Settings.timePlayed.start) / 1000)), hiddenUser.AutoFood.translate.x + -120, hiddenUser.AutoFood.translate.y + 40 + (Settings.fpsDisplay ? 0 : -30) + (Settings.pingDisplay && currentPing ? 0 : -30) + (Settings.daysAlive ? 0 : -30));
            ctx.fillStyle = !Settings.darkMode ? 'white' : '#BBB';
            ctx.fillText(createSimpleTime(Math.round((Date.now() - Settings.timePlayed.start) / 1000)), hiddenUser.AutoFood.translate.x + -120, hiddenUser.AutoFood.translate.y + 40 + (Settings.fpsDisplay ? 0 : -30) + (Settings.pingDisplay && currentPing ? 0 : -30) + (Settings.daysAlive ? 0 : -30));
            ctx.restore();
        };
        /* Position Timers And Percentages Correctly */
        let yPos = (hiddenUser.Inv.CanSelect.length > 0) ? -75 : 0; if (hiddenUser.Chest.open || (hiddenUser.Furnace.open && -1 != hiddenUser.Inv.FindItem(INV.WOOD)) || (hiddenUser.Windmill.open && -1 != hiddenUser.Inv.FindItem(INV.WILD_WHEAT)) || (hiddenUser.Extractor.open && -1 != hiddenUser.Inv.FindItem(INV.WOOD)) || (hiddenUser.Well.open && -1 != hiddenUser.Inv.FindItem(INV.BUCKET_FULL)) || (hiddenUser.BreadOven.open && (-1 != hiddenUser.Inv.FindItem(INV.WOOD) || -1 != hiddenUser.Inv.FindItem(INV.FLOUR)))) yPos -= 50;
        /* Draw Timer */
        if (Settings.gaugeTimer) {
            ctx.save();
            ctx.translate((globalDocument.documentElement.clientWidth - 950) / 2, yPos);
            ctx.font = '30px Baloo Paaji';
            ctx.strokeStyle = "black";
            ctx.lineWidth = !Settings.darkMode ? 5 : 7.5;
            ctx.strokeText((5 - (Date.now() - timerInterval) / 1000).toFixed(1), hiddenGame.Gauges.translate.x + 455, hiddenGame.Gauges.translate.y + 35);
            ctx.fillStyle = healTick ? "#54a34e" : "red";
            ctx.fillText((5 - (Date.now() - timerInterval) / 1000).toFixed(1), hiddenGame.Gauges.translate.x + 455, hiddenGame.Gauges.translate.y + 35);
            ctx.restore();
        };
        /* Draw Percentages */
        if (Settings.gaugePercentages) {
            ctx.save();
            ctx.translate((globalDocument.documentElement.clientWidth - 950) / 2, yPos);
            ctx.font = '30px Baloo Paaji';
            ctx.strokeStyle = !Settings.darkMode ? "#c12819" : 'black';
            ctx.lineWidth = !Settings.darkMode ? 5 : 7.5;
            ctx.strokeText(Math.floor(hiddenUser.Gauges.Food * 100) + '%', 345, hiddenGame.Gauges.translate.y + 10);
            ctx.fillStyle = !Settings.darkMode ? 'white' : '#c12819';
            ctx.fillText(Math.floor(hiddenUser.Gauges.Food * 100) + '%', 345, hiddenGame.Gauges.translate.y + 10);
            ctx.font = '30px Baloo Paaji';
            ctx.strokeStyle = !Settings.darkMode ? (Math.floor(hiddenUser.Gauges.Temp * 100) + (100 - Math.floor(hiddenUser.Gauges.Heat * 100))) <= 100 ? "#4f9db2" : "#9c4036" : 'black';
            ctx.strokeText((Math.floor(hiddenUser.Gauges.Temp * 100) + (100 - Math.floor(hiddenUser.Gauges.Heat * 100))) + '%', 575, hiddenGame.Gauges.translate.y + 10);
            ctx.fillStyle = !Settings.darkMode ? 'white' : "#4f9db2";
            ctx.fillText((Math.floor(hiddenUser.Gauges.Temp * 100) + (100 - Math.floor(hiddenUser.Gauges.Heat * 100))) + '%', 575, hiddenGame.Gauges.translate.y + 10);
            ctx.font = '30px Baloo Paaji';
            ctx.strokeStyle = !Settings.darkMode ? "#004b87" : 'black';
            ctx.strokeText(Math.floor(hiddenUser.Gauges.Water * 100) + '%', 805, hiddenGame.Gauges.translate.y + 10);
            ctx.fillStyle = !Settings.darkMode ? 'white' : '#004b87';
            ctx.fillText(Math.floor(hiddenUser.Gauges.Water * 100) + '%', 805, hiddenGame.Gauges.translate.y + 10);
            ctx.font = '30px Baloo Paaji';
            ctx.strokeStyle = !Settings.darkMode ? "#54a34e" : 'black';
            ctx.strokeText(Math.floor(hiddenUser.Gauges.Health * 100) + '%', 95, hiddenGame.Gauges.translate.y + 10);
            ctx.fillStyle = !Settings.darkMode ? 'white' : '#54a34e';
            ctx.fillText(Math.floor(hiddenUser.Gauges.Health * 100) + '%', 95, hiddenGame.Gauges.translate.y + 10);
            if (Math.floor(hiddenUser.Gauges.Air * 100) != 100) {
                ctx.font = '30px Baloo Paaji';
                ctx.strokeStyle = !Settings.darkMode ? "#004b87" : 'black';
                ctx.strokeText(Math.floor(hiddenUser.Gauges.Air * 100) + '%', 465, hiddenGame.Gauges.translate.y - 30);
                ctx.fillStyle = !Settings.darkMode ? 'white' : '#4f9db2';
                ctx.fillText(Math.floor(hiddenUser.Gauges.Air * 100) + '%', 465, hiddenGame.Gauges.translate.y - 30);
            };
            ctx.restore();
        };
        /* Aimbot Range Drawing */
        if (Settings.Aimbot.active && Settings.Aimbot.rangeVisual) {
            let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
            if (!myPlayer) return;
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.lineWidth = 3.5;
            const PI = Math.PI * 2
            /* Swords */
            ctx.strokeStyle = distanceToTarget <= 133 ? "#54a34e" : "red";
            ctx.beginPath();
            ctx.arc(hiddenUser.Cam.x + myPlayer.x, hiddenUser.Cam.y + myPlayer.y, 133, 0, PI);
            ctx.stroke();
            /* Spears */
            ctx.strokeStyle = distanceToTarget <= 203 ? "#54a34e" : "red";
            ctx.beginPath();
            ctx.arc(hiddenUser.Cam.x + myPlayer.x, hiddenUser.Cam.y + myPlayer.y, 203, 0, PI);
            ctx.stroke();

            if (holdingWeapon(myPlayer.right) == 6) {
                ctx.strokeStyle = distanceToTarget <= Settings.BowRange ? "#54a34e" : "red";
                ctx.beginPath();
                ctx.arc(hiddenUser.cam.x + myPlayer.x, hiddenUser.cam.y + myPlayer.y, Settings.BowRange, 0, PI);
                ctx.stroke();
            };
            ctx.restore();
        };
        /* Joins And Leaves */
        if (Settings.joinsLeaves) {
            let joinedpeople = 400;
            if (JoinLeave.newPlayerToggle) {
                ctx.save();
                ctx.font = '18px Baloo Paaji';
                ctx.strokeStyle = "black";
                ctx.lineWidth = 7;
                ctx.fillStyle = "green";
                for (let i = 0; i < JoinLeave.Join.length; i++) {
                    ctx.strokeText(JoinLeave.Join[i][0], 0, joinedpeople);
                    ctx.fillText(JoinLeave.Join[i][0], 0, joinedpeople);
                    let textWidth = ctx.measureText(JoinLeave.Join[i][0]).width + 10;
                    ctx.fillStyle = "yellow";
                    ctx.strokeText('[' + JoinLeave.Join[i][1] + ']', textWidth, joinedpeople);
                    ctx.fillText('[' + JoinLeave.Join[i][1] + ']', textWidth, joinedpeople);
                    ctx.fillStyle = "green";
                    joinedpeople += 20;
                };
                ctx.restore();
            };
            if (JoinLeave.killPlayerToggle) {
                ctx.save();
                ctx.font = '18px Baloo Paaji';
                ctx.strokeStyle = "black";
                ctx.lineWidth = 7;
                ctx.fillStyle = "red";
                for (let i = 0; i < JoinLeave.Leave.length; i++) {
                    ctx.strokeText(JoinLeave.Leave[i][0], 0, joinedpeople);
                    ctx.fillText(JoinLeave.Leave[i][0], 0, joinedpeople);
                    let textWidth = ctx.measureText(JoinLeave.Leave[i][0]).width + 10;
                    ctx.fillStyle = "yellow";
                    ctx.strokeText('[' + JoinLeave.Leave[i][1] + ']', textWidth, joinedpeople);
                    ctx.fillText('[' + JoinLeave.Leave[i][1] + ']', textWidth, joinedpeople);
                    ctx.fillStyle = "red";
                    joinedpeople += 20;
                };
                ctx.restore();
            };
        };
    };

    function PingPongRequest() {
        if (!hiddenClient.Socket || hiddenClient.Socket.readyState != 1 || !playingGame) return;
        hiddenClient.Ping();
        if (!Spectator) {
            pingStart = globalDocument[defaultViewString][DateString][nowString]();
            pingSent = true;
            hiddenClient.GetFocus();
        };
    };

    function resize_canvas() {
        if (can && ctx) {
            let DevicePixelRatio = document[defaultViewString]['devicePixelRatio'] || 1;
            let backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
            if (can.width != document[defaultViewString]['innerWidth']) { can.width = document[defaultViewString]['innerWidth']; };
            if (can.height != document[defaultViewString]['innerHeight']) { can.height = document[defaultViewString]['innerHeight']; };
            let currentWidth = can.width;
            let currentHeight = can.height;
            let ratio, ratio_opt = document.getElementById("input_ratio").value * (DevicePixelRatio / backingStoreRatio);
            if (ratio_opt === -1) ratio = DevicePixelRatio / backingStoreRatio;
            else ratio = ratio_opt;
            can.width = currentWidth * ratio;
            can.height = currentHeight * ratio;
            can.style.width = currentWidth + "px";
            can.style.height = currentHeight + "px";
            ctx.scale(ratio, ratio);
            if (user) {
                hiddenUser.Cam.W = document.documentElement.clientWidth;
                hiddenUser.Cam.H = document.documentElement.clientHeight;
                hiddenUser.Cam.Rw = currentWidth;
                hiddenUser.Cam.Rh = currentHeight;
            };
        };
    };

    /* Resize Listener */
    document[defaultViewString]['addEventListener']('resize', function (event) {
        if (!hooksFound) return;
        workerTimers.setTimeout(() => {
            resize_canvas();
        }, 0);
    });

    function SmartEat() {
        let foodChosen = null;
        let foodIncrease = null;
        let ammountToEat = null;
        let foodRequired = (100 - Math.round(hiddenUser.Gauges.Food * 100));
        /* Ignores Cookies, Sandwhiches, Cakes */
        /* Ranges From 66% - 91% Food (Depending On Food Type) */
        if (hiddenUser.Inv.N[INV.PLANT]) { foodChosen = INV.PLANT; foodIncrease = 10; ammountToEat = Math.floor(foodRequired / foodIncrease); } // 91 (At Least)
        else if (hiddenUser.Inv.N[INV.GARLIC]) { foodChosen = INV.GARLIC; foodIncrease = 14; ammountToEat = Math.floor(foodRequired / foodIncrease); } // 87 (At Least)
        else if (hiddenUser.Inv.N[INV.CRAB_STICK]) { foodChosen = INV.CRAB_STICK; foodIncrease = 20; ammountToEat = Math.floor(foodRequired / foodIncrease); } // 81 (At Least)
        else if (hiddenUser.Inv.N[INV.PUMPKIN]) { foodChosen = INV.PUMPKIN; foodIncrease = 30; ammountToEat = Math.floor(foodRequired / foodIncrease); } // 71 (At Least)
        else if (hiddenUser.Inv.N[INV.TOMATO]) { foodChosen = INV.TOMATO; foodIncrease = 16; ammountToEat = Math.floor(foodRequired / foodIncrease); } // 85 (At Least)
        else if (hiddenUser.Inv.N[INV.CARROT]) { foodChosen = INV.CARROT; foodIncrease = 20; ammountToEat = Math.floor(foodRequired / foodIncrease); } // 81 (At Least)
        else if (hiddenUser.Inv.N[INV.WATERMELON]) { foodChosen = INV.WATERMELON; foodIncrease = 15; ammountToEat = Math.floor(foodRequired / foodIncrease); } // 86 (At Least)
        else if (hiddenUser.Inv.N[INV.BREAD]) { foodChosen = INV.BREAD; foodIncrease = 15; ammountToEat = Math.floor(foodRequired / foodIncrease); } // 86 (At Least)
        else if (hiddenUser.Inv.N[INV.COOKED_MEAT]) { foodChosen = INV.COOKED_MEAT; foodIncrease = 35; ammountToEat = Math.floor(foodRequired / foodIncrease); } // 66 (At Least)
        else if (hiddenUser.Inv.N[INV.FOODFISH_COOKED]) { foodChosen = INV.FOODFISH_COOKED; foodIncrease = 35; ammountToEat = Math.floor(foodRequired / foodIncrease); } // 66 (At Least)
        else if (hiddenUser.Inv.N[INV.CRAB_LOOT]) { foodChosen = INV.CRAB_LOOT; foodIncrease = 10; ammountToEat = Math.floor(foodRequired / foodIncrease); } // 91 (At Least)
        else ammountToEat = 0;
        if (ammountToEat >= 1) {
            /* Calculate How Much We Can Eat Based On Food Levels */
            let availableFood = hiddenUser.Inv.N[foodChosen] || 0;
            ammountToEat = Math.min(ammountToEat, availableFood);
            /* Predict Food Levels Before Eating (Prevents Wasting Food On High Ping) */
            hiddenUser.Gauges.Food = hiddenUser.Gauges.Food + ((foodIncrease / 100) * ammountToEat);
            for (let i = 0; i < ammountToEat; i++) { hiddenClient.SelectInv(foodChosen); };
        };
    };

    function AutoConsume() {
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        /* Reset AutoFarm Movement Counter */
        movementCounter = 0;
        /* AutoIce */
        if ((hiddenUser.Gauges.Temp + (1 - hiddenUser.Gauges.Heat) >= 2) && !hiddenUser.Craft.Crafting && Settings.AutoIce.active) {
            let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
            if (hiddenUser.Inv.N[INV.ICE]) {
                /* Eat Ice If No Player To Be Safe */
                lastPreview = hiddenUser.Craft.Preview;
                hiddenClient.SelectInv(INV.ICE);
                hiddenUser.Craft.Preview = lastPreview;;
            };

        };
        /* AutoDrink */
        if (hiddenUser.Gauges.Water < 0.45 && !hiddenUser.Craft.Crafting) {
            if (hiddenUser.Inv.N[INV.BOTTLE_FULL]) {
                lastPreview = hiddenUser.Craft.Crafting
                hiddenClient.SelectInv(INV.BOTTLE_FULL);
                hiddenUser.Craft.Crafting = lastPreview;
            };
        };
        /* AutoEat */
        if (hiddenUser.Gauges.Food < 0.45 && !hiddenUser.Craft.Crafting) {
            let foodIncrease = 0;
            lastPreview = hiddenUser.Craft.Crafting;
            if (hiddenUser.Inv.N[INV.PLANT]) { foodIncrease = 10; hiddenClient.SelectInv(INV.PLANT); }
            else if (hiddenUser.Inv.N[INV.GARLIC]) { foodIncrease = 14; hiddenClient.SelectInv(INV.GARLIC); }
            else if (hiddenUser.Inv.N[INV.CRAB_STICK]) { foodIncrease = 20; hiddenClient.SelectInv(INV.CRAB_STICK); }
            else if (hiddenUser.Inv.N[INV.PUMPKIN]) { foodIncrease = 30; hiddenClient.SelectInv(INV.PUMPKIN); }
            else if (hiddenUser.Inv.N[INV.TOMATO]) { foodIncrease = 16; hiddenClient.SelectInv(INV.TOMATO); }
            else if (hiddenUser.Inv.N[INV.CARROT]) { foodIncrease = 20; hiddenClient.SelectInv(INV.CARROT); }
            else if (hiddenUser.Inv.N[INV.WATERMELON]) { foodIncrease = 15; hiddenClient.SelectInv(INV.WATERMELON); }
            else if (hiddenUser.Inv.N[INV.COOKED_MEAT]) { foodIncrease = 35; hiddenClient.SelectInv(INV.COOKED_MEAT); }
            else if (hiddenUser.Inv.N[INV.FOODFISH_COOKED]) { foodIncrease = 35; hiddenClient.SelectInv(INV.FOODFISH_COOKED); }
            else if (hiddenUser.Inv.N[INV.BREAD]) { foodIncrease = 15; hiddenClient.SelectInv(INV.BREAD); }
            else if (hiddenUser.Inv.N[INV.COOKIE]) { foodIncrease = 50; hiddenClient.SelectInv(INV.COOKIE); }
            else if (hiddenUser.Inv.N[INV.SANDWICH]) { foodIncrease = 100; hiddenClient.SelectInv(INV.SANDWICH); }
            else if (hiddenUser.Inv.N[INV.CAKE]) { foodIncrease = 100; hiddenClient.SelectInv(INV.CAKE); }
            else if (hiddenUser.Inv.N[INV.CRAB_LOOT]) { foodIncrease = 10; hiddenClient.SelectInv(INV.CRAB_LOOT); };
            hiddenUser.Craft.Crafting = lastPreview;
        };
    };

    function AutoSteal() {
        /* AutoSteal */
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        if (Settings.AutoSteal.active) {
            for (let k = 0; hiddenWorld.Units[ITEMS.CHEST].length > k; k++) {
                let chest = hiddenWorld.Units[ITEMS.CHEST][k];
                let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                if (myPlayer) {
                    chest.ally = user.id === chest[specialProps.pid] || CheckAlly(chest[specialProps.pid]);
                    if ((chest.ally || !chest.lock)) {
                        if (myPlayer && (DistanceToObj(myPlayer, chest) < 300) && !hiddenUser.Craft.Crafting) {
                            if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
                            chest[specialProps.iid] = chest.id;
                            hiddenClient.TakeChest(chest);
                        };
                    };
                };
            };
        };
    };

    function AutoSpike() {
        /* AutoSpike */
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        if (Settings.AutoSpike.active) {
            if (!scriptGui) try { crashHandler(12); for (; ;); } catch { for (; ;); }
            let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
            let CurrentSpike;
            if (hiddenUser.Inv.N[INV.REIDITE_SPIKE]) CurrentSpike = INV.REIDITE_SPIKE;
            else if (hiddenUser.Inv.N[INV.AMETHYST_SPIKE]) CurrentSpike = INV.AMETHYST_SPIKE;
            else if (hiddenUser.Inv.N[INV.DIAMOND_SPIKE]) CurrentSpike = INV.DIAMOND_SPIKE;
            else if (hiddenUser.Inv.N[INV.GOLD_SPIKE]) CurrentSpike = INV.GOLD_SPIKE;
            else if (hiddenUser.Inv.N[INV.STONE_SPIKE]) CurrentSpike = INV.STONE_SPIKE;
            else if (hiddenUser.Inv.N[INV.SPIKE]) CurrentSpike = INV.SPIKE;
            else if (hiddenUser.Inv.N[INV.WALL]) CurrentSpike = INV.WALL;
            else CurrentSpike = -1;
            if (CurrentSpike == -1 || !myPlayer || hiddenUser.Craft.Crafting) return;
            let PInumb = 2 * Math.PI, targetAngle;
            switch (Settings.AutoSpike.mode) {
                case "Normal":
                    targetAngle = Math.floor((myPlayer.angle + PInumb) % PInumb * 255 / PInumb);
                    if (targetAngle) {
                        for (let angle = 0; angle < 6; angle++) {
                            hiddenClient.Socket.send(JSON.stringify([sendIDS.build, CurrentSpike, ((angle * 4) + targetAngle) % 255, 0]));
                            hiddenClient.Socket.send(JSON.stringify([sendIDS.build, CurrentSpike, (targetAngle - (angle * 4) + 255) % 255, 0]));
                        };
                        /* After Loop Send Current Angle To Hide Autospike Shake */
                        hiddenClient.Socket.send(JSON.stringify([sendIDS.build, CurrentSpike, targetAngle % 255, 0]));
                    };
                    break;
                case "Hidden":
                    /* Equip If Not Equiped */
                    if (hiddenUser.Craft.Preview != CurrentSpike && (Date.now() - spikeActivePreviously > (Math.floor(Math.random() * 250) + 250))) hiddenClient.SelectInv(CurrentSpike);
                    /* Add Place Delay To Make It More Natural */
                    if (Number(Settings.AutoSpike.speed) > 0) {
                        let speed = Number(Settings.AutoSpike.speed) * 20;
                        let randomTimeout = (Math.floor(Math.random() * speed) + speed / 2);
                        workerTimers.setTimeout(() => { if (hiddenUser.Craft.Preview == CurrentSpike) { hiddenClient.SendBuild(); spikeActivePreviously = Date.now(); }; }, randomTimeout);
                    } else {
                        if (hiddenUser.Craft.Preview == CurrentSpike) {
                            hiddenClient.SendBuild();
                            spikeActivePreviously = Date.now();
                        };
                    };
                    break
                default: break;
            };
        } else if (!Settings.AutoSpike.active) {
            if (spikeActivePreviously) {
                spikeActivePreviously = 0;
                hiddenUser.Craft.Preview = -1;
            };
        };
    };

    function AutoWall() {
        /* AutoWall */
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        if (Settings.AutoWall.active) {
            let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
            let CurrentSpike;

            if (hiddenUser.Inv.N[INV.WALL]) CurrentSpike = INV.WALL;
            else if (hiddenUser.Inv.N[INV.STONE_WALL]) CurrentSpike = INV.STONE_WALL;
            else if (hiddenUser.Inv.N[INV.GOLD_WALL]) CurrentSpike = INV.GOLD_WALL;
            else if (hiddenUser.Inv.N[INV.DIAMOND_WALL]) CurrentSpike = INV.DIAMOND_WALL;
            else if (hiddenUser.Inv.N[INV.AMETHYST_WALL]) CurrentSpike = INV.AMETHYST_WALL;
            else if (hiddenUser.Inv.N[INV.REIDITE_WALL]) CurrentSpike = INV.REIDITE_WALL;

            else CurrentSpike = -1;
            if (CurrentSpike == -1 || !myPlayer || hiddenUser.Craft.Crafting) return;
            let PInumb = 2 * Math.PI, targetAngle;
            switch (Settings.AutoWall.mode) {
                case "Normal":
                    targetAngle = Math.floor((myPlayer.angle + PInumb) % PInumb * 255 / PInumb);
                    if (targetAngle) {
                        for (let angle = 0; angle < 6; angle++) {
                            hiddenClient.Socket.send(JSON.stringify([sendIDS.build, CurrentSpike, ((angle * 4) + targetAngle) % 255, 0]));
                            hiddenClient.Socket.send(JSON.stringify([sendIDS.build, CurrentSpike, (targetAngle - (angle * 4) + 255) % 255, 0]));
                        };
                        /* After Loop Send Current Angle To Hide Autospike Shake */
                        hiddenClient.Socket.send(JSON.stringify([sendIDS.build, CurrentSpike, targetAngle % 255, 0]));
                    };
                    break;
                case "Hidden":
                    /* Equip If Not Equiped */
                    if (hiddenUser.Craft.Preview != CurrentSpike && (Date.now() - wallActivePreviously > (Math.floor(Math.random() * 250) + 250))) hiddenClient.SelectInv(CurrentSpike);
                    /* Add Place Delay To Make It More Natural */
                    if (Number(Settings.AutoSpike.speed) > 0) {
                        let speed = Number(Settings.AutoSpike.speed) * 20;
                        let randomTimeout = (Math.floor(Math.random() * speed) + speed / 2);
                        workerTimers.setTimeout(() => { if (hiddenUser.Craft.Preview == CurrentSpike) { hiddenClient.SendBuild(); wallActivePreviously = Date.now(); }; }, randomTimeout);
                    } else {
                        if (hiddenUser.Craft.Preview == CurrentSpike) {
                            hiddenClient.SendBuild();
                            wallActivePreviously = Date.now();
                        };
                    };
                    break
                default: break;
            };
        } else if (!Settings.AutoWall.active) {
            if (wallActivePreviously) {
                wallActivePreviously = 0;
                hiddenUser.Craft.Preview = -1;
            };
        };
    };

    function AutoFire() {
        /* AutoFire */
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        if (Settings.AutoFire.active) {
            let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
            if (!myPlayer || hiddenUser.Craft.Crafting || (!hiddenUser.Inv.N[INV.FIRE] && !hiddenUser.Inv.N[INV.BIG_FIRE])) return;
            let PInumb = 2 * Math.PI;
            let Angle = Math.floor((myPlayer.angle + PInumb) % PInumb * 255 / PInumb);
            hiddenClient.Socket.send(JSON.stringify([sendIDS.build, INV.FIRE, Angle, 0]));
            hiddenClient.Socket.send(JSON.stringify([sendIDS.build, INV.BIG_FIRE, Angle, 0]));
        };
    };

    function AutoCraft() {
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
        if (Settings.AutoCraft.active) {
            if (!myPlayer) return;
            if (hiddenUser.Craft.Crafting) return;
            SmartEat();
            if (lastCrafted != -1) hiddenClient.SelectCraft(lastCrafted);
        };
    };

    function AutoRecycle() {
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
        if (Settings.AutoRecycle.active) {
            if (!myPlayer) return;
            if (hiddenUser.Craft.Crafting) return;
            SmartEat();
            if (lastRecycled != -1) hiddenClient.RecycleInv(lastRecycled);
        };
    };

    function AutoExtractor() {
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
        if (Settings.AutoExtTake.active || Settings.AutoExtPut.active || Settings.AutoSteal.active) {
            for (let j = 0, extractors = [...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_STONE], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_GOLD], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_DIAMOND], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_AMETHYST], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_REIDITE], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_EMERALD], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_COPPER], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_IRON], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_TOPAZ], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_SAPPHIRE], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_JADE], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_RUBY], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_COAL], ...hiddenWorld.Units[ITEMS.EXTRACTOR_MACHINE_AQUAMARINE]], len = extractors.length; j < len; j++) {
                let extractor = extractors[j];
                if (extractor) {
                    if (Settings.AutoExtTake.active || Settings.AutoExtPut.active || Settings.AutoSteal.active) {
                        if (DistanceToObj(myPlayer, extractor) < 300 && myPlayer) {
                            /* Define iid To Bypass Range */
                            extractor[specialProps.iid] = extractor.id;
                            if ((Settings.AutoExtTake.active || Settings.AutoSteal.active) && ((extractor.info & 65280) >> 8)) hiddenClient.TakeExtractor(extractor);
                            if (Settings.AutoExtPut.active && ((extractor.info & 255) < 255)) hiddenClient.GiveWoodExtractor(extractor, 255);
                        };
                    };
                };
            };
        };
    };

    function AutoBread() {
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        /* Ovens */
        let Ovens = hiddenWorld.Units[ITEMS.BREAD_OVEN];
        for (let i = 0; i < Ovens.length; i++) {
            if (Settings.AutoBreadTake.active || Settings.AutoBreadPut.active || Settings.AutoSteal.active) {
                let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                let oven = Ovens[i]
                if (myPlayer) {
                    if (DistanceToObj(myPlayer, oven) < 300) {
                        oven[specialProps.iid] = oven.id;
                        if (Settings.AutoBreadPut.active) {
                                /* Wheat */ hiddenClient.GiveBreadOven(oven, 31, 0);
                                /* Flour */ hiddenClient.GiveBreadOven(oven, 0, 31);
                        };
                        if (Settings.AutoBreadTake.active || Settings.AutoSteal.active) hiddenClient.TakeBread(oven);
                    };
                };
            };
        };
        /* Windmills */
        let Windmills = hiddenWorld.Units[ITEMS.WINDMILL];
        for (let i = 0; i < Windmills.length; i++) {
            if (Settings.AutoBreadTake.active || Settings.AutoBreadPut.active || Settings.AutoSteal.active) {
                let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                if (myPlayer) {
                    if (DistanceToObj(myPlayer, Windmills[i]) < 300) {
                        Windmills[i][specialProps.iid] = Windmills[i].id;
                        if (Settings.AutoBreadPut.active) /* Give Wheat */ hiddenClient.GiveWheat(Windmills[i], 255)
                        if (Settings.AutoBreadTake.active || Settings.AutoSteal.active) hiddenClient.TakeFlour(Windmills[i], 255)
                    };
                };
            };
        };
    };

    let craftOrderPos = 0;
    let currentlyCrafting = false;
    let toCraftAmmount = 0;
    function SmartCraft() {
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        if (Settings.SmartCraft.active) {
            if (hiddenUser.Craft.Crafting) return;
            SmartEat();
            let craftRecipe = [];
            switch (Settings.SmartCraft.option) {
                case "Reidite Spike Doors": craftRecipe = [[INV.WOOD_DOOR, INV.WOOD_DOOR], [INV.STONE_DOOR, INV.STONE_DOOR], [INV.GOLD_DOOR, INV.GOLD_DOOR], [INV.DIAMOND_DOOR, INV.DIAMOND_DOOR], [INV.AMETHYST_DOOR, INV.AMETHYST_DOOR], [INV.REIDITE_DOOR, INV.REIDITE_DOOR], [INV.REIDITE_DOOR_SPIKE, INV.REIDITE_DOOR_SPIKE]]; break;
                case "Amethyst Spike Doors": craftRecipe = [[INV.WOOD_DOOR, INV.WOOD_DOOR], [INV.STONE_DOOR, INV.STONE_DOOR], [INV.GOLD_DOOR, INV.GOLD_DOOR], [INV.DIAMOND_DOOR, INV.DIAMOND_DOOR], [INV.AMETHYST_DOOR, INV.AMETHYST_DOOR], [INV.AMETHYST_DOOR_SPIKE, INV.AMETHYST_DOOR_SPIKE]]; break;
                case "Reidite Walls": craftRecipe = [[INV.WALL, INV.WALL], [INV.STONE_WALL, INV.STONE_WALL], [INV.GOLD_WALL, INV.GOLD_WALL], [INV.DIAMOND_WALL, INV.DIAMOND_WALL], [INV.AMETHYST_WALL, INV.AMETHYST_WALL], [INV.REIDITE_WALL, INV.REIDITE_WALL]]; break;
                case "Reidite Spikes": craftRecipe = [[INV.WALL, INV.WALL], [INV.STONE_WALL, INV.STONE_WALL], [INV.GOLD_WALL, INV.GOLD_WALL], [INV.DIAMOND_WALL, INV.DIAMOND_WALL], [INV.AMETHYST_WALL, INV.AMETHYST_WALL], [INV.REIDITE_WALL, INV.REIDITE_WALL], [INV.REIDITE_SPIKE, INV.REIDITE_SPIKE]]; break;
                case "Amethyst Spikes": craftRecipe = [[INV.WALL, INV.WALL], [INV.STONE_WALL, INV.STONE_WALL], [INV.GOLD_WALL, INV.GOLD_WALL], [INV.DIAMOND_WALL, INV.DIAMOND_WALL], [INV.AMETHYST_WALL, INV.AMETHYST_WALL], [INV.AMETHYST_SPIKE, INV.AMETHYST_SPIKE]]; break;
                case "Diamond Spikes": craftRecipe = [[INV.WALL, INV.WALL], [INV.STONE_WALL, INV.STONE_WALL], [INV.GOLD_WALL, INV.GOLD_WALL], [INV.DIAMOND_WALL, INV.DIAMOND_WALL], [INV.DIAMOND_SPIKE, INV.DIAMOND_SPIKE]]; break;
                case "Gold Spikes": craftRecipe = [[INV.WALL, INV.WALL], [INV.STONE_WALL, INV.STONE_WALL], [INV.GOLD_WALL, INV.GOLD_WALL], [INV.GOLD_SPIKE, INV.GOLD_SPIKE]]; break;
                case "Reidite Swords": craftRecipe = [[INV.SWORD_WOOD, INV.SWORD_WOOD], [INV.SWORD, INV.SWORD], [INV.SWORD_GOLD, INV.SWORD_GOLD], [INV.SWORD_DIAMOND, INV.SWORD_DIAMOND], [INV.SWORD_AMETHYST, INV.SWORD_AMETHYST], [INV.REIDITE_SWORD, INV.REIDITE_SWORD]]; break;
                case "Reidite Spears": craftRecipe = [[INV.WOOD_SPEAR, INV.WOOD_SPEAR], [INV.SPEAR, INV.SPEAR], [INV.GOLD_SPEAR, INV.GOLD_SPEAR], [INV.DIAMOND_SPEAR, INV.DIAMOND_SPEAR], [INV.AMETHYST_SPEAR, INV.AMETHYST_SPEAR], [INV.REIDITE_SPEAR, INV.REIDITE_SPEAR]]; break;
                case "Reidite Helmets": craftRecipe = [[INV.WOOD_HELMET, INV.WOOD_HELMET], [INV.STONE_HELMET, INV.STONE_HELMET], [INV.GOLD_HELMET, INV.GOLD_HELMET], [INV.DIAMOND_HELMET, INV.DIAMOND_HELMET], [INV.AMETHYST_HELMET, INV.AMETHYST_HELMET], [INV.REIDITE_HELMET, INV.REIDITE_HELMET]]; break;
                case "Reidite Shields": craftRecipe = [[INV.WOOD_SHIELD, INV.WOOD_SHIELD], [INV.STONE_SHIELD, INV.STONE_SHIELD], [INV.GOLD_SHIELD, INV.GOLD_SHIELD], [INV.DIAMOND_SHIELD, INV.DIAMOND_SHIELD], [INV.AMETHYST_SHIELD, INV.AMETHYST_SHIELD], [INV.REIDITE_SHIELD, INV.REIDITE_SHIELD]]; break;
                default: break;
            };
            if (!currentlyCrafting) {
                currentlyCrafting = true;
                if (hiddenUser.Inv.N[craftRecipe[craftRecipe.length - 1][1]]) {
                    let currentAmmount = hiddenUser.Inv.N[craftRecipe[craftRecipe.length - 1][1]];
                    toCraftAmmount = currentAmmount + Number(Settings.SmartCraft.amount);
                } else toCraftAmmount = Number(Settings.SmartCraft.amount);
            };
            craftOrderPos = 0;
            for (let i = 0; i < craftRecipe.length; i++) { if (craftRecipe[i][0] == lastSmartCraft && i != craftRecipe.length - 1) craftOrderPos = i + 1; };
            if (craftOrderPos == 0) for (let i = 0; i < craftRecipe.length; i++) { if (hiddenUser.Inv.N[craftRecipe[i][1]] && i != craftRecipe.length - 1) craftOrderPos = i + 1; };
            if (hiddenUser.Inv.N[craftRecipe[craftRecipe.length - 1][1]] >= toCraftAmmount) { Settings.SmartCraft.active = false; return; }
            hiddenClient.SelectCraft(craftRecipe[craftOrderPos][0], 1);
        } else if (!Settings.SmartCraft.active) {
            currentlyCrafting = false;
            toCraftAmmount = 0;
        };
    };

    function AutoCrown() {
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
        if (!myPlayer) return;
        if (myPlayer[specialProps.ghost]) {
            let Stone = hiddenWorld.Units[ITEMS.RESURRECTION];
            if (Stone.length) {
                let stoneFound = false;
                for (let i = 0; i < Stone.length; i++) {
                    if (DistanceToObj(Stone[i], myPlayer) <= 100) {
                        stoneFound = true;
                        /* Not A Ghost, AutoCrown Not Active, Helmet Recently Equiped And Not On Community Servers: Then Prevent Resurrection */
                        if (!myPlayer[specialProps.ghost] || !Settings.AutoCrown.active || (hiddenUser.Helmet.wait && !hiddenClient.Socket.url.includes('community'))) continue;
                        hiddenUser.Resurrection[specialProps.pid] = Stone[i][specialProps.pid];
                        hiddenUser.Resurrection[specialProps.iid] = Stone[i].id;
                        hiddenClient.Resurrection();
                    };
                };
                if (stoneFound && myPlayer[specialProps.ghost]) hiddenUser.Ghost.enabled = true;
                else if (!stoneFound) hiddenUser.Ghost.enabled = false;
            };
        } else if (hiddenUser.Ghost.enabled) hiddenUser.Ghost.enabled = false;
    };

    function AutoTotem() {
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
        if (!myPlayer) return;
        let totem = hiddenWorld.Units[ITEMS.TOTEM];
        for (let i = 0; i < totem.length; i++) {
            if (Settings.AutoTotem.active && !hiddenUser.Totem.wait && hiddenUser.Team.length === 0) {
                if (!((totem[i].info & 16) >> 4) && totem[i].info < 8) {
                    if (DistanceToObj(totem[i], myPlayer) < 300) {
                        hiddenUser.Totem[specialProps.pid] = totem[i][specialProps.pid];
                        hiddenUser.Totem.id = totem[i].id
                        hiddenClient.JoinTeam();
                    };
                };
            };
        };
    };

    function AutoBuild() {
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
        if (Settings.AutoBuild.active) {
            if (hiddenUser.Craft.Crafting || !myPlayer) return;
            if (Settings.AutoBuild.mode == "Bridges" && hiddenUser.Inv.N[INV.BRIDGE]) {
                let PInumb = 2 * Math.PI;
                let MYPLAYERANGLE = Math.floor((myPlayer.angle + PInumb) % PInumb * 255 / PInumb);
                hiddenClient.Socket.send(JSON.stringify([sendIDS.build, INV.BRIDGE, MYPLAYERANGLE, 0]));
            };
            if (Settings.AutoBuild.mode == "Plots" && hiddenUser.Inv.N[INV.PLOT]) {
                let PInumb = 2 * Math.PI;
                let MYPLAYERANGLE = Math.floor((myPlayer.angle + PInumb) % PInumb * 255 / PInumb);
                hiddenClient.Socket.send(JSON.stringify([sendIDS.build, INV.PLOT, MYPLAYERANGLE, 0]));
            };
            if (Settings.AutoBuild.mode == "Roofs" && hiddenUser.Inv.N[INV.ROOF]) {
                let PInumb = 2 * Math.PI;
                let MYPLAYERANGLE = Math.floor((myPlayer.angle + PInumb) % PInumb * 255 / PInumb);
                hiddenClient.Socket.send(JSON.stringify([sendIDS.build, INV.ROOF, MYPLAYERANGLE, 0]));
            };
        };
    };

    let repeatedMove = 0;
    let oldMove = 0;
    function Chase(angle) {
        let PI = Math.PI * 2;
        let ANGLE = Math.floor((angle + PI) % PI * 360 / PI);
        let Movement = 0;
        switch (Math.round(ANGLE / 45)) {
            case 0: Movement = 2; break;
            case 1: Movement = 6; break;
            case 2: Movement = 4; break;
            case 3: Movement = 5; break;
            case 4: Movement = 1; break;
            case 5: Movement = 9; break;
            case 6: Movement = 8; break;
            case 7: Movement = 10; break;
            case 8: Movement = 2; break;
        };
        /* Prevents Duplicate Movements */
        if (Movement == oldMove) {
            repeatedMove++; if (repeatedMove > 1) return; else {
                hiddenClient.SendMove(Movement);
                oldMove = Movement;
            };
        } else { repeatedMove = 0; hiddenClient.SendMove(Movement); oldMove = Movement; };
    };

    let sentAttack = false;
    let packetCount = 0;
    function Aimbot() {
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        if (Settings.Aimbot.active) {
            let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
            if (!myPlayer) if (sentAttack) {
                sentAttack = false; activeAttacking = false; return hiddenClient.StopAttack();
            } else return;
            const targetData = findTarget();
            const target = targetData[0];
            distanceToTarget = targetData[1];
            if (!target) {
                targetAquired = 0;
                Settings.Aimbot.angle = 0;
                if (sentAttack) {
                    sentAttack = false; activeAttacking = false; return hiddenClient.StopAttack();
                } else return;
            } else targetAquired = 1;
            const angle = getAngle({ x: target.r.x + hiddenUser.Cam.x, y: target.r.y + hiddenUser.Cam.y }, { x: myPlayer.r.x + hiddenUser.Cam.x, y: myPlayer.r.y + hiddenUser.Cam.y });
            if (!angle && angle != 0) {
                Settings.Aimbot.angle = 0;
                if (sentAttack) {
                    sentAttack = false; activeAttacking = false; return hiddenClient.StopAttack();
                } else return;
            };
            const weaponType = holdingWeapon(myPlayer.right);
            if (weaponType) weaponPulled = weaponType; else weaponPulled = 0;
            const attackRange = [133, 203, 110, 120, 143, Settings.Aimbot.BowRange][weaponType - 1] || 0;
            if (!attackRange) {
                Settings.Aimbot.angle = 0;
                if (sentAttack) {
                    sentAttack = false; activeAttacking = false; return hiddenClient.StopAttack();
                } else return;
            };
            if (Settings.Aimbot.mode == "Attack & Chase" || Settings.Aimbot.mode == "Rabbit Chase") Chase(angle);
            const canAttack = distanceToTarget <= attackRange;
            const canAim = !canAttack && distanceToTarget <= (attackRange + 0);
            if (canAim || !canAttack) if (sentAttack) { sentAttack = false; activeAttacking = false; hiddenClient.StopAttack(); };
            if (canAttack || canAim) if (Settings.Aimbot.angle == angle) { packetCount++; if (packetCount > 1) return; } else packetCount = 0;
            if (canAttack) {
                activeAttacking = true;
                sentAttack = true;
                Settings.Aimbot.angle = angle;
                hiddenClient.SendAttack(angle);
            } else if (canAim) {
                Settings.Aimbot.angle = angle;
                hiddenClient.SendAttack(angle);
            } else if (Settings.Aimbot.angle) {
                Settings.Aimbot.angle = 0
            };
        } else if (sentAttack) {
            sentAttack = false; activeAttacking = false; return hiddenClient.StopAttack();
        };
    };

    function ZmaAutoCrown() {
        if (!hiddenClient.Socket || hiddenClient.Socket.readyState !== 1 || !playingGame || definePlayerProps || !Settings.ZmaAutoCrown || !hiddenClient.Socket.url.includes('community')) return;
        let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
        /* No Player Or Health Is Max Return */
        if (!myPlayer) return;
        /* Greater Than 300 Ping Will Bug Out */
        if (Math.floor(hiddenUser.Gauges.Health * 100) != 100 && hiddenUser.Inv.N[INV.CROWN_GREEN] && myPlayer[specialProps.clothe] != INV.CROWN_GREEN && (5 - (Date.now() - timerInterval) / 1000).toFixed(1) <= (currentPing ? ((currentPing + 100) / 1000) : 0.300) && !helmetToggle && healTick) {
            helmetToggle = true;
            lastHelmetWorn = myPlayer[specialProps.clothe];
            hiddenClient.SelectInv(INV.CROWN_GREEN);
        } else if (myPlayer[specialProps.clothe] == INV.CROWN_GREEN && (((5 - (Date.now() - timerInterval) / 1000).toFixed(1) > (currentPing ? ((currentPing + 100) / 1000) : 0.300)) || ((5 - (Date.now() - timerInterval) / 1000).toFixed(1) < (currentPing ? ((currentPing - 100) / 1000) : 0))) && helmetToggle) {
            helmetToggle = false;
            if (lastHelmetWorn != 0) hiddenClient.SelectInv(lastHelmetWorn);
        };
    };

    function ZmaAutoBottle() {
        if (!hiddenClient.Socket || hiddenClient.Socket.readyState !== 1 || !playingGame || !Settings.ZmaAutoBottle.enabled || !hiddenClient.Socket.url.includes('community')) return;
        let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
        if (!myPlayer) return;
        if (!bottleEquiped && hiddenUser.Inv.N[INV.BOTTLE_FULL] && Math.floor(hiddenUser.Gauges.Health * 100) <= Number(Settings.ZmaAutoBottle.health)) {
            bottleEquiped = true;
            hiddenClient.SelectInv(INV.BOTTLE_FULL);
        } else if (bottleEquiped && Math.floor(hiddenUser.Gauges.Health * 100) > Number(Settings.ZmaAutoBottle.health)) {
            bottleEquiped = false;
        };
    };

    function ZmaRedGold() {
        if (!hiddenClient.Socket || hiddenClient.Socket.readyState !== 1 || !playingGame || !Settings.ZmaRedGold.active || !hiddenClient.Socket.url.includes('community')) return;
        let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
        if (!myPlayer) return;
        for (let k = 0; hiddenWorld.Units[ITEMS.CHEST].length > k; k++) {
            for (let i = 0; hiddenUser.Inv.N.length > i; i++) {
                if (hiddenUser.Inv.N[i] && (i == INV.REIDITE || i == INV.GOLD)) {
                    if (DistanceToObj(myPlayer, hiddenWorld.Units[ITEMS.CHEST][k]) < 150) {
                        hiddenWorld.Units[ITEMS.CHEST][k].ally = user.id === hiddenWorld.Units[ITEMS.CHEST][k][specialProps.pid] || CheckAlly(hiddenWorld.Units[ITEMS.CHEST][k][specialProps.pid]);
                        if ((hiddenWorld.Units[ITEMS.CHEST][k].ally || !hiddenWorld.Units[ITEMS.CHEST][k].lock)) {
                            hiddenWorld.Units[ITEMS.CHEST][k][specialProps.iid] = hiddenWorld.Units[ITEMS.CHEST][k].id;
                            hiddenClient.GiveItem(hiddenWorld.Units[ITEMS.CHEST][k], i, 255);
                        };
                    };
                };
            };
        };
    };

    function AutoSeed() {
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
        if (Settings.AutoSeed.active && hiddenUser.Inv.N[SeedtoPlace]) {
            if (hiddenUser.Craft.Crafting || !myPlayer) return;
            for (let i = 0; i < 26; i++) hiddenClient.Socket.send(JSON.stringify([sendIDS.build, SeedtoPlace, i * 10, 1]));
        };
    };

    function AutoFarm() {
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        if (Settings.AutoFarm.active) {
            let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
            if (!myPlayer) return;
            let Target = { Object: null, Distance: -1, Function: 0 };
            var FarmingSquare = { x: Settings.AutoFarm.TLX, y: Settings.AutoFarm.TLY, width: Settings.AutoFarm.BRX - Settings.AutoFarm.TLX, height: Settings.AutoFarm.BRY - Settings.AutoFarm.TLY };
            for (var i = 0, objects = [...hiddenWorld.Units[ITEMS.SEED], ...hiddenWorld.Units[ITEMS.PUMPKIN_SEED], ...hiddenWorld.Units[ITEMS.GARLIC_SEED], ...hiddenWorld.Units[ITEMS.THORNBUSH_SEED], ...hiddenWorld.Units[ITEMS.CARROT_SEED], ...hiddenWorld.Units[ITEMS.TOMATO_SEED], ...hiddenWorld.Units[ITEMS.WATERMELON_SEED], ...hiddenWorld.Units[ITEMS.ALOE_VERA_SEED], ...hiddenWorld.Units[ITEMS.WHEAT_SEED]], len = objects.length, Berry = null, Distance = null; i < len; ++i) {
                Berry = objects[i];
                if (!Berry.info || Berry.info === 10) continue; if (!hiddenUser.Inv.N[INV.WATERING_CAN_FULL] && Berry.info === 16) continue;
                if (FarmingSquare.x < Berry.x - 50 + 100 && FarmingSquare.x + FarmingSquare.width > Berry.x - 50 && FarmingSquare.y < Berry.y - 50 + 100 && FarmingSquare.y + FarmingSquare.height > Berry.y - 50) {
                    Distance = (myPlayer.x - Berry.x) ** 2 + (myPlayer.y - Berry.y) ** 2;
                    if (Target.Distance === -1 || Distance < Target.Distance) { Target.Distance = Distance; Target.Object = Berry; };
                };
            };
            if (Target.Object && Math.floor(hiddenUser.Gauges.Health * 100) > 80 && (hiddenUser.Gauges.Temp + (1 - hiddenUser.Gauges.Heat)) > .1) {
                Target.Distance = DistanceToObj(myPlayer, Target.Object);
                switch (Target.Object.info) {
                    case 16:
                    case 17:
                    case 18:
                    case 19:
                        if (hiddenUser.Inv.N[INV.WATERING_CAN_FULL]) { if (myPlayer.right !== INV.WATERING_CAN_FULL) hiddenClient.SelectInv(INV.WATERING_CAN_FULL); Target.Function = 1; }
                        else { if (hiddenUser.Inv.N[INV.PITCHFORK]) { if ((myPlayer.right !== INV.PITCHFORK)) { hiddenClient.SelectInv(INV.PITCHFORK); }; } else if (hiddenUser.Inv.N[INV.PITCHFORK2]) { if (myPlayer.right !== INV.PITCHFORK2) { hiddenClient.SelectInv(INV.PITCHFORK2); }; }; Target.Function = 2; };
                        break;
                    case 1:
                    case 2:
                    case 3:
                        if (hiddenUser.Inv.N[INV.PITCHFORK]) { if ((myPlayer.right !== INV.PITCHFORK)) { hiddenClient.SelectInv(INV.PITCHFORK); }; }
                        else if (hiddenUser.Inv.N[INV.PITCHFORK2]) { if (myPlayer.right !== INV.PITCHFORK2) { hiddenClient.SelectInv(INV.PITCHFORK2); }; };
                        Target.Function = 2;
                        break;
                };
                let Coordinates = { x: myPlayer.x - Target.Object.x, y: myPlayer.y - Target.Object.y };
                let SafePosition = { x: Math.abs(myPlayer.x - Target.Object.x), y: Math.abs(myPlayer.y - Target.Object.y) };
                let Movement = 0;
                if (SafePosition.x > 50) { if (Coordinates.x > 0) Movement += 1; if (Coordinates.x < 0) Movement += 2; };
                if (SafePosition.y > 50) { if (Coordinates.y > 0) Movement += 8; if (Coordinates.y < 0) Movement += 4; };
                /* Prevent getting stuck with random movements */
                if (Movement == 0) { movementCounter++; if (movementCounter == 5) { let numbers = [1, 2, 4, 8]; Movement += numbers[Math.floor(Math.random() * 4)]; } };
                hiddenClient.SendMove(Movement);
                if (SafePosition.x < (Target.Function === 1 ? 120 : 300) && SafePosition.y < (Target.Function === 1 ? 120 : 300)) { Settings.AutoFarm.angle = getAngle(Target.Object, myPlayer); if (Settings.AutoFarm.angle) { hiddenClient.SendAttack(Settings.AutoFarm.angle); hiddenClient.StopAttack(); }; };
            } else {
                let Coordinates = { x: myPlayer.x - Settings.AutoFarm.SX, y: myPlayer.y - Settings.AutoFarm.SY };
                let SafePosition = { x: Math.abs(myPlayer.x - Settings.AutoFarm.SX), y: Math.abs(myPlayer.y - Settings.AutoFarm.SY) };
                let Movement = 0;
                if (SafePosition.x > 30) { if (Coordinates.x > 0) Movement += 1; if (Coordinates.x < 0) Movement += 2; };
                if (SafePosition.y > 30) { if (Coordinates.y > 0) Movement += 8; if (Coordinates.y < 0) Movement += 4; };
                hiddenClient.SendMove(Movement);
            };
        };
    };

    function PathFind() {
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        if (Settings.PathFinder.active) {
            let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
            if (!myPlayer) return;
            if (hiddenClient.Socket.url.includes('experimental') && hiddenUser.Inv.N[INV.BOAT] && myPlayer[specialProps.vehicle] != INV.BOAT) hiddenClient.SelectInv(INV.BOAT);
            findpath({ x: Math.round(myPlayer.x / 100), y: Math.round(myPlayer.y / 100) }, Settings.PathFinder.End);
            let endPos = { x: Settings.PathFinder.End.x * 100, y: Settings.PathFinder.End.y * 100 }
            if (DistanceToObj(myPlayer, endPos) < 1000) if (lastChosenKit != -1 && Settings.lastKit) chooseKit(lastChosenKit);
            if (Settings.PathFinder.inventory) {
                if (DistanceToObj(myPlayer, endPos) < 300) {
                    for (let k = 0; hiddenWorld.Units[ITEMS.CHEST].length > k; k++) {
                        for (let i = 0; hiddenUser.Inv.N.length > i; i++) {
                            if (hiddenUser.Inv.N[i]) {
                                if (DistanceToObj(myPlayer, hiddenWorld.Units[ITEMS.CHEST][k]) < 150) {
                                    hiddenWorld.Units[ITEMS.CHEST][k].ally = user.id === hiddenWorld.Units[ITEMS.CHEST][k][specialProps.pid] || CheckAlly(hiddenWorld.Units[ITEMS.CHEST][k][specialProps.pid]);
                                    if ((hiddenWorld.Units[ITEMS.CHEST][k].ally || !hiddenWorld.Units[ITEMS.CHEST][k].lock)) {
                                        hiddenWorld.Units[ITEMS.CHEST][k][specialProps.iid] = hiddenWorld.Units[ITEMS.CHEST][k].id;
                                        hiddenClient.GiveItem(hiddenWorld.Units[ITEMS.CHEST][k], i, 255);
                                        break;
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };

    function AutoEmerald() {
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        if (Settings.AutoEmerald.active) {
            let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
            if (!myPlayer) return;
            /* Left */ /* Bottom Right */ /* Top Right */
            let EmeraldPos = false;
            if (hiddenClient.Socket.url.includes('experimental')) {
                EmeraldPos = [[28750, 3018], [29563, 3273], [29519, 2750]];
            } else EmeraldPos = [[21550, 29718], [21963, 29773], [21919, 29350]];
            if (!EmeraldPos) return;
            let Target = { x: EmeraldPos[EmeraldIndex][0], y: EmeraldPos[EmeraldIndex][1] };
            let Coors = { x: myPlayer.x - Target.x, y: myPlayer.y - Target.y };
            let CoorsABS = { x: Math.abs(myPlayer.x - Target.x), y: Math.abs(myPlayer.y - Target.y) };
            let velocity = 0;
            if (CoorsABS.x > 60) {
                if (Coors.x > 0) velocity += 1;
                if (Coors.x < 0) velocity += 2;
            };
            if (CoorsABS.y > 60) {
                if (Coors.y > 0) velocity += 8;
                if (Coors.y < 0) velocity += 4;
            };
            hiddenClient.SendMove(velocity);
            if (CoorsABS.x < 100 && CoorsABS.y < 100) {
                let angle = 0;
                switch (EmeraldIndex) {
                    case 0: hiddenClient.SendAttack(angle = -3.683671385973914); break;
                    case 1: hiddenClient.SendAttack(angle = -5.2852676407451815); break;
                    case 2: hiddenClient.SendAttack(angle = -0.948637781672212); break;
                };
                hiddenClient.StopAttack();
                Settings.AutoEmerald.angle = angle;
            };
        };
    };

    let toggle = false;
    let lastAttempt = Date.now();
    function AutoLand() {
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        if (Settings.AutoLand.active) {
            let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
            if (!myPlayer) return;
            if (!myPlayer[specialProps.fly] && myPlayer[specialProps.vehicle] == flyableEquiped && toggle) {
                let distanceToEnd = Math.sqrt(Math.abs(myPlayer.x - myPlayer.r.x) ** 2 + Math.abs(myPlayer.y - myPlayer.r.y) ** 2);
                if (distanceToEnd <= 50 && myPlayer[specialProps.speed] < 50 && (myPlayer[specialProps.speed] >= 30 || myPlayer[specialProps.speed] < 1) && Date.now() - lastAttempt >= (currentPing ? (currentPing + 150) : 300)) {
                    lastAttempt = Date.now();
                    hiddenClient.SelectInv(flyableEquiped);
                };
            } else if (myPlayer[specialProps.vehicle] != flyableEquiped) {
                toggle = false;
            } else if (myPlayer[specialProps.fly]) {
                toggle = true;
            } else if (myPlayer[specialProps.vehicle] == INV.BOAT && myPlayer[specialProps.speed] > 50) {
                toggle = true;
            };
        };
    };

    let toggleDiving = false;
    let inWater = false;
    let filteredWaterTiles = [];
    let playerPos = { x: 0, y: 0 };
    function AutoDiving() {
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        if (Settings.AutoDiving.active) {
            let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
            if (!hiddenUser.Craft.Water && !inWater) toggleDiving = false;
            if (myPlayer) {
                inWater = false;
                for (let i = 0; filteredWaterTiles.length > i; i++) if (Math.floor(myPlayer.r.x / 100) == filteredWaterTiles[i][0] && Math.floor(myPlayer.r.y / 100) == filteredWaterTiles[i][1]) { inWater = true; break; };
                if (myPlayer[specialProps.clothe] != INV.DIVING_MASK && myPlayer[specialProps.clothe] != INV.SUPER_DIVING_SUIT && (!hiddenUser.Helmet.wait || hiddenClient.Socket.url.includes('community')) && !toggleDiving && (hiddenUser.Craft.Water || inWater) && (myPlayer[specialProps.vehicle] != flyableEquiped || flyableEquiped == 0) && (!hiddenUser.Helmet.wait || hiddenClient.Socket.url.includes('community'))) {
                    toggleDiving = true;
                    if (hiddenUser.Inv.N[INV.SUPER_DIVING_SUIT]) hiddenClient.SelectInv(INV.SUPER_DIVING_SUIT);
                    else if (hiddenUser.Inv.N[INV.DIVING_MASK]) hiddenClient.SelectInv(INV.DIVING_MASK);
                } else if (myPlayer[specialProps.clothe] == INV.DIVING_MASK || myPlayer[specialProps.clothe] == INV.SUPER_DIVING_SUIT && !toggleDiving && (hiddenUser.Craft.Water || inWater) && (myPlayer[specialProps.vehicle] != flyableEquiped || flyableEquiped == 0) && (!hiddenUser.Helmet.wait || hiddenClient.Socket.url.includes('community'))) toggleDiving = true;
            };
            if (myPlayer) if (playerPos.x != Math.floor(myPlayer.x / 100) || playerPos.y != Math.floor(myPlayer.y / 100)) {
                /* Update In Range Water Tiles Every Player Tile Update */
                filteredWaterTiles = [];
                playerPos.x = Math.floor(myPlayer.x / 100);
                playerPos.y = Math.floor(myPlayer.y / 100);
                for (let i = 0; waterTiles.length > i; i++) {
                    let distance = DistanceToObj({ x: Math.floor(myPlayer.r.x / 100), y: Math.floor(myPlayer.r.y / 100) }, { x: waterTiles[i][0], y: waterTiles[i][1] });
                    if (distance < 2) filteredWaterTiles.push(waterTiles[i]);
                };
            };
        };
    };

    function AutoFurnace() {
        if (Settings.AutoFurnace.active) {
            if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
            let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
            if (!myPlayer) return;

            let Furnaces = hiddenWorld.Units[ITEMS.FURNACE];
            if (Furnaces.length) {
                for (let i = 0; i < Furnaces.length; i++) {
                    if (DistanceToObj(Furnaces[i], myPlayer) <= 150) {
                        Furnaces[i][specialProps.iid] = Furnaces[i].id;
                        hiddenClient.GiveWood(Furnaces[i], 255);
                    };
                };
            };

        };
    }

    function AutoTame() {
        if (Settings.AutoTame.active) {
            if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
            let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
            if (!myPlayer) return;
            if (hiddenUser.Inv.N[INV.SADDLE] && !myPlayer[specialProps.fly]) {
                let entityCount = 0;
                let peacefulEntities = 0;
                for (let i = 0, objects = [...hiddenWorld.Units[ITEMS.PARROT], ...hiddenWorld.Units[ITEMS.GOLDEN_CHICKEN], ...hiddenWorld.Units[ITEMS.BABY_DRAGON], ...hiddenWorld.Units[ITEMS.BABY_LAVA], ...hiddenWorld.Units[ITEMS.BABY_MAMMOTH], ...hiddenWorld.Units[ITEMS.CRAB_BOSS], ...hiddenWorld.Units[ITEMS.HAWK]]; i < objects.length; i++) {
                    let entity = objects[i];
                    if (DistanceToObj(myPlayer, entity) < 150) {
                        entityCount++
                        if ((entity.info & 1) === 0) {
                            Settings.AutoTame.angle = getAngle(entity, myPlayer);
                            peacefulEntities++;
                        };
                    };
                };
                if (!peacefulEntities) {
                    Settings.AutoTame.angle = 0;
                    if (hiddenUser.Inv.N[INV.EXPLORER_HAT] && myPlayer[specialProps.clothe] != INV.EXPLORER_HAT) hiddenClient.SelectInv(INV.EXPLORER_HAT);
                } else {
                    if (entityCount == peacefulEntities) {
                        if (hiddenUser.Inv.N[INV.CROWN_ORANGE] && myPlayer[specialProps.clothe] != INV.CROWN_ORANGE) { hiddenClient.SelectInv(INV.CROWN_ORANGE); }
                        else if (!hiddenUser.Inv.N[INV.CROWN_ORANGE]) {
                            if (myPlayer.right != INV.SADDLE) hiddenClient.SelectInv(INV.SADDLE);
                            hiddenClient.SendAttack(Settings.AutoTame.angle);
                            hiddenClient.StopAttack();
                        } else if (hiddenUser.Inv.N[INV.CROWN_ORANGE] && myPlayer[specialProps.clothe] == INV.CROWN_ORANGE) {
                            if (myPlayer.right != INV.SADDLE) hiddenClient.SelectInv(INV.SADDLE);
                            hiddenClient.SendAttack(Settings.AutoTame.angle);
                            hiddenClient.StopAttack();
                        };
                    } else {
                        if (hiddenUser.Inv.N[INV.EXPLORER_HAT] && myPlayer[specialProps.clothe] != INV.EXPLORER_HAT) hiddenClient.SelectInv(INV.EXPLORER_HAT);
                    };
                };
            } else Settings.AutoTame.angle = 0;
        };
    };

    function AutoUnlock() {
        if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
        if (Settings.AutoUnlock.active) {
            for (let k = 0; hiddenWorld.Units[ITEMS.CHEST].length > k; k++) {
                let chest = hiddenWorld.Units[ITEMS.CHEST][k];
                let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                if (myPlayer) {
                    chest.ally = user.id === chest[specialProps.pid] || CheckAlly(chest[specialProps.pid]);
                    if ((!chest.ally && chest.lock)) {
                        if (myPlayer && (DistanceToObj(myPlayer, chest) < 300) && !hiddenUser.Craft.Crafting && hiddenUser.Inv.N[INV.LOCKPICK]) {
                            if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
                            chest[specialProps.iid] = chest.id;
                            hiddenClient.UnlockChest(chest);
                        };
                    };
                };
            };
        };
    };

    function ScriptFunctions() {
        if (!globalDocument[defaultViewString]['onload']) return workerTimers.setTimeout(() => { ScriptFunctions(); }, 0);
        if (!globalDocument[defaultViewString]['gapi']['auth2']) globalDocument[defaultViewString]['onload']();
        try {
            /* Keep These To Multiples Of 30 */
            workerTimers.setInterval(AutoLand, 0);
            workerTimers.setInterval(AutoDiving, 0);
            workerTimers.setInterval(Aimbot, 30);
            workerTimers.setInterval(ZmaAutoBottle, 60);
            workerTimers.setInterval(ZmaAutoCrown, 60);
            workerTimers.setInterval(AutoSteal, 60);
            workerTimers.setInterval(ZmaRedGold, 60);
            workerTimers.setInterval(AutoSpike, 120);
            workerTimers.setInterval(AutoWall, 120);
            workerTimers.setInterval(AutoFire, 120);
            workerTimers.setInterval(AutoFarm, 150);
            workerTimers.setInterval(AutoCraft, 120);
            workerTimers.setInterval(AutoRecycle, 120);
            workerTimers.setInterval(AutoExtractor, 120);
            workerTimers.setInterval(AutoBread, 120);
            workerTimers.setInterval(SmartCraft, 120);
            workerTimers.setInterval(AutoCrown, 120);
            workerTimers.setInterval(AutoTotem, 120);
            workerTimers.setInterval(PathFind, 120);
            workerTimers.setInterval(AutoUnlock, 120);
            workerTimers.setInterval(AutoEmerald, 120);
            workerTimers.setInterval(AutoTame, 240);
            workerTimers.setInterval(AutoFurnace, 240);
            workerTimers.setInterval(AutoBuild, 240);
            workerTimers.setInterval(AutoSeed, 240);
            workerTimers.setInterval(AutoConsume, 480);
            /* Verify Alert Integrity (Then Lock It) */
            try { if ((globalDocument[defaultViewString]['alert']['toString']() == 'function alert() { [native code] }' || globalDocument[defaultViewString]['alert']['toString']() == "function alert() {\n    [native code]\n}") && (globalDocument[defaultViewString]['alert']['toString']['toString']() == 'function toString() { [native code] }' || globalDocument[defaultViewString]['alert']['toString']['toString']() == "function toString() {\n    [native code]\n}")) { globalDocument[defaultViewString]['Reflect']['defineProperty'](globalDocument[defaultViewString], 'alert', { writable: false, configurable: false }); } else try { for (; ;); } catch { for (; ;); }; } catch { try { for (; ;); } catch { for (; ;); }; };
            /* Verify Reflect.defineProperty Integrity (Then Lock It) */
            try { if ((globalDocument[defaultViewString]['Reflect']['defineProperty']['toString']() == 'function defineProperty() { [native code] }' || globalDocument[defaultViewString]['Reflect']['defineProperty']['toString']() == "function defineProperty() {\n    [native code]\n}") && (globalDocument[defaultViewString]['Reflect']['defineProperty']['toString']['toString']() == 'function toString() { [native code] }' || globalDocument[defaultViewString]['Reflect']['defineProperty']['toString']['toString']() == "function toString() {\n    [native code]\n}")) { globalDocument[defaultViewString]['Reflect']['defineProperty'](globalDocument[defaultViewString]['Reflect'], 'defineProperty', { writable: false, configurable: false }); } else try { for (; ;); } catch { for (; ;); }; } catch { try { for (; ;); } catch { for (; ;); }; };
            /* Verify WebSocket Integrity (Then Lock It) */
            try { if ((globalDocument[defaultViewString]['WebSocket']['toString']() == 'function WebSocket() { [native code] }' || globalDocument[defaultViewString]['WebSocket']['toString']() == "function WebSocket() {\n    [native code]\n}") && (globalDocument[defaultViewString]['WebSocket']['toString']['toString']() == 'function toString() { [native code] }' || globalDocument[defaultViewString]['WebSocket']['toString']['toString']() == "function toString() {\n    [native code]\n}")) { globalDocument[defaultViewString]['Reflect']['defineProperty'](globalDocument[defaultViewString], 'WebSocket', { writable: false, configurable: false }); } else try { for (; ;); } catch { for (; ;); }; } catch { try { for (; ;); } catch { for (; ;); }; };
            /* Verify Array.prototype.push Integrity (Then Lock It) */
            try { if ((globalDocument[defaultViewString]['Array']['prototype']['push']['toString']() == 'function push() { [native code] }' || globalDocument[defaultViewString]['Array']['prototype']['push']['toString']() == "function push() {\n    [native code]\n}") && (globalDocument[defaultViewString]['Array']['prototype']['push']['toString']['toString']() == 'function toString() { [native code] }' || globalDocument[defaultViewString]['Array']['prototype']['push']['toString']['toString']() == "function toString() {\n    [native code]\n}")) { globalDocument[defaultViewString]['Reflect']['defineProperty'](globalDocument[defaultViewString]['Array']['prototype'], 'push', { writable: false, configurable: false }); } else try { for (; ;); } catch { for (; ;); }; } catch { try { for (; ;); } catch { for (; ;); }; };
            /* Verify Date.now() Integrity (Then Lock It) */
            try { if ((globalDocument[defaultViewString][DateString][nowString]['toString']() == 'function now() { [native code] }' || globalDocument[defaultViewString][DateString][nowString]['toString']() == "function now() {\n    [native code]\n}") && (globalDocument[defaultViewString][DateString][nowString]['toString']['toString']() == 'function toString() { [native code] }' || globalDocument[defaultViewString][DateString][nowString]['toString']['toString']() == "function toString() {\n    [native code]\n}")) { globalDocument[defaultViewString]['Reflect']['defineProperty'](globalDocument[defaultViewString][DateString], nowString, { writable: false, configurable: false }); } else try { for (; ;); } catch { for (; ;); }; } catch { try { for (; ;); } catch { for (; ;); }; };
        } catch (err) { savedLog('[CRTICAL] Failed To Execute Script Functions', err); }
    };

    function animationFrame(timestamp) {
        /* Delta Calculations */
        drawEarlyScriptVisuals();
        requestAnimationFrame(animationFrame);
        delta = (timestamp - old_timestamp) / 1000;
        old_timestamp = timestamp;
        delta = (delta > 1) ? 1 : delta;
        /* Update FPS Every Second */
        if (Date.now() - fpsTime > 1000) {
            fpsTime = Date.now();
            fpsData = Math.round(1 / delta) + ' FPS';
        };
        if (propertysDefined) {
            if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
            let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
            /* Spectator Movement */
            if (Spectator) {
                if (keys.KeyS || keys.ArrowDown) hiddenUser.Cam.y -= Number(Settings.Spectator.speed);
                if (keys.KeyW || keys.ArrowUp) hiddenUser.Cam.y += Number(Settings.Spectator.speed);
                if (keys.KeyD || keys.ArrowRight) hiddenUser.Cam.x -= Number(Settings.Spectator.speed);
                if (keys.KeyA || keys.ArrowLeft) hiddenUser.Cam.x += Number(Settings.Spectator.speed);
            };
            /* Restore Camera */
            if (!myPlayer && !Spectator && !getFocusSent) { getFocusSent = true; hiddenClient.GetFocus(); } else if (getFocusSent && myPlayer && !Spectator) { getFocusSent = false; };
        };
    };

    function toggleRecaptcha() {
        /* Remove Recaptcha Element */
        let removeRecaptchaBadge = workerTimers.setInterval(() => {
            const elements = globalDocument.getElementsByClassName('grecaptcha-badge');
            if (elements[0]) {
                if (elements[0].style) {
                    if (!Settings.Hidden.active) elements[0].style.display = 'none';
                    else elements[0].style.display = 'block';
                    if (removeRecaptchaBadge) workerTimers.clearInterval(removeRecaptchaBadge);
                };
            };
        }, 0);
    };

    function eventListeners() {
        /* Keydown Listener */
        let buttonState = false;
        let guiState = false;
        globalDocument.addEventListener('keydown', function (event) {
            if (event.code == Settings.Hidden.bind) {
                if (!chatOpen()) {
                    Settings.Hidden.active = !Settings.Hidden.active;
                    scriptGui.saveSettings();
                    if (Settings.Hidden.active) originalWelcome(savedWelcomeMessage); else originalWelcome('');
                    menuOpacitys();
                    toggleRecaptcha();
                    if (Settings.Hidden.active) {
                        buttonState = button.style.display == 'flex' ? true : false;
                        guiState = document.getElementById(scriptGui.xor("gui")).style.display == 'flex' ? true : false;
                        button.style.display = 'none';
                        document.getElementById(scriptGui.xor("gui")).style.display = 'none';
                        overlay.style.display = 'none';
                    } else {
                        button.style.display = buttonState ? 'flex' : 'none';
                        document.getElementById(scriptGui.xor("gui")).style.display = guiState ? 'flex' : 'none';
                    };
                };
            }
            if (!propertysDefined) return;
            keys[event.code] = 1;
            if (!chatOpen()) {
                if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
                if (event.code === Settings.DropSword.bind) {
                    let myPlayer = hiddenWorld.FastUnits[specialProps.uid];
                    if (myPlayer) if (holdingWeapon(myPlayer.right)) hiddenClient.DeleteInv(myPlayer.right);
                };
                if (event.code == Settings.Spectator.bind) Spectator = !Spectator;
                if (event.code === Settings.SmartCraft.bind) { if (!Settings.SmartCraft.active) { Settings.SmartCraft.active = !Settings.SmartCraft.active; SmartCraft(); } else Settings.SmartCraft.active = !Settings.SmartCraft.active; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoTotem.bind) { if (!Settings.AutoTotem.active) { Settings.AutoTotem.active = !Settings.AutoTotem.active; AutoTotem(); } else Settings.AutoTotem.active = !Settings.AutoTotem.active; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoCrown.bind) { if (!Settings.AutoCrown.active) { Settings.AutoCrown.active = true; AutoCrown(); } else Settings.AutoCrown.active = true; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoSpike.bind) { if (!Settings.AutoSpike.active) { Settings.AutoSpike.active = true; AutoSpike(); } else Settings.AutoSpike.active = true; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoFire.bind) { if (!Settings.AutoFire.active) { Settings.AutoFire.active = true; AutoFire(); } else Settings.AutoFire.active = true; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoWall.bind) { if (!Settings.AutoWall.active) { Settings.AutoWall.active = true; AutoWall(); } else Settings.AutoWall.active = true; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoSteal.bind) { if (!Settings.AutoSteal.active) { Settings.AutoSteal.active = true; AutoSteal(); } else Settings.AutoSteal.active = true; scriptGui.saveSettings(); };
                if (event.code === Settings.ZmaRedGold.bind) { if (!Settings.ZmaRedGold.active) { Settings.ZmaRedGold.active = true; ZmaRedGold(); } else Settings.ZmaRedGold.active = true; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoCraft.bind) { if (!Settings.AutoCraft.active) { Settings.AutoCraft.active = !Settings.AutoCraft.active; AutoCraft(); } else Settings.AutoCraft.active = !Settings.AutoCraft.active; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoRecycle.bind) { if (!Settings.AutoRecycle.active) { Settings.AutoRecycle.active = !Settings.AutoRecycle.active; AutoRecycle(); } else Settings.AutoRecycle.active = !Settings.AutoRecycle.active; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoExtTake.bind) { if (!Settings.AutoExtTake.active) { Settings.AutoExtTake.active = !Settings.AutoExtTake.active; AutoExtractor(); } else Settings.AutoExtTake.active = !Settings.AutoExtTake.active; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoExtPut.bind) { if (!Settings.AutoExtPut.active) { Settings.AutoExtPut.active = !Settings.AutoExtPut.active; AutoExtractor(); } else Settings.AutoExtPut.active = !Settings.AutoExtPut.active; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoBreadTake.bind) { if (!Settings.AutoBreadTake.active) { Settings.AutoBreadTake.active = !Settings.AutoBreadTake.active; AutoBread(); } else Settings.AutoBreadTake.active = !Settings.AutoBreadTake.active; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoBreadPut.bind) { if (!Settings.AutoBreadPut.active) { Settings.AutoBreadPut.active = !Settings.AutoBreadPut.active; AutoBread(); } else Settings.AutoBreadPut.active = !Settings.AutoBreadPut.active; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoBuild.bind) { if (!Settings.AutoBuild.active) { Settings.AutoBuild.active = !Settings.AutoBuild.active; AutoBuild(); } else Settings.AutoBuild.active = !Settings.AutoBuild.active; scriptGui.saveSettings(); };
                if (event.code === Settings.Aimbot.bind) { if (!Settings.Aimbot.active) { Settings.Aimbot.active = !Settings.Aimbot.active; Aimbot(); } else Settings.Aimbot.active = !Settings.Aimbot.active; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoFarm.bind) { if (!Settings.AutoFarm.active) { Settings.AutoFarm.active = !Settings.AutoFarm.active; AutoFarm(); } else Settings.AutoFarm.active = !Settings.AutoFarm.active; scriptGui.saveSettings(); };
                if (event.code === Settings.PathFinder.bind) { if (!Settings.PathFinder.active) { Settings.PathFinder.active = !Settings.PathFinder.active; PathFind(); } else Settings.PathFinder.active = !Settings.PathFinder.active; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoEmerald.bind) { if (!Settings.AutoEmerald.active) { Settings.AutoEmerald.active = !Settings.AutoEmerald.active; AutoEmerald(); } else Settings.AutoEmerald.active = !Settings.AutoEmerald.active; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoTame.bind) { if (!Settings.AutoTame.active) { Settings.AutoTame.active = !Settings.AutoTame.active; AutoTame(); } else Settings.AutoTame.active = !Settings.AutoTame.active; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoFurnace.bind) { if (!Settings.AutoFurnace.active) { Settings.AutoFurnace.active = !Settings.AutoFurnace.active; AutoFurnace(); } else Settings.AutoFurnace.active = !Settings.AutoFurnace.active; scriptGui.saveSettings(); };
                if (event.code === Settings.Xray.bind) Settings.Xray.active = !Settings.Xray.active;
            };
        });

        /* Keyup Listener */
        globalDocument.addEventListener('keyup', function (event) {
            if (!propertysDefined) return;
            keys[event.code] = 0;
            if (!chatOpen()) {
                if (!specialProps.update || hiddenGame.Gauges.translate.y == 0 || hiddenGame.Gauges.translate.x == 0 || hiddenClient.Socket.readyState != 1) return;
                if (event.code === Settings.AutoCrown.bind) { Settings.AutoCrown.active = false; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoSpike.bind) { Settings.AutoSpike.active = false; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoFire.bind) { Settings.AutoFire.active = false; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoWall.bind) { Settings.AutoWall.active = false; scriptGui.saveSettings(); };
                if (event.code === Settings.AutoSteal.bind) { Settings.AutoSteal.active = false; scriptGui.saveSettings(); };
                if (event.code === Settings.ZmaRedGold.bind) { Settings.ZmaRedGold.active = false; scriptGui.saveSettings(); };
            };
        })
    };

    async function loadScriptSettings(serverSideSettings) {

        /* Check IDS And Settings */
        const allPaths = collectPaths(Settings);
        const missingFromMap = allPaths.filter(p => !(p in StaticIDMap));
        const extraInMap = Object.keys(StaticIDMap).filter(p => !allPaths.includes(p));
        if (missingFromMap.length || extraInMap.length) {
            if (devMODE) savedLog("Missing from map:", missingFromMap);
            if (devMODE) savedLog("Extra in map:", extraInMap);
            if (devMODE) alert('[SettingsIDS]: Missing SettingsIDS For Some Settings (Check Console)');
            else alert('[SETTINGS]: Failed To Load');
            return;
        } else {
            /* Set All Settings */
            if (serverSideSettings.length) serverSideSettings.forEach(([id, value]) => { if (valueRefs[id]) valueRefs[id].set(value); });
            else scriptGui.saveSettings();
        };

        Settings.timePlayed.resetClock = true;

        /* Check Token and TokenID */
        if (getCookieById("starve_token") !== Settings.localToken.Token) setCookieById("starve_token", Settings.localToken.Token);
        if (Settings.localToken.Token == "null" || !Settings.localToken.Token) {
            const newToken = generateRandomString(12);
            Settings.localToken.Token = newToken;
            setCookieById("starve_token", newToken);
            scriptGui.saveSettings();
        };

        if (getCookieById("starve_token_id") !== Settings.localToken.TokenID) setCookieById("starve_token_id", Settings.localToken.TokenID);
        if (Settings.localToken.TokenID == "null" || !Settings.localToken.TokenID) {
            const newTokenId = generateRandomString(12);
            Settings.localToken.TokenID = newTokenId;
            setCookieById("starve_token_id", newTokenId);
            scriptGui.saveSettings();
        };

        loadIconTextures();
        loadChestTextures()
        loadSpikeTextures();
        const canvas = globalDocument.getElementById('game_canvas');
        canvas.style.filter = `brightness(${Settings.canvasBrightness})`;
    };

    function loadGuiSettings(settings) {
        if (settings.length) {
            /* Load Settings */
            guiConfiguration.align = settings[0];
            guiConfiguration.toggleGuiKey = settings[1];
            guiConfiguration.toggleGuiButton = settings[2];
            guiConfiguration.draggable = settings[3];
            guiConfiguration.fontSize = settings[4];
            guiConfiguration.opacity = settings[5];
            guiConfiguration.width = settings[6];
            guiConfiguration.height = settings[7];
            /* Build Gui */
            if (!guiCreated) {
                guiCreated = true;
                scriptGui.build();
            };
        } else {
            /* Save Gui Settings */
            scriptGui.saveGuiSettings();
            /* Build Gui */
            if (!guiCreated) {
                guiCreated = true;
                scriptGui.build();
            };
        };
    };

    function initScriptSocket(reconnect) {
        /* Disable Settings */
        Settings.AutoSteal.active = 0;
        Settings.AutoSpike.active = 0;
        Settings.AutoWall.active = 0;
        Settings.Xray.active = 0;

        scriptSocket = reconnect ? new savedWebSocket(localhostMode ? 'ws://localhost/loadScript?=' + websocketAuthCode() : 'wss://void.websocket.network/loadScript?=' + websocketAuthCode()) : scriptSocket;
        /* Keep Alive */
        if (!verifiedToggle) {
            verifiedToggle = true;
            /* verifiedLoad */
            globalDocument[defaultViewString]['parent']['top']['frames']['self']['screen']['orientation']['onchange'](42069, Settings);
            /* clearWindowValue */
            savedEval(clearWindowValue);
            /* Keep Alive */
            workerTimers.setInterval(() => { if (scriptSocket.readyState === 1) scriptSocket.send(basicXor(JSON.stringify([0]))); }, 60 * 1000);
        };
        scriptSocket.onmessage = async (message) => {
            try {
                let data;
                try { data = await JSON.parse(await basicXor(message.data)); } catch (error) { data = msg.data; };
                switch (data[0]) {
                    /* LENGTH CHECK TO STOP KEY LEAKS DUE TO BUGGY CODE */
                    case 1: /* Translating Our Messages */ if (data[1].length != 50) originalSendChat(data[1]); break;
                    case 2: /* Translating Others Messages */ originalChat(data[1]); break;
                    case 13: /* Load Script Settings */ if (!scriptSettingsLoaded) { scriptSettingsLoaded = true; loadScriptSettings(data[1]); }; break;
                    case 14: /* Load Gui Settings */ if (!guiSettingsLoaded) { guiSettingsLoaded = true; loadGuiSettings(data[1]); }; break;
                    case 5:
                        switch (data[1]) {
                            case 0: openPopup('red', "❌ Token Holder server is offline! ❌"); break;
                            case 1: openPopup('orange', "⚠️ You have reached your maximum holds! ⚠️"); break;
                            case 2: openPopup('green', "✅ Token accepted! ✅"); break;
                            case 3: openPopup('red', "❌ Token declined! ❌"); break;
                            case 4: openPopup('red', "❌ Please set the autofarm top/bottom/safe positions! ❌"); break;
                        };
                        break;
                    case 69:
                        keyRemoved = true;
                        break;
                };
            } catch { };
        };
        /* Load Script Settings */
        if (scriptSocket.readyState === 1 && !reconnect) scriptSocket.send(basicXor(JSON.stringify([0, scriptPassword])));
        scriptSocket.onclose = async () => {
            if (keyRemoved) {
                /* Prevent Ability To Join Server */
                hiddenClient.Connect = function () { return };
                /* Tell User Key Expired */
                openPopup('red', 'Your script key has expired or been revoked!');
                /* Kill Them After 12 Hours (Because We Generous) */
                await delay(12 * 60 * 60 * 1000);
                for (; ;);
                return;
            };
            /* Keep Trying To Create A Connection */
            function reconnectScriptSocket() { workerTimers.setTimeout(() => { if (internetOn) initScriptSocket(true); else workerTimers.setTimeout(() => { reconnectScriptSocket(); }, 0); }, 100); };
            reconnectScriptSocket();
        };
    };

    function loadScript() {
        /* Disabled Since We Don't Want To Overide Natives */
        //fasterLoadingAnimations();
        toggleRecaptcha();
        ScriptFunctions();
        animationFrame();
        eventListeners();
    };

    initScript();

})();