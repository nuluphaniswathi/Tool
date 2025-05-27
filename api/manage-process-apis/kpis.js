import getAxiosInstance from "../";

export const getKpisData = async () => {
    const axios = getAxiosInstance();

    return axios({
      method: "GET",
      url: "/kpis",
    });
};

export const addKpi = async (data) => {
    const axios = getAxiosInstance();

    return axios({
      method: "POST",
      url: "/kpis",
      data
    });
};

export const editKpis = async (data, kpiId) => {
    const axios = getAxiosInstance();

    return axios({
      method: "PUT",
      url: `/kpis/${kpiId}`,
      data
    });
};