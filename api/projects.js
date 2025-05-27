import getAxiosInstance from ".";

export const getProjectDetails = async (projectId) => {
  let params = new URLSearchParams();
  const axios = getAxiosInstance();

  return axios({
    method: "GET",
    url: `/projects/${projectId}`,
    params,
  });
};

export const fetchProjects = () => {
  const axios = getAxiosInstance();

  return axios({
    method: "GET",
    url: `/projects`
  });
}

export const fetchAllProjects = (params={}) => {
  const axios = getAxiosInstance();
  const queryString = Object.keys(params).length > 0 ? `?${new URLSearchParams(params).toString()}` : "";

  return axios({
    method: "GET",
    url: `/projects/show_all_projects${queryString}`
  });
}

export const fetch_D_Details = () => {
  const axios = getAxiosInstance();

  return axios({
    method: "GET",
    url: `/projects/fetch_d`,
  });
};

