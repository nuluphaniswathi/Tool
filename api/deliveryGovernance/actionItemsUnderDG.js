import getAxiosInstance from "..";
let user = JSON.parse(localStorage.getItem("user"));

export const fetchFilteredActionItemsUnderDG = async (gdo, projects, status, category) => {
    const axios = getAxiosInstance();
    const queryParams = new URLSearchParams({
        ...{governance_type:"delivery"},
        ...(status && {statuses:status}),
        ...(projects && projects.length > 0 && {project_ids:projects}),
        ...(user?.role === "workspace_admin" && gdo.length > 0 && {gdo_name:gdo.join(",")}),
        ...(category && { category:category})
      }).toString();
    return axios({
        method: "GET",
        url: `/action_items${queryParams ? `?${queryParams}` : ""}`
    });
}

export const downloadActionItemsReportUnderDG = async (selectedGDO, selectedProjects, selectedStatus) => {
    const axios = getAxiosInstance();
    const params = new URLSearchParams();
    params.append("governance_type","delivery");
    if (selectedGDO.length > 0) {
        params.append("gdo_name", selectedGDO.join(","));
    }
    if (selectedProjects.length > 0) {
        params.append("project_ids", selectedProjects.join(","));
    }
    if (selectedStatus && selectedStatus.trim() !== "") {
        params.append("statuses", selectedStatus);
    }
    return axios({
        method: "GET",
        url: `/action_items/download_action_items`,
        params: params,
        responseType: "blob",
    });
}