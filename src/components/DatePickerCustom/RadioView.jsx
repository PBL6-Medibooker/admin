import React from "react";

const RadioView = ({ options, selectedOption, onSelect, textColor, setMessage }) => {
    return (
        <div style={styles.radioContainer} role="group" aria-label="Select an option">
            {options.map((option, index) => (
                <button
                    key={option.value}
                    style={{
                        ...styles.radioButton,
                        ...(selectedOption && selectedOption.value === option.value ? styles.selectedButton : {}),
                        ...(index === 0 ? styles.firstButton : {}),
                        ...(index === options.length - 1 ? styles.lastButton : {}),
                    }}
                    onClick={() => {
                        onSelect(option);
                        if (setMessage) setMessage(null);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && onSelect(option)}
                    aria-pressed={selectedOption && selectedOption.value === option.value}
                    aria-label={option.label}
                >
                    <span
                        style={{
                            ...styles.text,
                            color: textColor,
                            ...(selectedOption && selectedOption.value === option.value ? styles.selectedText : {}),
                        }}
                    >
                        {option.label}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default RadioView;

const styles = {
    radioContainer: {
        display: "flex",
        gap: "8px",
        justifyContent: "space-between",
        width: "100%",
        padding: "10px 0",
    },
    radioButton: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 15px",
        backgroundColor: "transparent",
        border: "1px solid #C0C0C0",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    selectedButton: {
        backgroundColor: "#00A693",
        borderColor: "#00A693",
        boxShadow: "0px 4px 12px rgba(0, 166, 147, 0.5)", // Enhanced shadow effect for selected button
    },
    firstButton: {
        borderTopLeftRadius: "20px",
        borderBottomLeftRadius: "20px",
    },
    lastButton: {
        borderTopRightRadius: "20px",
        borderBottomRightRadius: "20px",
    },
    text: {
        fontSize: "14px",
        fontWeight: "500",
        color: "#4a4a4a",
    },
    selectedText: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
};
