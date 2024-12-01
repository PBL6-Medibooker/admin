import React from 'react';
import Modal from "../../components/Modal/ProofModal";

const ViewProofModal = ({open, onClose, proof}) => {
    return (
        <Modal open={open} onClose={onClose}>
             <iframe
                src={proof}
                width="100%"
                height="700px">
            </iframe>

        </Modal>
    );
};

export default ViewProofModal;
