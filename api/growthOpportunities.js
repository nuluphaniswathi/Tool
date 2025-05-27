import getAxiosInstance from "./";

export const fetchGrowthOpportunities = (projectId, project_ids, practices) => {
    const axios = getAxiosInstance();

    return axios({
      method: "GET",
      url: "/growth_opportunities",
      params: {  "project_ids": projectId ? [projectId, ...project_ids] : project_ids || [] , "practices": practices || []},
    });
}

export const addGrowthOppurtunities = (data) => {
    const axios = getAxiosInstance();

    return axios({
        method: "POST",
        url: "/growth_opportunities",
        data,
    });
};

export const editGrowthOppurtunities = (data, opportunityId) => {
    const axios = getAxiosInstance();

    return axios({
        method: "PUT",
        url: `/growth_opportunities/${opportunityId}`,
        data,
    });
};

export const fetchPracticesList = () => {
    const axios = getAxiosInstance();

    return axios({
        method: "GET",
        url: "/projects/practices",
    });
};


export const fetchProjectAccountDetails = (selectedPractice) => {
    let params = new URLSearchParams();
    const axios = getAxiosInstance();

    if (selectedPractice) params.append('practice', selectedPractice);

    return axios({
        method: "GET",
        url: "/projects",
        params
    });
}

export const fetchEditProjectAccountDetails = (accountId) => {
    const axios = getAxiosInstance();

    return axios({
        method: "GET",
        url: `/growth_opportunities/${accountId}`,
    });
}

export const removeGrowthOppurtunities = ( opportunityId) => {
    const axios = getAxiosInstance();

    return axios({
        method: "DELETE",
        url: `/growth_opportunities/${opportunityId}`,
    });
};