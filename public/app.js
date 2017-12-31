'use strict';

import { LitElement, html } from './lit-html-element/lit-element.js';

// Get your own client_id for free at http://circuit.github.io/oauth
const client_id = '05e6fecd330e4d1094a55c0e64ec9e85';

// In the next step we'll get them via REST and allow searching
const shows = [{
  name: 'Seinfeld',
  convId: '85ac4b2f-3c6f-4d49-acdb-49cd635ec283',
  storyline: `Jerry Seinfeld stars in this television comedy series as himself, a comedian. The premise of this sitcom is Jerry and his friends going through everyday life, discussing various quirky situations that we can all relate to (especially if we live in New York). The eccentric personalities of the offbeat characters who make up Jerry's social circle contribute to the fun.`
}, {
  name: 'Breaking Bad',
  convId: '9f9dfd27-3082-4968-8069-9f83f1ace86b',
  storyline: `When chemistry teacher Walter White is diagnosed with Stage III cancer and given only two years to live, he decides he has nothing to lose. He lives with his teenage son, who has cerebral palsy, and his wife, in New Mexico. Determined to ensure that his family will have a secure future, Walt embarks on a career of drugs and crime. He proves to be remarkably proficient in this new world as he begins manufacturing and selling methamphetamine with one of his former students. The series tracks the impacts of a fatal diagnosis on a regular, hard working man, and explores how a fatal diagnosis affects his morality and transforms him into a major player of the drug trade.`
}, {
  name: 'Game of Thrones',
  convId: 'a7342b73-417c-4a4e-bb65-9440c75d3a7d',
  storyline: `In the mythical continent of Westeros, several powerful families fight for control of the Seven Kingdoms. As conflict erupts in the kingdoms of men, an ancient enemy rises once again to threaten them all. Meanwhile, the last heirs of a recently usurped dynasty plot to take back their homeland from across the Narrow Sea.`
}];

// The main app element
class ImdbApp extends LitElement {
  constructor() {
    super();
    this.show = shows[0]; // Select first show for now
    window.onhashchange = this.routeChange.bind(this);
    window.onload = this.routeChange.bind(this);
  }

  // Properties defined for LitElement
  static get properties() {
    return {
      shows: {
        type: Array,
        value: []
      },
      show: {
        type: Object
      }
    }
  }

  set user(v) {
    this._user = v;
    this.shadowRoot.querySelector('imdb-nav').user = v;
  }
  get user() { return this._user; }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener('logon', e => {
      console.log(e)
    })
  }

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
        footer {
            margin-top: 20px;
            padding-top: 5px;
            color: #777;
            border-top: .05rem solid #e5e5e5;
            text-align: center;
            font-size: 14px;
        }
      </style>
      <imdb-nav shows="${shows}" selected="${this.show}"></imdb-nav>
      <main role="main">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <h2>${this.show.name}</h2>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <h5>Storyline</h5>
              <p>${this.show.storyline}</p>
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
        <p><a target="_blank" href="https://github.com/circuit/imdb-collaboration">github.com/circuit/imdb-collaboration</a></p>
      </footer>
    `;
  }
}

customElements.define('imdb-app', ImdbApp.withProperties());
