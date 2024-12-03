import { motion } from "framer-motion";

const SearchInput = ({ globalFilter, setGlobalFilter, t }) => {
    return (
        <motion.div
            className="mt-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.input
                type="text"
                placeholder={t("account.accountList.search")}
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-[20vw] p-3 border border-gray-300 rounded mb-4"
                whileFocus={{ borderColor: "#00A6A9", boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)" }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
            />
        </motion.div>
    );
};

export default SearchInput;
