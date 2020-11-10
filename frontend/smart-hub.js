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
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import './shared-styles.js';

const ENTERKEY = 13;

export class SmartHub extends PolymerElement {
  static get template() {
    return html `
      <style include="shared-styles iron-flex iron-flex-alignment">
        paper-input {
          padding-right: 4px;
        }

        .card {
          width: 300px;
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
            <div id="device-id" class="square">[[hub.id]]</div>
            <div class="flex"></div>
            <paper-icon-button id="delete" icon="delete" on-tap="delete"></paper-icon-button>
          </div>
        </section>

        <!-- controls -->
        <section>
          <paper-input id="name" label="Name" value="{{hub.name}}"></paper-input>
          <paper-dropdown-menu label="HUB technology type" value="{{hub.technologyType}}">
            <paper-listbox id="technologyType" slot="dropdown-content">
              <paper-item>RF433</paper-item>
              <paper-item>IR</paper-item>
            </paper-listbox>
          </paper-dropdown-menu>
          <paper-dropdown-menu label="Control type" value="{{hub.controlType}}">
            <paper-listbox id="controlType" slot="dropdown-content">
              <paper-item>ESPURNA</paper-item>
              <paper-item>TASMOTA</paper-item>
              <paper-item>OTHER</paper-item>
            </paper-listbox>
          </paper-dropdown-menu>
        </section>
        <section>
          <paper-input id="apiKey" label="API Key" value="{{hub.apiKey}}"></paper-input>
        </section>
        <section>  
          <paper-input id="host" label="Host IP/Domain" value="{{hub.host}}"></paper-input>
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
      hub: {
        type: Object,
        notify: true,
      },
      index: {
        type: Number,
      },
      message: {
        type: String,
        value: null,
      }
    }
  }

  ready() {
    super.ready()

    // Set message container
    this.$.successMsg.fitInto = this.$.container;
    this.$.errorMsg.fitInto = this.$.container;
    this.$.errorSessionMsg.fitInto = this.$.container;
  }

  connectedCallback() {
    super.connectedCallback();

    window.requestAnimationFrame(() => {
      this.$.name.addEventListener('keydown', this._handleChange.bind(this));
      this.$.name.addEventListener('blur', this._execChange.bind(this));
      this.$.technologyType.addEventListener('click', this._execChange.bind(this));
      this.$.controlType.addEventListener('click', this._execChange.bind(this));
      this.$.host.addEventListener('keydown', this._handleChange.bind(this));
      this.$.host.addEventListener('blur', this._execChange.bind(this));
      this.$.apiKey.addEventListener('keydown', this._handleChange.bind(this));
      this.$.apiKey.addEventListener('blur', this._execChange.bind(this));
    });
  }

   /**
   * Event that occurs when the user presses the enter key in the
   * input field
   * @param {event} event DOM event.
   */
  _handleChange(event) {
    if (event.which == ENTERKEY) this.blur();
  }

  /**
   * Event that occurs after enter/tab key pressed or on tapout from
   * input field
   * @param {event} event DOM event.
   */
  _execChange(event) {
    console.log('_execHubChange');
    const accessToken = localStorage.getItem("accessToken");
    const {
      name,
      technologyType,
      controlType,
      host,
      apiKey,
    } = this.hub;

    return fetch(`${API_ENDPOINT}/hubs/${this.hub.id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }),
      body: JSON.stringify({
        name,
        technologyType,
        controlType,
        host,
        apiKey,
      }),
    })
    .then((response) => {
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

  delete() {
    const app = document.querySelector('my-app').shadowRoot.querySelector('app-drawer-layout>app-header-layout>iron-pages>my-hubs');
    // Disable button to prevent multiple delete operations
    this.$.delete.disabled = true;
    app.removeHub(this.hub.id);
  }

  logout() {
    this.$.errorSessionMsg.toggle();
    document.querySelector('my-app')._logout();
  }
}

window.customElements.define('smart-hub', SmartHub);