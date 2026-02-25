import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDestinations,
  fetchDestChildren,
} from "../../redux/Slices/destinationsSlice";
import LoadingPage from "../../components/Loader/LoadingPage";
import { useTranslation } from "react-i18next";
import "./MainDestinations.scss";
import Header from "../../components/Header/Header";

const MainDestinations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentLang = localStorage.getItem("i18nextLng") || "en";
  
  const {
    items: parentDestinations,
    childrenItems: childDestinations,
    loading,
  } = useSelector((state) => state.destinations);

  useEffect(() => {
    const params = {
      lang_code: currentLang,
      leaf: false,
      parent_id: 0,
    };
    dispatch(fetchDestinations(params));
  }, [dispatch, currentLang]);

  const nextPage = (route) => {
    navigate(route);
  };

  const handleParentClick = async (parentDestination) => {
    try {
      const params = {
        lang_code: currentLang,
        leaf: true,
        parent_id: parentDestination.destination_id,
      };

      var result = await dispatch(fetchDestChildren(params));

      if (result.payload.length) {
        navigate(
          `/Destinations/${parentDestination.route.toLowerCase().replace(/\s+/g, "-")}`,
          {
            state: { childDestination: result.payload },
          },
        );
      }
    } catch (error) {
      console.error("Error fetching child destinations:", error);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }


  return (
    <div className="dest-wrapper">
      <div className="dest-container">
        <Header />

        <Row className="g-4 justify-content-center">
          {parentDestinations.map((dest, index) => (
            <Col xs={12} key={index} onClick={() => handleParentClick(dest)}>
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
                      style={{ backgroundImage: `url(${encodeURI(dest.img_path)})` }}
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

export default MainDestinations;
