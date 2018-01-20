'use strict';

import { html, render } from 'lit-html/lib/lit-extended';

/**
 * Search component. Searches for movies and TV shows on http://www.omdbapi.com/
 * API:
 *   apikey: API Key for omdbapi
 *   on-select: event with imdbID of selected show
 */
class ImdbSearch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.results = [];
  }

  // Properties
  set apikey(v) { this._apikey = v; }
  get apikey() { return this._apikey; }
  set results(v) { this._results = v; this.invalidate(); }
  get results() { return this._results; }

  connectedCallback() {
    requestAnimationFrame(() => {
      this.shadowRoot.querySelector('input').focus();
      this.invalidate();
    });
  }

  search() {
    const searchTerm = this.shadowRoot.querySelector('input').value;
    fetch(`http://www.omdbapi.com/?apikey=${this.apikey}&s=${searchTerm}`)
      .then(res => res.json())
      .then(res => {
        if (res.Search) {
          this.results = res.Search;
        }
      })
      .catch(console.error);
  }

  select(imdbID) {
    this.dispatchEvent(new CustomEvent('select', { detail: imdbID }));
  }

  onkeypress(e) {
    if (!e.target.value) {
      this.results = [];
    } else if (e.keyCode === 13) {
      this.search();
    }
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
        .media {
          transition:color .2s ease-out, background 0.2s ease-in;
        }
        .media:hover {
          background:rgba(0,0,0,0.07);
          cursor: pointer;
        }
      </style>
      <div class="container">
        <div class="row justify-content-md-center">
          <div class="col-md-8">
            <input class="mt-4 mb-4 w-100" type="text" placeholder="Search movie or TV show" on-keyup=${e => this.onkeypress(e)}>
          </div>
        </div>
        <div class="row justify-content-md-center">
          <div class="col-md-8">
            ${this.results.map(res => html`
              <div class="media p-2" on-click=${() => this.select(res.imdbID)}>
                <img class="d-flex mr-3" height="100px" src=${res.Poster}>
                <div class="media-body mt-2">
                  <h5 class="mt-0">${res.Title}
                    <small class="text-muted">${res.Year}</small>
                  </h5>
                  <div>${res.Type === 'movie' ? 'Movie' : 'TV Series'}</div>
                </div>
              </div>
            `)}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('imdb-search', ImdbSearch);
