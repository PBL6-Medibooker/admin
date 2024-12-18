import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useNavigate} from "react-router-dom";
import * as accountService from "../../service/AccountService"
import {AdminContext} from "../../context/AdminContext";
import { motion } from 'framer-motion';
import {
    createColumnHelper, flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {assets} from "../../assets/assets";
import {toast} from "react-toastify";
import Modal from "../../components/Modal/Modal";
import {FaRegTrashAlt, FaTrashRestoreAlt} from "react-icons/fa";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";
import CustomButton from "../../components/button/CustomButton";
import {Trash, CircleUser} from "lucide-react";
import {LuMapPinOff} from "react-icons/lu";


const AccountList = () => {
    const columnHelper = createColumnHelper();
    const navigate = useNavigate();
    const [globalFilter, setGlobalFilter] = useState("");
    const [isUser, setIsUser] = useState(true);
    const [isVerify, setIsVerify] = useState(false);
    const [hiddenState, setHiddenState] = useState(false);
    const [selectedAccountIds, setSelectedAccountIds] = useState([]);
    const [open, setOpen] = useState(false);
    const {t} = useTranslation();
    const {aToken, adminList, refetchAdminList} = useContext(AdminContext);

    const columns = [
        columnHelper.accessor("_id", {
            id: "_id",
            cell: (info) => <span>{info.row.index + 1}</span>,
            header: "S.No",
        }),
        columnHelper.accessor("profile_image", {
            cell: (info) => (
                <img className="rounded-full w-10 h-10 object-cover bg-white"
                     src={info?.getValue() ? info.getValue() : assets.user_icon}
                     alt="..."
                />
            ),
            header: t("account.accountList.profile"),
        }),
        columnHelper.accessor("username", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: t("account.accountList.username"),
        }),
        columnHelper.accessor("phone", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: t("account.accountList.phone"),
        }),
        // columnHelper.accessor("role", {
        //     cell: (info) => <span>{info?.getValue()}</span>,
        //     header: t("account.accountList.role"),
        // }),
        columnHelper.accessor("email", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: "Email",
        }),
    ];
    const [data, setData] = useState([]);

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
        },
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });


    const rows = useMemo(() => {
        return table.getRowModel().rows.filter(row => !adminList.some(admin => admin.user_id?._id === row.original._id));
    }, [table.getRowModel().rows, adminList]);


    const getAccountList = async () => {

        try {
            const result = await accountService.findAll(isUser, isVerify, hiddenState, aToken);
            const filter = result.filter(acc => !adminList.some(admin => admin.user_id?._id === acc._id))
            setData(filter);
        } catch (e) {
            console.log(e.error)
        }

    }

    const toggleAccountSelection = (id) => {
        setSelectedAccountIds((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((accountId) => accountId !== id)
                : [...prevSelected, id]
        );
    };



    const softDeleteAccounts = async () => {
        if (selectedAccountIds?.length === 0) {
            // toast.warn('No account selected for deletion')
           await Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: t("account.accountList.deleteNoti"),
            });
            return;
        }
        try {
            await accountService.deleteSoftAccount(selectedAccountIds, aToken)
            getAccountList();
            // toast.success(response.message);
            setOpen(false);
            setSelectedAccountIds([]);
            await Swal.fire({
                position: "top-end",
                title: t("account.accountList.successDelete"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false
            });
        } catch (error) {
            console.error(error.message);
        }
    };

    const openDeleteModal = () => {
        if (selectedAccountIds?.length === 0) {
            // toast.warn('No account selected for deletion')
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: t("account.accountList.deleteNoti"),
            });
        } else {
            setOpen(true)
        }
    }

    useEffect(() => {
        if (aToken) {
            refetchAdminList()
            getAccountList()
        }
    }, [aToken]);
    return (
        <motion.div
            className="mb-5 ml-5 mr-5 max-h-[90vh] w-[90vw] overflow-y-scroll"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5}}
        >
            <div className="flex justify-between items-center mb-6 mt-3 mr-2">
                <h1 className="text-lg text-primary lg:text-2xl">{t("account.accountList.userAccounts")}</h1>
                <div className="flex gap-4">


                    <CustomButton
                        onClick={() => navigate(`/add-customer-account`)}
                        label= {t("account.accountList.addnewAccount")}
                        icon={CircleUser}
                        bgColor="bg-[rgba(0,_166,_169,_1)]"
                        hoverColor="rgba(0, 166, 169, 1)"
                        shadowColor="rgba(0, 166, 169, 1)"
                    />

                    {/*<motion.button*/}
                    {/*    onClick={openDeleteModal}*/}
                    {/*    whileHover={{scale: 1.05}}*/}
                    {/*    className="flex items-center gap-2 px-6 py-2 text-white bg-red-600 rounded-full shadow-lg shadow-red-500/40"*/}
                    {/*>*/}
                    {/*    <FaRegTrashAlt/> {t("account.accountList.delete")}*/}
                    {/*</motion.button>*/}

                    <CustomButton
                        onClick={openDeleteModal}
                        label={t("account.accountList.delete")}
                        icon={FaRegTrashAlt}
                        bgColor="bg-red-600"
                        hoverColor="rgba(0, 128, 255, 0.4)"
                        shadowColor="rgba(255, 0, 0, 0.4)"
                    />

                    <CustomButton
                        onClick={() => navigate('/restore-cus-account')}
                        label={''}
                        icon={Trash}
                        bgColor="bg-gray-600"
                        hoverColor="rgba(0, 128, 255, 0.4)"
                        shadowColor="rgba(0, 128, 255, 0.4)"
                    />
                </div>


                <Modal open={open} onClose={() => setOpen(false)}>
                    <motion.div
                        className="text-center w-80 p-4 bg-white rounded-lg"
                        initial={{scale: 0.9, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        transition={{duration: 0.3}}
                    >
                        <FaRegTrashAlt size={50} className="mx-auto text-red-500 mb-4"/>
                        <h3 className="text-lg font-semibold">{t("account.accountList.confirmDelete")}</h3>
                        <p className="text-gray-600">{t("account.accountList.pCD")}</p>
                        <div className="flex justify-around mt-6">
                            <motion.button
                                onClick={softDeleteAccounts}
                                whileHover={{scale: 1.05}}
                                className="text-white bg-red-600 px-6 py-2 rounded-md"
                            >
                                {t("account.accountList.confirm")}
                            </motion.button>
                            <motion.button
                                onClick={() => setOpen(false)}
                                whileHover={{scale: 1.05}}
                                className="bg-gray-200 px-6 py-2 rounded-md"
                            >
                                {t("account.accountList.cancel")}
                            </motion.button>
                        </div>
                    </motion.div>
                </Modal>

            </div>
            <div className="mt-5">
                <input
                    type="text"
                    placeholder={t("account.accountList.search")}
                    value={globalFilter || ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-[20vw] p-3 border border-gray-300 rounded mb-4"
                />
            </div>

            <motion.table
                className="w-full text-left text-white border border-gray-600 rounded-lg shadow-lg"
                initial={{y: 20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{delay: 0.3}}
            >
                <thead className="bg-gray-700">
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        <th className="p-2">
                            <input
                                type="checkbox"
                                checked={
                                    table.getRowModel().rows.length > 0 &&
                                    table.getRowModel().rows.every((row) =>
                                        selectedAccountIds.includes(row.original._id)
                                    )
                                }
                                onChange={(e) =>
                                    setSelectedAccountIds(
                                        e.target.checked
                                            ? table.getRowModel().rows.map((row) => row.original._id)
                                            : []
                                    )
                                }
                            />
                        </th>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id} className="p-2 capitalize">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {
                    // table?.getRowModel()?.rows?.length ? (
                    // table.getRowModel().rows
                    //     .filter((row) => row.original.role !== 'admin')
                    rows.length > 0 ? (
                        rows.map((row, i) => (
                            <motion.tr
                                key={row.id}
                                className={`${
                                    i % 2 === 0 ? 'bg-cyan-600' : 'bg-cyan-900'
                                }`}
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{delay: i * 0.05}}
                            >
                                <td className="p-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedAccountIds.includes(row.original._id)}
                                        onChange={() => toggleAccountSelection(row.original._id)}
                                    />
                                </td>
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="p-2 cursor-pointer"
                                        onClick={() => navigate(`/update-cus-account/${row.original.email}`)}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </motion.tr>
                        ))
                ) : (
                    <tr className="text-center h-32 text-blue-400">
                        <td colSpan={12}>{t("account.accountList.nodata")}</td>
                    </tr>
                )}
                </tbody>
            </motion.table>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-2 mt-4">
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
        </motion.div>
    );
};

export default AccountList;
