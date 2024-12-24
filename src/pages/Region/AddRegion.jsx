import React, {useContext, useEffect, useState} from "react";
import Modal from "../../components/Modal/Modal";
import * as regionService from "../../service/RegionService";
import * as provincesService from "../../service/ProvinceService";
import {AdminContext} from "../../context/AdminContext";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";
import {motion} from "framer-motion";

const AddRegion = ({open, onClose}) => {
    const [name, setName] = useState("");
    const {aToken} = useContext(AdminContext);
    const {t} = useTranslation();
    const [data, setData] = useState([]);
    const [provinces, setProvinces] = useState([]);

    const getAllProvinces = async () => {
        try {
            const result = await provincesService.apiGetPublicProvinces()
            setProvinces(result.data)
        } catch (error) {
            console.error("Error fetching provinces:", error)
        }
    };


    const handleClearForm = () => {
        setName("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!check()) return;
        try {
            await regionService.addRegion(name, aToken);
            onClose();
            await Swal.fire({
                position: "top-end",
                title: t("region.add.success"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false
            });
            handleClearForm();
        } catch (e) {
            console.log(e.message);
        }
        console.log("Province name:", name);
    };

    const getRegionList = async () => {
        try {
            const result = await regionService.findAll(false, aToken);
            setData(result);
        } catch (e) {
            console.log(e.error);
        }
    };

    useEffect(() => {
        if (aToken) {
            getRegionList()
            getAllProvinces()

        }
    }, [aToken]);

    const check = () => {
        const exists = data.some(
            (region) => region.name.toLowerCase() === name.toLowerCase()
        );
        if (exists) {
            Swal.fire({
                position: "top-end",
                title: t("region.add.ename"),
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false
            });
            return false;
        }
        return true;
    };

    return (
        <Modal open={open} onClose={onClose}>
            <motion.form
                onSubmit={handleSubmit}
                initial={{opacity: 0, scale: 0.8}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.8}}
                transition={{duration: 0.3, ease: "easeOut"}}
            >
                <motion.p
                    className="mb-2 text-lg lg:text-2xl text-primary font-medium"
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.2, duration: 0.5}}
                >
                    {t("region.add.title")}
                </motion.p>

                <motion.div
                    className="bg-white px-8 py-8 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll"
                    initial={{opacity: 0, y: 30}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.4, ease: "easeOut"}}
                >
                    <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
                        <div className="w-full lg:flex-1 flex flex-col gap-4">
                            <motion.div
                                className="flex flex-1 flex-col gap-1"
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{delay: 0.3, duration: 0.5}}
                            >
                                {/*<p>{t("region.add.name")}</p>*/}

                                <motion.select
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border-2 border-gray-300 rounded-lg px-4 py-2 w-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{duration: 0.3}}
                                >
                                    <option value="" className="text-gray-400">{t("region.add.name")}</option>
                                    {
                                        provinces.map((item, index) => (
                                            <option key={index} value={item.name} className="text-gray-700">
                                                {item.name}
                                            </option>
                                        ))
                                    }
                                </motion.select>
                            </motion.div>
                        </div>
                    </div>

                    <motion.div
                        className="flex justify-end gap-3"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.5, duration: 0.5}}
                    >
                        <motion.button
                            onClick={() => {
                                handleClearForm();
                                onClose();
                            }}
                            type="button"
                            className="bg-red-500 px-10 py-3 mt-4 text-white rounded-full"
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            {t("region.add.cancel")}
                        </motion.button>

                        <motion.button
                            type="submit"
                            className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            {t("region.add.save")}
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.form>
            {/*<motion.input*/}
            {/*    onChange={(e) => setName(e.target.value)}*/}
            {/*    value={name}*/}
            {/*    className="border rounded px-3 py-2"*/}
            {/*    type="text"*/}
            {/*    placeholder="Đà Nẵng"*/}
            {/*    required*/}
            {/*    autoFocus*/}
            {/*    whileFocus={{scale: 1.02, borderColor: "#00BFFF"}}*/}
            {/*/>*/}
        </Modal>
    );
};

export default AddRegion;
