import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaUmbrellaBeach, FaBus, FaWater } from "react-icons/fa";
import { MdOutlineScubaDiving } from "react-icons/md";
import { IoBoatOutline } from "react-icons/io5";
import LogoSection from "../../components/logoSection/LogoSection";
import { useTranslation } from "react-i18next";
import "./HomeCategories.scss";


const HomeCategories = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const categories = [
        {
            title: t("home.excursions"),
            image: "../images/excursions.jpg",
            icon: <IoBoatOutline />,
            pg:"/Excursions"
        },
        {
            title: t("home.transfers"),
            image: "../images/transfer.jpeg",
            icon: <FaBus />,
            pg:"/Transfers"
        },
        {
            title: t("home.diving"),
            image: "../images/diving.png",
            icon: <MdOutlineScubaDiving />,
             pg:"/Diving"
        },
    ];


    const nextPage = (pg) => {
        navigate(pg);
    };

    return (
        <div className="home-wrapper">
            <div className="home-container">
                <LogoSection />

                <Row className="g-4 justify-content-center">
                    {categories.map((cat, index) => (
                        <Col xs={12} key={index} onClick={() => nextPage(cat.pg)}>
                            <Card className="category-card">
                                <Row className="g-0 h-100">
                                    {/* Image Column */}
                                    <Col xs={6} className="image-col">
                                        <div
                                            className="image-bg"
                                            style={{ backgroundImage: `url(${cat.image})` }}
                                        />
                                    </Col>

                                    {/* Icon + Text Column */}
                                    <Col xs={6} className="content-col">
                                        <div className="content-wrapper">
                                            <div className="icon">{cat.icon}</div>
                                            <div className="title">{cat.title}</div>
                                        </div>
                                        <div className="triangle" />
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

export default HomeCategories;