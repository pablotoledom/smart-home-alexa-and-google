/**
 * Copyright 2020, Google, Inc.
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

const type = 'action.devices.types.STREAMING_SOUNDBAR'

class StreamingSoundbar extends DeviceType {
  constructor() {
    super()
    this.valuesArray = [{
      nicknames: ['Media center streaming soundbar'],
      roomHint: 'Living Room',
    }];
  }

  static createDevice() {
    if (!instance) {
      instance = new StreamingSoundbar()
    }
    const element = instance.valuesArray.shift();

    return {
      id: instance.genUuid(),
      type,
      traits: [
        'action.devices.traits.MediaState',
        'action.devices.traits.TransportControl',
        'action.devices.traits.Volume',
      ],
      defaultNames: ['Smart Streaming Soundbar'],
      name: 'Smart Streaming Soundbar',
      nicknames: instance.getNicknames(element),
      roomHint: instance.getRoomHint(element),
      attributes: {
        transportControlSupportedCommands: [
          'NEXT', 'PREVIOUS', 'PAUSE', 'STOP', 'RESUME',
        ],
        volumeMaxLevel: 11,
        volumeCanMuteAndUnmute: true,
        supportActivityState: true,
        supportPlaybackState: true,
      },
      willReportState: true,
      states: {
        online: true,
        currentVolume: 11,
        isMuted: false,
        activityState: 'ACTIVE',
        playbackState: 'STOPPED',
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
  identifier: '_addStreamingSoundar',
  icon: 'image:panorama-horizontal',
  label: 'Streaming Soundbar',
  function: (app) => {
    app._createDevice(StreamingSoundbar.createDevice());
  },
})
