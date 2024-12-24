import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Modal from "../../components/Modal/ModalMedium";
import { toast } from "react-toastify";
import * as accountService from "../../service/AccountService";
import { AdminContext } from "../../context/AdminContext";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import * as doctorService from "../../service/DoctorService";
import {DoctorContext} from "../../context/DoctorContext";
import * as appointmentService from "../../service/AppointmentService";

const UpdateActiveHourModal = ({ open, onClose, data, accountId, cancel }) => {
    const { aToken, refetchAdminDetails, adminDetails, readOnly, writeOnly, fullAccess } = useContext(AdminContext);
    const { t } = useTranslation();
    const [read, setRead] = useState(false);
    const {dToken} = useContext(DoctorContext)

    const [activeHour, setActiveHour] = useState({
        day: "",
        start_time: "",
        end_time: "",
        hour_type: "",
        appointment_limit: "",
        old_day: "",
        old_start_time: "",
        old_end_time: "",
        old_hour_type: "",
    });

    const getOldActiveHour = async () => {
        if (data) {
            setActiveHour({
                day: data.day || "",
                start_time: data.start_time || "",
                end_time: data.end_time || "",
                hour_type: data.hour_type || "",
                appointment_limit: data.appointment_limit || "",
                old_day: data.day || "",
                old_start_time: data.start_time || "",
                old_end_time: data.end_time || "",
                old_hour_type: data.hour_type || "",
            });
        }
        if(readOnly && !writeOnly && !fullAccess && aToken){
            setRead(true)
        }
    };

    useEffect(() => {
        if (aToken || dToken) {
            getOldActiveHour();
        }
    }, [aToken, data, dToken]);

    const formatTime = (time) => {
        const [hour, minute] = time.split(":");
        return `${hour?.padStart(2, "0")}:${minute?.padStart(2, "0")}`;
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        let formattedValue = value;

        if (type === "time") {
            formattedValue = formatTime(value);
        }
        setActiveHour((prev) => ({ ...prev, [name]: formattedValue }));
    };


    // const changeAppointmentTime = async () => {
    //     try {
    //         const { day, start_time, end_time } = activeHour;
    //
    //         const data = {
    //             doctor_id: accountId,
    //             appointment_day: day,
    //             appointment_time_start: start_time,
    //             appointment_time_end: end_time,
    //         }
    //         const result = await appointmentService.changeAppointmentInfo(data, id, aToken);
    //         if (result) {
    //             console.log('appointment time', result)
    //         }
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { day, start_time, end_time } = activeHour;

            const [startHour, startMinute] = start_time.split(":").map(Number);
            const [endHour, endMinute] = end_time.split(":").map(Number);

            const startTimeInMinutes = startHour * 60 + startMinute;
            const endTimeInMinutes = endHour * 60 + endMinute;

            if (endTimeInMinutes <= startTimeInMinutes) {
                await Swal.fire({
                    position: "top-end",
                    title: t("account.aa.error"),
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop: false
                });
                return;
            }

            const result = await doctorService.updateDoctorActiveHour(activeHour, accountId, aToken);

            console.log(result)
            if (result) {
                onClose();
                await Swal.fire({
                    position: "top-end",
                    title: t("account.updateaa.success"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop: false
                });
            } else {
                await Swal.fire({
                    position: "top-end",
                    title: t("account.updateaa.error"),
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        } catch (e) {
            await Swal.fire({
                position: "top-end",
                title: t("account.active.emessage"),
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false

            });
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <h1 className="text-primary lg:text-xl font-bold">
                {t("account.updateaa.title")}
            </h1>
            <motion.div
                initial={{opacity: 0, y: -50}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: 50}}
                transition={{type: "spring", stiffness: 200}}
                className="p-2 ml-9 bg-white rounded max-w-lg w-full"
            >
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-6">
                    <motion.div
                        className="flex gap-3"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.2}}
                    >
                        <div>
                            <label className="text-black font-bold">{t("account.updateaa.day")}</label>
                            <select
                                name="day"
                                value={activeHour.day}
                                onChange={handleInputChange}
                                required
                                className="border p-2 rounded"
                                disabled={read}
                            >
                                <option value="">Select a Day</option>
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                                    (day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="text-black font-bold">{t("account.updateaa.start")}</label>
                            <input
                                type="time"
                                name="start_time"
                                value={activeHour.start_time}
                                onChange={handleInputChange}
                                required
                                className="border p-2 rounded"
                                disabled={read}
                            />
                        </div>

                        <div>
                            <label className="text-black font-bold">{t("account.updateaa.end")}</label>
                            <input
                                type="time"
                                name="end_time"
                                value={activeHour.end_time}
                                onChange={handleInputChange}
                                required
                                className="border p-2 rounded"
                                disabled={read}
                            />
                        </div>

                        <div>
                            <label className="text-black font-bold">{t("account.updateaa.limit")}</label>
                            <input
                                type="number"
                                name="appointment_limit"
                                value={activeHour.appointment_limit}
                                onChange={handleInputChange}
                                required
                                className="border w-[90px] p-2 rounded"
                                disabled={read}
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex justify-center gap-2"
                        initial={{opacity: 0, scale: 0.9}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{delay: 0.3}}
                    >
                        <motion.button
                            type="button"
                            onClick={cancel}
                            className="bg-gray-300 w-[100px] p-2 rounded"
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            {t("account.updateaa.cancel")}
                        </motion.button>
                        <motion.button
                            type="submit"
                            className={`${read ? 'cursor-not-allowed' : 'cursor-pointer'} bg-primary text-white w-[100px] p-2 rounded`}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                            disabled={read}
                        >
                            {t("account.updateaa.update")}
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </Modal>
    );
};

export default UpdateActiveHourModal;
