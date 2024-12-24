import React, {useContext, useEffect, useState} from 'react';
import {AdminContext} from "../../context/AdminContext";
import {useNavigate} from "react-router-dom";
import {AnimatePresence, motion} from "framer-motion";
import * as forumService from "../../service/ForumService";
import {FaRegTrashAlt} from "react-icons/fa";
import Modal from "../../components/Modal/Modal";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel, getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {useLocation} from 'react-router-dom';
import {FaTrashRestoreAlt} from "react-icons/fa";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";
import Card from "../../components/Card";
import CustomButton from "../../components/button/CustomButton";
import {LuMapPinOff} from "react-icons/lu";
import {MapPinPlus, Trash2} from 'lucide-react'
import SearchInput from "../../components/SearchInput";
import {Tooltip} from "@mui/material";


const PostListByForum = () => {

    const {aToken, refetchAdminDetails, adminDetails, readOnly, writeOnly, fullAccess} = useContext(AdminContext);
    const navigate = useNavigate();
    const location = useLocation();
    const {name, isDelete} = location.state || {};
    const columnHelper = createColumnHelper();
    const [selectedPostId, setSelectedPostId] = useState('');
    const [globalFilter, setGlobalFilter] = useState("");
    const [open, setOpen] = useState(false);

    const [data, setData] = useState([]);
    const {t} = useTranslation();

    const getAllPostBySpeciality = async () => {
        try {
            const result = await forumService.getAllPostBySpeciality(name, aToken);
            if (!isDelete) {
                const filteredPosts = result.filter(post => !post.is_deleted);
                setData(filteredPosts);
            } else {
                const filteredPosts = result.filter(post => post.is_deleted);
                setData(filteredPosts);
            }

        } catch (error) {
            console.error("Error fetching posts by speciality:", error);
        }
    };


    const openDetailPage = async (id, value) => {
        navigate(`/update-post/${id}`, {state: {name: value}})
    }

    const columns = [
        columnHelper.accessor("_id", {id: "_id", cell: (info) => <span>{info.row.index + 1}</span>, header: "S.No"}),
        columnHelper.accessor("post_title", {
            cell: (info) => <span className="truncate max-w-[500px] block">{info?.getValue()}</span>,
            header: t("forum.list.ttitle")
        }),
        columnHelper.accessor("speciality_id.name", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: t("forum.list.spec")
        }),
        columnHelper.accessor("user_id.email", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: t("forum.list.user")
        }),
    ];
    const table = useReactTable({
        data: data || [],
        columns,
        state: {globalFilter},
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {pagination: {pageSize: 6}}
    });


    const openDeleteModal = () => {
        if (selectedPostId?.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: t("forum.list.warn"),
            });
        } else {
            setOpen(true);
        }
    };

    const softDeletePost = async () => {
        if (selectedPostId?.length === 0) {
            await Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: t("forum.list.warn"),
            });
            return;
        }
        try {
            await forumService.softDelete(selectedPostId, aToken);
            await getAllPostBySpeciality();
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

    const permanentDeletePost = async () => {
        if (selectedPostId?.length === 0) {
            await Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: t("forum.list.warn"),
            });
            return;
        }
        try {
            await forumService.permanentDelete(selectedPostId, aToken);
            await getAllPostBySpeciality();
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


    const restorePost = async () => {
        if (selectedPostId?.length === 0) {
            await Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: t("forum.list.rwarn"),
            });
            return;
        }
        try {
            await forumService.restorePost(selectedPostId, aToken);
            await getAllPostBySpeciality();
            setSelectedPostId('');
            setOpen(false);

            await Swal.fire({
                position: "top-end",
                title: t("forum.list.rsuccess"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false
            });
        } catch (error) {
            console.error(error.message);
        }
    }

    const checkId = (id) => {

        if (selectedPostId === id) {
            setSelectedPostId('')
        } else {
            setSelectedPostId(id)
        }
    }

    useEffect(() => {
        if (aToken) {
            getAllPostBySpeciality()
            refetchAdminDetails()
        }
    }, [aToken, isDelete, adminDetails]);
    return (
        <div className='mb-5 pl-5 mr-5 mt-1 w-[100vw] h-[100vh]'>

            <motion.div
                className="m-5 max-h-[90vh] overflow-y-scroll"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
            >

                {
                    !isDelete
                        ? <div className="flex justify-between items-center">
                            <h1 className="text-lg text-primary lg:text-2xl font-bold">{t("forum.list.spec")}: {name}</h1>
                            <div className="flex mr-6">

                                <CustomButton
                                    onClick={() => navigate('/post-list-by-spec', {state: {name: name, isDelete: true}})}
                                    label={t("forum.list.restore")}
                                    icon={FaRegTrashAlt}
                                    bgColor="bg-gray-600"
                                    hoverColor="rgba(75, 85, 99, 0.8)"
                                    shadowColor="rgba(75, 85, 99, 0.8)"
                                />

                                {/*<button*/}
                                {/*    onClick={() => navigate('/post-list-by-spec', {state: {name: name, isDelete: true}})}*/}
                                {/*    className="flex items-center gap-2 px-10 py-3 mt-4 rounded-full text-white bg-gray-500 shadow-red-400/40 cursor-pointer">*/}
                                {/*    <FaRegTrashAlt/> {t("forum.list.restore")}*/}
                                {/*</button>*/}
                            </div>
                        </div>
                        : <div className="flex justify-between items-center">
                            <h1 className="text-lg max-w-[50vw] text-primary lg:text-2xl font-medium">{t("forum.list.dspec")} {name}</h1>
                            <div className="flex gap-4 mr-4">
                                {
                                    (readOnly && !writeOnly && !fullAccess) && (
                                        <Tooltip title={t("common.access.permission")} arrow>
                                            <span>
                                                 <CustomButton
                                                     onClick={restorePost}
                                                     label={t("forum.list.put")}
                                                     icon={FaTrashRestoreAlt}
                                                     bgColor="bg-green-600"
                                                     hoverColor="rgba(22, 163, 74, 0.4)"
                                                     shadowColor="rgba(22, 163, 74, 0.4)"
                                                     disabled={readOnly && !fullAccess && !writeOnly}
                                                     cursor={true}
                                                 />
                                            </span>

                                        </Tooltip>
                                    )
                                }


                                {
                                    (fullAccess || writeOnly) && (
                                        <CustomButton
                                            onClick={restorePost}
                                            label={t("forum.list.put")}
                                            icon={FaTrashRestoreAlt}
                                            bgColor="bg-green-600"
                                            hoverColor="rgba(22, 163, 74, 0.4)"
                                            shadowColor="rgba(22, 163, 74, 0.4)"
                                        />

                                    )
                                }



                                {
                                    (readOnly && !writeOnly && !fullAccess) && (
                                        <Tooltip title={t("common.access.permission")} arrow>
                                            <span>
                                                 <CustomButton
                                                     onClick={openDeleteModal}
                                                     label={t("forum.list.dp")}
                                                     icon={Trash2}
                                                     bgColor="bg-red-600"
                                                     hoverColor="rgba(0, 128, 255, 0.4)"
                                                     shadowColor="rgba(255, 0, 0, 0.4)"
                                                     disabled={readOnly && !fullAccess && !writeOnly}
                                                     cursor={true}
                                                 />
                                            </span>
                                        </Tooltip>
                                    )
                                }


                                {
                                    (fullAccess || writeOnly) && (
                                        <CustomButton
                                            onClick={openDeleteModal}
                                            label={t("forum.list.dp")}
                                            icon={Trash2}
                                            bgColor="bg-red-600"
                                            hoverColor="rgba(0, 128, 255, 0.4)"
                                            shadowColor="rgba(255, 0, 0, 0.4)"
                                        />
                                    )
                                }
                                {/*<button*/}
                                {/*    onClick={restorePost}*/}
                                {/*    className="flex items-center gap-2 px-10 py-3 mt-4 rounded-full text-white bg-green-600 shadow-red-400/40 cursor-pointer">*/}
                                {/*    <FaTrashRestoreAlt/>{t("forum.list.put")}*/}
                                {/*</button>*/}


                            </div>
                        </div>
                }

                {
                    data.length > 0 && <div className="mt-2 mb-5">
                        <SearchInput globalFilter={globalFilter}
                                     setGlobalFilter={setGlobalFilter}
                                     t={t("forum.list.search")}
                                     disableHover={true}
                        />

                    </div>
                }

                {
                    !isDelete ? <motion.div
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
                                                refetch={getAllPostBySpeciality}
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
                            )}
                        </motion.div>
                        : <motion.table
                            className="border border-gray-700 w-full mt-5 text-left text-white border-collapse"
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
                                                <input type="checkbox" checked={selectedPostId.includes(row.original._id)}
                                                       onChange={() => checkId(row.original._id)}/>
                                            </td>
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="p-2"
                                                    onClick={() => openDetailPage(row.original._id, row.original.name)}>
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
                }


            </motion.div>


            {
                data.length > 0 && <div className="flex items-center justify-end gap-2 mr-5 mt-4">
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
                                {
                                    !isDelete
                                        ? <button onClick={softDeletePost}
                                                  className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 py-2 rounded-md transition duration-150">
                                            {t("forum.list.confirm")}
                                        </button>
                                        : <button onClick={permanentDeletePost}
                                                  className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 py-2 rounded-md transition duration-150">
                                            {t("forum.list.pconfirm")}
                                        </button>
                                }
                                <button onClick={() => setOpen(false)}
                                        className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150">
                                    {t("forum.list.cancel")}
                                </button>
                            </div>
                        </motion.div>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PostListByForum;
