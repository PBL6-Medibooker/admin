import React, { useContext, useEffect, useState } from 'react';
import {
    ComposedChart,
    Area,
    Bar,
    Line,
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

const AppointmentChart = () => {
    const { aToken } = useContext(AdminContext);
    const [dataAppointments, setDataAppointments] = useState([]);


    const getAppointmentByMonth = async () => {
        try {
            const result = await appointmentService.getAppointmentByMonth(aToken);
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
        getAppointmentByMonth();
    }, [aToken]);


    useEffect(() => {
        getAppointmentByMonth();
    }, [aToken]);

    return (
        <motion.div
            className='bg-white shadow-lg rounded-xl p-6 border border-gray-300 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
        >
            <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold text-gray-800'>Appointment Overview</h2>
            </div>

            <div className='w-full h-80'>
                <ResponsiveContainer width="100%" height="100%"
                                     syncId="anyId"

                >
                    {dataAppointments.length > 0 ? (
                        <ComposedChart data={dataAppointments}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="month" stroke="#4B5563" />
                            <YAxis stroke="#4B5563" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(249, 250, 251, 0.9)",
                                    borderColor: "#D1D5DB"
                                }}
                                itemStyle={{
                                    color: "#1F2937"
                                }}
                                labelFormatter={(month) => `Month: ${month}`}
                                formatter={(value, name, props) => {
                                    if (props.dataKey === 'appointmentCountBar') {
                                        return [`Number of Appointments: ${value}`];
                                    }
                                    return null;
                                }}
                            />


                            <Legend
                                formatter={(value, entry, index) => {

                                    if (entry.dataKey === "appointmentCountBar") {
                                        return 'Number of Appointments in a Month';
                                    }
                                    return '';
                                }}
                            />


                            <Area
                                syncId="anyId"
                                type="monotone"
                                dataKey="appointmentCount"
                                stroke="#2563EB"
                                fill="#2563EB"
                                fillOpacity={0.3}
                            />


                            <Bar
                                dataKey="appointmentCountBar"
                                barSize={20}
                                fill="#413ea0"
                                name="Number of Appointments in a Month"
                            />


                            <Line
                                type="monotone"
                                dataKey="appointmentCount"
                                stroke="#ff7300"
                                name=""
                            />
                        </ComposedChart>
                    ) : (
                        <p>No data available</p>
                    )}
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default AppointmentChart;
