const validateAndFind = (object, attribute, value) => {
  let resolve ;

  if (object && typeof object === 'object' && object.length > 0) {
    resolve = object.find(item=>item[attribute]===value);
  }

  return resolve;
}

module.exports = validateAndFind;