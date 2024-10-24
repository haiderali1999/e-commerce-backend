const bcrypt = require("bcrypt");

const validObject = (object = {}, keys = [], res) => {
  const result = {};
  let valid = true;
  for (let key of keys) {
    if (!object[key]) {
      result[key] = "Field is required";
      valid = false;
    }
  }
  if (!valid) res.json({ missing_keys: result });
};

const delKeys = (obj, keys) => {
  const result = { ...obj };
  for (let key of keys) {
    delete result[key];
  }
  return result;
};

const hashPassword = async (password) => {
  const { salt } = process.env;

  return bcrypt.hash(password, +salt);
};

module.exports = { validObject, delKeys, hashPassword };
