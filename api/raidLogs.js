import getAxiosInstance from "./";

export const fetchRaidLogs = (status, projects, priority, gdoName, selectedDFilter, totalRisks, isDashboardRiskTotal, isProjectUnderfireSection, riskType ,flag = false) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    let params = new URLSearchParams();
    const axios = getAxiosInstance();
    let apiUrl;

    if(isDashboardRiskTotal){
        apiUrl = "/raid_logs/dashboard_total_risks";
    }
    else if(isProjectUnderfireSection){
        apiUrl = "/users/projects_under_fire_risks";
    }
    else{
        apiUrl = flag ? "/raid_logs?governance_type=delivery" : "/raid_logs";
    }

    if (status.length) params.append('statuses', status);
    if (projects.length) params.append('project_ids', projects);
    if (priority.length) params.append('risk_priority', priority);
    if (gdoName && (userData?.role === "workspace_admin" || userData?.role === "delivery_manager")) params.append('gdo_name', gdoName);
    if (totalRisks) params.append('high_risk', true);
    if (riskType) params.append('risk_status', riskType);
    if (selectedDFilter) params.append('d',selectedDFilter);

    return axios({
        method: "GET",
        url: apiUrl,
        params
    });
};

export const fetchRaidLogsById = (riskId) => {
    const axios = getAxiosInstance();

    return axios({
        method: "GET",
        url: `/raid_logs/${riskId}`
    });
};

export const downloadRaidLogsReport = async (selectedGDO, selectedProjects, selectedStatus, selectedPriority) => {
    const axios = getAxiosInstance();
    const params = new URLSearchParams();

    const userData = JSON.parse(localStorage.getItem("user"));

    if ((userData?.role === "workspace_admin" || userData?.role === "delivery_manager") && selectedGDO.length > 0) {
        params.append("gdo_name", selectedGDO.join(","));
    }
    if (selectedProjects.length > 0) {
        params.append("project_ids", selectedProjects.join(","));
    }
    if (selectedStatus.length > 0) {
        params.append("statuses", selectedStatus);
    }
    if (selectedPriority.length > 0) {
        params.append("risk_priority",selectedPriority);
    }
    return axios({
        method: "GET",
        url: `/raid_logs/download_raid_log`,
        params: params,
        responseType: "blob",
    });
}