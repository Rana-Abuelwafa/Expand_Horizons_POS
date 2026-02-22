import axios from "axios";
import Swal from "sweetalert2";
import i18n from "../i18n"; // or your actual path

const BASE_URL = process.env.REACT_APP_API_URL;
const BASE_URL_AUTH = process.env.REACT_APP_AUTH_API_URL;

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// To stop multiple alerts
let showingLoginAlert = false;

// =========================
//   REQUEST INTERCEPTOR
// =========================
api.interceptors.request.use(
  (config) => {
    let lang = localStorage.getItem("lang");
    config.headers["Accept-Language"] = lang;
    if (config.isFormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Allow non-auth requests
    if (config.skipAuth === true) return config;

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.accessToken;

    // No token → cancel request + show login popup
    if (!token) {
      if (!showingLoginAlert) {
        showingLoginAlert = true;
        localStorage.setItem("redirect_after_login", window.location.pathname);
        Swal.fire({
          icon: "warning",
          //   title: "Login Required",
          //   text: "Please login to continue.",
          //   confirmButtonText: "Go to Login",
          title: i18n.t("auth.loginRequiredTitle"),
          text: i18n.t("auth.loginRequiredMessage"),
          confirmButtonText: i18n.t("auth.goToLogin"),
          confirmButtonColor: "#1D1F4D",
          allowOutsideClick: false,
        }).then(() => {
          localStorage.removeItem("user");
          showingLoginAlert = false;
          window.location.href = "/auth";
        });
      }

      // CANCEL REQUEST WITHOUT REJECTING IN REDUX
      const controller = new AbortController();
      config.signal = controller.signal;
      controller.abort();

      return config;
    }

    // Attach token
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },

  (error) => Promise.reject(error),
);

// =========================
//   REFRESH TOKEN SETUP
// =========================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (err, token = null) => {
  failedQueue.forEach((p) => {
    if (err) p.reject(err);
    else p.resolve(token);
  });
  failedQueue = [];
};

// =========================
//   RESPONSE INTERCEPTOR
// =========================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Handle aborted request → DO NOT reject in thunk
    if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
      return new Promise(() => {}); // silent ignore
    }

    // Skip refresh on auth endpoints
    if (
      originalRequest.url.includes("/api/LoginUser") ||
      originalRequest.url.includes("/api/RegisterUser") ||
      originalRequest.url.includes("/api/ConfirmOTP") ||
      originalRequest.url.includes("/api/LoginGmail") ||
      originalRequest.url.includes("/api/ExternalRegister")
    ) {
      return Promise.reject(error);
    }

    // 401 => token expired => refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      localStorage.setItem("redirect_after_login", window.location.pathname);
      if (isRefreshing) {
        // Queue the requests until refresh done
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = "Bearer " + newToken;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const refreshResponse = await axios.post(`${BASE_URL_AUTH}/refresh`, {
          AccessToken: user?.accessToken,
          RefreshToken: user?.refreshToken,
        });

        const newUser = refreshResponse.data.user;
        const newToken = newUser.accessToken;

        localStorage.setItem("user", JSON.stringify(newUser));

        processQueue(null, newToken);

        originalRequest.headers.Authorization = "Bearer " + newToken;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("user");
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Other errors
    return Promise.reject(error);
  },
);

export default api;
