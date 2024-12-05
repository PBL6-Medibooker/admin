import React, {createContext, useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import Error from "../components/Error";
import Loader from "../components/Loader";
import * as accountService from "../service/AccountService";
import * as specialityService from "../service/SpecialityService";


export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken')
        ? localStorage.getItem('aToken') : '');

    const backendUrl = import.meta.env?.BACKEND_URL || 'http://localhost:4000';

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




    const value = {
        backendUrl, aToken, setAToken, verifiedDoctor, isLoading, logout,rVerifyDoctorData, specialities,
        refetchSpec
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;
