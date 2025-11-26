const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://electricity-board-g9zx.onrender.com";

export default API_BASE_URL;
