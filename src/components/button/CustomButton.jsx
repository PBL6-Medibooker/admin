import {motion} from "framer-motion";

const CustomButton = ({
                          disabled = false,
                          onClick,
                          label,
                          icon: Icon,
                          bgColor,
                          cursor = false,
                          shadowColor,
                          textColor = 'text-white'
                      }) => {

    const motionProps = disabled
        ? {}
        : {
            whileHover: {
                scale: 1.1,
                boxShadow: `0px 8px 20px ${shadowColor}`,
            },
            whileTap: {scale: 0.95},
            transition: {type: "spring", stiffness: 300},
        };

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center gap-2 px-8 py-3 mt-4 rounded-full ${cursor && 'cursor-not-allowed'} ${textColor} shadow-md ${bgColor}`}
            {...motionProps}

        >
            {Icon && <Icon/>}
            {label}
        </motion.button>
    );
};

export default CustomButton;
