import axios from "axios";


const REST_API_BASE_URL = "http://localhost:4000/special";
// const REST_API_BASE_URL = "https://backend-nc0v.onrender.com/special";

export const findAll = async (hidden_state, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + "/get-speciality-list", {hidden_state}, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const addSpec = async (formData, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + "/add-speciality", formData, {headers: {aToken}})
        console.log(result.data)
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const updateSpec = async (formData, id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/update-speciality/${id}`, formData, {headers: {aToken}})
        console.log(result.data)
        return result.data
    } catch (e) {
        console.log(e)
    }
}


export const deleteSoftSpeciality = async (selectedSpecialityIds, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/soft-delete-speciality', {
            speciality_Ids: selectedSpecialityIds,
        }, {headers: {aToken}});
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const findAllDeleted = async (hidden_state, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + "/get-speciality-list", {hidden_state}, {headers:{aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}



export const restoreSpeciality = async (selectedSpecialityIds, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/restore-speciality', {
            speciality_Ids: selectedSpecialityIds,
        }, {headers: {aToken}});
        return result.data
    } catch (e) {
        console.log(e)
    }
}


export const permanentDeleteAccount = async (selectedSpecialityIds, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/delete-speciality', {
            speciality_Ids: selectedSpecialityIds,
        }, {headers: {aToken}});
        return result.data
    } catch (e) {
        console.log(e)
    }
}


export const getEachDoctorOfSpeciality = async () => {
    try {
        const result = await axios.get(REST_API_BASE_URL + '/get-doc-count');
        return result.data
    } catch (e) {
        console.log(e)
    }
}

