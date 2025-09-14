import React from "react";
// @ts-ignore
import { useDrop } from "react-dnd";
import type { PlanDay, ScheduledActivity } from "../../types";
import DraggableActivityCard from "../cards/DraggableActivityCard";
import "./DroppableDay.css";

interface DroppableDayProps {
    planDay: PlanDay;
    activities: ScheduledActivity[];
    onDropActivity: (
        activityId: string,
        sourceDate: string,
        targetDate: string
    ) => void;
    onRemoveActivity: (id: string) => void;
    onEditActivityTime?: (
        id: string,
        startTime: string,
        endTime: string
    ) => void;
}

const DroppableDay: React.FC<DroppableDayProps> = ({
    planDay,
    activities,
    onDropActivity,
    onRemoveActivity,
    onEditActivityTime,
}) => {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: "activity",
        drop: (item: {
            id: string;
            sourceDate: string;
            activity: ScheduledActivity;
        }) => {
            if (item.sourceDate !== planDay.date) {
                onDropActivity(item.id, item.sourceDate, planDay.date);
            }
        },
        collect: (monitor: any) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    const sortedActivities = [...activities].sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
    );

    return (
        <div
            ref={drop}
            className={`droppable-day ${isOver ? "drop-over" : ""} ${
                canDrop ? "drop-target" : ""
            }`}
        >
            <div className="day-header">
                <h3>{planDay.displayName}</h3>
                <span className="activity-count">
                    {activities.length} activities
                </span>
            </div>

            <div className="day-activities">
                {sortedActivities.length === 0 ? (
                    <div className="empty-day">
                        <p>No activities planned yet.</p>
                        <p>Drag activities here to schedule them!</p>
                    </div>
                ) : (
                    sortedActivities.map((activity) => (
                        <DraggableActivityCard
                            key={activity.id}
                            scheduledActivity={activity}
                            onRemove={onRemoveActivity}
                            onEditTime={onEditActivityTime}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default DroppableDay;
