import React, {useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {AdminContext} from "../../context/AdminContext";
import {toast} from "react-toastify";
import * as accountService from "../../service/AccountService";
import { motion } from "framer-motion";


const AddNewCustomerAcc = () => {
    const [cusImg, setCusImg] = useState(null);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [isDoc, setIsDoc] = useState('0');

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
        formData.append('profile_image', cusImg);


        const data = await accountService.addAccount(formData, aToken);

        if (data !== null) {
            navigate('/account')
            console.log("Showing success toast");
            toast.success('Add New Customer Account Successful');
        } else {
            console.log("Showing error toast");
            toast.error('Error');
        }

    };

    return (
        <div className="m-5 w-[70vw] h-[100vh]">
            <motion.div
                initial={{opacity: 0, y: 50}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="flex justify-between items-center mb-6"
            >
                <p className="text-xl text-primary lg:text-2xl font-semibold mb-4">
                    Add New Customer Account
                </p>
            </motion.div>

            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 0.2, duration: 0.5}}
                className="m-5 mt-26 w-full max-w-4xl mx-auto"
            >
                <form
                    onSubmit={onSubmitHandler}
                    className="bg-white px-8 py-8 border rounded-xl w-full max-h-[80vh] overflow-y-auto"
                >
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.3, duration: 0.5}}
                        className="grid grid-cols-1 lg:grid-cols-1 ml-24 gap-8 mb-6"
                    >
                        <div className="flex w-[30vw] flex-col gap-1">
                            <label htmlFor="email" className="text-lg font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                type="email"
                                placeholder="Email"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="flex flex-col w-[30vw] gap-1">
                            <label htmlFor="phone" className="text-lg font-medium text-gray-700 mb-2">
                                Phone
                            </label>
                            <input
                                id="phone"
                                onChange={(e) => setPhone(e.target.value)}
                                value={phone}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                type="text"
                                placeholder="Phone"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-[30vw]">
                            <label htmlFor="username" className="text-lg font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                id="username"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                type="text"
                                placeholder="Username"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-[30vw]">
                            <label htmlFor="password" className="text-lg font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                type="password"
                                placeholder="Password"
                                required
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.4, duration: 0.5}}
                        className="flex justify-end gap-6 mt-6"
                    >
                        <button
                            type="button"
                            onClick={() => navigate('/account')}
                            className="bg-red-500 text-white px-6 py-3 text-sm  rounded-full hover:bg-gray-400 transition-all"
                        >
                            <i className="fas fa-arrow-left mr-2"></i> Back
                        </button>

                        <button
                            type="submit"
                            className="bg-primary px-6 py-3 text-sm text-white rounded-full hover:bg-primary-dark transition-all"
                        >
                            <i className="fas fa-plus mr-2"></i> Add Account
                        </button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddNewCustomerAcc;