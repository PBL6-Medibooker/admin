import axios from "axios";


const REST_API_BASE_URL = "http://localhost:4000/appointment";
// const REST_API_BASE_URL = "https://backend-nc0v.onrender.com/appointment";


export const findAll = async (is_deleted, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + "/get-all-appointment", {
            is_deleted,
        }, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const addAppointment = async (formData, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + "/add-appointment",
            formData
        , {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}


export const cancelAppointment = async (id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/cancel-appointment/${id}`
            , {},{headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}



export const getAppointmentByMonth = async (aToken) => {
    try {
        const result = await axios.get(REST_API_BASE_URL + '/get-appointment-by-month'
            ,{headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const getAppointmentInfo = async (id,aToken) => {
    try {
        const result = await axios.get(REST_API_BASE_URL + `/get-appointment-info/${id}`
            ,{headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}


export const updateAppointmentInfo = async (data,id,aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/update-appointment-info/${id}`,
           data ,{headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const changeAppointmentInfo = async (data,id,aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/update-appointment-date/${id}`,
            data ,{headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const addInsurance = async (data ,id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/add-insurance/${id}`,
            data ,{headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const getInsuranceInfo = async (id, aToken) => {
    try {
        const result = await axios.get(REST_API_BASE_URL + `/get-appointment-insr/${id}`,
            {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const updateInsuranceInfo = async (data, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/update-insurance',
            data,
            {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const deleteInsurance = async (data, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/del-insurance',
            data,
            {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const softDeleteAppointment = async (id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/soft-delete-appointment/${id}`
            , {},{headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const restoreDeletedAppointment = async (id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/restore-appointment/${id}`
            , {},{headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const getAppointmentByDoctor = async (is_deleted, id, dToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/get-appointment-by-doctor/${id}`
            , {is_deleted},{headers: {dToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const getAppointmentByUser = async (id, dToken) => {
    try {
        const result = await axios.get(REST_API_BASE_URL + `/get-user-appointments/${id}`
         ,{headers: {dToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}
