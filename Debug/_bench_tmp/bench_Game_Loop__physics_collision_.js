
var __bench_start = Date.now();

var entities = [];
for (var i = 0; i < 50; i++) {
  entities.push({
    x: Math.random() * 800,
    y: Math.random() * 600,
    vx: (Math.random() - 0.5) * 10,
    vy: (Math.random() - 0.5) * 10,
    width: 10 + Math.random() * 20,
    height: 10 + Math.random() * 20,
    health: 100,
    active: true,
    type: i % 3 === 0 ? 'enemy' : i % 3 === 1 ? 'bullet' : 'player'
  });
}

function updatePhysics(dt) {
  for (var i = 0; i < entities.length; i++) {
    var e = entities[i];
    if (!e.active) continue;
    e.x += e.vx * dt;
    e.y += e.vy * dt;
    e.vy += 0.5 * dt;
    if (e.x < 0 || e.x > 800) e.vx *= -0.8;
    if (e.y < 0 || e.y > 600) { e.vy *= -0.8; e.y = Math.min(600, Math.max(0, e.y)); }
  }
}

function checkCollisions() {
  var count = 0;
  for (var i = 0; i < entities.length; i++) {
    for (var j = i + 1; j < entities.length; j++) {
      var a = entities[i], b = entities[j];
      if (!a.active || !b.active) continue;
      if (a.x < b.x + b.width && a.x + a.width > b.x &&
          a.y < b.y + b.height && a.y + a.height > b.y) {
        count++;
        if (a.type === 'bullet' && b.type === 'enemy') b.health -= 10;
        if (b.type === 'bullet' && a.type === 'enemy') a.health -= 10;
      }
    }
  }
  return count;
}

function updateState() {
  var activeCount = 0;
  for (var i = 0; i < entities.length; i++) {
    if (entities[i].health <= 0) entities[i].active = false;
    if (entities[i].active) activeCount++;
  }
  return activeCount;
}

var totalCollisions = 0;
var lastActive = 0;
for (var frame = 0; frame < 300; frame++) {
  updatePhysics(0.016);
  totalCollisions += checkCollisions();
  lastActive = updateState();
}

var __RESULT__ = { collisions: totalCollisions, active: lastActive };

var __bench_end = Date.now();
var __bench_ms = __bench_end - __bench_start;
console.log(JSON.stringify({ test: "Game Loop (physics+collision)", ms: __bench_ms }));
