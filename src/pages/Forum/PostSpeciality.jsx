import React, {useContext, useEffect, useState} from 'react';
import {AdminContext} from "../../context/AdminContext";
import {useNavigate} from "react-router-dom";
import * as specialityService from "../../service/SpecialityService";
import * as forumService from "../../service/ForumService";
import {motion} from "framer-motion";
import PostListByForum from "./PostListByForum";

const PostSpeciality = () => {
    const {aToken} = useContext(AdminContext);
    const navigate = useNavigate();
    const [specialities, setSpecialities] = useState([]);


    const getPostSpeciality = (value) => {
        navigate('/post-list-by-speciality', { state: { name: value } });

    }
    const findAllSpecialities = async () => {
        const result = await specialityService.findAll(false, aToken)
        setSpecialities(result);
    }

    useEffect(() => {
        if (aToken) {
            findAllSpecialities()
        }
    }, [aToken]);
    return (
        <div>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg text-primary lg:text-2xl pl-5 pt-2 font-medium'>Post By PostSpeciality</h1>
            </div>
            <motion.div
                className='w-[80vw] m-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-5 pb-5'
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {opacity: 0},
                    visible: {opacity: 1, transition: {staggerChildren: 0.1}},
                }}
            >
                {specialities?.map((item, index) => (
                    <motion.div
                        className='border border-indigo-200 rounded-xl overflow-hidden cursor-pointer group shadow-md'
                        key={index}
                        whileHover={{scale: 1.02, boxShadow: '0px 4px 10px rgba(0,0,0,0.2)'}}
                        variants={{
                            hidden: {opacity: 0, y: 20},
                            visible: {opacity: 1, y: 0},
                        }}
                        transition={{duration: 0.3}}
                    >

                        <div className='relative bg-indigo-50 group h-40 sm:h-48 lg:h-56'>
                            <img
                                className='w-full h-full object-cover transition-all duration-500 group-hover:opacity-80'
                                src={item.speciality_image}
                                alt='PostSpeciality'
                            />
                            <button
                                onClick={() => getPostSpeciality(item.name)}
                                className='absolute inset-0 flex items-center justify-center bg-primary/75 text-white text-lg font-semibold py-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                            >
                                See all post
                            </button>
                        </div>


                        <div className='p-4  bg-white'>
                            <h3 className='text-primary text-center text-lg lg:text-2xl font-medium truncate'>{item.name}</h3>
                        </div>
                    </motion.div>
                ))}
            </motion.div>


        </div>

    );
};

export default PostSpeciality;
