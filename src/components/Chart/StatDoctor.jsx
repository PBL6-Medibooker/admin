import React, { useContext, useState } from 'react';
import {
    Area,
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { DoctorContext } from "../../context/DoctorContext";
import { useQuery } from "@tanstack/react-query";
import * as doctorService from "../../service/DoctorService";

const StatDoctor = () => {
    const { t } = useTranslation();
    const { dToken, docId } = useContext(DoctorContext);
    const [yearOption] = useState(['2024', '2025']);
    const [selectedYear, setSelectedYear] = useState('');

    const { data = [], isLoading } = useQuery({
        queryKey: ["doctorstat", selectedYear],
        queryFn: async () => {
            try {
                const formData = {
                    year: selectedYear,
                    doctorId: docId
                };
                const result = await doctorService.getDoctorStat(formData, dToken);
                return result.data;
            } catch (e) {
                console.error(e);
                throw new Error("Failed to load data.");
            }
        },
    });

    return (
        <motion.div
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="mb-6 flex justify-between space-x-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {t("doctor.dashboard.title")}
                </h2>
                <motion.select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                    initial={{opacity: 0, x: 20}}
                    animate={{opacity: 1, x: 0}}
                    transition={{delay: 0.9, duration: 0.6}}
                >
                    {yearOption.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </motion.select>
            </div>

            <motion.div
                className="h-80"
                initial={{opacity: 0}}
                animate={{opacity: isLoading ? 0 : 1}}
                transition={{duration: 0.5}}
            >
                {isLoading ? (
                    <motion.div
                        className="flex justify-center items-center h-full"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.6}}
                    >
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </motion.div>
                ) : data.length > 0 ? (
                    <ResponsiveContainer>
                        <ComposedChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="name" stroke="#4B5563" />
                            <YAxis
                                stroke="#374151"
                                allowDecimals={false}
                                tickFormatter={(value) => Math.floor(value)}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(249, 250, 251, 0.9)",
                                    borderColor: "#D1D5DB",
                                }}
                                itemStyle={{
                                    color: "#1F2937",
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="postCount"
                                stroke="#ff7300"
                                name={t("doctor.dashboard.labelp")}
                                isAnimationActive={true}
                            />
                            <Bar
                                dataKey="articleCount"
                                barSize={20}
                                fill="#413ea0"
                                name={t("doctor.dashboard.labelar")}
                                isAnimationActive={true}
                            />
                            <Area
                                type="monotone"
                                dataKey="appointmentCount"
                                stroke="#2563EB"
                                fill="#2563EB"
                                fillOpacity={0.3}
                                name={t("doctor.dashboard.labela")}
                                isAnimationActive={true}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                ) : (
                    <motion.p
                        className="text-center text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                    >
                        {t("region.dashboard.noData")}
                    </motion.p>
                )}
            </motion.div>
        </motion.div>
    );
};

export default StatDoctor;
