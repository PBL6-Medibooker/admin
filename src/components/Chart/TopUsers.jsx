import React, {useContext} from 'react';
import {Doughnut} from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {motion} from 'framer-motion';
import {useTranslation} from 'react-i18next';
import {useQuery} from "@tanstack/react-query";
import * as accountService from "../../service/AccountService";
import {AdminContext} from "../../context/AdminContext";
import Loader from "../Loader";


ChartJS.register(ArcElement, Tooltip, Legend);

const TopUsers = () => {
    const {t} = useTranslation();
    const {aToken} = useContext(AdminContext)


    const {data = [], isLoading, refetch} = useQuery({
        queryKey: ["data"],
        queryFn: async () => {
            try {
                const data = await accountService.getTopUsers(aToken);
                console.log('user', data)
                return data;
            } catch (e) {
                console.error(e);
                throw new Error("Failed to load appointments");
            }
        },
        onSuccess: () => {
            // setIsInitialLoading(false);
        }
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
                        {t("account.adashboard.topUsers")}
                    </h2>
                </div>

                <div className="flex justify-center items-center w-full h-80">

                    <Doughnut data={chartData} options={options}/>

                </div>
            </motion.div>
        </div>
    );
};

export default TopUsers;
