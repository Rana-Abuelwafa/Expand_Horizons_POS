import React from "react";
import "./LogoSection.scss";

const LogoSection = () => {
  return (
    <div className="logo-section">
      <img
        src={process.env.PUBLIC_URL + '/logo1.png'}
        alt="Expand Horizons Logo"
        className="logo"
        // loading="lazy"
      />
    </div>
  );
};

export default LogoSection;
