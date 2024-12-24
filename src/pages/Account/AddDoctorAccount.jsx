import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AdminContext} from "../../context/AdminContext";
import * as accountService from "../../service/AccountService";
import {toast} from "react-toastify";
import validator from "validator";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import {motion} from "framer-motion";
import {Eye, EyeClosed} from "lucide-react";

const AddDoctorAccount = () => {
    const [proof, setProof] = useState(null);
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [isDoc, setIsDoc] = useState("1");
    const {t} = useTranslation();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const {aToken} = useContext(AdminContext);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        if (!validator.isStrongPassword(password)) {
            await Swal.fire({
                position: "top-end",
                title: t("account.addDoctor.message"),
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        formData.append("email", email);
        formData.append("password", password);
        formData.append("username", username);
        formData.append("phone", phone);
        formData.append("is_doc", isDoc);
        formData.append("proof", proof);

        const data = await accountService.addAccount(formData, aToken);
        console.log(data)

        if (data !== null) {
            navigate("/doc-account");
            await Swal.fire({
                position: "top-end",
                title: t("account.addNewCustomerAcc.success"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false
            });
        } else {
            toast.error("Error");
        }
    };

    return (
        <div className="m-5 w-[80vw] h-[100vh]">
            <motion.div
                initial={{opacity: 0, y: 50}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="mb-6"
            >
                <p className="text-sm text-primary lg:text-2xl font-bold">{t("account.addDoctor.title")}</p>
            </motion.div>

            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 0.2, duration: 0.5}}
                className="m-5 mt-26 ml-26 w-full max-w-3xl mx-auto"
            >
                <form onSubmit={onSubmitHandler}
                      className="bg-white px-8 py-8 border rounded-xl w-full max-h-[80vh] overflow-y-auto"
                >
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {opacity: 0, y: 20},
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {delayChildren: 0.3, staggerChildren: 0.2},
                            },
                        }}
                        className="flex flex-col lg:flex-row items-start gap-10 text-gray-600"
                    >
                        <motion.div
                            variants={{hidden: {opacity: 0}, visible: {opacity: 1}}}
                            className="w-full lg:flex-1 flex flex-col gap-4"
                        >
                            <div className="flex flex-1 flex-col gap-1">
                                <p className='font-bold'>{t("account.addDoctor.upload")}</p>
                                <input
                                    className="border rounded px-3 py-2"
                                    placeholder="Doctor Degree"
                                    onChange={(e) => setProof(e.target.files[0])}
                                    type="file"
                                    id="doc-img"
                                    accept="application/pdf"
                                />
                            </div>

                            <div className="flex flex-1 flex-col gap-1">
                                <p className='font-bold'>Email</p>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    className="border rounded px-3 py-2"
                                    type="email"
                                    placeholder="bevis@gmail.com"
                                    required
                                />
                            </div>

                            <div className="flex flex-1 flex-col gap-1">
                                <p className='font-bold'>{t("account.addDoctor.phone")}</p>
                                <input
                                    onChange={(e) => setPhone(e.target.value)}
                                    value={phone}
                                    className="border rounded px-3 py-2"
                                    type="text"
                                    placeholder="123456789"
                                    required
                                />
                            </div>

                            <div className="flex flex-1 flex-col gap-1">
                                <p className='font-bold'>{t("account.addDoctor.username")}</p>
                                <input
                                    onChange={(e) => setUsername(e.target.value)}
                                    value={username}
                                    className="border rounded px-3 py-2"
                                    type="text"
                                    placeholder="bevis"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="flex flex-1 flex-col gap-1">
                                <p className='font-bold'>{t("account.addDoctor.password")}</p>
                                <motion.div className=" w-full flex items-center justify-center space-x-3 relative">
                                    <input
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        className=" w-full border rounded px-3 py-2"
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        placeholder="12345@Viet"
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
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.6, duration: 0.5}}
                        className="flex justify-end gap-3"
                    >
                        <button
                            onClick={() => navigate("/doc-account")}
                            className="bg-red-500 px-10 py-3 mt-4 text-white rounded-full"
                        >
                            {t("account.addDoctor.back")}
                        </button>

                        <button
                            type="submit"
                            className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
                        >
                            {t("account.addDoctor.save")}
                        </button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddDoctorAccount;
