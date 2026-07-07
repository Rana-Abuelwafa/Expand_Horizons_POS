let inMemoryToken = null;

// Returns runtime token first, then persisted fallback.
export const getAccessToken = () =>
  inMemoryToken || localStorage.getItem("accessToken");

// Persists access token in memory and local storage.
export const setAccessToken = (token) => {
  inMemoryToken = token;
  localStorage.setItem("accessToken", token);
};

// Clears all access token copies during logout/session reset.
export const clearAccessToken = () => {
  inMemoryToken = null;
  localStorage.removeItem("accessToken");
};
