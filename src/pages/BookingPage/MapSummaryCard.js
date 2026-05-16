import React from "react";
import "./MapSummaryCard.scss";
function MapSummaryCard({
  pickupAddress,
  dropAddress,
  distance,
  duration,
  price,
}) {
  return (
    <div className="booking-summary-card">
      <div className="summary-header">
        <h3>Booking Details</h3>
        {/* <span className="status">Estimated</span> */}
      </div>

      <div className="location-section">
        <div className="location-item pickup">
          <div className="marker"></div>

          <div className="location-content">
            <span className="label">Pickup</span>
            <p>{pickupAddress}</p>
          </div>
        </div>

        {/* <div className="route-line"></div> */}

        <div className="location-item drop">
          <div className="marker"></div>

          <div className="location-content">
            <span className="label">Drop-off</span>
            <p>{dropAddress}</p>
          </div>
        </div>
      </div>

      <div className="booking-stats">
        <div className="stat-box">
          <span>Distance</span>
          <strong>{distance?.toFixed(2)} KM</strong>
        </div>

        <div className="stat-box">
          <span>Duration</span>
          <strong>{Math.round(duration)} Min</strong>
        </div>

        <div className="stat-box price">
          <span>Total</span>
          <strong>€ {price}</strong>
        </div>
      </div>
    </div>
  );
}

export default MapSummaryCard;
