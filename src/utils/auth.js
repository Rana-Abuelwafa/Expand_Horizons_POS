// utils/auth.js
export const isTokenExpired = (expiryTime) => {
  if (!expiryTime) return true;
  
  const expiryDate = new Date(expiryTime);
  const currentDate = new Date();
  
  return currentDate >= expiryDate;
};

export const getUserData = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};