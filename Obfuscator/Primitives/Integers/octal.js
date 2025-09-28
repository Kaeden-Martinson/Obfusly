function toOctal(num) {
  return (num < 0 ? "-" : "") + "0o" + Math.abs(num).toString(8);
};

module.exports = { toOctal };