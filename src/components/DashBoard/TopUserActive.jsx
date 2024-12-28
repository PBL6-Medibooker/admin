import React, {useContext, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {AdminContext} from "../../context/AdminContext";
import {useQuery} from "@tanstack/react-query";
import * as forumService from "../../service/ForumService";
import {assets} from "../../assets/assets";
import {forEach} from "react-bootstrap/ElementChildren";
import Loader from "../Loader";
import Error from "../Error";
import {motion, AnimatePresence} from "framer-motion";
import {Tooltip} from "@mui/material";


const TopUserActive = () => {

    const {t} = useTranslation()
    const {aToken} = useContext(AdminContext)

    const {data = [], isLoading, isError, refetch} = useQuery({
        queryKey: ["active"],
        queryFn: async () => {
            try {
                return await forumService.getTop5MostCommentUser(aToken)
            } catch (e) {
                console.log(e)
            }

        }
    })

    const colorSet = [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 206, 86)",
        "rgb(75, 192, 192)"
    ];

    useEffect(() => {
        if(aToken){
            refetch()
        }
    }, [aToken]);

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
        <motion.div
            initial={{opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, ease: "easeInOut"}}
        >

            <div className='bg-white'>
                <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
                    <div className='w-8 h-[25px]'>
                        <motion.img
                            className='w-full h-full object-cover'
                            src={assets.ranking}
                            alt="list icon"
                            initial={{scale: 0.9, rotate: -15}}
                            animate={{scale: 1, rotate: 0}}
                            transition={{duration: 0.3}}
                        />
                    </div>
                    <p className="font-semibold">{t("admin.dashboard.ranking")}</p>
                </div>

                <div className="flex w-full border h-[368px] flex-col">

                    <div className="flex flex-col flex-1 items-center justify-center">
                        <div className="flex flex-col items-center justify-center">
                            <div className="relative w-32 h-32">
                                <motion.img
                                    src={data?.data[0]?.userDetails?.profile_image ? data?.data[0]?.userDetails?.profile_image : assets.patients_icon}
                                    alt="top1"
                                    className='[background:linear-gradient(45deg,#e0e7ff,#d1d5db_50%,#e0e7ff)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.300/.48)_80%,_theme(colors.red.400)_86%,_theme(colors.blue.300)_90%,_theme(colors.blue.400)_94%,_theme(colors.slate.300/.48))_border-box]
                                    border-[5px] w-full h-full object-cover rounded-full border-transparent animate-border'
                                    initial={{scale: 0}}
                                    animate={{scale: 1}}
                                    transition={{duration: 0.6, type: "spring", stiffness: 100}}
                                />
                                <div
                                    className="absolute top-0 left-0 w-6 h-6 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full -translate-x-1/2 translate-y-1/2">
                                    1
                                </div>
                            </div>
                            <motion.p
                                className="mt-1 text-lg font-bold text-primary"
                                initial={{opacity: 0, y: -10}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: 0.2, duration: 0.4}}
                            >
                                {data?.data[0]?.userDetails?.username}
                            </motion.p>
                        </div>
                    </div>


                    <div className="flex flex-1 mr-4 ml-4 gap-14 items-center justify-start">
                        {data.data.slice(1, 5).map((item, index) => (
                            <motion.div
                                className="flex flex-col items-center justify-center"
                                key={index}
                                initial={{opacity: 0, x: -50}}
                                animate={{opacity: 1, x: 0}}
                                transition={{delay: 0.3 + index * 0.2, duration: 0.5}}
                            >
                                <div className="relative w-24 h-24">
                                    <motion.img
                                        src={item.userDetails?.profile_image}
                                        alt="top1"
                                        className="w-full h-full object-cover border-[2px] rounded-full border-transparent animate-border"
                                        style={{
                                            backgroundColor: colorSet[index],
                                        }}
                                        initial={{scale: 0}}
                                        animate={{scale: 1}}
                                        transition={{duration: 0.6, type: "spring", stiffness: 100}}
                                    />
                                    <div
                                        style={{
                                            backgroundColor: colorSet[index],
                                        }}
                                        className="absolute top-0 left-0 w-6 h-6 flex items-center justify-center bg-blue-500 text-white text-xs font-bold rounded-full -translate-x-1/2 translate-y-1/2">
                                        {index + 2}
                                    </div>
                                </div>
                                {/*<motion.p*/}
                                {/*    className="text-center mt-1 text-sm w-24 text-gray-800 truncate"*/}
                                {/*    initial={{opacity: 0, y: -10}}*/}
                                {/*    animate={{opacity: 1, y: 0}}*/}
                                {/*    transition={{delay: 0.5 + index * 0.2, duration: 0.4}}*/}
                                {/*>*/}
                                {/*    {item.userDetails?.username}*/}
                                {/*</motion.p>*/}

                                <div className="relative group">
                                    <Tooltip title={item.userDetails?.username} arrow>
                                        <motion.p
                                            className="text-center mt-1 text-sm w-24 text-gray-800 truncate cursor-default"
                                            style={{
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                            initial={{opacity: 0, y: -10}}
                                            animate={{opacity: 1, y: 0}}
                                            transition={{delay: 0.5 + index * 0.2, duration: 0.4}}
                                        >
                                            {item.userDetails?.username}
                                        </motion.p>
                                    </Tooltip>
                                    {/*<div*/}
                                    {/*    className="cursor-default absolute left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-700 text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"*/}
                                    {/*    style={{whiteSpace: "nowrap"}}*/}
                                    {/*>*/}
                                    {/*    {item.userDetails?.username}*/}
                                    {/*</div>*/}
                                </div>


                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>


            {/*<div*/}
            {/*    className='flex relative max-w-[300px] w-[300px] h-[400px] rounded-[20px] rounded-tl-[70px] overflow-hidden bg-amber-400'>*/}
            {/*    <div className='absolute inset-[10px] rounded-[10px] bg-gray-500  '>*/}
            {/*        <div*/}
            {/*            className='absolute w-[140px] h-[140px] bg-amber-400 rounded-br-[50%] transition-all duration-500 hover:w-full'>*/}
            {/*            <span*/}
            {/*                className=' absolute bottom-[-30px] left-0 w-[30px] h-[30px] rounded-tl-[30px] bg-transparent shadow-custom4'></span>*/}

            {/*            <span*/}
            {/*                className='absolute right-[-30px] top-0 w-[30px] h-[30px] rounded-tl-[30px] bg-transparent shadow-custom4'></span>*/}
            {/*            <div*/}
            {/*                className='flex justify-center items-center absolute inset-[10px] bg-gray-500 rounded-[50%]  rounded-tr-[10px]  rounded-bl-[10px] '>*/}

            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className=''>*/}
            {/*            /!*content*!/*/}
            {/*        </div>*/}

            {/*    </div>*/}
            {/*</div>*/}


            {/*<div className='flex flex-col justify-between relative w-[320px] h-[400px] gap-2.5'>*/}
            {/*    <div className='relative w-full h-[240px] bg-amber-400 rounded-[15px] '>*/}
            {/*        <span className='absolute bottom-0 left-[50%] w-[20px] h-[20px]*/}
            {/*        rounded-[50%] bg-transparent shadow-custom3'></span>*/}

            {/*        <span className='absolute bottom-[70px] left-0 w-[20px] h-[20px]*/}
            {/*        rounded-[50%] bg-transparent shadow-custom3'></span>*/}

            {/*    </div>*/}
            {/*    <div className='relative w-full h-[150px] rounded-[15px] bg-green-600 rounded-tl-none'>*/}
            {/*        <span className='absolute top-[-80px] h-[80px] bg-green-600 w-[50%] border-t-[10px] border-[#F8F9FD] border-r-[10px] rounded-tr-[25px]*/}
            {/*       '>*/}
            {/*            <span*/}
            {/*                className='absolute w-[25px] h-[25px] rounded-[50%] bg-transparent shadow-custom '>*/}
            {/*            </span>*/}
            {/*            <span*/}
            {/*                className='absolute bottom-0 right-[-25px] w-[25px] h-[25px] bg-transparent rounded-[50%] shadow-custom2 '>*/}
            {/*            </span>*/}
            {/*        </span>*/}
            {/*    </div>*/}

            {/*</div>*/}

        </motion.div>
    );
};

export default TopUserActive;
