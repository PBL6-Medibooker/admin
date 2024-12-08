import axios from "axios";


const REST_API_BASE_URL = "http://localhost:4000/acc";
// const REST_API_BASE_URL = "https://backend-nc0v.onrender.com/acc";

export const login = async (email, password) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + "/login", {
            email,
            password
        })
        return result.data
    } catch (e) {
        console.log(e)
        throw e
    }
}
export const findAll = async (user, hidden_state, verified, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + "/acc-list", {
            user,
            hidden_state,
            verified
        }, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}


export const addAccount = async (formData, aToken) => {
    try {

        const result = await axios.post(REST_API_BASE_URL + "/signup", formData, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const getAccDetails = async (email, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + "/get-acc-mail", {email}, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const getAccDetailsById = async (id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/get-acc/${id}`, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const updateCusAcc = async (formData, id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/update-acc-info/${id}`, formData, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const deleteSoftAccount = async (selectedAccountIds, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/soft-delete-acc', {
            account_Ids: selectedAccountIds,
        }, {headers: {aToken}});
        return result.data
    } catch (e) {
        console.log(e)
    }
}


export const findAllDeletedAccount = async (user, hidden_state, verified, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + "/acc-list", {
            user,
            hidden_state,
            verified
        }, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const restoreAccount = async (selectedAccountIds, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/restore-acc', {
            account_Ids: selectedAccountIds,
        }, {headers: {aToken}});
        return result.data
    } catch (e) {
        console.log(e)
    }
}


export const permanentDeleteAccount = async (selectedAccountIds, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/perma-delete-acc', {
            account_Ids: selectedAccountIds,
        }, {headers: {aToken}});
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

export const forgotPassword = async (email, id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/forgot-pass', {email}, {headers: {aToken}});
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

export const changeAccountRole = async (email, role, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/change-acc-role', {email, role}, {headers: {aToken}});
        return result.data;
    } catch (e) {
        console.error(e);
    }
};

export const getAdminProfile = async (authorization) => {
    try {
        const result = await axios.get(REST_API_BASE_URL + '/get-admin-profile', {
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

export const getTopUsers = async (aToken) => {
    try {
        const result = await axios.get(REST_API_BASE_URL + '/top-users', {headers: {aToken}});
        return result.data;
    } catch (e) {
        console.error(e);
    }
};

export const changePassword = async (data, dToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/change-pass', data, {headers: {dToken}});
        return result.data;
    } catch (e) {
        console.error(e);
    }
};
