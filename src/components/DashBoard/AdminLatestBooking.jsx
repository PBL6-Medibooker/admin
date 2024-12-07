import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../Loader";
import Error from "../Error";

const AdminLatestBooking = () => {
    const { t } = useTranslation();
    const { aToken, appointmentList, refetchAList, aListLoading, aListError } = useContext(AdminContext);
    const { separateDayAndDate, dateFormat } = useContext(AppContext);
    const [data, setData] = useState([]);

    const get5LatestBooking = async () => {
        const latest = appointmentList?.reverse().slice(0, 5);
        setData(latest);
    };

    useEffect(() => {
        if (aToken) {
            refetchAList();
            get5LatestBooking();
        }
    }, [aToken])

    // if (aListLoading) {
    //     return (
    //         <div className="flex justify-center items-center w-full h-screen bg-opacity-75 fixed top-0 left-0 z-50">
    //             <Loader/>
    //         </div>
    //     );
    // }
    //
    // if (aListError) {
    //     return (
    //         <div>
    //             <Error/>
    //         </div>
    //     )
    // }

    return data && (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <div className="bg-white">
                <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
                    <motion.img
                        src={assets.list_icon}
                        alt="list icon"
                        initial={{ scale: 0.9, rotate: -15 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                    <p className="font-semibold">{t("admin.dashboard.latest")}</p>
                </div>
                <div className="pt-4 border border-t-0">
                    <AnimatePresence>
                        {data.length > 0 ? (
                            data.map((item, index) => {
                                const { dayOfWeek, date } = separateDayAndDate(item.appointment_day);
                                return (
                                    <motion.div
                                        key={index}
                                        className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                    >
                                        {/* Patient Info */}
                                        <div className="flex items-center w-1/3">
                                            <motion.img
                                                className="rounded-full w-10 h-10 object-cover mr-3"
                                                src={item.user_id.profile_image || assets.user_icon}
                                                alt={`${item.user_id.username}'s profile`}
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                            <p className="text-gray-800 font-medium">
                                                {item.user_id.username}
                                            </p>
                                        </div>

                                        {/* Doctor Info */}
                                        <div className="w-1/3 text-gray-800 text-sm font-medium">
                                            <p>{item.doctor_id.username}</p>
                                        </div>

                                        {/* Appointment Date & Time */}
                                        <div className="w-1/3 text-gray-600 text-sm">
                                            <p>{dayOfWeek}, {dateFormat(date)}</p>
                                            <p>
                                                {item.appointment_time_start} - {item.appointment_time_end}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-4"
                            >
                                <p>{t("admin.dashboard.noData")}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminLatestBooking;
