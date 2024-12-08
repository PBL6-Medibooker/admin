import React from 'react';
import { X } from 'react-feather';
import { motion } from 'framer-motion';

const Modal = ({ open, onClose, children }) => {
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [open]);

    return (
        // backdrop with motion for fade-in/out effect
        <motion.div
            onClick={onClose}
            className={`
                fixed inset-0 flex justify-center items-center transition-colors duration-300
                ${open ? "visible bg-black/30" : "invisible"}
            `}
            style={{ zIndex: 50 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: open ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* modal with motion for scale and fade effect */}
            <motion.div
                onClick={(e) => e.stopPropagation()}
                className={`
                    bg-white rounded-xl shadow-lg p-8 relative transition-transform duration-300
                    w-full max-w-4xl h-full max-h-[80vh] overflow-auto
                `}
                initial={{ scale: 1.25, opacity: 0 }}
                animate={{
                    scale: open ? 1 : 1.25,
                    opacity: open ? 1 : 0
                }}
                exit={{ scale: 1.25, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1 rounded-full text-gray-400 bg-white hover:bg-gray-200 hover:text-gray-600 transition duration-150"
                >
                    <X size={20} />
                </button>
                <div className="flex flex-1 flex-col gap-4">{children}</div>
            </motion.div>
        </motion.div>
    );
};

export default Modal;
