import React, { useState } from "react";
import type { Activity } from "../../types";
import { ActivityCategory } from "../../types";
import ActivityCard from "../cards/ActivityCard";
import AddActivityModal from "../modals/AddActivityModal";
import EditActivityModal from "../modals/EditActivityModal";
import "./ActivityBrowser.css";

interface ActivityBrowserProps {
    activities: Activity[];
    onSelectActivity: (activity: Activity) => void;
    onAddActivity?: (activity: Activity) => void;
    onEditActivity?: (activityId: string, updates: Partial<Activity>) => void;
}

const ActivityBrowser: React.FC<ActivityBrowserProps> = ({
    activities,
    onSelectActivity,
    onAddActivity,
    onEditActivity,
}) => {
    const [selectedCategory, setSelectedCategory] =
        useState<ActivityCategory | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState<Activity | null>(
        null
    );

    const handleAddActivity = (newActivity: Activity) => {
        if (onAddActivity) {
            onAddActivity(newActivity);
        }
        setIsAddModalOpen(false);
    };

    const handleEditActivity = (activity: Activity) => {
        setEditingActivity(activity);
    };

    const handleSaveEdit = (
        updates: Partial<Activity> & { startTime?: string; endTime?: string }
    ) => {
        if (editingActivity && onEditActivity) {
            onEditActivity(editingActivity.id, updates);
        }
        setEditingActivity(null);
    };

    const handleCloseEdit = () => {
        setEditingActivity(null);
    };

    const filteredActivities = activities.filter((activity) => {
        const matchesCategory =
            !selectedCategory || activity.category === selectedCategory;
        const matchesSearch =
            activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categories = Object.values(ActivityCategory);

    return (
        <div className="activity-browser">
            <div className="browser-header">
                <div className="header-top">
                    <h2>Choose Your Activities</h2>
                    {onAddActivity && (
                        <button
                            className="add-activity-button"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            + Add Activity
                        </button>
                    )}
                </div>
                <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="category-filters">
                <button
                    className={`category-filter ${
                        !selectedCategory ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(null)}
                >
                    All
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`category-filter ${
                            selectedCategory === category ? "active" : ""
                        }`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>

            <div className="activities-grid">
                {filteredActivities.map((activity) => (
                    <ActivityCard
                        key={activity.id}
                        activity={activity}
                        onSelect={onSelectActivity}
                        onEdit={handleEditActivity}
                    />
                ))}
            </div>

            {filteredActivities.length === 0 && (
                <div className="no-activities">
                    <p>No activities found matching your criteria.</p>
                </div>
            )}

            <AddActivityModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddActivity={handleAddActivity}
            />

            {editingActivity && (
                <EditActivityModal
                    isOpen={!!editingActivity}
                    activity={editingActivity}
                    editMode="full"
                    onClose={handleCloseEdit}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
};

export default ActivityBrowser;
