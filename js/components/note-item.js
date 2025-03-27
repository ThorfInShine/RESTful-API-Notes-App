class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['title', 'body', 'created-at', 'archived', 'note-id'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

  get title() {
    return this.getAttribute('title') || 'Untitled';
  }
  
  get body() {
    return this.getAttribute('body') || 'No content';
  }
  
  get createdAt() {
    return this.getAttribute('created-at') || new Date().toISOString();
  }
  
  get noteId() {
    return this.getAttribute('note-id');
  }
  
  get isArchived() {
    return this.getAttribute('archived') === 'true';
  }

  formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  render() {
    console.log(`Rendering note: ${this.noteId}, archived: ${this.isArchived}`);
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        :host(:hover) {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        h3 {
          margin-top: 0;
          margin-bottom: 8px;
          color: #333;
        }
        .date {
          font-size: 0.8rem;
          color: #888;
          margin-bottom: 12px;
        }
        .body {
          color: #555;
          white-space: pre-line;
          margin-bottom: 16px;
        }
        .actions {
          display: flex;
          gap: 8px;
        }
        button {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .delete-btn {
          background-color: #f44336;
          color: white;
        }
        .archive-btn {
          background-color: ${this.isArchived ? '#4CAF50' : '#ff9800'};
          color: white;
        }
      </style>
      
      <h3>${this.title}</h3>
      <div class="date">${this.formatDate(this.createdAt)}</div>
      <div class="body">${this.body}</div>
      <div class="actions">
        <button class="archive-btn">${this.isArchived ? 'Unarchive' : 'Archive'}</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    // Add event listeners
    const deleteBtn = this.shadowRoot.querySelector('.delete-btn');
    const archiveBtn = this.shadowRoot.querySelector('.archive-btn');
    
    deleteBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('delete-note', {
        detail: { id: this.noteId },
        bubbles: true,
        composed: true
      }));
    });
    
    archiveBtn.addEventListener('click', () => {
      console.log(`Dispatching archive event for note: ${this.noteId}, current archived status: ${this.isArchived}`);
      this.dispatchEvent(new CustomEvent('archive-note', {
        detail: { 
          id: this.noteId,
          archived: this.isArchived
        },
        bubbles: true,
        composed: true
      }));
    });
  }
}

customElements.define('note-item', NoteItem);

export default NoteItem;