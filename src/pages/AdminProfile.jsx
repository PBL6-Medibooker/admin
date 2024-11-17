import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminContext } from "../context/AdminContext";
import * as accountService from "../service/AccountService";
import {assets} from "../assets/assets";

const AdminProfile = () => {
    const { aToken } = useContext(AdminContext);
    const [adminData, setAdminData] = useState({});
    const [isEdit, setIsEdit] = useState(false);

    const [image, setImage] = useState(false);


    const getAdminData = async () => {
        try {
            const result = await accountService.getAdminProfile(aToken);
            console.log(result)
            if (result.success) {
                setAdminData(result.adminData);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (aToken) {
            getAdminData();
        }
    }, [aToken]);

    const fadeIn = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    const toggleEditVariant = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    };

    return adminData && (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="flex flex-col gap-4 m-5 w-[50vw]"
        >
            <motion.div className="flex flex-col gap-4 m-5"
                        variants={fadeIn}
            >
                <motion.div className="rounded-lg overflow-hidden"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                >
                    {isEdit ? (
                        <label htmlFor="image" className="inline-block relative cursor-pointer">
                            <div>
                                <img
                                    className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
                                    src={image ? URL.createObjectURL(image) : adminData.profile_image}
                                    alt="profile"
                                />

                                {!image && (
                                    <motion.div
                                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg"
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
                                accept="image/jpg"
                            />
                        </label>
                    ) : (
                        <img
                            className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
                            src={adminData.profile_image}
                            alt="profile"
                        />
                    )}
                </motion.div>


                <motion.div
                    className="flex-1 border w-[50vw] border-stone-100 rounded-lg p-8 py-7 bg-white"
                    variants={fadeIn}
                >
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
                    <hr className='bg-zinc-400 h-[1px] border-none'/>
                    <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>


                    <p className="text-gray-600 flex gap-1 font-medium mt-4">
                        Email:
                        <span className="text-gray-800">
                            <p className="bg-transparent w-full outline-none">
                               {adminData.email}
                            </p>
                        </span>
                    </p>


                    <p className="flex gap-3 text-gray-600 font-medium mt-4">
                        Phone:
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
                        Address:
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

                    <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>

                    <p className="text-gray-600 gap-3 flex font-medium mt-4">
                        Date of birth:
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


                    <motion.div
                        className="flex justify-end gap-2 mt-5"
                        variants={fadeIn}
                    >
                        {isEdit ? (
                            <motion.button
                                onClick={() => {
                                    setIsEdit(false);
                                }}
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
    );
};

export default AdminProfile;
