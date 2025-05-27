import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Modal, ModalHeader, ModalBody } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { NotificationManager } from "react-notifications";
import ConfirmationPopup from "../confirmationPopup/ConfirmationPopup";
import "./add-delivery-governance-project-metric.css";
import { green, orange, orangered } from "../../common/constants/constant";


function AddDeliveryGovernanceProjectMetric(props) {
  const location = useLocation();
  let {
    updatesAdded,
    setUpdatesAdded,
    projectNames,
    gettingData,
    setShow,
    show,
    closeModal,
    gettingDataBasedFilters,
    isEdit,
    setIsEdit,
    editingMetric,
    isDoubleClick,
    doubleClickedDate,
    setIsDoubleClick,
    SetProjectNames
  } = props;

  // for handling create updates
  const {
    register: registerUpdates,
    handleSubmit: handleSubmitAddUpdates,
    reset: resetUpdates,
    formState: { errors, isDirty },
    setValue,
    getValues,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: isDoubleClick && !isEdit ? {
      project_id: projectNames[0].id, // Set the default value here
    } : {}
  });

  //   Api url
  const api_url = process.env.REACT_APP_API_URL;


  // token state
  const tokenState = localStorage.getItem("api_token");

  // State to handle the check box
 
  const [isConfirmationPopup, setIsConfirmationPopup] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);

  // today date
  let today = new Date();
  if(isDoubleClick){
    today = new Date(doubleClickedDate);
  }
  const todayDate = today.toISOString().split("T")[0];

  const createUpdate = async (updateObject) => {
    if (!updateObject) {
      return;
    }
    const formData = new FormData();
    const path = location.pathname;
    const baseKey =
      path === "/main-layout/delivery-governance"
        ? "delivery_governance"
        : "project_metric";
    if (!isEdit)
    formData.append(`${baseKey}[project_id]`, updateObject.project_id);
    updateObject.date && formData.append(`${baseKey}[date]`,new Date(updateObject.date).toISOString());
    formData.append(`${baseKey}[colour]`, updateObject.colour);
    formData.append(`${baseKey}[whats_ongoing]`, updateObject.whats_ongoing);
    formData.append(`${baseKey}[next_steps]`, updateObject.next_steps);

    try {
      const baseURL =
        path === "/main-layout/delivery-governance"
          ? "delivery_governances"
          : "project_metrics";
      if (isEdit) {
        await axios.put(`${api_url}/${baseURL}/${editingMetric.id}`, formData, {
          headers: { "x-api-token": tokenState },
        });
        NotificationManager.success("Updated successfully");
      } else {
        await axios.post(`${api_url}/${baseURL}`, formData, {
          headers: { "x-api-token": tokenState },
        });
        NotificationManager.success("Update added successfully");
        
      }
      setUpdatesAdded(updatesAdded + 1);
      resetUpdates();
      setIsEdit(false);
      setShow(false);
      path === "/main-layout/delivery-governance" && setIsDoubleClick(false);
    } catch (error) {
      NotificationManager.error(error.response.data.error);
    }
  };

  const handleDropdownChange = (status) => {
    setValue("colour", status, { shouldDirty: true });
  };

  const onCloseModal = () => {
    const formValues = getValues();
    const dateValues = Object.keys(formValues).filter(
      (key) =>
        (key !== "date" || formValues["date"] !== todayDate) &&
        formValues[key] !== false &&
        formValues[key] !== ""
    );
    if (isEdit && isDirty) {
      setIsConfirmationPopup(true);
    } else if (!isEdit && dateValues?.length) {
      setIsConfirmationPopup(true);
    } else {
      resetUpdates();
      closeModal();
    }
    location.pathname === "/main-layout/delivery-governance" && setIsDoubleClick(false);
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
    !isDoubleClick && gettingData();
    gettingDataBasedFilters();
    if (isEdit) {
      let date = new Date(editingMetric.date).toLocaleDateString("en-CA");
      setValue("project_id", editingMetric.project_id);
      setValue("date", date);
      setValue("colour", editingMetric.colour);
      setValue("whats_ongoing", editingMetric.whats_ongoing);
      setValue("next_steps", editingMetric.next_steps);
    }
    else{
      if(isDoubleClick){
        let date = new Date(doubleClickedDate).toLocaleDateString("en-CA");
        setValue("date", date);
      }
    }
  }, [isEdit, editingMetric]);

  const colorTextMapping = {
    green: "On Track",
    orange: "Needs Attention",
    orangered: "Under Risk",
  };

  return (
    <div>
      <Modal
        show={show}
        onHide={onCloseModal}
        style={isConfirmationPopup && { zIndex: 99 }}
      >
        <ModalHeader closeButton>
          <div className="m-auto ps-5">
            <h3>{isEdit ? "Edit" : "Add"} Project Status</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <div>
            <form action="" onSubmit={handleSubmitAddUpdates(createUpdate)}>
              {!isEdit && (
                <div className="p-2">
                  <label htmlFor="date" className="form-label">
                    Project<span className="text-danger">*</span>
                  </label>
                  <select
                    name=""
                    id="id"
                    disabled={isDoubleClick}
                    className="form-select p-2"
                    {...registerUpdates("project_id", { required: true })}
                    onChange={(e) => {
                      setSelectedProjects(e.target.value);
                    }}
                  >
                    {!isDoubleClick ? (
                      <>
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
                      </>
                    ) : (
                      <option value={projectNames[0].id}>{projectNames[0].title}</option>
                    )}
                  </select>
                  {errors.project_id && (
                    <span className="fw-normal text-danger mb-0 pb-0">
                      * Select the Project
                    </span>
                  )}
                </div>
              )}
              <div className="p-2">
                <label htmlFor="date" className="form-label">
                  Date<span className="text-danger">*</span>
                </label>
                {isEdit ? (
                  <input
                    type="text"
                    name="date"
                    id=""
                    className="form-control"
                    {...registerUpdates("date", { required: true })}
                    disabled={true}
                  />
                ) : (
                  <input
                    type="date"
                    name="date"
                    id=""
                    placeholder="Choose Date"
                    className="form-control"
                    defaultValue={todayDate}
                    max={todayDate}
                    {...registerUpdates("date", { required: true })}
                    disabled={isDoubleClick && true}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const currentDate = new Date(todayDate);
                      if (selectedDate > currentDate) {
                        e.target.value = todayDate;
                      }
                    }}
                  />
                )}
              </div>

              <div className="p-2">
                <label htmlFor="date" className="form-label">
                  What's Going On<span className="text-danger">*</span>
                </label>
                <textarea
                  type="text"
                  name=""
                  id="whats_ongoing"
                  className="form-control numbered-textarea"
                  placeholder="What's Going On"
                  {...registerUpdates("whats_ongoing", { required: true })}
                />
                {errors.whats_ongoing && (
                  <span className="fw-normal text-danger mb-0 pb-0">
                    * Please Enter What's Ongoing
                  </span>
                )}
              </div>

              <div className="p-2">
                <label htmlFor="next_steps" className="form-label">
                  Next Steps<span className="text-danger">*</span>
                </label>
                <textarea
                  type="text"
                  id="next_steps"
                  className="form-control text-area"
                  placeholder="What's Planned Ahead"
                  {...registerUpdates("next_steps", { required: true })}
                />
                {errors.next_steps && (
                  <span className="fw-normal text-danger mb-0 pb-0">
                    * Please Enter Next Steps
                  </span>
                )}
              </div>
              <div className="p-2 pb-4">
                <div className="custom-select">
                  <label htmlFor="date" className="form-label">
                    Status Of Project<span className="text-danger">*</span>
                  </label>
                  {false ? (
                    <input
                      type="text"
                      name="colour"
                      id="colour"
                      value={colorTextMapping[getValues("colour")]}
                      className="form-control"
                      disabled={true}
                    />
                  ) : (
                    <select
                      className="form-select"
                      {...registerUpdates("colour", { required: true })}
                      onChange={(event) =>
                        handleDropdownChange(event.target.value)
                      }
                    >
                      <option value="">-- Select project status --</option>

                      <option
                        value="green"
                        className="text-white fw-bold"
                        style={{ backgroundColor: green }}
                      >
                        On Track
                      </option>

                      <option
                        value="orange"
                        className="text-white fw-bold"
                        style={{ backgroundColor: orange }}
                      >
                        Needs Attention
                      </option>
                      <option
                        value="orangered"
                        className="text-white fw-bold"
                        style={{ backgroundColor: orangered }}
                      >
                        Under Risk
                      </option>
                    </select>
                  )}
                  {errors.colour && (
                    <span className="fw-normal text-danger mb-0 pb-0">
                      * Select Status
                    </span>
                  )}
                    {/* <p
                      style={{ color: "red", margin: "0", paddingTop: "10px" }}
                    >
                      Note: Once you have finalized your project status, no
                      edits can be made today.
                    </p> */}
                </div>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-success w-25"
                  disabled={
                    isDirty ? false : true
                  }
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
}

export default AddDeliveryGovernanceProjectMetric;