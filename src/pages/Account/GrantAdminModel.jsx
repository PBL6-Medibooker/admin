import React, {useContext, useEffect, useState} from 'react';
import ModalInsuranceMedium from "../../components/Modal/ModalGrant";
import {AdminContext} from "../../context/AdminContext";
import {useTranslation} from "react-i18next";
import * as adminService from "../../service/AdminService";
import Swal from "sweetalert2";
import {motion} from "framer-motion";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import Error from "../../components/Error";

const GrantAdminModel = ({open, id, onClose, selectedId}) => {

    const {aToken} = useContext(AdminContext);
    const {t} = useTranslation();
    const [access, setAccess] = useState({
        user_id: '',
        read_access: false,
        write_access: false,
        admin_write_access: false
    })
    const navigate = useNavigate()

    const { data: adminDetails = {}, refetch: refetchAdminDetails } = useQuery({
        queryKey: ["adminDetails"],
        queryFn: async () => {
            try {
                const response = await adminService.getAccessDetail(selectedId);
                console.log(selectedId)
                console.log(response)
                setAccess({
                    user_id: response.user_id?._id,
                    read_access: response.read_access,
                    write_access: response.write_access,
                    admin_write_access: response.admin_write_access
                })

                return response
            } catch (error) {
                console.log(error)
            }
        },
        enabled: !!aToken,
    })


    const openChangeRoleModal = async () => {
        Swal.fire({
            title: t("account.update.aru"),
            text: t("account.update.arut"),
            icon: "question",
            showCancelButton: true,
            confirmButtonText: t("account.update.grant"),
            cancelButtonText: t("account.update.cancel"),
        }).then((result) => {
            if (result.isConfirmed) {
                grantAdmin()
                console.log("Access granted!");
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                console.log("Action canceled!");
            }
        });

    }

    const grantAdmin = async () => {
        try {
            const formData = {
                user_id: id,
                read_access: access.read_access,
                write_access: access.write_access,
                admin_write_access: access.admin_write_access
            }
            console.log('form data', formData)
            await adminService.addAdmin(formData, aToken);
            onClose()
            navigate('/admin-account')
            await Swal.fire({
                position: "top-end",
                title: t("account.admin.gsuccess"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false
            })
        } catch (e) {
            console.error(e);
        }
    };

    const updateAccess = async () => {
        try {
            const formData = {
                access_id: adminDetails._id,
                read_access: access.read_access,
                write_access: access.write_access,
                admin_write_access: access.admin_write_access
            }
            console.log('form data', formData)
            await adminService.updateAdminAccessAccount(formData, aToken)
            onClose()
            await Swal.fire({
                position: "top-end",
                title: t("account.admin.usuccess"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                backdrop: false
            })
        } catch (e) {
            console.error(e);
        }
    }

    const handleAccessChange = (type) => {
        setAccess({
            ...access,
            read_access: type === "read_access",
            write_access: type === "write_access",
            admin_write_access: type === "admin_write_access",
        });
    };

    useEffect(() => {
        if (aToken && selectedId) {
            refetchAdminDetails()
            console.log('access',access)
        }
    }, [aToken, selectedId]);


    return (
        <ModalInsuranceMedium open={open} onClose={onClose}>
            <motion.div
                initial={{scale: 0.8, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                exit={{scale: 0.8, opacity: 0}}
                transition={{duration: 0.3}}
                className="p-6 bg-white rounded-lg w-full max-w-lg mx-auto"
            >
                <motion.h1
                    initial={{y: -20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{duration: 0.5, delay: 0.1}}
                    className="text-2xl text-primary font-semibold mb-6 text-center"
                >
                    {t("account.admin.gtitle")}
                </motion.h1>

                <form  className="space-y-6">
                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.2}}
                        className="space-y-4"
                    >
                        {["read_access", "write_access", "admin_write_access"].map((type, index) => (
                            <motion.div
                                key={type}
                                transition={{duration: 0.2}}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="radio"
                                    id={type}
                                    name="accessOption"
                                    value={access}
                                    checked={access[type]}
                                    onChange={() => handleAccessChange(type)}
                                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                                />
                                <label htmlFor={type} className="text-sm font-medium text-gray-700">
                                    {t(`account.admin.${type[0]}`)}
                                </label>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="flex justify-end gap-4 mt-6">
                        <motion.button
                            whileTap={{scale: 0.95}}
                            whileHover={{scale: 1.05}}
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-gray-700 p-2 w-32 rounded-lg hover:bg-gray-400 hover:text-white transition"
                        >
                            {t("appointment.update.back")}
                        </motion.button>
                        {
                            access.user_id !== ''
                                ?
                                <motion.button
                                    whileTap={{scale: 0.95}}
                                    whileHover={{scale: 1.05}}
                                    type="button"
                                    onClick={updateAccess}
                                    className="bg-primary text-white w-32 p-2 rounded-lg transition"
                                >
                                    {t("appointment.update.save")}
                                </motion.button>
                                : <motion.button
                                    whileTap={{scale: 0.95}}
                                    whileHover={{scale: 1.05}}
                                    type="button"
                                    onClick={openChangeRoleModal}
                                    className="bg-primary text-white w-32 p-2 rounded-lg transition"
                                >
                                    {t("appointment.update.save")}
                                </motion.button>
                        }
                    </div>
                </form>
            </motion.div>
        </ModalInsuranceMedium>
    );
};

export default GrantAdminModel;
