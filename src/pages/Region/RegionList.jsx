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
import * as regionService from "../../service/RegionService";
import {FaRegTrashAlt, FaTrashRestoreAlt} from "react-icons/fa";
import Modal from "../../components/Modal/Modal";
import {toast} from "react-toastify";
import {LuMapPin} from "react-icons/lu";
import {LuMapPinOff} from "react-icons/lu";
import AddRegion from "./AddRegion";
import UpdateRegion from "./UpdateRegion";
import {motion} from "framer-motion";
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";
import CustomButton from "../../components/button/CustomButton";
import {MapPinPlus} from "lucide-react"


const RegionList = () => {
    const {aToken} = useContext(AdminContext);
    const columnHelper = createColumnHelper();
    const navigate = useNavigate();

    const [globalFilter, setGlobalFilter] = useState("");
    const [hiddenState, setHiddenState] = useState(false);
    const [selectedRegionIds, setSelectedRegionIds] = useState([]);
    const [open, setOpen] = useState(false);
    const [createModal, setCreateModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [regionId, setRegionId] = useState('');
    const [data, setData] = useState([]);
    const {t} = useTranslation();

    // const members = useQuery({
    //     queryKey: [workSpace],
    //     queryFn: async () => {
    //         if (!workSpace.data?.members) return [];
    //         const members = await Promise.all(workSpace.data.members.map(async (member) => {
    //             return (await getUserData(member))
    //         }))
    //         members.push({
    //             id: workSpace.data.owner.id,
    //             name: workSpace.data.owner.name,
    //             imageUri: workSpace.data.owner.imageUri,
    //             email: workSpace.data.owner.email,
    //         })
    //         return members
    //     }
    // })
    //
    //
    // workSpace.data && members.data && (
    // or members.isLoading
    //     <ModalEditCard
    //         open={openModal}
    //         onClose={() => setOpenModal(false)}
    //         card={card}
    //         members={members}
    //     />
    // )

    // const { data, isLoading, isError, refetch } = useQuery({
    //     queryKey: ['regions', hiddenState],
    //     queryFn: async () => {
    //         try {
    //             return await regionService.findAll(hiddenState, aToken);
    //         } catch (e) {
    //             console.error(e);
    //             throw new Error('Failed to load regions');
    //         }
    //     }
    // });

    // const queryClient = useQueryClient();

    // const deleteRegionsMutation = useMutation({
    //     mutationFn: (ids) => regionService.deleteSoftRegion(ids, aToken),
    //     onSuccess: () => {
    //         toast.success('Delete Successful');
    //         setSelectedRegionIds([]);
    //         refetch(); // Refetch the region list after successful deletion
    //     },
    //     onError: (error) => {
    //         toast.error(error.message || 'An error occurred while deleting regions');
    //     }
    // });


    const loadData = async () => {
        try {
            getRegionList();
            setCreateModal(false);
            setUpdateModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const openUpdateModal = (id) => {
        setUpdateModal(true);
        setRegionId(id);
    };

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

    const openDeleteModal = () => {
        if (selectedRegionIds?.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: t("region.list.deleteNoti"),
            });
        } else {
            setOpen(true);
        }
    };

    const softDeleteRegions = async () => {
        if (selectedRegionIds?.length === 0 && open) {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: t("region.list.deleteNoti"),
            });
            return;
        }
        try {
            await regionService.deleteSoftRegion(selectedRegionIds, aToken);
            await getRegionList();
            // toast.success('Delete Successful');
            setSelectedRegionIds([]);
            setOpen(false);
            await Swal.fire({
                position: "top-end",
                title: t("region.list.m"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false
            });
        } catch (error) {
            console.error(error.message);
            toast.error(error.message);
        }
    };

    const getRegionList = async () => {
        try {
            const result = await regionService.findAll(hiddenState, aToken);
            setData(result);
        } catch (e) {
            console.log(e.error);
        }
    };


    useEffect(() => {
        if (aToken) {
            getRegionList();
        }
    }, [aToken]);

    return (
        <motion.div className='mb-5  ml-5 mr-5 max-h-[90vh] w-[90vw] overflow-y-scroll'
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{duration: 0.5}}
        >

            <div className="flex justify-between items-center">
                <h1 className="text-xl text-primary lg:text-2xl font-semibold">{t("region.list.title")}</h1>
                <div className="flex gap-4 mt-4 mr-4">

                    <CustomButton
                        onClick={() => setCreateModal(true)}
                        label={''}
                        icon={MapPinPlus}
                        bgColor="bg-green-600"
                        hoverColor="rgba(22, 163, 74, 0.4)"
                        shadowColor="rgba(22, 163, 74, 0.4)"
                    />

                    <CustomButton
                        onClick={openDeleteModal}
                        label={t("region.list.delete")}
                        icon={FaTrashRestoreAlt}
                        bgColor="bg-red-600"
                        hoverColor="rgba(0, 128, 255, 0.4)"
                        shadowColor="rgba(255, 0, 0, 0.4)"
                    />

                    <CustomButton
                        onClick={() => navigate('/restore-region')}
                        label={t("region.list.trash")}
                        icon={LuMapPinOff}
                        bgColor="bg-gray-600"
                        hoverColor="rgba(0, 128, 255, 0.4)"
                        shadowColor="rgba(0, 128, 255, 0.4)"
                    />

                    {/*<motion.button*/}
                    {/*    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-600 hover:bg-gray-700 text-white transition duration-300"*/}
                    {/*    onClick={() => navigate('/restore-region')}*/}
                    {/*    whileHover={{scale: 1.1}}*/}
                    {/*    whileTap={{scale: 0.95}}*/}
                    {/*>*/}
                    {/*    <LuMapPinOff/>*/}
                    {/*    {t("region.list.trash")}*/}
                    {/*</motion.button>*/}
                </div>
            </div>

            <motion.table
                className="border border-gray-200 w-full mt-5 text-left text-white border-collapse rounded-lg shadow-md"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.5}}
            >
                <thead className="bg-gray-700 text-white ">
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        <th className="p-3 border-b border-gray-300">
                        <input
                                type="checkbox"
                                checked={
                                    table.getRowModel().rows?.length > 0 &&
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
                                className="cursor-pointer"
                            />
                        </th>

                        {headerGroup.headers.map((header) => (
                            <th
                                key={header.id}
                                className="capitalize p-3 text-white font-semibold border-b border-gray-300"
                            >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table?.getRowModel()?.rows?.length ? (
                    table.getRowModel().rows.map((row, i) => (
                        <motion.tr
                            key={row.id}
                            className={`${
                                i % 2 === 0 ? 'bg-cyan-600' : 'bg-cyan-900'
                            }`}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.3}}
                        >
                            <td className="p-3">
                                <input
                                    type="checkbox"
                                    checked={selectedRegionIds.includes(row.original._id)}
                                    onChange={() => toggleAccountSelection(row.original._id)}
                                    className="cursor-pointer"
                                />
                            </td>

                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="p-3 cursor-pointer "
                                    onClick={() => openUpdateModal(row.original._id)}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </motion.tr>
                    ))
                ) : (
                    <tr className="text-center h-32 text-gray-400">
                        <td colSpan={12}>{t("region.list.nodata")}</td>
                    </tr>
                )}
                </tbody>
            </motion.table>

            {/* Pagination */}
            <div
                className={`${table.getState().pagination.pageSize === 10 ? 'fixed bottom-0 left-0 ml-[1020px] w-[500px] right-0 z-10 p-4 ' : ''} flex items-center w-[500px] justify-end gap-2 h-12`}>
                <motion.button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-2 py-1 border border-gray-300 bg-transparent disabled:opacity-30"
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.95}}
                >
                    {"<"}
                </motion.button>
                <motion.button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-2 py-1 border border-gray-300 bg-transparent disabled:opacity-30"
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.95}}
                >
                    {">"}
                </motion.button>

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

            <AddRegion open={createModal} onClose={loadData}/>
            <UpdateRegion open={updateModal} onClose={loadData} id={regionId}/>
            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-center w-72">
                    <FaRegTrashAlt size={56} className="mx-auto text-red-500"/>
                    <div className="mx-auto my-4 w-60">
                        <h3 className="text-lg font-black text-gray-800">{t("region.list.confirm")}</h3>
                        <p className="text-sm text-gray-600">{t("region.list.p")}</p>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <motion.button
                            className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 shadow-md shadow-red-400/40 hover:from-red-600 hover:to-red-800 py-2 rounded-md transition duration-150"
                            onClick={softDeleteRegions}
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.95}}
                        >
                            {t("region.list.delete")}
                        </motion.button>
                        <motion.button
                            className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150"
                            onClick={() => setOpen(false)}
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.95}}
                        >
                            {t("region.list.cancel")}
                        </motion.button>
                    </div>
                </div>
            </Modal>
        </motion.div>
    );
};

export default RegionList;
