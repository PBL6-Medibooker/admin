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
import Swal from "sweetalert2";
import {XCircle, Newspaper} from "lucide-react";


const DoctorArticleList = () => {
    const {dToken, doctorData, getDoctorData} = useContext(DoctorContext)
    const {t} = useTranslation()
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 4,
    })
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const [selectedArticleIds, setSelectedArticleIds] = useState([])

    const selectedArticle = (id) => {
        setSelectedArticleIds((prevSelected) => (
            prevSelected.includes(id)
                ? prevSelected.filter((articleId) => articleId !== id)
                : [...prevSelected, id]
        ))
    }

    const fetchDoctorArticles = async () => {
        const email = doctorData?.email || (await getDoctorData())?.email;
        if (!email) {
            throw new Error("Doctor email not found");
        }
        const articles = await articleService.getAllArticleByDoctor(email, dToken);
        return articles.filter((article) => article.is_deleted === false);
    };


    const {data: articles = [], isLoading, isError, refetch} = useQuery({
        queryKey: ["articles", doctorData?.email],
        queryFn: fetchDoctorArticles,
        enabled: !!dToken, // Run query only if dToken is available
    });

    const softDeleteArticles = async () => {
        if (selectedArticleIds?.length === 0) {
            await Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: t("article.list.warn"),
            });
            setOpen(false);
            return;
        }
        try {
            console.log(selectedArticleIds)
            await articleService.softDeleteArticle(selectedArticleIds, dToken);
            await refetch();
            // toast.success(response.message);
            setSelectedArticleIds([]);
            setOpen(false);
            await Swal.fire({
                position: "top-end",
                title: t("doctor.article.dsuccess"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false
            });
        } catch (error) {
            console.error(error.message);
            alert("Error deleting article: " + error.message);
        }
    };

    const table = useReactTable({
        data: articles,
        state: {
            pagination,
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
    });

    const paginatedData = [...articles].reverse().slice(
        pagination.pageIndex * pagination.pageSize,
        (pagination.pageIndex + 1) * pagination.pageSize
    );


    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-screen bg-opacity-75 fixed top-0 left-0 z-50">
                <Loader/>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <Error/>
            </div>
        )
    }

    return (
        <div className="m-5 w-[90vw] h-[100vh]">
            <motion.div
                className="flex justify-end mb-4 gap-2 mr-2"
                initial={{y: -20}}
                animate={{y: 0}}
                transition={{duration: 0.5}}
            >
                <motion.button
                    onClick={() => navigate("/create-article")}
                    className="flex items-center justify-center gap-2 bg-primary w-[180px] text-white rounded-full px-4 py-3 hover:bg-primary-dark transition-colors"
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                >
                   <Newspaper/> {t("doctor.article.create")}
                </motion.button>

                <motion.button
                    onClick={() => setOpen(true)}
                    className="flex items-center justify-center gap-2 bg-red-600 text-white w-[150px] rounded-full px-4 py-3 hover:bg-primary-dark transition-colors"
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                >
                   <XCircle/> {t("doctor.article.delete")}
                </motion.button>
            </motion.div>
            <div>
                {paginatedData.map((item, index) => {

                    const date = new Date(item.date_published)
                    const d = date.toLocaleDateString("en-GB")

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
                                    className="w-full h-full object-cover  bg-indigo-50"
                                    src={item.article_image ? item.article_image : assets.user_icon}
                                    alt="Doctor"
                                    initial={{scale: 0.9}}
                                    animate={{scale: 1}}
                                    transition={{duration: 0.3, ease: "easeInOut"}}
                                />
                            </div>


                            <div className="flex-1 gap-2 text-sm text-zinc-600">


                                <motion.p
                                    className="text-lg font-semibold"
                                    whileHover={{color: "#4A90E2"}}
                                    transition={{duration: 0.3}}
                                >
                                    {item.article_title}
                                </motion.p>

                                <motion.p
                                    className="text-gray-500"
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{duration: 0.5, delay: 0.1}}
                                >
                                    {item.doctor_id.speciality_id.name}
                                </motion.p>

                                <motion.p
                                    className="mt-2 text-gray-600"
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{duration: 0.5, delay: 0.2}}
                                >
                                    {t("doctor.article.date")}: <span className="text-xs">{d}</span>
                                </motion.p>
                            </div>


                            <div className="flex flex-col justify-end gap-2">

                                <motion.div
                                    className="flex  justify-between items-center "
                                    initial={{opacity: 0, y: 10}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{duration: 0.5}}
                                    whileHover={{scale: 1.02}}
                                >
                                    <motion.input
                                        type="checkbox"
                                        checked={selectedArticleIds.includes(item._id)}
                                        onChange={() => selectedArticle(item._id)}
                                        className="cursor-pointer mb-16 ml-40"
                                        whileTap={{scale: 0.9}}
                                        initial={{opacity: 0, scale: 0.9}}
                                        animate={{opacity: 1, scale: 1}}
                                        transition={{duration: 0.3, ease: "easeInOut"}}
                                    />

                                </motion.div>

                                <motion.button
                                    onClick={() => navigate(`/update-article/${item._id}`)}
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{duration: 0.3}}
                                    className="w-48 sm:w-min-48 py-2 px-1 border border-green-500 rounded text-green-500 hover:bg-green-100 hover:shadow-md transition-all duration-300"
                                >
                                    {t("doctor.article.edit")}
                                </motion.button>
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
                    <h3 className="text-lg font-semibold">{t("doctor.article.confirmDelete")}</h3>
                    <p className="text-gray-600">{t("doctor.article.pCD")}</p>
                    <div className="flex justify-around mt-6">
                        <motion.button
                            onClick={softDeleteArticles}
                            whileHover={{scale: 1.05}}
                            className="text-white bg-red-600 px-6 py-2 rounded-md"
                        >
                            {t("doctor.article.confirm")}
                        </motion.button>
                        <motion.button
                            onClick={() => setOpen(false)}
                            whileHover={{scale: 1.05}}
                            className="bg-gray-200 px-6 py-2 rounded-md"
                        >
                            {t("doctor.article.cancel")}
                        </motion.button>
                    </div>
                </motion.div>
            </Modal>
        </div>
    );
};

export default DoctorArticleList;
