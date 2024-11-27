import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import * as accountService from "../../service/AccountService";
import * as appointmentService from "../../service/AppointmentService";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import 'react-calendar/dist/Calendar.css';
import DatePicker from "../../components/DatePickerCustom/DatePicker";
import { motion } from "framer-motion";
import * as specialityService from "../../service/SpecialityService";
import { FaArrowCircleRight } from "react-icons/fa";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";


const AddAppointment = () => {
    const { aToken } = useContext(AdminContext);

    const [datePicker, setDatePicker] = useState({
        date: null,
        dayOfWeek: null,
        time: null,
    });

    const [user_id, setUserId] = useState('');
    const [spec_id, setSpecId] = useState('');
    const [doctor_id, setDoctorId] = useState('');
    const [id, setId] = useState('');
    const [health_issue, setHealthIssue] = useState('');
    const [type_service, setTypeService] = useState('appointment');
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [doctor, setDoctor] = useState(null);
    const [doctorActiveHours, setDoctorActiveHours] = useState([]);
    const [specialities, setSpecialities] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const {t}= useTranslation();

    const [fullyBookedHours, setFullyBookedHours] = useState([
        // {
        //     "date": "Monday 2024-11-18",
        //     "start_time": "19:37",
        //     "end_time": "20:37",
        //     "appointment_count": 4,
        //     "appointment_limit": 4
        // }
    ]);

    const navigate = useNavigate();

    const findAllSpecialities = async () => {
        const result = await specialityService.findAll(false, aToken);
        console.log('spec',result)
        setSpecialities(result);
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


    const getActiveHourList = async () => {
        try {
           if(id){
               const response = await accountService.getAccountActiveHourList(id, aToken);
               console.log(response)

               const { active_hours, booked, fully_booked } = response;

               setFullyBookedHours(fully_booked);
               // console.log('Fully Booked:', fully_booked);
           }
        } catch (error) {
            console.log(error)
        }
    };

    const handleUserSelect = (e) => {
        setUserId(e.target.value);
    };


    const handleSpecialitySelect = (e) => {
        const selectedSpecialityId = e.target.value;
        setSpecId(selectedSpecialityId);
        const filteredDoctors = doctors.filter(
            (doctor) => doctor.speciality_id?._id === selectedSpecialityId
        );
        setFilteredDoctors(filteredDoctors);
    };
    const handleDoctorSelect = async (e) => {
        const selectedDoctorId = e.target.value;
        setDoctorId(selectedDoctorId);
        setId(selectedDoctorId)

        try {
            const result = await accountService.getAccDetailsById(selectedDoctorId, aToken);
            if (result) {
                await getActiveHourList();
                setDoctorActiveHours(result.active_hours);
                console.log(result);
                setDoctor(result);
                console.log("Fetched account details:", result);
            }
        } catch (error) {
            console.log("Error fetching account details:", error);
            toast.error("Could not load account details.");
        }
    };

    const handleFocus = (field) => {
        console.log(`Focused on ${field}`);
    };

    const bookingAppointment = async () => {
        setError('');

        console.log("Form data being submitted:", {
            user_id,
            doctor_id,
            appointment_day: datePicker.dayOfWeek + ' ' + datePicker.date,
            appointment_time_start: datePicker.time.start_time,
            appointment_time_end: datePicker.time.end_time,
            health_issue,
            type_service,
        });
        if (!user_id || !doctor_id || !datePicker.time?.start_time || !datePicker.time?.end_time || !health_issue) {
            // toast.warn('Please fill out all required fields before proceeding.');
            await Swal.fire({
                position: "top-end",
                title: t("appointment.add.warn"),
                icon: "warning",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }
        try {
            const payload = {
                user_id,
                doctor_id,
                appointment_day: datePicker.dayOfWeek + ' ' + datePicker.date,
                appointment_time_start: datePicker.time?.start_time,
                appointment_time_end: datePicker.time?.end_time,
                health_issue,
                type_service,
            };

            const response = await appointmentService.addAppointment(payload, aToken);
            if (response) {
                console.log(response)
                navigate(`/add-insurance/${response._id}`);
                // toast.success('Booking Appointment Successful');
            } else {
                await Swal.fire({
                    position: "top-end",
                    title: t("appointment.add.wbook"),
                    icon: "warning",
                    showConfirmButton: false,
                    timer: 1500
                });            }

        } catch (error) {
            console.error('Error creating appointment:', error.response?.data || error.message);
            setError(error.response?.data?.error || 'Error creating appointment');
        }
    };


    useEffect(() => {
        if(aToken){
            findAllSpecialities()
        }
    }, [aToken]);

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

    return  (
        <div className='m-5 w-[90vw] h-[100vh]'>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center mb-6"
            >
                <p className="text-xl text-primary lg:text-2xl font-semibold mb-4">
                    {t("appointment.add.title")}
                </p>
            </motion.div>


            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="m-5 w-full max-w-4xl mx-auto"
            >
                <div className="bg-white px-8 py-8 border rounded-xl shadow-xl w-full max-h-[80vh] overflow-y-auto">


                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.3, duration: 0.5}}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-1"
                    >
                        <div className="mb-6">
                            <select
                                id="user-select"
                                value={user_id}
                                onChange={handleUserSelect}
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                                aria-required="true"
                            >
                                <option value="" disabled className="text-gray-400">
                                    {t("appointment.add.select")}
                                </option>
                                {users?.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.4, duration: 0.5}}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-1"
                    >
                        <div className="mb-6">
                            <select
                                id="user-select"
                                value={spec_id}
                                onChange={handleSpecialitySelect}
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                                aria-required="true"
                            >
                                <option value="" disabled className="text-gray-400">
                                    {t("appointment.add.selectp")}
                                </option>
                                {specialities?.map((speciality) => (
                                    <option key={speciality._id} value={speciality._id}>
                                        {speciality.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </motion.div>


                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.5, duration: 0.5}}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-1"
                    >
                        <div className="mb-6">
                            {/*<label htmlFor="doctor-select" className="block text-lg font-medium text-gray-700 mb-2">*/}
                            {/*    Select Doctor*/}
                            {/*</label>*/}
                            <select
                                id="doctor-select"
                                value={doctor_id}
                                onChange={handleDoctorSelect}
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                                aria-required="true"
                            >
                                <option value="" disabled className="text-gray-400">
                                    {t("appointment.add.selectd")}
                                </option>
                                {filteredDoctors?.length > 0 ? (
                                    filteredDoctors.map((doctor) => (
                                        <option key={doctor._id} value={doctor._id}>
                                            {doctor.username}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>
                                        {t("appointment.add.option")}
                                    </option>
                                )}
                            </select>

                        </div>
                    </motion.div>


                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.6, duration: 0.5}}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6"
                    >
                        <DatePicker
                            value={datePicker}
                            schedule={doctor ? doctor.active_hours : null}
                            onChange={setDatePicker}
                            placeholder={t("appointment.add.date")}
                            disabled={!(user_id && doctor)}
                            onFocus={(e) => {
                                handleFocus("time");
                            }}
                            fullyBookedHours={fullyBookedHours}
                            className="p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            aria-label="Select appointment date and time"
                        />
                    </motion.div>


                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.7, duration: 0.5}}
                        className="mb-6"
                    >
                        <label htmlFor="health-issue"
                               className="block text-lg font-medium text-primary mb-2">
                            {t("appointment.add.describe")}
                        </label>
                        <textarea
                            id="health-issue"
                            value={health_issue}
                            onChange={(e) => setHealthIssue(e.target.value)}
                            rows="4"
                            className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder={t("appointment.add.placeholder")}
                            required
                            aria-required="true"
                        />
                    </motion.div>


                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.7, duration: 0.5}}
                        className="flex justify-end gap-6 mt-6"
                    >
                        <button
                            type="button"
                            onClick={() => navigate('/all-appointment')}
                            className="bg-gray-300 px-6 py-3 text-sm text-black text-center rounded-full hover:bg-gray-400 transition-all"
                        >
                            <i className="fas fa-arrow-left mr-2"></i> {t("appointment.add.back")}
                        </button>
                        <button
                            type="button"
                            onClick={bookingAppointment}
                            className={`flex items-center gap-1 px-6 py-3 text-sm rounded-full transition-all group ${
                                datePicker.date
                                    ? 'bg-amber-400 text-white hover:bg-primary-dark focus:outline-none transition-all'
                                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            }`}
                            aria-label="Save booking"
                            disabled={!datePicker.date}
                        >
                            <i className="fas fa-save mr-2"></i>
                            {t("appointment.add.continue")}
                            <FaArrowCircleRight
                                className={`transform transition-transform duration-300 ${
                                    datePicker.date ? 'group-hover:translate-x-2' : ''
                                }`}
                            />
                        </button>


                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default AddAppointment;
