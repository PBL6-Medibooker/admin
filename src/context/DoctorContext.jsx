import {createContext, useEffect, useState} from "react";
import * as accountService from "../service/AccountService";
import {useQuery} from "@tanstack/react-query";
import Error from "../components/Error";
import * as appointmentService from "../service/AppointmentService";
import * as doctorService from "../service/DoctorService";
import * as articleService from "../service/ArticleService";
import Swal from "sweetalert2";


export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    // const backendUrl = import.meta.env?.BACKEND_URL || 'http://localhost:4000';
    const backendUrl = import.meta.env?.BACKEND_URL || 'https://medibackend.azurewebsites.net';

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')

    const [doctorData, setDoctorData] = useState({});
    const [docId, setDocId] = useState('')
    const [docEmail, setDocEmail] = useState('')

    const getDoctorData = async () => {
        try {
            const result = await doctorService.getDoctorProfile(dToken);
            if (result.success) {
                setDoctorData(result.profileData);
                setDocId(result.profileData._id);
                setDocEmail(result.profileData.email);
            }
        } catch (error) {

            if (error.response.data.error === "Request not authorized") {
                Swal.fire({
                    icon: "warning",
                    title: "Session expired",
                    text: "You will be logged out.",
                    timer: 2000,
                    showConfirmButton: false,
                }).then(() => {
                    logout()
                });
            } else {
                console.log("Error fetching doctor data:", error);
            }
        }
    };

    const {data: docData, refetch: refetchDocData} = useQuery({
        queryKey:['doctorData'],
        queryFn: async () => {
            try {
                const result = await doctorService.getDoctorProfile(dToken);
                if (result.success) {
                    setDoctorData(result.profileData);
                    setDocId(result.profileData._id);
                    setDocEmail(result.profileData.email);
                }
                return result
            } catch (error) {

                if (error.response.data.error === "Request not authorized") {
                    Swal.fire({
                        icon: "warning",
                        title: "Session expired",
                        text: "You will be logged out.",
                        timer: 2000,
                        showConfirmButton: false,
                    }).then(() => {
                        logout()
                    });
                } else {
                    console.log("Error fetching doctor data:", error);
                }
            }
        },
        enabled: !!dToken,
    })


    const {
        data: doctorAppointments = [],
        isLoading: isDoctorAppointmentsLoading,
        refetch: reFetchDA
    } = useQuery({
        queryKey: ["dAppointments"],
        queryFn: async () => {
            if (!docId || !dToken) return [];
            try {
                refetchDocData()
                const data = await appointmentService.getAppointmentByDoctor(false, docId, dToken);
                return data.reverse();
            } catch (e) {
                console.error(e);
                throw new Error("Failed to load");
            }
        },
        enabled: !!docId && !!dToken,
    });

    const fetchDoctorArticles = async () => {
        const email = doctorData?.email || (await getDoctorData())?.email;
        if (!email) {
            throw new Error("Doctor email not found");
        }
        const articles = await articleService.getAllArticleByDoctor(email, dToken);
        return articles.filter((article) => article.is_deleted === true);
    };

    const {data: dArticles = [], isLoading} = useQuery({
        queryKey: ["deletedArticles", doctorData?.email],
        queryFn: fetchDoctorArticles,
        enabled: !!dToken,
    });


    const logout = () => {
        dToken && setDToken("");
        dToken && localStorage.removeItem("dToken");
    };




    const value = {
        backendUrl, dToken, setDToken, getDoctorData,
        docId, doctorData, doctorAppointments, isDoctorAppointmentsLoading,
        reFetchDA, docEmail, dArticles, fetchDoctorArticles, logout, refetchDocData, docData
    }

    return(
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider;
