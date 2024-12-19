import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import * as regionService from "../../service/RegionService";
import { AdminContext } from "../../context/AdminContext";
import { useTranslation } from "react-i18next";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell,
    Area,
    ComposedChart,
} from "recharts";
import { motion } from "framer-motion";
import Loader from "../../components/Loader";

const COLORS = ["#4F46E5", "#9333EA", "#E11D48", "#16A34A", "#EA580C"];

const DoctorEachRegion = () => {
    const { aToken } = useContext(AdminContext);
    const { t } = useTranslation();

    const { data = [], isLoading } = useQuery({
        queryKey: ["doctorsEachRegion"],
        queryFn: async () => {
            try {
                const response = await regionService.getDoctorEachRegion(aToken);
                const formattedData = response.data.map((item) => ({
                    name: item.regionDetails.name,
                    doctorCount: item.doctorCount,
                    appointmentCount: item.appointmentCount,
                }));
                return formattedData;
            } catch (e) {
                console.error(e);
                throw new Error("Failed to load data.");
            }
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-screen bg-white fixed top-0 left-0 z-50">
                <Loader />
            </div>
        );
    }

    return (
        <motion.div
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {t("region.dashboard.ctitle")}
            </h2>

            <div className="h-80">
                <ResponsiveContainer>
                    {data.length > 0 ? (
                        <ComposedChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="name" stroke="#4B5563" />
                            <YAxis
                                stroke="#374151"
                                allowDecimals={false}
                                tickFormatter={(value) => Math.floor(value)}
                            />
                            <Tooltip
                                formatter={(value, name, props) => {
                                    if (props.dataKey === "doctorCount") {
                                        return [value, t("region.dashboard.doctor")];
                                    } else if (props.dataKey === "appointmentCount") {
                                        return [value, t("appointment.dashboard.label")];
                                    }
                                    return [value, name];
                                }}
                                labelFormatter={(name) => `${t("region.dashboard.name")}: ${name}`}
                                contentStyle={{
                                    backgroundColor: "rgba(249, 250, 251, 0.9)",
                                    borderColor: "#D1D5DB",
                                }}
                                itemStyle={{
                                    color: "#1F2937",
                                }}
                            />
                            <Legend
                                formatter={(value) =>
                                    value === "doctorCount"
                                        ? t("region.dashboard.doctor")
                                        : t("appointment.dashboard.label")
                                }
                            />
                            <Bar
                                dataKey="doctorCount"
                                fill="#6366F1"
                                radius={[4, 4, 0, 0]}
                                name={t("region.dashboard.doctor")}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Bar>
                            <Area
                                type="monotone"
                                dataKey="appointmentCount"
                                stroke="#2563EB"
                                fill="#2563EB"
                                fillOpacity={0.3}
                                name={t("appointment.dashboard.label")}
                            />
                        </ComposedChart>
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
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default DoctorEachRegion;
