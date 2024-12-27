import React, {useContext, useEffect, useState} from 'react';
import {AdminContext} from "../../context/AdminContext";
import {useTranslation} from "react-i18next";
import * as accountService from "../../service/AccountService";
import {motion} from "framer-motion";
import StatCard from "../../components/StatCard";
import {BadgeCheck, UserRoundSearch} from "lucide-react";
import TopDoctorChart from "../../components/Chart/TopDoctorChart";
import Loader from "../../components/Loader";

const ADoctorDashboard = () => {
    const {aToken, verifiedDoctor, rVerifyDoctorData, isVerifyDoctorLoading} = useContext(AdminContext);

    const [totalDoctors, setTotalDoctors] = useState(0);
    const [totalUnDoctors, setTotalUnDoctors] = useState(0);

    const {t} = useTranslation();

    const getUnverifiedDoctors = async () => {
        try {
            const result = await accountService.findAll(false, false, false, aToken);
            setTotalUnDoctors(result.length);
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        if (aToken) {
            getUnverifiedDoctors()
            rVerifyDoctorData()
        }
    }, [aToken]);

    useEffect(() => {
        setTotalDoctors(verifiedDoctor.length)
    }, [verifiedDoctor]);

    if (isVerifyDoctorLoading) {
        return (
            <div className="flex justify-center items-center bg-opacity-75 fixed top-[52%] left-[52%] z-50">
                <Loader />
            </div>
        );
    }

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* STATS */}
                <motion.div
                    className='grid grid-cols-1 gap-20 sm:grid-cols-2 lg:grid-cols-3 mb-8'
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 1}}
                >

                    <StatCard name={t('account.adashboard.verifiedDoctor')}
                              to={'/verified-doc-account'} icon={BadgeCheck} value={totalDoctors}
                              color='#10B981'/>

                    <StatCard name={t('account.adashboard.unverifiedDoctor')}
                              to={'/doc-account'} icon={UserRoundSearch} value={totalUnDoctors}
                              color='#FACC15'/>

                </motion.div>


                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2'>
                    <TopDoctorChart/>
                </div>
            </main>
        </div>
    );
};

export default ADoctorDashboard;
