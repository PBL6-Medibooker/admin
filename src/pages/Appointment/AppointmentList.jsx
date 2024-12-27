import {motion, AnimatePresence} from "framer-motion";
import React, {useContext, useEffect, useState} from 'react';
import MUIDataTable from "mui-datatables";
import * as appointmentService from "../../service/AppointmentService";
import {AdminContext} from "../../context/AdminContext";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {AppContext} from "../../context/AppContext";
import {assets} from "../../assets/assets";
import Modal from "../../components/Modal/Modal";
import {FaRegTrashAlt, FaTrashRestoreAlt} from "react-icons/fa";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";
import CustomButton from "../../components/button/CustomButton";
import {ArrowBigLeftDash, CalendarDays} from "lucide-react";
import {Tooltip} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import * as accountService from "../../service/AccountService";
import Loader from "../../components/Loader";

const AppointmentList = () => {
    const navigate = useNavigate();
    const {aToken, refetchAdminDetails, adminDetails, readOnly, writeOnly, fullAccess} = useContext(AdminContext);
    const {calculateAge, separateDayAndDate, dateFormat} = useContext(AppContext);
    // const [appointments, setAppointments] = useState([]);
    const [open, setOpen] = useState(false)
    const [id, setId] = useState('')
    const {t} = useTranslation()

    const cancelBooking = async () => {
        try {
            const data = await appointmentService.softDeleteAppointment(id, aToken);
            if (data) {
                // toast.success('The Appointment has been cancelled');
                // await getAllAppointment();
                refetchApList()
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


    const {data: appointments =[], isLoading, refetch: refetchApList} = useQuery({
        queryKey: ['apList'],
        queryFn: async () => {
            try {
                const data = await appointmentService.findAll(false, aToken)
                return data.reverse()
            } catch (e) {
                console.log(e.error);
            }
        }
    })


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
                    <motion.div
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.3, delay: dataIndex * 0.1}}
                        style={{marginLeft: "20px"}}
                    >
                        {dataIndex + 1}
                    </motion.div>
                ),
                filter: false
            }
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
                    <motion.div
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.3, delay: dataIndex * 0.1}}
                        style={{marginLeft: "2px"}}
                    >
                        <div className="flex w-8 h-8 items-center gap-2">
                            <img
                                className="w-full h-full object-cover rounded-full"
                                src={appointments[dataIndex]?.user_id?.profile_image ? appointments[dataIndex]?.user_id?.profile_image : assets.patients_icon}
                                alt=""
                            />
                            <p className='whitespace-nowrap overflow-ellipsis'>{appointments[dataIndex]?.user_id?.username}</p>
                        </div>

                    </motion.div>

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

                    <motion.div
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.3, delay: dataIndex * 0.1}}
                        style={{marginLeft: "20px"}}
                    >
                        {calculateAge(appointments[dataIndex]?.user_id?.date_of_birth)}

                    </motion.div>

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
                    const {dayOfWeek, date} = separateDayAndDate(appointments[dataIndex]?.appointment_day);
                    return (
                        <motion.div
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.3, delay: dataIndex * 0.1}}
                            style={{marginLeft: "20px"}}
                        >
                            {`${dayOfWeek}, ${dateFormat(date)} | ${appointments[dataIndex]?.appointment_time_start} - ${appointments[dataIndex]?.appointment_time_end}`}
                        </motion.div>
                    );
                    // return `${dayOfWeek}, ${dateFormat(date)} | ${appointments[dataIndex]?.appointment_time_start} - ${appointments[dataIndex]?.appointment_time_end}`;
                },
            },
        },
        {
            name: t("appointment.list.doctor"),
            options: {
                customHeadLabelRender: () => (
                    <span className="text-lg text-primary">
                            {t("appointment.list.doctor")}
                    </span>
                ),
                customBodyRenderLite: (dataIndex) => (
                    <motion.div
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.3, delay: dataIndex * 0.1}}
                        style={{marginLeft: "2px"}}
                    >
                        <div className="flex items-center ml-5 gap-2">
                            <p>{appointments[dataIndex]?.doctor_id?.username}</p>
                        </div>
                    </motion.div>


                )
            },
        },
        {
            name: t("appointment.list.action"),
            options:
                {
                    customHeadLabelRender: () => (
                        <span className="text-lg text-primary">
                            {t("appointment.list.action")}
                    </span>
                    ),
                    customBodyRenderLite: (dataIndex) => {
                        // const appointment = appointments[dataIndex];
                        // const now = new Date();
                        // const appointmentDate = new Date(appointment.appointment_day);
                        // const isCompleted = appointmentDate < now;

                        const appointment = appointments[dataIndex];
                        const now = new Date();

                        // Remove day of the week from appointment_day
                        const sanitizedDate = appointment.appointment_day.split(" ")[1]; // Extract "2025-01-08"

                        // Combine the sanitized date with the time
                        const appointmentEndTime = new Date(`${sanitizedDate}T${appointment.appointment_time_end}:00`);

                        console.log("Sanitized Date:", sanitizedDate);
                        console.log("Appointment End Time:", appointmentEndTime);

                        const isCompleted = now > appointmentEndTime;

                        return (
                            <motion.div
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.3, delay: dataIndex * 0.1}}
                                style={{marginLeft: "40px"}}
                            >
                                {isCompleted ? (
                                    <div className='bg-green-200 rounded-full py-2 w-[90px]'>
                                        <p className="text-green-700 text-xs text-center font-medium">{t("appointment.list.completed")}</p>
                                    </div>
                                ) : (readOnly && !writeOnly && !fullAccess) ?
                                    (
                                        <img
                                            alt="pic"
                                            src={assets.cancel_icon}
                                            className="w-10 cursor-not-allowed"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                            }}
                                        />
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
                            </motion.div>

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
            const appointment = appointments[rowMeta.dataIndex];
            navigate(`/update-appointment-info/${appointment._id}`)
        },
        download: false,
        print: false,
        selectableRows: 'none',
        sortOrder: {
            name: "#",
            // direction: "desc",
        },
    };


    const modalVariants = {
        hidden: {opacity: 0, y: "-50%"},
        visible: {opacity: 1, y: "0%"},
        exit: {opacity: 0, y: "50%"},
    };

    const backdropVariants = {
        hidden: {opacity: 0},
        visible: {opacity: 1},
        exit: {opacity: 0},
    };


    useEffect(() => {
        if (aToken) {
            // getAllAppointment()
            refetchApList()
            refetchAdminDetails()
        }
    }, [aToken, adminDetails]);


    if (isLoading) {
        return (
            <div className="flex justify-center items-center bg-opacity-75 fixed top-[52%] left-[52%] z-50">
                <Loader />
            </div>
        )
    }

    return (
        <motion.div
            className="flex-1 overflow-auto relative z-10"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">

                <motion.div
                    className="flex justify-between items-center mb-4 mr-4"
                    initial={{y: -20}}
                    animate={{y: 0}}
                    transition={{duration: 0.5}}
                >
                    <p className="text-lg lg:text-2xl text-primary font-bold">{t("appointment.list.title")}</p>


                    {
                        (readOnly && !writeOnly && !fullAccess) && (
                            <Tooltip title={t("common.access.permission")} arrow>

                               <span>
                                     <CustomButton
                                         onClick={() => navigate("/booking-appointment")}
                                         label={t("appointment.list.booking")}
                                         icon={CalendarDays}
                                         bgColor="bg-[rgba(0,_166,_169,_1)]"
                                         hoverColor="rgba(0, 166, 169, 1)"
                                         shadowColor="rgba(0, 166, 169, 1)"
                                         disabled={readOnly && !fullAccess && !writeOnly}
                                         cursor={true}
                                     />
                               </span>
                            </Tooltip>
                        )
                    }


                    {
                        (fullAccess || writeOnly) && (
                            <CustomButton
                                onClick={() => navigate("/booking-appointment")}
                                label={t("appointment.list.booking")}
                                icon={CalendarDays}
                                bgColor="bg-[rgba(0,_166,_169,_1)]"
                                hoverColor="rgba(0, 166, 169, 1)"
                                shadowColor="rgba(0, 166, 169, 1)"
                            />
                        )
                    }
                </motion.div>

                <div className="w-full max-w-6xl m-5">
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.7}}
                    >
                        <MUIDataTable
                            data={appointments}
                            columns={columns}
                            options={options}
                        />
                    </motion.div>
                </div>
            </main>


            <AnimatePresence>
                {open &&
                    (
                        <motion.div
                            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={backdropVariants}
                            onClick={() => setOpen(false)}
                        >
                            <motion.div
                                className="bg-white text-center p-6 rounded-lg shadow-lg w-80 relative"
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <FaRegTrashAlt size={56} className="mx-auto text-red-500"/>
                                <div className="mx-auto my-4 w-60">
                                    <h3 className="text-lg font-black text-gray-800">
                                        {t("appointment.list.confirmDelete")}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {t("appointment.list.pCD")}
                                    </p>
                                </div>
                                <div className="flex gap-4 mt-6">
                                    <button
                                        className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 shadow-md shadow-red-400/40 hover:from-red-600 hover:to-red-800 py-2 rounded-md transition duration-150"
                                        onClick={() => {
                                            cancelBooking()
                                        }}
                                    >
                                        {t("appointment.list.confirm")}
                                    </button>
                                    <button
                                        className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150"
                                        onClick={() => setOpen(false)}
                                    >
                                        {t("appointment.list.cancel")}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )
                }
            </AnimatePresence>

        </motion.div>
    );
};

export default AppointmentList;
