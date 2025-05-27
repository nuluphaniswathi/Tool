import getAxiosInstance from "../";
export const fetchCustomerSentimentFilteredData = async (from_date, to_date, projects, gdo, d) => {
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
    if(d.length > 0) {
        params.append("d", d);
    }
    if (gdo.length > 0) {
        params.append("gdo_name",gdo);
    }
    return axios({
        method: "GET",
        url: "/customer_sentiments/filter",
        params
    });
};
export const createCustomerSentiment = async (payload) => {
    const axios = getAxiosInstance();
    return axios({
        method: "POST",
        url: "/customer_sentiments",
        data: payload
    });
}
export const updateCustomerSentiment = async (id, payload) => {
    const axios = getAxiosInstance();
    return axios({
        method: "PUT",
        url: `/customer_sentiments/${id}`,
        data: payload
    });
}

export const downloadCSReport = async (from_date, to_date, d, selectedGDO, selectedProjects) => {
    const axios = getAxiosInstance();
    const params = new URLSearchParams();
    if(from_date) {
        params.append("from_date",from_date)
    }
    if(to_date) {
        params.append("to_date",to_date);
    }
    if(d.length > 0) {
        params.append("d", d);
    }
    if (selectedGDO.length > 0) {
        params.append("gdo_name", selectedGDO.join(","));
    }
    if (selectedProjects.length > 0) {
        params.append("project_ids", selectedProjects.join(","));
    }
   
    return axios({
        method: "GET",
        url: `/customer_sentiments/download_customer_sentiments`,
        params: params,
        responseType: "blob",
    });
}