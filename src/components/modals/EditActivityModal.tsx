import React, { useState, useEffect } from "react";
import type { Activity } from "../../types";
import { ActivityCategory, Mood } from "../../types";
import { activityIconOptions } from "../../utils/iconMapping";
import Modal from "../ui/Modal";
import "./EditActivityModal.css";

interface EditActivityModalProps {
    isOpen: boolean;
    activity: Activity;
    editMode: "full" | "time-only";
    initialStartTime?: string;
    initialEndTime?: string;
    onClose: () => void;
    onSave: (
        updates: Partial<Activity> & { startTime?: string; endTime?: string }
    ) => void;
}

const ACTIVITY_COLORS = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
    "#F8C471",
    "#82E0AA",
    "#F1948A",
    "#85929E",
    "#D2B4DE",
];

const EditActivityModal: React.FC<EditActivityModalProps> = ({
    isOpen,
    activity,
    editMode,
    initialStartTime,
    initialEndTime,
    onClose,
    onSave,
}) => {
    const [formData, setFormData] = useState({
        name: activity.name,
        description: activity.description,
        duration: activity.duration,
        category: activity.category,
        icon: activity.icon,
        color: activity.color,
        mood: activity.mood,
        startTime: initialStartTime || "09:00",
        endTime: initialEndTime || "10:00",
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: activity.name,
                description: activity.description,
                duration: activity.duration,
                category: activity.category,
                icon: activity.icon,
                color: activity.color,
                mood: activity.mood,
                startTime: initialStartTime || "09:00",
                endTime: initialEndTime || "10:00",
            });
        }
    }, [isOpen, activity, initialStartTime, initialEndTime]);

    // Generic function to handle all form changes
    const handleInputChange = (property: keyof typeof formData, value: any) => {
        // Handle special cases for different input types
        let processedValue = value;
        if (property === "duration" && typeof value === "string") {
            processedValue = parseFloat(value);
        }

        setFormData((prev) => ({
            ...prev,
            [property]: processedValue,
        }));
    };

    const handleSave = () => {
        if (editMode === "time-only") {
            onSave({
                startTime: formData.startTime,
                endTime: formData.endTime,
            });
        } else {
            onSave({
                name: formData.name,
                description: formData.description,
                duration: formData.duration,
                category: formData.category as ActivityCategory,
                icon: formData.icon,
                color: formData.color,
                mood: formData.mood,
            });
        }
    };

    const footer = (
        <>
            <button className="btn btn-secondary" onClick={onClose}>
                Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
                Save Changes
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                editMode === "time-only"
                    ? "Edit Schedule Time"
                    : "Edit Activity"
            }
            size={editMode === "time-only" ? "small" : "large"}
            footer={footer}
        >
            {editMode === "time-only" ? (
                // Time-only editing mode
                <div className="time-inputs">
                    <div className="time-input-group">
                        <label htmlFor="start-time">Start Time:</label>
                        <input
                            id="start-time"
                            type="time"
                            value={formData.startTime}
                            onChange={(e) =>
                                handleInputChange("startTime", e.target.value)
                            }
                            className="time-input"
                        />
                    </div>
                    <div className="time-input-group">
                        <label htmlFor="end-time">End Time:</label>
                        <input
                            id="end-time"
                            type="time"
                            value={formData.endTime}
                            onChange={(e) =>
                                handleInputChange("endTime", e.target.value)
                            }
                            className="time-input"
                        />
                    </div>
                </div>
            ) : (
                // Full editing mode
                <>
                    <div className="form-group">
                        <label htmlFor="activity-name">Activity Name:</label>
                        <input
                            id="activity-name"
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                handleInputChange("name", e.target.value)
                            }
                            placeholder="Enter activity name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="activity-description">
                            Description:
                        </label>
                        <textarea
                            id="activity-description"
                            value={formData.description}
                            onChange={(e) =>
                                handleInputChange("description", e.target.value)
                            }
                            placeholder="Describe your activity"
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="activity-duration">
                                Duration (hours):
                            </label>
                            <input
                                id="activity-duration"
                                type="number"
                                min="0.5"
                                max="12"
                                step="0.5"
                                value={formData.duration}
                                onChange={(e) =>
                                    handleInputChange(
                                        "duration",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="activity-category">Category:</label>
                            <select
                                id="activity-category"
                                value={formData.category}
                                onChange={(e) =>
                                    handleInputChange(
                                        "category",
                                        e.target.value
                                    )
                                }
                            >
                                {Object.values(ActivityCategory).map(
                                    (category) => (
                                        <option key={category} value={category}>
                                            {category.charAt(0).toUpperCase() +
                                                category.slice(1)}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="activity-mood">Mood:</label>
                            <select
                                id="activity-mood"
                                value={formData.mood}
                                onChange={(e) =>
                                    handleInputChange("mood", e.target.value)
                                }
                            >
                                {Object.values(Mood).map((mood) => (
                                    <option key={mood} value={mood}>
                                        {mood.charAt(0).toUpperCase() +
                                            mood.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Choose Icon:</label>
                        <div className="icon-grid">
                            {activityIconOptions.map(
                                ({ key, component: IconComponent }) => (
                                    <button
                                        key={key}
                                        type="button"
                                        className={`icon-option ${
                                            formData.icon === key
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleInputChange("icon", key)
                                        }
                                    >
                                        <IconComponent size={20} />
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Choose Color:</label>
                        <div className="color-grid">
                            {ACTIVITY_COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`color-option ${
                                        formData.color === color
                                            ? "selected"
                                            : ""
                                    }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() =>
                                        handleInputChange("color", color)
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default EditActivityModal;
