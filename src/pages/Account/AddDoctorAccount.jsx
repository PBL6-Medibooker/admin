import React, {useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {AdminContext} from "../../context/AdminContext";
import * as accountService from "../../service/AccountService";
import {toast} from "react-toastify";
import {assets} from "../../assets/assets";

const AddDoctorAccount = () => {
    const [proof, setProof] = useState(null);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [isDoc, setIsDoc] = useState('1');

    const navigate = useNavigate();

    const {aToken} = useContext(AdminContext);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('email', email)
        formData.append('password', password)
        formData.append('username', username)
        formData.append('phone', phone)
        formData.append('is_doc', isDoc)
        formData.append('proof', proof);


        const data = await accountService.addAccount(formData, aToken);

        if (data !== null) {
            navigate('/doc-account')
            console.log("Showing success toast");
            toast.success('Add New Doctor Account Successful');
        } else {
            toast.error('Error');
        }

    };

    return (
        <div>
            <form onSubmit={onSubmitHandler} className='m-5 w-[50vw] h-[90vh]'>
                <p className='mb-3 text-lg font-medium'>Add New Doctor Account</p>


                <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>

                    <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

                        <div className='w-full lg:flex-1 flex flex-col gap-4'>
                            <div className='flex flex-1 flex-col gap-1'>
                                <p>Upload Doctor Degree</p>
                                <input
                                    className='border rounded px-3 py-2'
                                    placeholder='Doctor Degree'
                                    onChange={(e) => setProof(e.target.files[0])}
                                    type='file'
                                    id='doc-img'
                                    accept='application/pdf'
                                />
                            </div>


                            <div className='flex flex-1 flex-col gap-1'>
                                <p>Username</p>
                                <input onChange={(e) => setUsername(e.target.value)}
                                       value={username}
                                       className='border rounded px-3 py-2' type='text' placeholder='Username'
                                       required autoFocus/>
                            </div>

                            <div className='flex flex-1 flex-col gap-1'>
                                <p>Password</p>
                                <input onChange={(e) => setPassword(e.target.value)}
                                       value={password}
                                       className='border rounded px-3 py-2' type='password' placeholder='Password'
                                       required/>
                            </div>


                            <div className='flex flex-1 flex-col gap-1'>
                                <p>Email</p>
                                <input onChange={(e) => setEmail(e.target.value)}
                                       value={email}
                                       className='border rounded px-3 py-2' type='email' placeholder='Email'
                                       required/>
                            </div>


                            <div className='flex flex-1 flex-col gap-1'>
                                <p>Phone</p>
                                <input onChange={(e) => setPhone(e.target.value)}
                                       value={phone}
                                       className='border rounded px-3 py-2' type='text' placeholder='Phone'
                                       required/>
                            </div>


                        </div>


                    </div>

                    <div className='flex justify-end gap-3'>

                        <button onClick={() => navigate('/account')}
                                className='bg-red-500 px-10 py-3 mt-4 text-white rounded-full'>
                            Back
                        </button>

                        <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>
                            Add
                            Account
                        </button>

                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddDoctorAccount;
