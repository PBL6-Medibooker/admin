import React, {useContext, useEffect, useState} from 'react';
import {motion} from "framer-motion";
import StatCard from "../../components/StatCard";
import {User, BadgeCheck, UserRoundSearch} from "lucide-react";
import * as accountService from "../../service/AccountService";
import {useNavigate} from "react-router-dom";
import {AdminContext} from "../../context/AdminContext";
import TopDoctorChart from "../../components/Chart/TopDoctorChart";

const AccountDashboard = () => {
    const {aToken} = useContext(AdminContext);

    const navigate = useNavigate();
    const [totalUsers, setTotalUser] = useState(0);
    const [totalDoctors, setTotalDoctors] = useState(0);
    const [totalUnDoctors, setTotalUnDoctors] = useState(0);

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
            const result = await accountService.findAll(false, false, true, aToken);
            setTotalDoctors(result.length);

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
            getDoctorAccountList();
        }
    }, [aToken]);

    useEffect(() => {
        if (aToken) {
            getDoctorUnverifyAccountList();
        }
    }, [aToken]);

    useEffect(() => {
        if (aToken) {
            getAccountList();
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
                    <StatCard name='Total User' to={'/account'} icon={User} value={totalUsers}
                              color='#6366F1'/>

                    <StatCard name='Verified Doctor' to={'/verified-doc-account'} icon={BadgeCheck} value={totalDoctors}
                              color='#6366F1'/>

                    <StatCard name='Unverify Doctor' to={'/doc-account'} icon={UserRoundSearch} value={totalUnDoctors}
                              color='#6366F1'/>

                </motion.div>

                {/* CHARTS */}

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>

                    <TopDoctorChart />


                </div>
            </main>
        </div>
    );
};

export default AccountDashboard;
