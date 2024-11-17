import {createContext, useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken')
        ? localStorage.getItem('aToken') : '');

    const backendUrl = import.meta.env?.BACKEND_URL || 'http://localhost:4000';


    const value = {
        backendUrl, aToken, setAToken
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;
