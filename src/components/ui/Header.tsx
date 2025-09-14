import React from "react";
import { Calendar, Trash2 } from "lucide-react";
import "./Header.css";

interface HeaderProps {
    totalActivities: number;
    onClearSchedule: () => void;
}

const Header: React.FC<HeaderProps> = ({
    totalActivities,
    onClearSchedule,
}) => {
    return (
        <header className="app-header">
            <div className="header-content">
                <h1 className="app-title">
                    <Calendar className="title-icon" size={32} />
                    Schedule Forge
                </h1>
                <p className="app-subtitle">Plan your perfect weekend</p>

                {totalActivities > 0 && (
                    <div className="plan-stats">
                        <span className="stat">
                            {totalActivities} activities planned
                        </span>
                        <button
                            onClick={onClearSchedule}
                            className="clear-button"
                            title="Clear all activities"
                        >
                            <Trash2 size={16} />
                            Clear All
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
