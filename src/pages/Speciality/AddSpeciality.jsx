import React, {useContext, useState} from 'react';
import {assets} from "../../assets/assets";
import {toast} from "react-toastify";
import * as specialityService from "../../service/SpecialityService"
import {AdminContext} from "../../context/AdminContext";
import {useNavigate} from "react-router-dom";


const AddSpeciality = () => {
    const [specImg, setSpecImg] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const navigate = useNavigate();

    const {aToken} = useContext(AdminContext);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!specImg) {
            return toast.error('Image not selected')
        }
        const formData = new FormData();

        formData.append('name', name)
        formData.append('description', description)
        formData.append('speciality_image', specImg)

        const data = await specialityService.addSpec(formData, aToken);
        if (data !== null) {
            navigate('/speciality')
            console.log("Showing success toast");
            toast.success('Add Speciality Success');
        } else {
            console.log("Showing error toast");
            toast.error('Error');
        }
        // console log data
        formData.forEach((value, key) => {
            console.log(`${key}:${value}`)

        })

    };

    return (
        <div>
            <form onSubmit={onSubmitHandler} className='m-5 w-[50vw] h-[90vh]'>
                <p className='mb-3 text-lg font-medium'>Add Speciality</p>


                <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>

                    <div className='flex items-center gap-4 mb-8 text-gray-500'>
                        <label htmlFor='doc-img'>
                            <img className='w-16 bg-gray-100 rounded-full cursor-pointer'
                                 src={specImg ? URL.createObjectURL(specImg) : assets.upload_area} alt='Upload Area'/>
                        </label>
                        <input onChange={(e) => setSpecImg(e.target.files[0])} type='file' id='doc-img' hidden/>
                        <p>Upload Speciality <br/> picture</p>
                    </div>

                    <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                        <div className='w-full lg:flex-1 flex flex-col gap-4'>
                            <div className='flex flex-1 flex-col gap-1'>
                                <p>Speciality</p>
                                <input onChange={(e) => setName(e.target.value)}
                                       value={name}
                                       className='border rounded px-3 py-2' type='text' placeholder='Speciality Name'
                                       required autoFocus/>
                            </div>


                            <div className='w-full'>
                                <p className='mt-4 mb-2'>Description</p>
                                <textarea onChange={(e) => setDescription(e.target.value)}
                                          value={description}
                                          className='w-full px-4 pt-2 border rounded' rows={5}
                                          placeholder='Write about this speciality'
                                          required/>
                            </div>
                        </div>


                    </div>

                    <div className='flex justify-end gap-3'>

                        <button onClick={() => navigate('/speciality')} className='bg-red-500 px-10 py-3 mt-4 text-white rounded-full'>
                            Back
                        </button>

                        <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add
                            Speciality
                        </button>

                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddSpeciality;

