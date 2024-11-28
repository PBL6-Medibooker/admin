import React, {useContext, useEffect, useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {AdminContext} from "../../context/AdminContext";
import {useLocation, useParams} from "react-router-dom";
import {assets} from "../../assets/assets";
import {AppContext} from "../../context/AppContext";
import {motion} from "framer-motion";
import Loader from "../../components/Loader";
import {useReactTable, getCoreRowModel, getPaginationRowModel} from "@tanstack/react-table";
import {useTranslation} from "react-i18next";
import * as appointmentService from "../../service/AppointmentService";
import Modal from "../../components/Modal/Modal";
import {FaRegTrashAlt} from "react-icons/fa";
import Swal from "sweetalert2";
import Error from "../../components/Error";

const UserAppointments = () => {

    const {aToken} = useContext(AdminContext);
    const now = new Date();
    const {dateFormat, separateDayAndDate} = useContext(AppContext);
    const {id} = useParams();
    const {t} = useTranslation();
    const location = useLocation();
    const {name} = location.state || {};
    const [open, setOpen] = useState(false);
    const [appointmentId, setAppointmentId] = useState('');
    const [isInitialLoading, setIsInitialLoading] = useState(true); // Track initial loading phase
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 3,
    });

    // const {data = [], isLoading, refetch} = useQuery({
    //     queryKey: ["appointments", id],
    //     queryFn: async () => {
    //         try {
    //
    //             const data = await appointmenttService.getAppointmentByUser(id, aToken);
    //             console.log(data);
    //             return data;
    //         } catch (e) {
    //             console.error(e);
    //             throw new Error("Failed to load appointments");
    //         }
    //     },
    // });

    const { data = [], isLoading, isError, refetch } = useQuery({
        queryKey: ["appointments", id],
        queryFn: async () => {
            try {
                const data = await appointmentService.getAppointmentByUser(id, aToken);
                return data;
            } catch (e) {
                console.error(e);
                throw new Error("Failed to load appointments");
            }
        },
        onSuccess: () => {
            setIsInitialLoading(false);
        }
    });

    // const { data = [], isLoading, isError, refetch } = useQuery({
    //     queryKey: ["appointments", id],
    //     queryFn: async () => {
    //         throw new Error("Simulated error");
    //     },
    //     onSuccess: () => {
    //         setIsInitialLoading(false);
    //     }
    // });


    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleCancel = async (appointmentId) => {
        try {
            await cancelAppointment(appointmentId);
        } catch (error) {
            console.error("Cancellation failed:", error);
        }
    };

    const {mutateAsync: cancelAppointment} = useMutation({
        mutationFn: async (appointmentId) => {
            return await appointmentService.softDeleteAppointment(appointmentId, aToken);
        },
        onSuccess: async () => {
            await Swal.fire({
                title: t("account.user.title"),
                text: t("account.user.success"),
                icon: "success",
            });
            await refetch();
        },
        onError: (error) => {
            console.error(error);
            Swal.fire({
                title: t("account.user.error"),
                text: t("account.user.noti"),
                icon: "error",
            });
        },
    });

    const table = useReactTable({
        data: data,
        state: {
            pagination,
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
    });

    const paginatedData = data.slice(
        pagination.pageIndex * pagination.pageSize,
        (pagination.pageIndex + 1) * pagination.pageSize
    );

    const openCancelModal = async (appointmentId) => {
        setAppointmentId(appointmentId)
        setOpen(true)
    }



    if (isInitialLoading || isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-screen bg-opacity-75 fixed top-0 left-0 z-50">
                <Loader />
            </div>
        );
    }

    if(isError){
        return (
            <div>
                <Error />
            </div>
        )
    }


    return (
        <div className="m-5 w-[90vw] h-[100vh]">
            <p className="pb-3 mt-7 font-medium text-primary lg:text-2xl border-b">
                {name} {t("account.user.na")}
            </p>
            <div>
                {paginatedData.reverse().map((item, index) => {
                    const {dayOfWeek, date} = separateDayAndDate(item.appointment_day);
                    const appointmentDate = new Date(item.appointment_day);
                    const isCompleted = appointmentDate < now;

                    return (
                        <motion.div
                            key={item._id}
                            className="flex w-full gap-4 sm:flex sm:gap-6 py-2 border-b bg-white hover:bg-gray-50 hover:shadow-lg transition-all duration-300"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5, delay: index * 0.05}}
                        >
                            <div className='w-32 h-32'>
                                <motion.img
                                    className="w-full h-full object-cover bg-indigo-50"
                                    src={item.doctor_id.profile_image ? item.doctor_id.profile_image : assets.user_icon}
                                    alt="Doctor"
                                    initial={{scale: 0.9}}
                                    animate={{scale: 1}}
                                    transition={{duration: 0.3, ease: "easeInOut"}}
                                />
                            </div>

                            <div className="flex-1 text-sm text-zinc-600">
                                <p className="text-neutral-800 font-semibold">{item.doctor_id.username}</p>
                                <p>{item.doctor_id.speciality}</p>
                                <p className="text-black font-medium mt-1">
                                    {t("account.user.address")}: <span className="text-xs">{item.doctor_id.address}</span>
                                </p>
                                <p className="text-xs mt-1">
                                    <span className="text-black text-sm font-medium"> {t("account.user.dnt")}:</span>{" "}
                                    {`${dayOfWeek}, ${dateFormat(date)} | ${item.appointment_time_start} - ${item.appointment_time_end}`}
                                </p>
                            </div>

                            <div className="flex flex-col justify-end gap-2">
                                {!item.is_deleted && !isCompleted && (
                                    <motion.button
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                        onClick={() => openCancelModal(item._id)}
                                        className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white hover:shadow-md transition-all duration-300"
                                    >
                                        {t("account.user.cancela")}
                                    </motion.button>
                                )}
                                {item.is_deleted && !isCompleted && (
                                    <motion.button
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        transition={{duration: 0.3}}
                                        className="w-48 sm:w-min-48 py-2 px-1 border border-red-500 rounded text-red-500 hover:bg-red-100 hover:shadow-md transition-all duration-300"
                                    >
                                        {t("account.user.cancelled")}
                                    </motion.button>
                                )}

                                {isCompleted && (
                                    <motion.button
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        transition={{duration: 0.3}}
                                        className="w-48 sm:w-min-48 py-2 px-1 border border-green-500 rounded text-green-500 hover:bg-green-100 hover:shadow-md transition-all duration-300"
                                    >
                                        {t("account.user.completed")}
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Pagination */}
            {
                paginatedData.length > 0 && <div className="flex items-center justify-end gap-2 mt-4">
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
            <Modal open={open} onClose={() => setOpen(false)}>
                <motion.div
                    className="text-center w-80 p-4 bg-white rounded-lg"
                    initial={{scale: 0.9, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    transition={{duration: 0.3}}
                >
                    <FaRegTrashAlt size={50} className="mx-auto text-red-500 mb-4"/>
                    <h3 className="text-lg font-semibold">{t("account.user.confirmDelete")}</h3>
                    <p className="text-gray-600">{t("account.user.pCD")}</p>
                    <div className="flex justify-around mt-6">
                        <motion.button
                            onClick={() => handleCancel(appointmentId)}
                            whileHover={{scale: 1.05}}
                            className="text-white bg-red-600 px-6 py-2 rounded-md"
                        >
                            {t("account.user.confirm")}
                        </motion.button>
                        <motion.button
                            onClick={() => setOpen(false)}
                            whileHover={{scale: 1.05}}
                            className="bg-gray-200 px-6 py-2 rounded-md"
                        >
                            {t("account.user.cancel")}
                        </motion.button>
                    </div>
                </motion.div>
            </Modal>
        </div>
    );
};

export default UserAppointments;
