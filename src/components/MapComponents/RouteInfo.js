const RouteInfo = ({ distance, duration, price }) => {
  if (!distance) return null;

  const hours = Math.floor(duration / 60);
  const minutes = Math.round(duration % 60);

  return (
    <div className="route-info">
      <div className="info-item">
        <span>Distance: </span>
        <strong>{distance.toFixed(2)} KM</strong>
      </div>

      <div className="info-item">
        <span>Time: </span>
        <strong>
          {hours > 0 ? `${hours}h ` : ""}
          {minutes} min
        </strong>
      </div>

      <div className="info-item price">
        <span>Price: </span>
        <strong> {price}€</strong>
      </div>
    </div>
  );
};

export default RouteInfo;
