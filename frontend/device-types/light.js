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

class Light extends DeviceType {
  constructor() {
    super()
    this.monochromeValuesArray = [{
      nicknames: ['ceiling lights'],
      roomHint: 'Family Room'
    }, {
      nicknames: ['garden lights'],
      roomHint: 'Front Yard'
    }, {
      nicknames: ['workshop light'],
      roomHint: 'Shed'
    }, {
      nicknames: ['porch light'],
      roomHint: 'Front Yard'
    }];

    this.simpleValuesArray = [{
      nicknames: ['Outside lamp'],
      roomHint: 'Terrace'
    }, {
      nicknames: ['Security lamp'],
      roomHint: 'Courtyard'
    }, {
      nicknames: ['Entry lamp'],
      roomHint: 'Living Room'
    }, {
      nicknames: ['Reading lamp'],
      roomHint: 'Bedroom'
    }];
    
    this.rgbValuesArray = [{
      nicknames: ['table lamp'],
      roomHint: 'Living Room'
    }, {
      nicknames: ['reading lamp'],
      roomHint: 'Bedroom'
    }, {
      nicknames: ['doorway'],
      roomHint: 'Hallway'
    }, {
      nicknames: ['stairway'],
      roomHint: 'Hallway'
    }];
  }

  static createMonochromeLight() {
    if (!instance) {
      instance = new Light()
    }
    const element = instance.monochromeValuesArray.shift();

    return {
      id: instance.genUuid(),
      type: 'action.devices.types.LIGHT',
      traits: [
        'action.devices.traits.Brightness',
        'action.devices.traits.OnOff',
        'action.devices.traits.ColorSetting',
      ],
      defaultNames: [`Smart Lamp`],
      name: `Smart Lamp`,
      nicknames: instance.getNicknames(element),
      roomHint: instance.getRoomHint(element),
      attributes: {
        colorModel: 'rgb',
        colorTemperatureRange: {
          temperatureMinK: 2000,
          temperatureMaxK: 9000
        }
      },
      hubExecution: false,
      hubInformation: {
        hubId: '',
        channel: '',
      },
      willReportState: true,
      states: {
        on: false,
        online: true,
        brightness: 90,
        color: {
          temperatureK: 2000
        }
      },
      hwVersion: '1.0.0',
      swVersion: '2.0.0',
      model: 'L',
      manufacturer: 'L',
    };
  }

  static createSimpleLight() {
    if (!instance) {
      instance = new Light()
    }
    const element = instance.simpleValuesArray.shift();

    return {
      id: instance.genUuid(),
      type: 'action.devices.types.LIGHT',
      traits: [
        'action.devices.traits.OnOff',
      ],
      defaultNames: [`Simple Lamp`],
      name: `Simple Lamp`,
      nicknames: instance.getNicknames(element),
      roomHint: instance.getRoomHint(element),
      attributes: {
        colorModel: 'rgb',
      },
      hubExecution: false,
      hubInformation: {
        hubId: '',
        channel: '',
      },
      willReportState: true,
      states: {
        on: false,
        online: true,
        color: {
          temperatureK: 2000
        }
      },
      hwVersion: '1.0.0',
      swVersion: '2.0.0',
      model: 'L',
      manufacturer: 'L',
    };
  }
  
  static createRgbLight() {
    if (!instance) {
      instance = new Light()
    }
    const element = instance.rgbValuesArray.shift();

    return {
      id: instance.genUuid(),
      type: 'action.devices.types.LIGHT',
      traits: [
        'action.devices.traits.Brightness',
        'action.devices.traits.OnOff',
        'action.devices.traits.ColorSetting',
      ],
      defaultNames: [`Smart RGB Light`],
      name: `Smart RGB Light`,
      nicknames: instance.getNicknames(element),
      roomHint: instance.getRoomHint(element),
      attributes: {
        colorModel: 'rgb'
      },
      hubExecution: false,
      hubInformation: {
        hubId: '',
        channel: '',
      },
      willReportState: true,
      states: {
        on: false,
        online: true,
        brightness: 90,
        color: {
          spectrumRgb: 0
        }
      },
      hwVersion: '1.0.0',
      swVersion: '2.0.0',
      model: 'L',
      manufacturer: 'L',
    };
  }
}

window.deviceTypes.push({
  identifier: '_addMonochromeLight',
  icon: 'image:wb-iridescent',
  label: 'Monochrome Light',
  function: (app) => { app._createDevice(Light.createMonochromeLight()); }
})


window.deviceTypes.push({
  identifier: '_addSimpleLight',
  icon: 'image:wb-iridescent',
  label: 'Simple Light',
  function: (app) => { app._createDevice(Light.createSimpleLight()); }
})

window.deviceTypes.push({
  identifier: '_addLight',
  icon: 'image:wb-incandescent',
  label: 'RGB Light',
  function: (app) => { app._createDevice(Light.createRgbLight()); }
})
