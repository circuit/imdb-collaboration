'use strict';

import { html, render } from 'lit-html/lib/lit-extended';
import debounce from 'debounce';

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
    this.result = {};
    this.searchDebounced = debounce(query => this.search(query), 1000);
  }

  // Properties
  set apikey(v) { this._apikey = v; }
  get apikey() { return this._apikey; }
  set result(v) { this._result = v; this.invalidate(); }
  get result() { return this._result; }

  connectedCallback() {
    requestAnimationFrame(() => {
      this.shadowRoot.querySelector('input').focus();
      this.invalidate();
    });
  }

  // Search immediate on <enter>, Clear immediate on <no input>,
  // otherwise debounce
  onkeypress(e) {
    const searchTerm = this.shadowRoot.querySelector('input').value;
    if (!searchTerm) {
      this.result = {};
      this.searchDebounced.clear();
    } else if (e.keyCode === 13) {
      this.searchDebounced.flush();
    } else {
      this.searchDebounced(searchTerm);
    }
  }

  // Search
  search(query) {
    console.log('Execute search with term: ' + query);
    fetch(`/search/${query}`)
      .then(res => res.json())
      .then(res => this.result = res)
      .catch(console.error);
  }

  select(imdbID) {
    this.dispatchEvent(new CustomEvent('select', { detail: imdbID }));
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
        <div class="row justify-content-md-center pb-5">
          <div class="col-md-8">
            ${this.result.Search && this.result.Search.map(res => html`
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
            ${this.result.Error ? html`
              <div class="">
                ${this.result.Error}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('imdb-search', ImdbSearch);
