import getAxiosInstance from "./";
export const addFocusAreaData = async (data) => {
    const axios = getAxiosInstance();
  
    return axios({
      method: "POST",
      url: "/focus_areas",
      data,
    });
  };

export const editFocusAreaData = async (data, recordId) => {
    const axios = getAxiosInstance();
  
    return axios({
      method: "PUT",
      url: `/focus_areas/${recordId}`,
      data,
    });
  };

 export const fetchFocusAreaDetails = async (queryParams) => {
    const axios = getAxiosInstance();
  
    return axios({
      method: "GET",
      url: "/focus_areas/filter",
      params: queryParams,
    });
  };

  export const cloneFocusAreaDetails = async (cloneStatus, payload) => {
    const axios = getAxiosInstance();
  
    return axios({
      method: "POST",
      url: "/focus_areas",
      params: {clone:cloneStatus},
      data: payload
    });
  };

export const deleteFocusAreaDetails = async (focusId) =>{
  const axios = getAxiosInstance();
  return axios({
    method: "DELETE",
    url: `/focus_areas/${focusId}`
  })
}



