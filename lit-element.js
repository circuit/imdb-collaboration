// https://github.com/kenchris/lit-element
// Including manually here since pull request (https://github.com/kenchris/lit-element/pull/23)
// is required, but not yet available in npm
import { html, render } from '//unpkg.com/lit-html/lib/lit-extended.js';
export { html } from '//unpkg.com/lit-html/lib/lit-extended.js';
export class LitElement extends HTMLElement {
    constructor() {
        super();
        this._needsRender = false;
        this._lookupCache = [];
        this._values = [];
        this._attrMap = {};
        this.attachShadow({ mode: 'open' });
        for (const prop in this.constructor.properties) {
            const attrName = this.constructor.properties[prop].attrName;
            if (attrName) {
                this._attrMap[attrName] = prop;
            }
        }
    }
    static get properties() {
        return [];
    }
    static get observedAttributes() {
        const attrs = [];
        for (const prop in this.properties) {
            const attrName = this.properties[prop].attrName;
            if (attrName) {
                attrs.push(attrName);
            }
        }
        return attrs;
    }
    static withProperties() {
        for (const prop in this.properties) {
            const { type: typeFn, value, attrName } = this.properties[prop];
            Object.defineProperty(this.prototype, prop, {
                get() {
                    const v = this._values[prop];
                    return (v !== undefined) ? v : value;
                },
                set(v) {
                    const value = typeFn === Array ? v : typeFn(v);
                    this._values[prop] = value;
                    if (attrName) {
                        if (typeFn.name === 'Boolean') {
                            if (!value) {
                                this.removeAttribute(attrName);
                            }
                            else {
                                this.setAttribute(attrName, attrName);
                            }
                        }
                        else {
                            this.setAttribute(attrName, value);
                        }
                    }
                    this.invalidate();
                },
            });
        }
        return this;
    }
    renderCallback() {
        render(this.render(), this.shadowRoot);
    }
    render() {
        return html ``;
    }
    attributeChangedCallback(attrName, _oldValue, newValue) {
        const prop = this._attrMap[attrName];
        const { type: typeFn } = this.constructor.properties[prop];
        if (typeFn.name === 'Boolean') {
            this._values[prop] = (newValue === '') || (newValue === attrName);
        }
        else {
            this._values[prop] = typeFn(newValue);
        }
        this.invalidate();
    }
    connectedCallback() {
        this.invalidate();
    }
    async invalidate() {
        if (!this._needsRender) {
            this._needsRender = true;
            // Schedule the following as micro task, which runs before
            // requestAnimationFrame. All additional invalidate() calls
            // before will be ignored.
            // https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
            this._needsRender = await false;
            this.renderCallback();
        }
    }
    $(id) {
        let value = this._lookupCache[id];
        if (!value && this.shadowRoot) {
            const element = this.shadowRoot.getElementById(id);
            if (element) {
                value = element;
                this._lookupCache[id] = element;
            }
        }
        return value;
    }
}
//# sourceMappingURL=lit-element.js.map