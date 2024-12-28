import React, {useContext, useEffect, useState} from 'react';
import {AdminContext} from "../../context/AdminContext";
import * as articleService from "../../service/ArticleService";
import {motion} from "framer-motion";
import StatCard from "../../components/StatCard";
import {Newspaper} from "lucide-react";
import ArticleByMonth from "../../components/Chart/ArticleByMonth";
import ArticleBySpeciality from "../../components/Chart/ArticleBySpeciality";
import {useTranslation} from "react-i18next";
import Loader from "../../components/Loader";
import {useQuery} from "@tanstack/react-query";

const ArticleDashboard = () => {
    const {aToken} = useContext(AdminContext);
    const {t} = useTranslation();

    const {data: articles = [], isLoading, refetch} = useQuery({
        queryKey: ["ar"],
        queryFn: async () => {
            try {
                return await articleService.findAll(true, aToken)
            } catch (e) {
                console.log(e)
            }
        }
    });

    const statsContainerVariants = {
        hidden: {opacity: 0, y: 50},
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.2,
                duration: 0.6
            },
        },
    };

    const statsItemVariants = {
        hidden: {opacity: 0, y: 20},
        visible: {opacity: 1, y: 0},
    };

    const chartsVariants = {
        hidden: {opacity: 0, scale: 0.9},
        visible: {opacity: 1, scale: 1, transition: {duration: 0.8}},
    };

    useEffect(() => {
        if (aToken) {
            refetch()
        }
    }, [aToken]);

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
                {/* STATS */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial="hidden"
                    animate="visible"
                    variants={statsContainerVariants}
                >
                    <motion.div variants={statsItemVariants}>
                        <StatCard
                            name={t("article.dashboard.title")}
                            to={'/article'}
                            icon={Newspaper}
                            value={articles.length}
                            color='#6366F1'
                        />
                    </motion.div>
                </motion.div>

                {/* CHARTS */}
                <motion.div
                    className='grid grid-cols-1 lg:grid-cols-2 gap-8'
                    initial="hidden"
                    animate="visible"
                    variants={chartsVariants}
                >
                    <motion.div variants={chartsVariants}>
                        <ArticleByMonth />
                    </motion.div>
                    <motion.div variants={chartsVariants}>
                        <ArticleBySpeciality />
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
};

export default ArticleDashboard;
