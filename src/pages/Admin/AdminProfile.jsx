import React, {useContext, useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {AdminContext} from "../../context/AdminContext";
import * as accountService from "../../service/AccountService";
import {assets} from "../../assets/assets";
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";
import Swal from "sweetalert2";
import bcrypt from "bcryptjs";
import validator from "validator";
import {useQuery} from "@tanstack/react-query";
import Loader from "../../components/Loader";
import Error from "../../components/Error";

const AdminProfile = () => {
    const {aToken, logout} = useContext(AdminContext);
    const [isEdit, setIsEdit] = useState(false);
    const {t} = useTranslation();
    const [image, setImage] = useState(false);
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [checkNewPass, setCheckNewPass] = useState('');
    const [isOldPassShaking, setIsOldPassShaking] = useState(false);
    const [isNewPassShaking, setIsNewPassShaking] = useState(false);
    const [isMatchPassShaking, setIsMatchPassShaking] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isCNewPasswordVisible, setIsCNewPasswordVisible] = useState(false);
    const [adminData, setAdminData] = useState([]);

    // const getAdminData = async () => {
    //     try {
    //         const result = await accountService.getAdminProfile(aToken);
    //         console.log(result)
    //         if (result.success) {
    //             setAdminData(result.adminData);
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    // };

    const {isLoading, isError, refetch} = useQuery({
        queryKey: ['admin'],
        queryFn: async () => {
            try {
                const result = await accountService.getAdminProfile(aToken);
                if (result.success) {
                    console.log(result)
                    setAdminData(result.adminData)
                    return result.adminData;
                }
            } catch (error) {
                if (error.response.data.error === "Request not authorized") {
                    Swal.fire({
                        icon: "warning",
                        title: "Session expired",
                        text: "You will be logged out.",
                        timer: 2000,
                        showConfirmButton: false,
                    }).then(() => {
                        logout()
                    });
                } else {
                    console.log("Error fetching doctor data:", error);
                }
            }
        },
        onError: (error) => {
            console.error('Error:', error.message);
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });


    const showAlert = async (titleKey, icon = "warning") => {
        await Swal.fire({
            position: "top-end",
            title: t(titleKey),
            icon: icon,
            showConfirmButton: false,
            timer: 1500,
            backdrop: false,
            width: '500px',
            customClass: {
                popup: 'bg-white text-black p-4 rounded-lg shadow-md max-w-xs',
                title: 'text-lg font-semibold',
                icon: 'w-12 h-12',
            }
        });
    };


    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }

    const togglePasswordVisibility2 = () => {
        setIsNewPasswordVisible(!isNewPasswordVisible);
    }

    const togglePasswordVisibility3 = () => {
        setIsCNewPasswordVisible(!isCNewPasswordVisible);
    }

    const changePassword = async () => {
        const match = await bcrypt.compare(oldPass, adminData.password);
        console.log(match)

        if (!match) {
            setIsOldPassShaking(true);
            setTimeout(() => setIsOldPassShaking(false), 500);
            await showAlert("doctor.profile.wpass");
            return;
        }

        if (!validator.isStrongPassword(newPass)) {
            setIsNewPassShaking(true);
            setTimeout(() => setIsNewPassShaking(false), 500);
            await showAlert("doctor.profile.strong");
            return;
        }

        if (newPass !== checkNewPass) {
            setIsMatchPassShaking(true);
            setTimeout(() => setIsMatchPassShaking(false), 500);
            await showAlert("doctor.profile.match");
            return;
        }

        try {
            const data = {
                email: adminData.email,
                new_password: newPass,
            }
            const result = accountService.changePassword(data, aToken)
            if (result.email) {
                setIsChangePassword(false)
                await Swal.fire({
                    position: "top-end",
                    title: t("doctor.profile.csuccess"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    const resetPass = async () => {
        try {
            const result = await accountService.forgotPassword(adminData.email, aToken);
            if (result) {

                await Swal.fire({
                    position: "top-end",
                    title: t("doctor.profile.rsuccess"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop: false
                })

                setTimeout(() => {
                    logout();
                }, 3000);
            } else {
                toast.error(result.error)
            }

        } catch (e) {
            console.log(e);
        }
    }

    const updateAdminProfile = async () => {

        try {
            const formData = new FormData();
            formData.append('username', adminData.username);
            formData.append('phone', adminData.phone);
            formData.append('underlying_condition', adminData.underlying_condition);
            formData.append('date_of_birth', adminData.date_of_birth);
            formData.append('address', adminData.address);
            if (image) {
                formData.append('profile_image', image);
                setAdminData((prev) => ({
                    ...prev,
                    profile_image: URL.createObjectURL(image),
                }));
            }

            await accountService.updateCusAcc(formData, adminData._id, aToken);

            setIsEdit(false)
            // await getAdminData()
            refetch()
            await Swal.fire({
                position: "top-end",
                title: t("adminProfile.success"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });

            // formData.forEach((value, key) => {
            //     console.log(`${key}:${value}`);
            // });
        } catch (e) {
            console.log(e);
            toast.error(e.message);
        }
    }


    useEffect(() => {
        if (aToken) {
            refetch();
            console.log(aToken)
        }
    }, [aToken]);

    const fadeIn = {
        hidden: {opacity: 0, y: 10},
        visible: {opacity: 1, y: 0, transition: {duration: 0.4}},
    };

    const toggleEditVariant = {
        hidden: {opacity: 0, scale: 0.9},
        visible: {opacity: 1, scale: 1, transition: {duration: 0.3}},
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-screen bg-opacity-75 fixed top-0 left-0 z-50">
                <Loader/>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <Error/>
            </div>
        )
    }


    return adminData && (
        <div>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="flex flex-col gap-4 m-5 w-[100vw]"
            >
                <motion.div className="flex flex-col gap-4 m-5"
                            variants={fadeIn}
                >
                    <motion.div className="rounded w-full-lg w-full overflow-hidden"
                                whileHover={{scale: 1.02}}
                                transition={{duration: 0.2}}
                    >
                        {
                            isChangePassword ?
                                <div className='w-[300px] h-[200px] bg-green-600'>
                                    <img
                                        className="w-full h-full object-cover bg-primary/80 sm:max-w-64 rounded-lg"
                                        src={assets.admin_logo}
                                        alt="profile"
                                    />
                                </div>
                                : (
                                    <>
                                        {isEdit ? (
                                            <label htmlFor="image" className="inline-block relative cursor-pointer">
                                                <div className='w-400 h-80'>
                                                    <div className='w-400 h-80'>
                                                        <img
                                                            className="w-full h-full object-cover bg-primary/80 sm:max-w-64 rounded-lg"
                                                            src={image ? URL.createObjectURL(image) : adminData.profile_image}
                                                            alt="profile"
                                                        />
                                                    </div>

                                                    {!image && (
                                                        <motion.div
                                                            className="absolute w-100 h-80 inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg"
                                                            whileHover={{opacity: 0.8}}
                                                            transition={{duration: 0.3}}
                                                        >
                                                            <img
                                                                className="w-10 opacity-75"
                                                                src={assets.upload_icon}
                                                                alt="upload icon"
                                                            />
                                                        </motion.div>
                                                    )}

                                                </div>

                                                <input
                                                    onChange={(e) => setImage(e.target.files[0])}
                                                    type="file"
                                                    id="image"
                                                    hidden
                                                    // accept="image/jpg"
                                                />
                                            </label>
                                        ) : (
                                            <div className='w-100 h-80'>
                                                <img
                                                    className="w-full h-full object-cover bg-primary/80  sm:max-w-64 rounded-lg"
                                                    src={`${adminData.profile_image}?remove-bg=true`}
                                                    alt="profile"
                                                />
                                            </div>
                                        )}
                                    </>)
                        }
                    </motion.div>


                    <motion.div
                        className="flex-1 border w-[50vw] border-stone-100 rounded-lg p-8 py-7 bg-white"
                        variants={fadeIn}
                    >

                        {
                            isChangePassword ? <>
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{delay: 0.6, duration: 0.5}}
                                    className="mb-6"
                                >
                                    <label htmlFor="health-issue"
                                           className="block text-lg font-medium text-primary mb-2">
                                        {t("doctor.profile.old")}
                                    </label>
                                    <motion.div className="flex items-center space-x-3 relative">
                                        <motion.input
                                            id="old-pass"
                                            value={oldPass}
                                            onChange={(e) => setOldPass(e.target.value)}
                                            className={`w-[400px] p-3 mt-2 border border-gray-300 rounded-lg shadow-sm hover:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isOldPassShaking ? 'shake' : ''}`}
                                            required
                                            aria-required="true"
                                            type={isPasswordVisible ? 'text' : 'password'}
                                            transition={{duration: 0.4}}
                                            tabIndex='1'
                                        />
                                        <motion.img
                                            id='eye-icon'
                                            src={isPasswordVisible ? assets.open : assets.close}
                                            alt="close"
                                            className="w-[25px] cursor-pointer absolute right-[296px] top-[33px] transform -translate-y-1/2 hover:scale-110 transition-transform duration-300"
                                            onClick={togglePasswordVisibility}
                                        />
                                    </motion.div>


                                </motion.div>


                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{delay: 0.6, duration: 0.5}}
                                    className="mb-6"
                                >
                                    <label htmlFor="health-issue"
                                           className="block text-lg font-medium text-primary mb-2">
                                        {t("doctor.profile.new")}
                                    </label>
                                    <motion.div className="flex items-center space-x-3 relative">
                                        <input
                                            id="health-issue"
                                            value={newPass}
                                            onChange={(e) => setNewPass(e.target.value)}
                                            className={`w-[400px] p-3 mt-2 border border-gray-300 rounded-lg shadow-sm hover:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isNewPassShaking ? 'shake' : ''}`}
                                            required
                                            aria-required="true"
                                            tabIndex='2'
                                        />
                                        <motion.img
                                            id='eye-icon'
                                            src={isNewPasswordVisible ? assets.open : assets.close}
                                            alt="close"
                                            className="w-[25px] cursor-pointer absolute right-[296px] top-[33px] transform -translate-y-1/2 hover:scale-110 transition-transform duration-300"
                                            onClick={togglePasswordVisibility2}
                                        />
                                    </motion.div>
                                </motion.div>

                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{delay: 0.6, duration: 0.5}}

                                    className="mb-6"
                                >
                                    <label htmlFor="health-issue"
                                           className="block text-lg font-medium text-primary mb-2">
                                        {t("doctor.profile.cnew")}
                                    </label>
                                    <motion.div className="flex items-center space-x-3 relative">
                                        <input
                                            id="health-issue"
                                            disabled={!newPass}
                                            value={checkNewPass}
                                            onChange={(e) => setCheckNewPass(e.target.value)}
                                            className={`w-[400px] p-3 mt-2 border border-gray-300 rounded-lg shadow-sm hover:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isMatchPassShaking ? 'shake' : ''}`}
                                            required
                                            aria-required="true"
                                            tabIndex='3'
                                        />
                                        <motion.img
                                            id='eye-icon'
                                            src={isCNewPasswordVisible ? assets.open : assets.close}
                                            alt="close"
                                            className="w-[25px] cursor-pointer absolute right-[296px] top-[33px] transform -translate-y-1/2 hover:scale-110 transition-transform duration-300"
                                            onClick={togglePasswordVisibility3}
                                        />
                                    </motion.div>
                                </motion.div>

                            </> : <>

                                <p className="flex items-center w-full gap-3 text-3xl font-medium text-gray-700">
                                    {isEdit ? (
                                        <input
                                            type="text"
                                            className="border border-gray-300 rounded-md px-2 py-1 text-2xl font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                            value={adminData.username}
                                            onChange={(e) =>
                                                setAdminData((prev) => ({
                                                    ...prev,
                                                    username: e.target.value,
                                                }))
                                            }
                                        />
                                    ) : (
                                        adminData.username
                                    )}
                                </p>

                                <hr className='bg-zinc-400 h-[1px] border-none mt-2'/>
                                <p className='text-neutral-500 underline mt-3'>{t("adminProfile.contact")}</p>


                                <p className="text-gray-600 flex gap-1 font-medium mt-4">
                                    Email:
                                    <span className="text-gray-800">
                            <span className="bg-transparent w-full outline-none">
                               {adminData.email}
                            </span>
                        </span>
                                </p>


                                <p className="flex gap-3 text-gray-600 font-medium mt-4">
                                    {t("adminProfile.phone")}:
                                    {isEdit ? (
                                        <motion.input
                                            type="text"
                                            className="border rounded px-2 py-1"
                                            value={adminData.phone || ''}
                                            onChange={(e) =>
                                                setAdminData((prev) => ({
                                                    ...prev,
                                                    phone: e.target.value,
                                                }))
                                            }
                                        />
                                    ) : (
                                        <span className="text-gray-800">{adminData.phone || 'N/A'}</span>
                                    )}
                                </p>

                                <p className="flex gap-3 text-gray-600 font-medium mt-4">
                                    {t("adminProfile.address")}:
                                    {isEdit ? (
                                        <motion.input
                                            type="text"
                                            className="border rounded px-2 py-1"
                                            value={adminData.address || ''}
                                            onChange={(e) =>
                                                setAdminData((prev) => ({
                                                    ...prev,
                                                    address: e.target.value,
                                                }))
                                            }
                                        />
                                    ) : (
                                        <span className="text-gray-800">{adminData.address || 'N/A'}</span>
                                    )}
                                </p>

                                <p className='text-neutral-500 underline mt-3'>{t("adminProfile.basic")}</p>

                                <p className="text-gray-600 gap-3 flex font-medium mt-4">
                                    {t("adminProfile.dob")}:
                                    <span className="text-gray-800">
                            {isEdit ? (
                                <motion.input
                                    type="date"
                                    className="border rounded px-2 py-1"
                                    onChange={(e) => setAdminData(prev => ({
                                        ...prev,
                                        date_of_birth: e.target.value
                                    }))}
                                    value={adminData.date_of_birth ? adminData.date_of_birth.split('T')[0] : ''} // Format the date for input
                                    variants={toggleEditVariant}
                                    initial="hidden"
                                    animate="visible"
                                />
                            ) : (
                                <motion.span
                                    variants={toggleEditVariant}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {adminData.date_of_birth ? new Date(adminData.date_of_birth).toLocaleDateString('en-GB') : 'N/A'}
                                </motion.span>
                            )}
                        </span>
                                </p>
                            </>
                        }


                        {
                            !isChangePassword && <motion.div
                                className="flex justify-end gap-2 mt-5"
                                variants={fadeIn}
                            > {isEdit ? (
                                <motion.button
                                    onClick={() => {
                                        updateAdminProfile() &&
                                        setIsEdit(false);
                                    }}
                                    className="px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all"
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                >
                                    {t("adminProfile.save")}
                                </motion.button>
                            ) : (
                                <motion.button
                                    onClick={() => setIsEdit(true)}
                                    className="w-[120px] px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all"
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                >
                                    {t("adminProfile.edit")}
                                </motion.button>
                            )
                            }
                            </motion.div>
                        }


                        {
                            isChangePassword ?

                                <motion.div className='flex justify-end mt-3 mr-72 gap-2'>
                                    <motion.button
                                        onClick={() => setIsChangePassword(false)}
                                        className="px-4 py-1 border border-red-600 text-sm rounded-full hover:bg-red-700 hover:text-white transition-all"
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                    >
                                        {t("doctor.profile.cancel")}
                                    </motion.button>

                                    <motion.button
                                        onClick={changePassword}
                                        className="px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all"
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                    >
                                        {t("doctor.profile.save")}
                                    </motion.button>
                                </motion.div>
                                :
                                <motion.div className='flex justify-end mt-3 gap-2'>
                                    <motion.button
                                        onClick={() => setIsChangePassword(!isChangePassword)}
                                        className="text-primary text-sm transition-all italic"
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                    >
                                        {t("doctor.profile.change")}
                                    </motion.button>
                                    |
                                    <motion.button
                                        onClick={resetPass}
                                        className="text-primary text-sm transition-all italic"
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                    >
                                        {t("doctor.profile.forgot")}
                                    </motion.button>
                                </motion.div>
                        }


                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AdminProfile;
