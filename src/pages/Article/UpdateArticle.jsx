import React, {useContext, useEffect, useState} from 'react';
import {motion} from "framer-motion";
import {assets} from "../../assets/assets";
import {AdminContext} from "../../context/AdminContext";
import {useNavigate, useParams} from "react-router-dom";
import * as articleService from "../../service/ArticleService";
import {toast} from "react-toastify";


const UpdateArticle = () => {
    const {aToken} = useContext(AdminContext);
    const {id} = useParams();
    const navigate = useNavigate();
    const [articleTitle, setArticleTitle] = useState('');
    const [articleContent, setArticleContent] = useState('');
    const [articleImage, setArticleImage] = useState(null);
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };



    const articleInfo = async () => {
        const data = await articleService.getArticleById(id, aToken)
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
            formData.append('article_img', image);
            const result = await articleService.updateArticle(formData, id, aToken);
            if(result){
                toast.success('Article Updated')
                navigate('/article')
            }
        } catch (e){
            console.log(e)
        }
    }
    useEffect(() => {
        if(aToken){
            articleInfo()
        }
    }, [aToken]);

    return (
        <div className='m-5 w-[90vw] h-[100vh]'>
            <motion.div
                initial={{opacity: 0, y: 50}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="flex justify-between items-center mb-6"
            >
                <p className="text-xl text-primary lg:text-2xl font-semibold mb-4">
                    Update Article Information
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
                            />
                        </label>

                        <div className="mb-6">
                            <p className="text-lg font-medium text-gray-800 bg-yellow-100 p-3 rounded-md shadow-md inline-block">
                                This article is written by <strong>{name}</strong>
                            </p>
                        </div>
                    </motion.div>


                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.6, duration: 0.5}}
                        className="mb-6"
                    >
                        <label htmlFor="health-issue" className="block text-lg font-medium text-gray-700 mb-2">
                            Article Title
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
                        <label htmlFor="health-issue" className="block text-lg font-medium text-gray-700 mb-2">
                            Article Content
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
                            <i className="fas fa-arrow-left mr-2"></i> Back
                        </button>

                        <button
                            type="button"
                            onClick={updateArticle}
                            className="bg-primary px-6 py-3 text-sm text-white rounded-full hover:bg-primary-dark transition-all"
                            aria-label="Save booking"
                        >
                            <i className="fas fa-save mr-2"></i> Save
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default UpdateArticle;
