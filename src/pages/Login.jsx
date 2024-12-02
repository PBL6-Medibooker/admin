import React, { useContext, useState } from 'react';
import { AdminContext } from "../context/AdminContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import * as accountService from "../service/AccountService";


const Login = () => {
    const [state, setState] = useState('Admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { setAToken, backendUrl } = useContext(AdminContext);
    const { setDToken } = useContext(DoctorContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            if (state === 'Admin') {
                // const result = await axios.post(backendUrl + '/acc/login', { email, password });
                const result = await accountService.login(email, password);
                if (result.role === 'admin') {
                    localStorage.setItem('aToken', result.token);
                    setAToken(result.token);
                } else {
                    // toast.error('This is for Admin Only');

                    await Swal.fire({
                        position: "top-end",
                        title:'This is for Admin Only',
                        icon: "error",
                        showConfirmButton: false,
                        timer: 1500,
                        backdrop: false,
                        width: '400px',
                    });
                }
            } else {
                const result = await accountService.login(email, password);
                if (result.verified) {
                    localStorage.setItem('dToken', result.token);
                    setDToken(result.token);
                } else {
                    await Swal.fire({
                        position: "top-end",
                        title:'This is for Doctor Only',
                        icon: "error",
                        showConfirmButton: false,
                        timer: 1500,
                        backdrop: false,
                        width: '400px',
                    });
                }
            }
        } catch (e) {
            if (e.response?.data.error) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: e.response?.data.error + '&nbsp;' + '!!',
                    timer: 2000,
                    showConfirmButton: false,
                    backdrop: false,
                    width: '400px',
                    customClass: {
                        popup: 'bg-white text-black p-4 rounded-lg shadow-md max-w-xs',
                        title: 'text-lg font-semibold',
                    }
                })
            } else {
                console.log("Error:", e);
            }
        }
    };

    return (
        <motion.form
            onSubmit={onSubmitHandler}
            className="min-h-[80vh] flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <motion.p
                    className="text-2xl font-semibold m-auto"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <span className="text-primary">{state}</span> Login
                </motion.p>
                <motion.div className="w-full" whileHover={{ scale: 1.02 }}>
                    <p>Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        tabIndex="1"
                        className="border border-[#DADADA] rounded w-full p-2 mt-1"
                        type="email"
                        required
                        autoFocus
                    />
                </motion.div>
                <motion.div className="w-full" whileHover={{ scale: 1.02 }}>
                    <p>Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        tabIndex="2"
                        className="border border-[#DADADA] rounded w-full p-2 mt-1"
                        type="password"
                        required
                    />
                </motion.div>
                <motion.button
                    type="submit"
                    className="bg-primary text-white w-full py-2 rounded-md text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Login
                </motion.button>
                <motion.div
                    className="flex justify-between gap-9"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <span>
                        {state === "Admin" ? (
                            <p>
                                Doctor Login?{" "}
                                <span
                                    className="text-primary underline cursor-pointer"
                                    onClick={() => setState('Doctor')}
                                >
                                    Click here
                                </span>
                            </p>
                        ) : (
                            <p>
                                Admin Login?{" "}
                                <span
                                    className="text-primary underline cursor-pointer"
                                    onClick={() => setState('Admin')}
                                >
                                    Click here
                                </span>
                            </p>
                        )}
                    </span>
                    <span
                        className="text-primary italic cursor-pointer"
                        onClick={() => setState('Admin')}
                    >
                        Forgot password ?
                    </span>
                </motion.div>
            </motion.div>
        </motion.form>
    );
};

export default Login;
