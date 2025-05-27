import { useEffect, useState } from "react";
import {fetchGDOs} from "../../api/dashBoard"

function useGDOFilters () {
    const [gdoFilters, setGDOFilters] = useState([]);
    const [resetGdoFilters, setResetGdoFilters] = useState([]);
    const fetchGDOFilters = async () => {
        try {
            const response = await fetchGDOs();
            const gdoOptions = response?.data?.gdos?.map((gdo)=>({
               label: [gdo.gdo_name,gdo.gdo_manager].join("- "),
               value: gdo.gdo_name.split(" ").join("_"),
            }))
            setGDOFilters(gdoOptions);
            setResetGdoFilters(gdoOptions);
        }catch(error) {
            console.log("Error fetching GDO Details");
            setGDOFilters([]);
            setResetGdoFilters([]);
        }
    }
    useEffect(() => {
        fetchGDOFilters() ;
    },[]);

    return {
        gdoFilters,
        resetGdoFilters,
        setGDOFilters
    }
}
export default useGDOFilters;