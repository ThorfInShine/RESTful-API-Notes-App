// Import SweetAlert2 jika menggunakan webpack
import Swal from "sweetalert2";

// Fungsi untuk menampilkan pesan sukses
const showSuccessAlert = (message) => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    timer: 1500,
    showConfirmButton: false,
  });
};

// Fungsi untuk menampilkan pesan error
const showErrorAlert = (message) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message || "Something went wrong!",
  });
};

// Fungsi untuk menampilkan konfirmasi
const showConfirmationAlert = async (message) => {
  const result = await Swal.fire({
    icon: "warning",
    title: "Confirmation",
    text: message,
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    confirmButtonColor: "#4285f4",
    cancelButtonColor: "#d33",
  });

  return result.isConfirmed;
};

export { showSuccessAlert, showErrorAlert, showConfirmationAlert };
