/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {
    PolymerElement,
    html
} from '@polymer/polymer/polymer-element.js';
import {
    dom
} from '@polymer/polymer/lib/legacy/polymer.dom.js';

import './smart-device.js';
import './device-types/ac-unit.js';
import './device-types/air-cooler.js';
import './device-types/air-freshener.js';
import './device-types/air-purifier.js';
import './device-types/audio-visual-receiver.js';
import './device-types/awning.js';
import './device-types/bathtub.js';
import './device-types/bed.js';
import './device-types/blender.js';
import './device-types/blinds.js';
import './device-types/boiler.js';
import './device-types/camera.js';
import './device-types/charger.js';
import './device-types/closet.js';
import './device-types/coffee-maker.js';
import './device-types/cooktop.js';
import './device-types/curtain.js';
import './device-types/dehumidifier.js';
import './device-types/dehydrator.js';
import './device-types/dishwasher.js';
import './device-types/door.js';
import './device-types/drawer.js';
import './device-types/dryer.js';
import './device-types/fan.js';
import './device-types/faucet.js';
import './device-types/fireplace.js';
import './device-types/freezer.js';
import './device-types/fryer.js';
import './device-types/garage.js';
import './device-types/gate.js';
import './device-types/grill.js';
import './device-types/heater.js';
import './device-types/hood.js';
import './device-types/humidifier.js';
import './device-types/kettle.js';
import './device-types/lock.js';
import './device-types/microwave.js';
import './device-types/mop.js';
import './device-types/mower.js';
import './device-types/multicooker.js';
import './device-types/light.js';
import './device-types/network.js';
import './device-types/outlet.js';
import './device-types/oven.js';
import './device-types/pergola.js';
import './device-types/petfeeder.js';
import './device-types/pressurecooker.js';
import './device-types/radiator.js';
import './device-types/refrigerator.js';
import './device-types/remote.js';
import './device-types/router.js';
import './device-types/scene.js';
import './device-types/security-system.js';
import './device-types/settop.js';
import './device-types/shower.js';
import './device-types/shutter.js';
import './device-types/soundbar.js';
import './device-types/sousvide.js';
import './device-types/speaker.js';
import './device-types/sprinkler.js';
import './device-types/standmixer';
import './device-types/streaming-box';
import './device-types/streaming-soundbar';
import './device-types/streaming-stick';
import './device-types/switch.js';
import './device-types/thermostat.js';
import './device-types/tv.js';
import './device-types/vacuum.js';
import './device-types/valve.js';
import './device-types/washer.js';
import './device-types/water-heater.js';
import './device-types/window.js';
import './device-types/yogurtmaker.js';
import './device-types/importer.js';
import './shared-styles.js';

