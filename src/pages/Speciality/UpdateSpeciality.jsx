import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as specialityService from "../../service/SpecialityService";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";

const UpdateSpeciality = () => {
    const { aToken, backendUrl } = useContext(AdminContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [specialities, setSpecialities] = useState([]);

    const [image, setImage] = useState(null);
    const [specData, setSpecData] = useState({
        name: '',
        description: '',
        speciality_image: null
    });

    const loadSpecData = async () => {
        try {
            const { data } = await axios.get(backendUrl + `/special/get-spec/${id}`, { headers: { aToken } });
            if (data.success) {
                console.log(data.specData)
                setSpecData({
                    name: data.specData.name,
                    description: data.specData.description,
                    speciality_image: data.specData.speciality_image
                });
            } else {
                toast.error(data.message);
            }
        } catch (e) {
            console.log(e);
            toast.error(e.message);
        }
    };


    const findAllSpecialities = async () => {
        const result = await specialityService.findAll(false, aToken)
        setSpecialities(result);
    }

    const updateSpecialityData = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', specData.name);
            formData.append('description', specData.description);
            if (image) {
                formData.append('speciality_image', image);
            }
            // if (image) {
            //     formData.append('speciality_image', image);
            // } else {
            //     formData.append('speciality_image', specData.speciality_image);
            // }

            const data = await specialityService.updateSpec(formData, id, aToken);
            console.log(data)
            if (data) {
                toast.success(data.message);
                navigate('/speciality', { state: { imageUpdated: true } });

            } else {
                // toast.error();
            }
            await findAllSpecialities()
            navigate('/speciality');
            toast.success('Updated PostSpeciality');

            // formData.forEach((value, key) => {
            //     console.log(`${key}:${value}`);
            // });
        } catch (e) {
            console.log(e);
            toast.error(e.message);
        }
    };


    useEffect(() => {
        if (aToken) {
            loadSpecData();
        }
    }, [aToken]);



    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    return (
        <div>
            <form onSubmit={updateSpecialityData} className='m-5 w-[50vw] h-[90vh]'>
                <p className='mb-3 text-primary text-lg lg:text-2xl font-medium'>Update Speciality</p>
                <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                    <div className='flex items-center gap-4 mb-8 text-gray-500'>
                        <label htmlFor='doc-img'>
                            <img className='w-16 bg-gray-100 rounded-full cursor-pointer'
                                 src={image ? URL.createObjectURL(image) : specData.speciality_image}
                                 alt='Upload Area' />
                        </label>
                        <input onChange={handleImageChange} type='file' id='doc-img' hidden />
                        <p>Upload PostSpeciality <br /> picture</p>
                    </div>

                    <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                        <div className='w-full lg:flex-1 flex flex-col gap-4'>
                            <div className='flex flex-1 flex-col gap-1'>
                                <p>Speciality</p>
                                <input
                                    onChange={(e) => setSpecData(prev => ({ ...prev, name: e.target.value }))}
                                    value={specData.name}
                                    className='border rounded px-3 py-2'
                                    type='text'
                                    placeholder='PostSpeciality Name'
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className='w-full'>
                                <p className='mt-4 mb-2'>Description</p>
                                <textarea
                                    onChange={(e) => setSpecData(prev => ({ ...prev, description: e.target.value }))}
                                    value={specData.description}
                                    className='w-full px-4 pt-2 border rounded'
                                    rows={5}
                                    placeholder='Write about this speciality'
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-end gap-3'>
                        <button
                            onClick={() => navigate('/speciality')}
                            className='bg-red-500 px-10 py-3 mt-4 text-white rounded-full'>
                            Back
                        </button>

                        <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdateSpeciality;
