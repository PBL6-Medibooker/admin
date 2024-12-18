import axios from "axios";

export const apiGetPublicProvinces = async () => {
    try {
        const response = await axios.get('https://provinces.open-api.vn/api/?depth=2');
        console.log(response);
        return response;
    } catch (error) {
        console.log(error)
        throw error;
    }
};
