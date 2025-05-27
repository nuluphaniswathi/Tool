import { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import {fetchProjects} from "../../api/projects";
function useFetchFormattedProjects() {
    const [formattedProjectData, setFormattedProjectData] = useState([]);
    const [refreshData, setRefreshData] = useState(true);
    async function getData() {
        try {
            const responseData = await fetchProjects();
            const formattedProjects = responseData.data.projects.map((project) => ({
                label: project.title,
                value: project.id,
              }))
            setFormattedProjectData(formattedProjects);
            setRefreshData(false);
        }
        catch (error) {
            NotificationManager.error("Oops! cannot fetch data, please try again");
            setFormattedProjectData([]);
        }
    }

    useEffect(() => {
        if (refreshData) {
            getData();
        }
    }, [refreshData])

    return {
        formattedProjectData,
        setRefreshData
    }
}

export default useFetchFormattedProjects;