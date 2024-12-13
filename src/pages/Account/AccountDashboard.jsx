import React, {useContext, useEffect, useState} from 'react';
import {motion} from "framer-motion";
import StatCard from "../../components/StatCard";
import {User, ScanEye, UserRoundSearch} from "lucide-react";
import * as accountService from "../../service/AccountService";
import {AdminContext} from "../../context/AdminContext";
import TopDoctorChart from "../../components/Chart/TopDoctorChart";
import {useTranslation} from "react-i18next";
import TopUsers from "../../components/Chart/TopUsers";

const AccountDashboard = () => {
    const {aToken,  adminList, refetchAdminList} = useContext(AdminContext);

    const [totalUsers, setTotalUser] = useState(0);
    const [totalAdmin, setTotalAdmin] = useState(0);

    const {t} = useTranslation();


    const getAccountList = async () => {

        try {
            const result = await accountService.findAll(true, false, false, aToken);
            setTotalUser(result.length);
        } catch (e) {
            console.log(e.error)
        }

    }

    const getAdminAccountList = async () => {
        try {
            refetchAdminList()
            setTotalAdmin(adminList.length)
        } catch (e) {
            console.log(e.error)
        }

    }

    useEffect(() => {
        if (aToken) {
            getAccountList()
            getAdminAccountList()
        }
    }, [aToken, totalAdmin, adminList]);


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

                    <StatCard name={t('account.adashboard.admin')}
                              to={'/admin-account'} icon={ScanEye} value={totalAdmin}
                              color='#FF1493'/>

                </motion.div>

                {/* CHARTS */}

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2'>
                    <TopUsers/>
                </div>
            </main>
        </div>
    );
};

export default AccountDashboard;
