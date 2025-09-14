import React from "react";
import type { Activity } from "../../types";
import IconRenderer from "../ui/IconRenderer";
import { Edit3 } from "lucide-react";
import "./ActivityCard.css";

interface ActivityCardProps {
    activity: Activity;
    onSelect: (activity: Activity) => void;
    onEdit?: (activity: Activity) => void;
    isSelected?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
    activity,
    onSelect,
    onEdit,
    isSelected = false,
}) => {
    return (
        <div
            className={`activity-card ${isSelected ? "selected" : ""}`}
            onClick={() => onSelect(activity)}
            style={{ borderColor: activity.color }}
        >
            <div className="activity-header">
                <div className="activity-icon">
                    <IconRenderer iconKey={activity.icon} size={20} />
                </div>
                <div className="activity-title-section">
                    <h3 className="activity-name">{activity.name}</h3>
                    <div className="activity-meta">
                        <span className="activity-duration">
                            {activity.duration}h
                        </span>
                        <span className="activity-mood">{activity.mood}</span>
                    </div>
                </div>
                {onEdit && (
                    <button
                        className="edit-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(activity);
                        }}
                        title="Edit activity"
                        aria-label="Edit activity"
                    >
                        <Edit3 size={14} />
                    </button>
                )}
            </div>
            <p className="activity-description">{activity.description}</p>
        </div>
    );
};

export default ActivityCard;
