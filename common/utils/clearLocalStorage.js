export const clearLocalStorage = () => {
    localStorage.removeItem("api_token")
    localStorage.removeItem("user")
    return
}