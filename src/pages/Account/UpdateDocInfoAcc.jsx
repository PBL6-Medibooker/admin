import React, {useContext, useEffect, useRef, useState} from 'react';
import {AdminContext} from "../../context/AdminContext";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import * as accountService from "../../service/AccountService";
import {toast} from "react-toastify";
import * as regionService from "../../service/RegionService";
import * as specialityService from "../../service/SpecialityService";
import ActiveHourListModal from "./ActiveHourListModal";
import {motion} from 'framer-motion';
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";
import {assets} from "../../assets/assets";
import isEqual from 'lodash.isequal';
import ViewProofModal from "./ViewProofModal";
import {SquareCheckBig, RotateCcw, AlarmClock} from "lucide-react"
import CustomButton from "../../components/button/CustomButton";
import {FaRegTrashAlt, FaTrashRestoreAlt} from "react-icons/fa";
import * as doctorService from "../../service/DoctorService";
import {Tooltip} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import Loader from "../../components/Loader";



const UpdateDocInfoAcc = () => {
    const {id} = useParams();
    const {aToken, refetchAdminDetails, adminDetails, readOnly, writeOnly, fullAccess} = useContext(AdminContext);
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [isVerify, setIsVerify] = useState(false);
    const [hiddenState, setHiddenState] = useState(false);
    const [email, setEmail] = useState('');
    const [proof, setProof] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [specialities, setSpecialities] = useState([]);
    const [image, setImage] = useState(null);
    const [docData, setDocData] = useState({
        speciality: '',
        bio: '',
        region: '',
    });
    const [account, setAccount] = useState(null);
    const [read, setRead] = useState(false);
    const initialAccountRef = useRef(null);
    const [listModal, setListModal] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [proofModal, setProofModal] = useState(false);
    const location = useLocation()
    const {un} = location.state || {}


    const getAllProvinces = async () => {
        const result = await regionService.findAll(hiddenState, aToken);
        setProvinces(result);
    };

    const getAllSpecialities = async () => {
        const result = await specialityService.findAll(hiddenState, aToken);
        setSpecialities(result);
    };

    const {data=  {}, isLoading, refetch: refetch} = useQuery({
        queryKey: ['acc'],
        queryFn: async () => {
            try {
                const result = await accountService.getAccDetailsById(id, aToken);
                if (result) {
                    setDocData({
                        speciality: result.speciality_id?.name || '',
                        bio: result.bio || '',
                        region: result.region_id?.name || '',

                    });
                    setAccount(result);
                    setProof(result.proof)
                    setEmail(result.email);
                    setIsVerify(result.verified);
                    if (!initialAccountRef.current) {
                        initialAccountRef.current = result;
                    }

                    console.log("Fetched account details:", result);
                    // console.log('proof', proof)
                    // console.log('proof', result.proof)
                    if(readOnly && !writeOnly && !fullAccess){
                        setRead(true)
                    }
                }
                return result
            } catch (error) {
                console.log("Error fetching account details:", error);
                toast.error("Could not load account details.");
            }
        }
    })

    // const getAccountDetails = async () => {
    //     try {
    //         const result = await accountService.getAccDetailsById(id, aToken);
    //         if (result) {
    //             setDocData({
    //                 speciality: result.speciality_id?.name || '',
    //                 bio: result.bio || '',
    //                 region: result.region_id?.name || '',
    //
    //             });
    //             setAccount(result);
    //             setProof(result.proof)
    //             setEmail(result.email);
    //             setIsVerify(result.verified);
    //             if (!initialAccountRef.current) {
    //                 initialAccountRef.current = result;
    //             }
    //
    //             console.log("Fetched account details:", result);
    //             // console.log('proof', proof)
    //             // console.log('proof', result.proof)
    //             if(readOnly && !writeOnly && !fullAccess){
    //                 setRead(true)
    //             }
    //         }
    //     } catch (error) {
    //         console.log("Error fetching account details:", error);
    //         toast.error("Could not load account details.");
    //     }
    // };
    //

    const uploadDoctorDegree = async () => {
        const formData = new FormData();
        formData.append("proof", proof);

        try {
            // const upload = await accountService.uploadDocDegree(formData, id, aToken);
            const upload = await doctorService.uploadDocDegree(formData, id, aToken);
            console.log(upload);
            setProof(upload);
        } catch (error) {
            console.log("Error uploading doctor proof:", error);
            toast.error("Could not upload proof.");
        }
    };

    const updateDocInfo = async () => {
        try {
            const formData = new FormData();
            formData.append('username', account.username);
            formData.append('phone', account.phone);
            formData.append('underlying_condition', account.underlying_condition);
            formData.append('date_of_birth', account.date_of_birth);
            formData.append('address', account.address);
            if (image) formData.append('profile_image', image);
            // if (accountRole !== account.role) {
            //     await changeAccountRole();
            // }
            await accountService.updateCusAcc(formData, id, aToken);
        } catch (e) {
            console.log(e)
        }
    }

    const updateDocInfoAccount = async (e) => {
        e.preventDefault();

        // Check if account data has changed
        if (initialAccountRef.current && !isEqual(initialAccountRef.current, account)) {
            await updateDocInfo();
        }

        try {
            // let updatedProof = proof;
            // if (!proof) {
            //     const accountDetails = await accountService.getAccDetailsById(id, aToken);
            //     updatedProof = accountDetails.proof;
            // }

            const data = {
                speciality: docData?.speciality,
                bio: docData.bio,
                region: docData.region,
                profile_image: docData.profile_image
            };

            if (proof !== "" && proof instanceof File) {
                await uploadDoctorDegree();
            }

            await updateDocInfo();

            // if (isFormValid) {
            //     await changeDoctorVerifyStatus();
            // }

            if (account.verified === false) {
                await changeDoctorVerifyStatus()
            }

            const result = await doctorService.updateDocInfoAcc(data, id, aToken);
            let path = aToken ? '/verified-doc-account' : '/doc-account'

            if (result?.status === 200) {

                navigate(path);
                await Swal.fire({
                    position: "top-end",
                    title: t("account.updateDocInfo.success"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop:false
                });
            } else {
                // toast.error('Error updating doctor info.');
                await Swal.fire({
                    position: "top-end",
                    title: t("account.updateDocInfo.error"),
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop:false
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
                await Swal.fire({
                    position: "top-end",
                    title: t("doctor.profile.rsuccess"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop: false
                })
            } else {
                toast.error(result.error);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const changeDoctorVerifyStatus = async () => {
        try {
            // const result = await accountService.changeDoctorVerifyStatus(email, true, aToken);
            const result = await doctorService.changeDoctorVerifyStatus(email, true, aToken);
            if (result) {
                console.log("change doctor verify", result)
                toast.success(result.message);
            } else {
                toast.error(result.error);
            }
        } catch (e) {
            console.log(e);
        }
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    // useEffect(() => {
    //     const isValid = account?.username && account?.phone && account?.date_of_birth && account?.address !== 'none'
    //         && docData?.bio !== 'undisclosed' && docData?.region && docData?.speciality && account?.proof
    //         && isVerify === false
    //     setIsFormValid(isValid);
    // }, [account, docData]);

    // useEffect(() => {
    //     console.log(isFormValid)
    //     console.log(isVerify)
    // }, [isFormValid]);

    useEffect(() => {
        if (aToken) {
            // getAccountDetails()
            refetch()
            getAllSpecialities()
            getAllProvinces()
        }
    }, [aToken]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center bg-opacity-75 fixed top-[52%] left-[52%] z-50">
                <Loader />
            </div>
        );
    }

    return (
        <div className="m-5 w-full h-[90vh] flex flex-col items-center overflow-y-scroll">

            <motion.div
                className="flex justify-between items-center w-full  mb-8"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 1}}
            >
                <h1 className="text-2xl lg:text-3xl text-primary font-semibold">
                    {t("account.updateDocInfo.title")}
                </h1>
                <div className="flex gap-4 mr-4">
                    {/*<button*/}
                    {/*    className="bg-primary text-white px-4 py-2 rounded-full shadow-md hover:bg-primary-dark transition"*/}
                    {/*    onClick={resetPass}*/}
                    {/*>*/}
                    {/*    {t("account.updateDocInfo.reset")}*/}
                    {/*</button>*/}

                    {
                        (readOnly && !writeOnly && !fullAccess) && (
                            <Tooltip title={t("common.access.permission")} arrow>
                               <span>
                                    <CustomButton
                                        onClick={resetPass}
                                        label={t("account.updateDocInfo.reset")}
                                        icon={RotateCcw}
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
                                onClick={resetPass}
                                label={t("account.updateDocInfo.reset")}
                                icon={RotateCcw}
                                bgColor="bg-[rgba(0,_166,_169,_1)]"
                                hoverColor="rgba(0, 166, 169, 1)"
                                shadowColor="rgba(0, 166, 169, 1)"
                            />
                        )
                    }



                    {
                        isVerify && <CustomButton
                            onClick={() => setListModal(true)}
                            label={t("account.updateDocInfo.active")}
                            icon={AlarmClock}
                            bgColor="bg-cyan-500"
                            hoverColor="rgba(6, 182, 212, 1)"
                            shadowColor="rgba(6, 182, 212, 1)"
                        />
                    }


                    {/*{*/}
                    {/*    isVerify && <button*/}
                    {/*        className="bg-cyan-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-secondary-dark transition"*/}
                    {/*        onClick={() => setListModal(true)}*/}
                    {/*    >*/}
                    {/*        {t("account.updateDocInfo.active")}*/}
                    {/*    </button>*/}
                    {/*}*/}
                </div>
            </motion.div>

            <motion.form
                className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 border"
                onSubmit={updateDocInfoAccount}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.7}}
            >
                <div className="flex justify-between items-center gap-6 mb-8 text-gray-500">

                    <div className='flex items-center gap-6 text-gray-500'>
                        <label htmlFor="doc-img">
                            <motion.img
                                whileHover={{scale: 1.1}}
                                className="w-24 h-24 bg-gray-100 rounded-full cursor-pointer object-cover"
                                src={image ? URL.createObjectURL(image) : account?.profile_image || assets.patients_icon}
                                alt="Upload Area"
                            />
                        </label>
                        <input onChange={handleImageChange} type="file" id="doc-img" hidden disabled={read}/>
                        <div className="text-center">
                            <p className="text-sm text-black font-semibold">{t("account.update.upload")}
                            </p>
                            <p className="text-xs text-gray-400">
                                {t("account.update.cupload")}
                            </p>
                        </div>

                    </div>

                    <div className="flex flex-col ">
                        {
                            account?.proof && <div className='flex justify-end'>
                                <SquareCheckBig color="#16d079"/>
                            </div>
                        }

                        {account?.proof ? (
                            <motion.button
                                type="button"
                                onClick={() => setProofModal(true)}
                                className='bg-red-700 px-10 py-3 mt-4 text-white rounded-full'
                                whileHover={{scale: 1.05, boxShadow: '0px 4px 8px rgba(0,0,0,0.2)'}}
                                whileTap={{scale: 0.95}}
                                transition={{duration: 0.2}}
                            >
                                {t("account.updateDocInfo.uploaded")}
                            </motion.button>

                        ) : (
                            <div className='flex flex-col'>
                                <label className="text-sm font-medium mb-2"
                                >{t("account.updateDocInfo.degree")}</label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    disabled={read}
                                    className="border rounded-lg px-4 py-3 text-gray-700"
                                    onChange={(e) => setProof(e.target.files[0])}
                                />

                            </div>
                        )}

                    </div>


                </div>


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-950 font-medium flex items-center gap-1">
    <span className="text-primary">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 17.804A7.992 7.992 0 0112 16c1.6 0 3.09.47 4.362 1.276m-8.242-.864A4.992 4.992 0 0112 14c1.24 0 2.384.374 3.332 1.024m-.07-8.15a4.492 4.492 0 00-6.39 0m6.39 0A4.493 4.493 0 0116.414 7c.312.312.586.674.794 1.068A7.993 7.993 0 0012 4c-1.32 0-2.568.335-3.662.93m6.39 0a4.493 4.493 0 011.068 6.828"
            />
        </svg>
    </span>
                            <span className='text-black font-bold'>{t("account.updateDoctor.username")}</span>
                        </label>

                        <input
                            onChange={(e) => setAccount(prev => ({...prev, username: e.target.value}))}
                            value={account?.username}
                            className="border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            type="text"
                            placeholder="Dr.Bevis"
                            required
                            autoFocus
                            disabled={read}

                        />
                    </div>


                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-950 font-medium flex items-center gap-1">
    <span className="text-primary">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3v18h18V3H3zm16 16H5V5h14v14z"
            />
        </svg>
    </span>
                            <span className='text-black font-bold'>{t("account.update.phone")}</span>
                        </label>

                        <input
                            onChange={(e) => setAccount(prev => ({...prev, phone: e.target.value}))}
                            value={account?.phone}
                            className="border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            type="text"
                            placeholder="123456789"
                            required
                            disabled={read}

                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-950 font-medium flex items-center gap-1">
    <span className="text-primary">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0l-2-2m2 2l2-2m9 3.5A8.5 8.5 0 1112 3a8.5 8.5 0 019 6.5z"
            />
        </svg>
    </span>
                            <span className='text-black font-bold'>{t("account.update.dob")}</span>
                        </label>

                        <input
                            id="date_of_birth"
                            onChange={(e) => setAccount(prev => ({
                                ...prev,
                                date_of_birth: e.target.value
                            }))}
                            value={account?.date_of_birth ? new Date(account.date_of_birth).toISOString().split('T')[0] : ''}
                            className="border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            type="date"
                            required
                            disabled={read}

                        />
                    </div>


                    <div className="flex flex-col gap-2">
                        <label className="text-black font-bold flex items-center gap-1">
                                <span className="text-primary">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
            />
        </svg>
    </span>

                            <span className='text-black font-bold'>{t("account.update.address")}</span>
                        </label>

                        <input
                            onChange={(e) => setAccount(prev => ({
                                ...prev,
                                address: e.target.value
                            }))}
                            value={account?.address}
                            className="border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            type="text"
                            placeholder="Customer Address"
                            required={account?.address === "none"}
                            disabled={read}

                        />
                    </div>


                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-2 flex items-center gap-1">
    <span className="text-primary">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
            />
        </svg>
    </span>
                            <span className='text-black font-bold'>{t("account.updateDocInfo.spec")}</span>
                        </label>

                        <select
                            className="border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                            onChange={(e) => setDocData((prev) => ({...prev, speciality: e.target.value}))}
                            value={docData.speciality}
                            required
                            disabled={read}
                        >
                            <option value="" disabled>{t("account.update.spec")}</option>
                            {specialities?.map((item, index) => (
                                <option key={index} value={item.name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-2 flex items-center gap-1">
    <span className="text-primary">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            />
        </svg>
    </span>
                            <span className='text-black font-bold'>{t("account.updateDocInfo.region")}</span>
                        </label>

                        <select
                            className="border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                            onChange={(e) => setDocData((prev) => ({...prev, region: e.target.value}))}
                            value={docData.region}
                            required
                            disabled={read}

                        >
                            <option value="" disabled> {t("account.updateDocInfo.select")}</option>
                            {provinces?.map((item, index) => (
                                <option key={index} value={item.name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-950 font-medium flex items-center gap-1">
        <span className="text-primary">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12c1.104.048 2.104-.14 3-1 1.072-1.073 1.425-2.553 1-4-.349-1.33-1.14-2.384-2-3-.659-.455-1.365-.668-2-1-1.217-.615-2.86-.697-4-.12-.842.392-1.547.981-2 2a3.583 3.583 0 00-.5 1c-1.307 0-2.307.4-3 1a3.615 3.615 0 00-1 2c-.576 1.14-.494 2.783.12 4 .364.635.576 1.341 1 2 .616 1.217 1.903 1.85 3 2 .657.091 1.354.176 2-.12.392-.165.743-.375 1-1"
                />
            </svg>
        </span>
                            <span className='text-black font-bold'>{t("account.updateDoctor.email")}</span>
                        </label>
                        <input
                            onChange={(e) => setAccount((prev) => ({...prev, email: e.target.value}))}
                            value={account?.email}
                            className="border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            type="text"
                            placeholder="Customer Email"
                            disabled

                        />
                    </div>


                    {/*<div className="flex flex-col gap-2">*/}
                    {/*    <label className="text-sm text-gray-950 font-medium">*/}
                    {/*        {t("account.update.role")}*/}
                    {/*    </label>*/}
                    {/*    <select*/}
                    {/*        onChange={(e) => setAccountRole(e.target.value)}*/}
                    {/*        value={accountRole}*/}
                    {/*        disabled={accountRole === 'admin'}*/}
                    {/*        className="border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"*/}
                    {/*    >*/}
                    {/*        <option value="" disabled className="text-gray-400">Change user role</option>*/}
                    {/*        <option value="admin">Admin</option>*/}
                    {/*        <option value="user">User</option>*/}
                    {/*    </select>*/}
                    {/*</div>*/}


                    {/*<div className="flex items-center gap-3 mt-6 lg:mt-0">*/}
                    {/*    <input hidden={isVerify}*/}
                    {/*           type="checkbox"*/}
                    {/*           id="verify-checkbox"*/}
                    {/*           checked={isVerify}*/}
                    {/*           onChange={() => setIsVerify((prev) => !prev)}*/}
                    {/*           className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"*/}
                    {/*           disabled={!(docData.region && docData.speciality && proof)}*/}
                    {/*    />*/}
                    {/*    <label htmlFor="verify-checkbox" className="text-sm font-medium" hidden={isVerify}>*/}
                    {/*        {t("account.updateDocInfo.verify")}*/}
                    {/*    </label>*/}
                    {/*</div>*/}

                    <div className="lg:col-span-2 flex flex-col">
                        <label className="text-sm font-medium mb-2 flex items-center gap-1">
    <span className="text-primary">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.87 0-7 3.13-7 7v1h14v-1c0-3.87-3.13-7-7-7z"
            />
        </svg>
    </span>
                            <span className='text-black font-bold'>{t("account.updateDocInfo.bio")}</span>
                        </label>


                        <textarea
                            className="border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={5}
                            placeholder="Write a brief description of the doctor"
                            onChange={(e) => setDocData((prev) => ({...prev, bio: e.target.value}))}
                            value={docData.bio}
                            required
                            disabled={read}

                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <motion.button
                        type="button"
                        onClick={() => navigate(!un ? '/verified-doc-account' : '/doc-account')}
                        className="bg-red-500 text-white px-6 py-2 rounded-full shadow-md transition"
                        whileHover={{
                            scale: 1.05,
                            backgroundColor: "#DC2626",
                            boxShadow: "0px 4px 15px rgba(220, 38, 38, 0.3)"
                        }}
                        whileTap={{scale: 0.95}}
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.3}}
                    >
                        {t("account.updateDocInfo.back")}
                    </motion.button>

                    {
                        account?.verified ? (
                            <motion.button
                                type="submit"
                                className={`${read ? 'cursor-not-allowed' : 'cursor-pointer'} bg-primary text-white px-6 py-2 rounded-full shadow-md hover:bg-primary-dark transition`}
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                initial={{opacity: 0, y: -10}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.3}}
                                disabled={read}
                            >
                                {t("account.updateDocInfo.save")}
                            </motion.button>
                        ) : (
                            <motion.button
                                type="submit"
                                className="bg-amber-400 text-white px-6 py-2 rounded-full shadow-md hover:bg-amber-500 transition"
                                whileHover={{scale: 1.05, backgroundColor: "#F59E0B"}}
                                whileTap={{scale: 0.95}}
                                initial={{opacity: 0, y: -10}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.3}}
                            >
                                {t("account.updateDocInfo.verify")}
                            </motion.button>
                        )
                    }
                    {/*{*/}
                    {/*    !isFormValid ? (*/}
                    {/*        <motion.button*/}
                    {/*            type="submit"*/}
                    {/*            className={`${read ? 'cursor-not-allowed' : 'cursor-pointer'} bg-primary text-white px-6 py-2 rounded-full shadow-md hover:bg-primary-dark transition`}*/}
                    {/*            whileHover={{scale: 1.05}}*/}
                    {/*            whileTap={{scale: 0.95}}*/}
                    {/*            initial={{opacity: 0, y: -10}}*/}
                    {/*            animate={{opacity: 1, y: 0}}*/}
                    {/*            transition={{duration: 0.3}}*/}
                    {/*            disabled={read}*/}
                    {/*        >*/}
                    {/*            {t("account.updateDocInfo.save")}*/}
                    {/*        </motion.button>*/}
                    {/*    ) : (*/}
                    {/*        <motion.button*/}
                    {/*            type="submit"*/}
                    {/*            className="bg-amber-400 text-white px-6 py-2 rounded-full shadow-md hover:bg-amber-500 transition"*/}
                    {/*            whileHover={{scale: 1.05, backgroundColor: "#F59E0B"}}*/}
                    {/*            whileTap={{scale: 0.95}}*/}
                    {/*            initial={{opacity: 0, y: -10}}*/}
                    {/*            animate={{opacity: 1, y: 0}}*/}
                    {/*            transition={{duration: 0.3}}*/}
                    {/*        >*/}
                    {/*            {t("account.updateDocInfo.verify")}*/}
                    {/*        </motion.button>*/}
                    {/*    )*/}
                    {/*}*/}
                </div>
            </motion.form>

            <ActiveHourListModal open={listModal} onClose={() => setListModal(false)} id={id}/>
            <ViewProofModal open={proofModal} onClose={() => setProofModal(false)} proof={proof}/>
        </div>

    )
        ;
};

export default UpdateDocInfoAcc;
