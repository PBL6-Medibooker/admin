import React, {useContext, useEffect, useState} from 'react';
import {AdminContext} from "../../context/AdminContext";
import * as articleService from "../../service/ArticleService";
import {motion} from "framer-motion";
import StatCard from "../../components/StatCard";
import {Newspaper} from "lucide-react";
import ArticleByMonth from "../../components/Chart/ArticleByMonth";
import ArticleBySpeciality from "../../components/Chart/ArticleBySpeciality";
import {useTranslation} from "react-i18next";

const ArticleDashboard = () => {
    const {aToken} = useContext(AdminContext);
    const [articles, setArticles] = useState([])
    const [totalArticles, setTotalArticles] = useState(0)
    const {t}= useTranslation()


    const getAllArticle = async () => {
        try {
            const data = await articleService.findAll(true, aToken)
            if(data){
                setArticles(data);
                setTotalArticles(data.length);
            }

        } catch (e){
            console.log(e)
        }
    }

    useEffect(()=>{
        if(aToken){
            getAllArticle();
        }
    },[aToken])
    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* STATS */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 1}}
                >
                    <StatCard name={t("article.dashboard.title")} to={'/article'} icon={Newspaper} value={totalArticles} color='#6366F1'/>
                </motion.div>

                {/* CHARTS */}

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    <ArticleByMonth />
                    <ArticleBySpeciality />
                </div>
            </main>
        </div>
    );
};

export default ArticleDashboard;
