const _ = require("lodash");
const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};

const getSelectData = (select = "") => {
  return Object.fromEntries(select.map((item) => [item, 1]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) delete obj[key];
  });
  return obj;
};

const updateNestedObject = (obj) => {
  const final = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object") {
      Object.keys(obj[key]).forEach((k) => {
        final[`${key}.${k}`] = obj[key][k];
      });
    } else {
      final[key] = obj[key];
    }
  });
  return final;
};

module.exports = {
  getInfoData,
  getSelectData,
  removeUndefinedObject,
  updateNestedObject,
};
