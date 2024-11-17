import Modal from '../../components/Modal';
import {FaRegTrashAlt} from "react-icons/fa";


const DeleteActiveHoursModal = ({ open, onClose, onDelete, data }) => {


    return (
        <Modal open={open} onClose={onClose}>
            <div className="text-center w-72">
            <FaRegTrashAlt size={56} className="mx-auto text-red-500" />
            <div className="mx-auto my-4 w-60">
                <h3 className="text-lg font-black text-gray-800">Confirm Delete</h3>
                <p className="text-sm text-gray-600">
                    Are you sure you want to delete this active hour?
                </p>
            </div>
            <div className="flex gap-4 mt-6">
                <button
                    className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 shadow-md shadow-red-400/40 hover:from-red-600 hover:to-red-800 py-2 rounded-md transition duration-150"
                    onClick={onDelete} // Trigger the deletion
                >
                    Delete
                </button>
                <button
                    className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150"
                    onClick={onClose} // Close modal without deleting
                >
                    Cancel
                </button>
            </div>
        </div>

        </Modal>

    );
};

export default DeleteActiveHoursModal;
