import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import * as specialityService from "../../service/SpecialityService";
import { AdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const AddSpeciality = () => {
    const [specImg, setSpecImg] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const { aToken } = useContext(AdminContext);
    const [specialities, setSpecialities] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const findAllSpecialities = async () => {
        try {
            const result = await specialityService.findAll(false, aToken);
            setSpecialities(result);
        } catch (error) {
            console.error("Error fetching specialities:", error);
        }
    };

    useEffect(() => {
        if(aToken){
            findAllSpecialities();
        }
    }, [aToken]);

    const check = () => {
        const exists = specialities.some(
            (speciality) => speciality.name.toLowerCase() === name.toLowerCase()
        );
        if (exists) {
            Swal.fire({
                position: "top-end",
                title: t("speciality.add.name"),
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
            });
            return false;
        }
        return true;
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!specImg) {
            await Swal.fire({
                position: "top-end",
                title: t("speciality.add.image"),
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        if (!check()) return;

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("speciality_image", specImg);

        try {
            const data = await specialityService.addSpec(formData, aToken);
            if (data) {
                await Swal.fire({
                    position: "top-end",
                    title: t("speciality.add.success"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
                navigate("/speciality");
            } else {
                await Swal.fire({
                    position: "top-end",
                    title: t("speciality.add.error"),
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.error || "Something went wrong";
            console.error("Error:", errorMessage);
        }
    };

    return (
        <motion.div
            className="w-full h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.h1
                className="flex justify-items-start ml-5 text-2xl font-bold text-primary mt-4"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {t("speciality.add.title")}
            </motion.h1>

            <motion.div
                className="flex justify-center items-center w-full mt-4 bg-gray-50"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.form
                    onSubmit={onSubmitHandler}
                    className="bg-white p-12 rounded-xl shadow-xl w-full max-w-3xl"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <motion.div
                        className="mb-8 flex flex-col items-center"
                        whileHover={{ scale: 1.05 }}
                    >
                        <label
                            htmlFor="spec-img"
                            className="flex flex-col items-center gap-3 cursor-pointer"
                        >
                            <motion.img
                                src={
                                    specImg
                                        ? URL.createObjectURL(specImg)
                                        : assets.upload_area
                                }
                                alt="Upload Area"
                                className="w-32 h-32 object-cover rounded-full bg-gray-100"
                                whileHover={{ scale: 1.1 }}
                            />
                            <span className="text-gray-500 text-sm">
                                {t("speciality.add.upload")}
                            </span>
                        </label>
                        <input
                            type="file"
                            id="spec-img"
                            hidden
                            onChange={(e) => setSpecImg(e.target.files[0])}
                        />
                    </motion.div>

                    <div className="mb-6">
                        <label
                            htmlFor="name"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            {t("speciality.add.sname")}
                        </label>
                        <motion.input
                            id="name"
                            type="text"
                            placeholder='Dermatologist'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-lg px-4 py-3 text-base focus:ring-primary focus:outline-none focus:ring-2"
                            required
                            whileFocus={{ scale: 1.02 }}
                        />
                    </div>

                    <div className="mb-8">
                        <label
                            htmlFor="description"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            {t("speciality.add.des")}
                        </label>
                        <motion.textarea
                            id="description"
                            placeholder={t("speciality.add.desPlaceholder")}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="6"
                            className="w-full border rounded-lg px-4 py-3 text-base focus:ring-primary focus:outline-none focus:ring-2"
                            required
                            whileFocus={{ scale: 1.02 }}
                        />
                    </div>

                    <motion.div className="flex justify-end gap-4 items-center">
                        <motion.button
                            type="button"
                            onClick={() => navigate("/speciality")}
                            className="bg-red-500 text-white px-8 py-3 rounded-lg text-lg font-medium"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {t("speciality.add.back")}
                        </motion.button>
                        <motion.button
                            type="submit"
                            className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-medium"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {t("speciality.add.save")}
                        </motion.button>
                    </motion.div>
                </motion.form>
            </motion.div>
        </motion.div>
    );
};

export default AddSpeciality;
