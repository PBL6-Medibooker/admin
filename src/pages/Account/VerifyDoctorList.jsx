import React, {useContext, useEffect, useState} from 'react';
import {AnimatePresence, motion} from "framer-motion";
import {FaRegTrashAlt} from "react-icons/fa";
import Modal from "../../components/Modal/Modal";
import {
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel, getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {useLocation, useNavigate} from "react-router-dom";
import {AdminContext} from "../../context/AdminContext";
import {assets} from "../../assets/assets";
import * as accountService from "../../service/AccountService";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import SearchInput from "../../components/SearchInput";
import {Tooltip} from "@mui/material";
import {ArchiveRestore} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import Error from "../../components/Error";

const VerifyDoctorList = () => {

    const columnHelper = createColumnHelper();
    const [selectedAccountIds, setSelectedAccountIds] = useState([]);
    const navigate = useNavigate();
    const [globalFilter, setGlobalFilter] = useState("");
    const [open, setOpen] = useState(false);
    const {aToken, isLoading, specialities, refetchSpec, verifiedDoctor, isVerifyDoctorLoading, rVerifyDoctorData,
     regionList, refetchRegionList, refetchAdminDetails, adminDetails, readOnly, writeOnly, fullAccess} = useContext(AdminContext);
    const {t} = useTranslation();
    const [specialityFilterValue, setSpecialityFilterValue] = useState("");
    const [regionFilterValue, setRegionFilterValue] = useState("");
    const [filteredDoctors, setFilteredDoctors] = useState([]);


    const columns = [
        columnHelper.accessor("_id", {id: "_id", cell: (info) => <span>{info.row.index + 1}</span>, header: "S.No"}),
        columnHelper.accessor("profile_image", {
            cell: (info) => <img className="rounded-full w-10 h-10 object-cover"
                                 src={info?.getValue() || assets.user_icon} alt="..."/>,
            header: t("account.verified.profile")
        }),
        columnHelper.accessor("username", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: t("account.verified.username")
        }),
        columnHelper.accessor("role", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: t("account.verified.role")
        }),
        columnHelper.accessor("email", {cell: (info) => <span>{info?.getValue()}</span>, header: "Email"}),
        columnHelper.accessor("phone", {
            cell: (info) => <span>{info?.getValue()}</span>,
            header: t("account.verified.phone")
        })
    ];
    const table = useReactTable({
        data: filteredDoctors || [],
        columns,
        state: {globalFilter},
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {pagination: {pageSize: 8}}
    });

    const toggleAccountSelection = (id) => {
        setSelectedAccountIds((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((accountId) => accountId !== id) : [...prevSelected, id]
        );
    };

    // const {data: verifiedDoctor = [], isLoading: isVerifyDoctorLoading, refetch} = useQuery({
    //     queryKey: ["verifyDoc"],
    //     queryFn: async () => {
    //         try {
    //             return  await accountService.findAll(false, false, true, aToken);
    //         } catch (e) {
    //             console.error(e);
    //             throw new Error("Failed to load");
    //         }
    //     },
    //     // refetchOnWindowFocus: true, // Ensures data refetch on focus
    //     // staleTime: 0,
    //     // keepPreviousData: true,
    // });

    const getAccountList = async () => {
        try {
            rVerifyDoctorData()
            setFilteredDoctors(verifiedDoctor)
        } catch (e) {
            console.log(e.error);
        }
    };


    const handleSpecialityFilterChange = (event) => {
        const selectedValue = event.target.value;
        setSpecialityFilterValue(selectedValue);
        let filtered = verifiedDoctor;

        if (selectedValue) {
            filtered = filtered.filter((doctor) =>
                doctor.speciality_id?.name.toLowerCase() === selectedValue.toLowerCase()
            );
        }

        if (regionFilterValue) {
            filtered = filtered.filter((doctor) =>
                doctor.region_id?.name.toLowerCase() === regionFilterValue.toLowerCase()
            );
        }

        setFilteredDoctors(filtered);
    };

    const handleRegionFilterChange = (event) => {
        const selectedValue = event.target.value;
        setRegionFilterValue(selectedValue);

        let filtered = verifiedDoctor;

        if (specialityFilterValue) {
            filtered = filtered.filter((doctor) =>
                doctor.speciality_id?.name.toLowerCase() === specialityFilterValue.toLowerCase()
            );
        }

        if (selectedValue) {
            filtered = filtered.filter((doctor) =>
                doctor.region_id?.name.toLowerCase() === selectedValue.toLowerCase()
            );
        }

        setFilteredDoctors(filtered);
    };

    const openDeleteModal = () => {
        if (selectedAccountIds?.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: t("account.accountList.deleteNoti"),
            });
        } else {
            setOpen(true);
        }
    };

    const softDeleteAccounts = async () => {
        if (selectedAccountIds?.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: t("account.accountList.deleteNoti"),
                backdrop: false
            });
            return;
        }
        try {
            await accountService.deleteSoftAccount(selectedAccountIds, aToken);
            await getAccountList();
            // toast.success(response.message);
            setSelectedAccountIds([]);
            setOpen(false);
            await Swal.fire({
                position: "top-end",
                title: t("account.accountList.successDelete"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false

            });

        } catch (error) {
            console.error(error.message);
        }
    };

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
            getAccountList()
            refetchSpec()
            refetchRegionList()
            refetchAdminDetails()
        }
    }, [aToken, filteredDoctors,adminDetails]);



    if (isLoading || isVerifyDoctorLoading) {
        return (
            <div className="flex justify-center items-center bg-opacity-75 fixed top-[52%] left-[52%] z-50">
                <Loader />
            </div>
        )
    }

    return (
        <motion.div className="mr-5 mt-5 mb-5 pl-5 max-h-[90vh] w-[90vw] overflow-y-scroll" initial={{opacity: 0}}
                    animate={{opacity: 1}} exit={{opacity: 0}}>
            <div className="flex justify-between items-center">
                <h1 className="text-lg text-primary lg:text-2xl font-bold">
                    {t("account.verified.title")}
                </h1>
                <div className="flex gap-3 mr-5">

                    {
                        (readOnly && !writeOnly && !fullAccess) && (
                            <Tooltip title={t("common.access.permission")} arrow>

                                <motion.button
                                    onClick={openDeleteModal}
                                    className="flex items-center gap-2 px-8 py-3 mt-4 rounded-full text-white bg-red-600 shadow-md cursor-not-allowed"
                                    {...hoverSettings}
                                    disabled={readOnly && !fullAccess && !writeOnly}
                                >
                                    <FaRegTrashAlt/>
                                    {t("account.verified.delete")}
                                </motion.button>
                            </Tooltip>
                        )
                    }


                    {
                        (fullAccess || writeOnly) && (
                            <motion.button
                                onClick={openDeleteModal}
                                className="flex items-center gap-2 px-8 py-3 mt-4 rounded-full text-white bg-red-600 shadow-md"
                                whileHover={{
                                    scale: 1.1,
                                    boxShadow: "0px 8px 20px rgba(255, 82, 82, 0.6)",
                                }}
                                whileTap={{scale: 0.95}}
                                transition={{type: "spring", stiffness: 300}}
                            >
                                <FaRegTrashAlt/>
                                {t("account.verified.delete")}
                            </motion.button>
                        )
                    }

                    <motion.button
                        onClick={() => navigate('/restore-account', {state: {isVerify: true}})}
                        className="flex items-center gap-2 px-8 py-3 mt-4 rounded-full text-white bg-gray-500 shadow-md"
                        whileHover={{
                            scale: 1.1,
                            boxShadow: "0px 8px 20px rgba(128, 128, 128, 0.5)",
                        }}
                        whileTap={{scale: 0.95}}
                        transition={{type: "spring", stiffness: 300}}
                    >
                        <FaRegTrashAlt/>
                        {t("account.verified.restore")}
                    </motion.button>


                </div>
            </div>


            <div className="flex gap-4 mt-4 mb-4">

                <SearchInput
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    t={t("account.verified.search")}
                    disableHover={false}
                />

                    <motion.div>
                        <select
                            className="w-[20vw] p-4 border border-gray-300 rounded"
                            value={specialityFilterValue}
                            onChange={handleSpecialityFilterChange}
                        >
                            <option value="">{t("speciality.list.filterAll")}</option>
                            {specialities?.map((item) => (
                                <option key={item._id} value={item.name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </motion.div>

                    <motion.div>
                        <select
                            className="w-[20vw] p-4 border border-gray-300 rounded"
                            value={regionFilterValue}
                            onChange={handleRegionFilterChange}
                        >
                            <option value="">{t("speciality.list.filterAllByRegion")}</option>
                            {regionList?.map((item) => (
                                <option key={item._id} value={item.name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                </motion.div>

            </div>


            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-5"
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
                {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => {
                        const item = row.original;
                        return (
                            <motion.div
                                key={item._id}
                                className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group"
                                whileHover={{scale: 1.05, boxShadow: "0px 4px 10px rgba(0,0,0,0.2)"}}
                                variants={{
                                    hidden: {opacity: 0, y: 20},
                                    visible: {opacity: 1, y: 0},
                                }}
                                transition={{duration: 0.3, ease: "easeOut"}}
                                initial={{opacity: 0, scale: 0.9, y: 30}}
                                animate={{opacity: 1, scale: 1, y: 0}}
                            >
                                <div
                                    className="relative w-56 h-56 bg-indigo-50 group rounded-xl overflow-hidden cursor-pointer">
                                    <img
                                        className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-80"
                                        src={item.profile_image || assets.user_icon}
                                        alt="Profile"
                                    />

                                    <button
                                        onClick={() => navigate(`/update-doc-account/${item._id}`)}
                                        className="absolute inset-0 flex items-center justify-center bg-primary/75 text-white text-lg font-semibold py-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    >
                                        {t("speciality.list.edit")}
                                    </button>

                                </div>
                                <div className="p-4">

                                    {
                                        (writeOnly || fullAccess) &&
                                        <div className="flex justify-end">
                                            <input
                                                type="checkbox"
                                                checked={selectedAccountIds.includes(item._id)}
                                                onChange={() => toggleAccountSelection(item._id)}
                                            />
                                        </div>
                                    }
                                    <p className="text-neutral-800 text-lg font-bold">{item.username}</p>
                                    <p className="text-zinc-600 text-sm">{item.speciality_id?.name ? item.speciality_id?.name : <span className='text-red-600'>
                                        Vui lòng cập nhật chuyên khoa
                                    </span>}</p>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <motion.div
                        className="max-h-[90vh] w-[80vw] flex flex-col items-center justify-center"
                        initial={{opacity: 0, y: 50}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, ease: "easeOut"}}
                    >
                        {/*                <motion.img*/}
                        {/*  className="w-[50vw]"*/}
                        {/*  src={assets.no_data}*/}
                        {/*  alt="No records"*/}
                        {/*  initial={{ opacity: 0, scale: 0.8 }}*/}
                        {/*  animate={{ opacity: 1, scale: 1 }}*/}
                        {/*  transition={{ duration: 0.5, delay: 0.3 }}*/}
                        {/*/> */}

                        <motion.p
                            className="text-lg text-gray-500 font-bold mt-4"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.5, delay: 0.5}}
                        >
                            {t("admin.dashboard.noData")}
                        </motion.p>
                    </motion.div>
                )}
            </motion.div>


            <AnimatePresence>
                {open && (
                    <Modal open={open} onClose={() => setOpen(false)}>
                        <motion.div className="text-center w-72" initial={{scale: 0.8, opacity: 0}}
                                    animate={{scale: 1, opacity: 1}} exit={{scale: 0.8, opacity: 0}}>
                            <FaRegTrashAlt size={56} className="mx-auto text-red-500"/>
                            <div className="mx-auto my-4 w-60">
                                <h3 className="text-lg font-black text-gray-800">{t("account.accountList.confirmDelete")}</h3>
                                <p className="text-sm text-gray-600">{t("account.accountList.pCD")}</p>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button onClick={softDeleteAccounts}
                                        className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 py-2 rounded-md transition duration-150">
                                    {t("account.accountList.confirm")}
                                </button>
                                <button onClick={() => setOpen(false)}
                                        className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150">
                                    {t("account.accountList.cancel")}
                                </button>
                            </div>
                        </motion.div>
                    </Modal>
                )}
            </AnimatePresence>


            {/* Pagination */}
            {
                (Array.isArray(verifiedDoctor) && filteredDoctors.length > 0)
                && <div className="flex items-center justify-end gap-2 mt-4">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-2 py-1 border border-gray-400 rounded-md"
                >
                    {"<"}
                </button>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-2 py-1 border border-gray-400 rounded-md"
                >
                    {">"}
                </button>

                <div className="flex items-center gap-1">
                    <span>{t("account.verified.page")}</span>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </strong>
                </div>

                <div className="flex items-center gap-1">
                    | {t("account.verified.goToPage")}:
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }}
                        className="w-16 px-2 py-1 border border-gray-400 rounded-md bg-transparent"
                    />
                </div>
            </div>
                // <Pagination table={table} t={t}/>
            }


            {/*  <motion.div*/}
            {/*      className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-5 ml-5 pb-5"*/}
            {/*      initial="hidden"*/}
            {/*      animate="visible"*/}
            {/*      variants={{*/}
            {/*          hidden: {opacity: 0},*/}
            {/*          visible: {*/}
            {/*              opacity: 1,*/}
            {/*              transition: {*/}
            {/*                  staggerChildren: 0.15,*/}
            {/*                  duration: 0.6,*/}
            {/*                  ease: "easeInOut",*/}
            {/*              },*/}
            {/*          },*/}
            {/*      }}*/}
            {/*  >*/}
            {/*      {verifiedDoctor.length > 0 ? (*/}
            {/*          verifiedDoctor.map((item) => (*/}
            {/*              <div*/}
            {/*                  key={item._id}*/}
            {/*                  className="flex flex-col relative w-[250px] h-[350px] gap-2.5"*/}
            {/*              >*/}
            {/*                  /!* Image Container *!/*/}
            {/*                  <div*/}
            {/*                      className="relative w-full h-[240px] rounded-[15px] bg-indigo-50 cursor-pointer*/}
            {/*            transition-all duration-500 hover:opacity-80"*/}
            {/*                  >*/}
            {/*<span*/}
            {/*    className="absolute bottom-0 left-[50%] w-[20px] h-[20px]*/}
            {/*            rounded-full bg-transparent shadow-custom6"*/}
            {/*></span>*/}
            {/*                      <span*/}
            {/*                          className="absolute bottom-[70px] left-0 w-[20px] h-[20px]*/}
            {/*            rounded-full bg-transparent shadow-custom6"*/}
            {/*                      ></span>*/}
            {/*                      <img*/}
            {/*                          className="w-full h-full object-cover rounded-[15px]"*/}
            {/*                          src={item.profile_image}*/}
            {/*                          alt={`${item.username}'s profile`}*/}
            {/*                      />*/}
            {/*                  </div>*/}

            {/*                  /!* Info Container *!/*/}
            {/*                  <div*/}
            {/*                      className="relative w-full h-[150px] rounded-[15px] bg-white rounded-tl-none"*/}
            {/*                  >*/}
            {/*<span*/}
            {/*    className="absolute top-[-80px] h-[80px] bg-white w-[50%]*/}
            {/*            border-t-[10px] border-[#F8F9FD] border-r-[10px] rounded-tr-[25px]"*/}
            {/*>*/}
            {/*  <span*/}
            {/*      className="absolute w-[25px] h-[25px] rounded-full bg-transparent shadow-custom5"*/}
            {/*  ></span>*/}
            {/*  <span*/}
            {/*      className="absolute bottom-0 right-[-25px] w-[25px] h-[25px]*/}
            {/*                bg-transparent rounded-full shadow-custom2"*/}
            {/*  ></span>*/}
            {/*</span>*/}

            {/*                      /!* Doctor Details *!/*/}
            {/*                      <div className="p-4">*/}
            {/*                          <p className="text-lg font-semibold text-gray-800">*/}
            {/*                              {item.username}*/}
            {/*                          </p>*/}
            {/*                          <p className="text-sm text-gray-600">*/}
            {/*                              {item.speciality_id.name}*/}
            {/*                          </p>*/}
            {/*                      </div>*/}
            {/*                  </div>*/}
            {/*              </div>*/}
            {/*          ))*/}
            {/*      ) : (*/}
            {/*          <div className="flex justify-center items-center w-full h-[90vh]">*/}
            {/*              <img*/}
            {/*                  className="max-w-[50vw]"*/}
            {/*                  src={assets.no_data}*/}
            {/*                  alt="No records available"*/}
            {/*              />*/}
            {/*          </div>*/}
            {/*      )}*/}
            {/*  </motion.div>*/}


            {/*<motion.table className="border border-gray-700 w-full mt-5 text-left text-white border-collapse"*/}
            {/*              initial={{opacity: 0}} animate={{opacity: 1}}>*/}
            {/*    <thead className="bg-gray-600">*/}
            {/*    {table.getHeaderGroups().map((headerGroup) => (*/}
            {/*        <tr key={headerGroup.id}>*/}
            {/*            <th className="p-2">*/}
            {/*                <input*/}
            {/*                    type="checkbox"*/}
            {/*                    checked={table.getRowModel().rows.length > 0 && table.getRowModel().rows.every((row) => selectedAccountIds.includes(row.original._id))}*/}
            {/*                    onChange={(e) =>*/}
            {/*                        setSelectedAccountIds(*/}
            {/*                            e.target.checked ? table.getRowModel().rows.map((row) => row.original._id) : []*/}
            {/*                        )*/}
            {/*                    }*/}
            {/*                />*/}
            {/*            </th>*/}
            {/*            {headerGroup.headers.map((header) => (*/}
            {/*                <th key={header.id}*/}
            {/*                    className="capitalize p-2">{flexRender(header.column.columnDef.header, header.getContext())}</th>*/}
            {/*            ))}*/}
            {/*        </tr>*/}
            {/*    ))}*/}
            {/*    </thead>*/}
            {/*    <tbody>*/}
            {/*    <AnimatePresence>*/}
            {/*        {table.getRowModel().rows.length ? (*/}
            {/*            table.getRowModel().rows.map((row, i) => (*/}
            {/*                <motion.tr*/}
            {/*                    key={row.id}*/}
            {/*                    className={i % 2 === 0 ? 'bg-cyan-600' : 'bg-cyan-900'}*/}
            {/*                    initial={{y: 10, opacity: 0}}*/}
            {/*                    animate={{y: 0, opacity: 1}}*/}
            {/*                    exit={{y: 10, opacity: 0}}*/}
            {/*                >*/}
            {/*                    <td className="p-2">*/}
            {/*                        <input type="checkbox" checked={selectedAccountIds.includes(row.original._id)}*/}
            {/*                               onChange={() => toggleAccountSelection(row.original._id)}/>*/}
            {/*                    </td>*/}
            {/*                    {row.getVisibleCells().map((cell) => (*/}
            {/*                        <td key={cell.id} className="p-2"*/}
            {/*                            onClick={() => navigate(`/update-doc-account/${row.original._id}`)}>*/}
            {/*                            {flexRender(cell.column.columnDef.cell, cell.getContext())}*/}
            {/*                        </td>*/}
            {/*                    ))}*/}
            {/*                </motion.tr>*/}
            {/*            ))*/}
            {/*        ) : (*/}
            {/*            <motion.tr className="text-center h-32 text-blue-400" initial={{opacity: 0}}*/}
            {/*                       animate={{opacity: 1}}>*/}
            {/*                <td colSpan={12}>No Doctor Account Found!</td>*/}
            {/*            </motion.tr>*/}
            {/*        )}*/}
            {/*    </AnimatePresence>*/}
            {/*    </tbody>*/}


            {/*</motion.table>*/}
        </motion.div>


    );
};

export default VerifyDoctorList;
