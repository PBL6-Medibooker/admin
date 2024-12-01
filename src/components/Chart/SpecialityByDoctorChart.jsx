import React, { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { motion } from 'framer-motion';
import * as specialityService from "../../service/SpecialityService";
import {useTranslation} from "react-i18next";
import {getCoreRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const SpecialityByDoctorChart = () => {
    const [data, setData] = useState([]);
    const {t} = useTranslation();



    const getDoctorEachSpeciality = async () => {
        try {
            const response = await specialityService.getEachDoctorOfSpeciality();
            setData(response.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getDoctorEachSpeciality();
    }, []);


    const renderLegend = () => {

        return (
            <div className="flex justify-center space-x-6">
                {data.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center space-x-2">
                        <div
                            style={{
                                backgroundColor: COLORS[index % COLORS.length],
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                            }}
                        />
                        <span className="text-gray-800">{entry.speciality}</span>
                    </div>
                ))}
            </div>
        );
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { speciality, doctorCount } = payload[0].payload;
            const percent = payload[0].percent * 100;

            return (
                <div
                    className="custom-tooltip"
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderColor: "#D1D5DB",
                        padding: "10px",
                        borderRadius: "5px",
                        borderWidth: "1px",
                    }}

                >
                    <p className="label" style={{ color: "#374151" }}>
                        {speciality}: {doctorCount} {t("speciality.dashboard.tooltip")}
                    </p>

                </div>
            );
        }

        return null;
    };





    return (
        <motion.div
            className='bg-white shadow-lg rounded-xl p-6 border border-gray-300'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>{t("speciality.dashboard.dis")} </h2>
            <div className='h-80'>
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx={"50%"}
                            cy={"50%"}
                            labelLine={false}
                            outerRadius={80}
                            fill='#8884d8'
                            dataKey='doctorCount'
                            label={({ speciality, percent }) => `${speciality} ${(percent * 100).toFixed(0)}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />

                        <Legend content={renderLegend} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default SpecialityByDoctorChart;
