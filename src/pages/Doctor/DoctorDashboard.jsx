import React, {useContext, useEffect, useState} from 'react';
import {motion} from "framer-motion";
import StatCard from "../../components/StatCard";
import {CalendarDays, Newspaper, MessageSquareText} from "lucide-react";
import * as appointmentService from "../../service/AppointmentService";
import {DoctorContext} from "../../context/DoctorContext";
import {useTranslation} from "react-i18next";
import Error from "../../components/Error";
import * as articleService from "../../service/ArticleService";
import {useQuery} from "@tanstack/react-query";
import * as forumService from "../../service/ForumService";
import StatDoctor from "../../components/Chart/StatDoctor";

const DoctorDashboard = () => {
    const {dToken, docId, getDoctorData, doctorData, docEmail} = useContext(DoctorContext);
    const [appointments, setAppointments] = useState(0);
    const [articles, setArticles] = useState(0);
    const [posts, setPosts] = useState(0);
    const {t} = useTranslation();

    const fetchDoctorArticles = async () => {
        const email = doctorData?.email || (await getDoctorData())?.email;
        if (!email) {
            throw new Error("Doctor email not found");
        }
        const articles = await articleService.getAllArticleByDoctor(email, dToken);
        return articles.filter((article) => article.is_deleted === false);
    };

    const {data: dArticles = [], isLoading} = useQuery({
        queryKey: ["deletedArticles", doctorData?.email],
        queryFn: fetchDoctorArticles,
        enabled: !!dToken,
    });


    const getDoctorAppointments = async () => {
        try {
            const data = await appointmentService.getAppointmentByDoctor(false, docId, dToken)
            if (data) {
                setAppointments(data.length)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const fetchPostsByEmail = async () => {
        try {
            const response = await forumService.getAllPostByEmail(docEmail, dToken);
            return response.filter(post => post.is_deleted === false);
        } catch (error) {
            console.error("Error fetching posts:", error);
            throw new Error("Failed to fetch posts");
        }
    };


    const {data: postList = [], isLoading: isPostLoading} = useQuery({
        queryKey: ["postsByEmail", docEmail],
        queryFn: fetchPostsByEmail,
    });


    useEffect(() => {
        if (dToken) {
            getDoctorData()
            getDoctorAppointments()
        }
    }, [dToken, docId]);

    useEffect(() => {
        if (!isLoading && !isPostLoading) {
            setArticles(dArticles.length)
            setPosts(postList.length)
        }
    }, [dArticles, isLoading, isPostLoading]);

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8'
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 1}}
                >
                    <StatCard name={t("doctor.dashboard.tap")} to={'/doctor-appointments'} icon={CalendarDays}
                              value={appointments}
                              color='#6366F1'/>
                    <StatCard name={t("doctor.dashboard.ta")} to={'/doctor-article'} icon={Newspaper} value={articles}
                              color='#FACC15'/>

                    <StatCard name={t("doctor.dashboard.tp")} to={'/doctor-post'} icon={MessageSquareText} value={posts}
                              color='#EF4444'/>
                </motion.div>

                {/* CHARTS */}

                <div className='grid grid-cols-1 lg:grid-cols-1'>

                    <StatDoctor/>
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;
