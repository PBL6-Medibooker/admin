import React, {useContext, useEffect, useState} from 'react';
import {motion} from "framer-motion";
import StatCard from "../../components/StatCard";
import {ClipboardList} from "lucide-react";
import {AdminContext} from "../../context/AdminContext";
import * as specialityService from "../../service/SpecialityService";
import SpecialityByDoctorChart from "../../components/Chart/SpecialityByDoctorChart";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import Loader from "../../components/Loader";

const SpecialityDashBoard = () => {
    const {aToken} = useContext(AdminContext);
    const [totalSpecialities, setTotalSpecialities] = useState(0);
    const {t} = useTranslation();


    const { data = [],refetch, isLoading} = useQuery({
        queryKey:['specLength'],
        queryFn: async () => {
            return  await specialityService.findAll('false', aToken);
        }
    })


    useEffect(() => {
        if (aToken) {
            refetch()
        }
    }, [aToken]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center bg-opacity-75 fixed top-[52%] left-[52%] z-50">
                <Loader />
            </div>
        );
    }

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard
                        name={t("speciality.dashboard.title")}
                        to={'/speciality'}
                        icon={ClipboardList}
                        value={data.length}
                        color='#6366F1'
                    />
                </motion.div>

                <div className='grid grid-cols-1 lg:grid-cols-1 gap-8'>
                    <SpecialityByDoctorChart />
                </div>
            </main>
        </div>
    );
};

export default SpecialityDashBoard;
