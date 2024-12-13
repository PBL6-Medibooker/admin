import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Modal from "../../components/Modal/ModalMedium";
import { toast } from "react-toastify";
import * as accountService from "../../service/AccountService";
import { AdminContext } from "../../context/AdminContext";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import * as doctorService from "../../service/DoctorService";

const UpdateActiveHourModal = ({ open, onClose, data, accountId, cancel }) => {
    const { aToken } = useContext(AdminContext);
    const { t } = useTranslation();

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
    };

    useEffect(() => {
        if (aToken) {
            getOldActiveHour();
        }
    }, [aToken, data]);

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
                });
                return;
            }

            const result = await doctorService.updateDoctorActiveHour(activeHour, accountId, aToken);

            if (result) {
                onClose();
                await Swal.fire({
                    position: "top-end",
                    title: t("account.updateaa.success"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
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
            toast.error(e.message || "Error updating active hour.");
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <h1 className="text-primary lg:text-xl font-medium">
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
                            className="bg-primary text-white w-[100px] p-2 rounded"
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
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
