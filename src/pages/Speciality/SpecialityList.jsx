import React, {useContext, useEffect, useState} from 'react';
import * as specialityService from "../../service/SpecialityService"
import {useLocation, useNavigate} from "react-router-dom";
import {FaRegTrashAlt} from "react-icons/fa";
import Modal from "../../components/Modal/Modal";
import {toast} from "react-toastify";
import {AdminContext} from "../../context/AdminContext";
import {AnimatePresence, motion} from "framer-motion";


const SpecialityList = () => {
    const {aToken} = useContext(AdminContext);
    const navigate = useNavigate();
    const [specialities, setSpecialities] = useState([]);
    const [hiddenState, setHiddenState] = useState(false);
    const [open, setOpen] = useState(false);


    const [selectedSpecialityIds, setSelectedSpecialityIds] = useState([]);

    const [image, setImage] = useState(null)


    const location = useLocation();
    const {imageUpdated} = location.state || {};


    const findAllSpecialities = async () => {
        const result = await specialityService.findAll(hiddenState, aToken)
        setImage(result.speciality_image)
        setSpecialities(result);
    }

    const toggleAccountSelection = (id) => {
        setSelectedSpecialityIds((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((specId) => specId !== id)
                : [...prevSelected, id]
        );
        console.log(selectedSpecialityIds)
    };

    const openDeleteModal = () => {
        if (selectedSpecialityIds?.length === 0) {
            toast.warn('No speciality selected for deletion')
        } else {
            setOpen(true)
        }

    }
    const softDeleteRegions = async () => {
        if (selectedSpecialityIds?.length === 0 && open) {
            toast.warn('No speciality selected for deletion')
            return;
        }
        try {
            await specialityService.deleteSoftSpeciality(selectedSpecialityIds, aToken)
            await findAllSpecialities();
            toast.success('Delete Successful');
            setSelectedSpecialityIds([]);
            setOpen(false)
        } catch (error) {
            console.error(error.message);
            toast.error(error.message)
        }
    };

    useEffect(() => {
        if(aToken){
            findAllSpecialities()
        }

    }, [imageUpdated, aToken]);


    return (
        <div className='m-5 h-full w-[90vw] overflow-y-scroll'>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg text-primary lg:text-2xl font-medium'>All Specialities</h1>
                <div className='flex gap-3 mr-2'>

                    <motion.button
                        onClick={() => navigate(`/add-speciality`)}
                        className='bg-primary px-10 py-3 mt-4 text-white rounded-full'
                        whileHover={{scale: 1.05, boxShadow: '0px 4px 8px rgba(0,0,0,0.2)'}}
                        whileTap={{scale: 0.95}}
                        transition={{duration: 0.2}}
                    >
                        Add Speciality
                    </motion.button>

                    <motion.button
                        className='flex items-center gap-2 px-10 py-3 mt-4 rounded-full text-white bg-red-600 shadow-red-400/40 cursor-pointer'
                        onClick={openDeleteModal}
                        whileHover={{scale: 1.05, boxShadow: '0px 4px 8px rgba(255, 0, 0, 0.4)'}}
                        whileTap={{scale: 0.95}}
                        transition={{duration: 0.2}}
                    >
                        <FaRegTrashAlt/> Delete
                    </motion.button>


                    <motion.button
                        className='flex items-center gap-2 px-10 py-3 mt-4 rounded-full text-white bg-gray-500 shadow-red-400/40 cursor-pointer'
                        onClick={() => navigate('/restore-speciality')}
                        whileHover={{scale: 1.05, boxShadow: '0px 4px 8px rgba(0,0,0,0.2)'}}
                        whileTap={{scale: 0.95}}
                        transition={{duration: 0.2}}
                    >
                        <FaRegTrashAlt/> Trash
                    </motion.button>
                </div>
            </div>


            <motion.div
                className='w-full flex flex-wrap gap-4 pt-5 pb-5 gap-y-6'
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {opacity: 0},
                    visible: {opacity: 1, transition: {staggerChildren: 0.1}}
                }}
            >
                {specialities?.map((item, index) => (
                    <motion.div
                        className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group'
                        key={index}
                        whileHover={{scale: 1.05, boxShadow: '0px 4px 10px rgba(0,0,0,0.2)'}}
                        variants={{
                            hidden: {opacity: 0, y: 20},
                            visible: {opacity: 1, y: 0}
                        }}
                        transition={{duration: 0.3}}
                    >
                        <div
                            className='relative w-56 h-56  bg-indigo-50 group rounded-xl overflow-hidden cursor-pointer'>
                            <img
                                className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-80"
                                src={`${item.speciality_image}?t=${new Date().getTime()}`}
                                alt="Speciality"
                            />


                            <button
                                onClick={() => navigate(`/get-speciality/${item._id}`)}
                                className='absolute inset-0 flex items-center justify-center bg-primary/75 text-white text-lg font-semibold py-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                            >
                                Edit
                            </button>
                        </div>
                        <div className='p-4'>
                            <div className='flex justify-end'>
                                <input
                                    type='checkbox'
                                    checked={selectedSpecialityIds.includes(item._id)}
                                    onChange={() => toggleAccountSelection(item._id)}
                                />
                            </div>
                            <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                            <p className='text-zinc-600 text-sm'>{item.description}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Delete Modal */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 flex justify-center items-center bg-black/50 z-50"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        <motion.div
                            className="bg-white rounded-lg p-6 shadow-lg w-96"
                            initial={{scale: 0.8, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.8, opacity: 0}}
                        >
                            <FaRegTrashAlt size={56} className="mx-auto text-red-500"/>
                            <h3 className="text-lg font-black text-gray-800 text-center mt-4">
                                Confirm Delete
                            </h3>
                            <p className="text-sm text-gray-600 text-center">
                                Are you sure you want to delete?
                            </p>
                            <div className="flex gap-4 mt-6">
                                <button
                                    className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 shadow-md shadow-red-400/40 hover:from-red-600 hover:to-red-800 py-2 rounded-md transition duration-150"
                                    onClick={softDeleteRegions}
                                >
                                    Delete
                                </button>
                                <button
                                    className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SpecialityList;
