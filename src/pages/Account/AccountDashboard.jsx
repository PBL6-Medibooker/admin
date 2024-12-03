import React, {useContext, useEffect, useState} from 'react';
import {motion} from "framer-motion";
import StatCard from "../../components/StatCard";
import {User, BadgeCheck, UserRoundSearch} from "lucide-react";
import * as accountService from "../../service/AccountService";
import {AdminContext} from "../../context/AdminContext";
import TopDoctorChart from "../../components/Chart/TopDoctorChart";
import {useTranslation} from "react-i18next";
import TopUsers from "../../components/Chart/TopUsers";

const AccountDashboard = () => {
    const {aToken, verifiedDoctor, rVerifyDoctorData} = useContext(AdminContext);

    const [totalUsers, setTotalUser] = useState(0);
    const [totalDoctors, setTotalDoctors] = useState(0);
    const [totalUnDoctors, setTotalUnDoctors] = useState(0);

    const {t} = useTranslation();


    const getAccountList = async () => {

        try {
            const result = await accountService.findAll(true, false, false, aToken);
            setTotalUser(result.length);
        } catch (e) {
            console.log(e.error)
        }

    }

    const getDoctorAccountList = async () => {
        try {
            rVerifyDoctorData()
            setTotalDoctors(verifiedDoctor.length);

            // const result = await accountService.findAll(false, false, true, aToken);
            // setTotalDoctors(result.length);

        } catch (e) {
            console.log(e.error)
        }

    }

    const getDoctorUnverifyAccountList = async () => {
        try {
            const result = await accountService.findAll(false, false, false, aToken);
            setTotalUnDoctors(result.length);

        } catch (e) {
            console.log(e.error)
        }

    }
    useEffect(() => {
        if (aToken) {
            getDoctorAccountList()
            // setTotalDoctors(verifiedDoctor.length);
            getAccountList();
            getDoctorUnverifyAccountList();

        }
    }, [aToken]);


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
                    <StatCard name={t('account.adashboard.userAccount')}
                              to={'/account'} icon={User} value={totalUsers}
                              color='#6366F1'/>

                    <StatCard name={t('account.adashboard.verifiedDoctor')}
                              to={'/verified-doc-account'} icon={BadgeCheck} value={totalDoctors}
                              color='#10B981'/>

                    <StatCard name={t('account.adashboard.unverifiedDoctor')}
                              to={'/doc-account'} icon={UserRoundSearch} value={totalUnDoctors}
                              color='#FACC15'/>

                </motion.div>

                {/* CHARTS */}

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2'>
                    <TopDoctorChart/>
                    <TopUsers/>
                </div>
            </main>
        </div>
    );
};

export default AccountDashboard;
