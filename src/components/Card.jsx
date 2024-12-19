import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import {CircleEllipsis} from 'lucide-react'
import {motion, AnimatePresence} from "framer-motion";
import Modal from "./Modal/Modal";
import {FaRegTrashAlt} from "react-icons/fa";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";
import * as forumService from "../service/ForumService";
import {AdminContext} from "../context/AdminContext";
import {useNavigate} from "react-router-dom";

const Card = ({email, image, content, title, date, totalComments, name, id, refetch, value}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [open, setOpen] = useState(false)
    const {t} = useTranslation()
    const {aToken,refetchAdminDetails, adminDetails, readOnly, writeOnly, fullAccess} = useContext(AdminContext)
    const [idP, setIdP] = useState('')
    const navigate = useNavigate()

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleDelete = () => {
        setIsMenuOpen(false);
        setOpen(true)
        setIdP(id)
    };

    const close = () =>{
        setOpen(false)
        setIdP('')
    }

    const handleEdit = () => {
        setIsMenuOpen(false);
        navigate(`/update-post/${id}`, {state: {name: value}})
    };

    const softDeletePost = async () => {
        try {
            await forumService.softDelete(idP, aToken);
            await refetch();
            setOpen(false);
            setIdP('');
            await Swal.fire({
                position: "top-end",
                title: t("forum.list.dsuccess"),
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error(error.message);
            alert("Error deleting posts: " + error.message);
        }
    };

    useEffect(() => {
        refetchAdminDetails()
    }, [adminDetails]);
    return (
        <StyledWrapper>
            <div className="task" draggable="true">
                <div className="tags">
                    <span className="tag">{title}</span>
                    <div className="menu-wrapper">
                        <button className="options" onClick={toggleMenu}>
                            <CircleEllipsis/>
                        </button>
                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    className="menu"
                                    initial={{opacity: 0, y: -10}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -10}}
                                    transition={{duration: 0.2}}
                                >
                                    <button className='hover:text-sky-500' onClick={handleEdit}>
                                        {t("forum.list.edit")}
                                    </button>

                                        <button className={`${(readOnly && !writeOnly && !fullAccess && aToken) ? 'cursor-not-allowed' : 'cursor-pointer'} hover:text-red-600`}
                                                onClick={handleDelete}
                                                disabled={readOnly && !writeOnly && !fullAccess && aToken}
                                        >
                                            {t("forum.list.confirm")}
                                        </button>

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <p className='content'>{content}</p>
                <div className="stats">
                    <div>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <g strokeWidth={0} id="SVGRepo_bgCarrier"/>
                                <g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"/>
                                <g id="SVGRepo_iconCarrier">
                                    <path strokeLinecap="round" strokeWidth={2} d="M12 8V12L15 15"/>
                                    <circle strokeWidth={2} r={9} cy={12} cx={12}/>
                                </g>
                            </svg>
                            {date}
                        </div>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <g strokeWidth={0} id="SVGRepo_bgCarrier"/>
                                <g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"/>
                                <g id="SVGRepo_iconCarrier">
                                    <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5"
                                          d="M16 10H16.01M12 10H12.01M8 10H8.01M3 10C3 4.64706 5.11765 3 12 3C18.8824 3 21 4.64706 21 10C21 15.3529 18.8824 17 12 17C11.6592 17 11.3301 16.996 11.0124 16.9876L7 21V16.4939C4.0328 15.6692 3 13.7383 3 10Z"/>
                                </g>
                            </svg>
                            {totalComments}</div>
                    </div>
                    <div className="author">
                        <div className='author-image'>
                            <img className='user-image' src={image} alt={email}/>
                            <p>{name}</p>
                        </div>

                    </div>
                </div>
            </div>

                {open && (
                    <Modal open={open} onClose={() => setOpen(false)}>
                        <motion.div className="text-center w-72" initial={{scale: 0.8, opacity: 0}}
                                    animate={{scale: 1, opacity: 1}} exit={{scale: 0.8, opacity: 0}}>
                            <FaRegTrashAlt size={56} className="mx-auto text-red-500"/>
                            <div className="mx-auto my-4 w-60">
                                <h3 className="text-lg font-black text-gray-800">{t("forum.list.confirmDelete")}</h3>
                                <p className="text-sm text-gray-600">{t("forum.list.pCD")}</p>
                            </div>
                            <div className="flex gap-4 mt-6">

                                <button onClick={softDeletePost}
                                        className="flex-1 text-white bg-gradient-to-r from-red-500 to-red-700 py-2 rounded-md transition duration-150">
                                    {t("forum.list.confirm")}
                                </button>

                                <button onClick={close}
                                        className="flex-1 bg-gray-200 text-gray-600 hover:bg-gray-300 py-2 rounded-md transition duration-150">
                                    {t("forum.list.cancel")}
                                </button>
                            </div>
                        </motion.div>
                    </Modal>
                )}


        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
    .task {
        position: relative;
        color: #2e2e2f;
        cursor: move;
        background-color: #fff;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
        margin-bottom: 1rem;
        border: 3px dashed transparent;
        max-width: 350px;
        width: 350px;
        height: 150px;

    }

    .content {
        max-width: 300px;
        max-height: 100px;
        overflow: hidden; /* Ensures content does not overflow the container */
        text-overflow: ellipsis; /* Adds ... for overflowed text */
        white-space: nowrap; /* Prevents text wrapping to the next line */
    }


    .author-image {
        display: flex;
        justify-content: center;
        gap: 5px;
        width: 25px;
        height: 25px;
    }

    .user-image {
        width: 100%;
        height: 100%;
        border-radius: 100%;
        object-fit: cover;
    }

    .task:hover {
        box-shadow: rgba(99, 99, 99, 0.3) 0px 2px 8px 0px;
        border-color: rgba(162, 179, 207, 0.2) !important;
    }

    .task p {
        font-size: 15px;
        margin: 1.2rem 0;
    }

    .tag {
        border-radius: 100px;
        padding: 4px 13px;
        font-size: 12px;
        color: #ffffff;
        background-color: #1389eb;
    }

    .tags {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .options {
        background: transparent;
        border: 0;
        color: #c4cad3;
        font-size: 17px;
    }

    .options svg {
        fill: #9fa4aa;
        width: 20px;
    }

    .stats {
        position: relative;
        width: 100%;
        color: #9fa4aa;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .stats div {
        margin-right: 1rem;
        height: 20px;
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .stats svg {
        margin-right: 5px;
        height: 100%;
        stroke: #9fa4aa;
    }

    .menu-wrapper {
        position: relative;
    }

    .menu {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 10;
        display: flex;
        flex-direction: column;
        width: 150px;
    }

    .menu button {
        padding: 8px 16px;
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
    }

    .menu button:hover {
        background: #f1f1f1;
    }

`

export default Card;
