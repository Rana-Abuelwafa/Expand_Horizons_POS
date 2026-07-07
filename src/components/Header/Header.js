import React from "react";
import { useNavigate } from "react-router-dom";
import LogoSection from "../logoSection/LogoSection";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

// Shared top bar with back navigation and logo.
function Header() {
  const navigate = useNavigate();
  return (
    <div className="app-header">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <MdOutlineArrowBackIosNew />
      </button>

      <LogoSection />
    </div>
  );
}

export default Header;
