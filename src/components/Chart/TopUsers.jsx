// import React, {useContext, useEffect} from 'react';
// import { Doughnut, PolarArea } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { motion } from 'framer-motion';
// import { useTranslation } from 'react-i18next';
// import { useQuery } from '@tanstack/react-query';
// import * as accountService from "../../service/AccountService";
// import { AdminContext } from "../../context/AdminContext";
// import Loader from "../Loader";
//
// ChartJS.register(ArcElement, Tooltip, Legend);
//
// const TopUsers = () => {
//     const { t } = useTranslation();
//     const { aToken } = useContext(AdminContext);
//
//     const { data = [], isLoading, refetch } = useQuery({
//         queryKey: ["data"],
//         queryFn: async () => {
//             try {
//                 const data = await accountService.getTopUsers(aToken);
//                 console.log('user', data);
//                 return data;
//             } catch (e) {
//                 console.error(e);
//                 throw new Error("Failed to load appointments");
//             }
//         },
//     });
//
//     const chartData = {
//         labels: data?.data?.map(name => name.userDetails.username),
//         datasets: [{
//             label: t("account.adashboard.label"),
//             data: data?.data?.map(value => value.appointmentCount),
//             backgroundColor: [
//                 'rgb(255, 99, 132)',
//                 'rgb(54, 162, 235)',
//                 'rgb(255, 205, 86)',
//                 'rgb(75, 192, 192)',
//                 'rgb(153, 102, 255)',
//             ],
//             hoverOffset: 4,
//         }],
//     };
//
//     const options = {
//         responsive: true,
//         plugins: {
//             tooltip: {
//                 enabled: true,
//             },
//             legend: {
//                 position: 'top',
//             },
//         },
//     };
//     useEffect(() => {
//         if(aToken){
//             refetch()
//         }
//     }, [aToken]);
//
//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center w-full h-screen bg-opacity-75 fixed top-0 left-0 z-50">
//                 <Loader />
//             </div>
//         );
//     }
//
//     return (
//         <motion.div
//             className="bg-white shadow-lg rounded-xl p-6 border border-gray-300 mb-8"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2, duration: 0.5 }}
//         >
//             <motion.div
//                 className="flex items-center justify-between mb-6"
//                 initial={{ opacity: 0, x: -50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3, duration: 0.5 }}
//             >
//                 <h2 className="text-xl font-semibold text-gray-800">
//                     {t("account.adashboard.topUsers")}
//                 </h2>
//             </motion.div>
//
//             <motion.div
//                 className="flex justify-center items-center w-full h-80"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
//             >
//                 <Doughnut data={chartData} options={options} />
//             </motion.div>
//         </motion.div>
//     );
// };
//
// export default TopUsers;
import React, { useContext, useEffect } from 'react';
import { PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, RadialLinearScale } from 'chart.js';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import * as accountService from "../../service/AccountService";
import { AdminContext } from "../../context/AdminContext";
import Loader from "../Loader";

ChartJS.register(ArcElement, Tooltip, Legend, Title, RadialLinearScale);

const TopUsers = () => {
    const { t } = useTranslation();
    const { aToken } = useContext(AdminContext);

    const { data = [], isLoading, refetch } = useQuery({
        queryKey: ["data"],
        queryFn: async () => {
            try {
                const data = await accountService.getTopUsers(aToken);
                console.log('user', data);
                return data;
            } catch (e) {
                console.error(e);
                throw new Error("Failed to load appointments");
            }
        },
    });

    const chartData = {
        labels: data?.data?.map(name => name.userDetails.username),
        datasets: [{
            label: t("account.adashboard.label"),
            data: data?.data?.map(value => value.appointmentCount),
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
            ],
            hoverOffset: 4,
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
                labels: {
                    font: {
                        size: 14,
                    },
                },
            },
            // title: {
            //     display: true,
            //     font: {
            //         size: 16,
            //         weight: 'bold',
            //     },
            // },
        },
        scales: {
            r: {
                angleLines: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                pointLabels: {
                    font: {
                        size: 14,
                    },
                    color: 'rgba(0, 0, 0, 0.7)',
                },
                ticks: {
                    display: false,
                },
            },
        },
    };

    useEffect(() => {
        if (aToken) {
            refetch();
        }
    }, [aToken]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-screen bg-opacity-75 fixed top-0 left-0 z-50">
                <Loader />
            </div>
        );
    }

    return (
        <motion.div
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
        >
            <motion.div
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <h2 className="text-xl font-semibold text-gray-800">
                    {t("account.adashboard.topUsers")}
                </h2>
            </motion.div>

            <motion.div
                className="flex justify-center items-center w-full h-80"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
            >
                <PolarArea data={chartData} options={options} />
            </motion.div>
        </motion.div>
    );
};

export default TopUsers;
