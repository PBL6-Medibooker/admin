import React, {useContext, useEffect, useState} from 'react';
import {motion} from "framer-motion";
import StatCard from "../../components/StatCard";
import {BadgeCheck, ClipboardList} from "lucide-react";
import {useTranslation} from "react-i18next";
import {AdminContext} from "../../context/AdminContext";
import {useQuery} from "@tanstack/react-query";
import TopUserActive from "../../components/DashBoard/TopUserActive";
import AdminLatestBooking from "../../components/DashBoard/AdminLatestBooking";
import Loader from "../../components/Loader";
import Error from "../../components/Error";

const Dashboard = () => {
    const {t} = useTranslation()
    const {aToken, appointmentList, refetchAList, aListLoading, aListError, verifiedDoctor, rVerifyDoctorData} = useContext(AdminContext)
    const [totalAppointments, setTotalAppointments] = useState(0)
    const [totalDoctors, setTotalDoctors] = useState(0)


    const getTotalAppointment = async () => {
        refetchAList()
        setTotalAppointments(appointmentList?.length)
    }
    const getTotalDoctor = async () =>{
        rVerifyDoctorData()
        setTotalDoctors(verifiedDoctor.length)
    }

    useEffect(() => {
        if (aToken) {
            getTotalAppointment()
            getTotalDoctor()
        }
    }, [aToken, appointmentList, verifiedDoctor]);

    if (aListLoading) {
        return (
            <div className="flex justify-center items-center w-full h-screen bg-opacity-75 fixed top-0 left-0 z-50">
                <Loader/>
            </div>
        );
    }

    if (aListError) {
        return (
            <div>
                <Error/>
            </div>
        )
    }


    return aToken && (
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
                              value={totalAppointments} color='#6366F1'/>


                    <StatCard name={t('account.adashboard.verifiedDoctor')}
                              to={'/verified-doc-account'} icon={BadgeCheck} value={totalDoctors}
                              color='#10B981'/>

                </motion.div>


                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    <AdminLatestBooking/>
                    <TopUserActive/>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
