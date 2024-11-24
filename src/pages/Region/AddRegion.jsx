import React, {useContext, useEffect, useState} from 'react';
import Modal from "../../components/Modal/Modal";
import * as regionService from "../../service/RegionService";
import {AdminContext} from "../../context/AdminContext";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";


const AddRegion = ({ open, onClose }) => {
    const [name, setName] = useState('');
    const{aToken} = useContext(AdminContext);
    const {t}= useTranslation();
    const [data, setData] = useState([]);


    const handleClearForm = () => {
        setName('');
    };

    const handleSubmit =async (e) => {
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
                timer: 1500
            });
            handleClearForm()
        } catch (e) {
            console.log(e.message)
        }
        console.log('Province name:', name);
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
            getRegionList();
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
            });
            return false;
        }
        return true;
    };


    return (
        <Modal open={open} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <p className="mb-3 text-lg lg:text-2xl text-primary font-medium">{t("region.add.title")}</p>

                <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
                    <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
                        <div className="w-full lg:flex-1 flex flex-col gap-4">
                            <div className="flex flex-1 flex-col gap-1">
                                <p>{t("region.add.name")}</p>
                                <input
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    className="border rounded px-3 py-2"
                                    type="text"
                                    placeholder="Đà Nẵng"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => {
                                handleClearForm();
                                onClose();
                            }}
                            type="button"
                            className="bg-red-500 px-10 py-3 mt-4 text-white rounded-full"
                        >
                            {t("region.add.cancel")}
                        </button>

                        <button

                            type="submit"
                            className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
                        >
                            {t("region.add.save")}
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default AddRegion;
