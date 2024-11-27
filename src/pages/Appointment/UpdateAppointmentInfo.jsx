import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {AdminContext} from "../../context/AdminContext";
import {motion} from "framer-motion";
import * as appointmentService from "../../service/AppointmentService";
import {toast} from "react-toastify";
import * as accountService from "../../service/AccountService";
import UpdateInsuranceModal from "./UpdateInsuranceModal";
import DetailInsuranceModal from "./DetailInsuranceModal";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";


const UpdateAppointmentInfo = () => {

    const navigate = useNavigate();
    const {id} = useParams();

    const {aToken} = useContext(AdminContext);
    const [appointmentId, setAppointmentId] = useState('')
    const [doctorId, setDoctorId] = useState('')

    const [user_id, setUserId] = useState('');
    const [users, setUsers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [doctor, setDoctor] = useState(null);
    const [doctorActiveHours, setDoctorActiveHours] = useState([]);

    const [updateModal, setUpdateModal] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [name, setName] = useState('');
    const {t} = useTranslation();


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


    const changeAppointmentTime = async () => {
        try {
            const data = {
                doctor_id: appointmentData.doctor_id,
                appointment_day: datePicker.dayOfWeek + ' ' + datePicker.date,
                appointment_time_start: datePicker.time.start_time,
                appointment_time_end: datePicker.time.end_time,
            }
            const result = await appointmentService.changeAppointmentInfo(data, id, aToken);
            if (result) {
                console.log('appointment time', result)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const getAppointmentInfo = async () => {
        try {
            const response = await appointmentService.getAppointmentInfo(id, aToken);

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

                await getActiveHourList();
                // await getName()

            }
        } catch (e) {
            console.error(e);
        }
    };


    const getActiveHourList = async () => {
        try {
            if (doctorId) {
                const response = await accountService.getAccountActiveHourList(doctorId, aToken);
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
    };


    const updateAppointmentInfo = async () => {
        try {
            const data = {
                health_issue: appointmentData.health_issue,
                type_service: appointmentData.type_service
            }
            await changeAppointmentTime();
            const response = await appointmentService.updateAppointmentInfo(data, id, aToken)
            if (response) {
                navigate('/all-appointment')
                await Swal.fire({
                    position: "top-end",
                    title: t("appointment.update.asuccess"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                toast.error('Doctor is not available')
            }
        } catch (e) {
            console.log(e)
        }

    }

    const getAccountList = async () => {
        try {
            const result = await accountService.findAll(true, false, false, aToken);
            setUsers(result);
        } catch (e) {
            console.log(e.error);
        }
    };

    const getDoctorAccountList = async () => {
        try {
            const result = await accountService.findAll(false, false, true, aToken);
            setDoctors(result);
        } catch (e) {
            console.log(e.error);
        }
    };

    const onLoad = () =>{
        setDetailModal(false)
    }


    useEffect(() => {
        if (aToken) {
            getDoctorAccountList();
        }
    }, [aToken]);

    useEffect(() => {
        if (aToken) {
            getAccountList();
        }
    }, [aToken]);


    useEffect(() => {
        if (aToken) {
            getAppointmentInfo();
        }
    }, [aToken, doctorId])

    useEffect(() => {
        getName()
    }, [users, appointmentData.user_id]);


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

                    {/*<motion.button*/}
                    {/*    type="button"*/}
                    {/*    onClick={() => setUpdateModal(true)}*/}
                    {/*    className="bg-amber-400 text-gray-700 px-6 py-2 rounded-full shadow-md transition mr-4"*/}
                    {/*    whileHover={{scale: 1.05}}*/}
                    {/*    whileTap={{scale: 0.95}}*/}
                    {/*    initial={{opacity: 0}}*/}
                    {/*    animate={{opacity: 1}}*/}
                    {/*    transition={{delay: 0.3, duration: 0.5}}*/}
                    {/*>*/}
                    {/*    Insurance Information*/}
                    {/*</motion.button>*/}

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
                                    {t("appointment.update.y")}
                                    {' '}
                                    <span className="font-semibold text-blue-600">
                {doctors?.find((doc) => doc._id === appointmentData.doctor_id)?.username || t("appointment.update.nod")}
            </span>{' '}
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
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-1"
                        >
                            <div className="mb-6">
                                <div className="mb-6">
                                    <p className="text-lg font-medium text-gray-700 mb-2">
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
                                                    disabled={isDisabled}
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
                            <label htmlFor="health-issue" className="block text-lg font-medium text-primary mb-2">
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
                            />
                        </motion.div>

                        <div className="flex justify-end gap-4 mt-8">
                            <motion.button
                                type="button"
                                onClick={() => navigate('/all-appointment')}
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

                <UpdateInsuranceModal
                    open={updateModal}
                    cancel={() => setUpdateModal(false)}
                    id={id}
                />

                <DetailInsuranceModal
                    open={detailModal}
                    cancel={() => setDetailModal(false)}
                    id={id}
                    name={name}
                    onClose={onLoad}

                />


            </div>

        </div>
    );
};

export default UpdateAppointmentInfo;
