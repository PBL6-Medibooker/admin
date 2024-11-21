import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import * as accountService from "../../service/AccountService";
import { toast } from "react-toastify";
import validator from "validator";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const AddDoctorAccount = () => {
    const [proof, setProof] = useState(null);
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [isDoc, setIsDoc] = useState("1");
    const { t } = useTranslation();

    const navigate = useNavigate();
    const { aToken } = useContext(AdminContext);

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

        if (data !== null) {
            navigate("/doc-account");
            await Swal.fire({
                position: "top-end",
                title: t("account.addDoctor.success"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
            });
        } else {
            toast.error("Error");
        }
    };

    return (
        <div className="m-5 w-[50vw] h-[90vh]">
            {/* Title with animation */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
            >
                <p className="text-lg font-medium">{t("account.addDoctor.title")}</p>
            </motion.div>

            {/* Form container with animation */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll"
            >
                <form onSubmit={onSubmitHandler}>
                    {/* Input fields with staggered animations */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: { delayChildren: 0.3, staggerChildren: 0.2 },
                            },
                        }}
                        className="flex flex-col lg:flex-row items-start gap-10 text-gray-600"
                    >
                        <motion.div
                            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                            className="w-full lg:flex-1 flex flex-col gap-4"
                        >
                            {/* File upload */}
                            <div className="flex flex-1 flex-col gap-1">
                                <p>{t("account.addDoctor.upload")}</p>
                                <input
                                    className="border rounded px-3 py-2"
                                    placeholder="Doctor Degree"
                                    onChange={(e) => setProof(e.target.files[0])}
                                    type="file"
                                    id="doc-img"
                                    accept="application/pdf"
                                />
                            </div>

                            {/* Username */}
                            <div className="flex flex-1 flex-col gap-1">
                                <p>{t("account.addDoctor.username")}</p>
                                <input
                                    onChange={(e) => setUsername(e.target.value)}
                                    value={username}
                                    className="border rounded px-3 py-2"
                                    type="text"
                                    placeholder="Username"
                                    required
                                    autoFocus
                                />
                            </div>

                            {/* Password */}
                            <div className="flex flex-1 flex-col gap-1">
                                <p>{t("account.addDoctor.password")}</p>
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    className="border rounded px-3 py-2"
                                    type="password"
                                    placeholder="Password"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="flex flex-1 flex-col gap-1">
                                <p>Email</p>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    className="border rounded px-3 py-2"
                                    type="email"
                                    placeholder="Email"
                                    required
                                />
                            </div>

                            {/* Phone */}
                            <div className="flex flex-1 flex-col gap-1">
                                <p>{t("account.addDoctor.phone")}</p>
                                <input
                                    onChange={(e) => setPhone(e.target.value)}
                                    value={phone}
                                    className="border rounded px-3 py-2"
                                    type="text"
                                    placeholder="Phone"
                                    required
                                />
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Buttons with animation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="flex justify-end gap-3"
                    >
                        <button
                            onClick={() => navigate("/account")}
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
