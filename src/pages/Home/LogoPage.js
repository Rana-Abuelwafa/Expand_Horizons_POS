import React from "react";
import { useNavigate } from "react-router-dom";

// Landing splash page that routes user into language selection.
const LogoPage = () => {
  const navigate = useNavigate();
  return (
    <div className="logo-page">
      <img
        src={process.env.PUBLIC_URL + '/images/logo.png'}
        alt="Logo"
        className="logo"
        loading="lazy"
        onClick={() => navigate("/app-lang")}
      />
    </div>
  );
};

export default LogoPage;