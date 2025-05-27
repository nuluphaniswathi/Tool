import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { NotificationManager } from "react-notifications";
import ConfirmationPopup from "../confirmationPopup/ConfirmationPopup";
import {riskSourcesList, riskCategoryList, riskStatus} from "../../common/constants/risk-constants";
import "./AddRiskLogs.css"

function AddRiskLogs(props) {
  const {
    editRaidLog,
    isEdit,
    setIsEdit,
    showRiskModal,
    setShowRiskModal,
    closeRiskModal,
    closedRaidLogs,
    setClosedRaidLogs,
    setLoadRiskLogs
  } = props;

  const [probability,setProbability]=useState('');
  const [impact,setImpact]=useState('');

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
    watch
  } = useForm();

  const api_url = process.env.REACT_APP_API_URL;
  const formValues = getValues();
  const watchValues=watch()

  useEffect(() => {
      setProbability(watchValues?.probability || "")
      setImpact(watchValues?.impact || "")
  }, [watchValues]);

  const errorHandler = (errorFor, inputValue, minValue, maxValue) => {
    if (
      isNaN(inputValue) ||
      inputValue < minValue ||
      inputValue > maxValue
    ) {
      setError(errorFor, {
        type: "custom",
        message: `Please enter a number between ${minValue} and ${maxValue}`,
      });
    } else {
      setError(errorFor, { type: "custom", message: "" });
    }
  };

  useEffect(() => {
    if (probability) {
      const numberInput = document.getElementById("probability");
      const inputValue = probability;
      const maxValue = parseFloat(numberInput.getAttribute("max"), 10);
      const minValue = parseFloat(numberInput.getAttribute("min"), 10);
      errorHandler("probability",inputValue,minValue,maxValue)
    }else{
      setError("probability", { type: "custom", message: "" });
    }
    if (impact) {
      const numberInput = document.getElementById("impact");
      const inputValue = impact;
      const maxValue = parseInt(numberInput.getAttribute("max"), 10);
      const minValue = parseInt(numberInput.getAttribute("min"), 10);
      errorHandler("impact",inputValue,minValue,maxValue)
    }
    else{
      setError("impact", { type: "custom", message: "" });
    }
  }, [probability,impact]);

  // token state
  const tokenState = localStorage.getItem("api_token");
  
  const [isConfirmationPopup, setIsConfirmationPopup] = useState(false);
  const [projectNames, setProjectNames] = useState([]);
  const [riskSources, setRiskSources] = useState(riskSourcesList);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  
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
  const createOrUpdate = async (raidLogObject) => {
    if(raidLogObject.date_identified){
      raidLogObject.date_identified = new Date(raidLogObject.date_identified).toISOString();
    }
    const body = {
      raid_log: {
        ...raidLogObject,
        risk_index: raidLogObject.probability * raidLogObject.impact,
        project_id: editRaidLog?.project_id || raidLogObject?.project_id
      }
    }
    try {
      if (isEdit) {
        await axios.put(`${api_url}/raid_logs/${editRaidLog?.id}`, body, {
          headers: { "x-api-token": tokenState },
        });
        NotificationManager.success("Updated successfully");
      } else {
        await axios.post(`${api_url}/raid_logs`, body, {
          headers: { "x-api-token": tokenState },
        });
        NotificationManager.success("Created successfully");
      }
      resetUpdates();
      setClosedRaidLogs(closedRaidLogs+1)
      setLoadRiskLogs(closedRaidLogs)
      setIsEdit(false);
      setShowRiskModal(false);
    } catch (error) {
      NotificationManager.error(error.response.data.error);
    }
  };

  const onCloseModal = () => {
    const dateValues = Object.keys(formValues)
      .filter(key => (key !== 'date_identified' || formValues['date_identified'] !== todayDate) && (formValues[key] !== ''))
    if(isEdit && isDirty) {
      setIsConfirmationPopup(true)
    } else if (!isEdit && dateValues.length) {
      setIsConfirmationPopup(true)
    } else {
      resetUpdates();
      closeRiskModal();
    }
  }

  const handleExit = () => {
    setIsConfirmationPopup(false)
  }

  const handleReset = () => {
    resetUpdates();
    setIsConfirmationPopup(false);
    setRiskSources(riskSourcesList)
    closeRiskModal();
  }


  const handleDateChange = (event) => {
    if(event.target.value > todayDate) event.target.value = todayDate
  }

  const handleCategoryChange = (event) => {
    const selectedMainCategory = event.target.value;
    const filteredSourceOptions = riskSourcesList.filter(source => source.toLowerCase().includes(selectedMainCategory?.toLowerCase()));
    const selectedCategory = formValues?.category && formValues?.category.toLowerCase()?.includes(selectedMainCategory?.toLowerCase())
    setRiskSources(filteredSourceOptions)
    setSelectedMainCategory(event.target.value);
    !selectedCategory && setValue("category",null,{shouldDirty:true})
    setValue("main_category", selectedMainCategory, {shouldDirty:true})
    trigger("main_category")
  }

  useEffect(() => {
    getProjectData();
    if (isEdit) {
      let dateIdentified = new Date(editRaidLog?.date_identified).toLocaleDateString("en-CA");
      setValue("date_identified", dateIdentified)
      setValue("main_category", editRaidLog?.main_category)
      setValue("category", editRaidLog?.category)
      setValue("comments", editRaidLog?.comments)
      setValue("risk_owner", editRaidLog?.risk_owner)
      setValue("probability", editRaidLog?.probability)
      setValue("impact", editRaidLog?.impact)
      setValue("risk_mitigation_plan", editRaidLog?.risk_mitigation_plan)
      setValue("risk_contingency_plan", editRaidLog?.risk_contingency_plan)
      setValue("status", editRaidLog?.status)
      setValue("mitigation_progress", editRaidLog?.mitigation_progress)
      setSelectedMainCategory(editRaidLog?.main_category)
    }
  }, [isEdit, editRaidLog]);

  return (
    <div>
      <Modal show={showRiskModal} onHide={onCloseModal} style={isConfirmationPopup && {zIndex: 99}} >
        <ModalHeader closeButton>
          <h3 className="m-auto">{isEdit ? 'Edit' : 'Add'} Risk Register Log</h3>
        </ModalHeader>
        <ModalBody>
          <div>
            <form action="" onSubmit={handleSubmit(createOrUpdate)}>
                {!isEdit && 
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
                }
                <div className="p-2">
                  <label htmlFor="date_identified" className="form-label">
                    Date Identified
                  </label>
                {isEdit ? (
                  <input
                    type="text"
                    name="date_identified"
                    id=""
                    placeholder="Choose Date"
                    className="form-control"
                    disabled={true}
                    {...registerCreateUpdate("date_identified")}
                  />
                ) : (
                  <input
                    type="date"
                    name="date_identified"
                    id=""
                    placeholder="Choose Date"
                    className="form-control"
                    defaultValue={todayDate}
                    max={todayDate}
                    {...registerCreateUpdate("date_identified")}
                    onBlur={handleDateChange}
                  />
                )}
                </div>
                <div className="p-2 pt-2 pb-2">
                  <label htmlFor="main_category" className="form-label">
                    Risk Category <span className="error-msg">*</span>
                  </label>
                  <select
                    id="main_category"
                    name="main_category"
                    className="form-select"
                    {...registerCreateUpdate("main_category", { required: true })}
                    onChange={handleCategoryChange}
                    >
                    <option value="">Select Risk Category</option>
                    {riskCategoryList.map((list, index) => (
                        <option value={list}>{list}</option>
                    ))}
                  </select>
                  {errors.main_category && (
                    <span className="fw-normal text-danger mb-0 pb-0">
                      * Select the Risk Category
                    </span>
                    )}
                </div>

                {(selectedMainCategory || formValues.category) &&
                  <div className="p-2 pt-2 pb-2"> 
                    <label htmlFor="category" className="form-label">
                      Risk Sources <span className="error-msg">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      className="form-select"
                      {...registerCreateUpdate("category", { required: true })}
                    >
                      <option value="">Select Risk Sources</option>
                      {riskSources.map((list, index) => (
                        <option value={list}>{list}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <span className="fw-normal text-danger mb-0 pb-0">
                        * Select the Risk Source
                      </span>
                    )}
                  </div>
                }
              
                <div className="p-2 pt-1 pb-2">
                  <label htmlFor="comments" className="form-label">
                    Risks <span className="error-msg">*</span>
                  </label>
                  <textarea
                    type="text"
                    id="comments"
                    name="comments"
                    className="form-control"
                    placeholder="Risk Description"
                    {...registerCreateUpdate("comments", { required: true })}
                  />
                  {errors.comments && (
                    <span className="fw-normal text-danger mb-0 pb-0">
                      * Enter Risk Description
                    </span>
                  )}
                </div>

                <div className="p-2">
                  <label htmlFor="risk_owner" className="form-label">
                    Risk Owner <span className="error-msg">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Risk Owner"
                    className="form-control"
                    id="risk_owner"
                    name="risk_owner"
                    {...registerCreateUpdate("risk_owner", { required: true })}
                  />
                  {errors.risk_owner && (
                    <span className="text-danger mb-0 pb-0">
                      * Enter Risk Owner
                    </span>
                  )}
                </div>

                <div className="p-2">
                  <label htmlFor="probability" className="form-label">
                    Probability <span className="error-msg">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Probability (Value must be between 0.1 and 0.9)"
                    className="form-control"
                    id="probability"
                    min={0.1}
                    max={0.9}
                    step={0.1}
                    {...registerCreateUpdate("probability", {
                      required: "* Enter Probability",
                    })}
                  />
                  {errors.probability && (
                    <span className="text-danger mb-0 pb-0">
                      {errors.probability.message}
                    </span>
                  )}
                </div>

                <div className="p-2"> 
                  <label htmlFor="impact" className="form-label">
                    Impact <span className="error-msg">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Impact (Value must be between 1 and 10)"
                    className="form-control"
                    id="impact"
                    min={1}
                    max={10}
                    {...registerCreateUpdate("impact", { required: "* Enter Impact"})}
                  />
                  {errors.impact && (
                    <span className="text-danger mb-0 pb-0">
                      {errors.impact.message}
                    </span>
                  )}
                </div>

                <div className="p-2 pt-1 pb-2">
                  <label htmlFor="risk_mitigation_plan" className="form-label">
                    Risk Mitigation Plan <span className="error-msg">*</span>
                  </label>
                  <textarea
                    type="text"
                    id="risk_mitigation_plan"
                    className="form-control"
                    placeholder="Risk Mitigation Plan"
                    {...registerCreateUpdate("risk_mitigation_plan", { required: true })}
                  />
                  {errors.risk_mitigation_plan && (
                    <span className="text-danger mb-0 pb-0">
                      * Enter Risk Mitigation Plan
                    </span>
                  )}
                </div>

                <div className="p-2 pt-1 pb-2">
                  <label htmlFor="risk_contingency_plan" className="form-label">
                    Risk Contingency Plan
                  </label>
                  <textarea
                    type="text"
                    id="risk_contingency_plan"
                    className="form-control"
                    placeholder="Risk Contingency Plan"
                    {...registerCreateUpdate("risk_contingency_plan")}
                  />
                </div>

                <div className="p-2 pt-2 pb-2">
                  <label htmlFor="status" className="form-label">
                    Risk Status <span className="error-msg">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="form-select"
                    {...registerCreateUpdate("status", { required: true })}
                    >
                    <option value="">Select Risk Status</option>
                    {riskStatus.map((list, index) => (
                      <option value={list}>{list}</option>
                    ))}
                  </select>
                  {errors.status && (
                    <span className="fw-normal text-danger mb-0 pb-0">
                      * Select the Risk Status
                    </span>
                  )}
                </div>

                <div className="p-2 pt-1 pb-2">
                  <label htmlFor="mitigation_progress" className="form-label">
                    Mitigation Progress / Comments
                  </label>
                  <textarea
                    type="text"
                    id="risks"
                    className="form-control"
                    placeholder="Mitigation Progress / Comments"
                    {...registerCreateUpdate("mitigation_progress")}
                  />
                </div>
              <div className="text-center">
                <button type="submit" className="btn primary-color raid-log-button" disabled={isDirty ? false : true}>
                  {isEdit ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </ModalBody>
      </Modal>
      {isConfirmationPopup && 
        <ConfirmationPopup 
          isConfirmationPopup={isConfirmationPopup} 
          setIsConfirmationPopup={setIsConfirmationPopup}
          handleReset={handleReset}
          handleExit={handleExit} 
        />
      }
    </div>
  );
}

export default AddRiskLogs;
