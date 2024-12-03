import React, {useContext, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {AdminContext} from "../../context/AdminContext";
import {useQuery} from "@tanstack/react-query";
import * as forumService from "../../service/ForumService";
import {assets} from "../../assets/assets";
import {forEach} from "react-bootstrap/ElementChildren";

const TopUserActive = () => {

    const {t} = useTranslation()
    const {aToken} = useContext(AdminContext)

    const {data, isLoading, isError, refetch} = useQuery({
        queryKey: ["active"],
        queryFn: async () => {

        }
    })


    // const effect = () => {
    //     const labels = document.querySelectorAll("label");
    //     labels.forEach((label) => {
    //         label.innerHTML = label.innerText
    //             .split("")
    //             .map((letter, i) =>
    //                 `<span className="inline-flex tracking-[0.05rem] transition-all duration-500 ease-in-out
    //                 peer-valid:text-amber-700 peer-focus:text-amber-700
    //                 transition-delay: ${i * 50}ms
    //                 peer-valid:tracking-[0.15em] peer-focus:tracking-[0.15em]
    //                 peer-focus:translate-y-[-25px] peer-valid:translate-y-[-25px]
    //                 "
    //
    //                 >${letter}</span>`
    //
    //             )
    //             .join("");
    //     });
    // };
    //
    // useEffect(() => {
    //     effect();
    // }, []);

    return (
        <div className="w-full h-screen">
            {/*<form className="w-[20vw] h-[20vh] bg-gray-500">*/}
            {/*    <div className="relative w-[400px]">*/}
            {/*        <input*/}
            {/*            required*/}
            {/*            type="text"*/}
            {/*            className="peer relative text-white bg-transparent pt-[10px] pl-[10px]*/}
            {/*            border-b-2 border-white outline-none*/}
            {/*            focus:border-b-[2px] focus:border-b-amber-700 valid:border-b-[2px]*/}
            {/*            valid:border-b-amber-700*/}
            {/*            focus:tracking-[0.15em] valid:tracking-[0.15em]*/}
            {/*            "*/}
            {/*        />*/}
            {/*        <label*/}
            {/*            className="text-white absolute left-0 pt-[10px] pl-[10px] pointer-events-none uppercase*/}
            {/*            peer-valid:text-amber-700 peer-focus:text-amber-700*/}
            {/*            peer-valid:tracking-[0.15em] peer-focus:tracking-[0.15em]*/}
            {/*            peer-focus:translate-y-[-25px] peer-valid:translate-y-[-25px]*/}
            {/*            transition-transform duration-500"*/}
            {/*        >*/}

            {/*            <span className="relative tracking-[0.05em] inline-flex transition-all duration-900">*/}
            {/*                TEST &nbsp; mj*/}
            {/*            </span>*/}
            {/*        </label>*/}
            {/*    </div>*/}
            {/*</form>*/}

            <div className='flex w-[500px] h-[500px] flex-col '>
                <div className='flex flex-col flex-1 items-center justify-center'>
                    <img src={assets.upload_area} alt='top1'
                         className='[background:linear-gradient(45deg,#e0e7ff,#d1d5db_50%,#e0e7ff)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.300/.48)_80%,_theme(colors.blue.400)_86%,_theme(colors.blue.300)_90%,_theme(colors.blue.400)_94%,_theme(colors.slate.300/.48))_border-box]
                     border rounded-full border-transparent animate-border'/>
                    <p>name</p>
                </div>

                    <div
                        className='flex relative max-w-[300px] w-[300px] h-[400px] rounded-[20px] rounded-tl-[70px] overflow-hidden bg-amber-400'>
                        <div className='absolute inset-[10px] rounded-[10px] bg-gray-500  '>
                            <div
                                className='absolute w-[140px] h-[140px] bg-amber-400 rounded-br-[50%] transition-all duration-500 hover:w-full'>
                                <span
                                    className=' absolute bottom-[-30px] left-0 w-[30px] h-[30px] rounded-tl-[30px] bg-transparent shadow-custom4'></span>

                                <span
                                    className='absolute right-[-30px] top-0 w-[30px] h-[30px] rounded-tl-[30px] bg-transparent shadow-custom4'></span>
                                <div
                                    className='flex justify-center items-center absolute inset-[10px] bg-gray-500 rounded-[50%]  rounded-tr-[10px]  rounded-bl-[10px] '>

                                </div>
                            </div>
                            <div className=''>
                                {/*content*/}
                            </div>

                        </div>
                    </div>


                {/*<div className='flex flex-col justify-between relative w-[320px] h-[400px] gap-2.5'>*/}
                {/*    <div className='relative w-full h-[240px] bg-amber-400 rounded-[15px] '>*/}
                {/*        <span className='absolute bottom-0 left-[50%] w-[20px] h-[20px]*/}
                {/*        rounded-[50%] bg-transparent shadow-custom3'></span>*/}

                {/*        <span className='absolute bottom-[70px] left-0 w-[20px] h-[20px]*/}
                {/*        rounded-[50%] bg-transparent shadow-custom3'></span>*/}

                {/*    </div>*/}
                {/*    <div className='relative w-full h-[150px] rounded-[15px] bg-green-600 rounded-tl-none'>*/}
                {/*        <span className='absolute top-[-80px] h-[80px] bg-green-600 w-[50%] border-t-[10px] border-[#F8F9FD] border-r-[10px] rounded-tr-[25px]*/}
                {/*       '>*/}
                {/*            <span*/}
                {/*                className='absolute w-[25px] h-[25px] rounded-[50%] bg-transparent shadow-custom '>*/}
                {/*            </span>*/}
                {/*            <span*/}
                {/*                className='absolute bottom-0 right-[-25px] w-[25px] h-[25px] bg-transparent rounded-[50%] shadow-custom2 '>*/}
                {/*            </span>*/}
                {/*        </span>*/}
                {/*    </div>*/}

                {/*</div>*/}


                <div className='flex-1 bg-green-600'>

                </div>
            </div>
        </div>
    );
};

export default TopUserActive;
