import axios from "axios";


const REST_API_BASE_URL = "http://localhost:4000/post";


export const findAll = async (aToken) => {
    try {
        const result = await axios.get(REST_API_BASE_URL + "/get-all-post",{headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const getAllPostBySpeciality = async (speciality_name,aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + "/get-all-post-by-speciality",{speciality_name},{headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const getPost = async (id,aToken) => {
    try {
        const result = await axios.get(REST_API_BASE_URL + `/get-post/${id}`,{headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const updatePost = async (data,id,aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/update-post/${id}`,data,{headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}
