import React, {useContext, useEffect, useState} from 'react';
import Modal from '../../components/Modal/ModalMedium';
import {toast} from "react-toastify";
import * as accountService from "../../service/AccountService";
import {AdminContext} from "../../context/AdminContext";


const ActiveHourModal = ({ open, onClose, id, cancel }) => {

    const {aToken} = useContext(AdminContext);

    const [activeHour, setActiveHour] = useState({
        day: '',
        start_time: '',
        end_time: '',
        hour_type: 'working',
        appointment_limit: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setActiveHour((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { day, start_time, end_time, hour_type, appointment_limit } = activeHour;


            const [startHour, startMinute] = start_time.split(":").map(Number);
            const [endHour, endMinute] = end_time.split(":").map(Number);


            const startTimeInMinutes = startHour * 60 + startMinute;
            const endTimeInMinutes = endHour * 60 + endMinute;


            if (endTimeInMinutes <= startTimeInMinutes) {
                toast.error("End time must be later than start time");
                return;
            }

            const result = await accountService.addDoctorActiveHours(activeHour, id, aToken);

            if (result) {
                onClose()

                console.log("Active hour added successfully:", result);
                toast.success("Active hour added successfully");
            } else {
                toast.error("Failed to add active hour.");
            }
        } catch (e) {
            console.log("Error adding active hour:", e);
            toast.error(e.message || "Error adding active hour.");
        }

        console.log(activeHour);
    };


    return (
        <Modal open={open} onClose={onClose}>
            <h1 className='text-primary font-medium '>Add Active Hour</h1>
            <form onSubmit={handleSubmit}
                  className="flex flex-col ml-9 justify-center items-center p-6 bg-white rounded max-w-lg w-full">

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
                            className="bg-green-500 text-white w-[100px] p-2 rounded"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </Modal>

    );
};

export default ActiveHourModal;
