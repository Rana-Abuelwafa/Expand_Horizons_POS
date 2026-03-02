import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Login from "../../components/Login/Login";

const LoginPage = () => {
  return (
    <div className="dest-wrapper">
      <div className="dest-container">
      <Header />
      <Login />
    </div>
    </div>
  );
};

export default LoginPage;