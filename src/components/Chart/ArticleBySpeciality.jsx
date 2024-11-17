import React, {useContext, useEffect, useState} from 'react';
import {AdminContext} from "../../context/AdminContext";
import * as articleService from "../../service/ArticleService";
import {motion} from "framer-motion";
import {
   Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip
} from "recharts";


const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FED766", "#2AB7CA"];


const ArticleBySpeciality = () => {
    const { aToken } = useContext(AdminContext);

    const [articleData, setArticleData] = useState([]);


    const getArticleBySpeciality = async () =>{
        try {
            const data = await articleService.getArticleBySpeciality(aToken)
            if(data.success){
                console.log(data)
                setArticleData(data.data);
            }
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        if(aToken){
            getArticleBySpeciality()
        }
    }, [aToken]);

    const renderLegend = () => {

        return (
            <div className="flex justify-center space-x-6">
                {articleData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center space-x-2">
                        <div
                            style={{
                                backgroundColor: COLORS[index % COLORS.length],
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                            }}
                        />
                        <span className="text-gray-800">{entry.specialityName}</span>
                    </div>
                ))}
            </div>
        );
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { specialityName, articleCount
            } = payload[0].payload;
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
                        {specialityName}: {articleCount
                    } articles
                    </p>

                </div>
            );
        }

        return null;
    };

    return (
        <motion.div
            className='bg-white shadow-lg rounded-xl p-6 border border-gray-300 mb-8'
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 1}}
        >
            <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold text-gray-800'>Article Overview</h2>
            </div>

            <div className='w-full h-80'>
                <ResponsiveContainer width="100%" height="100%" syncId="anyId">
                    {articleData?.length > 0 ? (
                        <PieChart>
                            <Pie
                                data={articleData}
                                cx='50%'
                                cy='50%'
                                outerRadius={80}
                                fill='#8884d8'
                                dataKey='articleCount'
                                label={({ specialityName, percent }) => `${specialityName} ${(percent * 100).toFixed(0)}%`}
                            >
                                {articleData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />

                            <Legend content={renderLegend} />
                        </PieChart>
                    ) : (
                        <p className="text-center text-gray-500">No data available</p>
                    )}
                </ResponsiveContainer>
            </div>

        </motion.div>
    );
};

export default ArticleBySpeciality;
