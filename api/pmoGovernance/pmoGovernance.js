import getAxiosInstance from "../";
export const addPMORecord = async (data) => {
    const axios = getAxiosInstance();
  
    return axios({
      method: "POST",
      url: "/pmo_governances",
      data,
    });
  };

export const editPMORecord = async (data, recordId) => {
    const axios = getAxiosInstance();
  
    return axios({
      method: "PUT",
      url: `/pmo_governances/${recordId}`,
      data,
    });
};

export const clonePMORecord = async (cloneStatus, projectId, date) => {
  const axios = getAxiosInstance();
  let payload = {
    pmo_governance: {
      project_id: projectId,
      date: date,
    },
  };

  return axios({
    method: "POST",
    url: "/pmo_governances",
    params: {clone:cloneStatus},
    data: payload
  });
};

export const bulkClone = async (date) => {
  const axios = getAxiosInstance();
  let payload = {
    pmo_governance: {
      date: date,
    },
  };
  return axios({
    method: "POST",
    url: "/pmo_governances/bulk_clone",
    data: payload
  });
};

export const deletePMORecord = async (pmoId) => {
  const axios = getAxiosInstance();
  return axios({
    method: "DELETE",
    url: `/pmo_governances/${pmoId}`
  })
}

export const fetchProjectAccounts = async () => {
  const axios = getAxiosInstance();
  return axios({
    method: "GET",
    url: `/projects/project_accounts`
  })
}

export const fetchPMOGovernanceFilteredData = async (from_date, to_date, projects, status, pccHeads) => {
  let params = new URLSearchParams();
  const axios = getAxiosInstance();
  if(from_date) {
      params.append("from_date",from_date)
  }
  if(to_date) {
      params.append("to_date",to_date);
  }
  if(projects.length > 0) {
      params.append("project_ids",projects);
  }
  if(status.length > 0) {
      params.append("status",status);
  }
    if(pccHeads?.length > 0) {
      params.append("pcc_heads",pccHeads);
  }

  return axios({
      method: "GET",
      url: "/pmo_governances/filter",
      params
  });
};

export const downloadPMOGovernanceFilteredData = async (from_date, to_date, projects, status, pccHeads) => {
  let params = new URLSearchParams();
  const axios = getAxiosInstance();
  if(from_date) {
      params.append("from_date",from_date)
  }
  if(to_date) {
      params.append("to_date",to_date);
  }
  if(projects?.length > 0) {
      params.append("project_ids",projects);
  }
  if(status?.length > 0) {
      params.append("status",status);
  }
  if(pccHeads?.length > 0) {
      params.append("pcc_heads",pccHeads);
  }
  return axios({
      method: "GET",
      url: "/pmo_governances/download_pmo_governance",
      params,
      responseType: "blob",
  });
};