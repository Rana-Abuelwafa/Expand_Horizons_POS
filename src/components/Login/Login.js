import React, { useState, useEffect } from "react";
import { Button, Form, Col, Row, FloatingLabel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { LoginUser } from "../../redux/Slices/AuthSlice";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";
import "./Login.scss";
function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorsLst, seterrorsLst] = useState({});
  const [validated, setvalidated] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [formData, setformData] = useState({
    FirstName: "",
    LastName: "",
    email: "",
    password: "",
    ConfirmPassword: "",
    Role: "POS",
    sendOffers: false,
  });

  const { loading, success, message } = useSelector((state) => state.auth);
  //validate form inputs
  const validate = () => {
    if (!/^\S+@\S+\.\S+$/.test(formData.email) || formData.email.trim() == "") {
      seterrorsLst({
        ...errorsLst,
        email: t("Login.EmailError"),
      });
      return false;
    }

    if (formData.password.trim() == "" || formData.password.length < 6) {
      seterrorsLst({
        ...errorsLst,
        password: t("Login.PasswordError"),
      });
      return false;
    }

    return true;
  };
  const signin = (event) => {
    event.preventDefault();
    // validation
    if (validate()) {
      let lang = localStorage.getItem("i18nextLng") || "en";
      let data = {
        payload: {
          email: formData.email,
          password: formData.password,
          lang: lang,
        },
        path: "/LoginUser",
      };
      dispatch(LoginUser(data)).then((result) => {
        if (result.payload && result.payload.isSuccessed) {
          //if user register successfully so navigate to  verify email first
          setShowPopup(false);
          navigate("/home");
        } else {
          setShowPopup(true);
        }
      });
    }
  };
  const fillFormData = (e) => {
    setvalidated(false);
    seterrorsLst({});
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <section className="centerSection">
      <div className="login_page">
        {/* <div className="d-flex justify-content-center align-items-center logo-div">
                    <img 
          src={process.env.PUBLIC_URL + '/logo1.png'}
          alt="expand horizons"
          className="logo-img" 
          loading="lazy" 
          decoding="async" 
          />
          </div> */}
        {/* <div className="form_title">
          <h4 className="title">{t("Login.loginTitle")}</h4>
        </div> */}

        {/* <p className="SubTitle" dangerouslySetInnerHTML={{
              __html: t("Login.LoginSubTitle"),
            }}>
        </p> */}
        <Form onSubmit={signin} noValidate>
          <Row>
            <Col xs={12}>
              {" "}
              <FloatingLabel label={t("Login.email")} className="mb-3">
                <Form.Control
                  type="email"
                  placeholder={t("Login.email")}
                  required
                  name="email"
                  className="formInput"
                  onChange={fillFormData}
                />
                {errorsLst.email && (
                  <Form.Text type="invalid" className="errorTxt">
                    {errorsLst.email}
                  </Form.Text>
                )}
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              <FloatingLabel label={t("Login.password")} className="mb-3">
                <Form.Control
                  type="password"
                  placeholder={t("Login.password")}
                  required
                  name="password"
                  className="formInput"
                  minLength={6}
                  onChange={fillFormData}
                />
                {errorsLst.password && (
                  <Form.Text type="invalid" className="errorTxt">
                    {errorsLst.password}
                  </Form.Text>
                )}
              </FloatingLabel>
            </Col>
          </Row>
          <Button type="submit" className="frmBtn secondryBtn FullWidthBtn">
            {t("Login.signIn")}
          </Button>
        </Form>
        {loading == true ? <LoadingPage /> : null}
        {showPopup == true ? (
          <PopUp
            show={showPopup}
            closeAlert={() => setShowPopup(false)}
            msg={message}
            type={success ? "success" : "error"}
            autoClose={3000}
          />
        ) : null}
      </div>
    </section>
  );
}

export default Login;
