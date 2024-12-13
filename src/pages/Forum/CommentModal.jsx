import React, {useContext, useState} from "react";
import Modal from "../../components/Modal/ModalLarge";
import {motion, AnimatePresence} from "framer-motion";
import {Trash2, ArrowBigLeftDash} from "lucide-react";
import {FaRegTrashAlt} from "react-icons/fa";
import {useTranslation} from "react-i18next";
import {AdminContext} from "../../context/AdminContext";
import {assets} from "../../assets/assets";
import ModalD from "../../components/Modal/Modal";
import * as forumService from "../../service/ForumService";
import Swal from "sweetalert2";
import {X} from 'react-feather';
import CustomButton from "../../components/button/CustomButton";
import ButtonDelete from "../../components/button/ButtonDelete";


const CommentModal = ({open, onClose, comments, post_id, refetch}) => {
    const {t} = useTranslation()
    const {aToken} = useContext(AdminContext)
    const [openD, setOpenD] = useState(false)
    const [cId, setCId] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)

    const openDeleteModal = (id) => {
        setOpenD(true)
        setCId(id)
    }

    const deleteComment = async () => {
        try {
            setIsDeleting(true)
            await forumService.deleteComment(post_id, cId, aToken)
            refetch()
            setOpenD(false)
            await Swal.fire({
                position: "top-end",
                title: t("forum.list.csuccess"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false,
                width: "450px",
            })
        } catch (e) {
            console.log(e)
            setIsDeleting(false)
        }
    }
    return (
        <Modal className="w-full max-w-4xl h-full max-h-[90vh]" open={open} onClose={onClose}>
            {open && (
                <motion.div
                    key="modal"
                    initial={{opacity: 0, scale: 0.9}}
                    animate={{opacity: 1, scale: 1}}
                    exit={{opacity: 0, scale: 0.9}}
                    transition={{duration: 0.4, ease: "easeInOut"}}
                    className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
                >
                    <motion.div
                        key="modal-content"
                        className="bg-white rounded-lg shadow-lg w-full max-w-4xl h-full max-h-[80vh] flex flex-col"
                        initial={{opacity: 0, y: 50}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 50}}
                        transition={{duration: 0.5, ease: "easeOut"}}
                    >
                        <div className="p-4 flex justify-between border-b border-gray-200">
                            <h3 className="text-lg text-primary font-semibold">{t("forum.list.comments")}</h3>

                            <button
                                onClick={onClose}
                                className="p-1 rounded-full text-red-500 bg-white hover:text-white hover:bg-red-500 transition duration-150"
                            >
                                <X size={20}/>
                            </button>
                        </div>

                        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                            <AnimatePresence>
                                {comments.length > 0
                                    ? comments?.map((item, index) => (
                                        <motion.div
                                            key={item._id}
                                            initial={{opacity: 0, x: -50}}
                                            animate={{opacity: 1, x: 0}}
                                            exit={{opacity: 0, x: 50}}
                                            transition={{
                                                duration: 0.5,
                                                delay: index * 0.05,
                                            }}
                                            className="flex w-full rounded-lg p-4 bg-gray-100"
                                        >
                                            <div className="flex gap-2 w-full h-full">
                                                <div className="w-12 h-12">
                                                    <motion.img
                                                        className="w-full h-full object-cover rounded-full bg-indigo-50"
                                                        src={item.replier.profile_image ? item.replier.profile_image : assets.user_icon}
                                                        alt="User"
                                                        initial={{scale: 0.9}}
                                                        animate={{scale: 1}}
                                                        transition={{duration: 0.3, ease: "easeInOut"}}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <motion.p
                                                        className="text-neutral-800 font-semibold cursor-default"
                                                        whileHover={{color: "#00A6A9"}}
                                                        transition={{duration: 0.3}}
                                                    >
                                                        {item.replier.username}
                                                    </motion.p>
                                                    <motion.p
                                                        className="text-xs text-black mt-1"
                                                        initial={{opacity: 0}}
                                                        animate={{opacity: 1}}
                                                        transition={{duration: 0.3, delay: 0.2}}
                                                    >
                                                        {item.comment_content}
                                                    </motion.p>
                                                </div>
                                            </div>
                                            <div className="relative h-full">
                                                {/*<motion.button*/}
                                                {/*    whileHover={{scale: 1.05}}*/}
                                                {/*    whileTap={{scale: 0.95}}*/}
                                                {/*    onClick={() => openDeleteModal(item._id)}*/}
                                                {/*    className="absolute top-[-18px] right-[1px] text-sm text-stone-500 py-2 transition-all duration-300"*/}
                                                {/*>*/}
                                                {/*    <Trash2*/}
                                                {/*        className="text-stone-500 transition-colors duration-300 hover:text-red-500"/>*/}
                                                {/*</motion.button>*/}
                                                <ButtonDelete
                                                    onClick={() => openDeleteModal(item._id)}
                                                    text={t("forum.list.delete")}
                                                />
                                            </div>

                                        </motion.div>
                                    )) : (
                                        <AnimatePresence>
                                            <motion.p
                                                className="text-center h-32 text-blue-400 flex items-center justify-center col-span-full"
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                exit={{opacity: 0}}
                                                transition={{duration: 0.5}}
                                            >
                                                {t("forum.list.noCData")}
                                            </motion.p>
                                        </AnimatePresence>
                                    )}
                            </AnimatePresence>
                        </div>

                        {
                            comments.length > 0 && <div className="p-4 border-t border-gray-200 flex justify-end">
                                <CustomButton
                                    onClick={onClose}
                                    label={t("forum.list.close")}
                                    icon={ArrowBigLeftDash}
                                    bgColor="bg-[rgba(0,_166,_169,_1)]"
                                    hoverColor="rgba(0, 166, 169, 1)"
                                    shadowColor="rgba(0, 166, 169, 1)"
                                />

                            </div>
                        }

                    </motion.div>
                </motion.div>
            )}

            {openD && (
                <ModalD open={openD} onClose={() => setOpenD(false)}>
                    <motion.div
                        className="text-center w-72"
                        initial={{scale: 0.8, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        exit={{scale: 0.8, opacity: 0}}
                    >
                        <FaRegTrashAlt size={56} className="mx-auto text-red-500"/>
                        <div className="mx-auto w-full my-4">
                            <h3 className="text-lg font-black text-gray-800">
                                {t("forum.list.confirmDelete")}
                            </h3>
                            <p className="text-sm text-gray-600">{t("forum.list.commentDelete")}</p>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={deleteComment}
                                className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 py-2 rounded-md transition duration-150"
                                disabled={isDeleting}
                            >
                                {isDeleting ? t("forum.list.deleting") : t("forum.list.confirm")}
                            </button>
                            <button
                                onClick={() => setOpenD(false)}
                                className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150"
                            >
                                {t("forum.list.cancel")}
                            </button>
                        </div>
                    </motion.div>
                </ModalD>
            )}
        </Modal>
    );
};

export default CommentModal;
