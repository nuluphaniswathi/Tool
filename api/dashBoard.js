import getAxiosInstance from "./";

export const fetchGraphData = (gdoName, selectedDFilter) => {
    let params = new URLSearchParams();
    const axios = getAxiosInstance();

    if (gdoName && gdoName.length > 0) params.append('gdo_name', gdoName);
    if (selectedDFilter && selectedDFilter.length > 0){
        params.append('d',selectedDFilter)
    }
    
    return axios({
        method: "GET",
        url: "/users/dashboard",
        params
    });
}

export const fetchFireSectionDetails = (gdoName, selectedDFilter) => {
    let params = new URLSearchParams();
    const axios = getAxiosInstance();

    if (gdoName && gdoName.length > 0) params.append('gdo_name', gdoName.join(","));
    if (selectedDFilter && selectedDFilter.length) params.append('d', selectedDFilter.join(","));

    return axios({
        method: "GET",
        url: "/users/dashboard_projects_under_fire",
        params
    });
};

export const fetchTotalManagersSectionDetails = (gdoName, selectedDFilter) => {
    let params = new URLSearchParams();
    const axios = getAxiosInstance();

    if (gdoName && gdoName.length > 0) params.append('gdo_name', gdoName.join(","));
    if (selectedDFilter && selectedDFilter.length) params.append('d', selectedDFilter.join(","));


    return axios({
        method: "GET",
        url: "/users/dashboard_total_managers",
        params
    });
};

export const fetchGDOs = (selectedDFilter) => {
    let params = new URLSearchParams();
    const axios = getAxiosInstance();
    
    if (selectedDFilter && selectedDFilter.length) params.append('d', selectedDFilter.join(","));

    return axios({
        method: "GET",
        url: "/gdos",
        params
    });

}