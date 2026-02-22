import React from "react";
import "./LogoPage.scss";
import { useNavigate } from "react-router-dom";

const LogoPage = () => {
  const navigate = useNavigate();
  return (
    <div className="logo-page">
      <img
        src={"../images/logo.png"}
        alt="Logo"
        className="logo"
        loading="lazy"
        onClick={() => navigate("/app-lang")}
      />
    </div>
  );
};

export default LogoPage;
