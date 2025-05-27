import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "react-bootstrap";
import "./confirmationPopup.css";

function ConfirmationPopup(props) {
  const {
    isConfirmationPopup,
    handleReset,
    handleExit,
    deleteMsg = false,
    errorResponse,
  } = props;
  return (
    <div>
      <Modal
        show={isConfirmationPopup}
        onHide={handleExit}
        backdrop="static"
        centered
      >
        <ModalHeader className="confirmation-header" closeButton>
          <div>
            <h3 className="alert-text">Alert</h3>
          </div>
        </ModalHeader>
        <ModalBody
          className="confirmation-body"
          style={{ width: "90vw !important" }}
        >
          {!errorResponse?.error ? (
            <h1 className="confirmation-text">
              {`Are you sure you want to ${
                deleteMsg
                  ? " delete ?"
                  : " exit ? Your changes will not be saved"
              }`}{" "}
            </h1>
          ) : errorResponse?.details?.length ? (
            <>
              <h1 className="confirmation-text">
                User cannot be deleted as they are assigned to below projects:
              </h1>
              <div className="text-capitalize">
                <ul>
                  {errorResponse?.details[0]?.projects?.map(
                    (project, index) => (
                      <li key={index}>{project}</li>
                    )
                  )}
                </ul>
              </div>
              <h1 className="confirmation-text">
                Kindly re-assign those projects to other project managers before
                deleting the user
              </h1>
            </>
          ) : (
            errorResponse?.error && (
              <>
                <h1 className="confirmation-text">{errorResponse?.error} 
                {(errorResponse?.risk_logs_count > 0 ||
                  errorResponse?.assumptions_count > 0 ||
                  errorResponse?.action_items_count > 0 ||
                  errorResponse?.issues_count > 0 ||
                  errorResponse?.dependencies_count > 0) && (
                    <>
                      {" "}
                      The count of open logs are as follows:
                    </>
                  )}
                  </h1>
                <div>
                  <ul>
                    {errorResponse?.risk_logs_count > 0 && (
                      <li>
                        Risk Register Logs: {errorResponse?.risk_logs_count}
                      </li>
                    )}
                    {errorResponse?.assumptions_count > 0 && (
                      <li>
                        Assumption Logs: {errorResponse?.assumptions_count}
                      </li>
                    )}
                    {errorResponse?.action_items_count > 0 && (
                      <li>Action Items: {errorResponse?.action_items_count}</li>
                    )}
                    {errorResponse?.issues_count > 0 && (
                      <li>Issue Logs: {errorResponse?.issues_count}</li>
                    )}
                    {errorResponse?.dependencies_count > 0 && (
                      <li>
                        Dependency Logs: {errorResponse?.dependencies_count}
                      </li>
                    )}
                  </ul>
                </div>
              </>
            )
          )}
          {!errorResponse?.error && (
            <div className="fw-semibold button-container">
              <button
                className="btn btn-success w-25 button"
                onClick={handleReset}
              >
                Yes
              </button>
              <button className="btn btn-secondary w-25" onClick={handleExit}>
                No
              </button>
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}

export default ConfirmationPopup;
