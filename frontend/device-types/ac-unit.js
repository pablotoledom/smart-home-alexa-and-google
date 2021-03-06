/**
 * Copyright 2019, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *   http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { DeviceType } from './device-type';

let instance;

const type = 'action.devices.types.AC_UNIT'

class AcUnit extends DeviceType {
  constructor() {
    super()
    this.valuesArray = [{
      nicknames: ['ac unit'],
      roomHint: 'Living Room',
    }, {
      nicknames: ['temperature control system'],
      roomHint: 'Master Bedroom',
    }, {
      nicknames: ['hvac'],
      roomHint: 'Basement',
    }]
  }

  static createDevice() {
    if (!instance) {
      instance = new AcUnit()
    }
    const element = instance.valuesArray.shift();

    return {
      id: instance.genUuid(),
      type,
      traits: [
        'action.devices.traits.OnOff',
        'action.devices.traits.Modes',
        'action.devices.traits.TemperatureSetting',
        'action.devices.traits.FanSpeed',
      ],
      defaultNames: [`Smart AC Unit`],
      name: `Smart AC Unit`,
      nicknames: instance.getNicknames(element),
      roomHint: instance.getRoomHint(element),
      attributes: {
        availableThermostatModes: ['heat','cool','fan-only','auto','dry'],
        temperatureTemperatureUnit: 'C',
        availableFanSpeeds: {
          speeds: [
            {
              speed_name: "low_key",
              speed_values: [
                {
                  "speed_synonym": [
                    "low",
                    "speed 1"
                  ],
                  "lang": "en"
                }
              ]
            },
            {
              speed_name: "medium_key",
              speed_values: [
                {
                  "speed_synonym": [
                    "medium",
                    "speed 2"
                  ],
                  "lang": "en"
                }
              ]
            },
            {
              speed_name: "high_key",
              speed_values: [
                {
                  "speed_synonym": [
                    "high",
                    "speed 3"
                  ],
                  "lang": "en"
                }
              ]
            }
          ],
          "ordered": true
        },
      },
      willReportState: true,
      states: {
        online: true,
        currentModeSettings: {
          mode: 'auto',
        },
        on: false,
        thermostatTemperatureSetpoint: 20,
      },
      hwVersion: '1.0.0',
      swVersion: '2.0.0',
      model: 'SH 1.0.0',
      manufacturer: 'SmartHome A&G',
      hubExecution: false,
      hubInformation: {
        hubId: '',
        channel: '',
      },
    };
  }
}

window.deviceTypes.push({
  type,
  identifier: '_addAcUnit',
  icon: 'places:ac-unit',
  label: 'AC Unit',
  function: (app) => {
    app._createDevice(AcUnit.createDevice());
  },
})
