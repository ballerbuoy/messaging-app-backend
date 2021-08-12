const checkUserInput = (payload, keys) => {
  if (!payload) {
    return false;
  }

  const keyArr = Object.keys(payload);
  return keys.reduce((result, key) => {
    return result && keyArr.includes(key);
  }, true);
};

const responseSender = (promise, res) =>
  promise
    .then((userData) => res.status(200).json(userData))
    .catch((err) => {
      const { code, message } = err;
      console.log(err);
      res.status(code || 500).json(JSON.stringify({ error: message }));
    });

const binarySearch = (arr, key) => {
  if (!arr.length) return undefined;
  let low = 0,
    high = arr.length,
    ans = undefined;

  while (low <= high) {
    const mid = ~~((high - low) / 2 + low);
    if (arr[mid].timestamp === key) {
      ans = mid;
      break;
    } else if (arr[mid].timestamp < key) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return ans;
};

module.exports = { checkUserInput, responseSender, binarySearch };
