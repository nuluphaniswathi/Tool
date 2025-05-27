import axios from "axios";
import { clearLocalStorage } from "../common/utils/clearLocalStorage";

const getAxiosInstance = (token) => {
    const instance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
        headers: {
            "x-api-token": token ? token : localStorage.getItem("api_token"),
        },
    });

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response.status === 403) {
                clearLocalStorage();
                window.location.reload();
            }
            throw error;
        }
    );

    return instance;
};

export default getAxiosInstance;
