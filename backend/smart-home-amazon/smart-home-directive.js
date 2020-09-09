const discovery = require('./discovery.js');
const powerController = require('./power-controller.js');
const reportState = require('./report-state.js');

const smarthomeDirective = (req, res) => {
  if (req
    && req.body
    && req.body.directive
    && req.body.directive.header) {
      const directive = req.body.directive;
      console.log(directive.header.namespace);

      // Discovery
      if (directive.header.namespace === "Alexa.Discovery") {
        discovery(req, res);
      } 
      // PowerController
      else if (directive.header.namespace === "Alexa.PowerController") {
        powerController(req, res);
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