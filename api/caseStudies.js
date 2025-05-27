import getAxiosInstance from "./";

export const getCaseStudiesData = async () => {
  const axios = getAxiosInstance();

  return axios({
    method: "GET",
    url: "/case_studies",
  });
};

export const addCaseStudyData = async (data) => {
  const axios = getAxiosInstance();

  return axios({
    method: "POST",
    url: "/case_studies",
    data,
  });
};
export const editCaseStudyData = async (data, caseId) => {
  const axios = getAxiosInstance();

  return axios({
    method: "PUT",
    url: `/case_studies/${caseId}`,
    data,
  });
};

export const getCaseStudiesListData = async () => {
  const axios = getAxiosInstance();

  return axios({
    method: "GET",
    url: "/case_studies/projects_with_case_study",
  });
};

export const fetchProjectDetail = async (projectId) => {
  const axios = getAxiosInstance();

  return axios({
    method: "GET",
    url: "/case_studies",
    params: { project_id: projectId },
  });
};
