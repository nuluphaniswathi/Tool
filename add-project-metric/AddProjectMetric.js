import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Modal, ModalHeader, ModalBody } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { NotificationManager } from "react-notifications";
import {
  riskCategoryList,
  riskSourcesList,
} from "../../common/constants/risk-constants";
import ConfirmationPopup from "../confirmationPopup/ConfirmationPopup";
import "./AddProjectMetric.css";
import CustomDropdown from "../../common/components/dropdown/Dropdown";
import { green, orange, orangered } from "../../common/constants/constant";

function AddProjectMetric(props) {
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
    setLoadRiskLogs,
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
    trigger,
    clearErrors,
  } = useForm({
    defaultValues: isDoubleClick && !isEdit ? {
      project_id: projectNames[0].id, // Set the default value here
    } : {}
  });

  //   Api url
  const api_url = process.env.REACT_APP_API_URL;
  const formValues = getValues();

  // token state
  const tokenState = localStorage.getItem("api_token");
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("api_token");

  // State to handle the check box
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);
  const [isConfirmationPopup, setIsConfirmationPopup] = useState(false);
  const [riskSources, setRiskSources] = useState(riskSourcesList);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(false);
  const [selectedRisks, setSelectedRisks] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [commentsArray, setCommentsArray] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openRisksCount, setOpenRisksCount] = useState(0);
  const [isRiskRemoved, setIsRiskRemoved] = useState(false);
  const [isRiskSelected, setIsRiskSelected] = useState(false);

  const gettingRisks = async (projectId, statuses) => {
    let queryParams = `?statuses=${statuses}&project_ids=${projectId}`;
    try {
      const response = await axios.get(`${api_url}/raid_logs${queryParams}`, {
        headers: { "x-api-token": token },
        "ngrok-skip-browser-warning": "69420",
      });
      const raidLogs = response.data.raid_logs;
      const riskCommentsArray = raidLogs
        .filter((log) => log.comments)
        .map(({ id, comments }) => ({ value: id, label: comments }));
      setCommentsArray(riskCommentsArray);
      setOpenRisksCount(response?.data?.total_count);
    } catch (error) {
      console.log("Error at getting raid logs", error);
    }
  };

  useEffect(() => {
    selectedComments();
    if (isEdit && editingMetric?.project_id) {
      gettingRisks(editingMetric.project_id, [
        "Identified",
        "Under Mitigation",
        "Mitigated",
      ]);
    }
  }, [isEdit]);

  const handleRiskSelection = (risk) => {
    const isSelected = selectedRisks.find((item) => item.value === risk.value);

    if (isSelected) {
      setSelectedRisks(selectedRisks.filter((selected) => selected !== risk));
    } else {
      setSelectedRisks([...selectedRisks, risk]);
    }
    setIsRiskSelected(true);
    clearErrors("selected_risks");
  };

  const handleRemoveRisk = (indexToRemove, e) => {
    setSelectedRisks(
      selectedRisks.filter((risk, index) => index !== indexToRemove)
    );
    setIsRiskRemoved(true);
  };

  const selectedComments = () => {
    const mappedComments = editingMetric?.raid_logs?.map((log) => ({
      value: log.id,
      label: log.comments,
    }));
    setSelectedRisks(mappedComments);
  };
  // today date
  let today = new Date();
  if(isDoubleClick){
    today = new Date(doubleClickedDate);
  }
  const todayDate = today.toISOString().split("T")[0];

  // function to create updates on daily basis
  const createUpdate = async (updateObject) => {
    if (!updateObject) {
      return;
    }
    if (
      (isCheckboxSelected || (isEdit && formValues.colour !== "green")) &&
      selectedRisks?.length === 0
    ) {
      setError("selected_risks", {
        type: "custom",
        message: "Please Select Risk",
      });
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
    updateObject.date && formData.append(`${baseKey}[date]`, new Date(updateObject.date).toISOString());
    formData.append(`${baseKey}[colour]`, updateObject.colour);
    formData.append(`${baseKey}[whats_ongoing]`, updateObject.whats_ongoing);
    formData.append(`${baseKey}[next_steps]`, updateObject.next_steps);

    try {
      const riskIds = [];
      selectedRisks?.forEach((risk) => {
        riskIds.push(risk.value);
      });

      const params = {
        comments: updateObject?.comments,
        category: updateObject?.category,
        main_category: updateObject?.main_category,
        risk_ids: riskIds.join(","),
      };
      const editParams = {
        raid_log_comments: updateObject?.comments || "",
        category: updateObject?.category || "",
        main_category: updateObject?.main_category || "",
        risk_ids: riskIds.join(","),
      };
      const baseURL =
        path === "/main-layout/delivery-governance"
          ? "delivery_governances"
          : "project_metrics";
      if (isEdit) {
        await axios.put(`${api_url}/${baseURL}/${editingMetric.id}`, formData, {
          headers: { "x-api-token": tokenState },
          params: editParams,
        });
        NotificationManager.success("Updated successfully");
      } else {
        await axios.post(`${api_url}/${baseURL}`, formData, {
          headers: { "x-api-token": tokenState },
          params: params,
        });
        NotificationManager.success("Update added successfully");
        setIsCheckboxSelected(false);
      }
      setUpdatesAdded(updatesAdded + 1);
      setLoadRiskLogs(updatesAdded + 1);
      resetUpdates();
      setIsEdit(false);
      setShow(false);
      setSelectedStatus(false);
      path === "/main-layout/delivery-governance" && setIsDoubleClick(false);
    } catch (error) {
      NotificationManager.error(error.response.data.error);
    }
  };

  const handleCheckBox = (e) => {
    setIsCheckboxSelected(e.target.checked);
    setIsDropdownOpen(false);
    setSelectedRisks([]);
  };

  const handleCategoryChange = (event) => {
    const selectedMainCategory = event.target.value;
    const filteredSourceOptions = riskSourcesList.filter((source) =>
      source.toLowerCase().includes(selectedMainCategory.toLowerCase())
    );
    const selectedCategory =
      formValues?.category &&
      formValues?.category
        .toLowerCase()
        ?.includes(selectedMainCategory?.toLowerCase());
    setRiskSources(filteredSourceOptions);
    setSelectedMainCategory(event.target.value);
    !selectedCategory && setValue("category", null, { shouldDirty: true });
    setValue("main_category", selectedMainCategory, { shouldDirty: true });
    trigger("main_category");
  };

  const handleDropdownChange = (status) => {
    if (status !== "green") {
      setSelectedStatus(true);
    } else {
      setSelectedStatus(false);
      setIsCheckboxSelected(false);
      setValue("checkbox", false, { shouldDirty: true });
      setIsDropdownOpen(false);
      setSelectedRisks([]);
    }
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
    } else if (isEdit && (isRiskRemoved || isRiskSelected)) {
      setIsConfirmationPopup(true);
    } else {
      resetUpdates();
      setSelectedStatus(false);
      closeModal();
    }
    location.pathname === "/main-layout/delivery-governance" && setIsDoubleClick(false);
  };

  const handleExit = () => {
    setIsConfirmationPopup(false);
  };

  const handleReset = () => {
    resetUpdates();
    setIsCheckboxSelected(false);
    setSelectedStatus(false);
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
      setValue("main_category", editingMetric.raid_logs?.main_category);
      setValue("category", editingMetric?.raid_logs?.category);
      setValue("comments", editingMetric.raid_logs?.comments);
      setValue(
        "checkbox",
        editingMetric?.raid_logs?.category || editingMetric.raid_logs?.comments
      );
      setSelectedMainCategory(editingMetric?.raid_logs?.main_category);
      setIsCheckboxSelected(
        editingMetric?.raid_logs?.category || editingMetric.raid_logs?.comments
      );
      if (editingMetric.colour === "orange" || editingMetric.colour === "red") {
        setSelectedStatus(true);
      }
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
                      setSelectedRisks([]);
                      setIsDropdownOpen(false);
                      gettingRisks(e.target.value, [
                        "Identified",
                        "Under Mitigation",
                        "Mitigated",
                      ]);
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
                  <input
                    type="text"
                    name="date"
                    id=""
                    defaultValue={todayDate}
                    className="form-control"
                    {...registerUpdates("date", { required: true })}
                    readOnly={true}
                  />
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

              {isEdit &&
                formValues.colour !== "green" &&
                location.pathname === "/main-layout/pm-governance" && (
                  <>
                    <div className="p-2 form-label">Selected Risks</div>
                    <CustomDropdown
                      placeholder="Select a Risk"
                      options={commentsArray}
                      selectedOptions={selectedRisks}
                      handleOptionSelection={handleRiskSelection}
                      handleRemoveOption={handleRemoveRisk}
                      isDropdownOpen={isDropdownOpen}
                      setIsDropdownOpen={setIsDropdownOpen}
                      noOptions={"No Risks"}
                    />
                    {errors.selected_risks && (
                      <span className="text-danger mb-0 pb-0">
                        *{errors.selected_risks.message || "Please Select Risk"}
                      </span>
                    )}
                  </>
                )}

              {(formValues.colour === "orange" ||
                formValues.colour === "orangered") &&
                isEdit &&
                location.pathname === "/main-layout/pm-governance" && (
                  <div className="p-1">
                    <p>
                      **Note: Editing a risk need to be done from{" "}
                      <a href="/main-layout/raid-logs">Risk Register log</a>{" "}
                    </p>
                  </div>
                )}
              <div className="p-2 pb-4">
                <div className="custom-select">
                  <label htmlFor="date" className="form-label">
                    Status Of Project<span className="text-danger">*</span>
                  </label>
                  {isEdit &&
                  location.pathname === "/main-layout/pm-governance" ? (
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
                      {!openRisksCount &&  (
                        <option
                          value="green"
                          className="text-white fw-bold"
                          style={{ backgroundColor: green }}
                        >
                          On Track
                        </option>
                      )}
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
                  {location.pathname === "/main-layout/pm-governance" && (
                    <p
                      style={{ color: orangered, margin: "0", paddingTop: "10px" }}
                    >
                      Note: Once you have finalized your project status, no
                      edits can be made today.
                    </p>
                  )}
                </div>
              </div>
              {location.pathname === "/main-layout/pm-governance" && (
                <>
                  {!isEdit &&
                    (formValues.colour === "orange" ||
                      formValues.colour === "orangered") && (
                      <div className="p-2">
                        <div className="d-flex">
                          <input
                            type="checkbox"
                            name=""
                            id="risk_dropdown"
                            className="form-check mb-2"
                            {...registerUpdates("checkbox")}
                            onChange={handleCheckBox}
                          />
                          <label
                            htmlFor="
                      risk_dropdown"
                            className="form-label fw-normal ps-3"
                          >
                            Select from the previously added risks
                          </label>
                        </div>
                      </div>
                    )}
                  {isCheckboxSelected && formValues.colour !== "green" && (
                    <CustomDropdown
                      placeholder="Select a Risk"
                      options={commentsArray}
                      selectedOptions={selectedRisks}
                      handleOptionSelection={handleRiskSelection}
                      handleRemoveOption={handleRemoveRisk}
                      isDropdownOpen={isDropdownOpen}
                      setIsDropdownOpen={setIsDropdownOpen}
                      noOptions={"No Risks"}
                    />
                  )}
                  {errors.selected_risks && (
                    <span className="text-danger mb-0 pb-0">
                      *{errors.selected_risks.message || "Please Select Risk"}
                    </span>
                  )}

                  {!isEdit &&
                    !isCheckboxSelected &&
                    (formValues.colour === "orange" ||
                      formValues.colour === "orangered") && (
                      <div className="bg-light">
                        <div className="p-4 pt-2 pb-2">
                          <label htmlFor="main_category" className="form-label">
                            Risk Category<span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select"
                            {...registerUpdates("main_category", {
                              required: true,
                            })}
                            onChange={handleCategoryChange}
                          >
                            <option value="">Select Risk Category</option>
                            {riskCategoryList.map((list, index) => (
                              <option value={list}>{list}</option>
                            ))}
                          </select>
                          {errors.main_category && (
                            <span className="fw-normal text-danger mb-0 pb-0">
                              * Select Risk Category
                            </span>
                          )}
                        </div>
                        {(selectedMainCategory || formValues.category) && (
                          <div className="p-4 pt-2 pb-2">
                            <label htmlFor="category" className="form-label">
                              Risk Source<span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-select"
                              {...registerUpdates("category", {
                                required: true,
                              })}
                            >
                              <option value="">Select Risk Source</option>
                              {riskSources.map((list, index) => (
                                <option value={list}>{list}</option>
                              ))}
                            </select>
                            {errors.category && (
                              <span className="fw-normal text-danger mb-0 pb-0">
                                * Select Risk Source
                              </span>
                            )}
                          </div>
                        )}
                        <div className="p-4 pt-1 pb-2">
                          <label htmlFor="risk" className="form-label">
                            Risks<span className="text-danger">*</span>
                          </label>
                          <textarea
                            type="text"
                            id="risks"
                            className="form-control"
                            placeholder="Any Risks You Would Like To Highlight"
                            {...registerUpdates("comments", { required: true })}
                          />
                          {errors.comments && (
                            <span className="fw-normal text-danger mb-0 pb-0">
                              * Enter Risk Description
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                </>
              )}

              <div className="text-center">
                <button
                  type="submit"
                  className="btn primary-color w-25"
                  disabled={
                    isDirty || isRiskRemoved || isRiskSelected ? false : true
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

export default AddProjectMetric;
