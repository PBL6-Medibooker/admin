import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import * as regionService from "../../service/RegionService";
import { AdminContext } from "../../context/AdminContext";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
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
                const data = await regionService.getDoctorEachRegion(aToken);
                const formattedData = data.data.map((item) => ({
                    name: item.regionDetails.name,
                    doctorCount: item.doctorCount,
                }));
                return formattedData;
            } catch (e) {
                console.error(e);
                throw new Error("Failed to load appointments");
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
            <h2 className="text-lg font-medium mb-4 text-black font-bold">
                {t("region.dashboard.ctitle")}
            </h2>

            <div className="h-80">
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" stroke="#374151" />
                        <YAxis
                            stroke="#374151"
                            allowDecimals={false}
                            tickFormatter={(value) => Math.floor(value)}
                        />

                        <Tooltip
                            content={({ payload }) => {
                                if (payload && payload.length > 0) {
                                    const { name } = payload[0].payload;
                                    const { doctorCount } = payload[0].payload;
                                    return (
                                        <div className="bg-white p-2 rounded shadow">
                                            <p className="text-gray-800 font-semibold">{name} : {doctorCount} {t("region.dashboard.doctor")}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                            cursor={{ fill: "rgba(156, 163, 175, 0.2)" }}
                        />

                        <Bar dataKey={"doctorCount"} fill="#6366F1" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default DoctorEachRegion;
