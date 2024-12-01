import React, {useContext, useState} from 'react';
import {AdminContext} from "../../context/AdminContext";
import {toast} from "react-toastify";
import * as appointmentService from "../../service/AppointmentService";
import {useNavigate, useParams} from "react-router-dom";
import {motion} from "framer-motion";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";



const AddInsuranceByAppointmentId = () => {
    const {aToken} = useContext(AdminContext)
    const {id} = useParams();
    const {t}= useTranslation();

    const [insuranceData, setInsuranceData] = useState({
        name: '',
        number: '',
        location: '',
        exp_date: ''
    });
    const navigate = useNavigate();


    const addInsurance = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                name: insuranceData.name,
                number: insuranceData.number,
                location: insuranceData.location,
                exp_date: insuranceData.exp_date
            }
            console.log(payload)
            const data = await appointmentService.addInsurance(payload, id, aToken)
            if (data) {
                console.log(data)
                const path = aToken ? '/all-appointment' : 'doctor-appointments'
                navigate(path)
                await Swal.fire({
                    position: "top-end",
                    title: t("appointment.add.insurance.success"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                toast.error(data.error)
            }
        } catch (e) {
            console.log(e)
        }

    }

    return (

        <div className='m-5 w-[90vw] h-[100vh]'>
            <motion.div
                initial={{opacity: 0, y: 50}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="flex justify-between items-center mb-6"
            >
                <p className="text-xl text-primary lg:text-2xl font-semibold mb-4">
                    {t("appointment.add.insurance.title")}
                </p>
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
                        transition={{delay: 0.3, duration: 0.5}}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-1"
                    >
                        <div className="mb-6">

                            <label htmlFor="insurance_name"
                                   className="block text-lg font-medium text-gray-700 mb-2">

                                {t("appointment.add.insurance.name")}
                            </label>
                            <input
                                onChange={(e) => setInsuranceData(prev => ({...prev, name: e.target.value}))}
                                value={insuranceData?.name}
                                id="insurance_name"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                type="text"
                                placeholder="BHYT"
                                required
                            />

                        </div>

                    </motion.div>

                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.3, duration: 0.5}}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-1"
                    >
                        <div className="mb-6">
                            <label htmlFor="insurance_number"
                                   className="block text-lg font-medium text-gray-700 mb-2">

                                {t("appointment.add.insurance.number")}
                            </label>
                            <input
                                onChange={(e) => setInsuranceData(prev => ({
                                    ...prev,
                                    number: e.target.value
                                }))}
                                value={insuranceData?.number}
                                id="insurance_number"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                type="text"
                                placeholder="123456789"
                                required
                            />
                        </div>
                    </motion.div>


                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.4, duration: 0.5}}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6"
                    >
                        <div className="mb-6">
                            <label htmlFor="insurance_location"
                                   className="block text-lg font-medium text-gray-700 mb-2">

                                {t("appointment.add.insurance.location")}
                            </label>
                            <input
                                onChange={(e) => setInsuranceData(prev => ({
                                    ...prev,
                                    location: e.target.value
                                }))}
                                value={insuranceData?.location}
                                id="insurance_location"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                type="text"
                                placeholder="Nhập vào địa chỉ"
                                required
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.4, duration: 0.5}}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6"
                    >
                        <div className="mb-6">
                            <label htmlFor="insurance_exp_date"
                                   className="block text-lg font-medium text-gray-700 mb-2">

                                {t("appointment.add.insurance.date")}
                            </label>
                            <input
                                onChange={(e) => setInsuranceData(prev => ({
                                    ...prev,
                                    exp_date: e.target.value
                                }))}
                                value={insuranceData?.exp_date}
                                id="insurance_exp_date"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                type="date"
                                required
                            />
                        </div>
                    </motion.div>


                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.7, duration: 0.5}}
                        className="flex justify-end gap-6 mt-6"
                    >
                        {/*<button*/}
                        {/*    type="button"*/}
                        {/*    onClick={() => navigate('/booking-appointment')}*/}
                        {/*    className="bg-gray-300 px-6 py-3 text-sm text-gray-700 rounded-full hover:bg-gray-400 transition-all"*/}
                        {/*>*/}
                        {/*    <i className="fas fa-arrow-left mr-2"></i> {t("appointment.add.insurance.back")}*/}
                        {/*</button>*/}

                        <button
                            type="button"
                            onClick={addInsurance}
                            className="bg-primary px-6 py-3 text-sm text-white rounded-full hover:bg-primary-dark transition-all"
                            aria-label="Save booking"
                        >
                            <i className="fas fa-save mr-2"></i> {t("appointment.add.insurance.save")}
                        </button>
                    </motion.div>
                </div>
            </motion.div>
    </div>

)
    ;
};

export default AddInsuranceByAppointmentId;
