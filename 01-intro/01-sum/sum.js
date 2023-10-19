const isNumber = (n) => typeof n === 'number';

function sum(a, b) {
  if (!isNumber(a) || !isNumber(b)) {
    throw new TypeError(`Not a valid input: ${a}, ${b}`);
  }

  return a + b;
}

module.exports = sum;
