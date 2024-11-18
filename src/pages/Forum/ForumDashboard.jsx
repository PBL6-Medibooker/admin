import React, {useContext, useEffect, useState} from 'react';
import {AdminContext} from "../../context/AdminContext";
import * as forumService from "../../service/ForumService";
import {motion} from "framer-motion";
import StatCard from "../../components/StatCard";
import {EthernetPort} from "lucide-react";

const ForumDashboard = () => {

    const {aToken} = useContext(AdminContext);
    const [data, setData] = useState([]);
    const [totalPost, setTotalPost] = useState(0)


    const getPostList = async () => {
        try {
            const result = await forumService.findAll( aToken);
            setTotalPost(result.length)
            setData(result);
        } catch (e) {
            console.log(e.error);
        }
    };

    useEffect(() => {
        if (aToken) {
            getPostList();
        }
    }, [aToken]);
    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>

                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 1}}
                >
                    <StatCard name='Total Post' to={'/speciality-forum'} icon={EthernetPort} value={totalPost}
                              color='#6366F1'/>
                </motion.div>

                {/* CHARTS */}

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>


                </div>
            </main>
        </div>
    );
};

export default ForumDashboard;
