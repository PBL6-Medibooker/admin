import React, {useContext, useEffect, useState} from 'react';
import {AdminContext} from "../../context/AdminContext";
import * as doctorService from "../../service/DoctorService";
import {motion} from "framer-motion";
import {
     Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,

} from "recharts";
import {useTranslation} from "react-i18next";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FED766", "#2AB7CA"];

const TopDoctorChart = () => {
    const { aToken } = useContext(AdminContext);
    const {t} = useTranslation()

    const [doctorData, setDoctorData] = useState([]);

    const getTopDoctor = async () => {
        try {
            const data = await doctorService.getTopDoctors(aToken);
            if (data) {
                console.log(data);
                const formattedData = data.data.map((item) => ({
                    name: item.doctorDetails?.username || t("account.adashboard.unknownDoctor"),
                    appointmentCount: item.appointmentCount,
                }));
                setDoctorData(formattedData);
            }
        } catch (e) {
            console.error(e);
        }
    };
    // const renderLegend = () => {
    //
    //     return (
    //         <div className="flex justify-center space-x-6">
    //             {doctorData.map((entry, index) => (
    //                 <div key={`legend-${index}`} className="flex items-center space-x-2">
    //                     <div
    //                         style={{
    //                             backgroundColor: COLORS[index % COLORS.length],
    //                             width: 12,
    //                             height: 12,
    //                             borderRadius: "50%",
    //                         }}
    //                     />
    //                     <Tooltip title={entry.name}>
    //                         <span className="text-gray-800 truncate max-w-16">{entry.name}</span>
    //                     </Tooltip>
    //                 </div>
    //             ))}
    //         </div>
    //     );
    // };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { name, appointmentCount
            } = payload[0].payload;

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
                        {name}: {appointmentCount}&nbsp;{t("account.adashboard.appointments")}
                    </p>

                </div>
            );
        }

        return null;
    };

    useEffect(() => {
        if(aToken){
            getTopDoctor()
        }
    }, [aToken]);
    return (
        <motion.div
            className='bg-white shadow-lg rounded-xl p-6 border border-gray-300 mb-8'
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.2}}
        >
            <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold text-gray-800'>{t("account.adashboard.topDoctors")}</h2>
            </div>

            <div className='w-full h-80'>
                <ResponsiveContainer width="100%" height="100%" syncId="anyId">
                    {doctorData?.length > 0 ? (
                        <PieChart>
                            <Pie
                                data={doctorData}
                                cx='50%'
                                cy='50%'
                                outerRadius={80}
                                fill='#8884d8'
                                dataKey='appointmentCount'
                                label={({
                                            name,
                                            percent
                                        }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {doctorData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip/>} />

                            {/*<Legend content={renderLegend}/>*/}
                        </PieChart>
                    ) : (
                        <p className="text-center text-gray-500">{t("account.adashboard.noDataAvailable")}</p>
                    )}
                </ResponsiveContainer>
            </div>

        </motion.div>
    );
};

export default TopDoctorChart;
