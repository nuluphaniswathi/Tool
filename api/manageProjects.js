import getAxiosInstance from "./";

export const deleteExtraFieldDetails = (fieldName) => {
    let params = new URLSearchParams();
    const axios = getAxiosInstance();

    if (fieldName) params.append('key', fieldName);

    return axios({
        method: "DELETE",
        url: "/projects/delete_extra_field",
        params,
    });
};

export const updateExtraFieldDetails = (data, projectId) => {
    const {...newField} = data;
    
    const axios = getAxiosInstance();

    return axios({
        method: "PUT",
        url: `/projects/${projectId}/update_extra_fields`,
        data: newField,
    });
};

export const getPractices = () => {
  const axios = getAxiosInstance();
  return axios({
    method: "GET",
    url: `/projects/practices`,
  });
};

export const getPracticeHeads = () => {
  const axios = getAxiosInstance();
  return axios({
    method: "GET",
    url: `/projects/practice_heads`,
  });
};

export const updateProjectById = (projectId, params, formData) => {
  const axios = getAxiosInstance();
  const queryString = params.toString() ? `?${params.toString()}` : "";

  return axios({
    method: "PUT",
    url: `/projects/${projectId}${queryString}`,
    data: formData
  });
}
export const projectCreation = (params,formData) => {
  const axios = getAxiosInstance();
  const queryString = params.toString() ? `?${params.toString()}` : "";

  return axios({
    method: "POST",
    url: `/projects${queryString}`,
    data: formData
  });
}

export const getProjectTypes = () => {
  const axios = getAxiosInstance();
  return axios({
    method: "GET",
    url: `/projects/types`
  })
}