class MyDevices extends PolymerElement {
    static get template() {
        return html `
    <style include="shared-styles">
      :host {
        --app-primary-color: #4285f4;
        --app-secondary-color: black;
        display: block;
      }

      app-header {
        color: #fff;
        background-color: var(--app-primary-color);
      }

      app-header paper-icon-button {
        --paper-icon-button-ink-color: white;
      }

      #no-devices-msg {
        width: 60%;
        margin: 20% auto;
      }

      #no-devices-msg > p {
        text-align: center;
      }

      #check {
        display: none;
      }

      paper-dialog paper-button {
        background-color: red;
        color: white;
      }
    </style>

    <!-- Main content -->
    <div id="modals">
      <paper-dialog id="modal" class="modal" modal>
        <div class="modal-title">
          <h1>Add a new device</h1>
          <div class="modal-close close">
            <iron-icon icon="icons:close" dialog-confirm autofocus></iron-icon>
          </div>
        </div>
       
        <div class="modal-content layout horizontal center-justified">
          <template is="dom-repeat" items="{{deviceTypes}}">
            <button dialog-confirm autofocus class="square-button" id$="{{item.identifier}}">
              <iron-icon icon="{{item.icon}}"></iron-icon>
              <p>{{item.label}}</p>
            </button>
          </template>
        </div>
      </paper-dialog>

      <paper-dialog id="insert-json" class="modal" modal>
        <div class="modal-title">
          <h1>Insert Json code</h1>
          <div class="modal-close close">
            <iron-icon icon="icons:close" dialog-confirm autofocus></iron-icon>
          </div>
        </div>

        <div class="modal-content layout horizontal center-justified">
          <p>Paste the JSON SYNC response for a single device to recreate it</p>
          <textarea id="insert-json-textarea"></textarea><br>
          <div id="insert-json-message"></div>
          <paper-button raised id="insert-json-import">Import</paper-button>
        </div>
      </paper-dialog>

      <paper-dialog id="error-code" class="modal" modal>
        <paper-toggle-button id="error-code-offline" checked="{{errorCodeOffline}}">Offline</paper-toggle-button>
        <paper-input id="error-code-input" label="Error Code" value$="{{errorCode}}" disabled="[[errorCodeOffline]]"></paper-input>
        <a href="https://developers.google.com/actions/smarthome/reference/errors-exceptions#error_list" target="_blank">
          Full list of error codes
        </a>
        <br>
        <paper-button raised id="error-code-submit">Okay</paper-button>
      </paper-dialog>

      <paper-dialog id="two-factor" class="modal" modal>
        <paper-toggle-button id="two-factor-ack" checked="{{twoFactorAck}}">Ack</paper-toggle-button>
        <paper-input id="two-factor-input" label="PIN" value$="{{twoFactorPin}}" disabled="[[twoFactorAck]]"></paper-input>
        <paper-button raised id="two-factor-submit">Okay</paper-button>
      </paper-dialog>
    </div>

    <div id="container" class="container">
      <div class="container-button">
        <paper-button raised id="add" icon="add">Add device</paper-button>
      </div>

      <div id="no-devices-msg" hidden="[[hideNoDeviceMessage]]">
        <p class="layout horizontal center-justified">
          You currently don't have any devices set up. To set up a device,
          click the "Add Device" button and take it online.
        </p>
      </div>

      <div id="devices">
        <template is="dom-repeat" items="[[devices]]">
          <div class="item">
            <smart-device
              device=[[item]]
              index=[[index]]
              deviceid=[[item.deviceId]]
              id="d-[[item.deviceId]]"
              localexecution=[[item.localDeviceExecution]]
              localdeviceid=[[item.localDeviceId]]
              hubs=[[hubs]]
            </smart-device>
          </div>
        </template>
      </div>
    </div>

    <paper-toast id="toast" text="Not signed in"></paper-toast>
    `
    }

    static get properties() {
        return {
            devices: {
                type: Array,
                value: []
            },
            hubs: {
                type: Array,
                value: []
            },
            deviceTypes: {
                type: Array,
                value: window.deviceTypes
            },
            hideNoDeviceMessage: {
                type: Boolean,
                value: false,
            },
            isReady: {
                type: Boolean,
                value: false,
            }
        }
    }

    ready() {
        super.ready();
        this.isReady = true;
        // Initialize Cloud Firestore through Firebase
        // this.db = firebase.firestore();
        // Disable deprecated features
        // this.db.settings({
        //     timestampsInSnapshots: true,
        // });

        var body = document.querySelector('body');
        dom(body).appendChild(this.$.modals);

        window.iconMap = (() => {
          const map = {}
          window.deviceTypes.forEach((device) => {
            map[device.type] = device.iconFunction || device.icon
          })
          return map
        })()
    }

    /**
     * Callback that runs when the HTML element is created.
     */
    connectedCallback() {
        super.connectedCallback();

        window.requestAnimationFrame(async() => {
            this.$.add.addEventListener('click', () => {
                this.$.modal.open();
                console.log('Pressed open modal');
            });
        });

        this.getList();
    }

    componentUpdate() {
        this.getList();
    }

