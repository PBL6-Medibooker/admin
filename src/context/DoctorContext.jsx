import {createContext, useEffect, useState} from "react";
import * as accountService from "../service/AccountService";
import {useQuery} from "@tanstack/react-query";
import Error from "../components/Error";
import * as appointmentService from "../service/AppointmentService";

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

    const {
        data: doctorAppointments = [],
        isLoading: isDoctorAppointmentsLoading,
        isError,
        refetch: reFetchDA
    } = useQuery({
        queryKey: ["dAppointments"],
        queryFn: async () => {
            if (!docId || !dToken) return [];
            try {
                const data = await appointmentService.getAppointmentByDoctor(false, docId, dToken);
                return data.reverse();
            } catch (e) {
                console.error(e);
                throw new Error("Failed to load");
            }
        },
        enabled: !!docId && !!dToken,
    });



    const value = {
        backendUrl, dToken, setDToken, getDoctorData,
        docId, doctorData, doctorAppointments, isDoctorAppointmentsLoading,
        reFetchDA
    }

    return(
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider;
