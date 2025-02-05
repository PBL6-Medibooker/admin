import React, {useContext, useEffect, useState} from 'react';
import {
    createColumnHelper, flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {AdminContext} from "../../context/AdminContext";
import {toast} from "react-toastify";
import * as regionService from "../../service/RegionService";
import {FaRegTrashAlt} from "react-icons/fa";
import Modal from "../../components/Modal/Modal";
import { FaTrashRestoreAlt } from "react-icons/fa";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";
import CustomButton from "../../components/button/CustomButton";
import {Tooltip} from "@mui/material";
import {MapPinPlus} from "lucide-react";

const RestoreRegion = () => {
    const columnHelper = createColumnHelper();
    const [globalFilter, setGlobalFilter] = useState("");

    const [hiddenState, setHiddenState] = useState('true');
    const [selectedRegionIds, setSelectedRegionIds] = useState([]);
    const [open, setOpen] = useState(false);
    const {t}= useTranslation();

    const {aToken, refetchAdminDetails, adminDetails, readOnly, writeOnly, fullAccess} = useContext(AdminContext);

    const columns = [
        columnHelper.accessor("_id", {
            id: "_id",
            cell: (info) => <span>{info.row.index + 1}</span>,
            header: "S.No",
        }),
        columnHelper.accessor("name", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: t("region.list.region"),
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
            await Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: t("region.list.deleteNoti"),
            });
            setOpen(false)
            return;
        }
        try {
            await regionService.permanentDeleteAccount(selectedRegionIds, aToken)
            getDeletedRegionList();
            setSelectedRegionIds([]);
            setOpen(false)
            await Swal.fire({
                position: "top-end",
                title: t("region.restore.ds"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false
            });
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
            await Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: t("region.restore.warn"),
            });
            return;
        }

        try {
            const response = await regionService.restoreRegion(selectedRegionIds, aToken);
            if (response.message !== '') {
                await getDeletedRegionList();
                // toast.success(response.message);
                setSelectedRegionIds([]);
                setOpen(false);
                await Swal.fire({
                    position: "top-end",
                    title: t("region.restore.success"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
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
                <h1 className='text-lg text-primary lg:text-2xl font-medium'>{t("region.restore.title")}</h1>
                <div className='flex gap-4 mr-4'>

                    {
                        (readOnly && !writeOnly && !fullAccess) && (
                            <Tooltip title={t("common.access.permission")} arrow>
                               <span>

                                      <CustomButton
                                          onClick={restoreRegion}
                                          label={t("region.restore.put")}
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
                                onClick={restoreRegion}
                                label={t("region.restore.put")}
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
                                         onClick={() => setOpen(true)}
                                         label={t("region.restore.pd")}
                                         icon={FaRegTrashAlt}
                                         bgColor="bg-red-600"
                                         hoverColor="rgba(255, 0, 0, 0.4)"
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
                                onClick={() => setOpen(true)}
                                label={t("region.restore.pd")}
                                icon={FaRegTrashAlt}
                                bgColor="bg-red-600"
                                hoverColor="rgba(255, 0, 0, 0.4)"
                                shadowColor="rgba(255, 0, 0, 0.4)"
                            />
                        )
                    }



                </div>
                <Modal open={open} onClose={() => setOpen(false)}>
                    <div className="text-center w-72">
                        <FaRegTrashAlt size={56} className="mx-auto text-red-500"/>
                        <div className="mx-auto my-4 w-60">
                            <h3 className="text-lg font-black text-gray-800"></h3>
                            <p className="text-sm text-gray-600">
                                {t("region.restore.p")} <strong
                                className='text-red-500'>{t("region.restore.dp")}</strong> ?
                            </p>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 shadow-md shadow-red-400/40 hover:from-red-600 hover:to-red-800 py-2 rounded-md transition duration-150"
                                onClick={permanentDeleteRegions}>{t("region.restore.delete")}
                            </button>
                            <button
                                className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150"
                                onClick={() => setOpen(false)}
                            >
                                {t("region.restore.cancel")}
                            </button>
                        </div>
                    </div>
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
                        <td colSpan={12}>{t("region.list.nodata")}</td>
                    </tr>
                )}
                </tbody>
            </table>

            {
                data.length > 0 && <div
                    className={`${table.getState().pagination.pageSize === 10 ? 'fixed bottom-0 left-0 ml-[1020px] w-[500px] right-0 z-10 p-4 ' : ''} flex items-center w-[500px] justify-end gap-2 h-12`}
                >
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
                        <span>{t("account.accountList.page")}</span>
                        <strong>{table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</strong>
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
                            className="w-16 px-2 py-1 border border-gray-300 rounded bg-transparent"
                        />
                    </div>
                </div>
            }

        </div>

    );
};

export default RestoreRegion;
