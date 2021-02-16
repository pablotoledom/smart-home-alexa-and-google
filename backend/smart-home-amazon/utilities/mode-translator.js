const translateModes = (mode) => {
  let modeTranslated;

  switch (mode) {
    case "auto":
      modeTranslated = "AUTO";
      break;
    case "cool":
      modeTranslated = "COOL";
      break;
    case "heat":
      modeTranslated = "HEAT";
      break;
    case "fan-only":
      modeTranslated = "ECO";
      break;
    default:
      modeTranslated = "OFF";
      break;
  }

  return modeTranslated;
};

module.exports = translateModes;
