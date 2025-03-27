class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  addEventListeners() {
    const form = this.shadowRoot.querySelector("form");
    const titleInput = this.shadowRoot.querySelector("#title");
    const bodyInput = this.shadowRoot.querySelector("#body");

    // Realtime validation
    titleInput.addEventListener("input", () => {
      if (titleInput.value.length < 3) {
        titleInput.setCustomValidity("Title must be at least 3 characters");
      } else {
        titleInput.setCustomValidity("");
      }
      this.updateValidationMessage(titleInput);
    });

    bodyInput.addEventListener("input", () => {
      if (bodyInput.value.length < 5) {
        bodyInput.setCustomValidity(
          "Note content must be at least 5 characters"
        );
      } else {
        bodyInput.setCustomValidity("");
      }
      this.updateValidationMessage(bodyInput);
      this.autoResize(bodyInput);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (form.checkValidity()) {
        const newNote = {
          title: titleInput.value,
          body: bodyInput.value,
        };

        this.dispatchEvent(
          new CustomEvent("note-added", {
            detail: { note: newNote },
            bubbles: true,
            composed: true,
          })
        );

        form.reset();
      }
    });

    // Auto-resize textarea
    bodyInput.addEventListener("focus", () => {
      this.autoResize(bodyInput);
    });
  }

  updateValidationMessage(input) {
    const errorElement = this.shadowRoot.querySelector(`#${input.id}-error`);
    errorElement.textContent = input.validationMessage;
  }

  autoResize(element) {
    // Reset tinggi terlebih dahulu
    element.style.height = "auto";
    // Sesuaikan tinggi berdasarkan scrollHeight
    element.style.height = element.scrollHeight + "px";
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 24px;
          background-color: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        h2 {
          margin-top: 0;
          color: #333;
          padding-left: 15px;
        }
          
        form {
          display: flex;
          flex-direction: column;
        }
        .form-group {
          margin-bottom: 16px;
        }
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
        }

        label[for="title"] {
          padding-left: 10px;
          margin-left: 10px;
        }
        label[for="body"] {
          padding-left: 10px;
          margin-left: 10px;
        }
        input, textarea {
          width: calc(100% - 40px);
          margin: 0 20px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          box-sizing: border-box;
          transition: border-color 0.3s ease;
        }
        input:focus, textarea:focus {
          outline: none;
          border-color: #4285f4;
          box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
        }
        textarea {
          min-height: 100px;
          resize: none;
        }
        button {
          padding: 10px 16px;
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          align-self: flex-start;
          margin-left: 20px;
          margin-bottom: 20px;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }
        button:hover {
          background-color: #3367d6;
          transform: translateY(-2px);
        }
        button:active {
          transform: translateY(0);
        }
        .error {
          color: red;
          font-size: 0.8rem;
          margin-top: 4px;
          margin-left: 20px;
        }
      </style>
      
      <h2>Add New Note</h2>
      <form>
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" required>
          <div id="title-error" class="error"></div>
        </div>
        
        <div class="form-group">
          <label for="body">Content</label>
          <textarea id="body" required></textarea>
          <div id="body-error" class="error"></div>
        </div>
        
        <button type="submit">Add Note</button>
      </form>
    `;

    // Initialize auto-resize
    const textarea = this.shadowRoot.querySelector("textarea");
    textarea.style.height = "100px";
  }
}

customElements.define("note-form", NoteForm);

export default NoteForm;
