import { useState, useCallback, useEffect } from "react";
import { fetch_D_Details } from "../../api/projects";
import { fetchGDOs } from "../../api/dashBoard";
const useInitializeFilters = (defaultD) => {
  const [dDetails, setDDetails] = useState([]);
  const [gdoFilters, setGDOFilters] = useState([]);
  const [manageProjectGDOFilter, setManageProjectGDOFilter] = useState([]);

  const initializeFilters = useCallback(async (selectedDFilter = defaultD) => {
  
    try {
      if(dDetails.length===0){
        const dResponse = await fetch_D_Details();
        const dData = dResponse?.data?.d?.map((d) => ({
          label: d === "D1" ? "HFP" : d === "D2" ? "CMM" : d,
          value: d,
      }));
      setDDetails(dData);
      }
      const gdoResponse = await fetchGDOs(selectedDFilter);
      const gdoOptions = gdoResponse?.data?.gdos?.map((gdo) => ({
        label: [gdo.gdo_name, gdo.gdo_manager].join("- "),
        value: gdo.gdo_name.split(" ").join("_"),
      }));
      const projGdoOptions = gdoResponse?.data?.gdos?.map((gdo)=>({
        label: [gdo.gdo_name, gdo.gdo_manager].join("- "),
        value: gdo.id,
      }));
      setGDOFilters(gdoOptions);
      setManageProjectGDOFilter(projGdoOptions);
    } catch (error) {
      console.error("Error initializing filters:", error);
    }
  }, []);
  useEffect(()=>{
    initializeFilters(defaultD);
  },[initializeFilters])

  return { dDetails, gdoFilters,setGDOFilters, initializeFilters, manageProjectGDOFilter };
};

export default useInitializeFilters;
