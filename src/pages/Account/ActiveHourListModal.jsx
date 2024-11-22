import React, {useContext, useEffect, useState} from 'react';
import Modal from '../../components/Modal/ModalLarge';
import {toast} from "react-toastify";
import * as accountService from "../../service/AccountService";
import {AdminContext} from "../../context/AdminContext";
import MUIDataTable from "mui-datatables";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import ActiveHourModal from "./ActiveHourModal";
import {getAccountActiveHourList} from "../../service/AccountService";
import UpdateActiveHourModal from "./UpdateActiveHourModal";
import DeleteActiveHoursModal from "./DeleteActiveHoursModal";
import { IoMdAddCircle } from "react-icons/io";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";

const getMuiTheme = () => createTheme({
    typography: {
        fontFamily: 'Outfit',
        h6: {
            color: '#00A6A9'
        }
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                head: {
                    // padding:''
                },
                body: {
                    padding: '7px 7px 5px 30px',


                }
            }
        }
    }
});

const ActiveHourListModal = ({open, onClose, id}) => {

    const {aToken} = useContext(AdminContext);
    const [activeHours, setActiveHours] = useState([]);

    const muiTheme = getMuiTheme();
    const [createModal, setCreateModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const [activeHour, setActiveHour] = useState(null);
    const [bookedHours, setBookedHours] = useState([]);
    const [fullyBookedHours, setFullyBookedHours] = useState([]);
    const {t} = useTranslation();


    const options = {
        elevation: 0,
        rowsPerPage: 5,
        rowsPerPageOptions: [5, 10, 20, 30],
        onRowClick: (rowData, rowMeta) => {
            const clickedRow = activeHours[rowMeta.dataIndex];
            handleRowClick(clickedRow);
        },
        download: false,
        print: false,
        selectableRows: 'none',
    };


    const handleRowClick = (clickedRow) => {
        setActiveHour(clickedRow);
        setUpdateModal(true);
    };

    const columns = [
        {
            name: "day",
            label: <span className=' text-primary lg:text-xl'>{t("account.active.day")}</span>,
        },
        {
            name: "start_time",
            label: <span className=' text-primary lg:text-xl'>{t("account.active.start")}</span>,
            options: {
                customBodyRender: (value) => <p className='capitalize'>{value}</p>,
                filter: false,
            }
        },
        {
            name: "end_time",
            label: <span className=' text-primary lg:text-xl'>{t("account.active.end")}</span>,
            options: {
                customBodyRender: (value) => <p className='capitalize'>{value}</p>,
                filter: false,
            }
        },
        // {
        //     name: "hour_type",
        //     label: 'Type',
        //     options: {
        //         customBodyRender: (value) => (
        //             <p className={`capitalize inline-block px-3 py-2 rounded-full ${value === 'working' ? 'bg-primary text-white' : 'bg-blue-200'}`}>
        //                 {value}
        //             </p>
        //         ),
        //     }
        // },
        // {
        //     name: "status",
        //     label: "Booking Status",
        //     options: {
        //         customBodyRender: (value, tableMeta) => {
        //             const rowData = tableMeta.rowData;
        //             const bookingStatus = getBookingStatus({
        //                 day: rowData[0],
        //                 start_time: rowData[1],
        //                 end_time: rowData[2]
        //             });
        //
        //             const statusClass = bookingStatus.includes("Fully Booked")
        //                 ? 'bg-red-500 text-white'
        //                 : bookingStatus.includes("Partially Booked")
        //                     ? 'bg-yellow-300'
        //                     : 'bg-green-500 text-white';
        //
        //             return (
        //                 <span className={`inline-block px-3 py-2 rounded-full ${statusClass}`}>
        //                 {bookingStatus}
        //             </span>
        //             );
        //         },
        //         filter: false,
        //     }
        // },
        {
            name: "delete",
            label: <span className=' text-primary lg:text-xl'>{t("account.active.action")}</span>,
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    const rowData = tableMeta.rowData;
                    const handleDelete = (e) => {
                        e.stopPropagation();
                        const activeHourDetails = {
                            day: rowData[0],
                            start_time: rowData[1],
                            end_time: rowData[2],
                            hour_type: rowData[3],
                        };
                        setActiveHour(activeHourDetails);
                        setDeleteModal(true);
                    };

                    return (
                        <button onClick={handleDelete} className="bg-red-500 text-white w-16 p-2 rounded">
                            {t("account.active.delete")}
                        </button>
                    );
                },
                filter: false,
            }
        }
    ];


    // const getBookingStatus = (hour) => {
    //     const formattedDate = `${hour.day} ${hour.start_time}`;
    //     console.log('Formatted Date:', formattedDate);
    //
    //
    //     const fullyBookedHour = fullyBookedHours.find(fullyBooked => {
    //
    //         const fullyBookedDateParts = fullyBooked.date.split(' ');
    //         const fullyBookedDay = fullyBookedDateParts[0];  // "Monday"
    //         const fullyBookedTime = fullyBooked.start_time; // "19:37"
    //
    //         console.log('Checking fullyBooked day:', fullyBookedDay);
    //         console.log('Checking fullyBooked time:', fullyBookedTime);
    //
    //
    //         return `${fullyBookedDay} ${fullyBookedTime}` === formattedDate;
    //     });
    //
    //     if (fullyBookedHour) {
    //         const remainingSlots = fullyBookedHour.appointment_limit - fullyBookedHour.appointment_count;
    //         console.log('Found fully booked hour:', fullyBookedHour);
    //         return remainingSlots === 0 ? 'Fully Booked' : `Fully Booked - ${remainingSlots} Slot(s) Left`;
    //     }
    //
    //
    //     const bookedHour = bookedHours.find(booked =>
    //         booked.day === hour.day &&
    //         booked.start_time === hour.start_time &&
    //         booked.end_time === hour.end_time
    //     );
    //
    //     if (bookedHour) {
    //         const remainingSlots = bookedHour.appointment_limit - bookedHour.appointment_count;
    //         return `Partially Booked - ${remainingSlots} Slot(s) Left`;
    //     }
    //
    //     return 'Available';
    // };


    const getActiveHourList = async () => {
        try {
            const response = await accountService.getAccountActiveHourList(id, aToken);
            console.log('Full response:', response);
            const { active_hours, booked, fully_booked } = response;

            setActiveHours(active_hours);
            setBookedHours(booked);
            // console.log('Booked:', booked);
            setFullyBookedHours(fully_booked);
            // console.log('Fully Booked:', fully_booked);
        } catch (error) {
            toast.error("Failed to load active hours.");
        }
    };


    const onLoad = async () => {
        await getAccountActiveHourList();
        setCreateModal(false);
        setUpdateModal(false);
    };

    const cancelModal = () => {
      setCreateModal(false);
      setUpdateModal(false);
    }

    const handleDeleteConfirmation = async () => {
        if (activeHour) {
            try {
                await accountService.deleteDoctorActiveHour(activeHour, id, aToken);
                setActiveHours(prevState => prevState.filter(item => item.day !== activeHour.day || item.start_time !== activeHour.start_time || item.end_time !== activeHour.end_time));
                setDeleteModal(false);
                await Swal.fire({
                    position: "top-end",
                    title: t("account.active.message"),
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
            } catch (error) {
                toast.error("Failed to delete active hour");
            }
        }
    };


    useEffect(() => {
        if (aToken) {
            getActiveHourList();
        }
    }, [aToken]);

    return (
        <Modal className='w-full max-w-4xl h-full max-h-[80vh]' open={open} onClose={onClose}>
            <ThemeProvider theme={muiTheme}>
                <MUIDataTable
                    title= {t("account.active.title")}
                    data={activeHours}
                    columns={columns}
                    options={options}
                />

            </ThemeProvider>


            <div className='flex justify-end '>
                <button onClick={() => setCreateModal(true)}
                        className=' flex items-center justify-center gap-0.5 bg-primary w-[200px] text-white rounded-full px-3 py-2'>
                    <IoMdAddCircle/>{t("account.active.add")}
                </button>
            </div>


            <ActiveHourModal
                open={createModal}
                onClose={onLoad}
                id={id}
                cancel={cancelModal}

            />

            <UpdateActiveHourModal
                open={updateModal}
                onClose={onLoad}
                data={activeHour}
                accountId={id}
                cancel={cancelModal}

            />

            <DeleteActiveHoursModal
                open={deleteModal}
                onClose={() => setDeleteModal(false)}
                onDelete={handleDeleteConfirmation}
                data={activeHour}
            />


        </Modal>
    );
};

export default ActiveHourListModal;
