import React, { useContext, useEffect, useState } from 'react';
import {
    ComposedChart,
    Area,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Legend
} from 'recharts';
import { motion } from "framer-motion";
import { AdminContext } from "../../context/AdminContext";
import * as appointmentService from "../../service/AppointmentService";
import { useTranslation } from "react-i18next";

const AppointmentChart = () => {
    const { aToken } = useContext(AdminContext);
    const [dataAppointments, setDataAppointments] = useState([]);
    const { t } = useTranslation();
    const [yearOptions] = useState(['2024', '2025']);
    const [selectedYear, setSelectedYear] = useState('2024');

    const getAppointmentByMonth = async (year) => {
        try {
            const result = await appointmentService.getAppointmentByMonth(year, aToken);
            console.log(result);

            if (result.data && Array.isArray(result.data)) {
                const formattedData = result.data.map(item => ({
                    ...item,
                    month: item.month.split('-')[1],
                    appointmentCountBar: item.appointmentCount
                }));
                setDataAppointments(formattedData);
            } else {
                console.error("Expected result.data to be an array, but got:", result);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (aToken) {
            getAppointmentByMonth(selectedYear);
        }
    }, [aToken, selectedYear]);

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    return (
        <motion.div
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-300 mb-8"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.5, duration: 0.8}}
        >
            <motion.div
                className="flex items-center justify-between mb-6"
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                transition={{delay: 0.7, duration: 0.6}}
            >
                <motion.h2
                    className="text-xl font-semibold text-gray-800"
                    initial={{scale: 0.8}}
                    animate={{scale: 1}}
                    transition={{delay: 0.8, duration: 0.4}}
                >
                    {t("appointment.dashboard.ctitle")}
                </motion.h2>

                <motion.select
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="border border-gray-300 rounded px-3 py-2"
                    initial={{opacity: 0, x: 20}}
                    animate={{opacity: 1, x: 0}}
                    transition={{delay: 0.9, duration: 0.6}}
                >
                    {yearOptions.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </motion.select>
            </motion.div>

            <motion.div
                className="w-full h-80"
                initial={{scale: 0.95}}
                animate={{scale: 1}}
                transition={{delay: 1, duration: 0.7}}
            >
                <ResponsiveContainer width="100%" height="100%" syncId="anyId">
                    {dataAppointments.length > 0 ? (
                        <ComposedChart data={dataAppointments}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
                            <XAxis dataKey="month" stroke="#4B5563"/>
                            <YAxis stroke="#4B5563"/>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(249, 250, 251, 0.9)",
                                    borderColor: "#D1D5DB"
                                }}
                                itemStyle={{
                                    color: "#1F2937"
                                }}
                                labelFormatter={(month) =>
                                    `${t("appointment.dashboard.month")}: ${month}`
                                }
                                formatter={(value, name, props) => {
                                    if (props.dataKey === 'appointmentCountBar') {
                                        return [`${t("appointment.dashboard.number")}: ${value}`];
                                    }
                                    return null;
                                }}
                            />
                            <Legend
                                formatter={(value, entry) => {
                                    if (entry.dataKey === "appointmentCountBar") {
                                        return t("appointment.dashboard.label");
                                    }
                                    return '';
                                }}
                            />
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area
                                syncId="anyId"
                                type="monotone"
                                dataKey="appointmentCountBar"
                                stroke="#8884d8"
                                fill="url(#colorUv)"
                                fillOpacity={1}
                                name="Number of Appointments in a Month"
                            />
                        </ComposedChart>
                    ) : (
                        <motion.p
                            className="text-center text-gray-500"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{delay: 1.2, duration: 0.5}}
                        >
                            No data available
                        </motion.p>
                    )}
                </ResponsiveContainer>
            </motion.div>
        </motion.div>

    );
};

export default AppointmentChart;
