'use strict';

import { domain } from './config.js';
import { LitElement, html } from './lit-element.js';

/**
 * Circuit sign in state
 */
const SigninState = {
  SIGNED_OUT: 'SIGNED_OUT',
  SIGNED_IN: 'SIGNED_IN',
  SIGNING_IN: 'SIGNING_IN',
  NONE: 'NODE'
}

/**
 * Circuit chat component. Handles Circuit OAuth sign-in, displays
 * messages of corresponding conversation and allows posting texts.
 */
class CircuitChat extends LitElement {
  constructor() {
    super();
    this.posts = [];
    this.users = [];
    this.convId = null;
  }

  static get properties() {
    return {
      clientId: {
        type: String
      },
      conv: {
        type: String
      },
      loading: {
        type: Boolean,
        value: false
      },
      signinState: {
        type: String,
        value: SigninState.NONE
      }
    }
  }

  // Web Components life cycle event when element is inserted into a document
  connectedCallback() {
    super.connectedCallback();

    // Initialize the Circuit SDK client instance
    this.client = new Circuit.Client({ client_id: this.clientId });

    // Listen for new posts on this conversation and render them
    this.client.addEventListener('itemAdded', e => {
      if (e.item.convId !== this.convId) {
        return;
      }
      e.item.text && this.posts.unshift(e.item);
      this.updateUserCache([e.item])
        .then(() => this.invalidate())
        .catch(console.error);
    });

    // Sign in automatically if access token is present
    this.client.logonCheck()
      .then(() => {
        this.signinState = SigninState.SIGNING_IN;
        this.signin();
      })
      .catch(() => {
        this.signinState = SigninState.SIGNED_OUT;
        this.invalidate();
      });

    // Update timestamps every minute since they are shown relative
    setTimeout(() => this.invalidate(), 60 * 1000);
  }

  get isConnected() {
    return this.client && this.client.connectionState === Circuit.Enums.ConnectionState.Connected;
  }

  static get observedAttributes() {
    // Observe the conversation ID attribute
    return ['conversation'];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr === 'conversation') {
      // Switched conversation, get posts for conversation and render
      this.convId = newValue;
      if (this.isConnected) {
        this.getPosts()
          .then(() => this.invalidate())
          .catch(console.error);
      }
    }
  }

  // Sign in and when successful get posts and render
  signin() {
    this.signinState = SigninState.SIGNING_IN;
    this.client.logon()
      .then(user => {
        this.signinState = SigninState.SIGNED_IN;
        this.dispatchEvent(new CustomEvent('logon', {
            detail: { user }
        }));
      })
      .then(() => this.getPosts())
      .then(() => this.invalidate())
      .catch(err => {
        this.signinState = SigninState.SIGNED_OUT;
        console.error(err);
      });
  }

  // Get the most recent 50 posts and their creators for this conversation
  getPosts() {
    this.loading = true;
    return this.client.getConversationItems(this.convId, {numberOfItems: 50})
      .then(items => this.posts = items.reverse().filter(item => !!item.text))
      .then(() => this.updateUserCache())
      .then(() => this.loading = false)
  }

  // Get the user objects for the creators to get name and avatar
  updateUserCache(posts) {
    posts = posts || this.posts;
    const newUserIds = posts
      .map(post => post.creatorId)
      .filter(userId => !this.users[userId]);

    return this.client.getUsersById(newUserIds)
      .then(users => users.forEach(user => this.users[user.userId] = user));
  }

  // Post a new message
  post(convId) {
    let message = this.$('message').value;
    if (!message) {
      return;
    }
    this.client.addTextItem(this.convId, message)
      .then(() => {
        this.$('message').value = '';
        this.$('message').focus();
      })
      .catch(console.error);
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
      ${this.signinState === SigninState.SIGNING_IN ?
        html`<div>Signing in...</div>` : ''}

      ${this.signinState === SigninState.SIGNED_OUT ?
        html`<div class="signin">
          <button name="signin" type="button" on-click=${() => this.signin()} class="btn btn-outline-primary btn-sm">Sign in with Circuit</button>
          <div>Use one of these test accounts:</div>
          <div>kim.jackson@mailinator.com</div>
          <div>maeva.barnaby@mailinator.com</div>
          <div>derek.hopkins@mailinator.com</div>
          <div>with password GoCircuit!1</div>
        </div>` :
      ''}

      ${this.signinState === SigninState.SIGNED_IN && this.loading ?
        html`<div>Loading...</div>` : ''}

      ${this.signinState === SigninState.SIGNED_IN && !this.loading ?
        html`<div class="new-post">
          <textarea id="message" rows="2" placeholder="Enter a comment"></textarea>
          <button name="post" type="button" on-click=${() => this.post()} class="btn btn-outline-primary btn-sm">Post</button>
        </div>
        <div>
          ${this.posts.map(post => html`
            <div class="post">
              <div class="header">
                <span class="sender">
                  <a target="_blank" href=${`https://${domain}/#/user/${this.users[post.creatorId].userId}`}>
                    <img src=${this.users[post.creatorId].avatar}>
                    ${post.creatorId === this.client.loggedOnUser.userId ? html`You:` : html`${this.users[post.creatorId].displayName}`}
                  </a>
                </span>
                <span class="time">${moment(post.creationTime).fromNow()}</span>
              </div>
              <div class="body">${post.text.content}</div>
            </div>
          `)}
        </div>` :
      ''}
    `;
  }
}

customElements.define('circuit-chat', CircuitChat.withProperties());
