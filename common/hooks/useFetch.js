import { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";

function useFetchData(apiFunction) {
    const [fetchedData, setFetchedData] = useState(null);
    const [refreshData, setRefreshData] = useState(true);
    async function getData() {
        try {
            const responseData = await apiFunction();
            setFetchedData(responseData.data);
            setRefreshData(false);
        }
        catch (error) {
            NotificationManager.error("Oops! cannot fetch data, please try again");
            setFetchedData([]);
        }
    }

    useEffect(() => {
        if (refreshData) {
            getData();
        }
    }, [refreshData])

    return {
        fetchedData,
        setRefreshData
    }
}

export default useFetchData;