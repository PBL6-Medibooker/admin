import React, {useContext, useEffect, useState} from 'react';
import {motion} from "framer-motion";
import StatCard from "../../components/StatCard";
import {MapPin} from "lucide-react";
import {AdminContext} from "../../context/AdminContext";
import * as regionService from "../../service/RegionService";
import {useTranslation} from "react-i18next";
import DoctorEachRegion from "../../components/Chart/DoctorEachRegion";
import {useQuery} from "@tanstack/react-query";
import * as articleService from "../../service/ArticleService";
import Loader from "../../components/Loader";

const RegionDashboard = () => {

    const {aToken} = useContext(AdminContext);
    const {t} = useTranslation();


    const {data: regions = [], isLoading, refetch} = useQuery({
        queryKey: ["regions"],
        queryFn: async () => {
            try {
                return await regionService.findAll(false, aToken)
            } catch (e) {
                console.log(e)
            }
        }
    });

    useEffect(() => {
        if (aToken) {
            refetch();
        }
    }, [aToken]);

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
                    <StatCard name={t("region.dashboard.total")} to={'/region'} icon={MapPin} value={regions.length}
                              color='#6366F1'/>
                </motion.div>

                {/* CHARTS */}

                <div className='grid grid-cols-1 lg:grid-cols-1 gap-8'>
                    <DoctorEachRegion />
                </div>
            </main>
        </div>
    );
};

export default RegionDashboard;
