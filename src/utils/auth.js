// Checks token expiry timestamp against current time.
export const isTokenExpired = (expiryTime) => {
  if (!expiryTime) return true;
  
  const expiryDate = new Date(expiryTime);
  const currentDate = new Date();
  
  return currentDate >= expiryDate;
};

// Safely reads persisted user object from local storage.
export const getUserData = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};