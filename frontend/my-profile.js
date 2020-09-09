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
import './shared-styles.js';

class MyProfile extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
        }

        .card {
          width: 300px;
        }

        h1 {
          margin: 0;
        }
      </style>

      <div id="container" class="container">
        <div class="card">
          <section>
            <h1>Profile</h1>
          </section>
          <section class="form-section">
            <paper-input label="Username" value="{{profile.username}}" disabled></paper-input>
            <paper-input label="Name" value="{{profile.name}}"></paper-input>
            <paper-input label="Last Name" value="{{profile.lastName}}"></paper-input>
            <paper-input label="E-mail" value="{{profile.email}}"></paper-input>
          </section>
          <section class="form-section">
            <h1>Change Password</h1>
            <paper-input type="password" label="Password" value={{profile.password}}></paper-input>
            <paper-input id="repeatPassword" type="password" label="Repeat password" error-message="letters only!" value={{profile.repeatPassword}}></paper-input>
          </section>
          <section class="form-section">
            <paper-button on-tap="_updateProfile" raised id="add" icon="add">Save</paper-button>
          </section>
        </div>
      </div>
      <paper-toast id="successMsg" text="Profile has been updated successfully." class="success-message"></paper-toast>
      <paper-toast id="errorMsg" text="An error occurred while trying to update." class="error-message"></paper-toast>
      <paper-toast id="errorSessionMsg" duration="0" text="Your session has expired">
        <paper-button on-tap="logout" class="yellow-button">Go to login!</paper-button>
      </paper-toast>
    `;
  }

  static get properties() {
    return {
      profile: {
        type: Object,
        value: {
          name: {
            type: String,
            value: '',
          },
          lastName: {
            type: String,
            value: '',
          },
          email: {
            type: String,
            value: '',
          },
          password: {
            type: String,
            value: '',
          },
          repeatPassword: {
            type: String,
            value: '',
          },
        },
      },
      passwordDontMatch: {
        type: Boolean,
        value: false,
      },
      message: {
        type: String,
        value: null,
      },
      isReady: {
        type: Boolean,
        value: false,
      }
    }
  }

  ready() {
    super.ready()
    this.isReady = true;
    // Set message container
    this.$.successMsg.fitInto = this.$.container;
    this.$.errorMsg.fitInto = this.$.container;
    this.$.errorSessionMsg.fitInto = this.$.container;
  }

  connectedCallback() {
    super.connectedCallback();
    this.getProfile();
  }

  componentUpdate() {
    this.getProfile();
  }

  getProfile() {
    const accessToken = localStorage.getItem("accessToken");
    const userName = localStorage.getItem("username");
    
    if (!!accessToken) {
      fetch(`${API_ENDPOINT}/profile/${userName}`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }),
      }).then((response) => response.json()).then((data) => {
        // Data
        const { username,  name, lastName, email } = data;
        this.profile = {
          username,
          name,
          lastName,
          email,
        };
      }).catch((error) => {
        console.log('There was a problem with the Fetch onGetDevices request:' + error.message);
      });
    } else {
      console.log('There is no token to get the devices');
    }
  }

  _updateProfile() {
    // Get token from localstorage
    const accessToken = localStorage.getItem("accessToken");

    // Validate password match
    if ((this.profile.password !== '' || this.profile.repeatPassword !== '') && this.profile.password !== this.profile.repeatPassword) {
      this.passwordDontMatch = true;
      this.$.repeatPassword.setAttribute("invalid", true)
    } else {
      this.passwordDontMatch = false;
      this.$.repeatPassword.removeAttribute("invalid", false)
    }

    // Update profile
    const { name, lastName, email, password } = this.profile;
    return fetch(`${API_ENDPOINT}/profile/${this.profile.username}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }),
      body: JSON.stringify({
        name,
        lastName,
        email,
        password: !this.passwordDontMatch && password ? password : null,
      }),
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
    })
  }

  logout() {
    this.$.errorSessionMsg.toggle();
    document.querySelector('my-app')._logout();
  }
}

window.customElements.define('my-profile', MyProfile);
