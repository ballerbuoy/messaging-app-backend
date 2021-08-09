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
      const { message } = err;
      console.log(err);
      res.status(401).json({ error: message });
    });

module.exports = { checkUserInput, responseSender };
