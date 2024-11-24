import axios from "axios";


const REST_API_BASE_URL = "http://localhost:4000/region";


export const findAll = async (hidden_state, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + "/get-region-list", {
            hidden_state,
        }, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}


export const addRegion = async (name, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + "/add-region", {name}, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const getRegionDetails = async (region_Id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + "/get-region",
            {region_Id}, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const updateRegion = async (name, id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/update-region/${id}`, {name}, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const deleteSoftRegion = async (selectedRegionIds, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/soft-delete-region', {
            region_Ids: selectedRegionIds,
        }, {headers: {aToken}});
        return result.data
    } catch (e) {
        console.log(e)
    }
}


export const findAllDeletedRegion = async (hidden_state, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + "/get-region-list", {
            hidden_state,
        }, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const restoreRegion = async (selectedRegionIds, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/restore-region', {
            region_Ids: selectedRegionIds,
        }, {headers: {aToken}});
        return result.data
    } catch (e) {
        console.log(e)
    }
}


export const permanentDeleteAccount = async (selectedRegionIds, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/delete-region', {
            region_Ids: selectedRegionIds,
        }, {headers: {aToken}});
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const getDoctorEachRegion = async (aToken) =>{
    try {
        const result = await axios.get(REST_API_BASE_URL + '/region-doctor',  {headers: {aToken}});
        return result.data
    } catch (e) {
        console.log(e)
    }
}

