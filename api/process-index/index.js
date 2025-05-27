import getAxiosInstance from "../";

export const fetchProcessIndexData = async (projectId) => {
  let params = new URLSearchParams();
  const axios = getAxiosInstance();

  if (projectId) params.append("project_id", projectId)
  return axios({
    method: "GET",
    url: "/process_indices",
    params
  });
};

export const fetchMonths = () => {
  const axios = getAxiosInstance();
  return axios({
    method: "GET",
    url: "/process_indices/months",
  });  
}

export const updateMultipleProcessIndex= (data) => {
  const axios = getAxiosInstance();
  return axios({
    method: "PUT",
    url: `/process_indices/update_multiple_process_index`,
    data
  });
}

export const downLoadProcessIndex = (projectId) => {
  const axios = getAxiosInstance();
  let params = new URLSearchParams();
  if (projectId) params.append("project_id", projectId)
  return axios({
    method: "GET",
    url: `/process_indices/download_process_index`,
    params,
    responseType: "blob"
  });

}