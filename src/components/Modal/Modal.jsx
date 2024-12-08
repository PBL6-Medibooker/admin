import React from 'react';
import { X } from "react-feather";

const Modal = ({ open, onClose, children }) => {
    // de tranh item ko bi an boi backdrop
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [open]);

    return (
        <div
            onClick={onClose}
            className={`
                fixed inset-0 flex justify-center items-center transition-colors duration-300
                ${open ? "visible bg-black/30" : "invisible"}
            `}
            style={{ zIndex: 50 }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`
                    bg-white rounded-xl p-6 relative transition-transform duration-300
                    ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
                `}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1 rounded-full text-gray-400 bg-white hover:bg-gray-200 hover:text-gray-600 transition duration-150"
                >
                    <X size={20} />
                </button>
                {children}
            </div>
        </div>
    );
};


export default Modal;
