import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Modal from "../../components/Modal/ModalMedium";
import { toast } from "react-toastify";
import * as accountService from "../../service/AccountService";
import { AdminContext } from "../../context/AdminContext";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import * as doctorService from "../../service/DoctorService";

const ActiveHourModal = ({ open, onClose, id, cancel }) => {
    const { aToken } = useContext(AdminContext);
    const { t } = useTranslation();
    const [isAdd, setIsAdd] = useState(false);
    const [aLimit, setALimit] = useState(false);

    const [activeHour, setActiveHour] = useState({
        day: "",
        start_time: "",
        end_time: "",
        hour_type: "appointment",
        appointment_limit: "",
    });

    const closeModal = () =>{
        cancel()
        setActiveHour({
            day: "",
            start_time: "",
            end_time: "",
            hour_type: "appointment",
            appointment_limit: "",
        })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setActiveHour((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { day, start_time, end_time, hour_type, appointment_limit } = activeHour;
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

            if(Number(appointment_limit) < 0){
                setALimit(true)
                return
            }

            const result = await doctorService.addDoctorActiveHours(activeHour, id, aToken);
            onClose();
            if (result) {
                setIsAdd(true);
                await Swal.fire({
                    position: "top-end",
                    title: t("account.aa.success"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop: false
                });
                setActiveHour({
                    day: "",
                    start_time: "",
                    end_time: "",
                    hour_type: "appointment",
                    appointment_limit: "",
                })
            } else {
                await Swal.fire({
                    position: "top-end",
                    title: t("account.active.emessage"),
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop: false

                });
            }
        } catch (e) {
            toast.error(e.message || "Error adding active hour.");
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <h1 className="text-primary font-bold text-xl">
                {t("account.aa.title")}
            </h1>
            <motion.div
                initial={{opacity: 0, y: -50}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: 50}}
                transition={{type: "spring", stiffness: 300}}
                className="ml-16 bg-white rounded max-w-lg w-full"
            >

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col justify-center items-center gap-6"
                >
                    <motion.div
                        className="flex flex-col gap-3"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.2}}
                    >
                        <div className="flex gap-3">
                            <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                                <label className='font-bold'>{t("account.aa.day")}</label>
                                <select
                                    name="day"
                                    value={activeHour.day}
                                    onChange={handleInputChange}
                                    required
                                    className="border p-2 rounded"
                                >
                                    <option value="">{t("account.aa.select")}</option>
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                    <option value="Sunday">Sunday</option>
                                </select>
                            </motion.div>
                            <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                                <label  className='font-bold'>{t("account.aa.start")}</label>
                                <input
                                    type="time"
                                    name="start_time"
                                    value={activeHour.start_time}
                                    onChange={handleInputChange}
                                    required
                                    className="border p-2 rounded"
                                />
                            </motion.div>
                            <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                                <label  className='font-bold'>{t("account.aa.end")}</label>
                                <input
                                    type="time"
                                    name="end_time"
                                    value={activeHour.end_time}
                                    onChange={handleInputChange}
                                    required
                                    className="border p-2 rounded"
                                />
                            </motion.div>
                            <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                                <label  className='font-bold'>{t("account.aa.limit")}</label>
                                <input
                                    type="number"
                                    name="appointment_limit"
                                    value={activeHour.appointment_limit}
                                    onChange={handleInputChange}
                                    required
                                    className={`border w-[90px] p-2 rounded ${aLimit ? 'shake' : ''}`}
                                />
                            </motion.div>
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
                            onClick={closeModal}
                            className="bg-gray-300 w-[100px] p-2 rounded"
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            {t("account.aa.cancel")}
                        </motion.button>
                        <motion.button
                            type="submit"
                            className="bg-primary text-white w-[100px] p-2 rounded"
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            {t("account.aa.save")}
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </Modal>
    );
};

export default ActiveHourModal;
