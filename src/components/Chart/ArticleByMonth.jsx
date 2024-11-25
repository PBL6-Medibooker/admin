import React, {useContext, useEffect, useState} from 'react';
import {
    CartesianGrid,
    Legend,
    Line, LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {motion} from "framer-motion";
import {AdminContext} from "../../context/AdminContext";
import * as articleService from "../../service/ArticleService";
import {useTranslation} from "react-i18next";


const ArticleByMonth = () => {
    const { aToken } = useContext(AdminContext);
    const {t}= useTranslation();
    const [articleData, setArticleData] = useState([]);


    const getArticleByMonth = async () =>{
        try {
            const data = await articleService.getArticleByMonth(2024, aToken)
            if(data){
                console.log(data)
                setArticleData(data);
            }
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        if(aToken){
            getArticleByMonth()
        }
    }, [aToken]);
    return (
        <motion.div
            className='bg-white shadow-lg rounded-xl p-6 border border-gray-300 mb-8'
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 1}}
        >
            <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold text-gray-800'>{t("article.dashboard.mtitle")}</h2>
            </div>

            <div className='w-full h-80'>
                <ResponsiveContainer width="100%" height="100%" syncId="anyId">
                    {articleData.length > 0 ? (
                        <LineChart data={articleData}>
                            <CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB'/>
                            <XAxis dataKey='month' stroke='#374151'/>
                            <YAxis stroke='#374151'/>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#FFFFFF",
                                    borderColor: "#E5E7EB",
                                    color: "#374151"
                                }}
                                itemStyle={{color: "#374151"}}
                                labelFormatter={(month) => `${t("article.dashboard.month")}: ${month}`}
                                formatter={(value, name, props) => {
                                    if (props.dataKey === 'count') {
                                        return [`${t("article.dashboard.number")}: ${value}`];
                                    }
                                    return null;
                                }}
                            />

                            <Legend wrapperStyle={{color: "#374151"}}/>

                            <Line type='monotone' dataKey='count' stroke='#8B5CF6' strokeWidth={2}
                                  dot={{fill: '#8B5CF6'}}
                                  name={t("article.dashboard.label")}
                            />
                        </LineChart>
                    ) : (
                        <p className="text-center text-gray-500">{t("article.dashboard.nodata")}</p>
                    )}
                </ResponsiveContainer>
            </div>

        </motion.div>
    );
};

export default ArticleByMonth;
