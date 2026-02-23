import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Alert from "react-popup-alert";

const PopupMsg = ({ text, show, closeAlert, onConfirm, openAuthModal }) => {
  const { t } = useTranslation();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleClose = () => {
    if (isMounted.current) {
      closeAlert?.();
      onConfirm?.();

       if (openAuthModal) {

        setTimeout(() => {
          openAuthModal("login");
        }, 300);
      }
    }
  };

  return (
    <Alert
      header={t("PopUp.Header")}
      btnText={t("auth.ok")}
      text={text}
      type={"error"}
      show={show}
      onClosePress={handleClose}
      pressCloseOnOutsideClick={false}
      showBorderBottom={true}
      alertStyles={{ 
        zIndex: 9999,
       display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}
      headerStyles={{
        textAlign: 'center'
      }}
      textStyles={{
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60px'
      }}
      buttonStyles={{ 
        backgroundColor: "#00bc82",
        margin: '0 auto'
      }}
    />
  );
};

export default PopupMsg;