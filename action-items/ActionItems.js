import React, { useEffect, useState } from "react";
import useGDOFilters from "../../common/hooks/useGDOFilters";
import { Loader } from "../../common/components/loader/Loader";
import { TbEdit, TbHistory } from "react-icons/tb";
import { FaDownload, FaFilter } from "react-icons/fa";
import "./ActionItems.css";
import { formatDate } from "../../common/utils/dateFilterHandler";
import RiskEditHistory from "../risk-edit-history/RiskEditHistory";
import { LogStatus } from "../../common/constants/logs-constants";
import MultiSelectGDOFilter from "../../common/components/filter/MultiSelectGDOFilter";
import downloadFile from "../../common/utils/downloadFile";
import AddActionItems from "./modal/AddActionItems";
import Select from "../../common/components/select/Select";
import Pagination from "../../common/components/Pagination";
import { primary_color } from "../../common/constants/constant";
import { useLocation } from "react-router-dom";
import { downloadActionItemsReport, fetchFilteredActionItems } from "../../api/pmGovernance/actionItems";
import { NotificationManager } from "react-notifications";


function ActionItems(props) {
  const { gdoFilters, resetGdoFilters, setGDOFilters} = useGDOFilters();

  const user = JSON.parse(localStorage.getItem("user"));
  const defaultD = user.role === "delivery_manager" ? [user.d] : [];
  
  // action items states
  const [actionItems, setActionItems] = useState([]);
  const [closedActionItems, setClosedActionItems] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showEditHistory, setShowEditHistory] = useState(false);
  const [selectedGDO, setSelectedGDO] = useState([]);
  const [selectedDFilter, setSelectedDFilter] = useState(defaultD);
  const [editActionItem, setEditActionItem] = useState({});
  const [logId, setLogId] = useState();
  const [isFilter, setIsFilter] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showReset, setShowReset] = useState(false);
  // State to load the spinner
  const [showLoading, setShowLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const actionsPerPage = 15;

  const indexOfLastItem = currentPage * actionsPerPage;
  const indexOfFirstItem = indexOfLastItem - actionsPerPage;
  const currentItems = actionItems?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(actionItems?.length / actionsPerPage);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const projectId = params.get("projectId");
  const category = params.get("category");

  // function to get the action items
  const gettingActionItems = async (
    gdo = selectedGDO,
    projects = selectedProjects,
    status = selectedStatus?.value
  ) => {
    if (projectId) {status= "open";projects = [projectId];}
    try {
      const response = await fetchFilteredActionItems(gdo, projects, status, category);
      setActionItems(response?.data?.action_items);
      setShowLoading(false);
    } catch (error) {
      console.log("Error at getting action items", error);
    }
  };

  const downloadReport = async () => {
    try {
      const response = await downloadActionItemsReport(selectedGDO, selectedProjects, selectedStatus?.value);
      await downloadFile({
        data: response.data,
        defaultFileName: "Action items",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        extension: "xlsx",
      });
    } catch (error) {
      NotificationManager.error("OOps!Something went wrong while downloading");
      console.error(error);
    }
  };

  useEffect(() => {
    gettingActionItems(
      selectedGDO,
      selectedProjects,
      selectedStatus?.value
    );
  }, [closedActionItems]);


  const closeModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setEditActionItem({});
  };

  const resetData = () => {
    setSelectedProjects([]);
    setSelectedStatus("");
    setSelectedGDO([]);
    setSelectedDFilter(defaultD);
    setShowReset(false);
    gettingActionItems([], [], "");
    setGDOFilters(resetGdoFilters);
  };

  return (
    <div>
      <h3 className="fs-1 text-center">Action Items</h3>
      <div className="d-flex justify-content-end align-actions-center mb-4 pt-2 pb-2 mt-4">
        {isFilter && (
          <div className="d-flex align-actions-center">
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
            <div className="d-flex align-actions-center mr-3">
              <label className="me-2">
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
            <div className="d-flex align-actions-center">
              <button
                className="btn primary-color btn-s risk-button"
                onClick={() => {
                  gettingActionItems();
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
        <div className="d-flex justify-content-end align-actions-center">
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
          <div className="d-flex align-actions-center">
            <button
              className="btn primary-color btn-s fw-bold risk-button mr-3"
              onClick={() => {
                setShowModal(true);
                setEditActionItem({});
              }}
            >
              Add Action Item
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
      ) : actionItems.some((action_item) => action_item.id) ? (
        <React.Fragment>
          <div
            // className="table-responsive m-auto table-design"
            className={
              user.role === "workspace_admin"
                ? "table-responsive m-auto table-admin-design"
                : "table-responsive m-auto table-design"
            }
            style={{ width: "98%" }}
          >
            <table className="table table-bordered table-striped p-3 manageUsers">
              <thead className="thead table-primary text-capitalize fixed-header">
                <tr>
                  <th className="fs-5 risk-id">Action Item ID</th>
                  <th className="fs-5">Client Name</th>
                  <th className="fs-5">Project Name</th>
                  <th className="fs-5" style={{ minWidth: "450px" }}>
                    Action Item
                  </th>
                  <th className="fs-5" style={{ minWidth: "200px" }}>
                    Details/Next Steps
                  </th>
                  <th className="fs-5">Status</th>
                  <th className="fs-5">Category</th>
                  <th className="fs-5">Raised by</th>
                  <th className="fs-5">Assigned to</th>
                  <th className="fs-5">Created Date</th>
                  <th className="fs-5">Target Closure Date</th>
                  <th className="fs-5">Actual Closed Date</th>
                </tr>
              </thead>
              <tbody className="text-capitalize" style={{ fontSize: "14px" }}>
                {currentItems?.map((actionItem, index) => (
                  <>
                    <tr key={actionItem.id}>
                      <th>
                        <div className="d-flex align-actions-center justify-content-between">
                          <span>{actionItem.action_item_id}</span>
                          <button
                            className="btn pt-0"
                            onClick={() => {
                              setShowModal(true);
                              setIsEdit(true);
                              setEditActionItem(actionItem);
                            }}
                          >
                            <TbEdit style={{ width: "20px", height: "20px" }} />
                          </button>
                        </div>
                        <div className="d-flex align-actions-center justify-content-between">
                          <button
                            className="btn history-icon"
                            onClick={() => {
                              setShowEditHistory(true);
                              setLogId(actionItem?.id);
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

                      <td>{actionItem.client_name}</td>
                      <td>{actionItem.project_name}</td>
                      <td>{actionItem.action_item}</td>
                      <td>{actionItem.details || "-"}</td>
                      <td>{actionItem.status}</td>
                      <td>{actionItem.category || "-"}</td>
                      <td>{actionItem.raised_by || "-"}</td>
                      <td>{actionItem.assigned_to || "-"}</td>
                      <td>
                        {actionItem.created_date &&
                          formatDate(new Date(actionItem?.created_date))}
                      </td>
                      <td>
                        {(actionItem.target_closure_date &&
                          formatDate(
                            new Date(actionItem?.target_closure_date)
                          )) ||
                          "-"}
                      </td>
                      <td>
                        {(actionItem.actual_closed_date &&
                          formatDate(
                            new Date(actionItem?.actual_closed_date)
                          )) ||
                          "-"}
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
              <h1 className="fs-1">No Action Items</h1>
            </marquee>
          </div>
        </div>
      )}
      {showModal && (
        <AddActionItems
          showModal={showModal}
          setShowModal={setShowModal}
          closeModal={closeModal}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          editActionItem={editActionItem}
          closedActionItems={closedActionItems}
          setClosedActionItems={setClosedActionItems}
        />
      )}
      {showEditHistory && (
        <RiskEditHistory
          showEditHistory={showEditHistory}
          setShowEditHistory={setShowEditHistory}
          logId={logId}
          setLogId={setLogId}
          logType={"action_items"}
        />
      )}
    </div>
  );
}

export default ActionItems;
