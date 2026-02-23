let inMemoryToken = null;

export const getAccessToken = () =>
  inMemoryToken || localStorage.getItem("accessToken");
export const setAccessToken = (token) => {
  inMemoryToken = token;
  localStorage.setItem("accessToken", token);
};
export const clearAccessToken = () => {
  inMemoryToken = null;
  localStorage.removeItem("accessToken");
};
