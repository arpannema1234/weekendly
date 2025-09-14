import React, { useState } from "react";
import type { WeekendPlan } from "../../types";
import { parseDate } from "../../utils/dateManager";
import "./PlanManager.css";

interface PlanManagerProps {
    savedPlans: WeekendPlan[];
    currentPlan: WeekendPlan;
    onLoadPlan: (planId: string) => void;
    onSavePlan: () => void;
    onDeletePlan: (planId: string) => void;
    onDuplicatePlan: (planId: string, newName?: string) => void;
}

const PlanManager: React.FC<PlanManagerProps> = ({
    savedPlans,
    currentPlan,
    onLoadPlan,
    onSavePlan,
    onDeletePlan,
    onDuplicatePlan,
}) => {
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [planName, setPlanName] = useState("");

    const handleSavePlan = () => {
        onSavePlan();
        setShowSaveDialog(false);
        setPlanName("");
    };

    const handleDuplicatePlan = (planId: string) => {
        const originalPlan = savedPlans.find((p) => p.id === planId);
        if (originalPlan) {
            const newName = prompt(
                "Enter name for duplicated plan:",
                `${originalPlan.name} (Copy)`
            );
            if (newName) {
                onDuplicatePlan(planId, newName);
            }
        }
    };

    const formatDateRange = (startDate: string, endDate: string) => {
        const start = parseDate(startDate);
        const end = parseDate(endDate);

        const startStr = start.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });

        if (startDate === endDate) {
            return startStr;
        }

        const endStr = end.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });

        return `${startStr} - ${endStr}`;
    };

    const getActivityCount = (plan: WeekendPlan) => {
        return Object.values(plan.days).reduce(
            (total, dayActivities) => total + dayActivities.length,
            0
        );
    };

    return (
        <div className="plan-manager">
            <div className="plan-manager-header">
                <h2>📋 Plan Manager</h2>
                <div className="current-plan-actions">
                    <button
                        className="save-current-btn"
                        onClick={() => {
                            setShowSaveDialog(true);
                            setPlanName(currentPlan.name);
                        }}
                    >
                        💾 Save Current Plan
                    </button>
                </div>
            </div>

            <div className="current-plan-info">
                <h3>Current Plan</h3>
                <div className="plan-card current">
                    <div className="plan-info">
                        <div className="plan-name">{currentPlan.name}</div>
                        <div className="plan-details">
                            <span className="date-range">
                                📅{" "}
                                {formatDateRange(
                                    currentPlan.startDate,
                                    currentPlan.endDate
                                )}
                            </span>
                            <span className="activity-count">
                                ✨ {getActivityCount(currentPlan)} activities
                            </span>
                            <span className="day-count">
                                📆 {currentPlan.activeDays.length} days
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="saved-plans">
                <h3>Saved Plans ({savedPlans.length})</h3>
                {savedPlans.length === 0 ? (
                    <div className="no-plans">
                        <p>
                            No saved plans yet. Save your current plan to get
                            started!
                        </p>
                    </div>
                ) : (
                    <div className="plans-grid">
                        {savedPlans.map((plan) => (
                            <div key={plan.id} className="plan-card">
                                <div className="plan-info">
                                    <div className="plan-name">{plan.name}</div>
                                    <div className="plan-details">
                                        <span className="date-range">
                                            📅{" "}
                                            {formatDateRange(
                                                plan.startDate,
                                                plan.endDate
                                            )}
                                        </span>
                                        <span className="activity-count">
                                            ✨ {getActivityCount(plan)}{" "}
                                            activities
                                        </span>
                                        <span className="day-count">
                                            📆 {plan.activeDays.length} days
                                        </span>
                                    </div>
                                    <div className="plan-meta">
                                        <span className="created-date">
                                            Created:{" "}
                                            {plan.createdAt.toLocaleDateString()}
                                        </span>
                                        <span className="updated-date">
                                            Updated:{" "}
                                            {plan.updatedAt.toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="plan-actions">
                                    <button
                                        className="load-btn"
                                        onClick={() => onLoadPlan(plan.id)}
                                        title="Load this plan"
                                    >
                                        📂 Load
                                    </button>
                                    <button
                                        className="duplicate-btn"
                                        onClick={() =>
                                            handleDuplicatePlan(plan.id)
                                        }
                                        title="Duplicate this plan"
                                    >
                                        📋 Copy
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => {
                                            if (
                                                confirm(
                                                    `Delete "${plan.name}"? This cannot be undone.`
                                                )
                                            ) {
                                                onDeletePlan(plan.id);
                                            }
                                        }}
                                        title="Delete this plan"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showSaveDialog && (
                <div className="save-dialog-overlay">
                    <div className="save-dialog">
                        <h3>Save Plan</h3>
                        <div className="form-group">
                            <label htmlFor="planName">Plan Name:</label>
                            <input
                                id="planName"
                                type="text"
                                value={planName}
                                onChange={(e) => setPlanName(e.target.value)}
                                placeholder="Enter plan name..."
                                autoFocus
                            />
                        </div>
                        <div className="dialog-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => {
                                    setShowSaveDialog(false);
                                    setPlanName("");
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="save-btn"
                                onClick={handleSavePlan}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanManager;
