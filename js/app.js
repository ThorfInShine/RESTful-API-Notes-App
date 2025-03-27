// Import CSS
import "../css/style.css";
import "../css/responsive.css";

// Import komponen
import "./components/app-bar.js";
import "./components/note-form.js";
import "./components/note-item.js";
import "./components/notes-grid.js";

// Import utils dan API
import {
  showSuccessAlert,
  showConfirmationAlert,
} from "./utils/alert-helper.js";
import {
  getNotes,
  addNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
} from "./data/api-service.js";

// Initialize app
document.addEventListener("DOMContentLoaded", async () => {
  // Get DOM elements
  const notesGrid = document.querySelector("notes-grid");
  const archivedNotesGrid = document.querySelector("#archived-notes");

  // Load notes from API
  await loadNotes();

  // Listen for events
  document.addEventListener("note-added", async (e) => {
    try {
      const { title, body } = e.detail.note;
      await addNote({ title, body });
      showSuccessAlert("Note added successfully!");
      await loadNotes();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  });

  document.addEventListener("delete-note", async (e) => {
    try {
      const noteId = e.detail.id;
      const confirmed = await showConfirmationAlert(
        "Are you sure you want to delete this note?"
      );

      if (confirmed) {
        await deleteNote(noteId);
        showSuccessAlert("Note deleted successfully!");
        await loadNotes();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  });

  document.addEventListener('archive-note', async (e) => {
    try {
      const noteId = e.detail.id;
      const isCurrentlyArchived = e.detail.archived;
      
      console.log(`Handling archive event for note: ${noteId}`);
      console.log(`Current archived status: ${isCurrentlyArchived}`);
      
      // Jika catatan sudah diarsipkan, batalkan arsip. Jika belum, arsipkan.
      if (isCurrentlyArchived) {
        await unarchiveNote(noteId);
        console.log('Note unarchived successfully');
      } else {
        await archiveNote(noteId);
        console.log('Note archived successfully');
      }
      
      // Reload notes setelah arsip/batalkan arsip
      await loadNotes();
    } catch (error) {
      console.error('Error archiving/unarchiving note:', error);
    }
  });
  

 // Function to load notes from API
async function loadNotes() {
  try {
    const notes = await getNotes();
    console.log('Loaded notes:', notes); // Log untuk debugging
    updateNotes(notes);
  } catch (error) {
    console.error('Error loading notes:', error);
  }
}

// Update notes display
function updateNotes(notes) {
  const activeNotes = notes.filter(note => !note.archived);
  const archivedNotes = notes.filter(note => note.archived);
  
  console.log('Active notes:', activeNotes);
  console.log('Archived notes:', archivedNotes);
  
  notesGrid.notes = activeNotes;
  archivedNotesGrid.notes = archivedNotes;
}
});
