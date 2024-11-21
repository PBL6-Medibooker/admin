import Modal from '../../components/Modal/Modal';
import {FaRegTrashAlt} from "react-icons/fa";
import {useTranslation} from "react-i18next";


const DeleteActiveHoursModal = ({ open, onClose, onDelete, data }) => {

const {t} = useTranslation()
    return (
        <Modal open={open} onClose={onClose}>
            <div className="text-center w-72">
            <FaRegTrashAlt size={56} className="mx-auto text-red-500" />
            <div className="mx-auto my-4 w-60">
                <h3 className="text-lg font-black text-gray-800"> {t("account.active.confirm")}</h3>
                <p className="text-sm text-gray-600">
                    {t("account.active.p")}
                </p>
            </div>
            <div className="flex gap-4 mt-6">
                <button
                    className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 shadow-md shadow-red-400/40 hover:from-red-600 hover:to-red-800 py-2 rounded-md transition duration-150"
                    onClick={onDelete}
                >
                    {t("account.active.bd")}
                </button>
                <button
                    className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150"
                    onClick={onClose}
                >
                    {t("account.active.cancel")}
                </button>
            </div>
        </div>

        </Modal>

    );
};

export default DeleteActiveHoursModal;
