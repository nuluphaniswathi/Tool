import debounce from "lodash.debounce";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import MultiSelectWithCheckbox from "../select/MultiSelectWithCheckbox";
import { fetchGDOs } from "../../../api/dashBoard";
import {fetch_D_Details} from "../../../api/projects";


const MultiSelectGDOFilter = ({
  gdoFilters,
  setGDOFilters,
  selectedGDO,
  setSelectedGDO,
  selectedProjects,
  setSelectedProjects,
  setShowReset,
  disableMultiSelect = false,
  setShowLoading,
  selectedDFilter, 
  setSelectedDFilter,
  isPMOflag = false
}) => {
  const [projectList, setProjectList] = useState([]);
  const [loadingMsg, setLoadingMsg] = useState(true);
  const [D_Details, set_D_Details] = useState([]);
  const api_url = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("api_token");
  const user = JSON.parse(localStorage.getItem("user"));

  const initializeFilters = useCallback(async() => {
    try {
      const dResponse = await fetch_D_Details();
      const d_data = dResponse?.data?.d?.map((d) => ({
          label: d === "D1" ? "HFP" : d === "D2" ? "CMM" : d,
          value: d
        }))
      set_D_Details(d_data);
      const gdoResponse = await fetchGDOs(selectedDFilter);
      const gdoOptions = gdoResponse?.data?.gdos?.map((gdo) => {
        return {
          label: [gdo.gdo_name,gdo.gdo_manager].join("- "),
          value: gdo.gdo_name.split(" ").join("_"),
        }
      })
    setGDOFilters(gdoOptions);
    }catch(error){
      console.error("Error initializing filters:", error);
    }
  },[])

  useEffect(() => {
    initializeFilters();
  },[initializeFilters]);

  const getProjectNames = async () => {
    // setShowLoading(true);
    const params = new URLSearchParams();
    let includeD = false;
    let includeGDO = false;
    if ((user?.role === "workspace_admin" || user?.role === "delivery_manager")) {
      if (Array.isArray(selectedGDO) && selectedGDO.length > 0) {
        params.append("gdo_name", selectedGDO.join(",")); 
        includeGDO = true;
      }
      if (Array.isArray(selectedDFilter) && selectedDFilter.length > 0) {
        params.append("d", selectedDFilter.join(",")); 
        includeD = user.role === "delivery_manager" ? false : true;
      }
    }

    try {
      const baseUrl = isPMOflag ? "/projects/project_accounts" : "/projects";
      const projectData = await axios.get(`${api_url}${baseUrl}`, {
        headers: {
          "X-API-TOKEN": token,
          "ngrok-skip-browser-warning": "69420",
        },
        params: params,
      });
      let formatProjects = [];
      if (!isPMOflag) {
        formatProjects = projectData?.data.projects.map((project) => ({
          label: project.title,
          value: project.id,
        })) || [];
      }else {
        formatProjects = projectData?.data.accounts?.
        filter((account) => account.account_name !== "Veltris" && ![108, 139].includes(account.project_id))
        .map((account) => ({
          label: account.account_name,
          value: account.project_id,
        })) || [];
      }
      setProjectList(formatProjects || []);
      if(includeGDO || includeD){
        setSelectedProjects(formatProjects?.map((proj)=> proj.value));
      }
      setLoadingMsg(false);
      setShowLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGDOChange = (options) => {
    setSelectedGDO(options);
    setSelectedProjects([]);
    setShowReset(true);
  };

  const handleProjectChange = (options) => {
    setSelectedProjects(options);
    setShowReset(true);
  };

  useEffect(() => {
    if (selectedGDO?.length > 0 || selectedGDO || selectedDFilter?.length > 0) {
      getProjectNames();
    } else {
      setProjectList([]); // Clear project list when no GDO is selected
    }
  }, [selectedGDO,selectedDFilter]);

  

  const handleDFilterChange = useCallback(
    debounce(async(options) => {
      setSelectedDFilter(options);
      setShowReset(true);
        try {
          if (options.length === 0) {
          const response = await fetchGDOs();
          const gdoOptions = response?.data?.gdos?.map((gdo) => ({
            label: [gdo.gdo_name,gdo.gdo_manager].join("- "),
            value: gdo.gdo_name.split(" ").join("_"),
          }));
          setGDOFilters(gdoOptions); 
        } 
        else {
          const response = await fetchGDOs(options);
          const gdoOptions = response?.data?.gdos?.map((gdo) => ({
            label: [gdo.gdo_name,gdo.gdo_manager].join("- "),
            value: gdo.gdo_name.split(" ").join("_"),
          }));
          setGDOFilters(gdoOptions);
        }
      } catch (error) {
        console.error("Error fetching GDOs:", error);
      }
    },300),
    [selectedGDO]
  );

  const dFilterOptions = useMemo(() => D_Details, [D_Details]);
  const gdoFilterOptions = useMemo(() => gdoFilters, [gdoFilters]);

  return (
    <div className="d-flex align-items-center">
      <div className="me-2" style={{ height: "38px" }}>
        {(user?.role === "workspace_admin" || user?.role === "delivery_manager") && (
          <>
          <label>
            <MultiSelectWithCheckbox
            options={dFilterOptions}
            hideSelectedOptions={false}
            isClearable={false}
            selectedValue={selectedDFilter}
            onSelectChange={handleDFilterChange}
            placeholder={"Select Delivery Unit(s)"}
            disabled={user?.role === "delivery_manager"}
          />
        </label>
          <label>
            <MultiSelectWithCheckbox
              options={gdoFilterOptions}
              onSelectChange={handleGDOChange}
              selectedValue={selectedGDO}
              placeholder={"Select GDO(s)"}
              type={"gdo"}
            />
          </label>
          </>
        )}
        <label>
          <MultiSelectWithCheckbox
            options={projectList}
            loadingMsg={loadingMsg}
            onSelectChange={handleProjectChange}
            selectedValue={selectedProjects}
            placeholder={isPMOflag ? "Select Account" :"Select Projects"}
            disabled={
              disableMultiSelect &&
              user?.role === "workspace_admin" &&
              !selectedGDO?.length > 0
            }
          />
        </label>
      </div>
    </div>
  );
};

export default MultiSelectGDOFilter;
