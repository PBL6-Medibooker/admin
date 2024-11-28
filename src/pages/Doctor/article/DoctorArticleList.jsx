import React, {useContext, useEffect, useState} from 'react';
import {DoctorContext} from "../../../context/DoctorContext";
import {useTranslation} from "react-i18next";
import {useQuery} from "@tanstack/react-query";
import * as articleService from "../../../service/ArticleService";
import Error from "../../../components/Error";
import {motion} from "framer-motion";
import {assets} from "../../../assets/assets";
import Modal from "../../../components/Modal/Modal";
import {FaRegTrashAlt} from "react-icons/fa";
import {getCoreRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table";
import Loader from "../../../components/Loader";
import {useNavigate} from "react-router-dom";

const DoctorArticleList = () => {
    const {dToken, doctorData, getDoctorData} = useContext(DoctorContext)
    const {t}= useTranslation()
    const [email, setEmail] = useState('')
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 3,
    })
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()


    const fetchDoctorArticles = async () => {
        if (!doctorData?.email) {
            const doctorProfile = await getDoctorData();
            if (!doctorProfile?.email) {
                throw new Error("Doctor email not found");
            }
            return articleService.getAllArticleByDoctor(doctorProfile.email, dToken);
        }
        return articleService.getAllArticleByDoctor(doctorData.email, dToken);
    };

    // const fetchDoctorArticles = async () => {
    //     if (!doctorData?.email) {
    //         console.log("Doctor email not found in context, fetching profile...");
    //         const doctorProfile = await getDoctorData();
    //         if (!doctorProfile?.email) {
    //             throw new Error("Doctor email not found");
    //         }
    //         console.log("Fetched doctor profile:", doctorProfile);
    //         const articles = await articleService.getAllArticleByDoctor(doctorProfile.email, dToken);
    //         console.log("Fetched articles by doctor:", articles);
    //         return articles;
    //     }
    //     console.log("Using email from context:", doctorData.email);
    //     const articles = await articleService.getAllArticleByDoctor(doctorData.email, dToken);
    //     console.log("Fetched articles by doctor:", articles);
    //     return articles;
    // };

    const { data: articles = [], isLoading, isError } = useQuery({
        queryKey: ["articles", doctorData?.email],
        queryFn: fetchDoctorArticles,
        enabled: !!dToken, // Run query only if dToken is available
    });

    const table = useReactTable({
        data: articles,
        state: {
            pagination,
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
    });

    const paginatedData = articles.slice(
        pagination.pageIndex * pagination.pageSize,
        (pagination.pageIndex + 1) * pagination.pageSize
    );

    // const { data = [], isLoading, isError, refetch } = useQuery({
    //     queryKey: ["articles", email],
    //     queryFn: async () => {
    //         try {
    //             console.log(email)
    //             const data = await articleService.getAllArticleByDoctor(email, dToken);
    //             console.log(data)
    //             return data;
    //         } catch (e) {
    //             console.error(e);
    //             throw new Error("Failed to load data");
    //         }
    //     }
    // });
    // useEffect(() => {
    //     if(dToken){
    //         getDoctorData()
    //         setEmail(doctorData?.email)
    //     }
    // }, [dToken, email]);

    if(isLoading){
        return (
            <div className="flex justify-center items-center w-full h-screen bg-opacity-75 fixed top-0 left-0 z-50">
                <Loader />
            </div>
        );
    }

    return (
        <div className="m-5 w-[90vw] h-[100vh]">
            <motion.div
                className="flex justify-end mb-4"
                initial={{y: -20}}
                animate={{y: 0}}
                transition={{duration: 0.5}}
            >
                <motion.button
                    onClick={() => navigate("/create-article")}
                    className="bg-primary text-white rounded-full px-4 py-2 hover:bg-primary-dark transition-colors"
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                >
                    {t("doctor.article.create")}
                </motion.button>
            </motion.div>
            <div>
                {paginatedData.reverse().map((item, index) => {

                    const date = new Date(item.date_published)
                    const d = date.toLocaleDateString("en-GB")

                    return (
                        <motion.div
                            key={index}
                            className="flex w-full gap-4 sm:flex sm:gap-6 py-2 border-b bg-white hover:bg-gray-50 hover:shadow-lg transition-all duration-300"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5, delay: index * 0.05}}
                        >
                            <div className='w-32 h-32'>
                                <motion.img
                                    className="w-full h-full object-cover  bg-indigo-50"
                                    src={item.article_image ? item.article_image : assets.user_icon}
                                    alt="Doctor"
                                    initial={{scale: 0.9}}
                                    animate={{scale: 1}}
                                    transition={{duration: 0.3, ease: "easeInOut"}}
                                />
                            </div>

                            <div className="flex-1 text-sm text-zinc-600">
                                <p className="text-neutral-800 font-semibold">{item.article_title}</p>
                                <p>{item.doctor_id.speciality}</p>
                                <p className="text-black font-medium mt-1">
                                    {/*{t("account.user.address")}: */}
                                    <span
                                        className="text-xs">{d}</span>
                                </p>
                                {/*<p className="text-xs mt-1">*/}
                                {/*    <span*/}
                                {/*        className="text-black text-sm font-medium"> {t("account.user.dnt")}:</span>{" "}*/}
                                {/*    {`${dayOfWeek}, ${dateFormat(date)} | ${item.appointment_time_start} - ${item.appointment_time_end}`}*/}
                                {/*</p>*/}
                            </div>

                            {/*<div className="flex flex-col justify-end gap-2">*/}
                            {/*    {!item.is_deleted && !isCompleted && (*/}
                            {/*        <motion.button*/}
                            {/*            whileHover={{scale: 1.05}}*/}
                            {/*            whileTap={{scale: 0.95}}*/}
                            {/*            onClick={() => openCancelModal(item._id)}*/}
                            {/*            className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white hover:shadow-md transition-all duration-300"*/}
                            {/*        >*/}
                            {/*            {t("account.user.cancela")}*/}
                            {/*        </motion.button>*/}
                            {/*    )}*/}
                            {/*    {item.is_deleted && !isCompleted && (*/}
                            {/*        <motion.button*/}
                            {/*            initial={{opacity: 0}}*/}
                            {/*            animate={{opacity: 1}}*/}
                            {/*            transition={{duration: 0.3}}*/}
                            {/*            className="w-48 sm:w-min-48 py-2 px-1 border border-red-500 rounded text-red-500 hover:bg-red-100 hover:shadow-md transition-all duration-300"*/}
                            {/*        >*/}
                            {/*            {t("account.user.cancelled")}*/}
                            {/*        </motion.button>*/}
                            {/*    )}*/}

                            {/*    {isCompleted && (*/}
                            {/*        <motion.button*/}
                            {/*            initial={{opacity: 0}}*/}
                            {/*            animate={{opacity: 1}}*/}
                            {/*            transition={{duration: 0.3}}*/}
                            {/*            className="w-48 sm:w-min-48 py-2 px-1 border border-green-500 rounded text-green-500 hover:bg-green-100 hover:shadow-md transition-all duration-300"*/}
                            {/*        >*/}
                            {/*            {t("account.user.completed")}*/}
                            {/*        </motion.button>*/}
                            {/*    )}*/}
                            {/*</div>*/}
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
                            // onClick={() => handleCancel(appointmentId)}
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

export default DoctorArticleList;
