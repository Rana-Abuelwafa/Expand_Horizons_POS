import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import LogoSection from "../../components/logoSection/LogoSection";
import { useTranslation } from "react-i18next";
import "./MainDestinations.scss";
import Header from "../../components/Header/Header";

const SubDestinations = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const childDestination = state?.childDestination;
  const tripType = 1;
  console.log(childDestination);

  const currentLang = localStorage.getItem("i18nextLng") || "en";

  const handleLocationClick = (route, id) => {
    navigate(`/excursions/${route.toLowerCase().replace(/\s+/g, "-")}`, {
      state: {
        DestinationId: id,
        tripType: tripType,
      },
    });
  };
  return (
    <div className="dest-wrapper">
      <Header />
      <div className="dest-container">
        <Row className="g-4 justify-content-center">
          {childDestination.map((dest, index) => (
            <Col
              xs={12}
              key={index}
              onClick={() =>
                handleLocationClick(dest.route, dest.destination_id)
              }
            >
              <Card className="dest-card">
                <Row className="g-0 h-100">
                  {/* Icon + Text Column */}
                  <Col xs={6} className="content-col">
                    <div className="content-wrapper">
                      {/* <div className="icon">{cat.icon}</div> */}
                      <div className="title">{dest.dest_name}</div>
                    </div>
                  </Col>

                  {/* Image Column */}
                  <Col xs={6} className="image-col">
                    <div
                      className="image-bg"
                      style={{ backgroundImage: `url(${dest.img_path})` }}
                    />
                    <div className="dest-triangle" />
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default SubDestinations;
