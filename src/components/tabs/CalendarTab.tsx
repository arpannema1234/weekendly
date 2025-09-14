import Calendar from "../layout/Calendar";
import { useWeekendPlannerContext } from "../../contexts/WeekendPlannerContext";

interface CalendarTabProps {
    selectedDates: string[];
    onDateSelect: (dates: string[]) => void;
    onSwitchToActivities: () => void;
}

const CalendarTab: React.FC<CalendarTabProps> = ({
    selectedDates,
    onDateSelect,
    onSwitchToActivities,
}) => {
    const { createNewPlan } = useWeekendPlannerContext();

    const handleCreatePlan = (
        startDate: string,
        endDate: string,
        name: string
    ) => {
        createNewPlan(startDate, endDate, name);
        onDateSelect([]);
        onSwitchToActivities();
    };

    return (
        <Calendar
            selectedDates={selectedDates}
            onDateSelect={onDateSelect}
            onCreatePlan={handleCreatePlan}
        />
    );
};

export default CalendarTab;
