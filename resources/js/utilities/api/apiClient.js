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
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// ─── 🌟 INTERCEPTOR RESPONSE (JARING PENGAMAN RESPONS GLOBAL) ───
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Jika server membalas dengan status 401 (Token hangus / DB di-migrate fresh)
        if (error.response && error.response.status === 401) {
            console.warn('Sesi tidak valid / Database ter-migrate. Membersihkan local storage...');

            // Bersihkan sisa sampah token di browser seketika
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Lempar keras ke halaman login agar semua state Vue di-reset total
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
