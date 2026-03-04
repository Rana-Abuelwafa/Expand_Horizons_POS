import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { BiSolidCard } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import "./MainDestinations.scss";
import Header from "../../components/Header/Header";

const SubDestinations = () => {
    const { t } = useTranslation();
    const { state } = useLocation();
    const navigate = useNavigate();
    const childDestination = state?.childDestination;
    const tripType = 1;

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

        <>
            {childDestination.length === 0 && (
                <section className="dest-wrapper">
                    <div className="dest-container">
                        <Header />
                        <BiSolidCard className="empty-icon" />
                        <h3 className="empty-title">{t("tours.empty_dest_title")}</h3>
                    </div>
                </section>
            )}

            {childDestination.length > 0 && (
                <section className="dest-wrapper">
                    <div className="dest-container">
                        <Header />
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
                </section>

            )}

        </>
    );
};

export default SubDestinations;
