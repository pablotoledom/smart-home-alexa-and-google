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

const type = 'action.devices.types.WINDOW'

class Window extends DeviceType {
  constructor() {
    super()
    this.valuesArray = [{
      nicknames: ['sink window'],
      roomHint: 'Kitchen',
    }];
  }

  static createDevice() {
    if (!instance) {
      instance = new Window()
    }
    const element = instance.valuesArray.shift();

    return {
      id: instance.genUuid(),
      type,
      traits: [
        'action.devices.traits.LockUnlock',
        'action.devices.traits.OpenClose',
      ],
      defaultNames: [`Smart Window`],
      name: `Smart Window`,
      nicknames: instance.getNicknames(element),
      roomHint: instance.getRoomHint(element),
      willReportState: true,
      states: {
        online: true,
        openPercent: 0,
      },
      hwVersion: '3.2',
      swVersion: '11.4',
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
  identifier: '_addWindow',
  icon: 'device:wallpaper',
  label: 'Window',
  function: (app) => {
    app._createDevice(Window.createDevice());
  },
})
