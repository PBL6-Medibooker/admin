import axios from "axios";


// const REST_API_BASE_URL = "http://localhost:4000/article";
const REST_API_BASE_URL = "https://medibackend.azurewebsites.net/article";



export const findAll = async (hidden_state, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + "/get-all-article", {
            hidden_state: hidden_state
        },{headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}


export const addArticle = async (data, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + "/create-article", data, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}


export const getArticleById = async (id, aToken) => {
    try {
        const result = await axios.get(REST_API_BASE_URL + `/get-article/${id}`, {headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const updateArticle = async (formData,id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + `/update-article/${id}`, formData,{headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const softDeleteArticle = async (article_ids,id, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/soft-del-article', {
            article_ids: article_ids
        },{headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const deletePermanentArticle = async (article_ids, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/perma-del-article', {
            article_Ids: article_ids
        },{headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}


export const restoreDeletedArticle = async (article_ids, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/restore-article', {
            article_ids: article_ids
        },{headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const getArticleByMonth = async (year, aToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/get-article-by-month',
            {
            year: year
        },{headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const getArticleBySpeciality = async (aToken) => {
    try {
        const result = await axios.get(REST_API_BASE_URL + '/get-article-by-speciality',{headers: {aToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}

export const getAllArticleByDoctor = async (email,dToken) => {
    try {
        const result = await axios.post(REST_API_BASE_URL + '/get-all-article-by-doctor',{email},{headers: {dToken}})
        return result.data
    } catch (e) {
        console.log(e)
    }
}
