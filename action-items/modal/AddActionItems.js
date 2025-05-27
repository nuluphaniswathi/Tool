import axios from "axios";
import useFetchData from "../../../common/hooks/useFetch";
import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { NotificationManager } from "react-notifications";
import ConfirmationPopup from "../../confirmationPopup/ConfirmationPopup";
import { LogStatus } from "../../../common/constants/logs-constants";
import "./AddActionItems.css";
import { fetchCategories } from "../../../api/pmGovernance/actionItems";

function AddActionItems(props) {
  const {
    editActionItem,
    isEdit,
    setIsEdit,
    showModal,
    setShowModal,
    closeModal,
    closedActionItems,
    setClosedActionItems,
  } = props;

  const todayDate = new Date().toISOString().split("T")[0];

  const {
    register: registerCreateUpdate,
    handleSubmit,
    reset: resetUpdates,
    formState: { errors, isDirty },
    setValue,
    getValues,
    trigger,
    setError,
  } = useForm();

  const api_url = process.env.REACT_APP_API_URL;
  const formValues = getValues();

  // token state
  const tokenState = localStorage.getItem("api_token");

  const [isConfirmationPopup, setIsConfirmationPopup] = useState(false);
  const [projectNames, setProjectNames] = useState([]);
  const [createdDate, setCreatedDate] = useState(new Date());
  const [editCreatedDate, setEditCreatedDate] = useState(null);
  const {fetchedData} = useFetchData(fetchCategories);
  const [categories, setCategories] = useState(fetchedData?.categories || []);


useEffect(() => {
  if (fetchedData?.categories) {
    setCategories(fetchedData.categories);
  } else {
    setCategories([]);
  }
}, [fetchedData]);

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
  const createOrUpdate = async (actionItemObject) => {
    const formData = new FormData();
    !isEdit &&
      formData.append("action_item[project_id]", actionItemObject.project_id);
    formData.append("action_item[action_item]", actionItemObject.action_item);
    formData.append("action_item[raised_by]", actionItemObject.raised_by);
    if (actionItemObject.category)
      formData.append("action_item[category]", actionItemObject.category);
    actionItemObject.created_date &&  formData.append("action_item[created_date]", new Date(actionItemObject.created_date).toISOString());
    formData.append("action_item[assigned_to]", actionItemObject.assigned_to);
    actionItemObject.target_closure_date && formData.append(
      "action_item[target_closure_date]",
      new Date(actionItemObject.target_closure_date).toISOString()
    );
    actionItemObject.actual_closed_date && formData.append(
      "action_item[actual_closed_date]",
      new Date(actionItemObject.actual_closed_date).toISOString()
    );
    formData.append("action_item[status]", actionItemObject.status);
    formData.append("action_item[details]", actionItemObject.details);
    try {
      if (isEdit) {
        await axios.put(
          `${api_url}/action_items/${editActionItem?.id}`,
          formData,
          {
            headers: { "x-api-token": tokenState },
          }
        );
        NotificationManager.success("Updated successfully");
      } else {
        await axios.post(`${api_url}/action_items`, formData, {
          headers: { "x-api-token": tokenState },
        });

        NotificationManager.success("Created successfully");
      }
      resetUpdates();
      setClosedActionItems(closedActionItems + 1);
      setIsEdit(false);
      setShowModal(false);
    } catch (error) {
      NotificationManager.error(error.response.data.error);
    }
  };

  const onCloseModal = () => {
    const dateValues = Object.keys(formValues).filter(
      (key) =>
        (key !== "created_date" || formValues["created_date"] !== todayDate) &&
        formValues[key] !== ""
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

  const handleDateChange = (event) => {
    if (event.target.value > todayDate) event.target.value = todayDate;
  };

  useEffect(() => {
    getProjectData();
    if (isEdit) {
      let onEditCreatedDate = new Date(
        editActionItem?.created_date
      ).toLocaleDateString("en-CA");
      setEditCreatedDate(onEditCreatedDate);
      let targetDate =
        editActionItem?.target_closure_date &&
        new Date(editActionItem?.target_closure_date).toLocaleDateString(
          "en-CA"
        );
      let actualDate =
        editActionItem?.actual_closed_date &&
        new Date(editActionItem?.actual_closed_date).toLocaleDateString(
          "en-CA"
        );
      setValue("action_item", editActionItem?.action_item);
      setValue("raised_by", editActionItem?.raised_by);
      setValue("created_date", onEditCreatedDate);
      setValue("assigned_to", editActionItem?.assigned_to);
      setValue("target_closure_date", targetDate);
      setValue("actual_closed_date", actualDate);
      setValue("status", editActionItem?.status);
      if(editActionItem?.category){
       setValue("category", editActionItem?.category);
      }
      setValue("details", editActionItem?.details);
    }
  }, [isEdit, editActionItem]);


  return (
    <div>
      <Modal
        show={showModal}
        onHide={onCloseModal}
        style={isConfirmationPopup && { zIndex: 99 }}
      >
        <ModalHeader closeButton>
          <h3 className="m-auto">{isEdit ? "Edit" : "Add"} Action Items</h3>
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
                    {...registerCreateUpdate("project_id", { required: true })}
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
                <label htmlFor="action-item" className="form-label">
                  Action Item <span className="error-msg">*</span>
                </label>
                <textarea
                  type="text"
                  id="action-item"
                  name="action-item"
                  className="form-control"
                  placeholder="Action Item"
                  {...registerCreateUpdate("action_item", { required: true })}
                />
                {errors.action_item && (
                  <span className="fw-normal text-danger mb-0 pb-0">
                    * Enter Action Item
                  </span>
                )}
              </div>
              <div className="p-2">
                <label htmlFor="raised_by" className="form-label">
                  Raised by
                </label>
                <input
                  type="text"
                  placeholder="Raised by"
                  className="form-control"
                  id="raised_by"
                  name="raised_by"
                  {...registerCreateUpdate("raised_by")}
                />
              </div>
               <div className="p-2">
                <label htmlFor="category" className="form-label">
                  Select Category
                </label>
                <select
                  name="category"
                  id="category"
                  className="form-select p-2"
                  {...registerCreateUpdate("category")}
                >
                  <option value="">Select Category</option>
                  {categories?.filter(category => category !== "Risk")
                  .map((category, index) => (
                    <option
                      className="text-black text-capitalize"
                      value={category}
                      key={index}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="p-2">
                <label htmlFor="created_date" className="form-label">
                  Created Date
                </label>
                {isEdit ? (
                  <input
                    type="text"
                    name="created_date"
                    id=""
                    placeholder="Choose Date"
                    disabled={true}
                    className="form-control"
                    {...registerCreateUpdate("created_date")}
                  />
                ) : (
                  <input
                    type="date"
                    name="created_date"
                    id=""
                    placeholder="Choose Date"
                    className="form-control"
                    defaultValue={todayDate}
                    max={todayDate}
                    {...registerCreateUpdate("created_date")}
                    onBlur={handleDateChange}
                  />
                )}
              </div>
              <div className="p-2">
                <label htmlFor="assigned_to" className="form-label">
                  Assigned to <span className="error-msg">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Assigned to"
                  className="form-control"
                  id="assigned_to"
                  name="assigned_to"
                  {...registerCreateUpdate("assigned_to", { required: true })}
                />
                {errors.assigned_to && (
                  <span className="fw-normal text-danger mb-0 pb-0">
                    * Enter Assigned To
                  </span>
                )}
              </div>
              <div className="p-2">
                <label htmlFor="target_closure_date" className="form-label">
                  Target closure Date
                </label>

                <input
                  type="date"
                  name="target_closure_date"
                  id=""
                  placeholder="Choose Date"
                  className="form-control"
                  {...registerCreateUpdate("target_closure_date",{
                    validate: (value) => {
                      if(value){
                       const selectedDate = new Date(value).toLocaleDateString("en-CA");
                       if(isEdit && editCreatedDate){
                        if (isEdit && selectedDate <= editCreatedDate) {
                          return "Target closure date must be greater than created date";
                        }
                      }else if(selectedDate <= createdDate.toLocaleDateString("en-CA")){
                         return "Target closure date must be greater than created date";
                      }}
                      return true;
                    },
                  })}
                />
                {errors.target_closure_date && (
                  <span className="fw-normal text-danger mb-0 pb-0">
                    {errors.target_closure_date.message}
                  </span>
                )}
              </div>
              <div className="p-2">
                <label htmlFor="actual_closed_date" className="form-label">
                  Actual Closed Date
                </label>

                <input
                  type="date"
                  name="actual_closed_date"
                  id=""
                  placeholder="Choose Date"
                  className="form-control"
                  {...registerCreateUpdate("actual_closed_date",{
                    validate: (value) => {
                      if(value){
                       const selectedDate = new Date(value).toLocaleDateString("en-CA");
                       if(isEdit && editCreatedDate){
                        if (isEdit && selectedDate <= editCreatedDate) {
                          return "Actual closed date must be greater than created date";
                        }
                      }else if(selectedDate <= createdDate.toLocaleDateString("en-CA")){
                         return "Actual closed date must be greater than created date";
                      }}
                      return true;
                    },
                  })}
                />
                {errors.actual_closed_date && (
                  <span className="fw-normal text-danger mb-0 pb-0">
                    {errors.actual_closed_date.message}
                  </span>
                )}
              </div>
              <div className="p-2 pt-2 pb-2">
                <label htmlFor="status" className="form-label">
                  Status <span className="error-msg">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  {...registerCreateUpdate("status", { required: true })}
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
                <label htmlFor="details" className="form-label">
                  Details/Next Steps
                </label>
                <textarea
                  type="text"
                  id="details"
                  name="details"
                  className="form-control"
                  placeholder="Details/Next Steps"
                  {...registerCreateUpdate("details")}
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
}

export default AddActionItems;
