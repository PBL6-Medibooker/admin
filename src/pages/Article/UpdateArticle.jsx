import React, {useContext, useEffect, useState} from 'react';
import {motion} from "framer-motion";
import {assets} from "../../assets/assets";
import {AdminContext} from "../../context/AdminContext";
import {useNavigate, useParams} from "react-router-dom";
import * as articleService from "../../service/ArticleService";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";
import {DoctorContext} from "../../context/DoctorContext";
import CustomButton from "../../components/button/CustomButton";
import {Check, Undo2} from "lucide-react";


const UpdateArticle = () => {
    const {aToken, refetchAdminDetails, adminDetails, readOnly, writeOnly, fullAccess} = useContext(AdminContext);
    const {dToken} = useContext(DoctorContext);
    const {id} = useParams();
    const navigate = useNavigate();
    const [articleTitle, setArticleTitle] = useState('');
    const [articleContent, setArticleContent] = useState('');
    const [articleImage, setArticleImage] = useState(null);
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const {t}= useTranslation();


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const articleInfo = async () => {
        const token = aToken || dToken
        const data = await articleService.getArticleById(id, token)
        if(data){
            console.log(data)
            setArticleTitle(data.article_title);
            setArticleContent(data.article_content);
            setArticleImage(data.article_image);
            setName(data.doctor_id.username);
        }

    }
    const updateArticle = async () => {

        try {
            const formData = new FormData();
            formData.append('article_title', articleTitle)
            formData.append('article_content', articleContent)
            formData.append('article_image', image);
            const result = await articleService.updateArticle(formData, id, aToken);
            const path = aToken ? '/article' : '/doctor-article';
            if(result){
                // toast.success('Article Updated')
                navigate(path)
                await Swal.fire({
                    position: "top-end",
                    title: t("article.update.success"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (e){
            console.log(e)
        }
    }
    useEffect(() => {
        if(aToken || dToken){
            articleInfo()
            refetchAdminDetails()
        }
    }, [aToken, dToken, adminDetails]);

    return (
        <div className='m-5 w-[90vw] h-[100vh]'>
            <motion.div
                initial={{opacity: 0, y: 50}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="flex justify-between items-center mb-6"
            >
                <p className="text-xl text-primary lg:text-2xl font-semibold mb-4">
                    {t("article.update.title")}
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
                                    className="w-full h-full border object-cover rounded-lg"
                                    src={image ? URL.createObjectURL(image) : articleImage || assets.upload_icon}
                                    alt="image"
                                />
                            </div>

                            <input
                                onChange={handleImageChange}
                                type="file"
                                id="image"
                                hidden
                                accept="image/jpg"
                                disabled={readOnly && !writeOnly && !fullAccess && aToken}
                            />
                        </label>

                        {
                            aToken ? <div className="mb-6">
                                <p className="text-lg font-medium text-gray-800 bg-yellow-100 p-3 rounded-md shadow-md inline-block">
                                    {t("article.update.t")} <strong>{name}</strong>
                                </p>
                            </div> : ''
                        }
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
                            autoFocus
                            aria-required="true"
                            disabled={readOnly && !writeOnly && !fullAccess && aToken}
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
                            placeholder="Describe your health issue here..."
                            required
                            aria-required="true"
                            disabled={readOnly && !writeOnly && !fullAccess && aToken}

                        />
                    </motion.div>


                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.7, duration: 0.5}}
                        className="flex justify-end gap-6 mt-6"
                    >

                        <CustomButton
                            onClick={() => navigate(aToken ? '/article' : '/doctor-article')}
                            label={t("article.add.back")}
                            icon={Undo2}
                            textColor='text-black'
                            bgColor="bg-gray-300"
                            hoverColor="rgba(209, 213, 219, 1)"
                            shadowColor="rgba(209, 213, 219, 1)"
                        />

                        <CustomButton
                            onClick={updateArticle}
                            label={t("article.add.save")}
                            icon={Check}
                            bgColor="bg-[rgba(0,_166,_169,_1)]"
                            hoverColor="rgba(0, 166, 169, 1)"
                            shadowColor="rgba(0, 166, 169, 1)"
                            disabled={readOnly && !writeOnly && !fullAccess && aToken}

                        />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default UpdateArticle;
