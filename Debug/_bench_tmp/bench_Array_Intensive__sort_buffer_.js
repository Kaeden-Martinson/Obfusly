
var __bench_start = Date.now();

function quickSort(arr, left, right) {
  if (left >= right) return;
  var pivot = arr[Math.floor((left + right) / 2)];
  var i = left, j = right;
  while (i <= j) {
    while (arr[i] < pivot) i++;
    while (arr[j] > pivot) j--;
    if (i <= j) { var temp = arr[i]; arr[i] = arr[j]; arr[j] = temp; i++; j--; }
  }
  if (left < j) quickSort(arr, left, j);
  if (i < right) quickSort(arr, i, right);
}

var data = [];
for (var i = 0; i < 5000; i++) data.push(Math.random() * 10000);

var sorted = data.slice();
quickSort(sorted, 0, sorted.length - 1);

var filtered = [];
for (var i = 0; i < data.length; i++) {
  if (data[i] > 2000 && data[i] < 8000) filtered.push(data[i]);
}
var mapped = [];
for (var i = 0; i < filtered.length; i++) mapped.push(Math.floor(filtered[i] * 2.5));
var sum = 0;
for (var i = 0; i < mapped.length; i++) sum += mapped[i];

var ringSize = 256;
var ringBuffer = [];
for (var rb = 0; rb < ringSize; rb++) ringBuffer.push(0);
var head = 0;
var tail = 0;
var count = 0;
for (var i = 0; i < 10000; i++) {
  ringBuffer[head] = i * 1.1;
  head = (head + 1) % ringSize;
  count++;
  if (count > 128) { tail = (tail + 1) % ringSize; count--; }
}

var __RESULT__ = { sortedFirst: sorted[0], sum: sum, ringCount: count };

var __bench_end = Date.now();
var __bench_ms = __bench_end - __bench_start;
console.log(JSON.stringify({ test: "Array Intensive (sort+buffer)", ms: __bench_ms }));
