import React, { useContext, useState } from 'react';
import { useTranslation } from "react-i18next";
import { DoctorContext } from "../../../context/DoctorContext";
import { useQuery } from "@tanstack/react-query";
import * as forumService from "../../../service/ForumService";
import Loader from "../../../components/Loader";
import Error from "../../../components/Error";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquareText } from "lucide-react";
import Modal from "../../../components/Modal/Modal";
import { FaRegTrashAlt } from "react-icons/fa";
import { getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const PostList = () => {
    const { t } = useTranslation();
    const { dToken, docEmail } = useContext(DoctorContext);
    const [open, setOpen] = useState(false);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });
    const navigate = useNavigate();
    const [selectedPostId, setSelectedPostId] = useState('');

    const fetchPostsByEmail = async () => {
        try {
            const response = await forumService.getAllPostByEmail(docEmail, dToken);
            return response.filter(post => post.is_deleted === false);
        } catch (error) {
            console.error("Error fetching posts:", error);
            throw new Error("Failed to fetch posts");
        }
    };


    const { data: postList = [], isLoading, isError, refetch } = useQuery({
        queryKey: ["postsByEmail", docEmail],
        queryFn: fetchPostsByEmail,
        // onError: (error) => {
        //     if (error.response?.status === 401 && error.response?.data?.logout) {
        //
        //         Swal.fire({
        //             icon: "warning",
        //             title: "Session expired",
        //             text: "You will be logged out.",
        //             timer: 2000,
        //             showConfirmButton: false,
        //         }).then(() => {
        //             logout();
        //             navigate('/');
        //         });
        //     } else {
        //         console.error("Error fetching posts:", error.response?.data?.error || error.message);
        //     }
        // },
    });


    const openDeleteModal = (id) => {
        setOpen(true);
        setSelectedPostId(id);
    };

    const softDeletePost = async () => {
        if (selectedPostId?.length === 0) {
            await Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: t("forum.list.warn"),
            });
            setOpen(false);
            return;
        }
        try {
            await forumService.softDelete(selectedPostId, dToken);
            await refetch();
            setSelectedPostId('');
            setOpen(false);

            await Swal.fire({
                position: "top-end",
                title: t("forum.list.dsuccess"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error(error.message);
            alert("Error deleting posts: " + error.message);
        }
    };

    const table = useReactTable({
        data: postList,
        state: {
            pagination,
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
    });

    const paginatedData = [...postList].reverse().slice(
        pagination.pageIndex * pagination.pageSize,
        (pagination.pageIndex + 1) * pagination.pageSize
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-screen bg-opacity-75 fixed top-0 left-0 z-50">
                <Loader />
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <Error />
            </div>
        );
    }

    return (
        <div className="m-5 w-[90vw] h-[100vh]">
            <div className='flex justify-between'>
                <motion.p
                    className="pb-3 mt-4 font-medium text-primary lg:text-2xl border-b"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {paginatedData.length > 0 && t("doctor.post.ltitle")}
                </motion.p>
                <div>
                    <motion.button
                        onClick={() => navigate('/doctor-create-post')}
                        className='bg-primary px-10 py-3 mt-4 text-white rounded-full'
                        whileHover={{ scale: 1.05, boxShadow: '0px 4px 8px rgba(0,0,0,0.2)' }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {t("doctor.post.add")}
                    </motion.button>
                </div>
            </div>
            <div className='mt-4'>
                {paginatedData.length > 0 ? paginatedData.map((item, index) => {
                    const totalComments = item.post_comments && item.post_comments.length > 0 ? item.post_comments.length : 0;
                    const date = new Date(item.createdAt);
                    const formattedDate = date.toLocaleDateString("en-GB");

                    return (
                        <motion.div
                            whileHover={{ color: "#4A90E2" }}
                            key={item._id}
                            className="flex w-full rounded-[5px] mb-5 h-[100px] gap-4 sm:flex sm:gap-6 py-2 border-b bg-white hover:bg-gray-50 hover:shadow-lg transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                            <div className="flex-1 ml-4 text-lg text-zinc-600">
                                <motion.p
                                    whileHover={{ color: "#4A90E2" }}
                                    className="text-neutral-800 font-semibold cursor-default"
                                    transition={{ duration: 0.3 }}
                                >
                                    {item.post_title}
                                </motion.p>
                                <motion.p
                                    className="text-xs text-black mt-10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                    {formattedDate}
                                </motion.p>
                            </div>

                            <div className="flex flex-col justify-end gap-2">
                                <motion.div
                                    className='flex items-center gap-1 ml-36 mb-4'
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                >
                                    <MessageSquareText /> {totalComments}
                                </motion.div>

                                {!item.is_deleted && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => openDeleteModal(item._id)}
                                        className="text-sm text-stone-500 text-center mr-4 sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white hover:shadow-md transition-all duration-300"
                                    >
                                        {t("doctor.post.delete")}
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    );
                }) : (
                    <motion.div
                        className='text-lg text-center'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className='text-lg text-primary'>{t("doctor.post.noData")}</p>
                    </motion.div>
                )}
            </div>

            {/* Pagination */}
            {paginatedData.length > 0 && (
                <div className="flex items-center justify-end gap-2 mt-4">
                    <motion.button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-2 py-1 border border-gray-400 rounded-md hover:bg-gray-200 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {"<"}
                    </motion.button>
                    <motion.button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-2 py-1 border border-gray-400 rounded-md hover:bg-gray-200 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {">"}
                    </motion.button>

                    <div className="flex items-center gap-1">
                        <span>{t("account.accountList.page")}</span>
                        <strong>{table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</strong>
                    </div>

                    <div className="flex items-center gap-1">
                        | {t("account.accountList.goToPage")}:
                        <input
                            type="number"
                            defaultValue={table.getState().pagination.pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                table.setPageIndex(page);
                            }}
                            className="w-16 px-2 py-1 border border-gray-400 rounded-md bg-transparent hover:border-gray-500 transition-all duration-300"
                        />
                    </div>
                </div>
            )}


            <AnimatePresence>
                {open && (
                    <Modal open={open} onClose={() => setOpen(false)}>
                        <motion.div
                            className="text-center w-72"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <FaRegTrashAlt size={56} className="mx-auto text-red-500" />
                            <div className="mx-auto my-4 w-60">
                                <h3 className="text-lg font-black text-gray-800">{t("forum.list.confirmDelete")}</h3>
                                <p className="text-sm text-gray-600">{t("forum.list.pCD")}</p>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <motion.button
                                    onClick={softDeletePost}
                                    className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 py-2 rounded-md transition duration-150"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {t("forum.list.confirm")}
                                </motion.button>
                                <motion.button
                                    onClick={() => setOpen(false)}
                                    className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {t("forum.list.cancel")}
                                </motion.button>
                            </div>
                        </motion.div>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PostList;
