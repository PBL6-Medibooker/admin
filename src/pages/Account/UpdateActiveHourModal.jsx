import React, {useContext, useEffect, useState} from 'react';
import Modal from '../../components/ModalMedium';
import {toast} from "react-toastify";
import * as accountService from "../../service/AccountService";
import {AdminContext} from "../../context/AdminContext";


const UpdateActiveHourModal = ({ open, onClose, data,accountId, cancel }) => {

    const {aToken} = useContext(AdminContext);


    const [activeHour, setActiveHour] = useState({
        day: '',
        start_time: '',
        end_time: '',
        hour_type: '',
        appointment_limit: '',
        old_day: '',
        old_start_time: '',
        old_end_time: '',
        old_hour_type: '',
    });

    const getOldActiveHour = async () => {
        if (data) {
            setActiveHour({
                day: data.day || '',
                start_time: data.start_time || '',
                end_time: data.end_time || '',
                hour_type: data.hour_type || '',
                appointment_limit: data.appointment_limit || '',
                old_day: data.day || '',
                old_start_time: data.start_time || '',
                old_end_time: data.end_time || '',
                old_hour_type: data.hour_type || '',
            });
        }
    };

    useEffect(() => {
        if(aToken){
            getOldActiveHour()
        }
    }, [aToken,data]);

    const formatTime = (time) => {
        const [hour, minute] = time.split(":");
        return `${hour?.padStart(2, "0")}:${minute?.padStart(2, "0")}`;
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        let formattedValue = value;

        // Only format if the input is of type 'time'
        if (type === "time") {
            formattedValue = formatTime(value);
        }

        setActiveHour((prev) => ({ ...prev, [name]: formattedValue }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { day, start_time, end_time, hour_type } = activeHour;

            const activeHourDetails = {
                day: activeHour.day,
                start_time: activeHour.start_time,
                end_time: activeHour.end_time,
                hour_type: activeHour.hour_type,
                appointment_limit: activeHour.appointment_limit,
                old_day: activeHour.old_day,
                old_start_time: activeHour.old_start_time,
                old_end_time: activeHour.old_end_time,
                old_hour_type: activeHour.old_hour_type,
            };


            const [startHour, startMinute] = start_time.split(":").map(Number);
            const [endHour, endMinute] = end_time.split(":").map(Number);

            const startTimeInMinutes = startHour * 60 + startMinute;
            const endTimeInMinutes = endHour * 60 + endMinute;

            if (endTimeInMinutes <= startTimeInMinutes) {
                toast.error("End time must be later than start time");
                return;
            }

            const result = await accountService.updateDoctorActiveHour(activeHourDetails, accountId, aToken);

            if (result) {
                onClose()
                console.log("Active hour updated successfully:", result);
                toast.success("Active hour updated successfully");
            } else {
                toast.error("Failed to update active hour.");
            }
        } catch (e) {
            console.log("Error updating active hour:", e);
            toast.error(e.message || "Error updating active hour.");
        }

        console.log(activeHour);
    };


    return (
        <Modal open={open} onClose={onClose}>
            <h1 className='text-primary font-medium '>Update Active Hour</h1>
            <form onSubmit={handleSubmit}
                  className="flex flex-col justify-center items-center p-6 ml-9 bg-white rounded max-w-lg w-full">

                <div className="flex flex-col">
                    <div className="flex gap-3">
                        <div>
                            <label>Day of the Week</label>
                            <select
                                name="day"
                                value={activeHour.day}
                                onChange={handleInputChange}
                                required
                                className="border p-2 rounded"
                            >
                                <option value="">Select a Day</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                            </select>
                        </div>

                        <div>
                            <label>Start Time</label>
                            <input
                                type="time"
                                name="start_time"
                                value={activeHour.start_time}
                                onChange={handleInputChange}
                                required
                                className="border p-2 rounded"
                            />
                        </div>

                        <div>
                            <label>End Time</label>
                            <input
                                type="time"
                                name="end_time"
                                value={activeHour.end_time}
                                onChange={handleInputChange}
                                required
                                className="border p-2 rounded"
                            />
                        </div>

                        <div>
                            <label>Type</label>
                            <select
                                name="hour_type"
                                value={activeHour.hour_type}
                                onChange={handleInputChange}
                                required
                                className="border p-2 rounded"
                            >
                                <option value="working">Working</option>
                                <option value="appointment">Appointment</option>
                            </select>
                        </div>


                        <div>
                            <label>Limit</label>
                            <input
                                type="number"
                                name="appointment_limit"
                                value={activeHour.appointment_limit}
                                onChange={handleInputChange}
                                required
                                className="border w-[90px] p-2 rounded"
                            />
                        </div>
                    </div>

                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            type="button"
                            onClick={cancel}
                            className="bg-gray-300 p-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 text-white w-[150px] p-2 rounded"
                        >
                            Save Update
                        </button>
                    </div>
                </div>
            </form>
        </Modal>

    );
};

export default UpdateActiveHourModal;
