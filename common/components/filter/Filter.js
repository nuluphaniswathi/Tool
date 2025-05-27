import React, { useEffect, useState } from "react";
import axios from "axios";
import { gdoFilter } from "../../constants/risk-constants";
import Select from "../select/Select";
import MultiSelectWithCheckbox from "../select/MultiSelectWithCheckbox";

const Filter = ({
  selectedGDO,
  setSelectedGDO,
  selectedProjects,
  setSelectedProjects,
  setShowReset,
  disableMultiSelect= true,
  isDeliveryGovernanceSection,
  setShowLoading
}) => {
  const [projectList, setProjectList] = useState([]);
  const [loadingMsg, setLoadingMsg] = useState(true);
  const api_url = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("api_token");
  const user = JSON.parse(localStorage.getItem("user"));

  const getProjectNames = async () => {
    if(isDeliveryGovernanceSection){
      setShowLoading(true);
    }
    const params =
      user?.role === "workspace_admin" ? { gdo_name: selectedGDO?.value } : {};
    try {
      const projectData = await axios.get(`${api_url}/projects`, {
        headers: {
          "X-API-TOKEN": token,
          "ngrok-skip-browser-warning": "69420",
        },
        params: params,
      });
      const formatProjects = projectData?.data.projects.map((project) => ({
        label: project.title,
        value: project.id,
      }));
      setProjectList(formatProjects);
      setLoadingMsg(false);
      if(isDeliveryGovernanceSection){
        setShowLoading(false);
      }
    } catch {}
  };

  const handleGDOChange = (option) => {
    setSelectedGDO(option);
    setSelectedProjects([]);
    setShowReset(true);
  };

  const handleProjectChange = (options) => {
    setSelectedProjects(options);
    setShowReset(true);
  };

  useEffect(() => {
    getProjectNames();
  }, [selectedGDO]);

  return (
    <div className="d-flex align-items-center">
      <div className="me-2">
        {user?.role === "workspace_admin" && (
          <label>
            <Select
              options={gdoFilter}
              onSelectChange={handleGDOChange}
              selectedValue={selectedGDO}
              placeholder={"Select GDO"}
              isMultiple={false}
              closeMenuOnSelect={true}
            />
          </label>
        )}
      </div>
      <div className="me-2" style={{ height: "38px" }}>
        <label>
          <MultiSelectWithCheckbox
            options={projectList}
            loadingMsg={loadingMsg}
            onSelectChange={handleProjectChange}
            selectedValue={selectedProjects}
            placeholder={"Select Projects"}
            disabled={disableMultiSelect && user?.role === "workspace_admin" && !selectedGDO}
          />
        </label>
      </div>
    </div>
  );
};

export default Filter;
