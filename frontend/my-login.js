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
import '@polymer/paper-input/paper-input';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import './shared-styles.js';

class MyLogin extends PolymerElement {
  constructor() {
    super();
  }

  static get template() {
    return html `
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }

        .login-buttons {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .login-button {
          margin: 15px;
        }
      </style>

      <app-location route="{{route}}"></app-location>
      <app-route
          route="{{route}}"
          pattern="/:view"
          data="{{routeData}}"
          tail="{{subroute}}"></app-route>

      <div class="card">
        <h1>Access to system</h1>

        <paper-input id="user" name="user" label="User" value=""></paper-input>
        <paper-input id="password" name="password" label="Password" type="password" value=""></paper-input>

        <div class="login-buttons">
          <paper-button on-tap="_login" raised id="auth-btn">Authenticate</paper-button>
        </div>

        <iron-ajax
          id="AjaxPost"
          url="/api/oauth/token"
          method="POST"
          content-type="application/x-www-form-urlencoded"
          handle-as="json"
          on-response="handleResponse"
          on-error="handleAjaxPostError">
        </iron-ajax>
      </div>
    `;
  }

  ready() {
    super.ready();
    console.log("login is ready!");
    if (JSON.parse(localStorage.getItem("isUserSession")) === true) {
      console.log('you have session, redirect to devices!');
      // this.set('route.path', '#/devices');
      window.location.replace('/#/devices');
    };
  }

  static get properties() {
    return {
      _login: {
        type: Function
      }
    }
  }

  _login() {
    this.$.AjaxPost.body = {
      "grant_type": "password",
      "username": this.$.user.value,
      "password": this.$.password.value
    };
    this.$.AjaxPost.headers['authorization'] = 'Basic bXlTdXBlcklkOm15U3VwZXJTZWNyZXRLZXk='; // replace string for your 'Basic base64(id:secret)'
    this.$.AjaxPost.generateRequest();
  }

  handleResponse(e, request) {
    console.log("sent data to login");
    const data = request.response;
    if (!!data.accessToken && !!data.client.id && !!data.user.username) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("accessTokenExpiresAt", data.accessTokenExpiresAt);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("isUserSession", true);

      const URLParams = window.location.search.substring(1);
      const paramsKeys = URLParams ? JSON.parse('{"' + decodeURI(URLParams).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') : null;

      if (!!paramsKeys && paramsKeys.redirect_uri) {
        const code = btoa(this.$.user.value + ':' + this.$.password.value);
        const redirectUri = decodeURIComponent(paramsKeys.redirect_uri + '?code=' + code + '&state=' + paramsKeys.state);
        console.log('uri to redirect: ', redirectUri);
        window.location.replace(redirectUri);
      } else {
        console.log('redirected to devices!');
        window.location.replace('/#/devices');
        // this.set('route.path', '/#/devices');
      }
    } else {
      localStorage.setItem("isUserSession", false);
      console.log("Your username and password are wrong..")
    }
  }

  handleAjaxPostError(event, request) {
    localStorage.setItem("isUserSession", false);
    alert("error");
  }
}

window.customElements.define('my-login', MyLogin);