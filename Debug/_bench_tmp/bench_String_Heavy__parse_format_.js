
var __bench_start = Date.now();

function buildMessage(type, id, data) {
  return '{"type":"' + type + '","id":' + id + ',"data":' + JSON.stringify(data) + '}';
}

function parseKeyValue(str) {
  var result = {};
  var pairs = str.split('&');
  for (var i = 0; i < pairs.length; i++) {
    var kv = pairs[i].split('=');
    result[kv[0]] = kv[1] || '';
  }
  return result;
}

function formatNumber(n) {
  var s = String(n);
  var parts = s.split('.');
  var intPart = parts[0];
  var result = '';
  var count = 0;
  for (var i = intPart.length - 1; i >= 0; i--) {
    if (count > 0 && count % 3 === 0) result = ',' + result;
    result = intPart[i] + result;
    count++;
  }
  if (parts[1]) result += '.' + parts[1];
  return result;
}

var messages = [];
for (var i = 0; i < 1000; i++) {
  messages.push(buildMessage('update', i, { x: i * 1.5, y: i * 2.3, name: 'entity_' + i }));
}

var queryStr = 'name=test&x=100&y=200&health=100&type=player&active=true&score=9999&level=5';
var parsed = {};
for (var i = 0; i < 2000; i++) parsed = parseKeyValue(queryStr);

var formatted = [];
for (var i = 0; i < 1000; i++) formatted.push(formatNumber(Math.random() * 1000000));

var __RESULT__ = { messageCount: messages.length, parsedKeys: Object.keys(parsed).length, formattedCount: formatted.length };

var __bench_end = Date.now();
var __bench_ms = __bench_end - __bench_start;
console.log(JSON.stringify({ test: "String Heavy (parse+format)", ms: __bench_ms }));
