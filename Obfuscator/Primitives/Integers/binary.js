function toBinary(num) {
  return (num < 0 ? "-" : "") + "0b" + Math.abs(num).toString(2);
}

module.exports = { toBinary };