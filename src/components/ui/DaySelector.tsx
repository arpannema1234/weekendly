import React, { useState } from "react";
import { useSchedulePlannerContext } from "../../contexts/SchedulePlannerContext";
import { Plus, X } from "lucide-react";
import ConfirmationDialog from "./ConfirmationDialog";
import "./DaySelector.css";

interface DaySelectorProps {
    selectedDateKey: string;
    onSelectDateKey: (dateKey: string) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({
    selectedDateKey,
    onSelectDateKey,
}) => {
    const {
        currentPlan,
        addDay,
        removeDay,
        dayHasActivities,
        getDayActivityCount,
    } = useSchedulePlannerContext();
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        dateKey: string;
        dayName: string;
        activityCount: number;
    }>({
        isOpen: false,
        dateKey: "",
        dayName: "",
        activityCount: 0,
    });

    const handleRemoveDay = (dateKey: string, dayName: string) => {
        if (dayHasActivities(dateKey)) {
            const activityCount = getDayActivityCount(dateKey);
            setConfirmDialog({
                isOpen: true,
                dateKey,
                dayName,
                activityCount,
            });
        } else {
            // No activities, remove immediately
            removeDay(dateKey);
        }
    };

    const handleConfirmRemove = () => {
        removeDay(confirmDialog.dateKey, true); // Force deletion
        setConfirmDialog({
            isOpen: false,
            dateKey: "",
            dayName: "",
            activityCount: 0,
        });
    };

    const handleCancelRemove = () => {
        setConfirmDialog({
            isOpen: false,
            dateKey: "",
            dayName: "",
            activityCount: 0,
        });
    };
    return (
        <div className="day-selector">
            <p>Add activities to:</p>
            <div className="day-management">
                {/* Add day before first button */}
                {currentPlan?.planDays && currentPlan.planDays.length > 0 && (
                    <button
                        className="add-day-button before"
                        onClick={() => addDay()}
                        title="Add day before"
                    >
                        <Plus size={16} />
                    </button>
                )}

                {(currentPlan?.planDays || []).map((planDay, index) => (
                    <div key={planDay.date} className="day-button-container">
                        <button
                            className={`day-button ${
                                selectedDateKey === planDay.date ? "active" : ""
                            }`}
                            onClick={() => onSelectDateKey(planDay.date)}
                        >
                            {planDay.displayName}
                            {/* Remove day button only on first and last days */}
                            {(currentPlan?.planDays?.length || 0) > 1 &&
                                (index === 0 ||
                                    index ===
                                        (currentPlan?.planDays?.length || 0) -
                                            1) && (
                                    <span
                                        className="remove-day-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveDay(
                                                planDay.date,
                                                planDay.displayName
                                            );
                                        }}
                                        title="Remove this day"
                                    >
                                        <X size={14} />
                                    </span>
                                )}
                        </button>
                    </div>
                ))}

                {/* Add day after last button */}
                {currentPlan?.planDays && currentPlan.planDays.length > 0 && (
                    <button
                        className="add-day-button after"
                        onClick={() =>
                            addDay(
                                currentPlan.planDays[
                                    currentPlan.planDays.length - 1
                                ].date
                            )
                        }
                        title="Add day after"
                    >
                        <Plus size={16} />
                    </button>
                )}
            </div>

            <ConfirmationDialog
                isOpen={confirmDialog.isOpen}
                title="Delete Day with Activities"
                message={`Are you sure you want to delete "${
                    confirmDialog.dayName
                }"? This day has ${confirmDialog.activityCount} scheduled ${
                    confirmDialog.activityCount === 1
                        ? "activity"
                        : "activities"
                } that will also be deleted.`}
                onConfirm={handleConfirmRemove}
                onCancel={handleCancelRemove}
                confirmText="Delete Day"
                cancelText="Cancel"
                dangerous={true}
            />
        </div>
    );
};

export default DaySelector;
