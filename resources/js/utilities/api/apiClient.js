import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// ─── INTERCEPTOR REQUEST (PENGIRIMAN DATA) ───
apiClient.interceptors.request.use((config) => {
    // 🌟 1. Ambil token yang disimpan di localStorage saat login sukses
    const token = localStorage.getItem('token');

    // 🌟 2. Jika token ada, tempelkan ke Header Authorization
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Jika data yang dikirim adalah FormData (unggah file)
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;
