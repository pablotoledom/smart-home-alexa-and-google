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

class Awning extends DeviceType {
  constructor() {
    super()
    this.valuesArray = [{
      nicknames: ['back window awning'],
      roomHint: 'Patio'
    }];
  }

  static createDevice() {
    if (!instance) {
      instance = new Awning()
    }
    const element = instance.valuesArray.shift();

    return {
      id: instance.genUuid(),
      type: 'action.devices.types.AWNING',
      traits: [
        'action.devices.traits.OpenClose'
      ],
      defaultNames: [`Smart Awning`],
      name: `Smart Awning`,
      nicknames: instance.getNicknames(element),
      roomHint: instance.getRoomHint(element),
      attributes: {
        openDirection: ['UP', 'DOWN']
      },
      hubExecution: false,
      hubInformation: {
        hubId: '',
        channel: '',
      },
      willReportState: true,
      states: {
        online: true,
        openState: [{
          openPercent: 0,
          openDirection: 'UP'
        }, {
          openPercent: 0,
          openDirection: 'DOWN'
        }]
      },
      hwVersion: '3.2',
      swVersion: '11.4',
      model: '442',
      manufacturer: 'sirius',
    };
  }
}

window.deviceTypes.push({
  identifier: '_addAwning',
  icon: 'maps:store-mall-directory',
  label: 'Awning',
  function: (app) => { app._createDevice(Awning.createDevice()); }
})
