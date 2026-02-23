import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000; //decode.exp ->This is the expiration timestamp from the JWT payload (stored in seconds since Unix epoch)
  } catch (err) {
    //Date.now() / 1000 convert from milliseconds to seconds
    return true;
  }
};

export const checkAUTH = () => {
  const authToken = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // Check if user exists and has a valid token
  if (authToken && user && !isTokenExpired(authToken)) {
    return true;
  } else {
    console.log("User not logged in or token expired");
    return false;
  }
};

export const isTokenExpiredOnly = () => {
  const authToken = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // If user exists but token is expired
  if (authToken && user && isTokenExpired(authToken)) {
    return true;
  }
  return false;
};

export const isUserNotLoggedIn = () => {
  const authToken = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // If no user data exists at all
  return !authToken && !user;
};

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
