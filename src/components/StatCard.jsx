import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ name, icon: Icon, value, color, to, onClick }) => {
    const navigate = useNavigate();
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(true);
        setTimeout(() => {
            if (onClick) {
                onClick()
            } else {
                navigate(to)
            }// Call the onClick prop passed to StatCard
            setIsClicked(false);
        }, 150);
    };

    return (
        <motion.div
            className='bg-white shadow-lg rounded-xl border border-gray-300'
            whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.2)" }}
            animate={isClicked ? { scale: 0.95 } : { scale: 1 }}
            transition={{ duration: 0.15 }}
            onClick={handleClick}
        >
            <div className='px-4 py-5 sm:p-6'>
                <span className='flex items-center text-sm font-medium text-gray-600 cursor-default'>
                    <Icon size={20} className='mr-2' style={{ color }} />
                    {name}
                </span>
                <p className='mt-1 text-3xl font-semibold text-gray-800 cursor-default'>{value}</p>
            </div>
        </motion.div>
    );
};

export default StatCard;

// const StatCard = ({ name, icon: Icon, value, color, to }) => {
//     const navigate = useNavigate();
//     const [isClicked, setIsClicked] = useState(false);
//
//     const handleClick = () => {
//         setIsClicked(true);
//         setTimeout(() => {
//             navigate(to);
//             setIsClicked(false);
//         }, 150);
//     };
//
//     return (
//         <motion.div
//             className='bg-white shadow-lg rounded-xl border border-gray-300'
//             whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.2)" }}
//             animate={isClicked ? { scale: 0.95 } : { scale: 1 }}
//             transition={{ duration: 0.15 }}
//             onClick={handleClick}
//         >
//             <div className='px-4 py-5 sm:p-6'>
//                 <span className='flex items-center text-sm font-medium text-gray-600 cursor-default'>
//                     <Icon size={20} className='mr-2' style={{ color }} />
//                     {name}
//                 </span>
//                 <p className='mt-1 text-3xl font-semibold text-gray-800 cursor-default'>{value}</p>
//             </div>
//         </motion.div>
//     );
// };
