import React, {useContext, useEffect, useState} from 'react';
import {DoctorContext} from "../../context/DoctorContext";
import * as accountService from "../../service/AccountService";
import {motion} from "framer-motion";
import {assets} from "../../assets/assets";
import {toast} from "react-toastify";

const DoctorProfile = () => {
    const {dToken} = useContext(DoctorContext);

    const [doctorData, setDoctorData] = useState({});
    const [isEdit, setIsEdit] = useState(false);

    const [image, setImage] = useState(false);
    const [docId, setDocId] = useState('')



    const getDoctorData = async () => {
        try {
            const result = await accountService.getDoctorProfile(dToken);
            console.log(result)
            if (result.success) {
                setDoctorData(result.profileData)
                setDocId(result.profileData._id)
            }
        } catch (e) {
            console.log(e);
        }
    };


    const updateDoctorInfo = async () => {

    }

    const updateDoctorProfile = async () => {

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

            toast.success('Updated Doctor Information');
            setIsEdit(false)
            await getDoctorData()

            formData.forEach((value, key) => {
                console.log(`${key}:${value}`);
            });
        } catch (e) {
            console.log(e);
            toast.error(e.message);
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
                        ) : (
                            <div className='w-100 h-80'>
                                <img
                                    className="w-full h-full object-cover bg-primary/80 sm:max-w-64 rounded-lg"
                                    src={doctorData.profile_image}
                                    alt="profile"
                                />
                            </div>
                        )}
                    </motion.div>


                    <motion.div
                        className="flex-3 border w-[50vw] border-stone-100 rounded-lg p-8 py-7 bg-white"
                        variants={fadeIn}
                    >
                        <p className="flex items-center w-full gap-3 text-3xl font-medium text-gray-700">
                            {isEdit ? (
                                <input
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
                        <hr className='bg-zinc-400 h-[1px] border-none'/>
                        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>


                        <p className="text-gray-600 flex gap-1 font-medium mt-4">
                            Email:
                            <span className="text-gray-800">
                            <p className="bg-transparent w-full outline-none">
                               {doctorData.email}
                            </p>
                        </span>
                        </p>


                        <p className="flex gap-3 text-gray-600 font-medium mt-4">
                            Phone:
                            {isEdit ? (
                                <motion.input
                                    type="text"
                                    className="border rounded px-2 py-1"
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
                            Address:
                            {isEdit ? (
                                <motion.input
                                    type="text"
                                    className="border rounded px-2 py-1"
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


                        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>

                        <p className="flex gap-3 text-gray-600 font-medium mt-4">
                            Speciality:
                            {isEdit ? (
                                <motion.input
                                    rows={5}
                                    className="border rounded px-2 py-1"
                                    value={doctorData.speciality_id.name || ''}
                                    onChange={(e) =>
                                        setDoctorData((prev) => ({
                                            ...prev,
                                            speciality: e.target.value,
                                        }))
                                    }
                                />
                            ) : (
                                <span className="text-gray-800">{doctorData.speciality_id?.name || 'N/A'}</span>
                            )}
                        </p>

                        <p className="flex gap-3 text-gray-600 font-medium mt-4">
                            Region:
                            {isEdit ? (
                                <motion.input
                                    rows={5}
                                    className="border rounded px-2 py-1"
                                    value={doctorData.speciality_id.name || ''}
                                    onChange={(e) =>
                                        setDoctorData((prev) => ({
                                            ...prev,
                                            speciality: e.target.value,
                                        }))
                                    }
                                />
                            ) : (
                                <span className="text-gray-800">{doctorData.region_id?.name || 'N/A'}</span>
                            )}
                        </p>

                        <p className="text-gray-600 gap-3 flex font-medium mt-4">
                            Date of birth:
                            <span className="text-gray-800">
                            {isEdit ? (
                                <motion.input
                                    type="date"
                                    className="border rounded px-2 py-1"
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
                            Bio:
                            {isEdit ? (
                                <motion.textarea
                                    rows={5}
                                    className="border rounded px-2 py-1 w-[40vw]"
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


                        <motion.div
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
                                    Save
                                </motion.button>
                            ) : (
                                <motion.button
                                    onClick={() => setIsEdit(true)}
                                    className="px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all"
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                >
                                    Edit
                                </motion.button>
                            )}
                        </motion.div>

                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default DoctorProfile;
