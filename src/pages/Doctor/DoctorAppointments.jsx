import React, {useContext, useEffect, useState} from 'react';
import {DoctorContext} from "../../context/DoctorContext.jsx";
import {AppContext} from "../../context/AppContext.jsx";
import {assets} from "../../assets/assets.js";
import * as appointmentService from "../../service/AppointmentService";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import MUIDataTable from "mui-datatables";
import Modal from "../../components/Modal";
import {FaRegTrashAlt} from "react-icons/fa";
import {toast} from "react-toastify";


const DoctorAppointments = () => {
    const {dToken, getDoctorData, docId} = useContext(DoctorContext);
    const {calculateAge, dateFormat, separateDayAndDate} = useContext(AppContext);

    const [appointments, setAppointments] = useState([]);

    const navigate = useNavigate();
    const [open, setOpen] = useState(false)
    const [id, setId] =useState('')
    // const [doctorData, setDoctorData] = useState({});
    // const [docId, setDocId] = useState('')


    // const getDoctorData = async () => {
    //     try {
    //         const result = await accountService.getDoctorProfile(dToken);
    //         console.log(result)
    //         if (result.success) {
    //             setDoctorData(result.profileData)
    //             setDocId(result.profileData._id)
    //             await getDoctorAppointments();
    //         }
    //
    //     } catch (e) {
    //         console.log(e);
    //     }
    // };

    const cancelBooking = async () =>{
        try {
            const data = await appointmentService.softDeleteAppointment(id, dToken);
            if (data){
                toast.success('The Appointment has been cancelled');
                await getDoctorAppointments();
                setOpen(false);
            }

        } catch (e) {
            console.log(e);
        }
    }





    const getDoctorAppointments = async () =>{
        try {
            console.log(docId)
            const data = await appointmentService.getAppointmentByDoctor(false,docId, dToken)
            if(data){
                console.log(data)
                setAppointments(data.reverse())
            }
        }catch (e) {
            console.log(e)
        }
    }

    const columns = [
        {
            name: "#",
            options: {
                customBodyRenderLite: (dataIndex) => (
                    <div style={{ textAlign: "left", marginLeft: "20px" }}>
                        {dataIndex + 1}
                    </div>
                ),
                filter: false,
            },
        },
        {
            name: "Patient",
            options: {
                customBodyRenderLite: (dataIndex) => (
                    <div className="flex ml-4 items-center gap-2">
                        <img
                            className="w-8 rounded-full"
                            src={appointments[dataIndex]?.user_id?.profile_image || assets.patients_icon}
                            alt=""
                        />
                        <p>{appointments[dataIndex]?.user_id?.username}</p>
                    </div>
                ),
            },
        },
        {
            name: "Age",
            options: {
                customBodyRenderLite: (dataIndex) => (
                    <div style={{ marginLeft: "20px" }}>
                        {calculateAge(appointments[dataIndex]?.user_id?.date_of_birth)}
                    </div>
                ),
            },
        },
        {
            name: "Date & Time",
            options: {
                customBodyRenderLite: (dataIndex) => {
                    const { dayOfWeek, date } = separateDayAndDate(appointments[dataIndex]?.appointment_day);
                    return (
                        <div style={{ marginLeft: "20px" }}>
                            {`${dayOfWeek}, ${dateFormat(date)} | ${appointments[dataIndex]?.appointment_time_start} - ${appointments[dataIndex]?.appointment_time_end}`}
                        </div>
                    );
                },
            },
        },

        {
            name: "Actions",
            options: {
                customBodyRenderLite: (dataIndex) => {
                    const appointment = appointments[dataIndex];
                    return (
                        <div>
                            {appointment.is_deleted ? (
                                <p className="text-red-400 text-xs font-medium">Cancelled</p>
                            ) : appointment.isCompleted ? (
                                <p className="text-green-500 text-xs font-medium">Completed</p>
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
            const appointment = appointments[rowMeta.dataIndex];
            navigate(`/update-appointment-info/${appointment._id}`)
        },
        download: false,
        print: false,
        selectableRows: 'none',
    };

    useEffect(() => {
        if (dToken) {
            getDoctorData()
        }
    }, [dToken, docId])
    useEffect(() => {
        if (dToken) {
            getDoctorAppointments()
        }
    }, [dToken])
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
                        <p className="mb-1 text-lg lg:text-2xl text-primary font-medium">All Appointments</p>
                        <motion.button
                            onClick={() => navigate("/booking-appointment")}
                            className="bg-primary text-white rounded-full px-4 py-2 hover:bg-primary-dark transition-colors"
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            Create Appointment
                        </motion.button>
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
                <Modal open={open} onClose={() => setOpen(false)}>
                    <div className="text-center w-72">
                        <FaRegTrashAlt size={56} className="mx-auto text-red-500"/>
                        <div className="mx-auto my-4 w-60">
                            <h3 className="text-lg font-black text-gray-800">Confirm Delete</h3>
                            <p className="text-sm text-gray-600">
                                Are you sure you want to delete ?
                            </p>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 shadow-md shadow-red-400/40 hover:from-red-600 hover:to-red-800 py-2 rounded-md transition duration-150"
                                onClick={cancelBooking}
                            >
                                Delete
                            </button>
                            <button
                                className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>

            </motion.div>
        </div>
    );
};

export default DoctorAppointments;
