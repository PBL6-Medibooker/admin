import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import RadioView from "./RadioView.jsx";
import moment from "moment";
import "react-calendar/dist/Calendar.css";

const themes = {
    dark: {
        background: "#1a1a1a",
        dayText: "#FFFFFF",
        todayText: "#00A693",
        selectedDayBackground: "#00A693",
        selectedDayText: "#000000",
        arrow: "#00A693",
        monthText: "#FFFFFF",
        dot: "#000000",
    },
    light: {
        background: "#B2DFDB",
        dayText: "#000000",
        todayText: "#00A693",
        selectedDayBackground: "#00A693",
        selectedDayText: "#FFFFFF",
        arrow: "#00A693",
        monthText: "#000000",
        dot: "#FFFFFF",
    },
};

const CalendarCustom = ({
                            setMessage,
                            theme,
                            schedule,
                            selectedDay,
                            setSelectedDay,
                            navigation,
                            fullyBookedHours
                        }) => {
    const [markedDates, setMarkedDates] = useState({});

    const themeColors = themes[theme] || themes.light;

    const getMarkedDatesForMonth = () => {
        const marked = {};
        const currentDate = moment();
        const endOfMonth = moment().add(1, "month");

        while (currentDate.isBefore(endOfMonth)) {
            const dayOfWeek = currentDate.format("dddd");

            // Check for appointments for the current day
            schedule
                .filter((appointment) => appointment.hour_type === "appointment" && appointment.day === dayOfWeek)
                .forEach((appointment) => {
                    marked[currentDate.format("YYYY-MM-DD")] = {
                        marked: true,
                        dotColor: "#00A693", // Default dot color for available appointments
                    };
                });

            const fullyBookedDay = fullyBookedHours.find(
                (booking) => booking.date === currentDate.format("dddd YYYY-MM-DD")
            );
            if (fullyBookedDay) {
                marked[currentDate.format("YYYY-MM-DD")] = {
                    marked: true,
                    dotColor: "#FF0000",
                    fullyBooked: true,
                    disabled: true,
                };
            }

            currentDate.add(1, "day");
        }

        setMarkedDates(marked);
    };

    useEffect(() => {
        getMarkedDatesForMonth();
    }, [schedule, fullyBookedHours]);

    const activeHours = () => {
        return schedule
            .filter((item) => item.hour_type === "appointment" && item.day === selectedDay.dayOfWeek)
            .map((item) => ({
                value: item._id,
                label: `${item.start_time} - ${item.end_time}`,
                start_time: item.start_time,
                end_time: item.end_time,
            }));
    };

    return (
        <div style={{ ...styles.container, backgroundColor: themeColors.background }}>
            <Calendar
                tileContent={({ date }) => {
                    const dateString = moment(date).format("YYYY-MM-DD");
                    const markedDate = markedDates[dateString];
                    if (markedDate) {

                        return (
                            <div
                                style={{
                                    ...styles.dot,
                                    backgroundColor: markedDate.fullyBooked ? "#FF0000" : themeColors.selectedDayBackground,
                                }}
                            />
                        );
                    }
                    return null;
                }}
                onClickDay={(date) => {
                    const dateString = moment(date).format("YYYY-MM-DD");
                    const markedDate = markedDates[dateString];
                    if (markedDate?.marked && !markedDate.disabled) {
                        const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
                        setSelectedDay({ ...selectedDay, dayOfWeek, date: dateString });
                        if (setMessage) setMessage(null);
                    } else {
                        setMessage("Không có lịch khám bệnh cho ngày này");
                    }
                }}
                prev2Label={null}
                next2Label={null}
                navigationLabel={({ date }) => moment(date).format("MMMM YYYY")}
                tileDisabled={({ date }) => {
                    const dateString = moment(date).format("YYYY-MM-DD");
                    return markedDates[dateString]?.disabled || false;
                }}
                style={{ color: themeColors.monthText }}
            />
            <div style={styles.infoContainer}>
                <div style={styles.noteContainer}>
                    <div style={{ ...styles.circle, backgroundColor: "#808080" }} />
                    <span style={{ ...styles.text, color: themeColors.dayText }}>
                        Ngày bác sĩ có lịch làm việc
                    </span>
                </div>
                <div style={styles.noteContainer}>
                    <div style={{ ...styles.circle, backgroundColor: "#00A693" }} />
                    <span style={{ ...styles.text, color: themeColors.dayText }}>
                        Ngày bác sĩ có lịch khám
                    </span>
                </div>
                <div style={styles.noteContainer}>
                    <div style={{ ...styles.circle, backgroundColor: "#FF0000" }} />
                    <span style={{ ...styles.text, color: themeColors.dayText }}>
                        Ngày đã đầy lịch
                    </span>
                </div>
                <span style={{ ...styles.label, color: themeColors.dayText }}>
                    Chọn khung giờ khám
                </span>
                {selectedDay.date ? (
                    <RadioView
                        options={activeHours()}
                        selectedOption={selectedDay.time}
                        onSelect={(val) => setSelectedDay({ ...selectedDay, time: val })}
                        textColor={themeColors.dayText}
                        setMessage={setMessage}
                    />
                ) : (
                    <span style={styles.textMessage}>Vui lòng chọn ngày trước</span>
                )}
            </div>
        </div>
    );
};

export default CalendarCustom;

const styles = {
    container: {
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        transition: "background-color 0.3s ease",
    },
    dot: {
        borderRadius: "50%",
        width: "8px",
        height: "8px",
        margin: "auto",
    },
    infoContainer: {
        marginTop: "20px",
    },
    noteContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
    },
    circle: {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        marginRight: "10px",
    },
    text: {
        fontSize: "14px",
        fontFamily: "'Roboto', sans-serif",
    },
    textMessage: {
        color: "#000000",
        fontSize: "14px",
        backgroundColor: "#B2DFDB",
        padding: "10px",
        borderRadius: "12px",
        textAlign: "center",
        width: "100%",
        fontWeight: "500",
    },
    label: {
        fontSize: "14px",
        fontWeight: "bold",
        marginBottom: "12px",
    },
};
