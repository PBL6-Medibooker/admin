import React, {useContext, useEffect, useState} from 'react';
import {
    Cell,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Bar,
    ResponsiveContainer,
    Tooltip,
    Legend
} from "recharts";
import { motion } from 'framer-motion';
import * as specialityService from "../../service/SpecialityService";
import { useTranslation } from "react-i18next";
import {AdminContext} from "../../context/AdminContext";

const COLORS = [
    "#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B",
    "#3B82F6", "#EF4444", "#22C55E", "#F97316", "#A855F7",
    "#14B8A6", "#EAB308", "#9CA3AF", "#6B7280", "#4B5563"
];

const SpecialityByDoctorChart = () => {
    const [data, setData] = useState([]);
    const { t } = useTranslation();
    const { aToken } = useContext(AdminContext);

    const getDoctorEachSpeciality = async () => {
        try {
            const response = await specialityService.getEachDoctorOfSpeciality();
            setData(response.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
       if(aToken){
           getDoctorEachSpeciality()
       }
    }, [aToken]);

    const renderLegend = () => (
        <motion.div
            className="flex justify-center space-x-6"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
            }}
        >
            {data.map((entry, index) => (
                <motion.div
                    key={`legend-${index}`}
                    className="flex items-center space-x-2"
                    variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 },
                    }}
                >
                    <div
                        style={{
                            backgroundColor: COLORS[index % COLORS.length],
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                        }}
                    />
                    <span className="text-gray-800">{entry.speciality}</span>
                </motion.div>
            ))}
        </motion.div>
    );

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { speciality, doctorCount } = payload[0].payload;

            return (
                <motion.div
                    className="custom-tooltip"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
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
                </motion.div>
            );
        }
        return null;
    };

    return (
        <motion.div
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("speciality.dashboard.dis")}</h2>
            <div className="h-80">
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="speciality" stroke="#374151" />
                        <YAxis
                            stroke="#374151"
                            allowDecimals={false}
                            tickFormatter={(value) => Math.floor(value)}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={renderLegend} />
                        <Bar dataKey={"doctorCount"} fill="#6366F1" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
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

export default SpecialityByDoctorChart;
