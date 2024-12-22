import React, {useContext, useEffect, useState} from 'react';
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { AdminContext } from "../../context/AdminContext";
import { useQuery } from "@tanstack/react-query";
import * as forumService from "../../service/ForumService";
import Loader from "../Loader";
import { CategoryScale, LinearScale, Chart as ChartJS, LineElement, PointElement, Tooltip, Legend, Title } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, Title);

const PostByMonth = () => {
    const { t } = useTranslation();
    const { aToken } = useContext(AdminContext);
    const [yearOptions] = useState(['2024', '2025']);
    const [selectedYear, setSelectedYear] = useState('2024');

    const { data = [], isLoading } = useQuery({
        queryKey: ["postByMonth", selectedYear],
        queryFn: async () => {
            try {
                return await forumService.getPostByMonth(selectedYear, aToken);
            } catch (e) {
                console.error(e);
                throw new Error("Failed to load");
            }
        },
        enabled: !!selectedYear,
    });

    const chartData = {
        labels: data?.data?.map((item) => item.month),
        datasets: [{
            label: t("forum.dashboard.posts"),
            data: data?.data?.map((item) => item.postCount),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            pointBackgroundColor: 'rgb(75, 192, 192)',
            pointStyle: 'star',
            pointRadius: 6,
            pointHoverRadius: 15,
            tension: 0.4,
        }],
    };

    const options = {
        responsive: true,
        plugins: {
            chartAreaBorder: {
                borderColor: 'red',
                borderWidth: 2,
                borderDash: [5, 5],
                borderDashOffset: 2,
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        return `${tooltipItem.raw} ${t("forum.dashboard.posts")}`;
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: t("forum.dashboard.months"),
                },

            },
            y: {
                type: 'linear',
                title: {
                    display: true,
                    text: t("forum.dashboard.npost"),
                },
                ticks: {
                    stepSize: 1,
                    beginAtZero: false,
                    callback: function(value) {
                        return Number.isInteger(value) ? value : '';
                    },
                },
                beginAtZero: true,
            },
        },
    };
    const chartAreaBorder = {
        id: 'chartAreaBorder',
        beforeDraw(chart, args, options) {
            const {ctx, chartArea: {left, top, width, height}} = chart;
            ctx.save();
            ctx.strokeStyle = options.borderColor;
            ctx.lineWidth = options.borderWidth;
            ctx.setLineDash(options.borderDash || []);
            ctx.lineDashOffset = options.borderDashOffset;
            ctx.strokeRect(left, top, width, height);
            ctx.restore();
        }
    };


    if (isLoading) {
        return (
            <motion.div
                className="flex justify-center items-center w-full h-screen bg-opacity-75 fixed top-0 left-0 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Loader />
            </motion.div>
        );
    }

    return (
        <motion.div
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
        >
            <div className="flex items-center justify-between mb-6">
                <motion.h2
                    className="text-xl font-semibold text-gray-800"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                >
                    {t("forum.dashboard.month")}
                </motion.h2>

                <motion.select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                >
                    {yearOptions.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </motion.select>
            </div>

            <motion.div
                className="flex justify-center items-center w-full h-80"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
            >
                <Line data={chartData} options={options}  plugins={chartAreaBorder} />
            </motion.div>
        </motion.div>
    );
};

export default PostByMonth;
