import React from "react";
import type { ScheduledActivity } from "../../types";
import { formatTime } from "../../utils/time";
import IconRenderer from "../ui/IconRenderer";
import { Edit3, X, GripVertical } from "lucide-react";
import "./DraggableActivityCard.css";
// @ts-ignore
import { useDrag } from "react-dnd";

interface DraggableActivityCardProps {
    scheduledActivity: ScheduledActivity;
    onRemove: (id: string) => void;
    onEditTime?: (id: string, startTime: string, endTime: string) => void;
}

const DraggableActivityCard: React.FC<DraggableActivityCardProps> = ({
    scheduledActivity,
    onRemove,
    onEditTime,
}) => {
    const { activity, startTime, endTime } = scheduledActivity;

    const [{ isDragging }, drag] = useDrag({
        type: "activity",
        item: {
            id: scheduledActivity.id,
            sourceDate: scheduledActivity.date,
            activity: scheduledActivity,
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div
            ref={drag}
            className={`draggable-activity-card ${
                isDragging ? "dragging" : ""
            }`}
            style={{
                borderLeftColor: activity.color,
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            <div className="activity-header">
                <span className="activity-icon">
                    <IconRenderer iconKey={activity.icon} size={18} />
                </span>
                <div className="activity-info">
                    <h4 className="activity-name">{activity.name}</h4>
                    <p className="activity-time">
                        {formatTime(startTime)} - {formatTime(endTime)}
                    </p>
                </div>
                <div className="card-actions">
                    {onEditTime && (
                        <button
                            className="edit-time-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEditTime(
                                    scheduledActivity.id,
                                    startTime,
                                    endTime
                                );
                            }}
                            title="Edit time"
                            aria-label="Edit activity time"
                        >
                            <Edit3 size={12} />
                        </button>
                    )}
                    <button
                        className="remove-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(scheduledActivity.id);
                        }}
                        aria-label="Remove activity"
                    >
                        <X size={12} />
                    </button>
                </div>
            </div>
            <p className="activity-description">{activity.description}</p>
            <div className="drag-indicator">
                <GripVertical size={12} />
            </div>
        </div>
    );
};

export default DraggableActivityCard;
