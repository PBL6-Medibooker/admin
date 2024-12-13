import React, {useContext, useEffect, useState} from 'react';
import {AdminContext} from "../context/AdminContext.jsx";
import {toast} from "react-toastify";
import {DoctorContext} from "../context/DoctorContext";
import {motion, AnimatePresence} from "framer-motion";
import Swal from "sweetalert2";
import * as accountService from "../service/AccountService";
import validator from 'validator'


const Login = () => {
    const [state, setState] = useState('Admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {setAToken} = useContext(AdminContext);
    const {setDToken} = useContext(DoctorContext);
    const [isForgot, setIsForgot] = useState(false);

    const checkEmail = async () => {
        if (!validator.isEmail(email)) {
            await Swal.fire({
                position: "top-end",
                title: 'Please enter an email !',
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false,
                width: '400px',
            });
            return false;
        }
        return true;
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const isEmail = await checkEmail();
            if (!isEmail) return;

            if (state === 'Admin') {
                const result = await accountService.login(email, password);
                console.log(result)
                if (result.adminAccess) {
                    localStorage.setItem('aToken', result.token);
                    setAToken(result.token);
                } else {

                    await Swal.fire({
                        position: "top-end",
                        title: 'This is for admin only',
                        icon: "error",
                        showConfirmButton: false,
                        timer: 1500,
                        backdrop: false,
                        width: '400px',
                    });
                }
            } else {
                const result = await accountService.login(email, password);
                console.log(result)
                if (result.verified) {
                    localStorage.setItem('dToken', result.token);
                    setDToken(result.token);
                } else {
                    await Swal.fire({
                        position: "top-end",
                        title: 'This is for doctor only',
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

    const effect = () => {
        const labels = document.querySelectorAll("label");
        labels.forEach((label) => {
            label.innerHTML = label.innerText
                .split("")
                .map(
                    (letter, i) =>
                        `<span
                        class="inline-block transform transition-all duration-500 ease-in-out
                         delay-[${i * 50}ms] hover:text-primary hover:scale-125
                         peer-valid:text-primary peer-focus:text-primary
                         peer-valid:tracking-[0.15em] peer-focus:tracking-[0.15em]"
                    >
                        ${letter}
                    </span>`
                )
                .join("");
        });
    };

    useEffect(() => {
        effect();
    }, []);

    return (

        <motion.form
            onSubmit={onSubmitHandler}
            className="min-h-[80vh] flex items-center"
            initial={{opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 20}}
            transition={{duration: 0.5}}
        >
            <motion.div
                className="flex flex-col gap-3 m-auto items-start p-8 w-[340px] h-[350px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg"
                initial={{scale: 0.9, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                transition={{duration: 0.4}}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isForgot ? "forgot-password" : state}
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        transition={{duration: 0.4}}
                        className='m-auto'
                    >
                        {isForgot ? (
                            <>
                                <p className="text-primary text-2xl font-semibold">
                                    Forgot your password?
                                </p>
                                <p className=" flex items-center justify-center text-xs mt-3">
                                    Enter your email to reset your password.
                                </p>
                            </>
                        ) : (
                            <p className="text-2xl font-semibold">
                                <span className="text-primary">{state}</span> Login
                            </p>
                        )}
                    </motion.div>
                </AnimatePresence>

                <motion.div className="relative w-full mt-6" whileHover={{scale: 1.05}}>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        tabIndex="1"
                        className={`peer bg-transparent border-b outline-none border-gray-300 w-full p-2 mt-1
                        focus:border-primary focus:ring-2 focus:ring-primary
                        transition-all duration-300 ${isForgot ? 'mb-5' : ''}`}
                        type="text"
                        required
                        autoFocus
                    />
                    <label
                        className="text-gray-500 absolute left-0 pt-2 pl-2 uppercase pointer-events-none
                         peer-focus:text-primary peer-valid:text-primary
                         peer-focus:-translate-y-6 peer-valid:-translate-y-6
                         peer-focus:tracking-widest peer-valid:tracking-widest
                         transition-all duration-300"
                    >
                        Email
                    </label>
                </motion.div>

                {!isForgot && (
                    <motion.div className="relative w-full mt-6" whileHover={{scale: 1.05}}>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            tabIndex="2"
                            className="peer bg-transparent border-b outline-none border-gray-300 w-full p-2 mt-1
                        focus:border-primary focus:ring-2 focus:ring-primary
                        transition-all duration-300"
                            type="password"
                            required
                        />
                        <label
                            className="text-gray-500 absolute left-0 pt-2 pl-2 uppercase pointer-events-none
                         peer-focus:text-primary peer-valid:text-primary
                         peer-focus:-translate-y-6 peer-valid:-translate-y-6
                         peer-focus:tracking-widest peer-valid:tracking-widest
                         transition-all duration-300"
                        >
                            Password
                        </label>
                    </motion.div>
                )}


                {
                    isForgot
                        ? <motion.button
                            type="button"
                            className="bg-primary text-white w-full py-2 rounded-md text-base
                            hover:tracking-widest transition-all duration-500 uppercase mt-4"
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            Reset Password
                        </motion.button>
                        : <motion.button
                            type="submit"
                            className="bg-primary text-white w-full py-2 rounded-md text-base
                            hover:tracking-widest transition-all duration-500 uppercase mt-4"
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            Login
                        </motion.button>
                }

                <AnimatePresence mode="wait">
                    <div className="flex justify-between items-center w-full">
                        {!isForgot && (
                            <motion.span
                                key={state}
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -10}}
                                transition={{duration: 0.3}}
                            >
                                {state === "Admin" ? (
                                    <p>
                                        Doctor Login?{" "}
                                        <span
                                            className="text-primary underline cursor-pointer"
                                            onClick={() => setState("Doctor")}
                                        >
                            Click here
                        </span>
                                    </p>
                                ) : (
                                    <p>
                                        Admin Login?{" "}
                                        <span
                                            className="text-primary underline cursor-pointer"
                                            onClick={() => setState("Admin")}
                                        >
                            Click here
                        </span>
                                    </p>
                                )}
                            </motion.span>
                        )}
                        <motion.span
                            key={isForgot ? "forgot" : "login"}
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{duration: 0.3}}
                            className="text-primary italic cursor-pointer ml-auto"
                            onClick={() => setIsForgot(!isForgot)}
                        >
                            {isForgot ? "Back to Login" : "Forgot password?"}
                        </motion.span>
                    </div>
                </AnimatePresence>

            </motion.div>
        </motion.form>
    );
};

export default Login;
