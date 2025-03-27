class AppBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ["title"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "title" && oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: #4285f4;
          color: white;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          animation: slideDown 0.5s ease;
        }
        
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        h1 {
          margin: 0;
          font-size: 1.5rem;
          padding-left: 20px;
        }
      </style>
      <h1>${this.getAttribute("title") || "Notes App"}</h1>
    `;
  }
}

customElements.define("app-bar", AppBar);

export default AppBar;
