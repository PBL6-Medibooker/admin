import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import * as appointmentService from "../../../service/AppointmentService";
import * as accountService from "../../../service/AccountService";
import * as doctorService from "../../../service/DoctorService";
import {toast} from "react-toastify";
import {motion} from "framer-motion";
import {DoctorContext} from "../../../context/DoctorContext";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import AddAndUpdateInsuranceByDoctor from "./AddAndUpdateInsuranceByDoctor";
import Loader from "../../../components/Loader";
import {useQuery} from "@tanstack/react-query";

const UpdateAppointment = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const {dToken, reFetchDA} = useContext(DoctorContext);
    const [doctorId, setDoctorId] = useState('')
    const [users, setUsers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [doctorActiveHours, setDoctorActiveHours] = useState([]);
    const {t} = useTranslation()
    const [detailModal, setDetailModal] = useState(false);
    const [appointmentData, setAppointmentData] = useState({
        user_id: '',
        doctor_id: '',
        health_issue: '',
        type_service: ''
    })
    const [fullyBookedHours, setFullyBookedHours] = useState([]);
    const [datePicker, setDatePicker] = useState({
        date: null,
        dayOfWeek: null,
        time: null,
    });
    const [name, setName] = useState('');
    const [isCompeletd, setIsCompleted] = useState(false)

    const getName = async () => {
        if (users.length > 0 && appointmentData.user_id) {
            const user = users.find((user) => user._id === appointmentData.user_id);
            if (user) {
                setName(user.username);
            } else {
                setName('No user found');
            }
        }
    }

    const changeAppointmentTime = async () => {
        try {
            const data = {
                doctor_id: appointmentData.doctor_id,
                appointment_day: datePicker.dayOfWeek + ' ' + datePicker.date,
                appointment_time_start: datePicker.time.start_time,
                appointment_time_end: datePicker.time.end_time,
            }
            const result = await appointmentService.changeAppointmentInfo(data, id, dToken);
            if (result) {
                console.log('appointment time', result)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const {data: info =[], isLoading, refetch: refetchAppointmentInfo} = useQuery({
        queryKey: ['appointmentInfo'],
        queryFn: async () => {
            try {
                const response = await appointmentService.getAppointmentInfo(id, dToken);

                if (response.success) {
                    setDoctorId(response.appointmentData.doctor_id);
                    console.log(doctorId)


                    const start_time = response.appointmentData.appointment_time_start;
                    const end_time = response.appointmentData.appointment_time_end;

                    const timeRange = `${start_time} - ${end_time}`;

                    console.log(response)
                    setAppointmentData(response.appointmentData);


                    setDatePicker({
                        dayOfWeek: response.appointmentData.appointment_day.split(' ')[0],
                        date: response.appointmentData.appointment_day.split(' ')[1],
                        // time: {
                        //     label: timeRange,
                        // },
                        time: {
                            timeRange,
                        }
                    });
                    const now = new Date();
                    const appointmentDate = new Date(appointmentData.appointment_day);
                    const isCompleted = appointmentDate < now;
                    setIsCompleted(isCompleted)

                    // await getActiveHourList();
                    refetchHour()

                }
                return response
            } catch (e) {
                console.error(e);
            }
        }
    })


    // const getAppointmentInfo = async () => {
    //     try {
    //         const response = await appointmentService.getAppointmentInfo(id, dToken);
    //
    //         if (response.success) {
    //             setDoctorId(response.appointmentData.doctor_id);
    //             console.log(doctorId)
    //
    //
    //             const start_time = response.appointmentData.appointment_time_start;
    //             const end_time = response.appointmentData.appointment_time_end;
    //
    //             const timeRange = `${start_time} - ${end_time}`;
    //
    //             console.log(response)
    //             setAppointmentData(response.appointmentData);
    //
    //
    //             setDatePicker({
    //                 dayOfWeek: response.appointmentData.appointment_day.split(' ')[0],
    //                 date: response.appointmentData.appointment_day.split(' ')[1],
    //                 // time: {
    //                 //     label: timeRange,
    //                 // },
    //                 time: {
    //                     timeRange,
    //                 }
    //             });
    //             const now = new Date();
    //             const appointmentDate = new Date(appointmentData.appointment_day);
    //             const isCompleted = appointmentDate < now;
    //             setIsCompleted(isCompleted)
    //
    //             await getActiveHourList();
    //
    //         }
    //     } catch (e) {
    //         console.error(e);
    //     }
    // };
    const {data: hour =[], isLoading: isHourLoading, refetch: refetchHour} = useQuery({
        queryKey: ['insurance'],
        queryFn: async () => {
            try {
                if (doctorId) {
                    // const response = await accountService.getAccountActiveHourList(doctorId, dToken);
                    const response = await doctorService.getAccountActiveHourList(doctorId, dToken);
                    console.log(response);
                    const {active_hours, fully_booked} = response;

                    const appointmentDay = appointmentData.appointment_day?.split(' ')[0];

                    const filteredActiveHours = active_hours?.filter(
                        (hour) => hour.day === appointmentDay
                    );
                    console.log(filteredActiveHours);

                    setDoctorActiveHours(filteredActiveHours || []);
                    setFullyBookedHours(fully_booked);
                }
            } catch (error) {
                console.log(error);
            }
        }
    })


    // const getActiveHourList = async () => {
    //     try {
    //         if (doctorId) {
    //             // const response = await accountService.getAccountActiveHourList(doctorId, dToken);
    //             const response = await doctorService.getAccountActiveHourList(doctorId, dToken);
    //             console.log(response);
    //             const {active_hours, fully_booked} = response;
    //
    //             const appointmentDay = appointmentData.appointment_day?.split(' ')[0];
    //
    //             const filteredActiveHours = active_hours?.filter(
    //                 (hour) => hour.day === appointmentDay
    //             );
    //             console.log(filteredActiveHours);
    //
    //             setDoctorActiveHours(filteredActiveHours || []);
    //             setFullyBookedHours(fully_booked);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };


    const updateAppointmentInfo = async () => {
        try {
            const data = {
                health_issue: appointmentData.health_issue,
                type_service: appointmentData.type_service
            }
            await changeAppointmentTime();
            const response = await appointmentService.updateAppointmentInfo(data, id, dToken)
            if (response) {
                navigate('/doctor-appointments')
                reFetchDA()
                await Swal.fire({
                    position: "top-end",
                    title: t("appointment.update.asuccess"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop: false
                });
            } else {
                toast.error('Doctor is not available')
            }
        } catch (e) {
            console.log(e)
        }

    }

    const getAccountList = async () => {
        try {
            const result = await accountService.findAll(true, false, false, dToken);
            setUsers(result);
        } catch (e) {
            console.log(e.error);
        }
    };

    const getDoctorAccountList = async () => {
        try {
            const result = await accountService.findAll(false, false, true, dToken);
            setDoctors(result);
        } catch (e) {
            console.log(e.error);
        }
    };


    useEffect(() => {
        if (dToken) {
            getDoctorAccountList();
            getAccountList();
        }
    }, [dToken]);


    useEffect(() => {
        if (dToken) {
            // getAppointmentInfo();
            refetchAppointmentInfo()
        }
    }, [dToken, doctorId])

    useEffect(() => {
        getName()
    }, [users, appointmentData.user_id])

    if (isLoading || isHourLoading ) {
        return (
            <div className="flex justify-center items-center bg-opacity-75 fixed top-[52%] left-[52%] z-50">
                <Loader />
            </div>
        )
    }

    return (
        <div className='m-5 w-[90vw] h-[100vh]'>

            <div className="m-5 w-full h-full flex flex-col ">
                <motion.div
                    initial={{opacity: 0, y: 50}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="flex justify-between items-center mb-6"
                >
                    <p className="text-xl text-primary lg:text-2xl">
                        {t("appointment.update.title")}
                        {users?.find(user => user._id === appointmentData.user_id)?.username || t("appointment.update.nodata")}

                    </p>

                    <motion.button
                        type="button"
                        onClick={() => setDetailModal(true)}
                        className="bg-amber-400 text-gray-700 px-6 py-2 rounded-full shadow-md transition mr-4"
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.3, duration: 0.5}}
                    >
                        {t("appointment.update.insurance")}
                    </motion.button>


                </motion.div>

                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.2, duration: 0.5}}
                    className="m-5 w-full max-w-4xl mx-auto"
                >
                    <div className="bg-white px-8 py-8 border rounded-xl shadow-xl w-full max-h-[80vh] overflow-y-auto">

                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{delay: 0.4, duration: 0.5}}
                            className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-6"
                        >
                            <div className="p-4 bg-white rounded-lg  border-gray-200">
                                <p className="text-gray-700">
                                    {t("appointment.update.y2")}
                                    {' '}

                                    {t("appointment.update.on")}{' '}
                                    <span className="font-semibold text-blue-600">
                                    {appointmentData.appointment_day || t("appointment.update.nodate")}
                                    </span>{' '}
                                    {t("appointment.update.at")}{' '}
                                    <span className="font-semibold text-blue-600">
                                     {appointmentData.appointment_time_start || t("appointment.update.time")} - {appointmentData.appointment_time_end || ''}
                                    </span>.
                                </p>
                            </div>
                        </motion.div>


                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.5}}
                            className="grid grid-cols-1 lg:grid-rows-1 gap-8 mb-1"
                        >
                            <div className="mb-6">
                                <div className="mb-6">
                                    <p className="text-lg font-bold">
                                        {t("appointment.update.select")}
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        {doctorActiveHours?.map((time, index) => {
                                            const isFullyBooked = fullyBookedHours?.some(
                                                (slot) => slot.start_time === time.start_time && slot.end_time === time.end_time
                                            );

                                            const isSelected = appointmentData.appointment_time_start === time.start_time && appointmentData.appointment_time_end === time.end_time;
                                            const isDisabled = isFullyBooked || isSelected;

                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        if (!isDisabled) {
                                                            setDatePicker((prev) => ({
                                                                ...prev,
                                                                time: time,
                                                            }));
                                                        }
                                                    }}
                                                    className={`${
                                                        isDisabled
                                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                                            : 'bg-white text-black border rounded'
                                                    } px-6 py-2 rounded-lg transition-all hover:bg-primary focus:outline-none focus:bg-primary focus:text-white focus:ring-2 hover:text-white focus:border-transparent`}
                                                    disabled={isDisabled || isCompeletd}
                                                >
                                                    {`${time.start_time} - ${time.end_time}`}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{delay: 0.6, duration: 0.5}}
                            className="mb-6"
                        >
                            <label htmlFor="health-issue" className="block text-lg font-bold">
                                {t("appointment.update.hi")}
                            </label>
                            <textarea
                                id="health-issue"
                                value={appointmentData.health_issue}
                                onChange={(e) => setAppointmentData((prev) => ({
                                    ...prev,
                                    health_issue: e.target.value
                                }))}
                                rows="4"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Describe your health issue here..."
                                required
                                aria-required="true"
                                disabled={isCompeletd}
                            />
                        </motion.div>

                        <div className="flex justify-end gap-4 mt-8">
                            <motion.button
                                type="button"
                                onClick={() => navigate('/doctor-appointments')}
                                className="bg-red-500 text-white px-6 py-2 rounded-full shadow-md transition"
                                whileHover={{scale: 1.05}} // Scale up on hover
                                whileTap={{scale: 0.95}} // Scale down on click
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{delay: 0.3, duration: 0.5}}
                            >
                                {t("appointment.update.back")}
                            </motion.button>

                            <motion.button
                                onClick={updateAppointmentInfo}
                                className="bg-primary text-white px-6 py-2 rounded-full shadow-md transition"
                                whileHover={{scale: 1.05}} // Scale up on hover
                                whileTap={{scale: 0.95}} // Scale down on click
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{delay: 0.3, duration: 0.5}}
                            >
                                {t("appointment.update.save")}
                            </motion.button>
                        </div>

                    </div>


                </motion.div>

                <AddAndUpdateInsuranceByDoctor
                    open={detailModal}
                    cancel={() => setDetailModal(false)}
                    id={id}
                    name={name}
                    onClose={() => setDetailModal(false)}
                />

            </div>

        </div>
    );
};

export default UpdateAppointment;
