import getAxiosInstance from "../";

export const getPracticesData = async () => {
    let params = new URLSearchParams();
    const axios = getAxiosInstance();

    return axios({
        method: "GET",
        url: "/best_practices",
    });
};

export const addPractice = async (data) => {
    let params = new URLSearchParams();
    const axios = getAxiosInstance();

    return axios({
        method: "POST",
        url: "/best_practices",
        data
    });
};

export const editPractice = async (data, practiceId) => {
    let params = new URLSearchParams();
    const axios = getAxiosInstance();

    return axios({
        method: "PUT",
        url: `/best_practices/${practiceId}`,
        data
    });
};