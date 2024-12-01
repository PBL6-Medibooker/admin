import React, {useContext} from 'react';
import {useTranslation} from "react-i18next";
import {AdminContext} from "../../context/AdminContext";
import {useQuery} from "@tanstack/react-query";
import * as forumService from "../../service/ForumService";
import {assets} from "../../assets/assets";


const TopUserActive = () => {

    const {t} = useTranslation()
    const {aToken} = useContext(AdminContext)

    const {data,isLoading, isError, refetch} = useQuery({
        queryKey: ["active"],
        queryFn: async () => {

        }
    })

    return (
        <div className="w-full h-screen">
            <p></p>
            <div className='flex w-[500px] h-[500px] flex-col '>
                <div className='flex flex-col flex-1 items-center justify-center'>
                    <img src={assets.upload_area} alt='top1'/>
                    <p>name</p>

                </div>

                <div className='flex-1 bg-green-600'>

                </div>
            </div>
        </div>
    );
};

export default TopUserActive;
