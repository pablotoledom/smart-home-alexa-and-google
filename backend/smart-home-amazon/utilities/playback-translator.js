const playbackTranslator = (speed, reverse) => {
  let speedtranslated;

  if (reverse) {
    switch (speed) {
      case "Play":
        speedtranslated = "RESUME";
        break;
      case "Next":
        speedtranslated = "NEXT";
        break;
      case "Previous":
        speedtranslated = "PREVIOUS";
        break;
      case "Pause":
        speedtranslated = "PAUSE";
        break;

      default:
        speedtranslated = "STOP";
        break;
    }
  } else {
    switch (speed) {
      case "RESUME":
        speedtranslated = "Play";
        break;
      case "NEXT":
        speedtranslated = "Next";
        break;
      case "PREVIOUS":
        speedtranslated = "Previous";
        break;
      case "PAUSE":
        speedtranslated = "Pause";
        break;

      default:
        speedtranslated = "Stop";
        break;
    }
  }

  return speedtranslated;
};

module.exports = playbackTranslator;
