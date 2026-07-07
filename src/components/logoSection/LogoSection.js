import React from "react";

// Reusable brand logo block used in headers and auth screens.
const LogoSection = () => {
  return (
    <div className="logo-section">
      <img
        src={process.env.PUBLIC_URL + '/logo1.png'}
        alt="Expand Horizons Logo"
        className="logo"
      />
    </div>
  );
};

export default LogoSection;
