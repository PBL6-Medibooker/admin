import React, {useContext, useEffect, useState} from 'react';
import {DoctorContext} from "../../../context/DoctorContext.jsx";
import {AppContext} from "../../../context/AppContext.jsx";
import {assets} from "../../../assets/assets.js";
import * as appointmentService from "../../../service/AppointmentService";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import MUIDataTable from "mui-datatables";
import Modal from "../../../components/Modal/Modal";
import {FaRegTrashAlt} from "react-icons/fa";
import {toast} from "react-toastify";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import {useQuery} from "@tanstack/react-query";
import Error from "../../../components/Error";
import Loader from "../../../components/Loader";
import {CalendarHeart, AlarmClock} from 'lucide-react'
import ActiveHourListModal from "../../Account/ActiveHourListModal";


const DoctorAppointments = () => {
    const {dToken, getDoctorData, docId, doctorAppointments, isDoctorAppointmentsLoading,reFetchDA} = useContext(DoctorContext);
    const {calculateAge, dateFormat, separateDayAndDate} = useContext(AppContext);

    const navigate = useNavigate();
    const [open, setOpen] = useState(false)
    const [id, setId] =useState('')
    const {t} = useTranslation()
    const [listModal, setListModal] = useState(false)


    const cancelBooking = async () =>{
        try {
            const data = await appointmentService.softDeleteAppointment(id, dToken);
            if (data){
                reFetchDA()
                setOpen(false);
                await Swal.fire({
                    position: "top-end",
                    title: t("appointment.list.mcancel"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop: false
                });
            }

        } catch (e) {
            console.log(e);
        }
    }


    const columns = [
        {
            name: "#",
            options: {
                customHeadLabelRender: () => (
                    <span className="text-lg text-primary">
                            {'#'}
                    </span>
                ),
                customBodyRenderLite: (dataIndex) => (
                    <div style={{ textAlign: "left", marginLeft: "20px" }}>
                        {dataIndex + 1}
                    </div>
                ),
                filter: false,
            },
        },
        {
            name: t("appointment.list.patient"),
            options: {
                customHeadLabelRender: () => (
                    <span className="text-lg text-primary">
                            {t("appointment.list.patient")}
                    </span>
                ),
                customBodyRenderLite: (dataIndex) => (
                    <div className="flex ml-4 items-center gap-2">
                        <div className='w-8 h-8'>
                            <img
                                className="w-full h-full rounded-full"
                                src={doctorAppointments[dataIndex]?.user_id?.profile_image || assets.patients_icon}
                                alt=""
                            />
                        </div>
                        <p>{doctorAppointments[dataIndex]?.user_id?.username}</p>
                    </div>
                ),
            },
        },
        {
            name: t("appointment.list.age"),
            options: {
                customHeadLabelRender: () => (
                    <span className="text-lg text-primary">
                {t("appointment.list.age")}
                    </span>
                ),
                customBodyRenderLite: (dataIndex) => (
                    <div style={{ marginLeft: "20px" }}>
                        {calculateAge(doctorAppointments[dataIndex]?.user_id?.date_of_birth)}
                    </div>
                ),
            },
        },
        {
            name: t("appointment.list.dnt"),
            options: {
                customHeadLabelRender: () => (
                    <span className="text-lg text-primary">
                            {t("appointment.list.dnt")}
                    </span>
                ),
                customBodyRenderLite: (dataIndex) => {
                    const { dayOfWeek, date } = separateDayAndDate(doctorAppointments[dataIndex]?.appointment_day);
                    return (
                        <div style={{ marginLeft: "20px" }}>
                            {`${dayOfWeek}, ${dateFormat(date)} | ${doctorAppointments[dataIndex]?.appointment_time_start} - ${doctorAppointments[dataIndex]?.appointment_time_end}`}
                        </div>
                    );
                },
            },
        },

        {
            name: t("appointment.list.action"),
            options: {
                customHeadLabelRender: () => (
                    <span className="text-lg text-primary">
                            {t("appointment.list.action")}
                    </span>
                ),
                customBodyRenderLite: (dataIndex) => {

                    const appointment = doctorAppointments[dataIndex];
                    const now = new Date();
                    const appointmentDate = new Date(appointment.appointment_day);
                    const isCompleted = appointmentDate < now;
                    return (
                        <div className='ml-10'>
                            {isCompleted ? (
                                <p className="text-green-500 text-xs font-medium">{t("appointment.list.completed")}</p>
                            ) : (
                                <img
                                    alt="pic"
                                    src={assets.cancel_icon}
                                    className="w-10 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpen(true);
                                        setId(appointment._id);
                                    }}
                                />
                            )}
                        </div>
                    );
                },
                filter: false,
            },
        }

    ];

    const options = {
        elevation: 0,
        rowsPerPage: 5,
        rowsPerPageOptions: [5, 10, 20],
        onRowClick: (rowData, rowMeta) => {
            const appointment = doctorAppointments[rowMeta.dataIndex]
            navigate(`/update-appointment-of-doctor/${appointment._id}`)
        },
        download: false,
        print: false,
        selectableRows: 'none',
    };

    useEffect(() => {
        if (dToken) {
            reFetchDA()
            getDoctorData()
        }
    }, [dToken, docId])

    if(isDoctorAppointmentsLoading){
        return (
            <div className="flex justify-center items-center w-full h-screen bg-opacity-75 fixed top-0 left-0 z-50">
                <Loader />
            </div>
        );
    }

    return (
        <div className='w-full max-w-6xl m-5'>
            <motion.div
                className="flex-1 overflow-auto relative z-10"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.5}}
            >
                <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">

                    <motion.div
                        className="flex justify-between mb-4"
                        initial={{y: -20}}
                        animate={{y: 0}}
                        transition={{duration: 0.5}}
                    >
                        <p className="mb-1 text-lg lg:text-2xl text-primary font-medium">{t("doctor.appointment.title")}</p>
                        <div className='flex items-center justify-center gap-3'>
                            <motion.button
                                onClick={() => navigate("/booking-appointment")}
                                className="flex items-center gap-2 bg-primary text-white rounded-full px-4 py-3 hover:bg-primary-dark transition-colors"
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                            >
                                <CalendarHeart/> {t("doctor.appointment.create")}
                            </motion.button>

                            <motion.button
                                onClick={() => setListModal(true)}
                                className="flex items-center gap-2 bg-amber-400 text-gray-700 rounded-full px-4 py-3 hover:bg-primary-dark transition-colors"
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                            >
                                <AlarmClock/> {t("account.updateDocInfo.active")}
                            </motion.button>
                        </div>
                    </motion.div>

                    <div className="w-full max-w-6xl m-5">
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.7}}
                        >
                            <MUIDataTable
                                data={doctorAppointments}
                                columns={columns}
                                options={options}
                            />
                        </motion.div>
                    </div>
                </main>
                <Modal open={open} onClose={() => setOpen(false)}>
                    <div className="text-center w-72">
                        <FaRegTrashAlt size={56} className="mx-auto text-red-500"/>
                        <div className="mx-auto my-4 w-60">
                            <h3 className="text-lg font-black text-gray-800">{t("appointment.list.confirmDelete")}</h3>
                            <p className="text-sm text-gray-600">
                                {t("appointment.list.pCD")}
                            </p>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 shadow-md shadow-red-400/40 hover:from-red-600 hover:to-red-800 py-2 rounded-md transition duration-150"
                                onClick={cancelBooking}>{t("appointment.list.confirm")}
                            </button>
                            <button
                                className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150"
                                onClick={() => setOpen(false)}
                            >
                                {t("appointment.list.cancel")}
                            </button>
                        </div>
                    </div>
                </Modal>

            </motion.div>
            <ActiveHourListModal open={listModal} onClose={() => setListModal(false)} id={docId}/>

        </div>
    );
};

export default DoctorAppointments;
