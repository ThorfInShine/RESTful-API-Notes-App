import { showLoading, hideLoading } from '../utils/loading-indicator.js';
import { showErrorAlert } from '../utils/alert-helper.js';

const BASE_URL = 'https://notes-api.dicoding.dev/v2';

// Fungsi untuk mendapatkan catatan dari API
// js/data/api-service.js

// Fungsi untuk mendapatkan semua catatan (baik yang diarsipkan maupun tidak)
const getNotes = async () => {
    showLoading();
    try {
      // Ambil catatan yang tidak diarsipkan
      const regularResponse = await fetch(`${BASE_URL}/notes`);
      const regularJson = await regularResponse.json();
      
      if (!regularResponse.ok) {
        throw new Error(regularJson.message);
      }
      
      // Ambil catatan yang diarsipkan
      const archivedResponse = await fetch(`${BASE_URL}/notes/archived`);
      const archivedJson = await archivedResponse.json();
      
      if (!archivedResponse.ok) {
        throw new Error(archivedJson.message);
      }
      
      // Gabungkan kedua hasil
      const allNotes = [
        ...regularJson.data,
        ...archivedJson.data
      ];
      
      return allNotes;
    } catch (error) {
      showErrorAlert(error.message || 'Failed to get notes');
      return [];
    } finally {
      hideLoading();
    }
  };

// Fungsi untuk menambahkan catatan baru
const addNote = async (note) => {
  showLoading();
  try {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
    
    const responseJson = await response.json();
    
    if (!response.ok) {
      throw new Error(responseJson.message);
    }
    
    return responseJson.data;
  } catch (error) {
    showErrorAlert(error.message || 'Failed to add note');
    throw error;
  } finally {
    hideLoading();
  }
};

// Fungsi untuk menghapus catatan
const deleteNote = async (id) => {
  showLoading();
  try {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    
    const responseJson = await response.json();
    
    if (!response.ok) {
      throw new Error(responseJson.message);
    }
    
    return responseJson.data;
  } catch (error) {
    showErrorAlert(error.message || 'Failed to delete note');
    throw error;
  } finally {
    hideLoading();
  }
};

// js/data/api-service.js

// Fungsi untuk mengarsipkan catatan
const archiveNote = async (id) => {
    showLoading();
    try {
      console.log('Archiving note with ID:', id);
      const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
        method: 'POST',
      });
      
      const responseJson = await response.json();
      console.log('Archive response:', responseJson);
      
      if (!response.ok) {
        throw new Error(responseJson.message);
      }
      
      return { id, archived: true }; // Return objek dengan status archived yang diperbarui
    } catch (error) {
      showErrorAlert(error.message || 'Failed to archive note');
      throw error;
    } finally {
      hideLoading();
    }
  };
  
  // Fungsi untuk membatalkan arsip catatan
  const unarchiveNote = async (id) => {
    showLoading();
    try {
      console.log('Unarchiving note with ID:', id);
      const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
        method: 'POST',
      });
      
      const responseJson = await response.json();
      console.log('Unarchive response:', responseJson);
      
      if (!response.ok) {
        throw new Error(responseJson.message);
      }
      
      return { id, archived: false }; // Return objek dengan status archived yang diperbarui
    } catch (error) {
      showErrorAlert(error.message || 'Failed to unarchive note');
      throw error;
    } finally {
      hideLoading();
    }
  };

export { getNotes, addNote, deleteNote, archiveNote, unarchiveNote };