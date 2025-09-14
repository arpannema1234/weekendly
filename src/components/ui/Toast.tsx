import React from "react";
import "./Toast.css";

interface ToastProps {
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible }) => {
    if (!isVisible) return null;

    const getIcon = () => {
        switch (type) {
            case "success":
                return "✅";
            case "error":
                return "❌";
            case "info":
                return "ℹ️";
        }
    };

    return (
        <div className={`toast toast-${type} ${isVisible ? "visible" : ""}`}>
            <span className="toast-icon">{getIcon()}</span>
            <span className="toast-message">{message}</span>
        </div>
    );
};

export default Toast;
