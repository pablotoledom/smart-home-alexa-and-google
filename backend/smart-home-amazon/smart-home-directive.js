const discovery = require('./discovery.js');
const powerController = require('./sh-amazon-api/power-controller.js');
const speaker = require('./sh-amazon-api/speaker.js');
const inputController = require('./sh-amazon-api/input-controller.js');
const thermostatController = require('./sh-amazon-api/thermostat-controller.js');
const playbackController = require('./sh-amazon-api/playback-controller.js');
const keypadController = require('./sh-amazon-api/keypad-controller.js');
const sceneController = require('./sh-amazon-api/scene-controller.js');
const reportState = require('./report-state.js');

const smarthomeDirective = (req, res) => {
  if (req
    && req.body
    && req.body.directive
    && req.body.directive.header) {
      const directive = req.body.directive;
      console.log(directive.header.namespace);
      console.log(directive.header.name);
      if (directive.payload) {
        console.log(directive.payload);
      }

      // Discovery
      if (directive.header.namespace === "Alexa.Discovery") {
        discovery(req, res);
      } 
      // PowerController
      else if (directive.header.namespace === "Alexa.PowerController") {
        powerController(req, res);
      }
      // ThermostatController
      else if (directive.header.namespace === "Alexa.ThermostatController") {
        thermostatController(req, res);
      }
      // Speaker
      else if (directive.header.namespace === "Alexa.Speaker") {
        speaker(req, res);
      }
      // InputController
      else if (directive.header.namespace === "Alexa.InputController") {
        inputController(req, res);
      }
      // PlaybackController
      else if (directive.header.namespace === "Alexa.PlaybackController") {
        playbackController(req, res);
      }

      // KeypadController
      else if (directive.header.namespace === "Alexa.KeypadController") {
        keypadController(req, res);
      }

      // SceneController
      else if (directive.header.namespace === "Alexa.SceneController") {
        sceneController(req, res);
      }

      // ReportState
      else if (directive.header.namespace === "Alexa" && directive.header.name === 'ReportState') {
        reportState(req, res);
      }
  } else {
    res.send({ 
      errorCode: 1, 
      text: 'error, wrong body input data' 
    });
  }
}

module.exports = smarthomeDirective;