import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {AdminContext} from "../../context/AdminContext";
import * as accountService from "../../service/AccountService"
import {assets} from "../../assets/assets";
import {toast} from "react-toastify";


const AccountDetails = () => {
    const {email} = useParams();
    const {aToken} = useContext(AdminContext)
    const [account, setAccount] = useState(null);
    const [image, setImage] = useState(null);
    const [underlyingCondition, setUnderlyingCondition] = useState('ok');
    const [accountRole, setAccountRole] = useState('')
    const navigate = useNavigate();


    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };


    const fetchAccountDetails = async () => {
        try {
            const response = await accountService.getAccDetails(email, aToken);
            console.log(response)
            setAccount(response);
            setUserId(response._id)
            setUserName(response.username)
            setAccountRole(response.role)
        } catch (err) {
            console.log(err.message);
        }
    };
    const changeAccountRole = async () =>{
        try {
            await accountService.changeAccountRole(account.email, accountRole, aToken)
        } catch (e) {
            console.log(e)
        }
    }

    const updateCusAccountData = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('username', account.username);
            // formData.append('password', account.password);
            formData.append('phone', account.phone);
            formData.append('underlying_condition', account.underlying_condition);
            formData.append('date_of_birth', account.date_of_birth);
            formData.append('address', account.address);
            if (image) formData.append('profile_image', image);
            if(accountRole !== account.role){
                await changeAccountRole();
            }

            await accountService.updateCusAcc(formData, account._id, aToken);

            navigate('/account');
            toast.success('Updated Customer Infomation');

            formData.forEach((value, key) => {
                console.log(`${key}:${value}`);
            });
        } catch (e) {
            console.log(e);
            toast.error(e.message);
        }
    }

    const resetPass = async () =>{
        try{
            const result = await accountService.forgotPassword(email, aToken);

            if(result){
                toast.success(result.message)
            } else {
                toast.error(result.error)
            }

        } catch (e){
            console.log(e);
        }
    }


    useEffect(() => {

        if (aToken) {
            fetchAccountDetails();
        }
    }, [aToken, email]);


    return (
        <div className='mb-5 ml-5 mr-5 mt-1 w-[90vw] h-[100vh]'>
            <div className="flex justify-between items-center mb-6">
                <p className="text-xl text-primary lg:text-2xl font-semibold  mb-4">
                    Update Customer Info
                </p>
                <div className="flex items-center gap-4">
                    <button
                        className="px-8 py-3 text-white bg-primary rounded-full shadow-md hover:bg-primary-dark focus:outline-none transition-all"
                        onClick={resetPass}
                    >
                        Reset Password
                    </button>
                </div>
            </div>


            <form onSubmit={updateCusAccountData} className="m-5 w-full max-w-4xl mx-auto">

            <div className="bg-white px-8 py-8 border rounded-xl shadow-md w-full max-h-[80vh] overflow-y-auto">
                    <div className="flex items-center gap-6 mb-8 text-gray-500">
                        <label htmlFor="doc-img">
                            <img
                                className="w-24 h-24 bg-gray-100 rounded-full cursor-pointer object-cover"
                                src={image ? URL.createObjectURL(image) : account?.profile_image || assets.patients_icon}
                                alt="Upload Area"
                            />
                        </label>
                        <input onChange={handleImageChange} type="file" id="doc-img" hidden/>
                        <div className="text-center">
                            <p className="text-sm font-semibold">Upload Customer Picture</p>
                            <p className="text-xs text-gray-400">Click to upload an image</p>
                        </div>
                    </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-gray-600">
                    <div className="flex flex-col gap-4">

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Customer Username</label>
                            <input
                                onChange={(e) => setAccount(prev => ({...prev, username: e.target.value}))}
                                value={account?.username}
                                className="border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                type="text"
                                placeholder="Customer Name"
                                required
                                autoFocus
                            />
                        </div>


                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Customer Phone</label>
                            <input
                                onChange={(e) => setAccount(prev => ({...prev, phone: e.target.value}))}
                                value={account?.phone}
                                className="border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                type="text"
                                placeholder="Customer Phone Number"
                                required
                            />
                        </div>


                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Customer Underlying Condition</label>
                            <input
                                onChange={(e) => setAccount(prev => ({
                                    ...prev,
                                    underlying_condition: e.target.value
                                }))}
                                value={account?.underlying_condition}
                                className="border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                type="text"
                                placeholder="Underlying Condition"
                                required
                            />
                        </div>

                        {/* Date of Birth Field */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Date of Birth</label>
                            <input
                                id="date_of_birth"
                                onChange={(e) => setAccount(prev => ({
                                    ...prev,
                                    date_of_birth: e.target.value
                                }))}
                                value={account?.date_of_birth ? new Date(account.date_of_birth).toISOString().split('T')[0] : ''}
                                className="border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                type="date"
                                required
                            />
                        </div>


                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Address</label>
                            <input
                                onChange={(e) => setAccount(prev => ({
                                    ...prev,
                                    address: e.target.value
                                }))}
                                value={account?.address}
                                className="border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                type="text"
                                placeholder="Customer Address"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Customer Email</label>
                            <input
                                onChange={(e) => setAccount(prev => ({...prev, email: e.target.value}))}
                                value={account?.email}
                                className="border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                type="text"
                                placeholder="Customer Email"
                                disabled
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Role</label>
                            <select
                                onChange={(e) => setAccountRole(e.target.value)}
                                value={accountRole}
                                disabled={accountRole === 'admin'}
                                className="border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            >
                                <option value="" disabled className="text-gray-400">Change user role</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                    </div>


                </div>

                <div className="flex justify-end gap-6 mt-6">
                    <button
                        onClick={() => navigate('/account')}
                        className="bg-gray-300 px-6 py-3 text-sm text-gray-700 rounded-full hover:bg-gray-400 transition-all"
                    >
                        Back
                    </button>

                    <button
                        type="submit"
                        className="bg-primary px-6 py-3 text-sm text-white rounded-full hover:bg-primary-dark transition-all"
                    >
                        Save
                    </button>
                </div>
            </div>
            </form>
        </div>
    );
};

export default AccountDetails;