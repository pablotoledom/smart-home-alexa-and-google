/**
 * Copyright 2018, Google, Inc.
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
import {
  PolymerElement,
  html
} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js'
import '@polymer/paper-input/paper-input.js'
import '@polymer/paper-slider/paper-slider.js'
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import './shared-styles.js';

const ENTERKEY = 13;

export class SmartDevice extends PolymerElement {
  static get template() {
    return html `
      <style include="shared-styles iron-flex iron-flex-alignment">
        paper-input {
          padding-right: 4px;
        }

        paper-button {
          height: 40px;
          float: right;
          margin-right: 0px;
        }

        paper-icon-button {
          color: #555;
        }

        paper-dropdown-menu {
          width: 100%;
        }

        paper-slider {
          width: 268px;
        }

        .pin {
          margin-left: 0;
        }

        iron-icon {
          height: 96px;
          width: 96px;
          margin-top: 8px;
          margin-bottom: 8px;
        }

        ::slotted(iron-icon) {
          padding-top: 24px;
          padding-bottom: 24px;
          width: 128px;
          height: 128px;
        }

        .on {
          color: black;
        }

        .off {
          color: #eee;
        }

        .center {
          text-align: center;
        }

        #button-bar {
          margin-bottom: 8px;
          text-align: right;
        }

        #brightness, #temperatureSetpointCelsius, #thermostatTemperatureSetpoint {
          display: none;
        }

        .disabled {
          text-decoration: line-through;
        }
      </style>

      <div id="container" class="card">
        <section>  
          <div id="button-bar" class="layout horizontal justified">
            <div id="device-id" class="square">{{deviceid}}</div>
            <div class="flex"></div>

            <paper-icon-button id="reportState" icon="arrow-downward" on-tap="_handleReportState"></paper-icon-button>
            <paper-icon-button id="tfa" icon="lock" on-tap="_handleTfa"></paper-icon-button>
            <paper-icon-button id="cloud" icon="cloud-off" on-tap="_handleCloud"></paper-icon-button>
            <paper-icon-button id="delete" icon="delete" on-tap="_handleDelete"></paper-icon-button>
          </div>

          <!-- icon -->
          <div class="center">
            <paper-slider id="brightness" title="Brightness" pin
              disabled="[[!device.states.on]]" value="{{device.states.brightness}}"></paper-slider>
            <paper-slider id="temperatureSetpointCelsius" title="Setpoint" pin min="0" max="500" step="10"
              value="{{device.states.temperatureSetpointCelsius}}"></paper-slider>
            <paper-slider id="thermostatTemperatureSetpoint" title="Setpoint" pin min="18" max="35"
              value="{{device.states.thermostatTemperatureSetpoint}}"></paper-slider>
            <iron-icon id="icon"></iron-icon>
            <div id="states"></div>
          </div>
        </section>
        
        <!-- controls -->
        <section>
          <paper-input id="nickname" label="Nickname" value$="{{device.nicknames.0}}"></paper-input>
          <paper-input id="name" label="Name" value$="{{device.name}}"></paper-input>
          <div>Default Name:
            <span id='defaultName'>{{device.defaultNames.0}}</span>
          </div>
        </section>

        <!-- local execution -->
        <section>
          <paper-toggle-button id="localExecution" checked="{{localexecution}}">Local Execution</paper-toggle-button>
          <paper-input id="localDeviceId" label="Local Device ID" value="{{localdeviceid}}" disabled="[[!localexecution]]"></paper-input>
        </section>

        <!-- HUB execution -->
        <section>
          <paper-toggle-button id="hubExecution" checked="{{device.hubExecution}}">HUB Execution</paper-toggle-button>
          <paper-dropdown-menu class="hubmenu" label="HUB executor" value="{{hubName}}">
            <paper-listbox id="hubSelector" slot="dropdown-content">
              <template is="dom-repeat" items="[[hubs]]">
                <paper-item>[[item.name]]</paper-item>
              </template>
            </paper-listbox>
          </paper-dropdown-menu>

          <paper-input id="hubDeviceId" label="HUB channel" value="{{device.hubInformation.channel}}"></paper-input>
        </section>

        <paper-toast id="successMsg" text="Hub has been updated successfully." class="success-message"></paper-toast>
        <paper-toast id="errorMsg" text="An error occurred while trying to update." class="error-message"></paper-toast>
        <paper-toast id="errorSessionMsg" duration="0" text="Your session has expired">
          <paper-button on-tap="logout" class="yellow-button">Go to login!</paper-button>
        </paper-toast>
      </div>
    `
  }

  static get properties() {
    return {
      device: {
        type: Object,
      },
      index: {
        type: Number,
      },
      deviceid: {
        type: String
      },
      localexecution: {
        type: Boolean,
      },
      localdeviceid: {
        type: String,
      },
      hubName: {
        type: String,
      },
    }
  }

  static get observers() {
    return [
      '_localExecutionChanged(localexecution, localdeviceid)'
    ]
  }

  ready() {
    super.ready()

    const hub = this.hubs.find((hub) => hub.id === this.device.hubInformation.hubId);
    this.hubName = hub ? hub.name : '';

    // Set message container
    this.$.successMsg.fitInto = this.$.container;
    this.$.errorMsg.fitInto = this.$.container;
    this.$.errorSessionMsg.fitInto = this.$.container;
  }

  connectedCallback() {
    super.connectedCallback();
    window.requestAnimationFrame(() => {
      this._setIcon();
      this._registerTraits();
      this._deviceChanged();

      this.$.nickname.addEventListener('keydown', this._handleNameOrNicknameChange.bind(this));
      this.$.nickname.addEventListener('blur', this._execNameOrNicknameChange.bind(this));

      this.$.name.addEventListener('keydown', this._handleNameOrNicknameChange.bind(this));
      this.$.name.addEventListener('blur', this._execNameOrNicknameChange.bind(this));

      this.$.hubExecution.addEventListener('click', this._hubExecutionChange.bind(this));
      this.$.hubSelector.addEventListener('click', this._hubExecutionChange.bind(this));
      this.$.hubDeviceId.addEventListener('blur', this._hubExecutionChange.bind(this));

    });
  }

  _hubExecutionChange() {
    // Get token from localstorage
    const accessToken = localStorage.getItem("accessToken");
    // Get hub id
    const hub = this.hubs.find((hub) => hub.name === this.hubName);

    return fetch(`${API_ENDPOINT}/devices/${this.deviceid}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }),
      body: JSON.stringify({
        hubExecution: this.device.hubExecution,
        hubInformation: {
          hubId: hub.id,
          channel: this.device.hubInformation.channel,
        }
      })
    }).then((response) => {
      if (response.status === 200) {
        this.$.successMsg.open();
      } else if (response.status === 401) {
        this.$.errorSessionMsg.open();
      } else {
        this.$.errorMsg.open();
      }
    }).catch(() => {
      this.$.errorMsg.open();
    });
  }

  /**
   * Event that occurs after enter/tab key pressed or on tapout from
   * input field
   * @param {event} event DOM event.
   */
  _execNameOrNicknameChange(event) {
    if (event.target.id == 'nickname') {
      this.device.nicknames[0] = event.target.value;
      console.log('_execNameOrNicknameChange');
      const accessToken = localStorage.getItem("accessToken");
      return fetch(`${API_ENDPOINT}/devices/${this.deviceid}`, {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }),
        body: JSON.stringify({
          nickname: this.device.nicknames[0]
        })
      }).then((response) => {
        if (response.status === 200) {
          this.$.successMsg.open();
        } else if (response.status === 401) {
          this.$.errorSessionMsg.open();
        } else {
          this.$.errorMsg.open();
        }
      }).catch(() => {
        this.$.errorMsg.open();
      });
    } else if (event.target.id == 'name') {
      this.device.name = event.target.value;
      console.log('UPDATE 222');
      const accessToken = localStorage.getItem("accessToken");
      return fetch(`${API_ENDPOINT}/devices/${this.deviceid}`, {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }),
        body: JSON.stringify({
          name: this.device.name
        })
      }).then((response) => {
        if (response.status === 200) {
          this.$.successMsg.open();
        } else if (response.status === 401) {
          this.$.errorSessionMsg.open();
        } else {
          this.$.errorMsg.open();
        }
      }).catch(() => {
        this.$.errorMsg.open();
      });
    }
  }

  /**
   * Event that occurs when the user presses the enter key in the
   * input field
   * @param {event} event DOM event.
   */
  _handleNameOrNicknameChange(event) {
    if (event.which == ENTERKEY) this.blur();
  }

  _setIcon() {
    let icon = '';
    switch (this.device.type) {
      case 'action.devices.types.AC_UNIT':
        icon = 'places:ac-unit';
        break;
      case 'action.devices.types.AIRFRESHENER':
        icon = 'icons:hourglass-full';
        break;
      case 'action.devices.types.AIRPURIFIER':
        icon = 'hardware:sim-card';
        break;
      case 'action.devices.types.AWNING':
        icon = 'maps:store-mall-directory';
        break;
      case 'action.devices.types.BLINDS':
        icon = 'icons:view-week';
        break;
      case 'action.devices.types.BOILER':
        icon = 'icons:invert-colors';
        break;
      case 'action.devices.types.CAMERA':
        icon = 'image:camera-alt';
        break;
      case 'action.devices.types.COFFEE_MAKER':
        icon = 'maps:local-cafe';
        break;
      case 'action.devices.types.CURTAIN':
        icon = 'icons:flag';
        break;
      case 'action.devices.types.DISHWASHER':
        icon = 'maps:restaurant';
        break;
      case 'action.devices.types.DOOR':
        icon = 'icons:open-in-new';
        break;
      case 'action.devices.types.DRYER':
        icon = 'places:casino';
        break;
      case 'action.devices.types.FAN':
        icon = 'hardware:toys';
        break;
      case 'action.devices.types.FIREPLACE':
        icon = 'social:whatshot';
        break;
      case 'action.devices.types.GARAGE':
        icon = 'notification:drive-eta';
        break;
      case 'action.devices.types.GATE':
        icon = 'device:storage';
        break;
      case 'action.devices.types.HEATER':
        icon = 'icons:account-balance-wallet';
        break;
      case 'action.devices.types.HEATER':
        icon = 'icons:view-day';
        break;
      case 'action.devices.types.LIGHT':
        if (this.device.attributes.colorTemperatureRange) {
          icon = 'image:wb-iridescent';
        } else if (this.device.attributes.colorModel === 'rgb') {
          icon = 'image:wb-incandescent';
        }
        break;
      case 'action.devices.types.LOCK':
        icon = 'icons:lock';
        break;
      case 'action.devices.types.KETTLE':
        icon = 'image:filter-frames';
        break;
      case 'action.devices.types.MICROWAVE':
        icon = 'device:nfc';
        break;
      case 'action.devices.types.OUTLET':
        icon = 'notification:power';
        break;
      case 'action.devices.types.OVEN':
        icon = 'av:web';
        break;
      case 'action.devices.types.PERGOLA':
        icon = 'maps:layers';
        break;
      case 'action.devices.types.REFRIGERATOR':
        icon = 'places:kitchen';
        break;
      case 'action.devices.types.SCENE':
        icon = 'image:slideshow';
        break;
      case 'action.devices.types.SECURITYSYSTEM':
        icon = 'icons:verified-user';
        break;
      case 'action.devices.types.SHOWER':
        icon = 'maps:local-car-wash';
        break;
      case 'action.devices.types.SHUTTER':
        icon = 'maps:map';
        break;
      case 'action.devices.types.SPRINKLER':
        icon = 'image:filter-vintage';
        break;
      case 'action.devices.types.SWITCH':
        icon = 'communication:call-merge';
        break;
      case 'action.devices.types.THERMOSTAT':
        icon = 'image:brightness-7';
        break;
      case 'action.devices.types.VACUUM':
        icon = 'hardware:router';
        break;
      case 'action.devices.types.WASHER':
        icon = 'maps:local-laundry-service';
        break;
      case 'action.devices.types.VALVE':
        icon = 'icons:settings-input-component';
        break;
      case 'action.devices.types.WATERHEATER':
        icon = 'maps:local-drink';
        break;
      case 'action.devices.types.WINDOW':
        icon = 'device:wallpaper';
        break;
    }
    this.$.icon.icon = icon;
  }

  _handleReportState() {
    this.device.willReportState = !this.device.willReportState;
    this._deviceChanged();
  }

  _handleCloud() {
    //const app = document.querySelector('my-devices');
    const app = document.querySelector('my-app').shadowRoot.querySelector('app-drawer-layout>app-header-layout>iron-pages>my-devices');
    app.$['error-code'].open();
    app.errorCodeOffline = !this.device.states.online;
    app.errorCode = this.device.states.errorCode;
    app.$['error-code-submit'].onclick = () => {
      this.device.states.online = !app.$['error-code-offline'].checked;
      this.device.errorCode = app.$['error-code-input'].value;
      app.$['error-code'].close();
      this._updateState();
    }
  }

  _handleTfa() {
    // const app = document.querySelector('my-devices');
    const app = document.querySelector('my-app').shadowRoot.querySelector('app-drawer-layout>app-header-layout>iron-pages>my-devices');
    app.$['two-factor'].open();
    app.twoFactorAck = this.device.tfa === 'ack';
    app.twoFactorPin = this.device.tfa === 'ack' ? '' : this.device.tfa;
    app.$['two-factor-submit'].onclick = () => {
      if (app.$['two-factor-ack'].checked) {
        this.device.tfa = 'ack';
      } else {
        this.device.tfa = app.$['two-factor-input'].value;
      }
      app.$['two-factor'].close();
      this._updateState();
    }
  }

  _handleDelete() {
    const app = document.querySelector('my-app').shadowRoot.querySelector('app-drawer-layout>app-header-layout>iron-pages>my-devices');
    // Disable button to prevent multiple delete operations
    this.$.delete.disabled = true;
    app.removeDevice(this.deviceid);
  }

  _localExecutionChanged(localexecution, localdeviceid) {
    // TODO: Verificar por que se ejeucta???
    console.log('_localExecutionChanged');
    if (this.deviceid) {
      const accessToken = localStorage.getItem("accessToken");
      return fetch(`${API_ENDPOINT}/devices/${this.deviceid}`, {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }),
        body: JSON.stringify({
          localDeviceId: localexecution ? localdeviceid : null
        })
      }).then((response) => {
        if (response.status === 200) {
          this.$.successMsg.open();
        } else if (response.status === 401) {
          this.$.errorSessionMsg.open();
        } else {
          this.$.errorMsg.open();
        }
      }).catch(() => {
        this.$.errorMsg.open();
      });
    }
    return null;
  }

  _deviceChanged() {
    try {
      this.$.reportState.style.color = this.device.willReportState ? '#4CAF50' : '#757575';
      this.$.reportState.icon = this.device.willReportState ? 'arrow-upward' : 'arrow-downward';
      this.$.cloud.icon = this.device.states.online ? 'cloud' : 'cloud-off';
      if (this.device.errorCode) {
        this.$.cloud.style.color = '#E64A19';
        this.$.cloud.title = this.device.errorCode;
      } else {
        this.$.cloud.style.color = 'inherit';
        this.$.cloud.title = '';
      }
      this.$.tfa.icon = this.device.tfa ? 'lock' : 'lock-open';
      this.$.tfa.title = this.device.tfa;
      window.requestAnimationFrame(() => {
        this.traitHandlers.forEach(fun => {
          fun(this.device.states);
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  _updateState() {
    this._deviceChanged();
    if (!this.device.willReportState) return;

    console.log('_updateState');
    // Push state
    const accessToken = localStorage.getItem("accessToken");
    return fetch(`${API_ENDPOINT}/devices/${this.deviceid}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }),
      body: JSON.stringify({
        errorCode: this.device.errorCode,
        states: this.device.states,
        tfa: this.device.tfa
      })
    }).then((response) => {
      if (response.status === 200) {
        this.$.successMsg.open();
      } else if (response.status === 401) {
        this.$.errorSessionMsg.open();
      } else {
        this.$.errorMsg.open();
      }
    }).catch(() => {
      this.$.errorMsg.open();
    });
  }

  _registerTraits() {
    this.traitHandlers = [];
    const {
      traits
    } = this.device;
    traits.forEach(trait => {
      switch (trait) {
        case 'action.devices.traits.ArmDisarm':
          this.traitHandlers.push(states => {
            switch (states.currentArmLevel) {
              case 'L1':
                this.$.icon.style.color = '#555555';
                break;
              case 'L2':
                this.$.icon.style.color = '#FF9800';
                break;
            }
          });
          break;

        case 'action.devices.traits.Brightness':
          this.$.brightness.style.display = 'block';
          this.$.brightness.addEventListener('value-change', event => {
            this.device.states.brightness = this.$.brightness.value;
            this._updateState();
          });
          this.traitHandlers.push(states => {
            this.$.icon.style.opacity = states.brightness / 100;
          });
          break;

        case 'action.devices.traits.ColorSetting':
          this.traitHandlers.push(states => {
            if (!states.on) return;
            if (states.color.spectrumRGB) {
              let rgb = states.color.spectrumRGB;
              rgb = rgb.toString(16);
              while (rgb.length < 6) {
                rgb = '0' + rgb;
              }
              rgb = '#' + rgb;
              this.$.icon.style.color = rgb;
            } else if (states.color.spectrumHSV) {
              this.$.icon.style.color = 'blue'
            } else if (states.color.temperatureK) {
              this.$.icon.style.color = '#fffacd';
            }
          })
          break;

        case 'action.devices.traits.Dock':
          // Create a 'Dock' element
          const dockElement = document.createElement('span');
          dockElement.id = 'states-isdocked';
          const dockLabel = document.createTextNode('Docked');
          dockElement.appendChild(dockLabel);
          this.$.states.appendChild(dockElement);
          this.traitHandlers.push(states => {
            const dockedElement = this.$.states.querySelector('#states-isdocked');
            if (states.isDocked) {
              dockedElement.classList.remove('disabled');
            } else {
              dockedElement.classList.add('disabled');
            }
          });
          break;

        case 'action.devices.traits.FanSpeed':
          this.traitHandlers.push(states => {
            switch (states.currentFanSpeedSetting) {
              case '0':
                this.$.icon.style.color = '#eee';
                break;
              case '1':
                this.$.icon.style.color = '#d4e8ae';
                break;
              case '2':
                this.$.icon.style.color = '#b1e253';
                break;
              case '3':
                this.$.icon.style.color = '#9bea00';
                break;
            }
          });
          break;

        case 'action.devices.traits.Locator':
          this.traitHandlers.push(states => {
            if (states.generatedAlert) {
              if (states.silent) {
                this.$.icon.style.color = '#555';
              } else {
                this.$.icon.style.color = '#009688';
              }
              this.states.generatedAlert = false;
              this._updateState();
            }
          });
          break;

        case 'action.devices.traits.LockUnlock':
          this.traitHandlers.push(states => {
            if (states.isJammed) {
              this.$.icon.style.color = '#F44336';
            } else if (states.isLocked) {
              this.$.icon.style.color = '#FF9800';
            } else {
              this.$.icon.style.color = '#555555';
            }

            if (this.device.type = 'action.devices.types.LOCK') {
              if (states.isLocked) {
                this.$.icon.icon = 'icons:lock';
              } else {
                this.$.icon.icon = 'icons:lock-open';
              }
            }
          });
          break;

        case 'action.devices.traits.Modes':
          this.device.attributes.availableModes.forEach(mode => {
            // Add a block for each mode
            const modeElement = document.createElement('div');
            modeElement.appendChild(document.createTextNode(`${mode.name}: `))
            modeElement.id = `states-${mode.name}`;
            const modeValue = document.createElement('span');
            modeElement.appendChild(modeValue);
            this.$.states.appendChild(modeElement);
          })
          this.traitHandlers.push(states => {
            if (states.currentModeSettings) {
              for (const [mode, setting] of Object.entries(states.currentModeSettings)) {
                const elementId = `states-${mode}`
                const elementValue = this.$.states.querySelector(`#${elementId} span`);
                if (!elementValue) return;
                elementValue.innerText = setting;
              }
            }
          });
          break;

        case 'action.devices.traits.OnOff':
          this.$.icon.style.cursor = 'pointer';
          this.$.icon.addEventListener('tap', event => {
            this.device.states.on = !this.device.states.on;
            this._updateState();
          });
          this.traitHandlers.push(states => {
            if (states.on) {
              this.$.icon.style.color = '#4CAF50';
            } else {
              this.$.icon.style.color = '#333333';
            }
          })
          break;

        case 'action.devices.traits.OpenClose':
          this.$.icon.style.cursor = 'pointer';
          this.$.icon.addEventListener('tap', event => {
            if (this.device.attributes && this.device.attributes.openDirection) {
              // Tap will open/close in the primary direction
              const percent = this.device.states.openState[0].openPercent;
              if (percent > 0) {
                this.device.states.openState[0].openPercent = 0;
              } else {
                this.device.states.openState[0].openPercent = 100;
              }
            } else {
              // There is only one direction
              const percent = this.device.states.openPercent;
              if (percent > 0) {
                this.device.states.openPercent = 0;
              } else {
                this.device.states.openPercent = 100;
              }
            }
            this._updateState();
          });
          this.traitHandlers.push(states => {
            let percent = 0
            if (this.device.attributes && this.device.attributes.openDirection) {
              // Only show percentage for primary direction
              percent = states.openState[0].openPercent;
            } else {
              percent = states.openPercent;
            }
            if (percent > 0) {
              // Change opacity based on how open it is
              this.$.icon.style.color = '#673AB7';
              this.$.icon.style.opacity = percent / 100;
            } else {
              // Not open at all
              this.$.icon.style.color = '#333333';
            }
          })
          break;

        case 'action.devices.traits.RunCycle':
          // Add a block for the current run cycle
          const runCycleElement = document.createElement('div');
          runCycleElement.appendChild(document.createTextNode('cycle: '))
          runCycleElement.id = 'states-runcycle';

          const runCycleValue = document.createElement('span');
          runCycleValue.id = 'states-runcycle-current';
          runCycleElement.appendChild(runCycleValue);

          const runCycleTimes = document.createElement('span');
          runCycleTimes.id = 'states-runcycle-time';
          runCycleElement.appendChild(runCycleTimes);

          this.$.states.appendChild(runCycleElement);
          this.traitHandlers.push(states => {
            const currentCycleElement = this.$.states.querySelector(`#states-runcycle-current`);
            currentCycleElement.innerText = states.currentRunCycle[0].currentCycle;

            const currentTimeElement = this.$.states.querySelector(`#states-runcycle-time`);
            currentTimeElement.innerText = ` ${states.currentCycleRemainingTime}/` +
              `${states.currentTotalRemainingTime} seconds`;
          });
          break;

        case 'action.devices.traits.Scene':
          this.traitHandlers.push(states => {
            if (!states.deactivate) {
              this.$.icon.style.color = '#4CAF50';
            } else {
              this.$.icon.style.color = '#555555';
            }
          });
          break;

        case 'action.devices.traits.StartStop':
          this.traitHandlers.push(states => {
            if (states.isRunning) {
              if (states.isPaused) {
                this.$.icon.style.color = '#FF9800';
              } else {
                this.$.icon.style.color = '#4CAF50';
              }
            } else {
              this.$.icon.style.color = '#555555';
            }
          });
          break;

        case 'action.devices.traits.TemperatureControl':
          this.$.temperatureSetpointCelsius.style.display = 'block';
          this.$.temperatureSetpointCelsius.addEventListener('value-change', event => {
            this.device.states.temperatureSetpointCelsius = this.$.temperatureSetpointCelsius.value;
            this._updateState();
          });
          break;

        case 'action.devices.traits.TemperatureSetting':
          this.$.thermostatTemperatureSetpoint.style.display = 'block';
          this.$.thermostatTemperatureSetpoint.addEventListener('value-change', event => {
            this.device.states.thermostatTemperatureSetpoint = this.$.thermostatTemperatureSetpoint.value;
            this._updateState();
          });

          const thermostatElement = document.createElement('span');
          thermostatElement.id = 'states-thermostatmode';
          const thermostatLabel = document.createTextNode('Mode: n/a');
          thermostatElement.appendChild(thermostatLabel);
          this.$.states.appendChild(thermostatElement);
          this.traitHandlers.push(states => {
            const thermostatElement = this.$.states.querySelector(`#states-thermostatmode`);
            thermostatElement.innerText = states.thermostatMode;
          });
          break;

        case 'action.devices.traits.Timer':
          // Add a block for the timer
          const timerElement = document.createElement('div');
          timerElement.appendChild(document.createTextNode(`Timer: `))
          timerElement.id = `states-timer`;
          const modeValue = document.createElement('span');
          timerElement.appendChild(modeValue);
          this.$.states.appendChild(timerElement);

          this.$.icon.addEventListener('tap', event => {
            // Finish the Timer task
            this.device.states.timerRemainingSec = -1;
            this._updateState();
          });

          this.traitHandlers.push(states => {
            const elementId = `states-timer`
            const elementValue = this.$.states.querySelector(`#${elementId} span`);
            if (!elementValue) return;
            if (states.timerRemainingSec === -1) {
              // -1 means no timer set
              elementValue.innerText = 'No timer set'
            } else {
              elementValue.innerText = `${states.timerRemainingSec}s remaining`;
              if (states.timerPaused) {
                elementValue.innerText += ' (Paused)';
              }
            }
          });
          break;

        case 'action.devices.traits.Toggles':
          this.device.attributes.availableToggles.forEach(toggle => {
            // Add a block for each toggle
            const toggleElement = document.createElement('div');
            toggleElement.appendChild(document.createTextNode(toggle.name))
            toggleElement.id = `states-${toggle.name}`;
            this.$.states.appendChild(toggleElement);
          })
          this.traitHandlers.push(states => {
            if(states.currentToggleSettings) {
              for (const [toggle, setting] of Object.entries(states.currentToggleSettings)) {
                const elementId = `states-${toggle}`
                const elementValue = this.$.states.querySelector(`#${elementId}`);
                if (!elementValue) return;
  
                if (setting) {
                  elementValue.classList.remove('disabled');
                } else {
                  elementValue.classList.add('disabled');
                }
              }
            }
          });
          break;

        case 'action.devices.traits.CameraStream':
        default:
          // No state changes will be shown
          break;
      }
    })
  }

  receiveState(device) {
    this.device = device;
    if (this.device.states.color) {
      if (this.device.states.color.spectrumRgb) {
        this.device.states.color.spectrumRGB = this.device.states.color.spectrumRgb
        delete this.device.states.color.spectrumRgb
      }
      if (this.device.states.color.spectrumHsv) {
        this.device.states.color.spectrumHSV = this.device.states.color.spectrumHsv
        delete this.device.states.color.spectrumHsv
      }
    }
    this._deviceChanged();
  }

  logout() {
    this.$.errorSessionMsg.toggle();
    document.querySelector('my-app')._logout();
  }
}

window.customElements.define('smart-device', SmartDevice);