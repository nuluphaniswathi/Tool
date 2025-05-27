import getAxiosInstance from "..";
let user = JSON.parse(localStorage.getItem("user"));
export const fetchPMGovernanceFilteredData = async (from_date, to_date, projects, gdo) => {
    let params = new URLSearchParams();
    const axios = getAxiosInstance();
    if(from_date) {
        params.append("from_date",from_date)
    }
    if(to_date) {
        params.append("to_date",to_date);
    }
    if(projects.length > 0) {
        params.append("project_ids",projects);
    }
    if (gdo.length > 0) {
        params.append("gdo_name",gdo.join(","));
    }
   
    return axios({
        method: "GET",
        url: "/project_metrics/filter",
        params
    });
};

export const downloadReport = async (gdo, projects, from_date, to_date) => {
    const axios = getAxiosInstance();
    let params = new URLSearchParams();

    if (gdo?.length > 0) {
        params.append("gdo_name", gdo.join(","));
    }
    if(projects?.length > 0) {
        params.append("project_id", projects);
    }
    if(from_date){
        params.append("from_date",from_date);
    }
    if(to_date){
        params.append("to_date",to_date);
    }
    
    return axios({
        method: "GET",
        url: "/project_metrics/download_gdo_report",
        params,
        responseType: "blob",
    });
}

export const cloneProjectGovernanceRecord = async (projectId, date, cloneStatus) => {
  const axios = getAxiosInstance();
  let payload = {
    project_metric: {
      project_id: projectId,
      date: date,
    },
  };
  return axios({
    method: "POST",
    url: `/project_metrics?clone=${cloneStatus}`,
    data: payload,
  });
};