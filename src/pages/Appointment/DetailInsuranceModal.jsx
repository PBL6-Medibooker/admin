import React, { useContext, useEffect, useState } from 'react';
import ModalInsuranceMedium from "../../components/Modal/ModalInsuranceMedium";
import { AdminContext } from "../../context/AdminContext";
import * as appointmentService from "../../service/AppointmentService";
import { toast } from "react-toastify";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";
import {DoctorContext} from "../../context/DoctorContext";

const DetailInsuranceModal = ({ open, id, cancel, onClose, name }) => {
    const { aToken } = useContext(AdminContext);
    const {t} = useTranslation();
    const [insuranceData, setInsuranceData] = useState({
        id:"",
        name: "",
        number: "",
        location: "",
        exp_date: "",
    });

    const getInsuranceInfo = async () => {
        try {
            const data = await appointmentService.getInsuranceInfo(id, aToken);
            console.log('detail', data)
            if (data && data[0]) {
                setInsuranceData({
                    id: data[0]._id || "",
                    name: data[0].name || "",
                    number: data[0].number || "",
                    location: data[0].location || "",
                    exp_date: data[0].exp_date || "",
                });
            }
            // else {
            //     setInsuranceData({
            //         id: "",
            //         name: "",
            //         number: "",
            //         location: "",
            //         exp_date: "",
            //     });
            // }
        } catch (e) {
            console.error(e);
        }
    };

    const addInsurance = async () => {
        try {
            const payload = {
                name: insuranceData.name,
                number: insuranceData.number,
                location: insuranceData.location,
                exp_date: insuranceData.exp_date
            }
            // console.log(payload)
            const data = await appointmentService.addInsurance(payload, id, aToken)
            if (data) {
                // console.log(data)
                cancel()
                await Swal.fire({
                    position: "top-end",
                    title: t("appointment.add.insurance.isuccess"),
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(insuranceData.id === ""){
            // console.log('meo')
            await addInsurance()
            return;
        }
        try {
            const payload = {
                appointment_id: id,
                insurance_id: insuranceData.id,
                name: insuranceData.name,
                number: insuranceData.number,
                location: insuranceData.location,
                exp_date: insuranceData.exp_date,
            };

            // console.log(payload)
            const data = await appointmentService.updateInsuranceInfo(payload, aToken);

            if (data) {
                // toast.success("Insurance Updated");
                onClose();
                await Swal.fire({
                    position: "top-end",
                    title: t("appointment.update.success"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                await Swal.fire({
                    position: "top-end",
                    title: t("appointment.update.error"),
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (aToken && open) {
            getInsuranceInfo()
        }
    }, [aToken, open]);

    return (
        <div>
            <ModalInsuranceMedium open={open} onClose={cancel}>
                <div className="p-6 bg-white rounded-lg w-full max-w-lg mx-auto">
                    <h1 className="text-2xl text-primary font-semibold mb-6 text-center">
                        {t("appointment.update.ti")} {name}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label htmlFor="insurance_name" className="text-sm font-medium text-gray-700">
                                    {t("appointment.update.iname")}
                                </label>
                                <input
                                    onChange={(e) => setInsuranceData((prev) => ({ ...prev, name: e.target.value }))}
                                    value={insuranceData.name}
                                    id="insurance_name"
                                    className="border rounded-lg px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    type="text"
                                    placeholder="BHYT"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="insurance_number" className="text-sm font-medium text-gray-700">
                                    {t("appointment.update.inumber")}
                                </label>
                                <input
                                    onChange={(e) => setInsuranceData((prev) => ({ ...prev, number: e.target.value }))}
                                    value={insuranceData.number}
                                    id="insurance_number"
                                    className="border rounded-lg px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    type="text"
                                    placeholder="Nhập vào số BH"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="insurance_location" className="text-sm font-medium text-gray-700">
                                    {t("appointment.update.address")}
                                </label>
                                <input
                                    onChange={(e) => setInsuranceData((prev) => ({ ...prev, location: e.target.value }))}
                                    value={insuranceData.location}
                                    id="insurance_location"
                                    className="border rounded-lg px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    type="text"
                                    placeholder="Nhập vào địa chỉ"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="insurance_exp_date" className="text-sm font-medium text-gray-700">
                                    {t("appointment.update.ex")}
                                </label>
                                <input
                                    onChange={(e) => setInsuranceData((prev) => ({ ...prev, exp_date: e.target.value }))}
                                    value={insuranceData.exp_date}
                                    id="insurance_exp_date"
                                    className="border rounded-lg px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    type="date"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={cancel}
                                className="bg-gray-300 text-gray-700 p-2 w-32 rounded-lg hover:bg-gray-400 transition"
                            >
                                {t("appointment.update.back")}
                            </button>
                            <button
                                type="submit"
                                className="bg-green-500 text-white w-32 p-2 rounded-lg hover:bg-green-600 transition"
                            >
                                {t("appointment.update.save")}
                            </button>
                        </div>
                    </form>
                </div>
            </ModalInsuranceMedium>
        </div>
    );
};

export default DetailInsuranceModal;
