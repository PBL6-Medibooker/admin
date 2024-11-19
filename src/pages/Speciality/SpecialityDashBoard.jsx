import React, {useContext, useEffect, useState} from 'react';
import {motion} from "framer-motion";
import StatCard from "../../components/StatCard";
import {ClipboardList} from "lucide-react";
import {AdminContext} from "../../context/AdminContext";
import * as specialityService from "../../service/SpecialityService";
import SpecialityByDoctorChart from "../../components/Chart/SpecialityByDoctorChart";

const SpecialityDashBoard = () => {
    const {aToken} = useContext(AdminContext);
    const [specialities, setSpecialities] = useState([])
    const [totalSpecialities, setTotalSpecialities] = useState(0)


    const getAllSpeciality = async () => {
        try {

            const data = await specialityService.findAll(false, aToken)
            if(data){
                setSpecialities(data);
                console.log(data)
                setTotalSpecialities(data.length);
            }

        } catch (e){
            console.log(e)
        }
    }

    useEffect(()=>{
        if(aToken){
            getAllSpeciality();
        }
    },[aToken])
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
                    <StatCard name='Total Speciality' to={'/speciality'} icon={ClipboardList} value={totalSpecialities} color='#6366F1'/>
                </motion.div>

                {/* CHARTS */}

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>

                    <SpecialityByDoctorChart />

                </div>
            </main>
        </div>
    );
};

export default SpecialityDashBoard;