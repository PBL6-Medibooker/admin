import React, { useContext } from "react";
import { assets } from "../assets/assets.js";
import { AdminContext } from "../context/AdminContext.jsx";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";
import { motion } from "framer-motion";

function Navbar() {
    const { aToken, setAToken } = useContext(AdminContext);
    const { dToken, setDToken } = useContext(DoctorContext);
    const navigate = useNavigate();

    const logout = () => {
        navigate("/");
        aToken && setAToken("");
        aToken && localStorage.removeItem("aToken");
        dToken && setDToken("");
        dToken && localStorage.removeItem("dToken");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white"
        >
            <motion.div
                className="flex items-center gap-2 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <img
                    className="w-36 sm:w-40 cursor-pointer"
                    src={assets.admin_logo}
                    alt="icon"
                />
                <motion.p
                    className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600"
                    whileHover={{ scale: 1.1 }}
                >
                    {aToken ? "Admin" : "Doctor"}
                </motion.p>
            </motion.div>

            <motion.button
                onClick={logout}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white px-10 py-2 rounded-full text-sm hover:shadow-lg"
            >
                Logout
            </motion.button>
        </motion.div>
    );
}

export default Navbar;
