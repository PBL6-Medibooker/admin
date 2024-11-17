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
import {toast} from "react-toastify";
import * as regionService from "../../service/RegionService";
import {FaRegTrashAlt} from "react-icons/fa";
import Modal from "../../components/Modal";
import { FaTrashRestoreAlt } from "react-icons/fa";
import * as accountService from "../../service/AccountService";

const RestoreRegion = () => {
    const columnHelper = createColumnHelper();
    const navigate = useNavigate();
    const [globalFilter, setGlobalFilter] = useState("");

    const [hiddenState, setHiddenState] = useState('true');
    const [selectedRegionIds, setSelectedRegionIds] = useState([]);
    const [open, setOpen] = useState(false);



    const {aToken} = useContext(AdminContext);

    const columns = [
        columnHelper.accessor("_id", {
            id: "_id",
            cell: (info) => <span>{info.row.index + 1}</span>,
            header: "S.No",
        }),
        columnHelper.accessor("name", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: "Region",
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
        setSelectedRegionIds((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((accountId) => accountId !== id)
                : [...prevSelected, id]
        );
    };


    const permanentDeleteRegions = async () => {
        if (selectedRegionIds?.length === 0 && open) {
            toast.warn('No region selected for deletion')
            return;
        }
        try {
            await regionService.permanentDeleteAccount(selectedRegionIds, aToken)
            getDeletedRegionList();
            toast.success('Delete Successful');
            setSelectedRegionIds([]);
            setOpen(false)
        } catch (error) {
            console.error(error.message);
            toast.error(error.message)
        }
    };



    const getDeletedRegionList = async () => {
        try {
            const result = await regionService.findAllDeletedRegion(hiddenState, aToken);
            setData(result);
        } catch (e) {
            console.log(e.error)
        }
    }


    const restoreRegion = async () => {
        if (selectedRegionIds?.length === 0) {
            toast.warn('No region selected for restoration')
            return;
        }

        try {
            const response = await regionService.restoreRegion(selectedRegionIds, aToken);
            if (response.message !== '') {
                getDeletedRegionList();
                toast.success(response.message);
                setSelectedRegionIds([]);
                setOpen(false);
            } else {
                toast.error('Error')
            }

        } catch (e) {
            toast.error(e.message);
        }
    }

    useEffect(() => {
        if (aToken) {
            getDeletedRegionList();
        }
    }, [aToken, hiddenState]);
    return (

        <div className='m-5 max-h-[90vh] w-[90vw] overflow-y-scroll'>

            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-medium'>All Deleted Region </h1>
                <div className='flex gap-1'>
                    <button
                        onClick={restoreRegion}
                        className='flex items-center gap-1 bg-green-700 px-10 py-3 mt-4 text-white rounded-full cursor-pointer'>
                       <FaTrashRestoreAlt/> Put Back
                    </button>

                    <button onClick={() => setOpen(true)}
                        className='flex items-center gap-2 px-10 py-3 mt-4 rounded-full text-white bg-red-600 shadow-red-400/40 cursor-pointer'
                    >
                        <FaRegTrashAlt/> Delete Permanently
                    </button>



                </div>
                <Modal open={open} onClose={() => setOpen(false)}>
                    <div className="text-center w-72">
                        <FaRegTrashAlt size={56} className="mx-auto text-red-500"/>
                        <div className="mx-auto my-4 w-60">
                            <h3 className="text-lg font-black text-gray-800">Confirm Delete</h3>
                            <p className="text-sm text-gray-600">
                                Are you sure you want to delete <strong className='text-red-500'>permanently</strong> ?
                            </p>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 shadow-md shadow-red-400/40 hover:from-red-600 hover:to-red-800 py-2 rounded-md transition duration-150"
                                onClick={permanentDeleteRegions}>Delete
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
                                        selectedRegionIds.includes(row.original._id)
                                    )
                                }
                                onChange={(e) =>
                                    setSelectedRegionIds(
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
                                    checked={selectedRegionIds.includes(row.original._id)}
                                    onChange={() => toggleAccountSelection(row.original._id)}

                                />
                            </td>

                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="p-2"
                                >
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

            <div
                className={`${table.getState().pagination.pageSize === 10 ?
                    'fixed bottom-0 left-0 right-0 z-10 p-4 ' : ''} flex items-center justify-end gap-2 h-12`}>
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-2 py-1 border border-gray-300 bg-transparent disabled:opacity-30"
                >
                    {"<"}
                </button>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-2 py-1 border border-gray-300 bg-transparent disabled:opacity-30"
                >
                    {">"}
                </button>

                <div className="flex items-center gap-1">
                    <span>Page</span>
                    <strong>{table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</strong>
                </div>

                <div className="flex items-center gap-1">
                    | Go to page:
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }}
                        className="w-16 px-2 py-1 border border-gray-300 rounded bg-transparent"
                    />
                </div>
            </div>



        </div>

    );
};

export default RestoreRegion;
