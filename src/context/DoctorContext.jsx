import {createContext, useEffect, useState} from "react";
import * as accountService from "../service/AccountService";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env?.BACKEND_URL || 'http://localhost:4000';
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')

    const [doctorData, setDoctorData] = useState({});
    const [docId, setDocId] = useState('')


    const getDoctorData = async () => {
        try {

            const result = await accountService.getDoctorProfile(dToken);
            console.log(result)
            if (result.success) {
                setDoctorData(result.profileData)
                setDocId(result.profileData._id)
            }

        } catch (e) {
            console.log(e);
        }
    };


    const value = {
        backendUrl, dToken, setDToken, getDoctorData, docId
    }

    return(
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider;
