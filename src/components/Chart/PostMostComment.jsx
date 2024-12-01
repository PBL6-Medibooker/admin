import React, {useContext} from 'react';
import {motion} from "framer-motion";
import {Doughnut} from "react-chartjs-2";
import {useTranslation} from "react-i18next";
import {AdminContext} from "../../context/AdminContext";
import {useQuery} from "@tanstack/react-query";
import * as forumService from "../../service/ForumService";
import Loader from "../Loader";

const PostMostComment = () => {

    const {t} = useTranslation();
    const {aToken} = useContext(AdminContext)


    const {data = [], isLoading} = useQuery({
        queryKey: ["top5mostcomments"],
        queryFn: async () => {
            try {
                const data = await forumService.getTop5MostCommentPost(aToken);
                return data;
            } catch (e) {
                console.error(e);
                throw new Error("Failed to load");
            }
        }
    });

    const chartData = {
        labels: data?.data?.map(name => name.post_title),
        datasets: [{
            label: t("doctor.post.cc"),
            data: data?.data?.map(value => value.commentCount),
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
            ],

            hoverOffset: 5,
        }],
    };


    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                enabled: true,
            },
            legend: {
                position: 'top',
            },
        },
    };


    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-screen bg-opacity-75 fixed top-0 left-0 z-50">
                <Loader/>
            </div>
        );
    }


    return (
        <div>
            <motion.div
                className="bg-white shadow-lg rounded-xl p-6 border border-gray-300 mb-8"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 1}}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {t("doctor.post.ctitle")}
                    </h2>
                </div>

                <div className="flex justify-center items-center w-full h-80">

                    <Doughnut data={chartData} options={options}/>

                </div>
            </motion.div>
        </div>
    );
};

export default PostMostComment;
