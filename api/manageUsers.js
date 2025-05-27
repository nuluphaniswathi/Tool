import getAxiosInstance from "./";

export const fetchAllUsers = async () => {
    const axios = getAxiosInstance();
    return axios({
        method: "GET",
        url: `/users`,
      });
}

export const approveUser = async (userId) => {
    const axios = getAxiosInstance();
    return axios({
        method: "PUT",
        url: `/users/${userId}/whitelist_users`,
        data : null
    });
}

export const deleteUserWithId = async (userId) => {
    const axios = getAxiosInstance();
    return axios({
        method: "DELETE",
        url: `/users/${userId}`, 
    });
}

export const userSignin = async (registerObj, params) => {
    const axios = getAxiosInstance();
    return axios({
        method: "POST",
        url : `/users/sign_up`,
        data: { user: registerObj } ,
        params: registerObj.role_id === "1" ? {} : params,
    })
}