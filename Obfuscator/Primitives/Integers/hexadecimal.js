function toHex(num) {
  return (num < 0 ? "-" : "") + "0x" + Math.abs(num).toString(16);
}

module.exports = { toHex };