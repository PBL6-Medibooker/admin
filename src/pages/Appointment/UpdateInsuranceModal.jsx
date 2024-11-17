import React, {useContext, useEffect, useState} from 'react'
import {AdminContext} from "../../context/AdminContext"
import Modal from '../../components/ModalListInsurance'
import ModalD from '../../components/Modal'
import * as appointmentService from "../../service/AppointmentService"
import {toast} from "react-toastify"
import MUIDataTable from "mui-datatables"
import {createTheme, ThemeProvider} from "@mui/material/styles"
import {motion} from "framer-motion"
import {FaRegTrashAlt} from "react-icons/fa"
import {IoMdAddCircle} from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";


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
                },
                body: {
                    padding: '7px 7px 5px 40px',

                }
            }
        }
    }
})

const UpdateInsuranceModal = ({ open, id, cancel }) => {
    const { aToken } = useContext(AdminContext)
    const [insuranceData, setInsuranceData] = useState([])
    const [editingRow, setEditingRow] = useState(null)
    const muiTheme = getMuiTheme()
    const [openD, setOpenD] = useState(false)
    const [index, setIndex] = useState(false)

    const getInsuranceInfo = async () => {
        try {
            const data = await appointmentService.getInsuranceInfo(id, aToken)
            if (data) {
                setInsuranceData(data)
            } else {
                toast.error(data.error)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const handleEdit = (rowIndex) => {
        setEditingRow(rowIndex) 
    }

    const handleSave = async (rowIndex) => {
        try {
            const updatedRow = insuranceData[rowIndex]
            const payload = {
                appointment_id: id,
                insurance_id: updatedRow._id,
                name: updatedRow.name,
                number: updatedRow.number,
                location: updatedRow.location,
                exp_date: updatedRow.exp_date,
            }

            const data = await appointmentService.updateInsuranceInfo(payload, aToken)
            if (data) {
                setEditingRow(null)
                toast.success('Insurance Updated')
            } else {
                toast.error('Error')
            }
        } catch (e) {
            console.log(e)
        }

    }
    const handleChange = (rowIndex, field, value) => {
        setInsuranceData((prev) =>
            prev.map((item, idx) =>
                idx === rowIndex ? { ...item, [field]: value } : item
            )
        )
    }

    const openDeleteModal = (rowIndex) => {
        setIndex(rowIndex)
        setOpenD(true)
    }

    const deleteInsurance = async (rowIndex) => {
        try {
            const updatedRow = insuranceData[rowIndex]

            const payload = {
                appointment_id: id,
                insurance_id: updatedRow._id
            }
            const result = await appointmentService.deleteInsurance(payload, aToken)
            if (result) {
                toast.success('Insurance Deleted')
                setOpenD(false)
                await getInsuranceInfo()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const columns = [
        {
            name: "name",
            label: "Insurance Name",
            options: {
                customHeadRender: (columnMeta) => (
                    <th
                        key={columnMeta.name}
                        style={{
                            color: '#00A6A9',
                            textTransform: 'capitalize',
                            fontWeight: 'bold',
                        }}
                    >
                        {columnMeta.label}
                    </th>
                ),
                customBodyRender: (value, tableMeta) => {
                    const rowIndex = tableMeta.rowIndex
                    // if (!value) return null
                    return editingRow === rowIndex ? (
                        <motion.input
                            type="text"
                            value={value || ''}
                            onChange={(e) => handleChange(rowIndex, "name", e.target.value)}
                            className="w-full p-3 text-sm border-2 border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.5}}
                            placeholder="Enter text"
                        />
                    ) : (
                        <motion.p
                            className="capitalize text-sm font-medium text-gray-800"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.5}}
                        >
                            {value}
                        </motion.p>)
                },
            },
        },
        {
            name: "number",
            label: "Insurance Number",
            options: {
                customHeadRender: (columnMeta) => (
                    <th
                        key={columnMeta.name}
                        style={{
                            color: '#00A6A9',
                            textTransform: 'capitalize',
                            fontWeight: 'bold',
                        }}
                    >
                        {columnMeta.label}
                    </th>
                ),
                customBodyRender: (value, tableMeta) => {
                    const rowIndex = tableMeta.rowIndex
                    if (!value) return null
                    return editingRow === rowIndex ? (
                        <input
                            type="text"
                            value={value}
                            onChange={(e) =>
                                handleChange(rowIndex, "number", e.target.value)
                            }
                        />
                    ) : (
                        <p>{value}</p>
                    )
                },
            },
        },
        {
            name: "location",
            label: "Location",
            options: {
                customHeadRender: (columnMeta) => (
                    <th
                        key={columnMeta.name}
                        style={{
                            color: '#00A6A9',
                            textTransform: 'capitalize',
                            fontWeight: 'bold',
                        }}
                    >
                        {columnMeta.label}
                    </th>
                ),
                customBodyRender: (value, tableMeta) => {
                    const rowIndex = tableMeta.rowIndex
                    if (!value) return null
                    return editingRow === rowIndex ? (
                        <input
                            type="text"
                            value={value}
                            onChange={(e) =>
                                handleChange(rowIndex, "location", e.target.value)
                            }
                        />
                    ) : (
                        <p>{value}</p>
                    )
                },
            },
        },
        {
            name: "exp_date",
            label: "Expiry Date",
            options: {
                customHeadRender: (columnMeta) => (
                    <th
                        key={columnMeta.name}
                        style={{
                            color: '#00A6A9',
                            textTransform: 'capitalize',
                            fontWeight: 'bold',
                        }}
                    >
                        {columnMeta.label}
                    </th>
                ),
                customBodyRender: (value, tableMeta) => {
                    const rowIndex = tableMeta.rowIndex
                    //khi xoa het no se mat input
                    // if (!value) return null
                    return editingRow === rowIndex ? (
                        <input
                            type="date"
                            value={value}
                            onChange={(e) =>
                                handleChange(rowIndex, "exp_date", e.target.value)
                            }
                        />
                    ) : (
                        <p>{value}</p>
                    )
                },
            },
        },
        {
            name: "update",
            label: "Update",
            options: {
                customHeadRender: (columnMeta) => (
                    <th
                        key={columnMeta.name}
                        style={{
                            color: '#00A6A9',
                            textTransform: 'capitalize',
                            fontWeight: 'bold',
                        }}
                    >
                        {columnMeta.label}
                    </th>
                ),
                customBodyRender: (value, tableMeta) => {
                    const rowIndex = tableMeta.rowIndex
                    const rowData = tableMeta.rowData
                    if (!rowData || rowData.every((cell) => !cell)) return null
                    return editingRow === rowIndex ? (
                        <div>
                            <button
                                onClick={() => handleSave(rowIndex)}
                                style={{
                                    backgroundColor: "green",
                                    color: "#fff",
                                    padding: "8px 16px",
                                    borderRadius: "4px",
                                    border: "none",
                                    cursor: "pointer",
                                    marginRight: "8px",
                                }}
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditingRow(null)} // Cancel edit
                                style={{
                                    backgroundColor: "gray",
                                    color: "#fff",
                                    padding: "8px 16px",
                                    borderRadius: "4px",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => handleEdit(rowIndex)}
                            style={{
                                backgroundColor: "#00A6A9",
                                color: "#fff",
                                padding: "8px 16px",
                                borderRadius: "4px",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            Edit
                        </button>
                    )
                },
            },
        },
        {
            name: "delete",
            label: "Delete",
            options: {
                customHeadRender: (columnMeta) => (
                    <th
                        key={columnMeta.name}
                        style={{
                            color: 'red',
                            textTransform: 'capitalize',
                            fontWeight: 'bold',
                        }}
                    >
                        {columnMeta.label}
                    </th>
                ),
                customBodyRender: (value, tableMeta) => {
                    const rowIndex = tableMeta.rowIndex
                    const rowData = tableMeta.rowData

                    if (!rowData || rowData.every((cell) => !cell)) return null

                    return (
                        <button
                            onClick={() => openDeleteModal(rowIndex)}
                            style={{
                                backgroundColor: 'red',
                                color: '#fff',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            Delete
                        </button>
                    )
                },
            }
        },
    ]

    const options = {
        elevation: 0,
        pagination: false,
        download: false,
        print: false,
        selectableRows: "none",
        textLabels: {
            body: {
                noMatch: "No data available",
            },
        }
    }

    // do insurance data
    useEffect(() => {
        if (aToken) {
            getInsuranceInfo()
        }
    }, [aToken])

    return (
        <div>
            <Modal open={open} onClose={cancel}>
                <ThemeProvider theme={muiTheme}>
                    <MUIDataTable
                        title={'Insurance'}
                        data={insuranceData}
                        columns={columns}
                        options={options}
                    />

                </ThemeProvider>

                <div className="absolute bottom-0 right-0 mr-14 mb-4">
                    <button
                        onClick={cancel}
                        className="flex items-center justify-center gap-0.5 bg-red-700 text-white rounded-full px-3 py-2">
                        <MdOutlineClose/> Close
                    </button>
                </div>
            </Modal>
            <ModalD open={openD} onClose={() => setOpenD(false)}>
                <motion.div
                    className="text-center w-80 p-4 bg-white rounded-lg"
                    initial={{scale: 0.9, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    transition={{duration: 0.3}}
                >
                    <FaRegTrashAlt size={50} className="mx-auto text-red-500 mb-4"/>
                    <h3 className="text-lg font-semibold">Confirm Delete</h3>
                    <p className="text-gray-600">Are you sure you want to delete?</p>
                    <div className="flex justify-around mt-6">
                        <motion.button
                            onClick={() => deleteInsurance(index)}
                            whileHover={{scale: 1.05}}
                            className="text-white bg-red-600 px-6 py-2 rounded-md"
                        >
                            Delete
                        </motion.button>
                        <motion.button
                            onClick={() => setOpenD(false)}
                            whileHover={{scale: 1.05}}
                            className="bg-gray-200 px-6 py-2 rounded-md"
                        >
                            Cancel
                        </motion.button>
                    </div>
                </motion.div>
            </ModalD>
        </div>
    )
}

export default UpdateInsuranceModal


// <form onSubmit={handleSubmit} className="space-y-6">
//     <div className="space-y-4">
//         <div className="flex flex-col">
//             <label htmlFor="insurance_name" className="text-sm font-medium text-gray-700">
//                 Insurance Name
//             </label>
//             <input
//                 onChange={(e) => setInsuranceData(prev => ({...prev, name: e.target.value}))}
//                 value={insuranceData?.name || ''}
//                 id="insurance_name"
//                 className="border rounded-lg px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                 type="text"
//                 placeholder="Nhập vào tên bảo hiểm"
//                 required
//             />
//         </div>
//
//         <div className="flex flex-col">
//             <label htmlFor="insurance_number" className="text-sm font-medium text-gray-700">
//                 Insurance Number
//             </label>
//             <input
//                 onChange={(e) => setInsuranceData(prev => ({...prev, number: e.target.value}))}
//                 value={insuranceData?.number || ''}
//                 id="insurance_number"
//                 className="border rounded-lg px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                 type="text"
//                 placeholder="Nhập vào số BH"
//                 required
//             />
//         </div>
//
//         <div className="flex flex-col">
//             <label htmlFor="insurance_location" className="text-sm font-medium text-gray-700">
//                 Location
//             </label>
//             <input
//                 onChange={(e) => setInsuranceData(prev => ({...prev, location: e.target.value}))}
//                 value={insuranceData?.location || ''}
//                 id="insurance_location"
//                 className="border rounded-lg px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                 type="text"
//                 placeholder="Nhập vào địa chỉ"
//                 required
//             />
//         </div>
//
//         <div className="flex flex-col">
//             <label htmlFor="insurance_exp_date" className="text-sm font-medium text-gray-700">
//                 Expiry Date
//             </label>
//             <input
//                 onChange={(e) => setInsuranceData(prev => ({...prev, exp_date: e.target.value}))}
//                 value={insuranceData?.exp_date || ''}
//                 id="insurance_exp_date"
//                 className="border rounded-lg px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                 type="date"
//                 required
//             />
//         </div>
//     </div>
//
//     <div className="flex justify-end gap-4 mt-6">
//         <button
//             type="button"
//             onClick={cancel}
//             className="bg-gray-300 text-gray-700 p-2 w-32 rounded-lg hover:bg-gray-400 transition"
//         >
//             Cancel
//         </button>
//         <button
//             type="submit"
//             className="bg-green-500 text-white w-32 p-2 rounded-lg hover:bg-green-600 transition"
//         >
//             Save
//         </button>
//     </div>
// </form>
