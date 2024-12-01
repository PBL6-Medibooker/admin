import React, {useContext} from 'react';
import {motion} from "framer-motion";
import StatCard from "../../components/StatCard";
import {ClipboardList} from "lucide-react";
import AppointmentChart from "../../components/Chart/AppointmentChart";
import {useTranslation} from "react-i18next";
import {AdminContext} from "../../context/AdminContext";
import {useQuery} from "@tanstack/react-query";
import TopUserActive from "./TopUserActive";

const Dashboard = () => {
    const {t} = useTranslation()
    const {aToken} = useContext(AdminContext)

    const {data,isLoading, isError, refetch} = useQuery({
        queryKey: ["active"],
        queryFn: async () => {

        }
    })

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
                    {/*<StatCard name={t("appointment.dashboard.title")} to={'/all-appointment'} icon={ClipboardList}*/}
                    {/*          value={totalAppointments} color='#6366F1'/>*/}

                </motion.div>


                <div className='grid grid-cols-1 lg:grid-cols-1 gap-8'>

                <TopUserActive/>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
