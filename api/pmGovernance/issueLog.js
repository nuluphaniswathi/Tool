import getAxiosInstance from "..";
let user = JSON.parse(localStorage.getItem("user"));

export const fetchFilteredIssueLogs = async (gdo, projects, status) => {
    const axios = getAxiosInstance();
    const queryParams = new URLSearchParams({
        ...(status && {statuses:status}),
        ...(projects && projects.length > 0 && {project_ids:projects}),
        ...(user?.role === "workspace_admin" && gdo.length > 0 && {gdo_name:gdo.join(",")}),
      }).toString();
    return axios({
        method: "GET",
        url: `/issues${queryParams ? `?${queryParams}` : ""}`
    });
}

export const downloadIssueLogsReport = async (selectedGDO, selectedProjects, selectedStatus) => {
    const axios = getAxiosInstance();
    const params = new URLSearchParams();
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
        url: `/issues/download_issues`,
        params: params,
        responseType: "blob",
    });
}