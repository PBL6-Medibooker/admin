import React, {createContext, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import Error from "../components/Error";
import Loader from "../components/Loader";
import * as accountService from "../service/AccountService";
import * as specialityService from "../service/SpecialityService";
import * as appointmentService from "../service/AppointmentService";
import * as adminService from "../service/AdminService";
import {findAll} from "../service/AdminService";
import * as regionService from "../service/RegionService";
import Swal from "sweetalert2";


export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken')
        ? localStorage.getItem('aToken') : '');

    const [readOnly, setReadOnly] = useState(false);
    const [writeOnly, setWriteOnly] = useState(false);
    const [fullAccess, setFullAccess] = useState(false);

    const backendUrl = import.meta.env?.BACKEND_URL || 'http://localhost:4000';
    // const backendUrl = import.meta.env?.BACKEND_URL || 'https://backend-nc0v.onrender.com';

    const {data: verifiedDoctor = [], isLoading, refetch: rVerifyDoctorData} = useQuery({
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

    const {data: specialities, refetch: refetchSpec} = useQuery({
        queryKey: ['specList'],
        queryFn: async () => {
            try {
                return await specialityService.findAll(false, aToken)
            } catch (e) {
                console.error(e);
                throw new Error("Failed to load");
            }
        }
    })

    const {data: regionList = [], refetch: refetchRegionList} = useQuery({
        queryKey: ["access"],
        queryFn: async () => {
            try {
                const response = await regionService.findAll(false, aToken);
                return response || [];
            } catch (error) {
                console.error("Failed to fetch data:", error);
                throw new Error("Failed to load data");
            }
        },
        enabled: !!aToken,
    })

    const {data: appointmentList, isLoading: aListLoading, isError: aListError, refetch: refetchAList} = useQuery({
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


    const {data: adminList = [], refetch: refetchAdminList} = useQuery({
        queryKey: ["access"],
        queryFn: async () => {
            try {
                const response = await adminService.findAll(aToken);

                return response || [];
            } catch (error) {
                console.error("Failed to fetch appointments:", error);
                throw new Error("Failed to load appointments");
            }
        },
        enabled: !!aToken,
    })

    const {data: adminData = {}, isLoading: isAdminDataLoading, isError, refetch: refectAdminData} = useQuery({
        queryKey: ['admin'],
        queryFn: async () => {
            try {
                const result = await accountService.getAdminProfile(aToken);
                if (result.success) {
                    console.log(result)
                    return result.adminData;
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
        },
        onError: (error) => {
            console.error('Error:', error.message);
        },
        enabled: !!aToken,

    });


    const {data: adminDetails = {}, refetch: refetchAdminDetails} = useQuery({
        queryKey: ["adminDetails"],
        queryFn: async () => {
            try {
                const response = await adminService.getAccessDetail(adminData?._id);
                setReadOnly(response.read_access)
                setWriteOnly(response.write_access)
                setFullAccess(response.admin_write_access)
                return response || [];
            } catch (error) {
                console.error("Failed to fetch appointments:", error);
                throw new Error("Failed to load appointments");
            }
        },
        enabled: !!adminData?._id,
    })


    const value = {
        backendUrl, aToken, setAToken, verifiedDoctor, isLoading, logout, rVerifyDoctorData, specialities,
        refetchSpec, appointmentList, refetchAList, aListLoading, aListError, adminList, refetchAdminList,
        regionList, refetchRegionList, adminData, refectAdminData, adminDetails, refetchAdminDetails, readOnly, writeOnly, fullAccess
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;
