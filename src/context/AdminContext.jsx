import React, {createContext, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import Error from "../components/Error";
import Loader from "../components/Loader";
import * as accountService from "../service/AccountService";
import * as specialityService from "../service/SpecialityService";
import * as appointmentService from "../service/AppointmentService";


export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken')
        ? localStorage.getItem('aToken') : '');

    const backendUrl = import.meta.env?.BACKEND_URL || 'http://localhost:4000';
    // const backendUrl = import.meta.env?.BACKEND_URL || 'https://backend-nc0v.onrender.com';

    const { data: verifiedDoctor = [], isLoading, isError, refetch: rVerifyDoctorData } = useQuery({
        queryKey: ["verify"],
        queryFn: async () => {
            try {
                const data = await accountService.findAll(false, false, true, aToken);
                return data;
            } catch (e) {
                console.error(e);
                throw new Error("Failed to load");
            }
        }
    });

    const logout = () => {
        aToken && setAToken("");
        aToken && localStorage.removeItem("aToken");
    };

    const {data: specialities, refetch: refetchSpec  } = useQuery({
        queryKey: ['specList'],
        queryFn: async () =>{
            try {
                const data = await specialityService.findAll(false, aToken)
                return data;
            } catch (e) {
                console.error(e);
                throw new Error("Failed to load");
            }
        }
    })

    const { data: appointmentList,  isLoading:aListLoading, isError:aListError, refetch: refetchAList } = useQuery({
        queryKey: ["aList"],
        queryFn: async () => {
            try {
                const response = await appointmentService.findAll(false, aToken);
                return response || [];
            } catch (error) {
                console.error("Failed to fetch appointments:", error);
                throw new Error("Failed to load appointments");
            }
        },
        enabled: !!aToken,
    });



    const value = {
        backendUrl, aToken, setAToken, verifiedDoctor, isLoading, logout,rVerifyDoctorData, specialities,
        refetchSpec, appointmentList, refetchAList, aListLoading, aListError
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;
