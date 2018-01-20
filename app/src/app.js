'use strict';

import { client_id, omdbapikey } from './config.js';
import { html, render } from 'lit-html/lib/lit-extended'
import { ImdbHeader } from './modules/imdb-header.js';
import { ImdbSearch } from './modules/imdb-search.js';
import { CircuitChat } from './modules/circuit-chat.js';

/**
 * Main app. Renders home page, handles route changes and
 * signs user in automatically if access token present.
 */
class ImdbApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    window.onhashchange = this.routeChange.bind(this);
    window.onload = this.routeChange.bind(this);
  }

  // Properties
  set show(v) { this._show = v; this.invalidate(); }
  get show() { return this._show; }
  set user(v) { this._user = v; this.invalidate(); }
  get user() { return this._user; }

  connectedCallback() {
    // Initialize the Circuit SDK client instance (IMPLICIT Grant)
    this.client = new Circuit.Client({client_id: client_id});

    this.client.logonCheck()
      .then(() => this.logon())
      .catch(console.log);
  }

  logon() {
    this.client.logon()
      .then(user => {
        this.user = user;
        this.shadowRoot.querySelector('circuit-chat').onLoggedOn();
      })
      .catch(err => console.error);
  }

  routeChange() {
    const id = location.hash.substring(1);
    if (!id) {
      // Show home page (search)
      this.show = null;
      return;
    }

    // Get details of selected show
    const showPromise = fetch(`http://www.omdbapi.com/?apikey=${omdbapikey}&i=${id}`)
      .then(res => res.json());

    // Lookup conversation using Circuit search by conversation title
    const convPromise = fetch(`/find/${id}`)
      .then(res => res.text())

    Promise.all([showPromise, convPromise])
      .then(([show, convId]) => {
        show.convId = convId;
        this.show = show;
      })
      .catch(console.error);
  }

  invalidate() {
    if (!this.needsRender) {
      this.needsRender = true;
      Promise.all([
        // Ensure child elements have been defined
        customElements.whenDefined('imdb-header'),
        customElements.whenDefined('imdb-search'),
        customElements.whenDefined('circuit-chat')
      ]).then(() => {
        this.needsRender = false;
        render(this.render(), this.shadowRoot);
      });
    }
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
          position: fixed;
          bottom: 0;
          width: 100%;
          height: 50px;
          background-color: #f5f5f5;
          padding-top: 15px;
          color: #777;
          border-top: .05rem solid #e5e5e5;
          text-align: center;
          font-size: 14px;
        }
      </style>
      <imdb-header client="${this.client}"></imdb-header>
      <main role="main">
        <imdb-search
          hidden=${!!this.show}
          apikey="${omdbapikey}"
          on-select="${e => location.hash = e.detail}">
        </imdb-search>

        ${this.show ?
          html`
          <div class="container">
            <div class="row">
              <div class="col-md-12">
                <h2>${this.show.Title}</h2>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <img class="poster" src="${this.show.Poster}">
                <h5>Plot</h5><p>${this.show.Plot}</p>
                <h5>Actors</h5><p>${this.show.Actors}</p>
                <h5>Writer(s)</h5><p>${this.show.Writer}</p>
                <h5>Awards</h5><p>${this.show.Awards}</p>
                <h5>Ratings</h5><p>IMDb: ${this.show.imdbRating}</p>
                <h5>Released</h5><p>${this.show.Released}</p>
                <h5>Year</h5><p>${this.show.Year}</p>
                <h5>Rated</h5><p>${this.show.Rated}</p>
              </div>
              <div class="col-md-6">
                <h5>Discuss <i>${this.show.Title}</i></h5>
                <circuit-chat
                  client="${this.client}"
                  convId="${this.show.convId}"
                  on-logon="${() => this.logon()}">
                </circuit-chat>
              </div>
            </div>
          </div>
          ` : ''
        }
      </main>
      <footer class="footer">
        <div class="container">
          <a target="_blank" href="https://github.com/circuit/imdb-collaboration">github.com/circuit/imdb-collaboration</a>
        </div>
      </footer>
    `;
  }
}

customElements.define('imdb-app', ImdbApp);
