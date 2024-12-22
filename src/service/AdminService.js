import axios from "axios";

// const REST_API_BASE_URL = "http://localhost:4000/access";
const REST_API_BASE_URL = "https://backend-nc0v.onrender.com/access";


export const getAccessDetail = async (id, aToken) => {
    try {
        const result = await axios.get(REST_API_BASE_URL + `/detail-admin/${id}`,{
            headers: {
                Authorization: `Bearer ${aToken}`
            }
        })
        return result.data
    } catch (e) {
        console.log(e)
        throw e
    }
}
export const findAll = async (aToken) => {
    try {
        const result = await axios.get(REST_API_BASE_URL + "/list-admin", {
            headers: {
                Authorization: `Bearer ${aToken}`
            }
        })
        return result.data
    } catch (e) {
        console.log(e)
    }
}
export const addAdmin = async (formData,aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + "/add-admin", formData
            
        ,{
                headers: {
                    Authorization: `Bearer ${aToken}`
                }
            })
        return result.data
    } catch (e) {
        console.log(e)
        throw e
    }
}

export const removeAdminAccessAccount = async (selectedAccountIds, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/del-admin', {
            access_Ids: selectedAccountIds,
        }, {  headers: {
                Authorization: `Bearer ${aToken}`
            }});
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const updateAdminAccessAccount = async (formData, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/update-access', formData, {  headers: {
                Authorization: `Bearer ${aToken}`
            }});
        return result.data
    } catch (e) {
        console.log(e)
    }
}
