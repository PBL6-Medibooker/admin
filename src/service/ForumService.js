import axios from "axios";


const REST_API_BASE_URL = "http://localhost:4000/post";
// const REST_API_BASE_URL = "https://backend-nc0v.onrender.com/post";


export const findAll = async (aToken) => {
    try {
        const result = await axios.get(REST_API_BASE_URL + "/get-all-post", {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const getAllPostBySpeciality = async (speciality_name, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + "/get-all-post-by-speciality", {speciality_name}, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const getPost = async (id, aToken) => {
    try {
        const result = await axios.get(REST_API_BASE_URL + `/get-post/${id}`, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const updatePost = async (data, id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/update-post/${id}`, data, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const createPost = async (data, id, dToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/create-post', data, {headers: {dToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const softDelete = async (id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/soft-del-post/${id}`, {}, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const restorePost = async (id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/restore-post/${id}`, {}, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const permanentDelete = async (id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/perma-del-post/${id}`, {}, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const getAllPostByEmail = async (email, dToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + "/get-all-post-by-user", {email}, {
            headers: {
                Authorization: `Bearer ${dToken}`
            }
        })
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const getTop5MostCommentPost = async (aToken) => {
    try {
        const result = await axios.get(REST_API_BASE_URL + '/get-top-post', {
            headers: {
                Authorization: `Bearer ${aToken}`
            }
        })
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const getTop5MostCommentUser = async (aToken) => {
    try {
        const result = await axios.get(REST_API_BASE_URL + '/get-top-user-comment', {
            headers: {
                Authorization: `Bearer ${aToken}`
            }
        })
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const deleteComment = async (post_id, comment_id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/${post_id}/comment/${comment_id}/del`,
            {}, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}
