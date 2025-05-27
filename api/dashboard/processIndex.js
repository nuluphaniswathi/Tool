import getAxiosInstance from "../";

export const fetchPIDashboardPercentages = async (selectedGdo, allGdoDetails, role, selectedDFilter) => {
    const axios = getAxiosInstance();
    const params = {
        ...((role === "workspace_admin" || role === "delivery_manager") && selectedGdo.length > 0 && { gdo_name: selectedGdo.join(",") }), 
        ...(selectedDFilter?.length > 0  && { d: selectedDFilter.join(",") })
    };
    return axios({
        method: "GET",
        url: "/users/projects_with_process_index_percentage",
        params
    });
};