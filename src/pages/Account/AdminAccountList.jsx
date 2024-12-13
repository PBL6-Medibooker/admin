import React, {useContext, useEffect, useState} from 'react';
import {motion} from "framer-motion";
import CustomButton from "../../components/button/CustomButton";
import {FaRegTrashAlt} from "react-icons/fa";
import Modal from "../../components/Modal/Modal";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {assets} from "../../assets/assets";
import {AdminContext} from "../../context/AdminContext";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";
import * as adminService from "../../service/AdminService";

const AdminAccountList = () => {
    const {aToken,  adminList, refetchAdminList} = useContext(AdminContext);
    const columnHelper = createColumnHelper();
    const {t} = useTranslation();
    const [globalFilter, setGlobalFilter] = useState("");
    const [selectedAccountIds, setSelectedAccountIds] = useState([]);
    const [open, setOpen] = useState(false);

    const columns = [
        columnHelper.accessor("_id", {
            id: "_id",
            cell: (info) => <span>{info.row.index + 1}</span>,
            header: "S.No",
        }),
        columnHelper.accessor("user_id.profile_image", {
            cell: (info) => (
                <img className="rounded-full w-10 h-10 object-cover bg-white"
                     src={info?.getValue() ? info.getValue() : assets.user_icon}
                     alt="..."
                />
            ),
            header: t("account.accountList.profile"),
        }),
        columnHelper.accessor("user_id.username", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: t("account.accountList.username"),
        }),
        columnHelper.accessor("user_id.email", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: "Email",
        }),
        columnHelper.accessor("admin_write_access", {
            cell: (info) => {
                const row = info.row.original;
                if (row.admin_write_access && row.read_access && row.write_access) {
                    return <span
                        style={{
                            backgroundColor: '#FF1493',
                            borderRadius: '9999px',
                            padding: '5px 10px 5px 10px',
                            color: 'white',
                            display: 'inline-block',
                        }}>
                              {t("account.admin.fa")}
                         </span>

                } else if (row.read_access && !row.admin_write_access && !row.write_access) {
                    return <span>{t("account.admin.ro")}</span>;
                } else {
                    return <span>{t("account.admin.wo")}</span>;
                }
            },
            header: t("account.admin.access"),
        }),
    ];


    const table = useReactTable({
        data: adminList || [],
        columns,
        state: {
            globalFilter,
        },
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });


    const openDeleteModal = () => {
        if (selectedAccountIds?.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: t("account.accountList.deleteNoti"),
            });
        } else {
            setOpen(true)
        }
    }
    const toggleAccountSelection = (id) => {
        setSelectedAccountIds((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((accountId) => accountId !== id)
                : [...prevSelected, id]
        );
    }


    const softDeleteAccounts = async () => {
        if (selectedAccountIds?.length === 0) {
            await Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: t("account.accountList.deleteNoti"),
            });
            return;
        }
        try {
            await adminService.removeAdminAccessAccount(selectedAccountIds, aToken)
            refetchAdminList();
            setOpen(false);
            setSelectedAccountIds([]);
            await Swal.fire({
                position: "top-end",
                title: t("account.admin.rsuccess"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false
            });
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        if (aToken) {
            refetchAdminList();
            console.log(adminList)
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
                <h1 className="text-lg text-primary lg:text-2xl">{t("account.admin.title")}</h1>
                <div className="flex gap-4 mr-2">


                    <CustomButton
                        onClick={openDeleteModal}
                        label={t("account.admin.delete")}
                        icon={FaRegTrashAlt}
                        bgColor="bg-red-600"
                        hoverColor="rgba(0, 128, 255, 0.4)"
                        shadowColor="rgba(255, 0, 0, 0.4)"
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

export default AdminAccountList;
