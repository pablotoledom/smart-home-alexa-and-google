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

const type = 'action.devices.types.SPEAKER'

class Speaker extends DeviceType {
  constructor() {
    super()
    this.valuesArray = [{
      nicknames: ['Table speaker'],
      roomHint: 'Living Room',
    }];
  }

  static createDevice() {
    if (!instance) {
      instance = new Speaker()
    }
    const element = instance.valuesArray.shift();

    return {
      id: instance.genUuid(),
      type,
      traits: [
        'action.devices.traits.OnOff',
        'action.devices.traits.MediaState',
        'action.devices.traits.TransportControl',
        'action.devices.traits.Volume',
        "action.devices.traits.InputSelector",
      ],
      defaultNames: ['Smart Speaker'],
      name: 'Smart Speaker',
      nicknames: instance.getNicknames(element),
      roomHint: instance.getRoomHint(element),
      attributes: {
        transportControlSupportedCommands: [
          'NEXT', 'PREVIOUS', 'PAUSE', 'STOP', 'RESUME',
        ],
        availableInputs: [{
          key: "CD",
          names: [{
            name_synonym: ["CD", "cd rom", "audio cd"],
            lang: "en",
          }, {
            name_synonym: ["CD", "cd rom", "cd de audio"],
            lang: "es",
          }],
        }, {
          key: "USB DAC",
          names: [{
            name_synonym: ["usb"],
            lang: "en",
          }, {
            name_synonym: ["usb"],
            lang: "es",
          }],
        }, {
          key: "TUNER",
          names: [{
            name_synonym: ["fm", "FM radio", "tuner"],
            lang: "en",
          }, {
            name_synonym: ["fm", "emisora", "radio FM"],
            lang: "es",
          }],
        }, {
          key: "AUX 1",
          names: [{
            name_synonym: ["in", "audio in", "aux", "auxiliary input"],
            lang: "en",
          }, {
            name_synonym: ["entrada", "entrada audio", "entrada auxiliar", "auxiliar"],
            lang: "es",
          }],
        }, {
          key: "LINE 1",
          names: [{
            name_synonym: ["in", "audio in", "aux", "auxiliary input"],
            lang: "en",
          }, {
            name_synonym: ["entrada", "entrada audio", "entrada auxiliar", "auxiliar"],
            lang: "es",
          }],
        }, {
          key: "LINE 2",
          names: [{
            name_synonym: ["in", "audio in", "aux", "auxiliary input"],
            lang: "en",
          }, {
            name_synonym: ["entrada", "entrada audio", "entrada auxiliar", "auxiliar"],
            lang: "es",
          }],
        }, {
          key: "LINE 3",
          names: [{
            name_synonym: ["in", "audio in", "aux", "auxiliary input"],
            lang: "en",
          }, {
            name_synonym: ["entrada", "entrada audio", "entrada auxiliar", "auxiliar"],
            lang: "es",
          }],
        }, {
          key: "MEDIA PLAYER",
          names: [{ 
            name_synonym: ["bluetooth", "bluetooth audio", "bluetooth input"],
            lang: "en",
          }, { 
            name_synonym: ["bluetooth", "audio bluetooth", "entrada bluetooth"],
            lang: "es",
          }],
        }],
        volumeMaxLevel: 28,
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
  identifier: '_addSpeaker',
  icon: 'hardware:speaker',
  label: 'Speaker',
  function: (app) => {
    app._createDevice(Speaker.createDevice());
  },
})
