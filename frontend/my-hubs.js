/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './smart-hub.js';
import './shared-styles.js';

class MyHubs extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          --app-primary-color: #4285f4;
          --app-secondary-color: black;
          display: block;
        }
  
        #no-hubs-msg {
          width: 60%;
          margin: 20% auto;
        }
  
        #no-hubs-msg > p {
          text-align: center;
        }
      </style>

      <div id="container" class="container">
        <div class="container-button">
          <paper-button raised id="add" icon="add" on-tap="_addHub">Add hub</paper-button>
        </div>

        <div id="no-hubs-msg" hidden="[[hideNoHubsMessage]]">
          <p class="layout horizontal center-justified">
            You currently don't have any hubs set up. To set up a hub,
            click the "Add Hub" button and take it online.
          </p>
        </div>

        <div id="hubs">
          <template is="dom-repeat" items="[[hubs]]">
            <div class="item">
              <smart-hub device=[[item]]
                index=[[index]]
                hub="[[item]]"
              </smart-hub>
            </div>
          </template>
        </div>
      </div>

      <paper-toast id="message" text="[[message]]"></paper-toast>
    `;
  }

  static get properties() {
    return {
      hubs: {
        type: Array,
        value: []
      },
      message: {
        type: String,
        value: null,
      },
      hideNoHubsMessage: {
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
  }

  connectedCallback() {
    super.connectedCallback();
    this.getList();
  }

  componentUpdate() {
    this.getList();
  }

  getList() {
    const accessToken = localStorage.getItem("accessToken");
    
    if (!!accessToken) {
      fetch(`${API_ENDPOINT}/hubs`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }),
      }).then((response) => response.json()).then((data) => {
        // Set data to hubs
        if (typeof data === 'object' && data.length > 0) {
          this.hubs = data;
          this.hideNoHubsMessage = true;
        }
      }).catch((error) => {
        console.log('There was a problem with the Fetch onGetHubs request:' + error.message);
      });
    } else {
      console.log('There is no token to get the hubs');
    }
  }

  _addHub() {
    const accessToken = localStorage.getItem("accessToken");
    const hub = {
      id: Math.floor((Math.random()) * 100000).toString(36),
      name: '',
      technologyType: '',
      controlType: '',
      host: '',
      apiKey: '',
      useQueue: '',
    };
    
    if (!!accessToken) {
      fetch(`${API_ENDPOINT}/hubs`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }),
        body: JSON.stringify(hub),
      }).then((response) => response.json()).then((data) => {
        // Data
        console.log('create ok');
        this.push('hubs', hub);
      }).catch((error) => {
        console.log('There was a problem with the Fetch onGetHubs request:' + error.message);
      });
    } else {
      console.log('There is no token to get the hubs');
    }
  }

  /**
   * Removes a hub.
   * @param {number} hubId The id of the device.
   */
  removeHub(hubId) {
    console.log('Delete device id: ', hubId);

    // get token from localstorage
    const accessToken = localStorage.getItem("accessToken");

    // Remove this device
    return fetch(`${API_ENDPOINT}/hubs/${hubId}`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }),
    }).then(() => {
      this.hubs.forEach((hub, index) => {
        if (hub.id === hubId) {
          // Mark the HTML element as hidden.
          // This will prevent users from seeing it and they won't interact with it.
          // The server-side representation for the device will be deleted.
          // The next time the page is refreshed the device will not be rendered.
          this.$.hubs.querySelectorAll('.item')[index].style.display = 'none'
          this.hideNoDeviceMessage = this.hubs.length > 0;
        }
      });
    });
  }
}

window.customElements.define('my-hubs', MyHubs);
