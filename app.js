'use strict';

import { shows, client_id } from './config.js';
import { LitElement, html } from './lit-element.js';

/**
 * Main app. Renders main app and handles route changes.
 */
class ImdbApp extends LitElement {
  constructor() {
    super();
    this.show = shows[0];
    window.onhashchange = this.routeChange.bind(this);
    window.onload = this.routeChange.bind(this);
  }

  // Setter and getter for logged in Circuit user
  set user(v) {
    this._user = v;
    this.shadowRoot.querySelector('imdb-header').user = v;
  }
  get user() { return this._user; }

  // Lookup show on navigation change
  routeChange() {
    const id = location.hash.substring(2);
    if (!id) {
      return;
    }
    let show = shows.find(show => show.name === decodeURIComponent(id));
    if (!show) {
      console.error(`Not a valid show: ${id}`);
      return;
    }
    this.show = show;
    this.invalidate();
  }

  render() {
    return html`
      <style>
        @import "//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css";
        .poster {
          height: 300px;
          margin: 5px 0 20px 0;
        }
        footer {
            margin-top: 20px;
            padding-top: 5px;
            color: #777;
            border-top: .05rem solid #e5e5e5;
            text-align: center;
            font-size: 14px;
        }
      </style>
      <imdb-header shows="${shows}" selected="${this.show}"></imdb-header>
      <main role="main">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <h2>${this.show.name}</h2>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <img class="poster" src="${this.show.data.Poster}">
              <h5>Plot</h5>
              <p>${this.show.data.Plot}</p>
              <h5>Actors</h5>
              <p>${this.show.data.Actors}</p>
              <h5>Writer(s)</h5>
              <p>${this.show.data.Writer}</p>
              <h5>Awards</h5>
              <p>${this.show.data.Awards}</p>
              <h5>Ratings</h5>
              <p>IMDb: ${this.show.data.imdbRating}</p>
              <h5>Released</h5>
              <p>${this.show.data.Released}</p>
              <h5>Year</h5>
              <p>${this.show.data.Year}</p>
              <h5>Rated</h5>
              <p>${this.show.data.Rated}</p>
            </div>
            <div class="col-md-6">
              <h5>Discuss <i>${this.show.name}</i></h5>
              <circuit-chat
                clientId="${client_id}"
                conversation$="${this.show.convId}"
                on-logon="${e => this.user = e.detail.user}">
              </circuit-chat>
            </div>
          </div>
        </div>
      </main>
      <footer>
        <a target="_blank" href="https://github.com/circuit/imdb-collaboration">github.com/circuit/imdb-collaboration</a>
      </footer>
    `;
  }
}

customElements.define('imdb-app', ImdbApp.withProperties());
