import React, {useContext, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {AdminContext} from "../../context/AdminContext";
import * as forumService from "../../service/ForumService";
import {toast} from "react-toastify";
import {motion} from "framer-motion";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";
import CommentModal from "./CommentModal";
import {useQuery} from "@tanstack/react-query";
import {MessageCircle} from 'lucide-react';
import {DoctorContext} from "../../context/DoctorContext";
import Loader from "../../components/Loader";
import Error from "../../components/Error";


const PostDetails = () => {
    const {aToken} = useContext(AdminContext);
    const {dToken} = useContext(DoctorContext);
    const {id} = useParams();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [postData, setPostData] = useState({
        post_title: '',
        post_content: '',
        speciality_name: ''
    });
    const [cModal, setCModal] = useState(false);


    const openPostBySpecialityList = (value) => {
        navigate(aToken ? '/post-list-by-spec' : '/doctor-post', {state: {name: value}});

    }

    const {isLoading, isError, refetch} = useQuery({
        queryKey: ['postDetail'],
        queryFn: async () => {
            try {
                const token = aToken || dToken
                const result = await forumService.getPost(id, token)
                if (result) {
                    setPostData(result)
                    return result
                }
                return null
            } catch (e) {
                console.log(e)
            }
        }
    })
    const updatePostInfo = async (event) => {
        event.preventDefault();
        try {
            const payload = {
                post_title: postData.post_title,
                post_content: postData.post_content,
                speciality_name: postData.speciality_id.name,
            };
            const result = await forumService.updatePost(payload, id, aToken);
            let path = aToken ? '/post-list-by-spec' : '/doctor-post'
            if (result) {
                navigate(path, {state: {name: postData.speciality_id.name}});
                await Swal.fire({
                    position: "top-end",
                    title: t("forum.update.success"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop: false
                });
            }
        } catch (e) {
            console.error(e);
            toast.error('Failed to update post');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-screen bg-opacity-75 fixed top-0 left-0 z-50">
                <Loader />
            </div>
        )
    }

    if(isError){
        return (
            <div>
                <Error />
            </div>
        )
    }


    // useEffect(() => {
    //     if (aToken) {
    //         getPostDetails()
    //     }
    // }, [aToken]);

    return (
        <div className='m-5 w-[90vw] h-[100vh]'>
            <motion.div
                className="flex flex-col justify-between"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                <motion.div
                    className="flex justify-start mb-6"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.3}}
                >
                    <p className="text-2xl lg:text-2xl text-primary font-bold ">
                        {t("forum.update.title")}
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
                        {aToken && <div className="flex items-center gap-6 mb-8 text-gray-500">
                            <div className="text-center">
                                <p className="text-base font-semibold">
                                    {t("forum.update.t")} <span
                                    className="text-primary">{postData?.user_id?.email}</span>
                                </p>
                            </div>
                        </div>}

                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 text-gray-600">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label
                                        className="text-lg text-primary font-medium">{t("forum.update.ptitle")}</label>
                                    <motion.input
                                        onChange={(e) => setPostData(prev => ({ ...prev, post_title: e.target.value }))}
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
                                    <label
                                        className="text-lg text-primary font-medium">{t("forum.update.content")}</label>
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
                                className="bg-gray-300 px-8 py-2 text-sm text-gray-700 rounded-full hover:bg-gray-400 transition-all"
                                whileHover={{scale: 1.1}}
                            >
                                {t("forum.update.back")}
                            </motion.button>

                            <motion.button
                                type="submit"
                                className="bg-primary px-8 py-2 text-sm text-white rounded-full hover:bg-primary-dark transition-all"
                                whileHover={{scale: 1.1}}
                            >
                                {t("forum.update.save")}
                            </motion.button>
                        </div>
                        <motion.p
                            className='flex items-center gap-1 justify-end text-black cursor-pointer mt-3 mr-2'
                            onClick={() => setCModal(true)}
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            whileHover={{color: "#00A6A9", textDecoration: "underline", scale: 1.02}}
                            whileTap={{scale: 0.95}}
                            transition={{duration: 0.3}}
                        >
                            <MessageCircle className="-scale-x-100"/>
                            {t("forum.list.cs")}
                        </motion.p>
                    </div>
                </motion.form>
            </motion.div>

            <CommentModal
                open={cModal}
                onClose={() => setCModal(false)}
                comments={postData?.post_comments?.reverse()}
                post_id={postData._id}
                refetch={refetch}
            />
        </div>
    );
};

export default PostDetails;
