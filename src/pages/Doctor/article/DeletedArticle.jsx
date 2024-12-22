import React, {useContext, useState} from 'react';
import {DoctorContext} from "../../../context/DoctorContext";
import {useTranslation} from "react-i18next";
import Error from "../../../components/Error";
import * as articleService from "../../../service/ArticleService";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import Loader from "../../../components/Loader";
import {motion} from "framer-motion";
import {assets} from "../../../assets/assets";
import Modal from "../../../components/Modal/Modal";
import {FaRegTrashAlt} from "react-icons/fa";
import {ArchiveRestore} from "lucide-react";


const DeletedArticle = () => {
    const columnHelper = createColumnHelper();
    const {dToken, doctorData, getDoctorData} = useContext(DoctorContext)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 3,
    })
    const {t} = useTranslation()
    const [open, setOpen] = useState(false)
    const [selectedArticleIds, setSelectedArticleIds] = useState([])



    const fetchDoctorArticles = async () => {
        const email = doctorData?.email || (await getDoctorData())?.email;
        if (!email) {
            throw new Error("Doctor email not found");
        }
        const articles = await articleService.getAllArticleByDoctor(email, dToken);
        return articles.filter((article) => article.is_deleted === true);
    };

    const {data: articles = [], isLoading, isError, refetch} = useQuery({
        queryKey: ["articles", doctorData?.email],
        queryFn: fetchDoctorArticles,
        enabled: !!dToken,
    });



    const selectedArticle = (id) => {
        setSelectedArticleIds((prevSelected) => (
            prevSelected.includes(id)
                ? prevSelected.filter((articleId) => articleId !== id)
                : [...prevSelected, id]
        ))
    }

    const restoreArticles = useMutation({
        mutationFn: async (articleIds) => {
            try {
                const data = await articleService.restoreDeletedArticle(articleIds, dToken);
                if (data) {
                    return true;
                }
            } catch (e) {
                console.log(e);
                throw new Error('Error restoring article');
            }
        },
        onSuccess: async () => {
            await refetch();
            Swal.fire({
                position: 'top-end',
                title: t('article.restore.success'),
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
                backdrop: false
            });
        },
        onError: (error) => {
            console.log(error)
        },
    });

    const handleRestore = (selectedArticleIds) => {
        restoreArticles.mutate(selectedArticleIds);
    };

    const permanentDeleteArticles = async () => {
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
            await articleService.deletePermanentArticle(selectedArticleIds, dToken);
            await refetch();
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

    const columns = [
        columnHelper.accessor("_id", {id: "_id", cell: (info) => <span>{info.row.index + 1}</span>, header: "S.No"}),
        columnHelper.accessor("article_image", {
            cell: (info) => <img className="rounded-full w-10 h-10 object-cover"
                                 src={info?.getValue() || assets.user_icon} alt="..."/>,
            header: t("article.list.image")
        }),
        columnHelper.accessor("article_title", {cell: (info) => <span>{info?.getValue()}</span>, header: t("article.list.title")}),
        columnHelper.accessor("date_published", {cell: (info) => {
                const date = new Date(info?.getValue())
                return <span>{date.toLocaleDateString("en-GB")}</span>
            }, header:t("article.list.public")
        })
    ];

    const table = useReactTable({
        data: articles,
        columns,
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

    const toggleAccountSelection = (id) => {
        setSelectedArticleIds((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((accountId) => accountId !== id)
                : [...prevSelected, id]
        );
    };


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

            {
                paginatedData.length > 0 &&
                <motion.div
                    className="flex justify-end mb-4 gap-2"
                    initial={{y: -20}}
                    animate={{y: 0}}
                    transition={{duration: 0.5}}
                >
                    <motion.button
                        onClick={() => handleRestore(selectedArticleIds)}
                        className="flex items-center justify-center gap-1  bg-green-600 w-[180px] text-white rounded-full px-4 py-4 hover:bg-primary-dark transition-colors"
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                    >
                        <ArchiveRestore/> {t("doctor.article.pb")}
                    </motion.button>

                    <motion.button
                        onClick={() => setOpen(true)}
                        className="bg-red-600 text-white w-[150px] rounded-full px-4 py-4 hover:bg-primary-dark transition-colors"
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                    >
                        {t("doctor.article.dp")}
                    </motion.button>
                </motion.div>
            }
            <div>
                {paginatedData.length > 0
                    ?

                        (
                            <motion.table
                                className="border border-gray-700 w-full mt-5 text-left text-white border-collapse"
                                initial={{opacity: 0}} animate={{opacity: 1}}>
                                <thead className="bg-gray-600">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        <th className="p-2">
                                            <input
                                                type="checkbox"
                                                checked={table.getRowModel().rows.length > 0 && table.getRowModel().rows.every((row) => selectedArticleIds.includes(row.original._id))}
                                                onChange={(e) =>
                                                    setSelectedArticleIds(
                                                        e.target.checked ? table.getRowModel().rows.map((row) => row.original._id) : []
                                                    )
                                                }
                                            />
                                        </th>
                                        {headerGroup.headers.map((header) => (
                                            <th key={header.id}
                                                className="capitalize p-2">{flexRender(header.column.columnDef.header, header.getContext())}</th>
                                        ))}
                                    </tr>
                                ))}
                                </thead>
                                <tbody>
                                    {table.getRowModel().rows.length ? (
                                        table.getRowModel().rows.map((row, i) => (
                                            <motion.tr
                                                key={row.id}
                                                className={i % 2 === 0 ? 'bg-cyan-600' : 'bg-cyan-900'}
                                                initial={{y: 10, opacity: 0}}
                                                animate={{y: 0, opacity: 1}}
                                                exit={{y: 10, opacity: 0}}
                                            >
                                                <td className="p-2">
                                                    <input type="checkbox"
                                                           checked={selectedArticleIds.includes(row.original._id)}
                                                           onChange={() => toggleAccountSelection(row.original._id)}
                                                    />
                                                </td>
                                                {row.getVisibleCells().map((cell) => (
                                                    <td key={cell.id} className="p-2"
                                                        >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                ))}
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <motion.tr className="text-center h-32 text-blue-400" initial={{opacity: 0}}
                                                   animate={{opacity: 1}}>
                                            <td colSpan={12}>{t("article.list.noData")}</td>
                                        </motion.tr>
                                    )}
                                </tbody>
                            </motion.table>

                    )
                    : <motion.div
                        className="flex justify-center items-center"
                        initial={{opacity: 0, scale: 0.8}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 0.5}}
                    >
                        <motion.p
                            className="text-xl text-gray-500"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.3}}
                        >
                            {t("doctor.article.noDeletedArticles")}
                        </motion.p>
                    </motion.div>
                }
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
                            onClick={permanentDeleteArticles}
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

export default DeletedArticle;
