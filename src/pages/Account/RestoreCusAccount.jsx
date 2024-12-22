import React, {useContext, useEffect, useState} from 'react';
import {
    createColumnHelper, flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {AdminContext} from "../../context/AdminContext";
import {assets} from "../../assets/assets";
import * as accountService from "../../service/AccountService";
import {toast} from "react-toastify";
import {FaRegTrashAlt, FaTrashRestoreAlt} from "react-icons/fa";
import Modal from "../../components/Modal/Modal";
import {useTranslation} from "react-i18next";
import {motion} from "framer-motion";
import Swal from "sweetalert2";
import CustomButton from "../../components/button/CustomButton";
import {Tooltip} from "@mui/material";
import {CircleUser} from "lucide-react";

const RestoreCusAccount = () => {
    const columnHelper = createColumnHelper();
    const [selectedAccountIds, setSelectedAccountIds] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [isUser, setIsUser] = useState(true);
    const [isVerify, setIsVerify] = useState(false);
    const [hiddenState, setHiddenState] = useState(true);
    const [open, setOpen] = useState(false);
    const {t} = useTranslation();
    const {aToken,
        adminData,
        refectAdminData,
        refetchAdminDetails,
        adminDetails,
        readOnly,
        writeOnly,
        fullAccess} = useContext(AdminContext);

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
        columnHelper.accessor("email", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: "Email",
        }),
        columnHelper.accessor("username", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: t("account.accountList.username"),
        }),
        columnHelper.accessor("phone", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: t("account.accountList.phone"),
        })


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

    const toggleAccountSelection = (id) => {
        setSelectedAccountIds((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((accountId) => accountId !== id)
                : [...prevSelected, id]
        );
    };


    const getDeletedAccountList = async () => {
        try {
            const result = await accountService.findAllDeletedAccount(isUser, hiddenState, isVerify, aToken);
            setData(result);
        } catch (e) {
            console.log(e.error)
        }

    }

    const restoreCusAccount = async () => {
        if (selectedAccountIds?.length === 0) {
            // toast.warn('No account selected for restoration')
            await Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: t("account.restore.rNoti"),
            });
            return;
        }
        try {
            await accountService.restoreAccount(selectedAccountIds, aToken);
            getDeletedAccountList();
            // toast.success(response.message,{
            //     autoClose: 1000
            // });
            setSelectedAccountIds([]);
            setOpen(false);

            await Swal.fire({
                position: "top-end",
                title: t("account.accountList.successRestore"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false
            });

        } catch (e) {
            toast.error(e.message);
        }
    }

    const permanentDeleteAccounts = async () => {
        if (selectedAccountIds?.length === 0) {
            await Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: t("account.accountList.deleteNoti"),
            });
            setOpen(false)

            return;
        }
        try {
            const response = await accountService.permanentDeleteAccount(selectedAccountIds, aToken)
            if (response.message !== '') {
                getDeletedAccountList();
                setSelectedAccountIds([]);
                setOpen(false);
                await Swal.fire({
                    position: "top-end",
                    title: t("account.accountList.successDelete"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop: false
                });
            } else {
                toast.error('Error')
            }
        } catch (error) {
            console.error(error.message);
            toast.error(error.message);
        }
    };


    useEffect(() => {
        if (aToken) {
            getDeletedAccountList();
        }
    }, [aToken, hiddenState]);

    return (
        <div className='m-5 max-h-[90h] w-[90vw] overflow-y-scroll'>

            <div className='flex justify-between items-center'>
                <h1 className='text-lg lg:text-2xl text-primary font-medium'>{t("account.restore.title")}</h1>
                <div className='flex gap-4 mr-4'>

                    {
                        (readOnly && !writeOnly && !fullAccess) &&
                        <Tooltip title={t("common.access.permission")} arrow>
                           <span>
                                        <CustomButton
                                            onClick={restoreCusAccount}
                                            label={t("account.restore.putBack")}
                                            icon={FaTrashRestoreAlt}
                                            bgColor="bg-green-600"
                                            hoverColor="rgba(22, 163, 74, 0.4)"
                                            shadowColor="rgba(22, 163, 74, 0.4)"
                                            disabled={readOnly && !fullAccess && !writeOnly}
                                            cursor={true}
                                        />
                           </span>
                        </Tooltip>
                    }

                    {
                        (fullAccess || writeOnly) &&
                        <CustomButton
                            onClick={restoreCusAccount}
                            label={t("account.restore.putBack")}
                            icon={FaTrashRestoreAlt}
                            bgColor="bg-green-600"
                            hoverColor="rgba(22, 163, 74, 0.4)"
                            shadowColor="rgba(22, 163, 74, 0.4)"
                        />
                    }

                    {
                        (readOnly && !writeOnly && !fullAccess) &&
                        <Tooltip title={t("common.access.permission")} arrow>
                           <span>
                                <CustomButton
                                    onClick={() => setOpen(true)}
                                    label={t("account.restore.deleteP")}
                                    icon={FaRegTrashAlt}
                                    bgColor="bg-red-600"
                                    hoverColor="rgba(0, 128, 255, 0.4)"
                                    shadowColor="rgba(255, 0, 0, 0.4)"
                                    disabled={readOnly && !fullAccess && !writeOnly}
                                    cursor={true}
                                />

                           </span>
                        </Tooltip>
                    }

                    {
                        (fullAccess || writeOnly) &&
                        <CustomButton
                            onClick={() => setOpen(true)}
                            label={t("account.restore.deleteP")}
                            icon={FaRegTrashAlt}
                            bgColor="bg-red-600"
                            hoverColor="rgba(0, 128, 255, 0.4)"
                            shadowColor="rgba(255, 0, 0, 0.4)"
                        />
                    }

                </div>

                <Modal open={open} onClose={() => setOpen(false)}>
                    <div className="text-center w-72">
                        <FaRegTrashAlt size={56} className="mx-auto text-red-500"/>
                        <div className="mx-auto my-4 w-60">
                            <h3 className="text-lg font-bold text-gray-800">{t("account.accountList.confirmDelete")}</h3>
                            <p className="text-sm text-gray-600">
                                {t("account.restore.pCD")} <strong
                                className='text-red-500'>{t("account.restore.p")}</strong>?
                            </p>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 shadow-md shadow-red-400/40 hover:from-red-600 hover:to-red-800 py-2 rounded-md transition duration-150"
                                onClick={permanentDeleteAccounts}
                            >
                                {t("account.restore.deleteP")}
                            </button>
                            <button
                                className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150"
                                onClick={() => setOpen(false)}
                            >
                                {t("account.accountList.cancel")}
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>

            <motion.table
                className="w-full mt-5 text-left text-white border border-gray-600 rounded-lg shadow-lg"
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
                {table?.getRowModel()?.rows?.length ? (
                    table.getRowModel().rows
                        .filter((row) => row.original.role !== 'admin')
                        .map((row, i) => (
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
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </motion.tr>
                        ))
                ) : (
                    <tr className="text-center h-32 text-blue-400">
                        <td colSpan={12}>{t("account.dvd.nodata")}</td>
                    </tr>
                )}
                </tbody>
            </motion.table>

            {/* Pagination */}
            {
                data.length > 0 &&
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
            }

        </div>

    );
};

export default RestoreCusAccount;
