import React from "react";
import { Modal, ModalBody, ModalHeader } from "react-bootstrap";
import "../../components/confirmationPopup/confirmationPopup.css";

function CSConfirmationPopup(props) {
  const {
    isConfirmationPopup,
    handleConfirmUpdate,
    handleCancelUpdate,
  } = props;
  return (
    <div>
    <Modal show={isConfirmationPopup} onHide={handleCancelUpdate} backdrop="static" centered>
      <ModalHeader className="confirmation-header" closeButton>
        <h4 className="alert-text">Confirmation</h4>
      </ModalHeader>
      <ModalBody className="confirmation-body">
        <h5 className="confirmation-text">Are you sure you want to modify your response?</h5>
        <div className="d-flex justify-content-center gap-3 mt-3">
          <button className="btn btn-success w-25" onClick={handleConfirmUpdate}>
            Yes
          </button>
          <button className="btn btn-secondary w-25" onClick={handleCancelUpdate}>
            No
          </button>
        </div>
      </ModalBody>
    </Modal>
    </div>
  );
}

export default CSConfirmationPopup;
