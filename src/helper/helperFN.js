import { jwtDecode } from "jwt-decode";

// Returns true when token decode fails or expiry has passed.
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000; //decode.exp ->This is the expiration timestamp from the JWT payload (stored in seconds since Unix epoch)
  } catch (err) {
    return true;
  }
};

// Checks whether user session exists and token is still valid.
export const checkAUTH = () => {
  const authToken = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (authToken && user && !isTokenExpired(authToken)) {
    return true;
  } else {
    console.log("User not logged in or token expired");
    return false;
  }
};

// Distinguishes explicit token-expired state from fully logged-out state.
export const isTokenExpiredOnly = () => {
  const authToken = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (authToken && user && isTokenExpired(authToken)) {
    return true;
  }
  return false;
};

// True only when both token and user cache are missing.
export const isUserNotLoggedIn = () => {
  const authToken = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  return !authToken && !user;
};

// Lightweight login presence check without token expiry validation.
export const checkIsLogin = () => {
  const authToken = localStorage.getItem("token");
  const userLocal = localStorage.getItem("user");
  if (authToken && userLocal) {
    return true;
  } else {
    console.log("there is no login user");
    return false;
  }
};
