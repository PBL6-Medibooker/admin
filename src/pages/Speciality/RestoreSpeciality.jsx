import React, {useContext, useEffect, useState} from 'react';
import {AdminContext} from "../../context/AdminContext";
import {useNavigate} from "react-router-dom";
import * as specialityService from "../../service/SpecialityService";
import {toast} from "react-toastify";
import {FaRegTrashAlt} from "react-icons/fa";
import Modal from "../../components/Modal/Modal";
import axios from "axios";
import {assets} from "../../assets/assets";

const RestoreSpeciality = () => {
    const {aToken} = useContext(AdminContext);
    const [specialities, setSpecialities] = useState([]);

    const [hiddenState, setHiddenState] = useState(true);
    const [open, setOpen] = useState(false);

    const [selectedSpecialityIds, setSelectedSpecialityIds] = useState([]);

    const findAllDeletedSpecialities = async () => {
        const result = await specialityService.findAllDeleted(hiddenState.toString(), aToken)
        setSpecialities(result);
        console.log(hiddenState)

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
    const permanentSpecialityRegions = async () => {
        if (selectedSpecialityIds?.length === 0 && open) {
            toast.warn('No speciality selected for deletion')
            return;
        }
        try {
            const data = await specialityService.permanentDeleteAccount(selectedSpecialityIds, aToken)
            if (data){
                await findAllDeletedSpecialities();
                toast.success(data.message);
                setSelectedSpecialityIds([]);
                setOpen(false)
            }
        } catch (error) {
            console.error(error.message);
            toast.error(error.message)
        }
    };

    const restoreSpeciality = async () => {
        if (selectedSpecialityIds?.length === 0) {
            toast.warn('No speciality selected for restoration')
            return;
        }

        try {
            const response = await specialityService.restoreSpeciality(selectedSpecialityIds, aToken);
            if (response.message !== '') {
                findAllDeletedSpecialities();
                toast.success(response.message);
                setSelectedSpecialityIds([]);
                setOpen(false);
            } else {
                toast.error('Error')
            }

        } catch (e) {
            toast.error(e.message);
        }
    }


    useEffect(() => {
       if(aToken){
           findAllDeletedSpecialities()
       }
    }, [aToken, hiddenState]);

    return (
        <div className='m-5 max-h-[90h] w-[90vw] overflow-y-scroll'>


            <div className='flex justify-between items-center'>
                <h1 className='text-lg text-primary lg:text-2xl font-medium'>All Deleted Specialities</h1>
                <div className='flex gap-1'>
                    <button
                        onClick={restoreSpeciality}
                        className='bg-green-700 px-10 py-3 mt-4 text-white rounded-full'>
                        Put Back
                    </button>

                    <button
                        className='flex items-center gap-2 px-10 py-3 mt-4 rounded-full text-white bg-red-600 shadow-red-400/40 cursor-pointer'
                        onClick={openDeleteModal}>
                        <FaRegTrashAlt/> Delete
                    </button>
                </div>

            </div>

            <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
                {
                    specialities.length > 0 ? (specialities?.map((item, index) => {

                        return (
                            <div
                                className="border border-indigo-200 rounded-xl w-56 overflow-hidden cursor-pointer group"
                                key={index}
                            >
                                <img
                                    className="w-full h-56 bg-indigo-50 object-cover group-hover:bg-primary transition-all duration-500"
                                    src={item.speciality_image}
                                    alt="img"
                                />
                                <div className="p-4">
                                    <div className="flex justify-end">
                                        <input
                                            type="checkbox"
                                            checked={selectedSpecialityIds.includes(item._id)}
                                            onChange={(e) => {
                                                toggleAccountSelection(item._id);
                                            }}
                                        />
                                    </div>
                                    <p className="text-neutral-800 text-lg font-medium">{item.name}</p>
                                    <p className="text-zinc-600 text-sm">{item.description}</p>
                                </div>
                            </div>

                        );
                    })) : <div className='max-h-[90h] w-[90vw]'>
                        <img className='w-[50vw]' src={assets.no_data} alt='no records'/>
                    </div>
                }
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
                            onClick={permanentSpecialityRegions}>Delete
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

export default RestoreSpeciality;
