import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Login from "../../components/Login/Login";
import "./LoginPage.scss";

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