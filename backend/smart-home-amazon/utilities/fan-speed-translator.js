const fanSpeedTranslator = (speed, reverse) => {
  let speedtranslated;

  if (reverse) {
    switch (speed) {
      case "STAGE_1":
        speedtranslated = "low_key";
        break;
      case "STAGE_2":
        speedtranslated = "medium_key";
        break;
      case "STAGE_3":
        speedtranslated = "high_key";
        break;

      default:
        speedtranslated = "OFF";
        break;
    }
  } else {
    switch (speed) {
      case "low_key":
        speedtranslated = "STAGE_1";
        break;
      case "medium_key":
        speedtranslated = "STAGE_2";
        break;
      case "high_key":
        speedtranslated = "STAGE_3";
        break;

      default:
        speedtranslated = "OFF";
        break;
    }
  }

  return speedtranslated;
};

module.exports = fanSpeedTranslator;
