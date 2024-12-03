import { motion } from "framer-motion";

const Pagination = ({ table, t }) => {
    return (
        <motion.div
            className="flex items-center justify-end gap-2 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-2 py-1 border border-gray-400 rounded-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ opacity: table.getCanPreviousPage() ? 1 : 0.5 }}
            >
                {"<"}
            </motion.button>

            <motion.button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-2 py-1 border border-gray-400 rounded-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ opacity: table.getCanNextPage() ? 1 : 0.5 }}
            >
                {">"}
            </motion.button>

            <motion.div
                className="flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <span>{t("account.verified.page")}</span>
                <motion.strong
                    key={table.getState().pagination.pageIndex}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </motion.strong>
            </motion.div>

            <motion.div
                className="flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                | {t("account.verified.goToPage")}:
                <motion.input
                    type="number"
                    defaultValue={table.getState().pagination.pageIndex + 1}
                    onChange={(e) => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0;
                        table.setPageIndex(page);
                    }}
                    className="w-16 px-2 py-1 border border-gray-400 rounded-md bg-transparent"
                    whileFocus={{ borderColor: "#00A6A9" }}
                    transition={{ duration: 0.2 }}
                />
            </motion.div>
        </motion.div>
    );
};

export default Pagination;