    getList() {
        // Clear device list
        this.devices = [];

        const accessToken = localStorage.getItem("accessToken");

        if (!!accessToken) {
            // Get hubs list from mongodb
            fetch(`${API_ENDPOINT}/hubs`, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }),
            }).then((response) => response.json()).then((data) => {
                if (typeof data === 'object' && data.length >= 0) {
                    this.hubs = data;

                    // Get device list from mongodb
                    fetch(`${API_ENDPOINT}/devices`, {
                        method: 'GET',
                        headers: new Headers({
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }),
                    }).then((response) => response.json()).then((data) => {
                        data.forEach(device => {
                            this._addDevice(device);
                            this.addDbListener(device.id);
                        });
                    }).catch((error) => {
                        console.log('There was a problem with the Fetch onGetDevices request:' + error.message);
                    });

                    this.deviceTypes.forEach(type => {
                        const element = this.$.modal.querySelector(`#${type.identifier}`)
                        element.addEventListener('click', () => {
                            type.function(this)
                        });
                    });
                }
            }).catch((error) => {
                console.log('There was a problem with the Fetch onGetDevices request:' + error.message);
            });
        } else {
            console.log('There is no token to get the devices');
        }
    }

    addDbListener(id) {
        // Add a listener to each device
        // this.db.collection('users').doc('yourUser').collection('devices').doc(id).onSnapshot(doc => {
        //   Console.log('', );
        //   if (!doc.exists) {
        //     console.warn(`Document ${id} does not exist`)
        //     return;
        //   }
        //   const data = doc.data();

        //   this.$.devices.querySelector(`#d-${id}`).receiveState(data);
        // })

        // TODO: falta encontrar un trigger update realtime

        // fetch(`${API_ENDPOINT}/devices/${id}`, {
        //   method: 'GET',
        //   headers: new Headers({
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${accessToken}`
        //   }),
        // }).then((response) => response.json()).then((data) => {
        //   console.log('desde mongodb addDbListener', data);
        //   if (!data.id) {
        //     console.warn(`Document ${id} does not exist`)
        //     return;
        //   }
        //   this.$.devices.querySelector(`#d-${id}`).receiveState(data);
        // }).catch((error) => {
        //   console.log('Hubo un problema con la petición Fetch onGetDevice:' + error.message);
        // });
    }

    /**
     * Removes a device.
     * @param {number} deviceId The id of the device.
     */
    removeDevice(deviceId) {
        console.log('Delete device id: ', deviceId);
        this.devices.forEach((device, index) => {
            if (device.deviceId === deviceId) {
                // Mark the HTML element as hidden.
                // This will prevent users from seeing it and they won't interact with it.
                // The server-side representation for the device will be deleted.
                // The next time the page is refreshed the device will not be rendered.
                this.$.devices.querySelectorAll('.item')[index].style.display = 'none'
                this.hideNoDeviceMessage = this.devices.length > 0;
            }
        })

        // get token from localstorage
        const accessToken = localStorage.getItem("accessToken");

        // Remove this device
        return fetch(`${API_ENDPOINT}/devices/${deviceId}`, {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            }),
        })
    }

    /**
     * Displays a toast message.
     * @param {string} toastmsg The message to be displayed.
     */
    showToast(toastmsg) {
        this.$.toast.text = toastmsg;
        this.$.toast.open();
    }

    /**
     * Displays a toast message with the user's name.
     */
    _showAccount() {
        this.$.toast.text = `Welcome ${window.USERNAME}`;
        this.$.toast.open();
    }

    async _createDevice(device) {
        // Push new device to database
        try {
            // get token from localstorage
            const accessToken = localStorage.getItem("accessToken");

            // send data to endpoint
            await fetch(`${API_ENDPOINT}/devices`, {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }),
                body: JSON.stringify(device),
            }).then(() => {
                this._addDevice(device);
                this.addDbListener(device.id);
            })
        } catch (e) {
            console.error(e);
        }
    }

    _addDevice(device) {
        device.deviceId = device.id;
        device.localDeviceExecution = (device.otherDeviceIds !== undefined &&
            device.otherDeviceIds.length > 0);
        if (device.localDeviceExecution) {
            device.localDeviceId = device.otherDeviceIds[0].deviceId;
        }
        this.push('devices', device);
        this.hideNoDeviceMessage = true;
    }
}

window.customElements.define('my-devices', MyDevices);