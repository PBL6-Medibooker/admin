import { motion } from "framer-motion";

const CustomButton = ({ onClick, label, icon: Icon, bgColor, hoverColor, shadowColor, textColor = 'text-white' }) => {
    return (
        <motion.button
            onClick={onClick}
            className={`flex items-center gap-2 px-8 py-3 mt-4 rounded-full ${textColor} shadow-md ${bgColor}`}
            whileHover={{
                scale: 1.1,
                boxShadow: `0px 8px 20px ${shadowColor}`,
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            {Icon && <Icon />}
            {label}
        </motion.button>
    );
};

export default CustomButton;
