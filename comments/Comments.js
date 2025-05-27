import React from "react";
import { Modal, ModalBody, ModalHeader } from "react-bootstrap";

function Comments(props) {
  // COMMENTS MODAL AS PROPS
  let { showComments, closeModal } = props;
  return (
    <div>
      <Modal show={showComments} backdrop="static" onHide={closeModal}>
        <ModalHeader closeButton>
          <p className="fw-bold fs-4">Add Comment</p>
        </ModalHeader>
        <ModalBody>
          <form className="form">
            {/* <label className="form-label">Add Comment</label> */}
            <textarea className="form-control" placeholder="Comment" />
            <div className="text-center">
              <button
                className="btn primary-color fw-bold mt-3"
                style={{ width: "25%" }}
              >
                Submit
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default Comments;
