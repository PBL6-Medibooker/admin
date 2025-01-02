import axios from "axios";


// const REST_API_BASE_URL = "http://localhost:4000/doc";
const REST_API_BASE_URL = "https://medibackend.azurewebsites.net/doc";


export const findAll = async (user, hidden_state, verified, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + "/filter-doctor-list-main", {
            verified
        }, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}


export const updateDocInfoAcc = async (formData, id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/update-doc-info/${id}`, formData, {headers: {aToken}})
        return result
    } catch (e) {
        console.log(e)
    }
}


export const uploadDocDegree = async (proof, id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/upload-proof/${id}`, proof, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const addDoctorActiveHours = async (activeHours, id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/add-active-hour/${id}`, activeHours, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const getAccountActiveHourList = async (id, aToken) => {
    try {
        const result = await axios.get(REST_API_BASE_URL + `/active-hour-list/${id}`, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const updateDoctorActiveHour = async (activeHour, id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/update-active-hour/${id}`, activeHour, {headers: {aToken}});
        return result.data;
    } catch (e) {
        console.error("Error in updateDoctorActiveHour:", e);
        throw new Error(e.response?.data?.message || "Failed to update active hour.");
    }
};


export const deleteDoctorActiveHour = async (activeHour, id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/delete-active-hour/${id}`, activeHour, {headers: {aToken}});
        return result.data;
    } catch (e) {
        console.error(e);

    }
};


export const changeDoctorVerifyStatus = async (email, verified, id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/change-doc-verified-status', {
            email,
            verified
        }, {headers: {aToken}});
        return result.data;
    } catch (e) {
        console.error(e);
    }
};


export const getDoctorProfile = async (authorization) => {
    try {
        const result = await axios.get(REST_API_BASE_URL + '/get-doctor-profile', {
            headers: {
                Authorization: `Bearer ${authorization}`
            }
        });
        return result.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const getTopDoctors = async (aToken) => {
    try {
        const result = await axios.get(REST_API_BASE_URL + '/top-doctor', {headers: {aToken}});
        return result.data;
    } catch (e) {
        console.error(e);
    }
};

export const getDoctorStat = async (formData ,dToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/stat-doctor', formData,{headers: {dToken}});
        return result.data;
    } catch (e) {
        console.error(e);
    }
};
