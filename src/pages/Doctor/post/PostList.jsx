import React, {useContext, useState} from 'react';
import {useTranslation} from "react-i18next";
import {DoctorContext} from "../../../context/DoctorContext";
import {useQuery} from "@tanstack/react-query";
import * as forumService from "../../../service/ForumService";
import Loader from "../../../components/Loader";
import Error from "../../../components/Error";
import {AnimatePresence, motion} from "framer-motion";
import {MessageSquareText} from "lucide-react";
import Modal from "../../../components/Modal/Modal";
import {FaRegTrashAlt} from "react-icons/fa";
import {getCoreRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import Card from "../../../components/Card";
import {MessageCircleDashed} from 'lucide-react'

const PostList = () => {
    const {t} = useTranslation();
    const {dToken, docEmail} = useContext(DoctorContext);
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


    const {data: postList = [], isLoading, isError, refetch} = useQuery({
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
                timer: 1500,
                backdrop: false
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
                <Loader/>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <Error/>
            </div>
        );
    }

    return (
        <div className="m-5 w-[90vw] h-[100vh]">
            <div className='flex justify-between'>
                <motion.p
                    className="pb-3 mt-4 font-bold text-primary lg:text-2xl border-b"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.5}}
                >
                    {paginatedData.length > 0 && t("doctor.post.ltitle")}
                </motion.p>
                <div className='mr-10'>
                    <motion.button
                        onClick={() => navigate('/doctor-create-post')}
                        className='flex items-center gap-2 bg-primary px-10 py-3 mt-4 text-white rounded-full'
                        whileHover={{scale: 1.05, boxShadow: '0px 4px 8px rgba(0,0,0,0.2)'}}
                        whileTap={{scale: 0.95}}
                        transition={{duration: 0.2}}
                    >
                        <MessageCircleDashed/>{t("doctor.post.add")}
                    </motion.button>
                </div>
            </div>
            <div className='mt-4'>
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {opacity: 0},
                        visible: {opacity: 1, transition: {staggerChildren: 0.1}},
                    }}
                >
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row, i) => {
                            const date = new Date(row.original.createdAt);
                            const formattedDate = date.toLocaleDateString('en-GB');
                            const totalComments =
                                row.original.post_comments && row.original.post_comments.length > 0
                                    ? row.original.post_comments.length
                                    : 0;

                            return (
                                <motion.div
                                    key={row.original._id}
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: 20}}
                                    transition={{duration: 0.3, delay: i * 0.1}}
                                >
                                    <Card
                                        id={row.original._id}
                                        email={row.original.user_id?.email}
                                        name={row.original.user_id?.username}
                                        image={row.original.user_id?.profile_image}
                                        content={row.original.post_content}
                                        title={row.original.post_title}
                                        date={formattedDate}
                                        totalComments={totalComments}
                                        refetch={refetch}
                                        value={row.original.name}
                                    />
                                </motion.div>
                            );
                        })
                    ) : (
                        <AnimatePresence>
                            <motion.p
                                className="text-center h-32 text-blue-400 flex items-center justify-center col-span-full"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                transition={{duration: 0.5}}
                            >
                                {t("forum.list.noData")}
                            </motion.p>
                        </AnimatePresence>
                    )
                    }
                </motion.div>
            </div>

            {/* Pagination */}
            {paginatedData.length > 0 && (
                <div className="flex items-center justify-end gap-2 mt-4">
                    <motion.button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-2 py-1 border border-gray-400 rounded-md hover:bg-gray-200 transition-all duration-300"
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                    >
                        {"<"}
                    </motion.button>
                    <motion.button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-2 py-1 border border-gray-400 rounded-md hover:bg-gray-200 transition-all duration-300"
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
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
                            initial={{scale: 0.8, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.8, opacity: 0}}
                            transition={{duration: 0.3}}
                        >
                            <FaRegTrashAlt size={56} className="mx-auto text-red-500"/>
                            <div className="mx-auto my-4 w-60">
                                <h3 className="text-lg font-black text-gray-800">{t("forum.list.confirmDelete")}</h3>
                                <p className="text-sm text-gray-600">{t("forum.list.pCD")}</p>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <motion.button
                                    onClick={softDeletePost}
                                    className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 py-2 rounded-md transition duration-150"
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                >
                                    {t("forum.list.confirm")}
                                </motion.button>
                                <motion.button
                                    onClick={() => setOpen(false)}
                                    className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150"
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
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
