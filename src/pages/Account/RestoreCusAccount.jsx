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
import {toast} from "react-toastify";
import {FaRegTrashAlt, FaTrashRestoreAlt} from "react-icons/fa";
import Modal from "../../components/Modal";

const RestoreCusAccount = () => {
    const columnHelper = createColumnHelper();

    const [selectedAccountIds, setSelectedAccountIds] = useState([]);

    const navigate = useNavigate();
    const [globalFilter, setGlobalFilter] = useState("");

    const [isUser, setIsUser] = useState(true);
    const [isVerify, setIsVerify] = useState(false);
    const [hiddenState, setHiddenState] = useState(true);

    const [open, setOpen] = useState(false);

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
                     src={info?.getValue() ? `data:image/png;base64,${info.getValue()}` : assets.user_icon}
                     alt="..."
                />
            ),
            header: "Profile",
        }),
        columnHelper.accessor("role", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: "Role",
        }),
        columnHelper.accessor("email", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: "Email",
        }),
        columnHelper.accessor("username", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: "UserName",
        }),
        columnHelper.accessor("phone", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: "Phone",
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
            toast.warn('No account selected for restoration')
            return;
        }

        try {
            const response = await accountService.restoreAccount(selectedAccountIds, aToken);

            getDeletedAccountList();
            toast.success(response.message,{
                autoClose: 1000
            });
            setSelectedAccountIds([]);
            setOpen(false);

        } catch (e) {
            toast.error(e.message);
        }
    }

    const permanentDeleteAccounts = async () => {
        if (selectedAccountIds?.length === 0) {
            toast.warn('No account selected for deletion')
            return;
        }
        try {
            const response = await accountService.permanentDeleteAccount(selectedAccountIds, aToken)
            if (response.message !== '') {
                toast.success(response.message, {
                    autoClose: 1000
                });
                getDeletedAccountList();
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


    useEffect(() => {
        if (aToken) {
            getDeletedAccountList();
        }
    }, [aToken, hiddenState]);

    return (
        <div className='m-5 max-h-[90h] w-[90vw] overflow-y-scroll'>

            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-medium'>All Deleted Customer Accounts</h1>
                <div className='flex gap-1'>
                    <button
                        onClick={restoreCusAccount}
                        className='flex items-center gap-1 bg-emerald-400 px-10 py-3 mt-4 text-white rounded-full'>
                        <FaTrashRestoreAlt/> Put Back
                    </button>

                    <button
                        className='flex items-center gap-1 px-10 py-3 mt-4 rounded-full text-white bg-red-600 shadow-red-400/40'
                        onClick={() => setOpen(true)}>
                        <FaRegTrashAlt/> Delete Permanently
                    </button>


                </div>

                <Modal open={open} onClose={() => setOpen(false)}>
                    <div className="text-center w-72">
                        <FaRegTrashAlt size={56} className="mx-auto text-red-500"/>
                        <div className="mx-auto my-4 w-60">
                            <h3 className="text-lg font-bold text-gray-800">Confirm Delete</h3>
                            <p className="text-sm text-gray-600">
                                Are you sure you want to delete these accounts <strong
                                className='text-red-500'>permanently</strong>?
                            </p>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 shadow-md shadow-red-400/40 hover:from-red-600 hover:to-red-800 py-2 rounded-md transition duration-150"
                                onClick={permanentDeleteAccounts}
                            >
                                Delete Permanently
                            </button>
                            <button
                                className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>
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
                        <td colSpan={12}>No Record Found!</td>
                    </tr>
                )}
                </tbody>
            </table>


        </div>

    );
};

export default RestoreCusAccount;
