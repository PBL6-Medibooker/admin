import React from 'react';
import {motion} from "framer-motion";
import {assets} from "../../../assets/assets";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const DoctorCreateArticle = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    return (
        <div className='ml-5 mr-5 mb-5 w-[90vw] h-[100vh]'>
            <motion.div
                initial={{opacity: 0, y: 50}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="flex justify-between items-center mb-6"
            >
                <p className="text-xl mt-1 text-primary lg:text-2xl font-semibold mb-4">
                    {t("article.add.title")}
                </p>
            </motion.div>


            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 0.2, duration: 0.5}}
                className="m-5 w-full max-w-4xl mx-auto"
            >
                <div className="bg-white px-8 py-8 border rounded-xl shadow-xl w-full max-h-[80vh] overflow-y-auto">


                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.3, duration: 0.5}}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6"
                    >

                        <label htmlFor="image" className="cursor-pointer">
                            <div className="relative sm:max-w-80 h-[200px]">
                                <img
                                    className="w-full h-full object-cover rounded-lg"
                                    src={image ? URL.createObjectURL(image) : assets.upload_icon}
                                    alt="image"
                                />

                                {!image && (
                                    <motion.div
                                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg"
                                        whileHover={{opacity: 0.8}}
                                        transition={{duration: 0.3}}
                                    >
                                        <img
                                            className="w-10 opacity-75"
                                            src={assets.upload_icon}
                                            alt="upload icon"
                                        />
                                    </motion.div>
                                )}
                            </div>

                            <input
                                onChange={handleImageChange}
                                type="file"
                                id="image"
                                hidden
                                accept="image/jpg"
                            />
                        </label>

                        <div className="mb-6">
                            <select
                                id="user-select"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                                aria-required="true"
                            >
                                <option value="" disabled className="text-gray-400">
                                    {t("article.add.a")}
                                </option>
                                {doctors?.map((doctor) => (
                                    <option key={doctor._id} value={doctor.email}>
                                        {doctor.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </motion.div>


                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.6, duration: 0.5}}
                        className="mb-6"
                    >
                        <label htmlFor="health-issue" className="block text-lg font-medium text-primary mb-2">
                            {t("article.add.atitle")}
                        </label>
                        <input
                            id="health-issue"
                            value={articleTitle}
                            onChange={(e) => setArticleTitle(e.target.value)}
                            className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Title"
                            required
                            aria-required="true"
                        />
                    </motion.div>


                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.6, duration: 0.5}}
                        className="mb-6"
                    >
                        <label htmlFor="health-issue" className="block text-lg font-medium text-primary mb-2">
                            {t("article.add.content")}
                        </label>
                        <textarea
                            id="health-issue"
                            value={articleContent}
                            onChange={(e) => setArticleContent(e.target.value)}
                            rows="4"
                            className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="..."
                            required
                            aria-required="true"
                        />
                    </motion.div>


                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.7, duration: 0.5}}
                        className="flex justify-end gap-6 mt-6"
                    >
                        <button
                            type="button"
                            onClick={() => navigate('/article')}
                            className="bg-gray-300 px-6 py-3 text-sm text-gray-700 rounded-full hover:bg-gray-400 transition-all"
                        >
                            <i className="fas fa-arrow-left mr-2"></i> {t("article.add.back")}
                        </button>

                        <button
                            type="button"
                            onClick={createArticle}
                            className="bg-primary px-6 py-3 text-sm text-white rounded-full hover:bg-primary-dark transition-all"
                            aria-label="Save booking"
                        >
                            <i className="fas fa-save mr-2"></i> {t("article.add.save")}
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default DoctorCreateArticle;
