import React, {useContext, useEffect, useState} from 'react';
import * as specialityService from "../../service/SpecialityService"
import {useLocation, useNavigate} from "react-router-dom";
import {FaRegTrashAlt} from "react-icons/fa";
import {toast} from "react-toastify";
import {AdminContext} from "../../context/AdminContext";
import {AnimatePresence, motion} from "framer-motion";
import {getCoreRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";
import {useQuery} from "@tanstack/react-query";
import * as accountService from "../../service/AccountService";
import {assets} from "../../assets/assets";


const SpecialityList = () => {
    const {aToken} = useContext(AdminContext);
    const navigate = useNavigate();
    const [specialities, setSpecialities] = useState([]);
    const [hiddenState, setHiddenState] = useState('true');
    const [open, setOpen] = useState(false);

    const [selectedSpecialityIds, setSelectedSpecialityIds] = useState([]);

    const location = useLocation();
    const {isDeleted} = location.state || ""

    const {imageUpdated} = location.state || {};
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 8,
    });

    const {t} = useTranslation();


    const findAllSpecialities = async () => {
        if (isDeleted) {
            setHiddenState('true')
            const result = await specialityService.findAll(hiddenState, aToken)
            // setImage(result.speciality_image)
            setSpecialities(result);
        } else {
            setHiddenState('no')
            const result = await specialityService.findAll(hiddenState, aToken)
            // setImage(result.speciality_image)
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


    const table = useReactTable({
        data: specialities,
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
                    icon: "warning",
                    showConfirmButton: false,
                    timer: 1500
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


    useEffect(() => {
        if (aToken) {
            findAllSpecialities()
        }

    }, [isDeleted, aToken, hiddenState]);


    return (
        <div className='m-5 h-full w-[90vw] overflow-y-scroll'>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg text-primary lg:text-3xl font-medium'>{!isDeleted ? t("speciality.list.title") : t("speciality.restore.title")} </h1>
                <div className='flex gap-3 mr-2'>

                    {
                        isDeleted ? (
                            <div className='flex gap-2'>
                                <motion.button
                                    onClick={restoreSpeciality}
                                    className='bg-green-700 px-10 py-3 mt-4 text-white rounded-full'
                                    whileHover={{scale: 1.05, boxShadow: '0px 4px 8px rgba(0,255,0,0.4)'}}
                                    whileTap={{scale: 0.95}}
                                    transition={{duration: 0.2}}
                                >
                                    Put Back
                                </motion.button>

                                <motion.button
                                    onClick={openDeleteModal}
                                    className='flex items-center gap-2 px-10 py-3 mt-4 rounded-full text-white bg-red-600 shadow-red-400/40 cursor-pointer'
                                    whileHover={{scale: 1.05, boxShadow: '0px 4px 8px rgba(255,0,0,0.4)'}}
                                    whileTap={{scale: 0.95}}
                                    transition={{duration: 0.2}}
                                >
                                    <FaRegTrashAlt/> Delete
                                </motion.button>
                            </div>
                        ) : (
                            <div className='flex gap-2'>
                                <motion.button
                                    onClick={() => navigate(`/add-speciality`)}
                                    className='bg-primary px-10 py-3 mt-4 text-white rounded-full'
                                    whileHover={{scale: 1.05, boxShadow: '0px 4px 8px rgba(0,0,0,0.2)'}}
                                    whileTap={{scale: 0.95}}
                                    transition={{duration: 0.2}}
                                >
                                    {t("speciality.list.add")}
                                </motion.button>


                                <motion.button
                                    onClick={openDeleteModal}
                                    className='flex items-center gap-2 px-10 py-3 mt-4 rounded-full text-white bg-red-600 shadow-red-400/40 cursor-pointer'
                                    whileHover={{scale: 1.05, boxShadow: '0px 4px 8px rgba(255,0,0,0.4)'}}
                                    whileTap={{scale: 0.95}}
                                    transition={{duration: 0.2}}
                                >
                                    <FaRegTrashAlt/> {t("speciality.list.delete")}
                                </motion.button>

                                <motion.button
                                    onClick={() => navigate('/speciality', {state: {isDeleted: true}})}
                                    className='flex items-center gap-2 px-10 py-3 mt-4 rounded-full text-white bg-gray-500 shadow-gray-400/40 cursor-pointer'
                                    whileHover={{scale: 1.05, boxShadow: '0px 4px 8px rgba(128,128,128,0.4)'}}
                                    whileTap={{scale: 0.95}}
                                    transition={{duration: 0.2}}
                                >
                                    <FaRegTrashAlt/> {t("speciality.list.trash")}
                                </motion.button>
                            </div>
                        )
                    }


                </div>
            </div>


            <motion.div
                className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-5 ml-5 pb-5"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {opacity: 0},
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.15, // Delay between each child's animation
                            duration: 0.6,        // Overall duration of the container animation
                            ease: "easeInOut",    // Smooth easing
                        },
                    },
                }}
            >
                <AnimatePresence>
                    {paginatedData.length > 0 ? (

                        paginatedData?.map((item, index) => (
                            <motion.div
                                className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group'
                                // key={index} dung cai nay thi 3 item dau ko co hieu ung
                                key={item._id}
                                whileHover={{scale: 1.05, boxShadow: '0px 4px 10px rgba(0,0,0,0.2)'}}
                                variants={{
                                    hidden: {opacity: 0, y: 20},
                                    visible: {opacity: 1, y: 0}
                                }}
                                transition={{duration: 0.3, ease: "easeOut"}}

                                initial={{opacity: 0, scale: 0.9, y: 30}}
                                animate={{opacity: 1, scale: 1, y: 0}}
                            >
                                <div
                                    className='relative w-56 h-56  bg-indigo-50 group rounded-xl overflow-hidden cursor-pointer'>
                                    <img
                                        className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-80"
                                        // src={`${item.speciality_image}?t=${new Date().getTime()}`}
                                        src={item.speciality_image}
                                        alt="Speciality"
                                    />


                                    <button
                                        onClick={() => navigate(`/get-speciality/${item._id}`)}
                                        className='absolute inset-0 flex items-center justify-center bg-primary/75 text-white text-lg font-semibold py-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                                    >
                                        {t("speciality.list.edit")}
                                    </button>
                                </div>
                                <div className='p-4'>
                                    <div className='flex justify-end'>
                                        <input
                                            type='checkbox'
                                            checked={selectedSpecialityIds.includes(item._id)}
                                            onChange={() => toggleAccountSelection(item._id)}
                                        />
                                    </div>
                                    <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                                    <p className='text-zinc-600 text-sm'>{item.description}</p>
                                </div>
                            </motion.div>
                        ))

                    ) : <div className='max-h-[90h] w-[90vw]'>
                        <img className='w-[50vw]' src={assets.no_data} alt='no records'/>
                    </div>

                    }
                </AnimatePresence>
            </motion.div>

            {/* Pagination */}
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
