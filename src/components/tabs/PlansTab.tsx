import PlanManager from "../layout/PlanManager";
import { useWeekendPlannerContext } from "../../contexts/WeekendPlannerContext";

interface PlansTabProps {}

const PlansTab: React.FC<PlansTabProps> = () => {
    const {
        savedPlans,
        currentPlan,
        loadPlan,
        savePlan,
        deleteSavedPlan,
        duplicatePlan,
    } = useWeekendPlannerContext();
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

    return (
        <PlanManager
            savedPlans={savedPlans}
            currentPlan={currentPlan}
            onLoadPlan={loadPlan}
            onSavePlan={() => savePlan()}
            onDeletePlan={deleteSavedPlan}
            onDuplicatePlan={duplicatePlan}
        />
    );
};

export default PlansTab;
