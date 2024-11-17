import React, {useContext, useState} from 'react';
import {AdminContext} from "../context/AdminContext.jsx";
import axios from "axios";
import {toast} from "react-toastify";
import {DoctorContext} from "../context/DoctorContext";


const Login = () => {

    const [state, setState] = useState('Admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {setAToken, backendUrl} = useContext(AdminContext)
    const {setDToken} = useContext(DoctorContext)


    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {

            if (state === 'Admin') {
                // const {data} = await axios.post(backendUrl + '/acc/admin-login', {email, password});
                // if (data.success) {
                //     localStorage.setItem('aToken', data.token)
                //     setAToken(data.token);
                // } else {
                //     toast.error(data.message);
                // }
                const result = await axios.post(backendUrl + '/acc/login', {email, password});

                if(result.data.role !== 'user' && result.data.role === 'admin'){
                    console.log(result)
                    localStorage.setItem('aToken', result.data.token)
                    setAToken(result.data.token);
                    console.log(result.data.token)
                } else {
                    toast.error('This Only For Admin Only')
                }

            } else {
                const result = await axios.post(backendUrl + '/acc/login', {email, password});
               if(result.data.verified){
                   console.log(result)
                   localStorage.setItem('dToken', result.data.token)
                   setDToken(result.data.token);
                   console.log(result.data.token)
               } else {
                   toast.error('This Only For Doctor Only')
               }
            }

        } catch (e) {
            console.error("Login error:", e);
        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div
                className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
                <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state}</span> Login</p>
                <div className='w-full'>
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)}
                           value={email}
                           className='border border-[#DADADA] rounded w-full p-2 mt-1' type='email' required autoFocus/>
                </div>

                <div className='w-full'>
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)}
                           value={password}
                           className='border border-[#DADADA] rounded w-full p-2 mt-1' type='password' required/>
                </div>
                <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>

                {
                    state === "Admin"
                        ? <p>Doctor Login ? <span className='text-primary underline cursor-pointer'
                                                  onClick={() => setState('Doctor')}>Click here</span></p>
                        : <p>Admin Login ? <span className='text-primary underline cursor-pointer'
                                                 onClick={() => setState('Admin')}>Click here</span></p>
                }

            </div>
        </form>
    );
};

export default Login;
