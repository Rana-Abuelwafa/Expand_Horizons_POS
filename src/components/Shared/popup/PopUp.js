import { Button, Modal } from "react-bootstrap";
import React, { useEffect } from "react";
// import Popup from 'react-animated-popup'
import "./popup.scss";

// popup with success , error, confirm and alert classes
const PopUp = ({
  show,
  closeAlert,
  msg,
  type = "alert",
  confirmAction,
  confirmText = "OK",
  cancelText = "Cancel",
  autoClose = null,
  showConfirmButton = true,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  useEffect(() => {
    if (autoClose && show) {
      const timer = setTimeout(() => {
        closeAlert();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, closeAlert]);

  // Handle confirm click - prioritize new onConfirm prop, fall back to confirmAction, then closeAlert
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else if (confirmAction) {
      confirmAction();
    } else {
      closeAlert();
    }
  };

  // Handle cancel click - prioritize new onCancel prop, fall back to closeAlert
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      closeAlert();
    }
  };

  // Determine which button variant to use (backward compatible)
  const getConfirmButtonVariant = () => {
    switch (type) {
      case "success": return "success";
      case "error": return "danger";
      case "confirm": return "primary";
      default: return "primary";
    }
  };

  const headerClass =
    {
      success: "bg-success",
      error: "bg-danger",
      confirm: "bg-primary",
      alert: "bg-primary",
    }[type] || "bg-primary";

  return (
    <Modal show={show} onHide={handleCancel} centered className="popup-modal">
      <Modal.Header closeButton className={`text-white ${headerClass}`}>
        <Modal.Title>
          {type === "success" && "Success"}
          {type === "error" && "Error"}
          {type === "confirm" && "Confirm Action"}
          {type === "alert" && "Notification"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{msg}</Modal.Body>
      <Modal.Footer>
        {/* Show cancel button for confirm type OR if onCancel prop is provided */}
        {(type === "confirm" || onCancel) && (
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
        )}

        {/* Show confirm button if showConfirmButton is true (default) */}
        {showConfirmButton && (
          <Button
            variant={getConfirmButtonVariant()}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {confirmText}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PopUp;