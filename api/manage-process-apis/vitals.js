import getAxiosInstance from "../";

export const getVitalsData = async (isMainDashBoard, selectedProjects, gdoName, role, selectedDFilter, gdosCount) => {
    let params = new URLSearchParams();
    const axios = getAxiosInstance();

    if(isMainDashBoard){
        if((role === "workspace_admin" || role === "delivery_manager") && gdoName.length > 0 && gdoName.length !== gdosCount){
            params.append("gdo_name", gdoName.join(","))
        } 
        if(selectedDFilter && selectedDFilter.length) params.append("d", selectedDFilter)
    }
    else{
        if(selectedProjects.length > 0) params.append("project_ids", selectedProjects)
        if(gdoName.length > 0) params.append("gdo_name", gdoName.join(","))
    }

    return axios({
        method: "GET",
        url: "/vitals",
        params
    });
};

export const updateDetails = (data, row, id) => {
    const axios = getAxiosInstance();
    return axios({
        method: "PUT",
        url: `${row}/${id}`,
        data
    });
}