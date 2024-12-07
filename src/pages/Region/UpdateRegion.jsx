import React, {useContext, useEffect, useState} from 'react';
import Modal from "../../components/Modal/Modal";
import {AdminContext} from "../../context/AdminContext";
import * as regionService from "../../service/RegionService";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";

const UpdateRegion = ({open, onClose, id}) => {

    const [name, setName] = useState('');
    const {aToken} = useContext(AdminContext);
    const {t} = useTranslation();

    const getRegionDetails = async () => {
        const result = await regionService.getRegionDetails(id, aToken);
        if (result?.success) {
            setName(result.data.name);
        } else {
            toast.error(result?.message)
        }
    }

    useEffect(() => {
        if (aToken) {
            getRegionDetails();
        }
    }, [aToken, id]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await regionService.updateRegion(name, id, aToken);
            onClose();
            await Swal.fire({
                position: "top-end",
                title: t("region.update.success"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false
            });
        } catch (e) {
            console.log(e.message)
        }
        console.log('Province name:', name);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <p className="text-lg text-primary font-bold lg:text-2xl">{t("region.update.title")}</p>

                <div className="bg-white px-8 py-8 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
                    <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
                        <div className="w-full lg:flex-1 flex flex-col gap-4">
                            <div className="flex flex-1 flex-col gap-1">
                                <input
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    className="border rounded px-3 py-2"
                                    type="text"
                                    placeholder="Province Name"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => {
                                onClose();
                            }}
                            type="button"
                            className="bg-red-500 px-10 py-3 mt-4 text-white rounded-full"
                        >
                            {t("region.add.cancel")}
                        </button>

                        <button
                            type="submit"
                            className="bg-primary px-7 py-3 mt-4 text-white rounded-full"
                        >
                            {t("region.add.save")}
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default UpdateRegion;
