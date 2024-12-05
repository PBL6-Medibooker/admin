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
import {FaRegTrashAlt} from "react-icons/fa";
import Modal from "../../components/Modal/Modal";
import {FaTrashRestoreAlt} from "react-icons/fa";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";
import {useLocation} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import Loader from "../../components/Loader";
import SearchInput from "../../components/SearchInput";
import { motion } from "framer-motion";



const RestoreAccount = () => {
    const columnHelper = createColumnHelper();

    const [selectedAccountIds, setSelectedAccountIds] = useState([]);

    const [globalFilter, setGlobalFilter] = useState("");

    const [open, setOpen] = useState(false);
    const {t} = useTranslation();
    const location = useLocation();
    const {isVerify} = location.state || ""

    const {aToken} = useContext(AdminContext);

    const columns = [

        columnHelper.accessor("_id", {
            id: "_id",
            cell: (info) => <span>{info.row.index + 1}</span>,
            header: "S.No",
        }),
        columnHelper.accessor("profile_image", {
            cell: (info) => (
                <img className="rounded-full w-10 h-10 object-cover"
                     src={info?.getValue() ? info.getValue() : assets.user_icon}
                     alt="..."
                />
            ),
            header: t("account.accountList.profile"),
        }),
        columnHelper.accessor("role", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: t("account.accountList.role"),
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
    // const [data, setData] = useState([]);
    const {data = [], isLoading, isError, refetch} = useQuery({
        queryKey: ["accounts", isVerify],
        queryFn: async () => {
            try {
                let result;
                if (isVerify) {
                    result = await accountService.findAllDeletedAccount(false, true, true, aToken);
                } else {
                    result = await accountService.findAllDeletedAccount(false, true, false, aToken);
                }
                console.log("Response:", result);
                return result;
            } catch (e) {
                console.error(e);
                throw new Error("Failed to load accounts");
            }
        }

    });


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

    //
    // const getDeletedAccountList = async () => {
    //     try {
    //         const result = await accountService.findAllDeletedAccount(false, true, true, aToken);
    //         console.log(result)
    //         setData(result);
    //     } catch (e) {
    //         console.log(e.error)
    //     }
    // }
    //
    // const getDeletedUnverifiedAccountList = async () => {
    //     try {
    //         const result = await accountService.findAllDeletedAccount(false, true, false, aToken);
    //         console.log(result)
    //         setData(result);
    //     } catch (e) {
    //         console.log(e.error)
    //     }
    // }


    const restoreDocAccount = async () => {
        if (selectedAccountIds?.length === 0) {
            await Swal.fire({
                icon: "error",
                title: "Oops...",
                text: t("account.accountList.restoreNoti"),
            });
            return;
        }

        try {
            await accountService.restoreAccount(selectedAccountIds, aToken);

            // getDeletedAccountList();
            refetch();
            setSelectedAccountIds([]);
            setOpen(false);

            await Swal.fire({
                position: "top-end",
                title: t("account.dvd.restore"),
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
                icon: "error",
                title: "Oops...",
                text: t("account.accountList.deleteNoti"),
                backdrop: false
            });
            setOpen(false);
            return;
        }
        try {
            const response = await accountService.permanentDeleteAccount(selectedAccountIds, aToken)
            if (response.message !== '') {
                // getDeletedAccountList();
                refetch();
                toast.success(response.message);
                setSelectedAccountIds([]);
                setOpen(false);
            } else {
                toast.error('Error')
            }
        } catch (error) {
            console.error(error.message);
            toast.error(error.message);
        }
    };

    // useEffect(() => {
    //     if (aToken) {
    //         getDeletedAccountList();
    //     }
    // }, [aToken, hiddenState]);

    useEffect(() => {
        if(aToken){
            refetch()
        }
    }, [aToken]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-screen bg-opacity-75 fixed top-0 left-0 z-50">
                <Loader/>
            </div>
        );
    }

    return (
        <div className='mb-5 mt-5 mr-5 pl-5 max-h-[90h] w-[90vw] overflow-y-scroll'>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg lg:text-2xl text-primary font-medium'>{isVerify ? t("account.dvd.title") : t("account.dvd.utitle")}</h1>
                <div className='flex gap-1'>
                    <button
                        onClick={restoreDocAccount}
                        className='flex items-center gap-1 bg-green-600 px-10 py-3 mt-4 text-white rounded-full'>
                        <FaTrashRestoreAlt/> {t("account.dvd.putBack")}
                    </button>

                    <button
                        className='flex items-center gap-1 px-10 py-3 mt-4 rounded-full text-white bg-red-600 shadow-red-400/40'
                        onClick={() => setOpen(true)}>
                        <FaRegTrashAlt/> {t("account.dvd.dp")}
                    </button>


                </div>

                <Modal open={open} onClose={() => setOpen(false)}>
                    <motion.div
                        className="text-center w-72"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >
                            <FaRegTrashAlt size={56} className="mx-auto text-red-500" />
                        </motion.div>
                        <motion.div
                            className="mx-auto my-4 w-60"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                        >
                            <h3 className="text-lg font-bold text-gray-800">
                                {t("account.accountList.confirmDelete")}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {t("account.restore.pCD")} <strong className="text-red-500">
                                {t("account.restore.p")}
                            </strong>?
                            </p>
                        </motion.div>
                        <motion.div
                            className="flex gap-4 mt-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                        >
                            <motion.button
                                className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 shadow-md shadow-red-400/40 hover:from-red-600 hover:to-red-800 py-2 rounded-md transition duration-150"
                                onClick={permanentDeleteAccounts}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {t("account.restore.deleteP")}
                            </motion.button>
                            <motion.button
                                className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150"
                                onClick={() => setOpen(false)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {t("account.accountList.cancel")}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </Modal>


                {/*<Modal open={open} onClose={() => setOpen(false)}>*/}
                {/*    <div className="text-center w-72">*/}
                {/*        <FaRegTrashAlt size={56} className="mx-auto text-red-500"/>*/}
                {/*        <div className="mx-auto my-4 w-60">*/}
                {/*            <h3 className="text-lg font-bold text-gray-800">{t("account.accountList.confirmDelete")}</h3>*/}
                {/*            <p className="text-sm text-gray-600">*/}
                {/*                {t("account.restore.pCD")} <strong*/}
                {/*                className='text-red-500'>{t("account.restore.p")}</strong>?*/}
                {/*            </p>*/}
                {/*        </div>*/}
                {/*        <div className="flex gap-4 mt-6">*/}
                {/*            <button*/}
                {/*                className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 shadow-md shadow-red-400/40 hover:from-red-600 hover:to-red-800 py-2 rounded-md transition duration-150"*/}
                {/*                onClick={permanentDeleteAccounts}*/}
                {/*            >*/}
                {/*                {t("account.restore.deleteP")}*/}
                {/*            </button>*/}
                {/*            <button*/}
                {/*                className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150"*/}
                {/*                onClick={() => setOpen(false)}*/}
                {/*            >*/}
                {/*                {t("account.accountList.cancel")}*/}
                {/*            </button>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</Modal>*/}
            </div>
            <div>
                <SearchInput globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} t={(t("account.accountList.search"))}/>
            </div>
            <table className="border border-gray-700 w-full mt-5 text-left text-white border-collapse ">
                <thead className="bg-gray-600">
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
                            <th key={header.id} className="capitalize p-2">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table?.getRowModel()?.rows?.length ? (
                    table.getRowModel().rows.map((row, i) => (
                        <tr
                            key={row.id}
                            className={i % 2 === 0 ? 'bg-cyan-600' : 'bg-cyan-900'}
                        >
                            <td className="p-2">
                                <input
                                    type="checkbox"
                                    checked={selectedAccountIds.includes(row.original._id)}
                                    onChange={() => toggleAccountSelection(row.original._id)}
                                />
                            </td>

                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="p-2">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr className="text-center h-32 text-blue-400">
                        <td colSpan={12}>{t("account.dvd.nodata")}</td>
                    </tr>
                )}
                </tbody>
            </table>


        </div>

    );
};

export default RestoreAccount;
