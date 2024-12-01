import React, {useContext, useState} from 'react';
import {AnimatePresence, motion} from "framer-motion";
import {FaRegTrashAlt, FaTrashRestoreAlt} from "react-icons/fa";
import Modal from "../../../components/Modal/Modal";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel, getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {ArchiveRestore} from "lucide-react";
import {useTranslation} from "react-i18next";
import * as forumService from "../../../service/ForumService";
import Error from "../../../components/Error";
import {useQuery} from "@tanstack/react-query";
import Loader from "../../../components/Loader";
import {DoctorContext} from "../../../context/DoctorContext";
import Swal from "sweetalert2";

const DeletedPost = () => {
    const {dToken, docEmail} = useContext(DoctorContext);
    const columnHelper = createColumnHelper();
    const [selectedPostId, setSelectedPostId] = useState('');
    const [globalFilter, setGlobalFilter] = useState('');
    const [open, setOpen] = useState(false);
    const {t} = useTranslation();


    const fetchPostsByEmail = async () => {
        try {
            const response = await forumService.getAllPostByEmail(docEmail, dToken);
            return response.filter(post => post.is_deleted === true);
        } catch (error) {
            console.error("Error fetching posts:", error);
            throw new Error("Failed to fetch posts");
        }
    };

    const {data: postList = [], isLoading, isError, refetch} = useQuery({
        queryKey: ["postsByEmail", docEmail],
        queryFn: fetchPostsByEmail,
    });

    const openDeleteModal = async (id) => {
        if(selectedPostId.length === 0) {
            await Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: t("forum.list.warn"),
                backdrop: false
            });
        } else {
            setOpen(true)
            setSelectedPostId(id)
        }
    };


    const columns = [
        columnHelper.accessor("_id", {id: "_id", cell: (info) => <span>{info.row.index + 1}</span>, header: "S.No"}),
        columnHelper.accessor("post_title", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: t("forum.list.ttitle")
        }),
        columnHelper.accessor("createdAt", {
            cell: (info) => {
                const date = new Date(info?.getValue())
                return <span>{date.toLocaleDateString('en-GB')}</span>
            },
            header: t("doctor.post.date")
        })
    ];

    const permanentDeletePost = async () => {
        try {
            console.log(selectedPostId)
            await forumService.permanentDelete(selectedPostId, dToken);
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


    const restorePost = async () =>{
        if (selectedPostId?.length === 0) {
            await Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: t("forum.list.rwarn"),
            });
            return;
        }
        try {
            await forumService.restorePost(selectedPostId, dToken);
            await refetch();
            setSelectedPostId('');
            setOpen(false);

            await Swal.fire({
                position: "top-end",
                title: t("forum.list.rsuccess"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error(error.message);
        }
    }

    const table = useReactTable({
        data: postList || [],
        columns,
        state: {globalFilter},
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {pagination: {pageSize: 7}}
    });


    if (isLoading) {
        return (
            <div className='flex justify-center items-center w-full h-screen bg-opacity-75 fixed top-0 left-0 z-50'>
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
        <div className='className="mb-5 ml-5 mr-5 mt-1 w-[100vw] h-[100vh]'>

            <motion.div
                className="m-5 max-h-[90vh] overflow-y-scroll"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
            >

                <div className="flex justify-between items-center">
                    <h1 className="text-lg max-w-[50vw] text-primary lg:text-2xl font-medium">
                        {t("doctor.dashboard.dp")}
                    </h1>
                    <div className="flex gap-3 mr-3">
                        <motion.button
                            onClick={restorePost}
                            className="flex items-center gap-2 px-10 py-3 mt-4 rounded-full text-white bg-green-600 shadow-red-400/40 cursor-pointer"
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.9}}>
                            <ArchiveRestore/> {t("forum.list.put")}
                        </motion.button>

                        <motion.button
                            onClick={() => openDeleteModal(selectedPostId)}
                            className="flex items-center gap-2 px-10 py-3 mt-4 rounded-full text-white bg-red-600 shadow-red-400/40 cursor-pointer"
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.9}}>
                            {t("forum.list.dp")}
                        </motion.button>

                    </div>
                </div>


                <motion.div
                    className="mt-5 w-full"
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}>
                    <input
                        type="text"
                        placeholder={t("forum.list.search")}
                        value={globalFilter || ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-[20vw] p-3 border border-gray-300 rounded mb-4 focus:ring focus:ring-blue-300"
                    />
                </motion.div>


                <motion.table className="border border-gray-700 w-full mt-5 text-left text-white border-collapse"
                              initial={{opacity: 0}} animate={{opacity: 1}}>
                    <thead className="bg-gray-600">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            <th className="p-2">
                                <input
                                    type="checkbox"
                                    disabled
                                />
                            </th>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}
                                    className="capitalize p-2">{flexRender(header.column.columnDef.header, header.getContext())}</th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    <AnimatePresence>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row, i) => (
                                <motion.tr
                                    key={row.id}
                                    className={i % 2 === 0 ? 'bg-cyan-600' : 'bg-cyan-900'}
                                    initial={{y: 10, opacity: 0}}
                                    animate={{y: 0, opacity: 1}}
                                    exit={{y: 10, opacity: 0}}
                                >
                                    <td className="p-2">
                                        <input type="checkbox"
                                               checked={selectedPostId === row.original._id}
                                               onChange={() => setSelectedPostId(row.original._id)}
                                        />
                                    </td>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-2"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </motion.tr>
                            ))
                        ) : (
                            <motion.tr className="text-center h-32 text-blue-400" initial={{opacity: 0}}
                                       animate={{opacity: 1}}>
                                <td colSpan={12}>{t("forum.list.noData")}</td>
                            </motion.tr>
                        )}
                    </AnimatePresence>
                    </tbody>
                </motion.table>
                <AnimatePresence>
                    {open && (
                        <Modal open={open} onClose={() => setOpen(false)}>
                            <motion.div className="text-center w-72" initial={{scale: 0.8, opacity: 0}}
                                        animate={{scale: 1, opacity: 1}} exit={{scale: 0.8, opacity: 0}}>
                                <FaRegTrashAlt size={56} className="mx-auto text-red-500"/>
                                <div className="mx-auto my-4 w-60">
                                    <h3 className="text-lg font-black text-gray-800">{t("forum.list.confirmDelete")}</h3>
                                    <p className="text-sm text-gray-600">{t("forum.list.pCD")}</p>
                                </div>
                                <div className="flex gap-4 mt-6">

                                    <button
                                        onClick={permanentDeletePost}
                                        className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 py-2 rounded-md transition duration-150">
                                        {t("forum.list.confirm")}
                                    </button>


                                    <button onClick={() => setOpen(false)}
                                            className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150">
                                        {t("forum.list.cancel")}
                                    </button>
                                </div>
                            </motion.div>
                        </Modal>
                    )}
                </AnimatePresence>
            </motion.div>

            {
                postList.length > 0 && <div className="flex items-center justify-end gap-2 mr-5 mt-4">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-2 py-1 border border-gray-400 rounded-md"
                    >
                        {"<"}
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-2 py-1 border border-gray-400 rounded-md"
                    >
                        {">"}
                    </button>

                    <div className="flex items-center gap-1">
                        <span>{t("account.accountList.page")}</span>
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </strong>
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
                            className="w-16 px-2 py-1 border border-gray-400 rounded-md bg-transparent"
                        />
                    </div>
                </div>
            }
        </div>
    );
};

export default DeletedPost;
