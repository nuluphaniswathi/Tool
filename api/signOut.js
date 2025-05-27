import getAxiosInstance from "./";

export const signOut = async () => {
    const axios = getAxiosInstance();
    return axios({
        method: "DELETE",
        url: `/users/sign_out`,
      });
}