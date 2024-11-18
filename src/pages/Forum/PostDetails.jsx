import React, {useContext, useEffect, useState} from 'react';
import {assets} from "../../assets/assets";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {AdminContext} from "../../context/AdminContext";
import * as forumService from "../../service/ForumService";
import {toast} from "react-toastify";
import { motion } from "framer-motion";



const PostDetails = () => {
    const {aToken} = useContext(AdminContext);
    const {id} = useParams();
    const navigate = useNavigate();

    const [postData, setPostData] = useState({
        post_title: '',
        post_content: '',
        speciality_name: ''
    });


    const openPostBySpecialityList = (value) => {
        navigate('/post-list-by-speciality', { state: { name: value } });

    }

    const getPostDetails = async () => {
        try {
            const result = await forumService.getPost(id, aToken)
            if(result){
                console.log(result)
                setPostData(result)
            }
        } catch (e) {
            console.log(e)
        }
    }
    const updatePostInfo = async (event) => {
        event.preventDefault();
        try {
            const payload = {
                post_title: postData.post_title,
                post_content: postData.post_content,
                speciality_name: postData.speciality_id.name,
            };
            const result = await forumService.updatePost(payload, id, aToken);
            if (result) {
                toast.success('Post Updated');
                navigate('/post-list-by-speciality', { state: { name: postData.speciality_id.name } });            }
        } catch (e) {
            console.error(e);
            toast.error('Failed to update post');
        }
    };


    useEffect(() => {
        if(aToken){
            getPostDetails()
        }
    }, [aToken]);

    return (
        <div className='className="mb-5 ml-5 mr-5 mt-1 w-[60vw] h-[100vh]'>
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                <motion.div
                    className="flex justify-between items-center mb-6"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.3}}
                >
                    <p className="text-2xl lg:text-2xl text-primary font-bold mb-4">
                        Update Post Information
                    </p>
                </motion.div>

                <motion.form
                    onSubmit={updatePostInfo}
                    className="m-5 w-full max-w-4xl mx-auto"
                    initial={{opacity: 0, scale: 0.95}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{delay: 0.2, duration: 0.4}}
                >
                    <div
                        className="bg-white px-10 py-10 border rounded-xl shadow-lg w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center gap-6 mb-8 text-gray-500">
                            <div className="text-center">
                                <p className="text-base font-semibold">
                                    This post is created by <span
                                    className="text-primary">{postData?.user_id?.email}</span>
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 text-gray-600">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-lg font-medium">Post Title</label>
                                    <motion.input
                                        onChange={(e) => setPostData(prev => ({...prev, post_title: e.target.value}))}
                                        value={postData?.post_title}
                                        className="border rounded-lg px-5 py-4 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                        type="text"
                                        placeholder="Title"
                                        required
                                        autoFocus
                                        whileFocus={{scale: 1.02}}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-lg font-medium">Post Content</label>
                                    <motion.textarea
                                        onChange={(e) => setPostData(prev => ({...prev, post_content: e.target.value}))}
                                        value={postData?.post_content}
                                        className="border rounded-lg px-5 py-4 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                        placeholder="Content"
                                        required
                                        rows={6}
                                        whileFocus={{scale: 1.02}}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-8 mt-8">
                            <motion.button
                                onClick={() => openPostBySpecialityList(postData.speciality_id.name)}
                                className="bg-gray-300 px-8 py-4 text-lg text-gray-700 rounded-full hover:bg-gray-400 transition-all"
                                whileHover={{scale: 1.1}}
                            >
                                Back
                            </motion.button>

                            <motion.button
                                type="submit"
                                className="bg-primary px-8 py-4 text-lg text-white rounded-full hover:bg-primary-dark transition-all"
                                whileHover={{scale: 1.1}}
                            >
                                Save
                            </motion.button>
                        </div>
                    </div>
                </motion.form>
            </motion.div>
        </div>
    );
};

export default PostDetails;
