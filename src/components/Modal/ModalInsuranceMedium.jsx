import React from 'react';
import { X } from "react-feather";
import { motion, AnimatePresence } from "framer-motion";

const ModalInsuranceMedium = ({ open, onClose, children }) => {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    onClick={onClose}
                    className="fixed inset-0 flex justify-center items-center bg-black/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-xl shadow-lg p-8 relative w-full max-w-2xl h-full max-h-[65vh] overflow-auto"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
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
            )}
        </AnimatePresence>
    );
};

export default ModalInsuranceMedium;
