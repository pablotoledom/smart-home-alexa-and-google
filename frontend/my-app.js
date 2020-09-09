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
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/app-layout/app-header/app-header.js'
import '@polymer/app-layout/app-layout.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/av-icons.js';
import '@polymer/iron-icons/communication-icons.js';
import '@polymer/iron-icons/device-icons.js';
import '@polymer/iron-icons/image-icons.js';
import '@polymer/iron-icons/hardware-icons.js';
import '@polymer/iron-icons/maps-icons.js';
import '@polymer/iron-icons/notification-icons.js';
import '@polymer/iron-icons/places-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/iron-list/iron-list.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/neon-animation/neon-animations.js';
import './my-icons.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class MyApp extends PolymerElement {
  constructor() {
    super();
  }

  static get template() {
    return html`
      <style>
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

        .drawer-list {
          margin: 0 20px;
        }

        .drawer-list a {
          display: block;
          padding: 0 16px;
          text-decoration: none;
          color: var(--app-secondary-color);
          line-height: 40px;
        }

        app-toolbar {
          background: #6495ed;
          color: #fff;
          text-shadow: 2px 2px #00000029;
        }

        .drawer-list a {
          margin-left: 20px;
          margin-right: 20px;
        }

        .drawer-list a + a {
          border-top: 1px solid #bac8df;
        }

        .drawer-list a.iron-selected {
          color: black;
          font-weight: bold;
        }
      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]" use-hash-as-path>
      </app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>

      <app-drawer-layout fullbleed force-narrow>
        <!-- Drawer content -->
        <dom-if id="contenedor" restamp if="[[isUserSession]]">
          <template>
            <app-drawer id="drawer" slot="drawer">
              <app-toolbar>Menu</app-toolbar>
              <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
                <a name="devices" href="[[rootPath]]#/devices">Devices</a>
                <a name="hubs" href="[[rootPath]]#/hubs">Hubs</a>
                <a name="profile" href="[[rootPath]]#/profile">Profile</a>
                <a name="logout" href="#" on-tap="_logout">Logout</a>
              </iron-selector>
            </app-drawer>
          </template>
        </dom-if>


        <!-- Main content -->
        <app-header-layout has-scrolling-region="">
          <dom-if restamp if="[[isUserSession]]">
            <template restamp>
              <app-header slot="header" condenses="" reveals="" effects="waterfall">
                <app-toolbar>
                  <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
                  <div main-title="">[[pageName]]</div>
                </app-toolbar>
              </app-header>
            </template>
          </dom-if>

          <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
            <my-login id="my-login" name="login"></my-login>
            <my-devices id="my-devices" name="devices"></my-devices>
            <my-hubs id="my-hubs" name="hubs"></my-hubs>
            <my-profile id="my-profile" name="profile"></my-profile>
            <my-view404 id="my-view404" name="view404"></my-view404>
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  ready() {
    super.ready();
    console.log("load my-app is ready!");
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      pageName : {
        type: String,
      },
      routeData: Object,
      subroute: Object,
      isUserSession: {
        value: false,
        Type: Boolean
      },
      _logout: {
        type: Function
      }
    };
  }

  static get observers() {
    return [
      '_routePageChanged(routeData)'
    ];
  }

  _routePageChanged(routeData) {
    const page = routeData.page;
    console.log('page my-app ', page);
    // To view menu and header
    if (JSON.parse(localStorage.getItem("isUserSession")) === true) {
      console.log('is user session true!');
      this.isUserSession = true;
    } else {
      console.log('should be to login');
      this.set('route.path', '/login');
    };
     // Show the corresponding page according to the route.
     //
     // If no page was found in the route data, page will be an empty string.
     // Show 'view1' in that case. And if the page doesn't exist, show 'view404'.
    if (!page) {
      this.page = 'login';
    } else if (['login', 'devices', 'hubs', 'profile'].indexOf(page) !== -1) {
      this.page = page;
    } else {
      this.page = 'view404';
    }

    // Execute child function
    console.log(`Execute child componentUpdate function when page "${page}" is ready`);
    if (this.$[`my-${page}`] && this.$[`my-${page}`].isReady) {
      this.$[`my-${page}`].componentUpdate();
    }

    // Close a non-persistent drawer when the page & route are changed.
    if (this.$.drawer && !this.$.drawer.persistent) {
      this.$.drawer.close();
    }
  }

  _pageChanged(page) {
    // Import the page component on demand.
    //
    // Note: `polymer build` doesn't like string concatenation in the import
    // statement, so break it up.
    switch (page) {
      case 'profile':
        import('./my-profile.js');
        this.pageName = 'My profile';
        break;
      case 'devices':
        import('./my-devices.js');
        this.pageName = 'My devices';
        break;
      case 'hubs':
        import('./my-hubs.js');
        this.pageName = 'My hubs';
        break;
      case 'login':
        import('./my-login.js');
        this.pageName = 'Login';
        break;
      case 'view404':
        import('./my-view404.js');
        this.pageName = 'Page not found';
        break;
    }
  }

  _logout() {
    localStorage.clear();
    this.isUserSession = false;
    window.location.replace('/#/login');
    console.log(this.$.contenedor);
    this.$.contenedor.render();
  }
}

window.customElements.define('my-app', MyApp);
