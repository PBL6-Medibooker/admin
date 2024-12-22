import React, {useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {AdminContext} from "../../context/AdminContext";
import {toast} from "react-toastify";
import * as accountService from "../../service/AccountService";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import validator from "validator";
import {assets} from "../../assets/assets";
import {EyeClosed, Eye} from 'lucide-react'

const AddNewCustomerAcc = () => {
    const [cusImg, setCusImg] = useState(null);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [isDoc, setIsDoc] = useState('0');
    const {t} = useTranslation();
    const [isCheck, setIsCheck] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const navigate = useNavigate();

    const {aToken} = useContext(AdminContext);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        if (!validator.isStrongPassword(password)) {
            setIsCheck(true)
            await Swal.fire({
                position: "top-end",
                title: t("account.addDoctor.message"),
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false
            });
            return;
        }

        formData.append('email', email)
        formData.append('password', password)
        formData.append('username', username)
        formData.append('phone', phone)
        formData.append('is_doc', isDoc)
        formData.append('profile_image', cusImg);


        await accountService.addAccount(formData, aToken);
            navigate('/account')
            await Swal.fire({
                position: "top-end",
                title: t("account.addNewCustomerAcc.success"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false
            });


    };

    return (
        <div className="m-5 w-[70vw] h-[100vh]">
            <motion.div
                initial={{opacity: 0, y: 50}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="flex justify-between items-center mb-6"
            >
                <p className="text-xl text-primary lg:text-2xl font-semibold mb-2">
                    {t("account.addNewCustomerAcc.title")}
                </p>
            </motion.div>

            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 0.2, duration: 0.5}}
                className="m-5 mt-26 w-full max-w-3xl mx-auto"
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
                            <label htmlFor="email" className="text-lg font-bold text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                type="email"
                                placeholder="bevis@gmail.com"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="flex flex-col w-[30vw] gap-1">
                            <label htmlFor="phone" className="text-lg font-bold text-gray-700 mb-2">
                                {t("account.addNewCustomerAcc.phone")}
                            </label>
                            <input
                                id="phone"
                                onChange={(e) => setPhone(e.target.value)}
                                value={phone}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                type="text"
                                placeholder="123456789"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-[30vw]">
                            <label htmlFor="username" className="text-lg font-bold text-gray-700 mb-2">
                                {t("account.addNewCustomerAcc.username")}
                            </label>
                            <input
                                id="username"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                type="text"
                                placeholder="bevis"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-[30vw]">
                            <label htmlFor="password" className="text-lg font-bold text-gray-700 mb-2">
                                {t("account.addNewCustomerAcc.password")}
                            </label>
                            <motion.div className="flex items-center justify-center space-x-3 relative">

                                <input
                                    id="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    className={`${isCheck ? 'shake' : ''} w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    placeholder="12345qwert!@#$%QWERT"
                                    required
                                />
                                <button
                                    type='button'
                                    className="w-[25px] cursor-pointer absolute right-[15px] top-[25px] transform -translate-y-1/2 hover:scale-110 transition-transform duration-300"
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                >
                                    {isPasswordVisible ? <Eye className='text-red-600'/> : <EyeClosed/>}
                                </button>

                            </motion.div>
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
                            <i className="fas fa-arrow-left mr-2"></i>  {t("account.addNewCustomerAcc.back")}
                        </button>

                        <motion.button
                            whileHover={{scale: 1.05}}
                            type="submit"
                            className="bg-primary px-6 py-3 text-sm text-white rounded-full hover:bg-primary-dark transition-all"
                        >
                            <i className="fas fa-plus mr-2"></i>  {t("account.addNewCustomerAcc.add")}
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddNewCustomerAcc;
