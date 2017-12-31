'use strict';

import { LitElement, html } from './lit-html-element/lit-element.js';

class ImdbNav extends LitElement {
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
              <a target="_blank" class="nav-link" href="${'https://circuitsandbox.net/#/user/' + this.user.userId}">
                <img src="${'https://circuitsandbox.net/fileapi/' + this.user.userId + '_s.jpg?fileid=' + this.user.smallImageUri}">${this.user.displayName}
              </a>
            </li>
          </ul>
          ` : ''}
      </nav>
    `;
  }
}

customElements.define('imdb-nav', ImdbNav.withProperties());
