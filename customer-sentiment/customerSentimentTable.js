import { useState, useEffect } from "react";
import { fetchFromAndToDates } from "../../common/utils/dateFilterHandler";
import {
  fetchCustomerSentimentFilteredData,
  createCustomerSentiment,
  updateCustomerSentiment,
} from "../../api/customerSentiment/customer-sentiment-apis";
import { NotificationManager } from "react-notifications";
import generateDatesArray from "../../common/utils/dateFilterHandler";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import { Loader } from "../../common/components/loader/Loader";
import { format } from "date-fns";
import { primary_color, orange, darkGreen, primary_color_hover, orangered } from "../../common/constants/constant";
import "./customer-sentiment.css";
import CSConfirmationPopup from "../customer-sentiment/cs-confirmation-popup";
import CustomerSentimentHeader from "./CustomerSentimentHeader";
import useInitializeFilters from "../../common/hooks/useDFilters";
import downloadFile from "../../common/utils/downloadFile";
import CustomerSentimentUI from "./CustomerSentimentUI";
import {downloadCSReport} from "../../api/customerSentiment/customer-sentiment-apis";
import {formatDateString} from "../../common/utils/dateFilterHandler";

const CustomerSentimentTable = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const defaultD = user?.role === "delivery_manager" ? [user.d] : [];
  const {gdoFilters, setGDOFilters, initializeFilters} = useInitializeFilters(defaultD);
  const [projectData, setProjectData] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [datesArray, setDatesArray] = useState([]);
  const [selectedDate, setSelectedDate] = useState({ value: "this-week", label: "This Week" });
  const [isConfirmationPopup, setIsConfirmationPopup] = useState(false);
  const [selectedSentiment, setSelectedSentiment] = useState(null);
  const [showReset,setShowReset] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedDFilter, setSelectedDFilter] = useState(defaultD);
  const [selectedGDO, setSelectedGDO] = useState([]);

  const getRoleKey = () => {
    switch (user?.role) {
      case "delivery_manager":
        return "customer_sentiment";
      case "gdo_manager":
        return "gdo_approval";
      default:
        return "pm_approval";
    }
  };
  const handleThumbClick = async(matchingMetric,roleKey,date, projectId, newStatus, id) => {
    if(matchingMetric?.[roleKey]=== newStatus) {
      NotificationManager.info("You have already given this response.");
      return;
    }
    if(matchingMetric?.id && matchingMetric?.[roleKey] !== null){
      setSelectedSentiment({ date, projectId, status:newStatus, id });
      setIsConfirmationPopup(true);
    }else {
      handleSentimentUpdate(date, projectId, newStatus, id);
    }
  }
  const handleConfirmUpdate = () => {
    if(selectedSentiment){
      handleSentimentUpdate(selectedSentiment.date, selectedSentiment.projectId, selectedSentiment.status, selectedSentiment.id);
      setIsConfirmationPopup(false);
    }
  }
  const handleCancelUpdate = () => {
    setIsConfirmationPopup(false);
  };

  const handleSentimentUpdate = async (date, projectId, status, id = null) => {
    const body = new URLSearchParams();
    const roleKey = getRoleKey();
    if(!id){
      body.append("customer_sentiment[date]", date);
      body.append("customer_sentiment[project_id]", projectId);
    }
    body.append(`customer_sentiment[${roleKey}]`, status);
    try {
      const res = id ? await updateCustomerSentiment(id, body) : await createCustomerSentiment(body);
      NotificationManager.success("Updated successfully");
      const formattedResponseDate = format(new Date(res.data.date), "dd-MMM-yyyy");
      setProjectData((prev) =>
        prev.map((project) =>
          project.id === projectId
            ? {
                ...project,
                customer_sentiments: project.customer_sentiments.map((sentiment) =>
                   sentiment.date === formattedResponseDate
                    ? { ...sentiment, id: res.data.id, [roleKey]: status, overall_sentiment: res.data.overall_sentiment }
                    : sentiment
                ),
              }
            : project
        )
      );
    } catch (error) {
      NotificationManager.error(error?.response?.data?.error || "Oops! Something went wrong, please try again!");
    }
  };

  const fetchFilteredData = async (date = selectedDate, gdo = selectedGDO, projects = selectedProjects, d = selectedDFilter) => {
    setShowLoading(true);
    const { from_date, to_date } = fetchFromAndToDates(date);

    try {
      const res = await fetchCustomerSentimentFilteredData(from_date, to_date, projects, gdo, d);
      setProjectData(res.data.projects);

      const allDates = res?.data?.projects?.flatMap((project) => project.customer_sentiments?.map((m) => m.date)) || [];
      let uniqueDates = [...new Set(allDates)].sort((a, b) => new Date(b) - new Date(a));
      setDatesArray(uniqueDates);

      setTimeout(() => setShowLoading(false), 2000);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      setShowLoading(false);
    }
  };
  const resetData = async () => {
    setSelectedDate({ value: "this-week", label: "This Week" });
    setSelectedProjects([]);
    setShowReset(false);
    setSelectedGDO([]);
    setSelectedDFilter(defaultD);
    await initializeFilters(defaultD);
    fetchFilteredData({ value: "this-week", label: "This Week" },[],[]);
};
const downloadReport = async () => {
  const { from_date, to_date } = fetchFromAndToDates(selectedDate);
  try {
    const response = await downloadCSReport(from_date, to_date, selectedDFilter, selectedGDO, selectedProjects);
    await downloadFile({
      data: response.data,
      defaultFileName: "Customer Sentiment",
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      extension: "xlsx",
    });
  } catch (error) {
    NotificationManager.error("OOps!Something went wrong while downloading");
    console.error(error);
  }
};

  useEffect(() => {
    fetchFilteredData();
  }, []);
  

  return (
    <div>
    <h3 className="fs-1 text-center">Customer Sentiment</h3>
    <CustomerSentimentHeader 
    gdoFilters={gdoFilters} setGDOFilters={setGDOFilters}
    selectedDate={selectedDate} setSelectedDate={setSelectedDate}
    showReset={showReset} setShowReset={setShowReset}
    selectedProjects = {selectedProjects} setSelectedProjects = {setSelectedProjects}
    selectedDFilter={selectedDFilter} setSelectedDFilter={setSelectedDFilter}
    selectedGDO = {selectedGDO} setSelectedGDO={setSelectedGDO}
    resetData = {resetData}
    fetchFilteredData = {fetchFilteredData}
    downloadReport={downloadReport}
    />
      {showLoading ? (
        <Loader />
      ) : projectData.length > 0 ? (
        <>
          <div className="table-container scrollable-table table-responsive pe-2">
            <table className="table border-black fw-medium table-bordered">
              <thead className="table-primary fixed-header">
                <tr>
                  <th className="freeze-column">Project Name</th>
                  <th className="freeze-column">PM/TM</th>
                  <th className="freeze-column">Program Manager</th>
                  <th className="freeze-column">PCC Head</th>
                  {datesArray.map((date, index) => (
                    <th key={index} className="date-column" style={{ width: `${100 / datesArray.length}%` }}>
                      {date}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projectData.map((project) => (
                  <tr key={project.id}>
                    <td className="text-capitalize freeze-column">{project.title}</td>
                    <td className="text-capitalize freeze-column">{project.project_manager}</td>
                    <td className="text-capitalize freeze-column">{project.gdo_manager}</td>
                    <td className="text-capitalize freeze-column">{project.practice_head}</td>
                    {datesArray.map((date) => {
                      const matchingMetric = project.customer_sentiments?.find((metric) => metric.date === date);
                      const roleKey = getRoleKey();
                      const metricDate = matchingMetric?.date || null;
                      const todayDate = formatDateString(new Date());
                      const isToday = todayDate === metricDate;

                      return (
                        <td
                          key={date}
                          className="cell-data"
                          style={{
                            backgroundColor: matchingMetric?.overall_sentiment ? darkGreen : matchingMetric?.overall_sentiment === false ? orange :  matchingMetric?.overall_sentiment == null && matchingMetric?.color === "red" &&  !isToday
                            ? orangered
                            : "white",
                            height: "100%",
                            // width: "100%",
                            width: `${100 / datesArray.length}%`,
                            boxSizing: "border-box",
                          }}
                        >
                        {user?.role === "workspace_admin" ? (
                          <CustomerSentimentUI  matchingMetric = {matchingMetric}/>
                        ):(
                          <div className="project-metric d-flex justify-content-center align-items-center">
                            {(matchingMetric?.overall_sentiment === null || (matchingMetric?.id && isToday) )&& (
                              <>
                                <button
                                  className={`btn btn-sm btn-thumsup m-2 ms-0 mt-3 ${matchingMetric?.[roleKey] === true ? `btn-dark` : ""}`}
                                  style={{ width: "15%",  color: matchingMetric?.[roleKey] === true ? "white" : primary_color, backgroundColor: matchingMetric?.[roleKey] === true && primary_color_hover }}
                                  onClick={() => handleThumbClick(matchingMetric, roleKey, date, project.id, true, matchingMetric?.id)
                                  }
                                >
                                <FaRegThumbsUp/>                                
                              </button>
                                <button
                                  className={`btn btn-sm btn-thumsdown m-2 ms-0 mt-3 ${matchingMetric?.[roleKey] === false? "btn-dark" : ""}`}
                                  style={{ width: "15%", color:matchingMetric?.[roleKey] === false? "white" :  primary_color,backgroundColor: matchingMetric?.[roleKey] === false && primary_color_hover}} 
                                  onClick={() => handleThumbClick(matchingMetric, roleKey, date, project.id, false, matchingMetric?.id)
                                  }
                                >
                                  <FaRegThumbsDown />
                                </button>
                              </>
                            )}
                          </div>
                        )
                        }
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (<h4>No Projects</h4>)}
      {isConfirmationPopup && (
      <CSConfirmationPopup
        isConfirmationPopup={isConfirmationPopup}
        handleConfirmUpdate={handleConfirmUpdate}
        handleCancelUpdate={handleCancelUpdate}
      />
    )}
    </div>
  );
};

export default CustomerSentimentTable;
