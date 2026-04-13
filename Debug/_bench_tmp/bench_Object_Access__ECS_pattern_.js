
var __bench_start = Date.now();

function Entity(id, x, y, type) {
  this.id = id;
  this.position = { x: x, y: y };
  this.velocity = { x: 0, y: 0 };
  this.components = {};
  this.type = type;
  this.active = true;
}

Entity.prototype.addComponent = function(name, data) {
  this.components[name] = data;
  return this;
};

Entity.prototype.getComponent = function(name) {
  return this.components[name] || null;
};

Entity.prototype.update = function(dt) {
  this.position.x += this.velocity.x * dt;
  this.position.y += this.velocity.y * dt;
  var health = this.components.health;
  if (health) health.current = Math.max(0, health.current - health.decay * dt);
};

var pool = [];
for (var i = 0; i < 80; i++) {
  var e = new Entity(i, Math.random() * 800, Math.random() * 600, i % 4 === 0 ? 'boss' : 'grunt');
  e.addComponent('health', { current: 100, max: 100, decay: 0.1 });
  e.addComponent('render', { sprite: 'img_' + i, visible: true });
  e.velocity.x = (Math.random() - 0.5) * 5;
  e.velocity.y = (Math.random() - 0.5) * 5;
  pool.push(e);
}

var totalHealth = 0;
for (var frame = 0; frame < 300; frame++) {
  for (var i = 0; i < pool.length; i++) {
    pool[i].update(0.016);
    var h = pool[i].getComponent('health');
    if (h) totalHealth += h.current;
  }
}

var __RESULT__ = { entityCount: pool.length, totalHealth: Math.round(totalHealth) };

var __bench_end = Date.now();
var __bench_ms = __bench_end - __bench_start;
console.log(JSON.stringify({ test: "Object Access (ECS pattern)", ms: __bench_ms }));
