import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext.jsx";
import { DoctorContext } from "../context/DoctorContext";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets.js";
import { Menu } from "lucide-react";

const Sidebar = () => {
    const { aToken } = useContext(AdminContext);
    const { dToken } = useContext(DoctorContext);
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className='bg-white border-r'>
            <motion.div
                className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
                    isSidebarOpen ? "w-64" : "w-20"
                }  min-h-screen`}
                animate={{width: isSidebarOpen ? 256 : 80}}
            >
                <div className="p-4 flex items-center justify-between">
                    <motion.button
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Toggle Sidebar"
                    >
                        <Menu size={24}/>
                    </motion.button>
                </div>

                <nav className="mt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {aToken && (
                        <ul className="text-[#515151]">
                            {[
                                {to: "/admin-dashboard", icon: assets.home_icon, label: "Dashboard"},
                                {to: "/account-dashboard", icon: assets.user_icon, label: "Account"},
                                {to: "/speciality-dashboard", icon: assets.speciality_icon, label: "Speciality"},
                                {to: "/region-dashboard", icon: assets.map_icon, label: "Region"},
                                {to: "/appointment", icon: assets.appointment_icon, label: "Appointment"},
                                {to: "/article-dashboard", icon: assets.article, label: "Article"},
                                {to: "/forum-dashboard", icon: assets.forum, label: "Forum"},
                            ].map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({isActive}) =>
                                        `flex items-center gap-3 px-3 py-3.5 md:px-5 md:min-w-72 cursor-pointer transition-all duration-300 ${
                                            isActive || location.pathname.includes(item.to)
                                                ? "bg-[#F2F3FF] border-r-4 border-primary text-primary"
                                                : "hover:bg-gray-100 text-gray-600"
                                        }`
                                    }
                                >
                                    <img className="w-6" src={item.icon} alt={item.label}/>
                                    <AnimatePresence>
                                        {isSidebarOpen && (
                                            <motion.p
                                                className="hidden md:block whitespace-nowrap"
                                                initial={{opacity: 0, x: -20}}
                                                animate={{opacity: 1, x: 0}}
                                                exit={{opacity: 0, x: -20}}
                                            >
                                                {item.label}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </NavLink>
                            ))}

                            <NavLink to="/admin-profile"
                                     className={({isActive}) =>
                                         `flex items-center mt-60 gap-3 px-3 py-3.5 md:px-5 md:min-w-72 cursor-pointer transition-all duration-300 ${
                                             isActive || location.pathname === 'admin-profile'
                                                 ? "bg-[#F2F3FF] border-r-4 border-primary text-primary"
                                                 : "hover:bg-gray-100 text-gray-600"
                                         }`
                                     }>
                                <img className='w-7' src={assets.admin} alt='admin'/>
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.p
                                            className="hidden md:block whitespace-nowrap"
                                            initial={{opacity: 0, x: -20}}
                                            animate={{opacity: 1, x: 0}}
                                            exit={{opacity: 0, x: -20}}
                                        >
                                            Admin Profile
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </NavLink>
                        </ul>
                    )}

                    {dToken && (
                        <ul className="text-[#515151]">
                            {[
                                {to: "/doctor-dashboard", icon: assets.home_icon, label: "Dashboard"},
                                {to: "/doctor-appointments", icon: assets.appointment_icon, label: "Appointment"},
                                {to: "/doctor-profile", icon: assets.people_icon, label: "Profile"},
                            ].map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({isActive}) =>
                                        `flex items-center gap-3 px-3 py-3.5 md:px-5 md:min-w-72 cursor-pointer transition-all duration-300 ${
                                            isActive
                                                ? "bg-[#F2F3FF] border-r-4 border-primary text-primary"
                                                : "hover:bg-gray-100 text-gray-600"
                                        }`
                                    }
                                >
                                    <img className="w-6" src={item.icon} alt={item.label}/>
                                    <AnimatePresence>
                                        {isSidebarOpen && (
                                            <motion.p
                                                className="hidden md:block whitespace-nowrap"
                                                initial={{opacity: 0, x: -20}}
                                                animate={{opacity: 1, x: 0}}
                                                exit={{opacity: 0, x: -20}}
                                            >
                                                {item.label}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </NavLink>
                            ))}
                        </ul>
                    )}
                </nav>
            </motion.div>
        </div>
    );
};

export default Sidebar;
