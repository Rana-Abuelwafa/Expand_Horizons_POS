import React from "react";

// Full-page loading state used during async page transitions.
const LoadingPage = () => {
  return (
    <div className="loading-page">
      
      <div className="loading-content">
        
        <img
          src={process.env.PUBLIC_URL + '/images/loading.gif'}
          alt="Loading..."
          className="loading-gif"
          loading="lazy" 
          decoding="async" 
        />
        
        <p className="loading-text">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
