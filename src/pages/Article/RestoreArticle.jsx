import React, {useContext, useEffect, useState} from 'react';
import {
    createColumnHelper, flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {useNavigate} from "react-router-dom";
import {AdminContext} from "../../context/AdminContext";
import * as articleService from "../../service/ArticleService";
import {toast} from "react-toastify";
import {assets} from "../../assets/assets";
import {AnimatePresence, motion} from "framer-motion";
import {FaRegNewspaper, FaRegTrashAlt} from "react-icons/fa";
import Modal from "../../components/Modal/Modal";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";

const RestoreArticle = () => {
    const columnHelper = createColumnHelper();
    const [selectedAccountIds, setSelectedAccountIds] = useState([]);
    const navigate = useNavigate();
    const [globalFilter, setGlobalFilter] = useState("");

    const [open, setOpen] = useState(false);
    const {aToken} = useContext(AdminContext);
    const [data, setData] = useState([]);


    const getAllDeletedArticle = async () => {
        try {
            const data = await articleService.findAll("true",aToken)
            if (data) {
                setData(data);
                console.log(data)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const restoreDeletedArticle = async () => {
        try {
            const data = await articleService.restoreDeletedArticle(selectedAccountIds, aToken);
            if(data){
                toast.success('Restore Successful')
                await getAllDeletedArticle();
            }

        }catch (e) {
            console.log(e)
        }
    }

    const openDeleteModal = () => {
        if (selectedAccountIds?.length === 0) {
            toast.warn('No article selected for deletion');
        } else {
            setOpen(true);
        }
    };

    const deletePermanentArticles = async () => {
        if (selectedAccountIds?.length === 0) {
            toast.warn('No article selected for deletion');
            return;
        }
        try {
            const response = await articleService.deletePermanentArticle(selectedAccountIds, aToken);
            await getAllDeletedArticle();
            toast.success(response.message);
            setSelectedAccountIds([]);
            setOpen(false);
        } catch (error) {
            console.error(error.message);
            alert("Error deleting article: " + error.message);
        }
    };

    useEffect(() => {
        if (aToken) {
            getAllDeletedArticle();
        }
    }, [aToken])


    const toggleAccountSelection = (id) => {
        setSelectedAccountIds((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((accountId) => accountId !== id)
                : [...prevSelected, id]
        );
    };



    const columns = [
        columnHelper.accessor("_id", {id: "_id", cell: (info) => <span>{info.row.index + 1}</span>, header: "S.No"}),
        columnHelper.accessor("article_image", {
            cell: (info) => <img className="rounded-full w-10 h-10 object-cover"
                                 src={info?.getValue() || assets.user_icon} alt="..."/>,
            header: "Image"
        }),
        columnHelper.accessor("article_title", {cell: (info) => <span>{info?.getValue()}</span>, header: "Article Title"}),
        columnHelper.accessor("doctor_id.username", {cell: (info) => <span>{info?.getValue()}</span>, header: "Doctor"}),
        columnHelper.accessor("doctor_id.speciality_id.name", {cell: (info) => <span>{info?.getValue()}</span>, header: "Speciality"}),
        columnHelper.accessor("date_published", {cell: (info) => {
                const date = new Date(info?.getValue())
                return <span>{date.toLocaleDateString("en-GB")}</span>
            }, header: "Publish Date"
        })
    ];

    const table = useReactTable({
        data: data || [],
        columns,
        state: {globalFilter},
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });


    return (
        <motion.div className="m-5 max-h-[90vh] w-[90vw] overflow-y-scroll" initial={{opacity: 0}}
                    animate={{opacity: 1}} exit={{opacity: 0}}>
            <div className="flex justify-between items-center">
                <h1 className="text-lg text-primary lg:text-2xl font-medium">Deleted Article</h1>
                <div className="flex gap-1">

                    <button
                        onClick={restoreDeletedArticle}
                        className="flex items-center gap-2 px-10 py-3 mt-4 rounded-full text-white bg-green-600 shadow-red-400/40 cursor-pointer">
                        <MdOutlineSettingsBackupRestore />
                    </button>

                    <button
                        onClick={openDeleteModal}
                        className="flex items-center gap-2 px-10 py-3 mt-4 rounded-full text-white bg-red-600 shadow-red-400/40 cursor-pointer">
                        <FaRegTrashAlt/> Delete Permanently
                    </button>

                </div>
            </div>

            <div className="mt-5">
                <input

                    type="text"
                    placeholder="Search news..."
                    value={globalFilter || ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-[20vw] p-3 border border-gray-300 rounded mb-4"
                />
            </div>

            <AnimatePresence>
                {open && (
                    <Modal open={open} onClose={() => setOpen(false)}>
                        <motion.div className="text-center w-72" initial={{scale: 0.8, opacity: 0}}
                                    animate={{scale: 1, opacity: 1}} exit={{scale: 0.8, opacity: 0}}>
                            <FaRegTrashAlt size={56} className="mx-auto text-red-500"/>
                            <div className="mx-auto my-4 w-60">
                                <h3 className="text-lg font-black text-gray-800">Confirm Delete</h3>
                                <p className="text-sm text-gray-600">Are you sure you want to delete?</p>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={deletePermanentArticles}
                                    className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 py-2 rounded-md transition duration-150">Delete
                                </button>
                                <button onClick={() => setOpen(false)}
                                        className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150">Cancel
                                </button>
                            </div>
                        </motion.div>
                    </Modal>
                )}
            </AnimatePresence>

            <motion.table className="border border-gray-700 w-full mt-5 text-left text-white border-collapse"
                          initial={{opacity: 0}} animate={{opacity: 1}}>
                <thead className="bg-gray-600">
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        <th className="p-2">
                            <input
                                type="checkbox"
                                checked={table.getRowModel().rows.length > 0 && table.getRowModel().rows.every((row) => selectedAccountIds.includes(row.original._id))}
                                onChange={(e) =>
                                    setSelectedAccountIds(
                                        e.target.checked ? table.getRowModel().rows.map((row) => row.original._id) : []
                                    )
                                }
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
                                    <input type="checkbox" checked={selectedAccountIds.includes(row.original._id)}
                                           onChange={() => toggleAccountSelection(row.original._id)}
                                    />
                                </td>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="p-2"
                                        onClick={() => navigate(`/update-article/${row.original._id}`)}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </motion.tr>
                        ))
                    ) : (
                        <motion.tr className="text-center h-32 text-blue-400" initial={{opacity: 0}}
                                   animate={{opacity: 1}}>
                            <td colSpan={12}>No Article Found!</td>
                        </motion.tr>
                    )}
                </AnimatePresence>
                </tbody>
            </motion.table>

        </motion.div>
    );
};

export default RestoreArticle;
