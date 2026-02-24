import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.scss";
import LogoSection from "../logoSection/LogoSection";
import { FaArrowLeft } from "react-icons/fa";
function Header() {
  const navigate = useNavigate();
  return (
    <div className="app-header">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </button>

      <LogoSection />
    </div>
  );
}

export default Header;
