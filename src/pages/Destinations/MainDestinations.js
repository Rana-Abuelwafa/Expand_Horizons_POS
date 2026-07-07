import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";
import { BiSolidCard } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDestinations,
  fetchDestChildren,
} from "../../redux/Slices/destinationsSlice";
import LoadingPage from "../../components/Loader/LoadingPage";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header/Header";

const MainDestinations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentLang = localStorage.getItem("i18nextLng") || "en";

  const {
    items: parentDestinations,
    loading,
  } = useSelector((state) => state.destinations);

  // Loads top-level destination cards for the selected language.
  useEffect(() => {
    const params = {
      lang_code: currentLang,
      leaf: false,
      parent_id: 0,
    };
    dispatch(fetchDestinations(params));
  }, [dispatch, currentLang]);

  // Opens child destination list, or falls back to booking map when leaf node has no children.
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
      } else {
        navigate("/BookingMap", {
          state: {
            DestinationId: parentDestination.destination_id,
            tripType: 2,
            dest_name: parentDestination.dest_name,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching child destinations:", error);
    }
  };

  return (
    <>
      {loading && <LoadingPage />}
      {!loading && parentDestinations.length === 0 && (
        <section className="dest-wrapper">
          <div className="dest-container">
            <Header />
            <BiSolidCard className="empty-icon" />
            <h3 className="empty-title">{t("tours.empty_dest_title")}</h3>
          </div>
        </section>
      )}

      {!loading && parentDestinations.length > 0 && (
        <section className="dest-wrapper">
          <div className="dest-container">
            <Header />

            <Row className="g-4 justify-content-center">
              {parentDestinations.map((dest, index) => (
                <Col
                  xs={12}
                  key={index}
                  onClick={() => handleParentClick(dest)}
                >
                  <Card className="dest-card">
                    <Row className="g-0 h-100">
                      
                      <Col xs={6} className="content-col">
                        <div className="content-wrapper">
                          
                          <div className="title">{dest.dest_name}</div>
                        </div>
                      </Col>

                      
                      <Col xs={6} className="image-col">
                        <div
                          className="image-bg"
                          style={{
                            backgroundImage: `url(${encodeURI(dest.img_path)})`,
                          }}
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

export default MainDestinations;
