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
import {assets} from "../../assets/assets";
import * as accountService from "../../service/AccountService";
import Modal from "../../components/Modal/Modal";
import {FaRegTrashAlt} from "react-icons/fa";
import {IoPersonAddOutline} from "react-icons/io5";
import {toast} from "react-toastify";
import {motion, AnimatePresence} from "framer-motion";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import {Tooltip} from "@mui/material";
import CustomButton from "../../components/button/CustomButton";
import {CircleUser} from "lucide-react";

const DoctorAccountList = () => {

    const columnHelper = createColumnHelper();
    const [selectedAccountIds, setSelectedAccountIds] = useState([]);
    const navigate = useNavigate();
    const [globalFilter, setGlobalFilter] = useState("");
    const [isUser, setIsUser] = useState(false);
    const [isVerify, setIsVerify] = useState(false);
    const [hiddenState, setHiddenState] = useState(false);
    const [open, setOpen] = useState(false);
    const {aToken, specialities, refetchSpec,  refetchAdminDetails, adminDetails, readOnly, writeOnly, fullAccess, adminData,
        refectAdminData} = useContext(AdminContext);
    const {t} = useTranslation();

    const columns = [
        columnHelper.accessor("_id", {id: "_id", cell: (info) => <span>{info.row.index + 1}</span>, header: "S.No"}),
        columnHelper.accessor("profile_image", {
            cell: (info) => <img className="rounded-full w-10 h-10 object-cover"
                                 src={info?.getValue() || assets.user_icon} alt="..."/>,
            header: t("account.accountList.profile")
        }),
        columnHelper.accessor("username", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: t("account.accountList.username")
        }),
        columnHelper.accessor("email", {cell: (info) => <span>{info?.getValue()}</span>, header: "Email"}),

        columnHelper.accessor("phone", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: t("account.accountList.phone")
        })
    ];
    const [data, setData] = useState([]);
    const table = useReactTable({
        data: data || [],
        columns,
        state: {globalFilter},
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {pagination: {pageSize: 7}}

    });

    const toggleAccountSelection = (id) => {
        setSelectedAccountIds((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((accountId) => accountId !== id) : [...prevSelected, id]
        );
    };

    const getAccountList = async () => {
        try {
            const result = await accountService.findAll(isUser, isVerify, hiddenState, aToken);
            console.log(result)
            setData(result);
        } catch (e) {
            console.log(e.error);
        }
    };

    // const handleFilterChange = (event) => {
    //     const selectedValue = event.target.value;
    //     setFilterValue(selectedValue);
    //
    //     if (selectedValue) {
    //         const filtered = specialities.filter((spec) =>
    //             spec.name.toLowerCase().includes(selectedValue.toLowerCase())
    //         );
    //         setFilterValue(filtered);
    //     } else {
    //         setFilterValue(specialities);
    //     }
    // };

    const openDeleteModal = async () => {
        if (selectedAccountIds?.length === 0) {
            await Swal.fire({
                icon: "error",
                title: "Oops...",
                text: t("account.accountList.deleteNoti"),
            });
        } else {
            setOpen(true);
        }
    };

    const softDeleteAccounts = async () => {
        if (selectedAccountIds?.length === 0) {
            await Swal.fire({
                icon: "error",
                title: "Oops...",
                text: t("account.accountList.deleteNoti"),
            });
            return;
        }
        try {
            await accountService.deleteSoftAccount(selectedAccountIds, aToken);
            getAccountList();
            setSelectedAccountIds([]);
            setOpen(false);
            await Swal.fire({
                position: "top-end",
                title: t("account.accountList.successDelete"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error(error.message);
        }
    };

    const hoverSettings = (readOnly && !fullAccess && !writeOnly)
        ? {}
        : {
            whileHover: {
                scale: 1.1,
                boxShadow: "0px 8px 20px rgba(0, 166, 169, 0.4)",
            },
            whileTap: {scale: 0.95},
            transition: {type: "spring", stiffness: 300},
        };

    useEffect(() => {
        if (aToken) {
            refectAdminData()
            getAccountList()
            refetchAdminDetails()
            refetchSpec()
        }
    }, [aToken, hiddenState, adminDetails, adminData]);

    return (
        <motion.div className="m-5 max-h-[90vh] w-[90vw] overflow-y-scroll" initial={{opacity: 0}}
                    animate={{opacity: 1}} exit={{opacity: 0}}>
            <div className="flex justify-between items-center">
                <h1 className="text-lg text-primary lg:text-2xl font-bold">
                    {t("account.unverified.title")}
                </h1>
                <div className="flex gap-4 mr-4">

                    {
                        (readOnly && !writeOnly && !fullAccess) &&
                        <Tooltip title={t("common.access.permission")} arrow>

                            <motion.button
                                onClick={() => navigate(`/add-doc-account`)}
                                className="bg-primary text-white flex items-center cursor-not-allowed gap-2 px-8 py-3 mt-4 rounded-full shadow-md"
                                {...hoverSettings}
                                disabled={readOnly && !fullAccess && !writeOnly}

                            >
                                <IoPersonAddOutline/>
                                {t("account.unverified.add")}
                            </motion.button>
                        </Tooltip>
                    }

                    {
                        (fullAccess || writeOnly) &&
                        <motion.button
                            onClick={() => navigate(`/add-doc-account`)}
                            className="bg-primary text-white flex items-center gap-2 px-8 py-3 mt-4 rounded-full shadow-md"
                            whileHover={{
                                scale: 1.1,
                                boxShadow: "0px 8px 20px rgba(0, 166, 169, 0.4)",
                            }}
                            whileTap={{scale: 0.95}}
                            transition={{type: "spring", stiffness: 300}}
                        >
                            <IoPersonAddOutline/>
                            {t("account.unverified.add")}
                        </motion.button>
                    }

                    {
                        (readOnly && !writeOnly && !fullAccess) &&
                        <Tooltip title={t("common.access.permission")} arrow>

                            <motion.button
                                onClick={openDeleteModal}
                                className="bg-red-600 text-white flex items-center cursor-not-allowed gap-2 px-8 py-3 mt-4 rounded-full shadow-md"
                                {...hoverSettings}
                                disabled={readOnly && !fullAccess && !writeOnly}
                            >
                                <FaRegTrashAlt/>
                                {t("account.unverified.delete")}
                            </motion.button>
                        </Tooltip>
                    }

                    {
                        (fullAccess || writeOnly) &&
                        <motion.button
                            onClick={openDeleteModal}
                            className="bg-red-600 text-white flex items-center gap-2 px-8 py-3 mt-4 rounded-full shadow-md"
                            whileHover={{
                                scale: 1.1,
                                boxShadow: "0px 8px 20px rgba(255, 82, 82, 0.6)",
                            }}
                            whileTap={{scale: 0.95}}
                            transition={{type: "spring", stiffness: 300}}
                        >
                            <FaRegTrashAlt/>
                            {t("account.unverified.delete")}
                        </motion.button>
                    }


                    <motion.button
                        onClick={() => navigate('/restore-account', {state: {isVerify: false}})}
                        className="bg-gray-500 text-white flex items-center gap-2 px-8 py-3 mt-4 rounded-full shadow-md"
                        whileHover={{
                            scale: 1.1,
                            boxShadow: "0px 8px 20px rgba(128, 128, 128, 0.5)",
                        }}
                        whileTap={{scale: 0.95}}
                        transition={{type: "spring", stiffness: 300}}
                    >
                        <FaRegTrashAlt/>
                        {t("account.unverified.restore")}
                    </motion.button>
                </div>
            </div>


            <motion.div className="flex mt-5 gap-5">
                <input
                    type="text"
                    placeholder={t("account.accountList.search")}
                    value={globalFilter || ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-[20vw] p-3 border border-gray-300 rounded mb-4"
                />

            </motion.div>


            <AnimatePresence>
                {open && (
                    <Modal open={open} onClose={() => setOpen(false)}>
                        <motion.div className="text-center w-72" initial={{scale: 0.8, opacity: 0}}
                                    animate={{scale: 1, opacity: 1}} exit={{scale: 0.8, opacity: 0}}>
                            <FaRegTrashAlt size={56} className="mx-auto text-red-500"/>
                            <div className="mx-auto my-4 w-60">
                                <h3 className="text-lg font-black text-gray-800">{t("account.accountList.confirmDelete")}</h3>
                                <p className="text-sm text-gray-600">{t("account.accountList.pCD")}</p>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button onClick={softDeleteAccounts}
                                        className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 py-2 rounded-md transition duration-150">
                                    {t("account.accountList.confirm")}
                                </button>
                                <button onClick={() => setOpen(false)}
                                        className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150">
                                    {t("account.accountList.cancel")}
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
                                           onChange={() => toggleAccountSelection(row.original._id)}/>
                                </td>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="p-2"
                                        onClick={() => navigate(`/update-doc-account/${row.original._id}`, {state:{un: true}})}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </motion.tr>
                        ))
                    ) : (
                        <motion.tr className="text-center h-32 text-blue-400" initial={{opacity: 0}}
                                   animate={{opacity: 1}}>
                            <td colSpan={12}>{t("account.unverified.nodata")}</td>
                        </motion.tr>
                    )}
                </AnimatePresence>
                </tbody>
            </motion.table>

            {
                data.length > 0 && <div className="flex items-center justify-end gap-2 mt-4">
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
        </motion.div>
    );
};

export default DoctorAccountList;
