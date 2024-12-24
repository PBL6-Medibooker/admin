import React, {useContext, useEffect, useState} from 'react';
import {AdminContext} from "../../context/AdminContext";
import {useNavigate} from "react-router-dom";
import * as specialityService from "../../service/SpecialityService";
import {toast} from "react-toastify";
import {FaRegTrashAlt} from "react-icons/fa";
import Modal from "../../components/Modal/Modal";
import axios from "axios";
import {assets} from "../../assets/assets";
import {Tooltip} from "@mui/material";
import {motion} from "framer-motion";
import {ArchiveRestore} from "lucide-react";
import {useTranslation} from "react-i18next";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import Swal from "sweetalert2";

const RestoreSpeciality = () => {
    const {aToken, refetchAdminDetails,
        adminDetails,
        readOnly,
        writeOnly,
        fullAccess} = useContext(AdminContext);
    const [specialities, setSpecialities] = useState([]);

    const [hiddenState, setHiddenState] = useState("true");
    const [open, setOpen] = useState(false);
    const {t} = useTranslation();
    const [selectedSpecialityIds, setSelectedSpecialityIds] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 8,
    });
    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.accessor("_id", {
            id: "_id",
            cell: (info) => <span>{info.row.index + 1}</span>,
            header: "S.No",
        }),
        columnHelper.accessor("name", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: t("speciality.restore.spec"),
        })
    ];


    const table = useReactTable({
        data: specialities || [],
        columns,
        state: {
            pagination,
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
    });

    const paginatedData = specialities?.slice(
        pagination.pageIndex * pagination.pageSize,
        (pagination.pageIndex + 1) * pagination.pageSize
    );

    const findAllDeletedSpecialities = async () => {
        const result = await specialityService.findAllDeleted(hiddenState, aToken)
        console.log(result)
        setSpecialities(result);
    }

    const toggleAccountSelection = (id) => {
        setSelectedSpecialityIds((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((specId) => specId !== id)
                : [...prevSelected, id]
        );
        console.log(selectedSpecialityIds)
    };

    const openDeleteModal = () => {
        if (selectedSpecialityIds?.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: t("speciality.list.message"),
            });
        } else {
            setOpen(true)
        }

    }
    const deletePermanentSpeciality = async () => {
        if (selectedSpecialityIds?.length === 0 && open) {
            await Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: t("speciality.list.message"),
            });
            return;
        }
        try {
            const data = await specialityService.permanentDeleteAccount(selectedSpecialityIds, aToken)
            if (data) {
                await findAllDeletedSpecialities();
                // toast.success(data.message);
                setSelectedSpecialityIds([]);
                setOpen(false)
                await Swal.fire({
                    position: "top-end",
                    title: t("speciality.restore.p"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop: false
                });
            }
        } catch (error) {
            console.error(error.message);
            toast.error(error.message)
        }
    };

    const restoreSpeciality = async () => {
        if (selectedSpecialityIds?.length === 0) {

            await Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: t("speciality.restore.rwarn"),
            });
            return;
        }

        try {
            const response = await specialityService.restoreSpeciality(selectedSpecialityIds, aToken);
            if (response.message !== '') {
                await findAllDeletedSpecialities();
                setSelectedSpecialityIds([]);
                setOpen(false);

                await Swal.fire({
                    position: "top-end",
                    title: t("speciality.restore.rsuccess"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop: false
                });
            } else {
                toast.error('Error')
            }

        } catch (e) {
            toast.error(e.message);
        }
    }

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
       if(aToken){
           findAllDeletedSpecialities()
       }
    }, [aToken, hiddenState]);

    return (
        <div className='m-5 max-h-[90h] w-[90vw] overflow-y-scroll'>


            <div className='flex justify-between items-center'>
                <h1 className='text-lg text-primary lg:text-2xl font-bold'>{t("speciality.restore.title")}</h1>
                <div className="flex gap-5 mr-6">

                    {
                        (readOnly && !writeOnly && !fullAccess) && (
                            <Tooltip title={t("common.access.permission")} arrow>
                                <motion.button
                                    disabled={readOnly && !fullAccess && !writeOnly}
                                    onClick={restoreSpeciality}
                                    className="bg-green-700 px-10 py-3 mt-4 text-white gap-2 rounded-full flex justify-center items-center shadow-md cursor-not-allowed"
                                    {...hoverSettings}
                                >
                                    <ArchiveRestore/> {t("account.restore.putBack")}
                                </motion.button>
                            </Tooltip>
                        )
                    }


                    {
                        (fullAccess || writeOnly) && (
                            <motion.button
                                onClick={restoreSpeciality}
                                className="bg-green-700 px-10 py-3 mt-4 text-white gap-2 rounded-full flex justify-center items-center shadow-md"
                                whileHover={{
                                    scale: 1.1,
                                    boxShadow: "0px 8px 20px rgba(72, 187, 120, 0.5)",
                                }}
                                whileTap={{scale: 0.95}}
                                transition={{type: "spring", stiffness: 300}}
                            >
                                <ArchiveRestore/> {t("account.restore.putBack")}
                            </motion.button>
                        )
                    }

                    {
                        (readOnly && !writeOnly && !fullAccess) && (
                            <Tooltip title={t("common.access.permission")} arrow>

                                <motion.button
                                    disabled={readOnly && !fullAccess && !writeOnly}
                                    onClick={openDeleteModal}
                                    className="flex items-center gap-2 px-10 py-3 mt-4 rounded-full text-white bg-red-600 shadow-md cursor-not-allowed"
                                    {...hoverSettings}
                                >
                                    <FaRegTrashAlt/>
                                    {t("account.restore.deleteP")}
                                </motion.button>
                            </Tooltip>
                        )
                    }


                    {
                        (fullAccess || writeOnly) && (
                            <motion.button
                                onClick={openDeleteModal}
                                className="flex  items-center gap-2 px-10 py-3 mt-4 rounded-full text-white bg-red-600 shadow-md"
                                whileHover={{
                                    scale: 1.1,
                                    boxShadow: "0px 8px 20px rgba(255, 82, 82, 0.6)",
                                }}
                                whileTap={{scale: 0.95}}
                                transition={{type: "spring", stiffness: 300}}
                            >
                                <FaRegTrashAlt/>
                                {t("account.restore.deleteP")}
                            </motion.button>
                        )
                    }


                </div>

            </div>

            <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
                <motion.table
                    className="w-full text-left text-white border border-gray-600 rounded-lg shadow-lg mt-5"
                    initial={{y: 20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: 0.3}}
                >
                    <thead className="bg-gray-700">
                    {table?.getHeaderGroups()?.map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            <th className="p-2">
                                <input
                                    type="checkbox"
                                    checked={
                                        table.getRowModel().rows.length > 0 &&
                                        table.getRowModel().rows.every((row) =>
                                            selectedSpecialityIds.includes(row.original._id)
                                        )
                                    }
                                    onChange={(e) =>
                                        setSelectedSpecialityIds(
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
                    {table?.getRowModel()?.rows?.length > 0 ? (
                        table?.getRowModel()?.rows?.map((row, i) => (
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
                                        checked={selectedSpecialityIds.includes(row.original._id)}
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
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-center w-72">
                    <FaRegTrashAlt size={56} className="mx-auto text-red-500"/>
                    <div className="mx-auto my-4 w-60">
                        <h3 className="text-lg font-black text-gray-800">Confirm Delete</h3>
                        <p className="text-sm text-gray-600">
                            Are you sure you want to delete ?
                        </p>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button
                            className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 shadow-md shadow-red-400/40 hover:from-red-600 hover:to-red-800 py-2 rounded-md transition duration-150"
                            onClick={deletePermanentSpeciality}>Delete
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
    );
};

export default RestoreSpeciality;
