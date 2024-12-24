import React from 'react';
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const StartPage = () => {
    return (
        <motion.div
            className="bg-[#F8F9FD] w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.div
                className="flex justify-center items-center h-screen"
                initial={{ y: -50, opacity: 0 }} // Starts off-screen (above)
                animate={{ y: 0, opacity: 1 }} // Slides in and fades in
                transition={{ duration: 1, delay: 0.5 }} // Delayed slide-in effect
            >
                <img
                    src={assets.banner}
                    alt="Start Page Banner"
                    className="max-w-full max-h-[80vh] object-cover rounded-lg shadow-lg mb-20"
                />
            </motion.div>
        </motion.div>
    );
};

export default StartPage;
