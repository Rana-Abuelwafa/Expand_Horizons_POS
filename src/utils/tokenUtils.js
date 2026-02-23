// Check if token exists and is valid
export const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Simple check - if token exists, consider it valid
    // You can add expiration check later if needed
    return true;
  } catch {
    return false;
  }
};

// Clear tokens from storage
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get token from storage
export const getToken = () => {
  return localStorage.getItem('token');
};