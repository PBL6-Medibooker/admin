import React, {useContext, useEffect, useState} from 'react';
import { useQuery } from '@tanstack/react-query';
import { DoctorContext } from '../../context/DoctorContext';
import Loader from '../../components/Loader';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import StatCard from '../../components/StatCard';
import { Newspaper, MessageSquareX } from 'lucide-react';
import * as articleService from '../../service/ArticleService';
import Error from '../../components/Error';
import * as forumService from "../../service/ForumService";

const DoctorTrash = () => {
    const { dToken, doctorData, getDoctorData, docEmail} = useContext(DoctorContext);
    const [total, setTotal] = useState(0);
    const [totalPost, setTotalPost] = useState(0);
    const { t } = useTranslation();

    const fetchDoctorArticles = async () => {
        const email = doctorData?.email || (await getDoctorData())?.email;
        if (!email) {
            throw new Error('Doctor email not found');
        }
        const articles = await articleService.getAllArticleByDoctor(email, dToken);
        return articles.filter((article) => article.is_deleted === true);
    };

    const { data: dArticles = [], isLoading, isError } = useQuery({
        queryKey: ['deletedArticles', doctorData?.email],
        queryFn: fetchDoctorArticles,
        enabled: !!dToken,
        onSuccess: (data) => {
            setTotal(data.length);
        },
    });

    const fetchPostsByEmail = async () => {
        try {
            const response = await forumService.getAllPostByEmail(docEmail, dToken);
            return response.filter(post => post.is_deleted === true);
        } catch (error) {
            console.error("Error fetching posts:", error);
            throw new Error("Failed to fetch posts");
        }
    };

    const { data: postList = [], refetch } = useQuery({
        queryKey: ["postsByEmail", docEmail],
        queryFn: fetchPostsByEmail,
    });

    //
    // const fetchData = async () =>{
    //     const result =  fetchData()
    //     setData(result)
    // }

    useEffect(() => {
        if(dToken){
            // fetchDoctorArticles()
            setTotal(dArticles.length)
            setTotalPost(postList.length)
        }
    }, [dToken, dArticles]);

    if (isLoading) {
        return (
            <div className='flex justify-center items-center w-full h-screen bg-opacity-75 fixed top-0 left-0 z-50'>
                <Loader />
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <Error />
            </div>
        );
    }

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard
                        name={t('doctor.dashboard.da')}
                        to={'/doctor-atrash'}
                        icon={Newspaper}
                        value={total}
                        color='red'
                    />

                    <StatCard
                        name={t('doctor.dashboard.dp')}
                        to={'/doctor-ptrash'}
                        icon={MessageSquareX}
                        value={totalPost}
                        color='red'
                    />
                </motion.div>
            </main>
        </div>
    );
};

export default DoctorTrash;
