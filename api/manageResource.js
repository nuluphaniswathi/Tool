import getAxiosInstance from "./";

export const fetchCategories = () => {
    const axios = getAxiosInstance();
    
    return axios({
        method: "GET",
        url: "/resources/categories"
    });
}

export const importResources = (data) => {
    const axios = getAxiosInstance();
    
    return axios({
        method: "POST",
        url: "/resources/import_resources",
        data: data,
    });
}

export const deleteResource = (id) => {
    const axios = getAxiosInstance();
    
    return axios({
        method: "DELETE",
        url: `/resources/${id}`,
    });
}

export const fetchResourceData = (rms, proj, pms, gdo, name, deactivated, page, role) => {
    const axios = getAxiosInstance();
    const queryParams = new URLSearchParams({
        ...(page && {page:page}),
        ...(rms.length > 0 && {user_ids:rms.join(",")}),
        ...(proj.length > 0 && {project_ids:proj.join(",")}),
        ...(pms.length > 0 && {manager_ids:pms.join(",")}),
        ...(deactivated && {deactivated:true}),
        ...(role === "workspace_admin" && gdo && {gdo_id:gdo}),
        ...(name && {search:name } )
      }).toString();

    return axios({
        method:"GET",
        url:`/resources${queryParams ? `?${queryParams}` : ""}`
    });
}


export const fetchPMs = () => {
    const axios = getAxiosInstance();
    return axios({
        method:"GET",
        url:"/projects/project_managers"
    });
}

export const fetchResourceTrackingDetails = (id) => {
    const axios = getAxiosInstance();
    let params = new URLSearchParams();
    if (id) {
        params.append("resource_id",id);
    }
    return axios({
        method:"GET",
        url:"/resource_trackings",
        params
    });
}

export const fetchRMS = () => {
    const axios = getAxiosInstance();
    return axios({
        method:"GET",
        url:"/users/reporting_managers",
    });
}

export const fetchEditHistory = (logType, logId) => {
    const axios = getAxiosInstance();
    return axios({
        method:"GET",
        url:`${logType}/${logId}/versions`,
    });
}