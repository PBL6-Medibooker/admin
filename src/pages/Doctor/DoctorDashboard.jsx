import React, {useContext, useEffect, useState} from 'react';
import {motion} from "framer-motion";
import StatCard from "../../components/StatCard";
import {CalendarDays} from "lucide-react";
import * as appointmentService from "../../service/AppointmentService";
import {DoctorContext} from "../../context/DoctorContext";

const DoctorDashboard = () => {
    const {dToken, docId, getDoctorData} = useContext(DoctorContext);
    const [data, setData] = useState([]);
    const [appointments, setAppointments] = useState(0);


    const getDoctorAppointments = async () =>{
        try {
            console.log(docId)
            const data = await appointmentService.getAppointmentByDoctor(false,docId, dToken)
            if(data){
                console.log(data)
                setAppointments(data.length)
            }
        }catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        if (dToken) {
            getDoctorData();
            getDoctorAppointments()
        }
    }, [dToken, docId]);
    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 1}}
                >
                    <StatCard name='Total Appointment' to={'/doctor-appointments'} icon={CalendarDays} value={appointments}
                              color='#6366F1'/>
                </motion.div>

                {/* CHARTS */}

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>


                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;
