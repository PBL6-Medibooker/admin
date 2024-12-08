import { motion } from "framer-motion";

const SearchInput = ({ globalFilter, setGlobalFilter, t, disableHover = false }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.input
                type="text"
                placeholder={t}
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-[20vw] p-3.5 border border-gray-300 rounded"
                style={{
                    transformOrigin: "center",
                    display: "block",
                }}
                whileFocus={{
                    borderColor: "#00A6A9",
                    boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)",
                }}
                whileHover={
                    !disableHover
                        ? {
                            scale: 1.02,
                            boxShadow: "0 0 10px rgba(59, 130, 246, 0.2)",
                        }
                        : {}
                }
                transition={{ duration: 0.2 }}
            />
        </motion.div>
    );
};

export default SearchInput;

