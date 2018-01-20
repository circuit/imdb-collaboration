'use strict';

import { html, render } from 'lit-html/lib/lit-extended'

/**
 * Header component. Shows app title and logged on user's
 * name & avatar.
 */
class ImdbHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }

  // Properties
  set client(v) { this._client = v; this.invalidate(); }
  get client() { return this._client; }
  get user() { return this.client.loggedOnUser; }

  connectedCallback() {
    this.invalidate();
  }

  invalidate() {
    if (!this.needsRender) {
      this.needsRender = true;
      Promise.resolve().then(() => {
        this.needsRender = false;
        render(this.render(), this.shadowRoot);
      });
    }
  }

  render() {
    return html`
      <style>
        @import "//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css";
        img {
          vertical-align: middle;
          margin-right: 7px;
          width: 28px;
          height: 28px;
          border-radius: 12px;
        }
        .user a {
          padding: 0px;
        }
      </style>
      <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <a class="navbar-brand" href="/#">IMDb Collaboration</a>
        <ul class="navbar-nav mr-auto">
        </ul>
          <ul class="nav navbar-nav navbar-right user">
            ${this.user && html`
              <li class="nav-item">
                <a target="_blank" class="nav-link" href="${`https://${this.client.domain}/#/user/${this.user.userId}`}">
                  <img src="${this.user.avatar}">${this.user.displayName}
                </a>
              </li>
            `}
          </ul>
      </nav>
    `;
  }
}

customElements.define('imdb-header', ImdbHeader);
