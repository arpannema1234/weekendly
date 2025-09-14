import ActivityBrowser from "../layout/ActivityBrowser";
import DaySelector from "../ui/DaySelector";
import type { Activity } from "../../types";

interface ActivitiesTabProps {
    selectedDateKey: string;
    onSelectDateKey: (dateKey: string) => void;
    allActivities: Activity[];
    onSelectActivity: (activity: Activity) => void;
    onAddCustomActivity: (activity: Activity) => void;
    onEditActivity?: (activityId: string, updates: Partial<Activity>) => void;
}

const ActivitiesTab: React.FC<ActivitiesTabProps> = ({
    selectedDateKey,
    onSelectDateKey,
    allActivities,
    onSelectActivity,
    onAddCustomActivity,
    onEditActivity,
}) => {
    return (
        <div className="activities-section">
            <DaySelector
                selectedDateKey={selectedDateKey}
                onSelectDateKey={onSelectDateKey}
            />
            <ActivityBrowser
                activities={allActivities}
                onSelectActivity={onSelectActivity}
                onAddActivity={onAddCustomActivity}
                onEditActivity={onEditActivity}
            />
        </div>
    );
};

export default ActivitiesTab;
