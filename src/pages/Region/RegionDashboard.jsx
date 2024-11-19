import React, {useContext, useEffect, useState} from 'react';
import {motion} from "framer-motion";
import StatCard from "../../components/StatCard";
import {MapPin} from "lucide-react";
import {AdminContext} from "../../context/AdminContext";
import * as regionService from "../../service/RegionService";
import {useTranslation} from "react-i18next";

const RegionDashboard = () => {

    const {aToken} = useContext(AdminContext);
    const [data, setData] = useState([]);
    const [totalRegion, setTotalRegion] = useState(0)
    const {t} = useTranslation();


    const getRegionList = async () => {
        try {
            const result = await regionService.findAll(false, aToken);
            setTotalRegion(result.length)
            setData(result);
        } catch (e) {
            console.log(e.error);
        }
    };

    useEffect(() => {
        if (aToken) {
            getRegionList();
        }
    }, [aToken]);

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
                    <StatCard name='Total Region' to={'/region'} icon={MapPin} value={totalRegion}
                              color='#6366F1'/>
                </motion.div>

                {/* CHARTS */}

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>


                </div>
            </main>
        </div>
    );
};

export default RegionDashboard;
