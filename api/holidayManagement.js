import getAxiosInstance from "./";
export const addHolidays = (data) => {
    const axios = getAxiosInstance();
    return axios({
        method: "POST",
        url: "/project_metrics/create_holidays",
        data,
    });
};

export const listingHolidays = () => {
    const axios = getAxiosInstance();
    return axios({
        method: "GET",
        url: "/project_metrics/holidays",
    });
};

export const updateHolidays = (metricId,data) => {
    const axios = getAxiosInstance();
    return axios({
        method: "PUT",
        url: `/project_metrics/${metricId}/update_holiday`,
        data,
    });
};

export const deleteHolidays = (metricId) => {
    const axios = getAxiosInstance();
    return axios({
        method: "DELETE",
        url: `/project_metrics/${metricId}`,
    });
};

export const importHolidays = (data, queryParams) => {
  const axios = getAxiosInstance();
  return axios({
    method: "POST",
    url: `/import_holidays${queryParams}`,
    data: data,
  });
};


