import { Button, Modal } from "react-bootstrap";
import React, { useEffect } from "react";

// Generic modal popup for alerts, confirmations, and auto-close notices.
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

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else if (confirmAction) {
      confirmAction();
    } else {
      closeAlert();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      closeAlert();
    }
  };

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
        
        {(type === "confirm" || onCancel) && (
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
        )}

        
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