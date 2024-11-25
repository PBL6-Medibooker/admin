import React, {useContext, useEffect, useState} from 'react';
import {AdminContext} from "../../context/AdminContext";
import {useNavigate} from "react-router-dom";
import * as specialityService from "../../service/SpecialityService";
import {motion} from "framer-motion";
import {getCoreRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table";
import {useTranslation} from "react-i18next";

const PostSpeciality = () => {
    const {aToken} = useContext(AdminContext);
    const navigate = useNavigate();
    const [specialities, setSpecialities] = useState([]);
    const {t} = useTranslation();
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 6,
    });

    const getPostSpeciality = (value) => {
        navigate('/post-list-by-spec', { state: { name: value, isDelete: false } });

    }
    const findAllSpecialities = async () => {
        const result = await specialityService.findAll(false, aToken)
        setSpecialities(result);
    }

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


    useEffect(() => {
        if (aToken) {
            findAllSpecialities()
        }
    }, [aToken]);
    return (
        <div>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg text-primary lg:text-2xl pl-5 pt-2 font-medium'>
                    {t("forum.ps.title")}
                </h1>
            </div>
            <motion.div
                className='w-[80vw] ml-5 mb-5 mr-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-5 pb-5'
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {opacity: 0},
                    visible: {opacity: 1, transition: {staggerChildren: 0.1}},
                }}
            >
                {
                    paginatedData?.map((item, index) => (
                    <motion.div
                        className='border border-indigo-200 rounded-xl overflow-hidden cursor-pointer group shadow-md'
                        key={item._id}
                        whileHover={{scale: 1.02, boxShadow: '0px 4px 10px rgba(0,0,0,0.2)'}}
                        variants={{
                            hidden: {opacity: 0, y: 20},
                            visible: {opacity: 1, y: 0},
                        }}
                        transition={{duration: 0.3}}
                    >

                        <div className='relative bg-indigo-50 group h-40 sm:h-48 lg:h-56'>
                            <img
                                className='w-full h-full object-cover transition-all duration-500 group-hover:opacity-80'
                                src={item.speciality_image}
                                alt='PostSpeciality'
                            />
                            <button
                                onClick={() => getPostSpeciality(item.name)}
                                className='absolute inset-0 flex items-center justify-center bg-primary/75 text-white text-lg font-semibold py-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                            >
                                {t("forum.ps.see")}
                            </button>
                        </div>


                        <div className='p-4  bg-white'>
                            <h3 className='text-primary text-center text-lg lg:text-2xl font-medium truncate'>{item.name}</h3>
                        </div>
                    </motion.div>
                ))}


            </motion.div>

            {
                paginatedData.length > 0 &&
                <div className="flex items-center justify-end gap-2 mt-4 mr-5">
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

        </div>

    );
};

export default PostSpeciality;
