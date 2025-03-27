class NotesGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.notes = [];
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ["empty-message"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "empty-message") {
      this.render();
    }
  }

  get emptyMessage() {
    return this.getAttribute("empty-message") || "No notes found";
  }

  set notes(value) {
    this._notes = value;
    this.render();
  }

  get notes() {
    return this._notes || [];
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .empty-message {
          text-align: center;
          padding: 32px;
          color: #888;
          font-style: italic;
          animation: fadeIn 0.5s ease;
        }
      </style>
      
      ${
        this.notes.length === 0
          ? `<div class="empty-message">${this.emptyMessage}</div>`
          : `<div class="grid" id="notes-container"></div>`
      }
    `;

    if (this.notes.length > 0) {
      const container = this.shadowRoot.getElementById("notes-container");
      this.notes.forEach((note) => {
        const noteItem = document.createElement("note-item");
        noteItem.setAttribute("title", note.title);
        noteItem.setAttribute("body", note.body);
        noteItem.setAttribute("created-at", note.createdAt);
        noteItem.setAttribute("note-id", note.id);
        noteItem.setAttribute("archived", note.archived.toString());
        container.appendChild(noteItem);
      });
    }
  }
}

customElements.define("notes-grid", NotesGrid);

export default NotesGrid;
