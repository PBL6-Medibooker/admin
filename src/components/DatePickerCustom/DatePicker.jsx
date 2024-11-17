import React, { useState } from "react";
import { CalendarOutlined } from "@ant-design/icons";
import CalendarCustom from "./CalendarCustom.jsx";

const DatePicker = ({ onChange, placeholder, disabled, schedule, value, onFocus, fullyBookedHours }) => {
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const [message, setMessage] = useState(null);

    const handleClose = () => {
        onChange({
            date: null,
            dayOfWeek: null,
            time: null,
        });
        setMessage(null);
        setOpenStartDatePicker(false);
    };

    const handleSetDate = () => {
        if (value.time !== null) {
            setOpenStartDatePicker(false);
        } else {
            setMessage(" Chưa chọn ngày - khung giờ");
        }
    };

    return (
        <div>
            <button
                style={{
                    ...styles.btnDatePicker,
                    color: disabled ? "#808080" : "#000",
                    cursor: disabled ? "not-allowed" : "pointer",
                }}
                onClick={() => {
                    onFocus();
                    if (!disabled) setOpenStartDatePicker(true);
                }}
                disabled={disabled}
            >
                <span style={styles.text}>
                    {value.date && value.dayOfWeek && value.time
                        ? `${value.time.label}, ${value.dayOfWeek} ${value.date}`
                        : placeholder}
                </span>
                <CalendarOutlined style={styles.icon} />
            </button>

            {openStartDatePicker && (
                <div style={styles.centeredView}>
                    <div style={styles.modalView}>
                        <CalendarCustom
                            schedule={schedule}
                            setMessage={setMessage}
                            setSelectedDay={(val) => {
                                onChange(val);
                            }}
                            selectedDay={value}
                            fullyBookedHours={fullyBookedHours}
                            theme="light"
                        />

                        {message && (
                            <div style={styles.errorMessage}>
                                <span role="img" aria-label="error">❌</span> {message}
                            </div>
                        )}

                        <div style={styles.modalButtons}>
                            <button style={styles.closeButton} onClick={handleClose}>Close</button>
                            <button style={styles.okButton} onClick={handleSetDate}>OK</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;

const styles = {
    btnDatePicker: {
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        width: "100%",
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "20px",
        padding: "10px 15px",
        borderColor: "#C0C0C0",
        transition: "all 0.3s ease",
    },
    text: {
        flex: 1,
        paddingRight: "10px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    icon: {
        fontSize: "18px",
        color: "#808080",
    },
    centeredView: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        transition: "all 0.3s ease",
    },
    modalView: {
        backgroundColor: "#FFFFFF",
        borderRadius: "15px",
        padding: "20px",
        width: "90%",
        maxWidth: "500px",
        color: "#000",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column"
    },
    modalButtons: {
        display: "flex",
        justifyContent: "space-evenly",
        marginTop: "15px",
        gap:"100px"
    },
    closeButton: {
        color: "#000",
        borderColor: "#808080",
        borderWidth: "1px",
        padding: "8px 15px",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: "#F1F1F1",
        transition: "background-color 0.3s ease",
    },
    okButton: {
        color: "#fff",
        backgroundColor: "#00A693",
        padding: "8px 15px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        width: "80px"
    },
    errorMessage: {
        color: "red",
        fontSize: "14px",
        textAlign: "center",
        marginTop: "10px",
        fontWeight: "bold",
    },
};
