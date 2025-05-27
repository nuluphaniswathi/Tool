import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { NotificationManager } from "react-notifications";
import {
  ImpactList,
  LogStatus,
} from "../../../common/constants/logs-constants.js";
import ConfirmationPopup from "../../confirmationPopup/ConfirmationPopup.js";

const AddAssumptionLog = (props) => {
  const {
    editLog,
    isEdit,
    setIsEdit,
    showModal,
    setShowModal,
    closeModal,
    closedRaidLogs,
    setClosedRaidLogs,
  } = props;

  const {
    register: registerCreateUpdate,
    handleSubmit,
    reset: resetUpdates,
    formState: { errors, isDirty },
    setValue,
    getValues,
  } = useForm();

  const api_url = process.env.REACT_APP_API_URL;
  const formValues = getValues();

  // token state
  const tokenState = localStorage.getItem("api_token");

  const [isConfirmationPopup, setIsConfirmationPopup] = useState(false);
  const [projectNames, setProjectNames] = useState([]);

  const getProjectData = async () => {
    try {
      const projectData = await axios.get(`${api_url}/projects`, {
        headers: {
          "X-API-TOKEN": tokenState,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      setProjectNames(projectData.data.projects);
    } catch (error) {
      console.error(error);
    }
  };

  // function to create updates on daily basis
  const createOrUpdate = async (assumptionObject) => {
    const formData = new FormData();
    !isEdit &&
      formData.append("assumption[project_id]", assumptionObject.project_id);
    formData.append(
      "assumption[assumption_title]",
      assumptionObject.assumption_title
    );
    formData.append("assumption[description]", assumptionObject.description);
    formData.append("assumption[impact]", assumptionObject.impact);
    formData.append("assumption[assigned_to]", assumptionObject.assigned_to);
    assumptionObject.target_date_of_validation && formData.append(
      "assumption[target_date_of_validation]",
      new Date(assumptionObject.target_date_of_validation).toISOString()
    );
    assumptionObject.actual_closed_date && formData.append(
      "assumption[actual_closed_date]",
      new Date(assumptionObject.actual_closed_date).toISOString()
    );
    formData.append("assumption[status]", assumptionObject.status);
    formData.append("assumption[next_steps]", assumptionObject.next_steps);

    try {
      if (isEdit) {
        await axios.put(`${api_url}/assumptions/${editLog?.id}`, formData, {
          headers: { "x-api-token": tokenState },
        });
        NotificationManager.success("Updated successfully");
      } else {
        await axios.post(`${api_url}/assumptions`, formData, {
          headers: { "x-api-token": tokenState },
        });
        NotificationManager.success("Created successfully");
      }
      resetUpdates();
      setClosedRaidLogs(closedRaidLogs + 1);
      setIsEdit(false);
      setShowModal(false);
    } catch (error) {
      NotificationManager.error(error.response.data.error);
    }
  };

  const onCloseModal = () => {
    const dateValues = Object.keys(formValues).filter(
      (key) => formValues[key] !== ""
    );
    if (isEdit && isDirty) {
      setIsConfirmationPopup(true);
    } else if (!isEdit && dateValues.length) {
      setIsConfirmationPopup(true);
    } else {
      resetUpdates();
      closeModal();
    }
  };

  const handleExit = () => {
    setIsConfirmationPopup(false);
  };

  const handleReset = () => {
    resetUpdates();
    setIsConfirmationPopup(false);
    closeModal();
  };

  useEffect(() => {
    getProjectData();
    if (isEdit) {
      let targetDate =
        editLog?.target_date_of_validation &&
        new Date(editLog?.target_date_of_validation).toLocaleDateString(
          "en-CA"
        );
      let actualDate =
        editLog?.actual_closed_date &&
        new Date(editLog?.actual_closed_date).toLocaleDateString("en-CA");
      setValue("target_date_of_validation", targetDate);
      setValue("actual_closed_date", actualDate);
      setValue("assumption_title", editLog?.assumption_title);
      setValue("description", editLog?.description);
      setValue("impact", editLog?.impact || "");
      setValue("assigned_to", editLog?.assigned_to);
      setValue("status", editLog?.status);
      setValue("next_steps", editLog?.next_steps);
    }
  }, [isEdit, editLog]);

  return (
    <div>
      <Modal
        show={showModal}
        onHide={onCloseModal}
        style={isConfirmationPopup && { zIndex: 99 }}
      >
        <ModalHeader closeButton>
          <h3 className="m-auto">{isEdit ? "Edit" : "Add"} Assumption Log</h3>
        </ModalHeader>
        <ModalBody>
          <div>
            <form action="" onSubmit={handleSubmit(createOrUpdate)}>
              {!isEdit && (
                <div className="p-2">
                  <label htmlFor="" className="form-label">
                    Select a Project <span className="error-msg">*</span>
                  </label>
                  <select
                    name=""
                    id="id"
                    className="form-select p-2"
                    {...registerCreateUpdate("project_id", {
                      required: true,
                    })}
                  >
                    <option value="">--- Pick a Project ---</option>
                    {projectNames?.map((project, index) => (
                      <option
                        className="text-black"
                        value={project.id}
                        key={index}
                      >
                        {project.title}
                      </option>
                    ))}
                  </select>
                  {errors.project_id && (
                    <span className="fw-normal text-danger mb-0 pb-0">
                      * Select the Project
                    </span>
                  )}
                </div>
              )}

              <div className="p-2 pt-1 pb-2">
                <label htmlFor="comments" className="form-label">
                  Assumption Title <span className="error-msg">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Assumption Title"
                  {...registerCreateUpdate("assumption_title", {
                    required: true,
                  })}
                />
                {errors.comments && (
                  <span className="fw-normal text-danger mb-0 pb-0">
                    * Enter Assumption Title
                  </span>
                )}
              </div>

              <div className="p-2 pt-1 pb-2">
                <label htmlFor="description" className="form-label">
                  Description <span className="error-msg">*</span>
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Description"
                  {...registerCreateUpdate("description", {
                    required: true,
                  })}
                />
                {errors.comments && (
                  <span className="fw-normal text-danger mb-0 pb-0">
                    * Enter Description
                  </span>
                )}
              </div>
              <div className="p-2 pt-2 pb-2">
                <label htmlFor="impact" className="form-label">
                  Impact
                </label>
                <select
                  id="impact"
                  name="impact"
                  className="form-select"
                  {...registerCreateUpdate("impact")}
                >
                  <option value="">Select Impact</option>
                  {ImpactList.map((list, index) => (
                    <option value={list?.value}>{list?.label}</option>
                  ))}
                </select>
              </div>
              <div className="p-2">
                <label htmlFor="assigned_to" className="form-label">
                  Assigned To <span className="error-msg">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Assigned To"
                  className="form-control"
                  {...registerCreateUpdate("assigned_to", { required: true })}
                />
                {errors.assigned_to && (
                  <span className="fw-normal text-danger mb-0 pb-0">
                    * Enter Assigned To
                  </span>
                )}
              </div>

              <div className="p-2">
                <label
                  htmlFor="target_date_of_validation"
                  className="form-label"
                >
                  Target Date of Validation
                </label>
                <input
                  type="date"
                  name="target_date_of_validation"
                  id=""
                  placeholder="Choose Date"
                  className="form-control"
                  {...registerCreateUpdate("target_date_of_validation")}
                />
              </div>

              <div className="p-2">
                <label htmlFor="actual_closed_date" className="form-label">
                  Actual Closed Date
                </label>
                <input
                  type="date"
                  placeholder="Choose Date"
                  className="form-control"
                  {...registerCreateUpdate("actual_closed_date")}
                />
              </div>

              <div className="p-2 pt-2 pb-2">
                <label htmlFor="status" className="form-label">
                  Status <span className="error-msg">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  {...registerCreateUpdate("status", {
                    required: true,
                  })}
                >
                  <option value="">Select Status</option>
                  {LogStatus.map((list, index) => (
                    <option value={list.value}>{list.label}</option>
                  ))}
                </select>
                {errors.status && (
                  <span className="fw-normal text-danger mb-0 pb-0">
                    * Select the Status
                  </span>
                )}
              </div>

              <div className="p-2 pt-1 pb-2">
                <label htmlFor="next_steps" className="form-label">
                  Next Steps
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Next Steps"
                  {...registerCreateUpdate("next_steps")}
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="btn primary-color raid-log-button"
                  disabled={isDirty ? false : true}
                >
                  {isEdit ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </ModalBody>
      </Modal>
      {isConfirmationPopup && (
        <ConfirmationPopup
          isConfirmationPopup={isConfirmationPopup}
          setIsConfirmationPopup={setIsConfirmationPopup}
          handleReset={handleReset}
          handleExit={handleExit}
        />
      )}
    </div>
  );
};

export default AddAssumptionLog;
