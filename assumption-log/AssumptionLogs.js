import React, { useEffect, useState } from "react";
import axios from "axios";
import useGDOFilters from "../../common/hooks/useGDOFilters";
import { NotificationManager } from "react-notifications";
import { Loader } from "../../common/components/loader/Loader.js";
import { TbEdit, TbHistory } from "react-icons/tb";
import { FaDownload, FaFilter } from "react-icons/fa";
import AddAssumptionLog from "./modal/AddAssumptionLog";
import MultiSelectGDOFilter from "../../common/components/filter/MultiSelectGDOFilter.js";
import Select from "../../common/components/select/Select";
import { LogStatus } from "../../common/constants/logs-constants";
import downloadFile from "../../common/utils/downloadFile";
import RiskEditHistory from "../risk-edit-history/RiskEditHistory";
import { convertToTitleCase } from "../../common/utils/util";
import Pagination from "../../common/components/Pagination";
import { green, primary_color } from "../../common/constants/constant.js";
import { downloadAssumptionReport, fetchFilteredAssumptionLogs } from "../../api/pmGovernance/assumptionLog.js";

const AssumptionLogs = (props) => {
  const {gdoFilters, resetGdoFilters, setGDOFilters} = useGDOFilters();
  const api_url = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("api_token");
  const user = JSON.parse(localStorage.getItem("user"));
  const defaultD = user.role === "delivery_manager" ? [user.d] : [];
  const [assumptionLogs, setAssumptionLogs] = useState([]);
  const [closedRaidLogs, setClosedRaidLogs] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showEditHistory, setShowEditHistory] = useState(false);
  const [selectedGDO, setSelectedGDO] = useState([]);
  const [selectedDFilter, setSelectedDFilter] = useState(defaultD);
  const [editLog, setEditLog] = useState({});
  const [logId, setLogId] = useState();
  const [isFilter, setIsFilter] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showReset, setShowReset] = useState(false);
  // State to load the spinner
  const [showLoading, setShowLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 15;

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = assumptionLogs?.slice(indexOfFirstLog, indexOfLastLog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(assumptionLogs?.length / logsPerPage);

  const gettingAssumptionLogs = async (
    gdo = selectedGDO,
    projects = selectedProjects,
    status = selectedStatus?.value,
  ) => {
    try {
      const response = await fetchFilteredAssumptionLogs(gdo, projects, status);
      setAssumptionLogs(response.data?.assumptions);
      setShowLoading(false);
    } catch (error) {
      console.log("Error at getting raid logs", error);
    }
  };

  const updateRaid = async (assumptionId, status) => {
    const formData = new FormData();
    formData.append("assumption[status]", status);
    try {
      const updated = await axios.put(
        `${api_url}/assumptions/${assumptionId}`,
        formData,
        {
          headers: {
            "x-api-token": token,
          },
        }
      );
      setClosedRaidLogs(closedRaidLogs + 1);
      NotificationManager.success("Status updated successfully");
    } catch (error) {
      NotificationManager.error("Error at closing raid logs", error);
    }
  };

  const downloadReport = async () => {
    try {
      const response = await downloadAssumptionReport(selectedGDO, selectedProjects, selectedStatus?.value);
      await downloadFile({
        data: response.data,
        defaultFileName: "Assumption Logs",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        extension: "xlsx",
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    gettingAssumptionLogs(
      selectedGDO,
      selectedProjects,
      selectedStatus?.value
    );
  }, [closedRaidLogs]);


  const closeModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setEditLog({});
  };

  const resetData = () => {
    setSelectedProjects([]);
    setSelectedStatus("");
    setSelectedGDO([]);
    setSelectedDFilter(defaultD);
    setShowReset(false);
    gettingAssumptionLogs([], [], "");
    setGDOFilters(resetGdoFilters);
  };

  return (
    <div>
      <h3 className="fs-1 text-center">Assumption Log</h3>
      <div className="d-flex justify-content-end align-items-center mb-4 pt-2 pb-2 mt-4">
        {isFilter && (
          <div className="d-flex align-items-center">
          <MultiSelectGDOFilter
            gdoFilters={gdoFilters}
            setGDOFilters={setGDOFilters}
            selectedGDO={selectedGDO}
            setSelectedGDO={setSelectedGDO}
            setShowReset={setShowReset}
            setSelectedProjects={setSelectedProjects}
            selectedProjects={selectedProjects}
            setShowLoading={setShowLoading}
            isDeliveryGovernanceSection={false}
            selectedDFilter={selectedDFilter}
            setSelectedDFilter={setSelectedDFilter}
            />
            <div className="me-2">
              <label>
                <Select
                  options={LogStatus}
                  onSelectChange={(e) => {
                    setSelectedStatus(e);
                    setShowReset(true);
                  }}
                  selectedValue={selectedStatus}
                  placeholder={"Select Status"}
                  isMultiple={false}
                  closeMenuOnSelect={true}
                />
              </label>
            </div>
            <div className="d-flex align-items-center">
              <button
                className="btn primary-color btn-s risk-button"
                onClick={() => {
                  gettingAssumptionLogs();
                  setShowReset(true);
                }}
                disabled={
                  !(
                    selectedStatus ||
                    selectedProjects?.length > 0 ||
                    selectedGDO?.length > 0 ||
                    selectedDFilter?.length > 0
                  )
                }
              >
                Search
              </button>
              {showReset && (
                <button
                  className="btn btn-s reset-button mr-3"
                  onClick={() => {
                    resetData();
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}
        <div className="d-flex justify-content-end align-items-center">
          <div className="filter-icon">
            <button
              className="btn"
              onClick={() => {
                resetData();
                setIsFilter(!isFilter);
              }}
            >
              <FaFilter
                style={{ width: "20px", height: "20px", color: primary_color }}
              />
            </button>
          </div>
          <div className="d-flex align-items-center">
            <button
              className="btn primary-color btn-s fw-bold risk-button mr-3"
              onClick={() => {
                setShowModal(true);
                setEditLog({});
              }}
            >
              Add Assumption Log
            </button>
            {(selectedProjects.length > 0 || selectedStatus || selectedGDO?.length > 0) && (
              <button className="btn download-icon" onClick={downloadReport}>
                <FaDownload size={26} color={primary_color} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading the functionality */}
      {showLoading ? ( 
      <Loader/>
      ) : assumptionLogs?.some((raid) => raid.id) ? (
        <React.Fragment>
          <div
            className={
              user.role === "workspace_admin"
                ? "table-responsive m-auto table-admin-design"
                : "table-responsive m-auto table-design"
            }
            style={{ width: "98%" }}
          >
            <table className="table table-bordered table-striped p-3">
              <thead className="thead table-primary text-capitalize fixed-header">
                <tr>
                  <th className="fs-5 risk-id">Assumption ID</th>
                  <th className="fs-5">Client Name</th>
                  <th className="fs-5">Project Name</th>
                  <th className="fs-5">Assumption Title</th>
                  <th className="fs-5" style={{ minWidth: "400px" }}>
                    Description
                  </th>
                  <th className="fs-5">Impact</th>
                  <th className="fs-5">Assigned To</th>
                  <th className="fs-5">Target Date of Validation</th>
                  <th className="fs-5">Actual Closed Date</th>
                  <th className="fs-5">Status</th>
                  <th className="fs-5 column-width">Next Steps</th>
                  <th className="fs-5" style={{ minWidth: "150px" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-capitalize" style={{ fontSize: "14px" }}>
                {currentLogs?.map((assumption, index) => (
                  <>
                    <tr key={assumption.id}>
                      <th>
                        <div className="d-flex align-items-center justify-content-between">
                          <span>{assumption.assumption_id}</span>
                          <button
                            className="btn pt-0"
                            onClick={() => {
                              setShowModal(true);
                              setIsEdit(true);
                              setEditLog(assumption);
                            }}
                          >
                            <TbEdit style={{ width: "20px", height: "20px" }} />
                          </button>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <button
                            className="btn history-icon"
                            onClick={() => {
                              setShowEditHistory(true);
                              setLogId(assumption?.id);
                            }}
                          >
                            <TbHistory
                              style={{
                                width: "20px",
                                height: "20px",
                                color: primary_color,
                              }}
                            />
                          </button>
                        </div>
                      </th>
                      <td>{assumption.client_name}</td>
                      <td>{assumption.project_name}</td>
                      <td className="column-width">
                        {assumption.assumption_title || "-"}
                      </td>
                      <td>{assumption.description || "-"}</td>
                      <td>
                        {assumption.impact
                          ? convertToTitleCase(assumption?.impact)
                          : "-"}
                      </td>
                      <td>{assumption.assigned_to || "-"}</td>
                      <td>{assumption.target_date_of_validation || "-"}</td>
                      <td>{assumption.actual_closed_date || "-"}</td>
                      <td>{assumption.status || "-"}</td>
                      <td className="column-width">
                        {assumption.next_steps || "-"}
                      </td>
                      <td className="text-center">
                        {assumption.status === "closed" ? (
                          <button
                            className="btn btn-sm open-button"
                            style={{ minWidth: "80%" }}
                            onClick={() => updateRaid(assumption.id, "open")}
                          >
                            Re Open
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm"
                            style={{ minWidth: "80%", backgroundColor: green }}
                            onClick={() => updateRaid(assumption.id, "closed")}
                          >
                            Close
                          </button>
                        )}
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-center align-items-center mt-3">
          {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate}
                maxPageNumbers={4}
              />
            )}
          </div>
        </React.Fragment>
      ) : (
        <div className="row">
          <div className="col-4 m-auto">
            <marquee>
              <h1 className="fs-1">No Assumption Logs</h1>
            </marquee>
          </div>
        </div>
      )}
      {showModal && (
        <AddAssumptionLog
          showModal={showModal}
          setShowModal={setShowModal}
          closeModal={closeModal}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          editLog={editLog}
          closedRaidLogs={closedRaidLogs}
          setClosedRaidLogs={setClosedRaidLogs}
        />
      )}

      {showEditHistory && (
        <RiskEditHistory
          showEditHistory={showEditHistory}
          setShowEditHistory={setShowEditHistory}
          logId={logId}
          setLogId={setLogId}
          logType={"assumptions"}
        />
      )}
    </div>
  );
};

export default AssumptionLogs;
