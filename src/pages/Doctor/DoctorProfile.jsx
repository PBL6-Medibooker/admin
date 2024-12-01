import React, {useContext, useEffect, useState} from 'react';
import {DoctorContext} from "../../context/DoctorContext";
import * as accountService from "../../service/AccountService";
import {motion} from "framer-motion";
import {assets} from "../../assets/assets";
import {toast} from "react-toastify";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import {useQuery} from "@tanstack/react-query";
import * as regionService from "../../service/RegionService";
import * as specialityService from "../../service/SpecialityService";
import bcrypt from 'bcryptjs';
import validator from "validator";

const DoctorProfile = () => {

    const {dToken, logout} = useContext(DoctorContext);
    const [doctorData, setDoctorData] = useState({});
    const [initialDoctorData, setInitialDoctorData] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(false);
    const [docId, setDocId] = useState('')
    const {t} = useTranslation();
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [checkNewPass, setCheckNewPass] = useState('');
    const [hashPass, setHashPass] = useState('');
    const [isOldPassShaking, setIsOldPassShaking] = useState(false);
    const [isNewPassShaking, setIsNewPassShaking] = useState(false);
    const [isMatchPassShaking, setIsMatchPassShaking] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isCNewPasswordVisible, setIsCNewPasswordVisible] = useState(false);



    const getDoctorData = async () => {
        try {
            const result = await accountService.getDoctorProfile(dToken);
            console.log(result)
            if (result.success) {
                setDoctorData(result.profileData)
                setDocId(result.profileData._id)
                setInitialDoctorData(result.profileData)
                setHashPass(result.profileData.password)
            }
        } catch (e) {
            console.log(e);
        }
    };

    const {data: regionData} = useQuery(
        {
            queryKey: ["regions"],
            queryFn: async () => {
                const data = regionService.findAll(false, dToken)
                return data
            }
        }
    )

    const {data: specData} = useQuery(
        {
            queryKey: ["spec"],
            queryFn: async () => {
                const data = await specialityService.findAll(false, dToken);
                return data
            }
        }
    )


    const updateDoctorInfo = async () => {
        console.log('meo')
        const data = {
            speciality: doctorData.speciality_id.name,
            bio: doctorData.bio,
            region: doctorData.region_id.name,
        }

        const result = await accountService.updateDocInfoAcc(data, doctorData._id, dToken);

        if (result?.status === 200) {
            setIsEdit(false)
        } else {
            await Swal.fire({
                position: "top-end",
                title: t("account.updateDocInfo.error"),
                icon: "error",
                showConfirmButton: false,
                timer: 1500
            })
        }
    }
    const isObjectEqual = (obj1, obj2) => {
        if (!obj1 || !obj2) return false;

        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) return false;

        for (let key of keys1) {
            if (obj1[key] !== obj2[key]) return false;
        }

        return true;
    };


    const checkDataChange = () => {
        const originalData = {
            region: initialDoctorData.region_id?.name,
            speciality: initialDoctorData.speciality_id.name,
            bio: initialDoctorData.bio
        }

        const updatedData = {
            region: doctorData.region_id?.name,
            speciality: doctorData.speciality_id.name,
            bio: doctorData.bio
        }

        // const hasRegionChanged = originalData.region !== updatedData.region
        // const hasBioChanged = originalData.bio !== updatedData.bio
        //
        // return hasRegionChanged || hasBioChanged

        return !isObjectEqual(originalData, updatedData);

    }

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
        const match = await bcrypt.compare(oldPass, hashPass);
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
            const data ={
                email: doctorData.email,
                new_password: newPass,
            }
            const result = accountService.changePassword(data,dToken)
            if(result.email){
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


    const updateDoctorProfile = async () => {

        if (checkDataChange()) {
            await updateDoctorInfo();
        }

        try {
            const formData = new FormData();
            formData.append('username', doctorData.username);
            formData.append('phone', doctorData.phone);
            formData.append('underlying_condition', doctorData.underlying_condition);
            formData.append('date_of_birth', doctorData.date_of_birth);
            formData.append('address', doctorData.address);
            if (image) {
                formData.append('profile_image', image);
                setDoctorData((prev) => ({
                    ...prev,
                    profile_image: URL.createObjectURL(image),
                }));
            }

            await accountService.updateCusAcc(formData, doctorData._id, dToken);

            setIsEdit(false)
            await getDoctorData()

            await Swal.fire({
                position: "top-end",
                title: t("doctor.profile.success"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false
            })

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
            const result = await accountService.forgotPassword(doctorData.email, dToken);
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setDoctorData((prev) => ({
                ...prev,
                profile_image: URL.createObjectURL(file),
            }));
        }
    };


    const fadeIn = {
        hidden: {opacity: 0, y: 10},
        visible: {opacity: 1, y: 0, transition: {duration: 0.4}},
    };

    const toggleEditVariant = {
        hidden: {opacity: 0, scale: 0.9},
        visible: {opacity: 1, scale: 1, transition: {duration: 0.3}},
    };

    useEffect(() => {
        if (dToken) {
            getDoctorData();
        }
    }, [dToken]);

    return (
        <div>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="flex flex-col gap-4 m-5 w-[80vw]"
            >
                <motion.div className="flex justify-between gap-4 m-5"
                            variants={fadeIn}
                >
                    <motion.div className="flex flex-1 justify-center ml-8 rounded-lg overflow-hidden"
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
                                                <div className='w-100 h-80'>
                                                <div className='w-100 h-80'>
                                                    <img
                                                        className="h-full w-full object-cover bg-primary/80 sm:max-w-64 rounded-lg"
                                                        src={image ? URL.createObjectURL(image) : doctorData.profile_image}
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
                                                onChange={handleImageChange}
                                                type="file"
                                                id="image"
                                                hidden
                                            />
                                        </label>
                                    ) :
                                    (
                                        <div className='w-100 h-80'>
                                        <img
                                            className="w-full h-full object-cover bg-primary/80 sm:max-w-64 rounded-lg"
                                            src={doctorData.profile_image}
                                            alt="profile"
                                        />
                                    </div>
                                    )
                                }
                            </>)

                        }

                    </motion.div>


                    <motion.div
                        className="flex-3 border w-[50vw] border-stone-100 rounded-lg p-8 py-7 bg-white"
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
                                            className="w-[35px] cursor-pointer absolute right-[296px] top-[33px] transform -translate-y-1/2 hover:scale-110 transition-transform duration-300"
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
                                        className="w-[35px] cursor-pointer absolute right-[296px] top-[33px] transform -translate-y-1/2 hover:scale-110 transition-transform duration-300"
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
                                            className="w-[35px] cursor-pointer absolute right-[296px] top-[33px] transform -translate-y-1/2 hover:scale-110 transition-transform duration-300"
                                            onClick={togglePasswordVisibility3}
                                        />

                                    </motion.div>
                                </motion.div>

                            </> : <>
                                <p className="flex items-center w-full gap-3 text-3xl font-medium text-gray-700">
                                    {isEdit ? (
                                        <motion.input
                                            whileHover={{scale: 1.05}}
                                            type="text"
                                            className="border border-gray-300 rounded-md px-2 py-1 text-2xl font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                            value={doctorData.username}
                                            onChange={(e) =>
                                                setDoctorData((prev) => ({
                                                    ...prev,
                                                    username: e.target.value,
                                                }))
                                            }
                                        />
                                    ) : (
                                        doctorData.username
                                    )}
                                </p>
                                <hr className='bg-zinc-400 h-[1px] border-none mt-2'/>
                                <p className='text-neutral-500 underline mt-3'>{t("doctor.profile.contact")}</p>


                                <p className="text-gray-600 flex gap-1 font-medium mt-4">
                                    Email:
                                    <span className="text-gray-800">
                            <span className="bg-transparent w-full outline-none">
                               {doctorData.email}
                            </span>
                        </span>
                                </p>


                                <p className="flex gap-3 text-gray-600 font-medium mt-4">
                                    {t("doctor.profile.phone")}:
                                    {isEdit ? (
                                        <motion.input
                                            whileHover={{scale: 1.05}}
                                            type="text"
                                            className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                                            value={doctorData.phone || ''}
                                            onChange={(e) =>
                                                setDoctorData((prev) => ({
                                                    ...prev,
                                                    phone: e.target.value,
                                                }))
                                            }
                                        />
                                    ) : (
                                        <span className="text-gray-800">{doctorData.phone || 'N/A'}</span>
                                    )}
                                </p>

                                <p className="flex gap-3 text-gray-600 font-medium mt-4">
                                    {t("doctor.profile.address")}:
                                    {isEdit ? (
                                        <motion.input
                                            whileHover={{scale: 1.05}}
                                            type="text"
                                            className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                                            value={doctorData.address || ''}
                                            onChange={(e) =>
                                                setDoctorData((prev) => ({
                                                    ...prev,
                                                    address: e.target.value,
                                                }))
                                            }
                                        />
                                    ) : (
                                        <span className="text-gray-800">{doctorData.address || 'N/A'}</span>
                                    )}
                                </p>


                                <p className='text-neutral-500 underline mt-3'>{t("doctor.profile.basic")}</p>

                                <p className="flex gap-3 text-black font-medium mt-4">
                                    {t("doctor.profile.spec")}:
                                    {isEdit ? (
                                        <motion.div
                                            initial={{opacity: 0.8}}
                                            whileHover={{scale: 1.05, opacity: 1}}
                                            whileFocus={{scale: 1.1, borderColor: "blue"}}
                                            className="relative"
                                        >
                                            <select
                                                className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                                                onChange={(e) =>
                                                    setDoctorData((prev) => ({
                                                        ...prev,
                                                        speciality_id: {name: e.target.value},
                                                    }))
                                                }
                                                value={doctorData.speciality_id?.name || ""}
                                            >
                                                {specData?.map((spec) => (
                                                    <option key={spec._id} value={spec.name}>
                                                        {spec.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </motion.div>
                                    ) : (
                                        <span className="text-gray-800">{doctorData.speciality_id?.name || 'N/A'}</span>
                                    )}
                                </p>

                                <p className="flex gap-3 text-black font-medium mt-4">
                                    {t("doctor.profile.region")}:
                                    {isEdit ? (
                                        <motion.div
                                            initial={{opacity: 0.8}}
                                            whileHover={{scale: 1.05, opacity: 1}}
                                            whileFocus={{scale: 1.1, borderColor: "blue"}}
                                            className="relative"
                                        >
                                            <select
                                                className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                                                onChange={(e) =>
                                                    setDoctorData((prev) => ({
                                                        ...prev,
                                                        region_id: {name: e.target.value},
                                                    }))
                                                }
                                                value={doctorData.region_id?.name || ""}
                                            >
                                                {regionData.map((region) => (
                                                    <option key={region._id} value={region.name}>
                                                        {region.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </motion.div>
                                    ) : (
                                        <span className="text-gray-800">{doctorData.region_id?.name || "N/A"}</span>
                                    )}
                                </p>

                                <p className="text-gray-600 gap-3 flex font-medium mt-4">
                                    {t("doctor.profile.dob")}:
                                    <span className="text-gray-800">
                            {isEdit ? (
                                <motion.input
                                    whileHover={{scale: 1.05}}
                                    type="date"
                                    className="border rounded px-2 py-1 focus:ring-primary focus:outline-none focus:ring-2"
                                    onChange={(e) => setDoctorData(prev => ({
                                        ...prev,
                                        date_of_birth: e.target.value
                                    }))}
                                    value={doctorData.date_of_birth ? doctorData.date_of_birth.split('T')[0] : ''} // Format the date for input
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
                                    {doctorData.date_of_birth ? new Date(doctorData.date_of_birth).toLocaleDateString('en-GB') : 'N/A'}
                                </motion.span>
                            )}
                        </span>
                                </p>

                                <p className="flex gap-3 text-gray-600 font-medium mt-4">
                                    {t("doctor.profile.bio")}:
                                    {isEdit ? (
                                        <motion.textarea
                                            rows={5}
                                            whileHover={{scale: 1.025}}
                                            className="border rounded px-2 py-1 w-[40vw] focus:outline-none focus:ring-2 focus:ring-primary"
                                            value={doctorData.bio || ''}
                                            onChange={(e) =>
                                                setDoctorData((prev) => ({
                                                    ...prev,
                                                    bio: e.target.value,
                                                }))
                                            }
                                        />
                                    ) : (
                                        <span className="text-gray-800">{doctorData.bio || 'N/A'}</span>
                                    )}
                                </p>
                            </>
                        }


                        {
                            !isChangePassword && <motion.div
                                className="flex justify-end gap-2 mt-5"
                                variants={fadeIn}
                            >
                                {isEdit ? (
                                    <motion.button
                                        onClick={() => updateDoctorProfile()}
                                        className="px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all"
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                    >
                                        {t("doctor.profile.save")}
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        onClick={() => setIsEdit(true)}
                                        className="px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all"
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                    >
                                        {t("doctor.profile.edit")}
                                    </motion.button>
                                )}

                            </motion.div>
                        }

                        {
                            isChangePassword ?
                                <motion.div className='flex justify-end mt-3 mr-72'>
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

export default DoctorProfile;
