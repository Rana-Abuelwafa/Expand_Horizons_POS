import React from "react";
import Header from "../../components/Header/Header";
import Login from "../../components/Login/Login";

// Route wrapper that combines shared header with login form component.
const LoginPage = () => {
  return (
    <div className="login-page-wrapper">
      <Header />
      <div className="login-page-content">
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;