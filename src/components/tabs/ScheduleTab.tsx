import React, { useState } from "react";
import ScheduleView from "../layout/ScheduleView";
import EditActivityModal from "../modals/EditActivityModal";
import ConflictModal from "../modals/ConflictModal";
import { useSchedulePlannerContext } from "../../contexts/SchedulePlannerContext";

interface ScheduleTabProps {
    onEditActivityTime?: (
        activityId: string,
        startTime: string,
        endTime: string
    ) => void;
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({ onEditActivityTime }) => {
    const {
        currentPlan,
        removeActivityFromSchedule,
        moveActivity,
        checkMoveConflicts,
    } = useSchedulePlannerContext();
    const [editingScheduledActivity, setEditingScheduledActivity] = useState<{
        id: string;
        activity: any;
        startTime: string;
        endTime: string;
    } | null>(null);

    // Move conflict modal state
    const [moveConflictModal, setMoveConflictModal] = useState<{
        isOpen: boolean;
        message: string;
        pendingMove: {
            activityId: string;
            sourceDate: string;
            targetDate: string;
            activityName: string;
        } | null;
    }>({
        isOpen: false,
        message: "",
        pendingMove: null,
    });
    // Handle the case when currentPlan is null
    if (!currentPlan) {
        return (
            <div
                style={{ textAlign: "center", padding: "2rem", color: "#666" }}
            >
                <p>No plan created yet. Go to Calendar to create a new plan.</p>
            </div>
        );
    }

    // Handle edit activity time
    const handleEditActivityTime = (
        id: string,
        startTime: string,
        endTime: string
    ) => {
        // Find the activity to get its details
        let foundActivity = null;
        for (const planDay of currentPlan.planDays) {
            const dayActivities = currentPlan.days[planDay.date] || [];
            foundActivity = dayActivities.find(
                (activity) => activity.id === id
            );
            if (foundActivity) break;
        }

        if (foundActivity) {
            setEditingScheduledActivity({
                id,
                activity: foundActivity.activity,
                startTime,
                endTime,
            });
        }
    };

    const handleSaveTimeEdit = (updates: {
        startTime?: string;
        endTime?: string;
    }) => {
        if (
            editingScheduledActivity &&
            onEditActivityTime &&
            updates.startTime &&
            updates.endTime
        ) {
            onEditActivityTime(
                editingScheduledActivity.id,
                updates.startTime,
                updates.endTime
            );
        }
        setEditingScheduledActivity(null);
    };

    const handleCloseTimeEdit = () => {
        setEditingScheduledActivity(null);
    };

    // Wrap the onRemoveActivity to match ScheduleView's interface
    const handleRemoveActivity = (activityId: string) => {
        removeActivityFromSchedule(activityId);
    };

    // Wrapper for moveActivity with conflict detection
    const handleMoveActivityWithConflicts = (
        activityId: string,
        sourceDate: string,
        targetDate: string
    ) => {
        // Check for conflicts in the target date
        const conflictCheck = checkMoveConflicts(activityId, targetDate);

        if (conflictCheck.hasConflicts) {
            // Show conflict modal instead of alert
            setMoveConflictModal({
                isOpen: true,
                message: conflictCheck.message,
                pendingMove: {
                    activityId,
                    sourceDate,
                    targetDate,
                    activityName: conflictCheck.activityName,
                },
            });
        } else {
            // No conflicts, proceed with move
            moveActivity(activityId, sourceDate, targetDate);
        }
    };

    // Handle move conflict confirmation (move anyway)
    const handleMoveConflictConfirm = () => {
        if (moveConflictModal.pendingMove) {
            const { activityId, sourceDate, targetDate } =
                moveConflictModal.pendingMove;
            moveActivity(activityId, sourceDate, targetDate);
        }
        setMoveConflictModal({
            isOpen: false,
            message: "",
            pendingMove: null,
        });
    };

    // Handle move conflict cancellation
    const handleMoveConflictCancel = () => {
        setMoveConflictModal({
            isOpen: false,
            message: "",
            pendingMove: null,
        });
    };

    return (
        <>
            <ScheduleView
                weekendPlan={currentPlan}
                onRemoveActivity={handleRemoveActivity}
                onMoveActivity={handleMoveActivityWithConflicts}
                onEditActivityTime={handleEditActivityTime}
            />

            {editingScheduledActivity && (
                <EditActivityModal
                    isOpen={!!editingScheduledActivity}
                    activity={editingScheduledActivity.activity}
                    editMode="time-only"
                    initialStartTime={editingScheduledActivity.startTime}
                    initialEndTime={editingScheduledActivity.endTime}
                    onClose={handleCloseTimeEdit}
                    onSave={handleSaveTimeEdit}
                />
            )}

            <ConflictModal
                isOpen={moveConflictModal.isOpen}
                message={moveConflictModal.message}
                onConfirm={handleMoveConflictConfirm}
                onCancel={handleMoveConflictCancel}
                hasAlternative={false}
                confirmButtonText="Move Anyway"
            />
        </>
    );
};

export default ScheduleTab;
