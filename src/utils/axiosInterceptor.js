import axios from "axios";
import { store } from "../redux/store/store";
import { logout } from "../redux/Slices/AuthSlice";

const API_BASE_URLS = {
  auth: process.env.REACT_APP_AUTH_API_URL,
  client: process.env.REACT_APP_CLIENT_API_URL,
  booking: process.env.REACT_APP_BOOKING_API_URL,
  contact: process.env.REACT_APP_CONTACT_API_URL,
};

// Create API instances
export const authApi = axios.create({ baseURL: API_BASE_URLS.auth });
export const clientApi = axios.create({ baseURL: API_BASE_URLS.client });
export const bookingApi = axios.create({ baseURL: API_BASE_URLS.booking });
export const contactApi = axios.create({ baseURL: API_BASE_URLS.contact });

const apiInstances = [authApi, clientApi, bookingApi, contactApi];

// --- REQUEST INTERCEPTOR ---
const requestInterceptor = (config) => {
  const lang = localStorage.getItem("lang") || "en";

   // Skip token for login and refresh
  if (config.url.includes("/login") || config.url.includes("/refresh")) {
    return config;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.accessToken;

  config.headers["Accept-Language"] = lang;
  config.headers["Content-Type"] = config.isFormData ? "multipart/form-data" : "application/json";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

// --- REFRESH TOKEN QUEUE ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
});
  failedQueue = [];
};

// --- RESPONSE INTERCEPTOR ---
// In axiosInterceptor.js - update the response interceptor
const responseInterceptor = async (error) => {
  const originalRequest = error.config;

  // Handle 401 Unauthorized
  if (error.response?.status === 401 && !originalRequest._retry) {
    console.log('Token expired, attempting refresh...');
    originalRequest._retry = true;
    
    if (isRefreshing) {
      console.log('Refresh already in progress, queuing request...');
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        console.log('Retrying queued request with new token');
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return originalRequest.instance(originalRequest);
      });
    }

    isRefreshing = true;
    console.log('Starting token refresh process...');

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const refreshToken = user?.refreshToken;

      console.log('Refresh token available:', !!refreshToken);

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const refreshResponse = await axios.post(
        `${API_BASE_URLS.auth}/refresh`,
        { refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": localStorage.getItem("lang") || "en"
          }
        }
      );

      console.log('Refresh API response:', refreshResponse.data);

      if (!refreshResponse.data.isSuccessed) {
        throw new Error("Refresh failed: " + (refreshResponse.data.message || "Unknown error"));
      }

      const newUser = refreshResponse.data.user;
      const newToken = newUser.accessToken;
      
      console.log('New token received, updating storage...');
      
      // Update localStorage with new tokens
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("token", newToken);

      // Update all axios instances with new token
      apiInstances.forEach((instance) => {
        instance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      });

      // Process queued requests with new token
      processQueue(null, newToken);

      // Update and retry the original request
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      console.log('Retrying original request with new token');
      return originalRequest.instance(originalRequest);

    } catch (err) {
      console.error("Token refresh failed:", err);
      
      // Process queued requests with error
      processQueue(err, null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      
      console.log('Redirecting to login...');
      setTimeout(() => {
        store.dispatch(logout());
        window.dispatchEvent(new CustomEvent('showAuthModal', { 
          detail: { type: 'login' } 
        }));
      }, 0);

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }

  // Handle 403 Forbidden
  if (error.response?.status === 403) {
    console.log('Access forbidden, redirecting to login');
    window.dispatchEvent(new CustomEvent('showAuthModal', { 
      detail: { type: 'login' } 
    }));
  }

  return Promise.reject(error);
};

// Apply interceptors to all API instances
apiInstances.forEach((instance) => {
  instance.interceptors.request.use(requestInterceptor);
  instance.interceptors.response.use(
    (response) => response,
    (err) => {
      err.config.instance = instance;
      return responseInterceptor(err);
    }
  );
});

// Helper function to check if token refresh is in progress
export const isRefreshingToken = () => isRefreshing;

// Helper function to manually trigger token refresh
export const manualTokenRefresh = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const refreshToken = user?.refreshToken;

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post(
      `${API_BASE_URLS.auth}/refresh`,
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": localStorage.getItem("lang") || "en"
        }
      }
    );

    if (response.data.isSuccessed) {
      const newUserData = response.data.user;
      localStorage.setItem("user", JSON.stringify(newUserData));
      localStorage.setItem("token", newUserData.accessToken);
      
      // Update all instances
      const newToken = newUserData.accessToken;
      apiInstances.forEach(instance => {
        instance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      });
      
      return newUserData;
    } else {
      throw new Error(response.data.message || "Manual token refresh failed");
    }
  } catch (error) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    throw error;
  }
};

export default { authApi, clientApi, bookingApi, contactApi };
