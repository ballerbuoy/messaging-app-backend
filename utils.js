function checkUserInput(payload, keys) {
  if (!payload) {
    return false;
  }

  const keyArr = Object.keys(payload);
  return keys.reduce((result, key) => {
    return result && keyArr.includes(key);
  }, true);
}

module.exports = { checkUserInput };
