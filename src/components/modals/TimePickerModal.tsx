import { useState } from "react";
import type { Activity } from "../../types";
import Modal from "../ui/Modal";
import "./TimePickerModal.css";

interface TimePickerModalProps {
    activity: Activity;
    dayName: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (startTime: string, endTime: string) => void;
}

const TimePickerModal = ({
    activity,
    dayName,
    isOpen,
    onClose,
    onConfirm,
}: TimePickerModalProps) => {
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("10:00");
    const [error, setError] = useState("");

    const handleConfirm = () => {
        // Validate that end time is after start time
        if (startTime >= endTime) {
            setError("End time must be after start time");
            return;
        }
        setError("");
        onConfirm(startTime, endTime);
        onClose();
        // Reset for next use
        setStartTime("09:00");
        setEndTime("10:00");
    };

    const handleCancel = () => {
        setError("");
        onClose();
        // Reset for next use
        setStartTime("09:00");
        setEndTime("10:00");
    };

    const footer = (
        <>
            <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
            </button>
            <button className="btn btn-primary" onClick={handleConfirm}>
                Add Activity
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            title="Add Activity Time"
            size="small"
            footer={footer}
        >
            <div className="activity-info">
                <h4>{activity.name}</h4>
                <p>Adding to: {dayName}</p>
                <p className="activity-description">{activity.description}</p>
            </div>

            <div className="time-inputs">
                <div className="time-input-group">
                    <label htmlFor="start-time">Start Time:</label>
                    <input
                        id="start-time"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="time-input"
                    />
                </div>

                <div className="time-input-group">
                    <label htmlFor="end-time">End Time:</label>
                    <input
                        id="end-time"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="time-input"
                    />
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}
        </Modal>
    );
};

export default TimePickerModal;
