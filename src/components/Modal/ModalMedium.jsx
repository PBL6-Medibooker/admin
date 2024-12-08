import React from 'react';
import { X } from "react-feather";

const ModalMedium = ({ open, onClose, children }) => {
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [open]);
    return (
        // backdrop
        <div
            onClick={onClose}
            className={`
                fixed inset-0 flex justify-center items-center transition-colors duration-300
                ${open ? "visible bg-black/30" : "invisible"}
            `}
            style={{ zIndex: 50 }}

        >
            {/* modal */}
            <div
                onClick={(e) => e.stopPropagation()}
                className={`
                    bg-white rounded-xl shadow-lg p-8 relative transition-transform duration-300
                    ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
                    w-[45vw] h-full max-h-[30vh] overflow-auto
                `}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1 rounded-full text-gray-400 bg-white hover:bg-gray-200 hover:text-gray-600 transition duration-150"
                >
                    <X size={20} />
                </button>
                <div className="flex flex-1 flex-col gap-4">{children}</div>
            </div>
        </div>
    );
};

export default ModalMedium;
