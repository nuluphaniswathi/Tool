import getAxiosInstance from "../";

export const getTemplateData = async () => {
  let params = new URLSearchParams();
  const axios = getAxiosInstance();

  return axios({
    method: "GET",
    url: "/templates",
  });
};

export const addTemplate = async (data) => {
  let params = new URLSearchParams();
  const axios = getAxiosInstance();

  return axios({
    method: "POST",
    url: "/templates",
    data
  });
};

export const editTemplate = async (data, templateId) => {
  let params = new URLSearchParams();
  const axios = getAxiosInstance();

  return axios({
    method: "PUT",
    url: `/templates/${templateId}`,
    data
  });
};