import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from "../../context/AdminContext";
import { useNavigate, useParams } from "react-router-dom";
import * as accountService from "../../service/AccountService";
import { toast } from "react-toastify";
import * as regionService from "../../service/RegionService";
import * as specialityService from "../../service/SpecialityService";
import ActiveHourListModal from "./ActiveHourListModal";
import { motion } from 'framer-motion';
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";

const UpdateDocInfoAcc = () => {
    const { id } = useParams();
    const { aToken } = useContext(AdminContext);
    const navigate = useNavigate();
const {t}= useTranslation();
    const [isVerify, setIsVerify] = useState(false);
    const [hiddenState, setHiddenState] = useState(false);
    const [email, setEmail] = useState('');
    const [proof, setProof] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [specialities, setSpecialities] = useState([]);
    const [docData, setDocData] = useState({
        speciality: '',
        bio: '',
        region: '',
    });
    const [listModal, setListModal] = useState(false);

    const getAllProvinces = async () => {
        const result = await regionService.findAll(hiddenState, aToken);
        setProvinces(result);
    };

    const getAllSpecialities = async () => {
        const result = await specialityService.findAll(hiddenState, aToken);
        setSpecialities(result);
    };

    const getAccountDetails = async () => {
        try {
            const result = await accountService.getAccDetailsById(id, aToken);
            if (result) {
                setDocData({
                    speciality: result.speciality_id?.name || '',
                    bio: result.bio || '',
                    region: result.region_id?.name || ''
                });
                setProof(result.proof);
                setEmail(result.email);
                setIsVerify(result.verified);
                console.log("Fetched account details:", result);
            }
        } catch (error) {
            console.log("Error fetching account details:", error);
            toast.error("Could not load account details.");
        }
    };

    const uploadDoctorDegree = async () => {
        const formData = new FormData();
        formData.append("proof", proof);

        try {
            const upload = await accountService.uploadDocDegree(formData, id, aToken);
            console.log(upload);
            setProof(upload);
        } catch (error) {
            console.log("Error uploading doctor proof:", error);
            toast.error("Could not upload proof.");
        }
    };

    const updateDocInfoAccount = async (e) => {
        e.preventDefault();

        try {
            let updatedProof = proof;
            if (!proof) {
                const accountDetails = await accountService.getAccDetailsById(id, aToken);
                updatedProof = accountDetails.proof;
            }

            const data = {
                speciality: docData?.speciality,
                bio: docData.bio,
                region: docData.region,
            };

            if (proof !== "" && proof instanceof File) {
                await uploadDoctorDegree();
            }

            await changeDoctorVerifyStatus();

            const result = await accountService.updateDocInfoAcc(data, id, aToken);

            if (result?.status === 200) {
                navigate('/verified-doc-account');
                await Swal.fire({
                    position: "top-end",
                    title: t("account.updateDocInfo.success"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                toast.error('Error updating doctor info.');
                await Swal.fire({
                    position: "top-end",
                    title: t("account.updateDocInfo.error"),
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (e) {
            console.log(e);
            toast.error(e.message);
        }
    };

    const resetPass = async () => {
        try {
            const result = await accountService.forgotPassword(email, aToken);

            if (result) {
                toast.success(result.message);
            } else {
                toast.error(result.error);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const changeDoctorVerifyStatus = async () => {
        try {
            const result = await accountService.changeDoctorVerifyStatus(email, isVerify, aToken);

            if (result) {
                toast.success(result.message);
            } else {
                toast.error(result.error);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (aToken) {
            getAccountDetails();
        }
    }, [aToken]);

    useEffect(() => {
        if (aToken) {
            getAllSpecialities();
        }
    }, [aToken]);

    useEffect(() => {
        if (aToken) {
            getAllProvinces();
        }
    }, [aToken]);

    return (
        <div className="m-5 w-full h-full flex flex-col items-center">

            <motion.div
                className="flex justify-between items-center w-full max-w-4xl mb-8"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 1}}
            >
                <h1 className="text-2xl lg:text-3xl text-primary font-semibold">
                    {t("account.updateDocInfo.title")}
                </h1>
                <div className="flex gap-4">
                    <button
                        className="bg-primary text-white px-4 py-2 rounded-full shadow-md hover:bg-primary-dark transition"
                        onClick={resetPass}
                    >
                        {t("account.updateDocInfo.reset")}
                    </button>
                    {
                        isVerify && <button
                            className="bg-cyan-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-secondary-dark transition"
                            onClick={() => setListModal(true)}
                        >
                            {t("account.updateDocInfo.active")}
                        </button>
                    }
                </div>
            </motion.div>

            <motion.form
                className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 border"
                onSubmit={updateDocInfoAccount}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.7}}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-2"> {t("account.updateDocInfo.spec")}</label>
                        <select
                            className="border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                            onChange={(e) => setDocData((prev) => ({...prev, speciality: e.target.value}))}
                            value={docData.speciality}
                            required
                        >
                            <option value="" disabled>Select Speciality</option>
                            {specialities?.map((item, index) => (
                                <option key={index} value={item.name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-2"> {t("account.updateDocInfo.region")}</label>
                        <select
                            className="border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                            onChange={(e) => setDocData((prev) => ({...prev, region: e.target.value}))}
                            value={docData.region}
                            required
                        >
                            <option value="" disabled> {t("account.updateDocInfo.select")}</option>
                            {provinces?.map((item, index) => (
                                <option key={index} value={item.name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div className="flex flex-col">

                        {proof ? (
                            <span className="text-green-600 font-medium">{t("account.updateDocInfo.uploaded")}</span>
                        ) : (
                            <div>
                                <label className="text-sm font-medium mb-2"
                                       >{t("account.updateDocInfo.degree")}</label>
                                <input
                                       type="file"
                                       accept="application/pdf"
                                       className="border rounded-lg px-4 py-3 text-gray-700"
                                       onChange={(e) => setProof(e.target.files[0])}
                                />
                            </div>
                        )}
                    </div>


                    <div className="flex items-center gap-3 mt-6 lg:mt-0">
                        <input hidden={isVerify}
                               type="checkbox"
                               id="verify-checkbox"
                               checked={isVerify}
                               onChange={() => setIsVerify((prev) => !prev)}
                               className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
                               disabled={!(docData.region && docData.speciality && proof)}
                        />
                        <label htmlFor="verify-checkbox" className="text-sm font-medium" hidden={isVerify}>
                            {t("account.updateDocInfo.verify")}
                        </label>
                    </div>

                    <div className="lg:col-span-2 flex flex-col">
                        <label className="text-sm font-medium mb-2">{t("account.updateDocInfo.bio")}</label>
                        <textarea
                            className="border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={5}
                            placeholder="Write a brief description of the doctor"
                            onChange={(e) => setDocData((prev) => ({...prev, bio: e.target.value}))}
                            value={docData.bio}
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <button
                        type="button"
                        onClick={() => navigate('/verified-doc-account')}
                        className="bg-red-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-red-600 transition"
                    >
                        {t("account.updateDocInfo.back")}
                    </button>
                    <button
                        type="submit"
                        className="bg-primary text-white px-6 py-2 rounded-full shadow-md hover:bg-primary-dark transition"
                    >
                        {t("account.updateDocInfo.save")}
                    </button>
                </div>
            </motion.form>

            <ActiveHourListModal open={listModal} onClose={() => setListModal(false)} id={id}/>
        </div>

    );
};

export default UpdateDocInfoAcc;
