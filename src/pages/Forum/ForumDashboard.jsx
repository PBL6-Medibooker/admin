import React, {useContext, useEffect, useState} from 'react';
import {AdminContext} from "../../context/AdminContext";
import * as forumService from "../../service/ForumService";
import {motion} from "framer-motion";
import StatCard from "../../components/StatCard";
import {EthernetPort} from "lucide-react";
import {useTranslation} from "react-i18next";
import PostMostComment from "../../components/Chart/PostMostComment";
import PostByMonth from "../../components/Chart/PostByMonth";
import Loader from "../../components/Loader";
import {useQuery} from "@tanstack/react-query";
import * as articleService from "../../service/ArticleService";

const ForumDashboard = () => {

    const {aToken} = useContext(AdminContext);
    const {t} = useTranslation()


    const {data: posts = [], isLoading, refetch} = useQuery({
        queryKey: ["post"],
        queryFn: async () => {
            try {
                const result = await forumService.findAll(aToken);
                return await result.filter(post => post.is_deleted === false)
            } catch (e) {
                console.log(e)
            }
        }
    });

    useEffect(() => {
        if (aToken) {
            refetch()
        }
    }, [aToken])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center bg-opacity-75 fixed top-[52%] left-[52%] z-50">
                <Loader />
            </div>
        )
    }
    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>

                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 1}}
                >
                    <StatCard name={t("forum.dashboard.title")} to={'/spec-forum'} icon={EthernetPort} value={posts.length}
                              color='#6366F1'/>
                </motion.div>

                {/* CHARTS */}

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    <PostByMonth />
                    <PostMostComment />
                </div>
            </main>
        </div>
    );
};

export default ForumDashboard;
