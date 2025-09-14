import React, { useState } from "react";
import type { Activity, ActivityCategory, Mood, TimeOfDay } from "../../types";
import {
    ActivityCategory as Categories,
    Mood as Moods,
    TimeOfDay as TimesOfDay,
} from "../../types";
import { generateId } from "../../utils/time";
import { activityIconOptions } from "../../utils/iconMapping";
import Modal from "../ui/Modal";
import "./AddActivityModal.css";

interface AddActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddActivity: (activity: Activity) => void;
}

const AddActivityModal: React.FC<AddActivityModalProps> = ({
    isOpen,
    onClose,
    onAddActivity,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: Categories.ENTERTAINMENT as ActivityCategory,
        duration: 1,
        icon: "target",
        mood: Moods.RELAXED as Mood,
        timeOfDay: [TimesOfDay.AFTERNOON] as TimeOfDay[],
        color: "#4caf50",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const categoryOptions = Object.values(Categories);
    const moodOptions = Object.values(Moods);
    const timeOfDayOptions = Object.values(TimesOfDay);

    const colorOptions = [
        "#4caf50",
        "#2196f3",
        "#ff9800",
        "#e91e63",
        "#9c27b0",
        "#f44336",
        "#00bcd4",
        "#795548",
        "#607d8b",
        "#3f51b5",
        "#8bc34a",
        "#ffc107",
    ];

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleTimeOfDayChange = (timeOfDay: TimeOfDay, checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            timeOfDay: checked
                ? [...prev.timeOfDay, timeOfDay]
                : prev.timeOfDay.filter((t) => t !== timeOfDay),
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Activity name is required";
        }
        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        }
        if (formData.duration < 0.5 || formData.duration > 12) {
            newErrors.duration = "Duration must be between 0.5 and 12 hours";
        }
        if (formData.timeOfDay.length === 0) {
            newErrors.timeOfDay = "Select at least one time of day";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const newActivity: Activity = {
            id: generateId(),
            name: formData.name.trim(),
            description: formData.description.trim(),
            category: formData.category,
            duration: formData.duration,
            icon: formData.icon,
            mood: formData.mood,
            timeOfDay: formData.timeOfDay,
            color: formData.color,
        };

        onAddActivity(newActivity);
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            name: "",
            description: "",
            category: Categories.ENTERTAINMENT,
            duration: 1,
            icon: "target",
            mood: Moods.RELAXED,
            timeOfDay: [TimesOfDay.AFTERNOON],
            color: "#4caf50",
        });
        setErrors({});
        onClose();
    };

    const footer = (
        <>
            <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
            >
                Cancel
            </button>
            <button
                type="submit"
                form="add-activity-form"
                className="btn btn-primary"
            >
                Add Activity
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add New Activity"
            size="large"
            footer={footer}
        >
            <form id="add-activity-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="activity-name">Activity Name *</label>
                        <input
                            id="activity-name"
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                handleInputChange("name", e.target.value)
                            }
                            placeholder="Enter activity name"
                            className={errors.name ? "error" : ""}
                        />
                        {errors.name && (
                            <span className="error-text">{errors.name}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="activity-duration">
                            Duration (hours) *
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
                                    parseFloat(e.target.value)
                                )
                            }
                            className={errors.duration ? "error" : ""}
                        />
                        {errors.duration && (
                            <span className="error-text">
                                {errors.duration}
                            </span>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="activity-description">Description *</label>
                    <textarea
                        id="activity-description"
                        value={formData.description}
                        onChange={(e) =>
                            handleInputChange("description", e.target.value)
                        }
                        placeholder="Describe the activity"
                        rows={3}
                        className={errors.description ? "error" : ""}
                    />
                    {errors.description && (
                        <span className="error-text">{errors.description}</span>
                    )}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="activity-category">Category</label>
                        <select
                            id="activity-category"
                            value={formData.category}
                            onChange={(e) =>
                                handleInputChange(
                                    "category",
                                    e.target.value as ActivityCategory
                                )
                            }
                        >
                            {categoryOptions.map((category) => (
                                <option key={category} value={category}>
                                    {category.charAt(0).toUpperCase() +
                                        category.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="activity-mood">Mood</label>
                        <select
                            id="activity-mood"
                            value={formData.mood}
                            onChange={(e) =>
                                handleInputChange(
                                    "mood",
                                    e.target.value as Mood
                                )
                            }
                        >
                            {moodOptions.map((mood) => (
                                <option key={mood} value={mood}>
                                    {mood.charAt(0).toUpperCase() +
                                        mood.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Icon</label>
                    <div className="icon-grid">
                        {activityIconOptions.map((iconOption) => {
                            const IconComponent = iconOption.component;
                            return (
                                <button
                                    key={iconOption.key}
                                    type="button"
                                    className={`icon-option ${
                                        formData.icon === iconOption.key
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleInputChange(
                                            "icon",
                                            iconOption.key
                                        )
                                    }
                                    title={iconOption.name}
                                >
                                    <IconComponent size={20} />
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="form-group">
                    <label>Color</label>
                    <div className="color-grid">
                        {colorOptions.map((color) => (
                            <button
                                key={color}
                                type="button"
                                className={`color-option ${
                                    formData.color === color ? "selected" : ""
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() =>
                                    handleInputChange("color", color)
                                }
                            />
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Time of Day *</label>
                    <div className="checkbox-group">
                        {timeOfDayOptions.map((time) => (
                            <label key={time} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.timeOfDay.includes(time)}
                                    onChange={(e) =>
                                        handleTimeOfDayChange(
                                            time,
                                            e.target.checked
                                        )
                                    }
                                />
                                <span>
                                    {time
                                        .replace("_", " ")
                                        .toLowerCase()
                                        .replace(/\b\w/g, (l) =>
                                            l.toUpperCase()
                                        )}
                                </span>
                            </label>
                        ))}
                    </div>
                    {errors.timeOfDay && (
                        <span className="error-text">{errors.timeOfDay}</span>
                    )}
                </div>
            </form>
        </Modal>
    );
};

export default AddActivityModal;
