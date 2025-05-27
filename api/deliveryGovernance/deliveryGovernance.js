import getAxiosInstance from "..";
let user = JSON.parse(localStorage.getItem("user"));
export const fetchDeliveryGovernanceFilteredData = async (from_date, to_date, projects, status, gdo) => {
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
    if(status.length > 0) {
        params.append("status",status);
    }
    if (gdo.length > 0) {
        params.append("gdo_name",gdo.join(","));
    }
    return axios({
        method: "GET",
        url: "/delivery_governances/filter",
        params
    });
};

export const deleteDGRecordById = async (id) => {
    const axios = getAxiosInstance();

    return axios({
        method: "DELETE",
        url: `/delivery_governances/${id}`
    });
}

export const cloneDGRecord = async (projectId, date, cloneStatus) => {
    const axios = getAxiosInstance();
    let payload = {
        delivery_governance: {
          project_id: projectId,
          date: date,
        },
      };
    return axios({
        method: "POST",
        url: `/delivery_governances?clone=${cloneStatus}`,
        data: payload
    });
}

export const downloadReport = async (gdo, projects, from_date, to_date) => {
    const axios = getAxiosInstance();
    let params = new URLSearchParams();

    if (gdo?.length > 0) {
        params.append("gdo_name", gdo.join(","));
    }
    if(projects?.length > 0) {
        params.append("project_id", projects.join(","));
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