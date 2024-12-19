import React, {useContext, useEffect, useState} from 'react';
import * as specialityService from "../../service/SpecialityService"
import {useLocation, useNavigate} from "react-router-dom";
import {FaRegTrashAlt} from "react-icons/fa";
import {toast} from "react-toastify";
import {AdminContext} from "../../context/AdminContext";
import {AnimatePresence, motion} from "framer-motion";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";
import {useQuery} from "@tanstack/react-query";
import {assets} from "../../assets/assets";
import {ArchiveRestore, Plus} from "lucide-react"
import * as adminService from "../../service/AdminService";
import Error from "../../components/Error";
import {Tooltip} from '@mui/material';


const SpecialityList = () => {
    const {
        aToken,
        adminData,
        refectAdminData,
        refetchAdminDetails,
        adminDetails,
        readOnly,
        writeOnly,
        fullAccess
    } = useContext(AdminContext);
    const navigate = useNavigate();
    const [specialities, setSpecialities] = useState([]);
    const [hiddenState, setHiddenState] = useState('true');
    const [open, setOpen] = useState(false);
    const columnHelper = createColumnHelper();
    const [selectedSpecialityIds, setSelectedSpecialityIds] = useState([]);

    const location = useLocation();
    const {isDeleted} = location.state || ""

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 8,
    });

    const {t} = useTranslation();


    const findAllSpecialities = async () => {
        if (isDeleted) {
            setHiddenState('true')
            const result = await specialityService.findAll(hiddenState, aToken)
            setSpecialities(result);

        } else {
            setHiddenState('no')
            const result = await specialityService.findAll(hiddenState, aToken)
            setSpecialities(result);
        }
    }

    // const { specialities = [], isLoading, isError, refetch } = useQuery({
    //     queryKey: ["specialities", isDeleted, hiddenState],
    //     queryFn: async () => {
    //         try {
    //             let result;
    //             if (isDeleted) {
    //                 setHiddenState('true')
    //                 result = await specialityService.findAll(hiddenState, aToken)
    //             } else {
    //                 setHiddenState(false)
    //                 result = await specialityService.findAll(hiddenState, aToken)
    //             }
    //             console.log("Response:", result);
    //             return result;
    //         } catch (e) {
    //             console.error(e);
    //             throw new Error("Failed to load specialities");
    //         }
    //     }
    //
    // });


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


    const toggleAccountSelection = (id) => {
        setSelectedSpecialityIds((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((specId) => specId !== id)
                : [...prevSelected, id]
        );
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
    const softDeleteSpec = async () => {
        if (selectedSpecialityIds?.length === 0 && open) {
            await Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: t("speciality.list.message"),
            });
            return;
        }
        try {
            await specialityService.deleteSoftSpeciality(selectedSpecialityIds, aToken)
            await findAllSpecialities();
            // refetch()
            // toast.success('Delete Successful');
            setSelectedSpecialityIds([]);
            setOpen(false)
            await Swal.fire({
                position: "top-end",
                title: t("speciality.list.success"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error(error.message);
            toast.error(error.message)
        }
    };

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
                await findAllSpecialities();
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
                position: "top-end",
                title: t("speciality.restore.rwarn"),
                icon: "warning",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        try {
            const response = await specialityService.restoreSpeciality(selectedSpecialityIds, aToken);
            if (response.message !== '') {
                findAllSpecialities();
                setSelectedSpecialityIds([]);
                setOpen(false);

                await Swal.fire({
                    position: "top-end",
                    title: t("speciality.restore.rsuccess"),
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
            findAllSpecialities()
            refetchAdminDetails()
        }

    }, [isDeleted, aToken, hiddenState, adminDetails, adminData, readOnly]);


    return (
        <div className='m-5 h-full w-[90vw] overflow-y-scroll'>
            <div className="flex justify-between items-center">
                <h1 className="text-lg text-primary lg:text-3xl font-medium">
                    {!isDeleted ? t("speciality.list.title") : t("speciality.restore.title")}
                </h1>
                <div className="flex gap-4 mr-2">
                    {isDeleted ? (
                        <div className="flex gap-3 mr-6">

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
                    ) : (
                        <div className="flex gap-4 mr-3">

                            {
                                (readOnly && !writeOnly && !fullAccess) && (
                                    <Tooltip title={t("common.access.permission")} arrow>
                                        <motion.button
                                            disabled={readOnly && !fullAccess && !writeOnly}
                                            onClick={() => navigate(`/add-speciality`)}
                                            className="bg-primary px-9 py-3 mt-4 text-white rounded-full flex justify-center items-center shadow-md cursor-not-allowed"
                                            {...hoverSettings}
                                        >
                                            <Plus/>
                                            {t("speciality.list.add")}
                                        </motion.button>
                                    </Tooltip>
                                )
                            }
                            {
                                (fullAccess || writeOnly) && (
                                    <motion.button
                                        onClick={() => navigate(`/add-speciality`)}
                                        className="bg-primary px-9 py-3 mt-4 text-white rounded-full flex justify-center items-center shadow-md"
                                        {...hoverSettings}
                                    >
                                        <Plus/>
                                        {t("speciality.list.add")}
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
                                            {t("speciality.list.delete")}
                                        </motion.button>
                                    </Tooltip>
                                )
                            }


                            {
                                (fullAccess || writeOnly) && (
                                    <motion.button
                                        onClick={openDeleteModal}
                                        className="flex items-center gap-2 px-10 py-3 mt-4 rounded-full text-white bg-red-600 shadow-md"
                                        whileHover={{
                                            scale: 1.1,
                                            boxShadow: "0px 8px 20px rgba(255, 82, 82, 0.6)",
                                        }}
                                        whileTap={{scale: 0.95}}
                                        transition={{type: "spring", stiffness: 300}}
                                    >
                                        <FaRegTrashAlt/>
                                        {t("speciality.list.delete")}
                                    </motion.button>
                                )
                            }

                            <motion.button

                                onClick={() => navigate('/speciality', {state: {isDeleted: true}})}
                                className="flex items-center gap-2 px-10 py-3 mt-4 rounded-full text-white bg-gray-500 shadow-md"
                                whileHover={{
                                    scale: 1.1,
                                    boxShadow: "0px 8px 20px rgba(128, 128, 128, 0.5)",
                                }}
                                whileTap={{scale: 0.95}}
                                transition={{type: "spring", stiffness: 300}}
                            >
                                <FaRegTrashAlt/>
                                {t("speciality.list.trash")}
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>


            {
                isDeleted ?
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
                    :
                    <motion.div
                        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-5 ml-5 pb-5"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {opacity: 0},
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.15,
                                    duration: 0.6,
                                    ease: "easeInOut",
                                },
                            },
                        }}
                    >
                        <AnimatePresence>
                            {paginatedData.length > 0 ? (

                                paginatedData?.map((item, index) => (

                                    <motion.div
                                        key={item._id}
                                        className="relative flex flex-col max-w-60 h-[320px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#00A6A9] to-[#0B5E87] shadow-lg hover:shadow-2xl transition-all duration-300"
                                        whileHover={{scale: 1.05}}
                                        variants={{
                                            hidden: {opacity: 0, y: 20},
                                            visible: {opacity: 1, y: 0},
                                        }}
                                        transition={{duration: 0.3, ease: "easeOut"}}
                                        initial={{opacity: 0, scale: 0.9, y: 30}}
                                        animate={{opacity: 1, scale: 1, y: 0}}
                                    >
                                        <div
                                            className="absolute inset-2 rounded-2xl bg-white flex flex-col items-center p-6 shadow-md">
                                            <div
                                                className="relative w-[140px] h-[140px] rounded-full overflow-hidden bg-gradient-to-b from-[#00A6A9] to-[#0B5E87] flex justify-center items-center shadow-lg">
                                                <img
                                                    src={`${item.speciality_image}?remove-bg=true`}
                                                    alt="Speciality"
                                                    className="w-full h-full object-cover rounded-full transition-opacity duration-300 hover:opacity-90"
                                                />


                                                <button
                                                    onClick={() => navigate(`/get-speciality/${item._id}`)}
                                                    className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm font-semibold px-4 py-2 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
                                                >
                                                    {t("speciality.list.edit")}
                                                </button>
                                            </div>

                                            <div className="flex gap-2 mt-6 text-center items-center">
                                                <p className="text-xl font-semibold text-gray-800 mb-2">{item.name}</p>


                                                {
                                                    (!readOnly || writeOnly || fullAccess) &&
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSpecialityIds.includes(item._id)}
                                                        onChange={() => toggleAccountSelection(item._id)}
                                                        className="text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mb-1"
                                                    />
                                                }


                                            </div>
                                        </div>
                                    </motion.div>


                                ))

                            ) : <div className='max-h-[90h] w-[90vw]'>
                                <img className='w-[50vw]' src={assets.no_data} alt='no records'/>
                            </div>

                            }
                        </AnimatePresence>
                    </motion.div>
            }


            {
                paginatedData.length > 0 &&
                <div className="flex items-center justify-end gap-2 mt-4">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-2 py-1 border border-gray-400 rounded-md hover:bg-gray-200 transition-all duration-300"
                    >
                        {"<"}
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-2 py-1 border border-gray-400 rounded-md hover:bg-gray-200 transition-all duration-300"
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
                            className="w-16 px-2 py-1 border border-gray-400 rounded-md bg-transparent hover:border-gray-500 transition-all duration-300"
                        />
                    </div>
                </div>
            }


            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 flex justify-center items-center bg-black/50 z-50"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        <motion.div
                            className="bg-white rounded-lg p-6 shadow-lg w-96"
                            initial={{scale: 0.8, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.8, opacity: 0}}
                        >
                            <FaRegTrashAlt size={56} className="mx-auto text-red-500"/>
                            <h3 className="text-lg font-black text-gray-800 text-center mt-4">
                                {t("speciality.list.confirm")}
                            </h3>
                            <p className="text-sm text-gray-600 text-center">
                                {t("speciality.list.p")}
                            </p>
                            <div className="flex gap-4 mt-6">
                                {
                                    isDeleted
                                        ? <button
                                            className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 shadow-md shadow-red-400/40 hover:from-red-600 hover:to-red-800 py-2 rounded-md transition duration-150"
                                            onClick={deletePermanentSpeciality}
                                        >
                                            {t("speciality.restore.permanent")}
                                        </button>
                                        : <button
                                            className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 shadow-md shadow-red-400/40 hover:from-red-600 hover:to-red-800 py-2 rounded-md transition duration-150"
                                            onClick={softDeleteSpec}
                                        >
                                            {t("speciality.list.delete")}
                                        </button>
                                }
                                <button
                                    className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150"
                                    onClick={() => setOpen(false)}
                                >
                                    {t("speciality.list.cancel")}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SpecialityList;
