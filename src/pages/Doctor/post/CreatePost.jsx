import React, {useContext, useState} from 'react';
import {assets} from "../../../assets/assets";
import * as forumService from "../../../service/ForumService";
import {DoctorContext} from "../../../context/DoctorContext";
import {toast} from "react-toastify";
import {motion} from "framer-motion";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import Swal from "sweetalert2";


const CreatePost = () => {
    const {dToken, docEmail, doctorData} = useContext(DoctorContext);
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: docEmail,
        post_title: '',
        post_content: '',
        speciality_name: doctorData.speciality_id.name,
    });


    const createPost = async () => {
        try {
            const result = await forumService.createPost(data, dToken);
            if (result) {
                navigate('/doctor-post')
                await Swal.fire({
                    position: "top-end",
                    title: t("doctor.post.success"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (e) {
            console.log(e);
        }
    };

    const containerVariant = {
        hidden: {opacity: 0, y: 20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.2,
                when: "beforeChildren",
            },
        },
    };

    const itemVariant = {
        hidden: {opacity: 0, y: 20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {type: "spring", stiffness: 50, damping: 10},
        },
    };

    const buttonVariant = {
        hover: {scale: 1.1, transition: {duration: 0.2}},
        tap: {scale: 0.95},
    };

    return (
        <motion.div
            className='mb-5 ml-5 mr-5 mt-1 w-[90vw] h-[100vh]'
            variants={containerVariant}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className="flex justify-between items-center mb-6"
                variants={itemVariant}
            >
                <p className="text-xl mt-1 text-primary lg:text-2xl font-semibold mb-4">
                    {t("doctor.post.title")}
                </p>
            </motion.div>

            <motion.div
                className="m-5 w-full max-w-4xl mx-auto"
                variants={itemVariant}
            >
                <motion.div
                    className="bg-white px-8 py-8 border rounded-xl shadow-xl w-full max-h-[80vh] overflow-y-auto"
                    variants={containerVariant}
                >
                    <motion.div variants={itemVariant} className="mb-6">
                        <label
                            htmlFor="health-issue"
                            className="block text-lg font-medium text-primary mb-2"
                        >
                            {t("doctor.post.ptitle")}
                        </label>
                        <input
                            id="health-issue"
                            value={data.post_title}
                            onChange={(e) =>
                                setData((prev) => ({...prev, post_title: e.target.value}))
                            }
                            className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="bevis"
                            required
                            aria-required="true"
                        />
                    </motion.div>

                    <motion.div variants={itemVariant} className="mb-6">
                        <label
                            htmlFor="post-content"
                            className="block text-lg font-medium text-primary mb-2"
                        >
                            {t("doctor.post.content")}
                        </label>
                        <textarea
                            id="post-content"
                            value={data.post_content}
                            onChange={(e) =>
                                setData((prev) => ({...prev, post_content: e.target.value}))
                            }
                            rows="4"
                            className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="..."
                            required
                            aria-required="true"
                        />
                    </motion.div>

                    <motion.div
                        className="flex justify-end gap-6 mt-6"
                        variants={itemVariant}
                    >
                        <motion.button
                            type="button"
                            onClick={() => navigate('/doctor-post')}
                            className="bg-gray-300 px-6 py-3 text-sm text-gray-700 rounded-full hover:bg-gray-400 transition-all"
                            variants={buttonVariant}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <i className="fas fa-arrow-left mr-2"></i>   {t("doctor.post.back")}
                        </motion.button>

                        <motion.button
                            type="button"
                            onClick={createPost}
                            className="bg-primary px-6 py-3 text-sm text-white rounded-full hover:bg-primary-dark transition-all"
                            variants={buttonVariant}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <i className="fas fa-save mr-2"></i>   {t("doctor.post.save")}
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default CreatePost;
