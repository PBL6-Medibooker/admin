import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext.jsx";
import { DoctorContext } from "../context/DoctorContext";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets.js";
import { Menu } from "lucide-react";
import {ThemeWrapper, ToggleSwitch, ToggleWrapper} from "./style";
import {useTranslation} from "react-i18next";

const Sidebar = () => {
    const { aToken } = useContext(AdminContext);
    const { dToken } = useContext(DoctorContext);
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const {t, i18n} = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState("vi");

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
                                { to: "/admin-dashboard", icon: assets.home_icon, label: t("sidebar.dashboard") },
                                { to: "/account-dashboard", icon: assets.user_icon, label: t("sidebar.account") },
                                { to: "/speciality-dashboard", icon: assets.speciality_icon, label: t("sidebar.speciality") },
                                { to: "/region-dashboard", icon: assets.map_icon, label: t("sidebar.region") },
                                { to: "/appointment", icon: assets.appointment_icon, label: t("sidebar.appointment") },
                                { to: "/article-dashboard", icon: assets.article, label: t("sidebar.article") },
                                { to: "/forum-dashboard", icon: assets.forum, label: t("sidebar.forum") },
                                { to: "/admin-profile", icon: assets.admin, label: t("sidebar.profile") },
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

                            <ThemeWrapper>
                                <ToggleWrapper>
                                    <ToggleSwitch
                                        onClick={() => {
                                            setCurrentLanguage(currentLanguage === "vi" ? "en" : "vi");
                                            i18n.changeLanguage(currentLanguage === "vi" ? "en" : "vi");
                                        }}
                                        type="checkbox" role="switch" />
                                </ToggleWrapper>
                            </ThemeWrapper>

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