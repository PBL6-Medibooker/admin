import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {AdminContext} from "../../context/AdminContext";
import * as accountService from "../../service/AccountService"
import * as adminService from "../../service/AdminService"
import {assets} from "../../assets/assets";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";
import {motion} from 'framer-motion';
import Button from "../../components/button/Button";
import GrantAdminModel from "./GrantAdminModel";
import {RefreshCcwDot, CalendarFold, ArchiveRestore} from 'lucide-react'
import {Tooltip} from "@mui/material";


const AccountDetails = () => {
    const {email} = useParams();
    const {aToken, fullAccess, refetchAdminDetails, adminDetails, readOnly, writeOnly} = useContext(AdminContext);
    // const [account, setAccount] = useState(null);
    const [account, setAccount] = useState({
        username: "",
        phone: "",
        address: "",
        date_of_birth: "",
        underlying_condition: "",
        email: "",
        profile_image: "",
    });

    const [image, setImage] = useState(null);
    const [accountRole, setAccountRole] = useState('')
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const {t} = useTranslation();
    const [gOpen, setGOpen] = useState(false);
    const [read, setRead] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const fetchAccountDetails = async () => {
        try {
            const response = await accountService.getAccDetails(email, aToken);
            console.log(response)
            setAccount(response);
            setUserId(response._id)
            setUserName(response.username)
            setAccountRole(response.role)
            if(readOnly && !writeOnly && !fullAccess){
                setRead(true)
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    const openAccess = async () => {
        try {
            setGOpen(true)
        } catch (e) {
            console.log(e)
        }
    }

    const updateCusAccountData = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('username', account.username);
            formData.append('phone', account.phone);
            formData.append('underlying_condition', account.underlying_condition);
            formData.append('date_of_birth', account.date_of_birth);
            formData.append('address', account.address);
            if (image) formData.append('profile_image', image);


            // if (accountRole !== account.role && accountRole === 'user') {
            //     await changeAccountRole();
            // }

            await accountService.updateCusAcc(formData, account._id, aToken);

            navigate('/account');
            await Swal.fire({
                position: "top-end",
                title: t("account.update.noti"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false
            });

            // formData.forEach((value, key) => {
            //     console.log(`${key}:${value}`);
            // });
        } catch (e) {
            console.log(e);
            toast.error(e.message);
        }
    }


    const resetPass = async () => {
        try {
            console.log(email);
            const result = await accountService.forgotPassword(email, aToken);
            if (result) {
                toast.success(result.message)
            } else {
                toast.error(result.error)
            }

        } catch (e) {
            console.log(e);
        }
    }
    const hoverSettings = (readOnly && !fullAccess && !writeOnly)
        ? {}
        : {
            whileHover: {
                scale: 1.1,
                boxShadow: "0px 8px 20px rgba(0, 166, 169, 0.4)",
            },
            whileTap: {scale: 0.95},
            transition: {type: "spring", stiffness: 300},
        };

    useEffect(() => {

        if (aToken) {
            fetchAccountDetails();
        }
    }, [aToken, email]);

    return (
        <div className='m-5 w-[90vw] h-[100vh]'>
            <motion.div
                className="flex justify-between items-center mb-6"
                initial={{y: -20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{duration: 0.5, delay: 0.1}}
            >
                <motion.p
                    className="text-xl text-primary lg:text-2xl font-semibold mb-4"
                    initial={{x: -50, opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    transition={{duration: 0.6}}
                >
                    {t("account.update.title")}
                </motion.p>

                <div className="flex items-center gap-4 mr-4">


                    {
                        (readOnly && !writeOnly && !fullAccess) && (
                            <Tooltip title={t("common.access.permission")} arrow>
                                <motion.button
                                    className="flex items-center gap-2 px-8 py-3 cursor-not-allowed text-white bg-primary rounded-full shadow-md hover:bg-primary-dark focus:outline-none transition-all"
                                    onClick={resetPass}
                                    {...hoverSettings}
                                    disabled={readOnly && !fullAccess && !writeOnly}
                                >
                                    <RefreshCcwDot/>{t("account.update.reset")}
                                </motion.button>
                            </Tooltip>
                        )
                    }


                    {
                        (fullAccess || writeOnly) && (
                            <motion.button
                                className="flex items-center gap-2 px-8 py-3 text-white bg-primary rounded-full shadow-md hover:bg-primary-dark focus:outline-none transition-all"
                                onClick={resetPass}
                                whileHover={{
                                    scale: 1.1,
                                    boxShadow: "0px 8px 20px rgba(72, 187, 120, 0.5)",
                                }}
                                whileTap={{scale: 0.95}}
                                transition={{type: "spring", stiffness: 300}}
                            >
                                <RefreshCcwDot/>{t("account.update.reset")}
                            </motion.button>

                        )
                    }




                    {
                        (readOnly && !writeOnly && !fullAccess) && (
                            <Tooltip title={t("common.access.permission")} arrow>

                                <motion.button
                                    className="flex items-center gap-2 px-8 py-3 cursor-not-allowed text-gray-700 bg-amber-400 rounded-full shadow-md hover:bg-primary-dark focus:outline-none transition-all"
                                    onClick={() =>
                                        navigate(`/user-appointments/${account._id}`, {
                                            state: {name: account.username},
                                        })
                                    }
                                    {...hoverSettings}
                                    disabled={readOnly && !fullAccess && !writeOnly}
                                >
                                    <CalendarFold/>{t("account.update.appointments")}
                                </motion.button>
                            </Tooltip>
                        )
                    }


                    {
                        (fullAccess || writeOnly) && (
                            <motion.button
                                className="flex items-center gap-2 px-8 py-3 text-gray-700 bg-amber-400 rounded-full shadow-md hover:bg-primary-dark focus:outline-none transition-all"
                                onClick={() =>
                                    navigate(`/user-appointments/${account._id}`, {
                                        state: {name: account.username},
                                    })
                                }
                                whileHover={{
                                    scale: 1.1,
                                    boxShadow: "0px 8px 20px rgba(72, 187, 120, 0.5)",
                                }}
                                whileTap={{scale: 0.95}}
                                transition={{type: "spring", stiffness: 300}}
                            >
                                <CalendarFold/>{t("account.update.appointments")}
                            </motion.button>

                        )
                    }
                </div>
            </motion.div>


            <form onSubmit={updateCusAccountData} className="m-5 w-full max-w-4xl mx-auto">

                <motion.div
                    className="bg-white px-8 py-8 border rounded-xl shadow-md w-full max-h-[80vh] overflow-y-auto"
                    initial={{scale: 0.9, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    transition={{duration: 0.5}}
                >
                    <motion.div
                        className="flex relative items-center gap-6 mb-8 text-gray-500"
                        initial={{x: -50, opacity: 0}}
                        animate={{x: 0, opacity: 1}}
                        transition={{duration: 0.5, delay: 0.2}}
                    >

                        <label htmlFor="doc-img">
                            <motion.img
                                className="w-24 h-24 bg-gray-100 rounded-full cursor-pointer object-cover"
                                src={image ? URL.createObjectURL(image) : account?.profile_image || assets.patients_icon}
                                alt="Upload Area"
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
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

                        <div className="absolute right-0">
                            {/*<Button onClick={openChangeRoleModal} t={t("account.update.crole")}/>*/}
                            {
                                fullAccess &&
                                <Button onClick={openAccess} t={t("account.update.crole")}/>
                            }
                        </div>

                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-gray-600"
                        initial={{y: 20, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        transition={{duration: 0.5, delay: 0.3}}
                    >
                        <div className="flex flex-col gap-4">

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-black font-bold">{t("account.update.username")}
                                </label>
                                {/*<input*/}
                                {/*    onChange={(e) => setAccount(prev => ({...prev, username: e.target.value}))}*/}
                                {/*    value={account?.username}*/}
                                {/*    className="border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"*/}
                                {/*    type="text"*/}
                                {/*    placeholder="Customer Name"*/}
                                {/*    required*/}
                                {/*    autoFocus*/}
                                {/*/>*/}

                                <input
                                    onChange={(e) => setAccount(prev => ({
                                        ...prev,
                                        username: e.target.value || ""
                                    }))}
                                    value={account?.username || ""}
                                    className="border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    type="text"
                                    placeholder="bevis"
                                    required
                                    autoFocus
                                    disabled={read}
                                />

                            </div>


                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-black font-bold">
                                    {t("account.update.address")}
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
                                    required
                                    disabled={read}

                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-black font-bold">
                                    {t("account.update.dob")}
                                </label>
                                <input
                                    id="date_of_birth"
                                    onChange={(e) => setAccount(prev => ({
                                        ...prev,
                                        date_of_birth: e.target.value
                                    }))}
                                    // value={account?.date_of_birth ? new Date(account.date_of_birth).toISOString().split('T')[0] : ''}
                                    value={account?.date_of_birth ? new Date(account.date_of_birth).toISOString().split('T')[0] : ""}

                                    className="border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    type="date"
                                    required
                                    disabled={read}

                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-black font-bold">
                                    {t("account.update.email")}
                                </label>
                                <input
                                    onChange={(e) => setAccount(prev => ({...prev, email: e.target.value}))}
                                    value={account?.email}
                                    className="border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    type="text"
                                    placeholder="Customer Email"
                                    disabled

                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-black font-bold">
                                    {t("account.update.phone")}
                                </label>
                                <input
                                    onChange={(e) => setAccount(prev => ({...prev, phone: e.target.value || ""}))}
                                    value={account?.phone || ""}
                                    className="border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    type="text"
                                    placeholder="Customer Phone Number"
                                    required
                                    disabled={read}

                                />

                                {/*<input*/}
                                {/*    onChange={(e) => setAccount(prev => ({...prev, phone: e.target.value}))}*/}
                                {/*    value={account?.phone}*/}
                                {/*    className="border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"*/}
                                {/*    type="text"*/}
                                {/*    placeholder="Customer Phone Number"*/}
                                {/*    required*/}
                                {/*/>*/}
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
                        </div>

                    </motion.div>

                    <motion.div
                        className="mt-5 text-gray-600"
                        initial={{y: 20, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        transition={{duration: 0.5, delay: 0.3}}
                    >
                        <div className="w-full flex flex-col gap-2">
                            <label className="text-sm text-black font-bold">
                                {t("account.update.underlying")}
                            </label>
                            <textarea
                                onChange={(e) => setAccount(prev => ({
                                    ...prev,
                                    underlying_condition: e.target.value
                                }))}
                                value={account?.underlying_condition}
                                className="border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                rows={5}
                                placeholder="Underlying Condition"
                                required
                                disabled={read}

                            />
                        </div>
                    </motion.div>


                    <motion.div
                        className="flex justify-end gap-6 mt-6"
                        initial={{y: 20, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        transition={{duration: 0.5, delay: 0.4}}
                    >
                        <motion.button
                            onClick={() => navigate("/account")}
                            className="bg-gray-300 px-6 py-3 text-sm text-gray-700 font-bold rounded-full hover:bg-gray-400 transition-all"
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            {t("account.update.back")}
                        </motion.button>

                        <motion.button
                            type="submit"
                            className={`${read? 'cursor-not-allowed' : 'cursor-pointer'} bg-primary px-6 py-3 text-sm text-white font-bold rounded-full hover:bg-primary-dark transition-all`}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                            disabled={read}

                        >
                            {t("account.update.save")}
                        </motion.button>
                    </motion.div>
                </motion.div>
            </form>

            <GrantAdminModel open={gOpen} id={userId} onClose={() => setGOpen(false)}/>
        </div>
    );
};

export default AccountDetails;
