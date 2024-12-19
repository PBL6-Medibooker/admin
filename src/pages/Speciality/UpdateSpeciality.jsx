import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as specialityService from "../../service/SpecialityService";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { motion } from "framer-motion";
import {useTranslation} from "react-i18next";

const UpdateSpeciality = () => {
    const { aToken, backendUrl, refetchAdminDetails, adminDetails, readOnly, writeOnly, fullAccess } = useContext(AdminContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [specialities, setSpecialities] = useState([]);
    const [image, setImage] = useState(null);
    const [specData, setSpecData] = useState({
        name: "",
        description: "",
        speciality_image: null,
    });
    const {t}= useTranslation();
    const [read, setRead] = useState(false)

    const loadSpecData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/special/get-spec/${id}`, { headers: { aToken } });
            if(readOnly && !writeOnly && !fullAccess){
                setRead(true)
            }
            if (data.success) {
                setSpecData({
                    name: data.specData.name,
                    description: data.specData.description,
                    speciality_image: data.specData.speciality_image,
                });
            } else {
                toast.error(data.message);
            }
        } catch (e) {
            toast.error(e.message);
        }
    };

    const findAllSpecialities = async () => {
        const result = await specialityService.findAll(false, aToken);
        setSpecialities(result);
    };

    const updateSpecialityData = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", specData.name);
            formData.append("description", specData.description);
            if (image) {
                formData.append("speciality_image", image);
            }

            const data = await specialityService.updateSpec(formData, id, aToken);
            if (data) {
                toast.success(data.message);
                navigate("/speciality", { state: { imageUpdated: true } });
            }
            await findAllSpecialities();
        } catch (e) {
            toast.error(e.message);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    useEffect(() => {
        if (aToken) {
            loadSpecData()
        }
    }, [aToken]);

    return (
        <motion.div
            className="w-full h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.h1
                className="flex justify-items-start ml-5 text-3xl font-bold text-primary mt-5"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {t("speciality.add.update")}
            </motion.h1>

            <motion.div
                className="flex justify-center items-center w-full h-screen bg-gray-50"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.form
                    onSubmit={updateSpecialityData}
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
                            htmlFor="doc-img"
                            className="flex flex-col items-center gap-3 cursor-pointer"
                        >
                            <motion.img
                                src={
                                    image
                                        ? URL.createObjectURL(image)
                                        : specData.speciality_image
                                }
                                alt="Upload Area"
                                className="w-32 h-32 object-cover rounded-full bg-gray-100"
                                whileHover={{ scale: 1.1 }}
                            />
                            <span className="text-gray-500 text-sm">{t("speciality.add.upload")}</span>
                        </label>
                        <input
                            onChange={handleImageChange}
                            type="file"
                            id="doc-img"
                            hidden
                            disabled={read}
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
                            placeholder="Enter speciality name"
                            value={specData.name}
                            onChange={(e) =>
                                setSpecData((prev) => ({ ...prev, name: e.target.value }))
                            }
                            className="w-full border rounded-lg px-4 py-3 text-base focus:ring-primary focus:outline-none focus:ring-2"
                            required
                            whileFocus={{ scale: 1.02 }}
                            disabled={read}

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
                            placeholder= {t("speciality.add.desPlaceholder")}
                            value={specData.description}
                            onChange={(e) =>
                                setSpecData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            rows="6"
                            className="w-full border rounded-lg px-4 py-3 text-base focus:ring-primary focus:outline-none focus:ring-2"
                            required
                            whileFocus={{ scale: 1.02 }}
                            disabled={read}

                        />
                    </div>

                    <motion.div className="flex justify-end gap-4 items-center">
                        <motion.button
                            type="button"
                            onClick={() => navigate("/speciality")}
                            className="bg-red-500 text-white px-8 py-2 rounded-full text-lg font-medium"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {t("speciality.add.back")}
                        </motion.button>
                        <motion.button
                            type="submit"
                            className={`${read ? 'cursor-not-allowed' : 'cursor-pointer'} bg-primary text-white px-8 py-2 rounded-full text-lg font-medium` }
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={read}
                        >
                            {t("speciality.add.save")}
                        </motion.button>
                    </motion.div>
                </motion.form>
            </motion.div>
        </motion.div>
    );
};

export default UpdateSpeciality;
