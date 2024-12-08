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
        navigate('/post-list-by-spec', {state: {name: value, isDelete: false}});

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
                className='w-[80vw] ml-5 mb-5 mr-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 pt-5 pb-5'
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {opacity: 0},
                    visible: {opacity: 1, transition: {staggerChildren: 0.1}},
                }}
            >
                {paginatedData?.map((item, index) => (
                    <motion.div
                        className="border border-gray-200 bg-gradient-to-b from-[#00A6A9] to-[#0B5E87] rounded-xl overflow-hidden cursor-pointer group shadow-md hover:shadow-lg transition-all duration-300"
                        key={item._id}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
                        }}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Image Section */}
                        <div className="flex justify-center items-center h-full sm:h-48 w-full bg-gradient-to-b from-[#004d56] to-[#012f42] p-4">
                            <div className="relative group w-40 h-40">
                                <img
                                    className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:opacity-90"
                                    src={item.speciality_image}
                                    alt={item.name}
                                />
                                <button
                                    onClick={() => getPostSpeciality(item.name)}
                                    className="group-hover:scale-110 absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white text-lg font-semibold py-2 px-4 opacity-0 group-hover:opacity-90 transition-opacity duration-300"
                                >
                                    {t("forum.ps.see")}
                                </button>
                            </div>
                        </div>

                        <div className="p-4 bg-white text-center">
                            <h3 className="text-gray-950 text-lg lg:text-xl font-medium truncate">
                                {item.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 truncate">
                                {item.description}
                            </p>
                        </div>

                        <div className="w-full h-1 bg-gradient-to-r from-[#00A6A9] to-[#0B5E87]"></div>
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
