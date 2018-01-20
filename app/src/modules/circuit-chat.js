'use strict';

import { html, render } from 'lit-html/lib/lit-extended';

/**
 * Circuit chat component. Displays messages of corresponding
 * conversation and allows posting texts. Requests user to login
 * to post messages via main app component.
 * API:
 *  client: Circuit client instance
 *  convId: conversation ID
 *  onLoggedOn: method called when user logged in
 *  logon: event raised to ask user to login
 */
class CircuitChat extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.posts = [];
    this.users = [];
  }

  // Properties
  set client(v) { this._client = v; }
  get client() { return this._client; }
  set convId(v) { this._convId = v; this.invalidate(); }
  get convId() { return this._convId; }
  get user() { return this.client.loggedOnUser; }

  // Computed properties
  get signedIn() { return !!this.client.loggedOnUser; }

  // Lifecycle callback when element is inserted in DOM
  connectedCallback() {
    // Wait for DOM children to be present
    requestAnimationFrame(() => this.init());
  }

  // Lifecycle callback when element is removed from DOM
  disconnectedCallback() {
    this.client.removeEventListener('itemAdded', this.itemAddedListener);
  }

  // Return default avatar if not logged in since avatars require authorization
  getAvatar(avatar) {
    return this.signedIn ? avatar : `https://${this.client.domain}/content/images/icon-general-default-avatar-blue.png`;
  }

  // Called by main app when user is logged in
  onLoggedOn() {
    this.join().catch(console.error);
  }

  // Initialization of component
  init() {
    // Listen for new posts on this conversation and render them
    this.client.addEventListener('itemAdded', this.itemAddedListener.bind(this));

    // Get posts even if not signed in
    this.getPosts().catch(console.error);

    // Update timestamps every minute since they are shown relative
    setInterval(() => this.invalidate(), 60 * 1000);
  }

  itemAddedListener(e) {
    if (e.item.convId !== this.convId) {
      return;
    }
    if (!e.item.text) {
      return;
    }
    // Fetch avatar and displayName of user
    fetch(`/user/${e.item.creatorId}`)
      .then(res => res.json())
      .then(user => {
        e.item.creatorAvatar = user.avatar;
        e.item.creatorDisplayName = user.displayName;
        this.posts.unshift(e.item);
        this.invalidate();
      })
  }

  // Get the most recent 50 posts and their creators for this conversation
  // from the bot (server-side app) so that unauthenticated users see the posts
  getPosts() {
    return fetch(`/posts/${this.convId}`)
      .then(res => res.json())
      .then(res => this.posts = res)
      .then(() => this.invalidate());
  }

  // Post a new message
  post() {
    if (!this.signedIn) {
      // Send logon request event to main app. Only authenticated user can post.
      this.dispatchEvent(new CustomEvent('logon'));
      return;
    }

    this.sendMessage()
      .catch(err => this.join().then(() => this.sendMessage()))
      .catch(console.error);
  }

  join() {
    return fetch(`/join/${this.convId}/${this.user.userId}`, {method: 'POST'});
  }

  sendMessage() {
    const messageEl = this.shadowRoot.querySelector('#message');
    if (!messageEl.value) {
      return Promise.resolve();
    }
    return this.client.addTextItem(this.convId, messageEl.value)
      .then(() => {
        messageEl.value = '';
        messageEl.focus();
      });
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
        :host {
          font-size: 15px;
          font-weight: 300;
          color: #3e4551;
        }
        .signin {
          margin-top: 15px;
          margin-bottom: 10px;
          font-size: 13px;
        }
        button[name="signin"] {
          margin-bottom: 10px;
        }
        .new-post {
          display: flex;
          margin-top: 15px;
          margin-bottom: 15px;
        }
        button[name="post"] {
          align-self: flex-end;
        }
        textarea {
          width: 100%;
          resize: none;
          margin-right: 10px;
          border: solid 1px #ccc;
          padding: 5px;
        }
        textarea:focus {
          outline: none;
        }
        .post {
          margin-bottom: 10px;
          padding: 5px;
        }
        .post:hover {
          background-color: rgba(236,238,241,.45);
        }
        .header {
          transition: background-color .08s ease-in;
          margin-bottom: 2px;
        }
        .sender {
          cursor: pointer;
          font-weight: 500;
        }
        .sender>a {
          color: rgb(62, 69, 81);
        }
        .sender img {
          vertical-align: middle;
          margin-right: 7px;
          width: 24px;
          height: 24px;
          border-radius: 12px;
        }
        .time {
          font-size: 13px;
          margin-left: 3px;
          color: gray;
        }
      </style>

      <div class="new-post">
        <textarea id="message" rows="2" placeholder="Enter a comment"></textarea>
        <button name="post" type="button"on-click=${() => this.post()} class="btn btn-outline-primary btn-sm">Post</button>
      </div>

      ${!this.signedIn ?
        html`<div class="signin">
          <div>Sign in is required to post messages.<br>Use your own sandbox account or one of these test accounts:</div>
          <div><i>kim.jackson@mailinator.com</i></div>
          <div><i>maeva.barnaby@mailinator.com</i></div>
          <div>with password <i>GoCircuit!1</i></div>
        </div>` : ''
      }

      ${this.posts.map(post => html`
        <div class="post">
          <div class="header">
            <span class="sender">
              <a target="_blank" href=${`https://${this.client.domain}/#/user/${post.creatorId}`}>
                <img src=${this.getAvatar(post.creatorAvatar)}>
                ${this.user && post.creatorId === this.user.userId ? html`You` : html`${post.creatorDisplayName}`}
              </a>
            </span>
            <span class="time">${moment(post.creationTime).fromNow()}</span>
          </div>
          <div class="body">${post.text.content}</div>
        </div>
      `)}
    `;
  }
}

customElements.define('circuit-chat', CircuitChat);
