import React, {useContext, useEffect, useState} from 'react';
import {AdminContext} from "../../context/AdminContext";
import {useNavigate} from "react-router-dom";
import * as appointmentService from "../../service/AppointmentService";
import {motion} from "framer-motion";
import StatCard from "../../components/StatCard";
import {ClipboardList} from "lucide-react";
import AppointmentChart from "../../components/Chart/AppointmentChart";
import {useTranslation} from "react-i18next";
import {useQuery} from "@tanstack/react-query";
import * as accountService from "../../service/AccountService";
import Error from "../../components/Error";
import Loader from "../../components/Loader";

const AppointmentDashboard = () => {
    const {aToken} = useContext(AdminContext)
    const {t} = useTranslation()


    const {data: appointments = [], isLoading, refetch} = useQuery({
        queryKey: ["verify"],
        queryFn: async () => {
            try {
                return  await appointmentService.findAll(false, aToken)
            } catch (e) {
                console.log(e)
            }
        }
    });


    useEffect(() => {
        if (aToken) {
            refetch();
        }
    }, [aToken, appointments])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center bg-opacity-75 fixed top-[52%] left-[52%] z-50">
                <Loader />
            </div>
        )
    }

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* STATS */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 1}}
                >
                    <StatCard name={t("appointment.dashboard.title")} to={'/all-appointment'} icon={ClipboardList}
                              value={appointments.length} color='#6366F1'/>

                </motion.div>

                {/* CHARTS */}
                <AppointmentChart/>

                <div className='grid grid-cols-1 lg:grid-cols-1 gap-8'>

                </div>
            </main>
        </div>
    );
};

export default AppointmentDashboard;
