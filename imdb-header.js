'use strict';

import { domain } from './config.js';
import { LitElement, html } from './lit-element.js';

/**
 * Navigation component. Shows TV show links and logged on user
 * with avatar.
 */
class ImdbHeader extends LitElement {
  static get properties() {
    return {
      shows: {
        type: Array,
        value: []
      },
      selected: {
        type: Object
      },
      user: {
        type: Object
      }
    }
  }

  // Due to a bug in the SDK, user.avatar is missing and we need to build it ourselves using smallImageUri
  get avatar() { return `https://${domain}/fileapi/${this.user.userId}_s.jpg?fileid=${this.user.smallImageUri}`; }

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
        <div class="navbar-brand">TV Shows</div>
        <ul class="navbar-nav mr-auto">
          ${this.shows.map(show => html`
            <li class="nav-item" class$="${this.selected === show ? 'active' : ''}">
              <a class="nav-link" href=${'#/' + encodeURIComponent(show.name)}>${show.name}</a>
            </li>
          `)}
        </ul>
        ${this.user ? html`
          <ul class="nav navbar-nav navbar-right user">
            <li class="nav-item">
              <a target="_blank" class="nav-link" href="${`https://${domain}/#/user/${this.user.userId}`}">
                <img src="${this.avatar}">${this.user.displayName}
              </a>
            </li>
          </ul>
          ` : ''}
      </nav>
    `;
  }
}

customElements.define('imdb-header', ImdbHeader.withProperties());
