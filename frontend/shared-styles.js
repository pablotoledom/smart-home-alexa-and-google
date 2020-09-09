/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import '@polymer/polymer/polymer-element.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `<dom-module id="shared-styles">
  <template>
    <style>
      .container {
        margin: 15px;
      }

      .container-button {
        margin: 15px 0;
      }

      .item {
        display: inline-block;
        vertical-align: top;
        margin-right: 15px;
      }

      .card {
        min-height: 340px;
        min-width: 320px;
        background-color: #fff;
        margin-bottom: 15px;
        border-radius: 6px;
        padding: 10px;
        color: #757575;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
      }

      .card+.card {
        margin-right: 15px;
      }

      .circle {
        display: inline-block;
        width: 64px;
        height: 64px;
        text-align: center;
        color: #555;
        border-radius: 50%;
        background: #ddd;
        font-size: 30px;
        line-height: 64px;
      }

      .square {
        background-color: #efefef;
        border-radius: 5px;
        padding: 5px;
        font-size: 16px;
        line-height: 30px;
        min-width: 48px;
        text-align: center;
      }

      h1 {
        margin: 16px 0;
        color: #212121;
        font-size: 22px;
      }

      p {
        color: #757575;
        font-family: 'Roboto', 'Noto', sans-serif;
        font-size: 15px;
      }

      section + section {
        padding: 15px;
        border-top: 1px solid #bac8df;
      }

      paper-button {
        margin: 0;
      }

      .success-message {
        --paper-toast-background-color: #2FB5EF;
        --paper-toast-color: white;
      }

      .error-message {
        --paper-toast-background-color: red;
        --paper-toast-color: white;
      }

      .error-session-message {
        --paper-toast-background-color: black;
        --paper-toast-color: white;
      }

      .yellow-button {
        text-transform: none;
        color: #eeff41;
      }

      #errorSessionMsg {
        display: flex;
        align-items: center;
      }

      #errorSessionMsg > paper-button {
        margin-left: 20px;
      }



      #modal {
        width: 70%;
        overflow-y: scroll;
        padding: 24px 0px;
      }
      
      #insert-json-textarea {
        width: 40em;
        height: 20em;
      }
      
      .square-button {
        height: 180px;
        width: 180px;
        margin: auto;
        background: none;
        border: none;
        outline: none;
      }
      
      .square-button:hover {
        background-color: rgb(238, 238, 238);
      }
      
      iron-icon {
        height: 55%;
        width: 55%;
        color: #757575;
      }
      
      .modal-title {
        display: flex;
        justify-content: space-between;
        margin: 0;
      }
      
      .modal-title > h1 {
        margin-top: 5px;
      }
      
      .modal-content {
        margin: 0;
      }
      
      .modal-close {
        margin: 0;
        padding: 0;
        width: 30px;
        height: 30px;
      }
      
      .modal-close > iron-icon {
        height: 100%;
        width: 100%;
        cursor: pointer;
        cursor: hand;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
