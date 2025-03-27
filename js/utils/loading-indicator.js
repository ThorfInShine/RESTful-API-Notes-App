// Fungsi untuk menampilkan loading indicator
const showLoading = () => {
  // Periksa apakah loading indicator sudah ada
  if (!document.querySelector(".loading-indicator")) {
    const loadingElement = document.createElement("div");
    loadingElement.className = "loading-indicator";
    loadingElement.innerHTML = `
        <div class="spinner"></div>
      `;
    document.body.appendChild(loadingElement);

    // Tambahkan style jika belum ada
    if (!document.getElementById("loading-style")) {
      const style = document.createElement("style");
      style.id = "loading-style";
      style.textContent = `
          .loading-indicator {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #4285f4;
            animation: spin 1s ease-in-out infinite;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `;
      document.head.appendChild(style);
    }
  }
};

// Fungsi untuk menyembunyikan loading indicator
const hideLoading = () => {
  const loadingElement = document.querySelector(".loading-indicator");
  if (loadingElement) {
    // Tambahkan animasi fadeOut
    loadingElement.style.animation = "fadeOut 0.3s ease";
    loadingElement.style.opacity = "0";

    // Hapus elemen setelah animasi selesai
    setTimeout(() => {
      loadingElement.remove();
    }, 300);
  }
};

export { showLoading, hideLoading };
