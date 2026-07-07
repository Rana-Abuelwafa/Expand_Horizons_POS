// Basic token existence guard used before protected actions.
export const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    return true;
  } catch {
    return false;
  }
};

// Clears persisted auth state on logout or hard auth failure.
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Centralized token accessor for API helpers.
export const getToken = () => {
  return localStorage.getItem('token');
};