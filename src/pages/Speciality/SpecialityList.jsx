import React, {useContext, useEffect, useState} from 'react';
import * as specialityService from "../../service/SpecialityService"
import { useNavigate} from "react-router-dom";
import {FaRegTrashAlt} from "react-icons/fa";
import Modal from "../../components/Modal";
import {toast} from "react-toastify";
import {AdminContext} from "../../context/AdminContext";


const SpecialityList = () => {
    const {aToken} = useContext(AdminContext);
    const navigate = useNavigate();
    const [specialities, setSpecialities] = useState([]);
    const [hiddenState, setHiddenState] = useState(false);
    const [open, setOpen] = useState(false);


    const [selectedSpecialityIds, setSelectedSpecialityIds] = useState([]);


    const findAllSpecialities = async () => {
        const result = await specialityService.findAll(hiddenState, aToken)
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
            findAllSpecialities();
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
    }, [aToken]);

    return (
        <div className='m-5 max-h-[90h] w-[90vw] overflow-y-scroll'>


            <div className='flex justify-between items-center'>

                <h1 className='text-lg font-medium'>All Specialities</h1>

                <div className='flex gap-1'>
                    <button
                        onClick={() => navigate(`/add-speciality`)}
                        className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>
                        Add Speciality
                    </button>

                    <button
                        className='flex items-center gap-2 px-10 py-3 mt-4 rounded-full text-white bg-red-600 shadow-red-400/40 cursor-pointer'
                        onClick={openDeleteModal}>
                        <FaRegTrashAlt/> Delete
                    </button>


                    <button
                        className='flex items-center gap-2 px-10 py-3 mt-4 rounded-full text-white bg-gray-500 shadow-red-400/40 cursor-pointer'
                        onClick={() => navigate('/restore-speciality')}>
                        <FaRegTrashAlt/> Trash
                    </button>
                </div>

            </div>

            <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
                {specialities?.map((item, index) => {
                    return (
                        <div
                            className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group'
                            key={index}

                        >
                            <div className='relative w-56 bg-indigo-50 group rounded-xl overflow-hidden cursor-pointer'>
                                <img
                                    className='w-full transition-all duration-500 group-hover:opacity-80'
                                    // src={`data:image/png;base64,${item.speciality_image}`}
                                    src={item.speciality_image}
                                    alt='img'
                                />
                                {/* Edit button appears on hover */}
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
                                        onChange={(e) => {
                                            toggleAccountSelection(item._id);
                                        }}
                                    />
                                </div>
                                <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                                <p className='text-zinc-600 text-sm'>{item.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>


            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-center w-72">
                    <FaRegTrashAlt size={56} className="mx-auto text-red-500"/>
                    <div className="mx-auto my-4 w-60">
                        <h3 className="text-lg font-black text-gray-800">Confirm Delete</h3>
                        <p className="text-sm text-gray-600">
                            Are you sure you want to delete ?
                        </p>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button
                            className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 shadow-md shadow-red-400/40 hover:from-red-600 hover:to-red-800 py-2 rounded-md transition duration-150"
                            onClick={softDeleteRegions}>Delete
                        </button>
                        <button
                            className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>


        </div>
    );
};

export default SpecialityList;
