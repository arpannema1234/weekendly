import { useState, useEffect } from "react";
import type { Activity } from "./types";
import { ACTIVITIES } from "./data/activities";
import {
    WeekendPlannerProvider,
    useWeekendPlannerContext,
} from "./contexts/WeekendPlannerContext";

import Toast from "./components/ui/Toast";
import Header from "./components/ui/Header";
import NavBar from "./components/ui/NavBar";
import TimePickerModal from "./components/modals/TimePickerModal";
import ConflictModal from "./components/modals/ConflictModal";
import {
    CalendarTab,
    ThemesTab,
    ActivitiesTab,
    ScheduleTab,
    PlansTab,
} from "./components/tabs";
import "./App.css";
import "./components/layout/Calendar.css";

function AppContent() {
    const [activeTab, setActiveTab] = useState<
        "calendar" | "themes" | "activities" | "schedule" | "plans"
    >("calendar");
    const {
        currentPlan,
        addActivityToSchedule,
        clearSchedule,
        loadWeekendTheme,
        checkActivityConflicts,
        suggestAlternativeTime,
        addActivityToScheduleForced,
    } = useWeekendPlannerContext();

    const [selectedDateKey, setSelectedDateKey] = useState<string>("");
    const [calendarSelectedDates, setCalendarSelectedDates] = useState<
        string[]
    >([]);

    // Time picker modal state
    const [timePickerModal, setTimePickerModal] = useState<{
        isOpen: boolean;
        activity: Activity | null;
        dayName: string;
    }>({
        isOpen: false,
        activity: null,
        dayName: "",
    });

    // Conflict modal state
    const [conflictModal, setConflictModal] = useState<{
        isOpen: boolean;
        message: string;
        pendingActivity: {
            activity: Activity;
            dateKey: string;
            startTime: string;
            endTime: string;
        } | null;
    }>({
        isOpen: false,
        message: "",
        pendingActivity: null,
    });

    // Custom activities state
    const [customActivities, setCustomActivities] = useState<Activity[]>(() => {
        const saved = localStorage.getItem("weekendly-custom-activities");
        return saved ? JSON.parse(saved) : [];
    });

    // Combine default and custom activities
    const allActivities = [...ACTIVITIES, ...customActivities];

    // Ensure selected date is always valid
    useEffect(() => {
        if (
            currentPlan?.activeDays &&
            currentPlan.activeDays.length > 0 &&
            !currentPlan.activeDays.includes(selectedDateKey)
        ) {
            setSelectedDateKey(currentPlan.activeDays[0]);
        }
    }, [currentPlan?.activeDays, selectedDateKey]);

    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error" | "info";
        isVisible: boolean;
    }>({
        message: "",
        type: "success",
        isVisible: false,
    });

    const showToast = (
        message: string,
        type: "success" | "error" | "info" = "success"
    ) => {
        setToast({ message, type, isVisible: true });
        setTimeout(() => {
            setToast((prev) => ({ ...prev, isVisible: false }));
        }, 3000);
    };

    const handleSelectActivity = (activity: Activity) => {
        if (selectedDateKey) {
            const planDay = currentPlan?.planDays?.find(
                (pd) => pd.date === selectedDateKey
            );
            // Open time picker modal instead of immediately adding activity
            setTimePickerModal({
                isOpen: true,
                activity,
                dayName: planDay?.displayName || selectedDateKey,
            });
        }
    };

    const handleTimePickerConfirm = (startTime: string, endTime: string) => {
        if (timePickerModal.activity && selectedDateKey) {
            const planDay = currentPlan?.planDays?.find(
                (pd) => pd.date === selectedDateKey
            );

            // Check for conflicts first
            const conflictCheck = checkActivityConflicts(
                timePickerModal.activity,
                selectedDateKey,
                startTime,
                endTime
            );

            if (conflictCheck.hasConflicts) {
                // Show conflict modal
                setConflictModal({
                    isOpen: true,
                    message: conflictCheck.message,
                    pendingActivity: {
                        activity: timePickerModal.activity,
                        dateKey: selectedDateKey,
                        startTime,
                        endTime,
                    },
                });
                // Close time picker modal
                setTimePickerModal({
                    isOpen: false,
                    activity: null,
                    dayName: "",
                });
            } else {
                // No conflicts, add directly
                addActivityToSchedule(
                    timePickerModal.activity,
                    selectedDateKey,
                    startTime,
                    endTime
                );

                showToast(
                    `${timePickerModal.activity.name} added to ${
                        planDay?.displayName || selectedDateKey
                    } from ${startTime} to ${endTime}! 🎉`
                );

                // Close time picker modal
                setTimePickerModal({
                    isOpen: false,
                    activity: null,
                    dayName: "",
                });
            }
        }
    };

    const handleTimePickerClose = () => {
        setTimePickerModal({
            isOpen: false,
            activity: null,
            dayName: "",
        });
    };

    // Conflict modal handlers
    const handleConflictConfirm = () => {
        if (conflictModal.pendingActivity) {
            const { activity, dateKey, startTime, endTime } =
                conflictModal.pendingActivity;
            const planDay = currentPlan?.planDays?.find(
                (pd) => pd.date === dateKey
            );

            // Force add the activity despite conflicts
            addActivityToScheduleForced(activity, dateKey, startTime, endTime);

            showToast(
                `${activity.name} added to ${
                    planDay?.displayName || dateKey
                } from ${startTime} to ${endTime}! ⚠️ Note: Overlapping times`
            );
        }

        // Close conflict modal
        setConflictModal({
            isOpen: false,
            message: "",
            pendingActivity: null,
        });
    };

    const handleConflictCancel = () => {
        setConflictModal({
            isOpen: false,
            message: "",
            pendingActivity: null,
        });
    };

    const handleConflictSuggestAlternative = () => {
        if (conflictModal.pendingActivity) {
            const { activity, dateKey, startTime } =
                conflictModal.pendingActivity;
            const alternative = suggestAlternativeTime(
                activity,
                dateKey,
                startTime
            );

            if (alternative) {
                const planDay = currentPlan?.planDays?.find(
                    (pd) => pd.date === dateKey
                );

                // Add activity at suggested time
                addActivityToScheduleForced(
                    activity,
                    dateKey,
                    alternative.startTime,
                    alternative.endTime
                );

                showToast(
                    `${activity.name} scheduled for ${
                        planDay?.displayName || dateKey
                    } at ${alternative.startTime}-${alternative.endTime}! 🎯`
                );
            } else {
                showToast(
                    `No available time slots found for ${activity.name}. Try manually selecting a different time.`,
                    "error"
                );
            }
        }

        // Close conflict modal
        setConflictModal({
            isOpen: false,
            message: "",
            pendingActivity: null,
        });
    };

    const handleAddCustomActivity = (activity: Activity) => {
        setCustomActivities((prev) => {
            const updated = [...prev, activity];
            localStorage.setItem(
                "weekendly-custom-activities",
                JSON.stringify(updated)
            );
            return updated;
        });
        showToast(`${activity.name} added to your custom activities! 🎉`);
    };

    const handleEditActivity = (
        activityId: string,
        updates: Partial<Activity>
    ) => {
        // Only allow editing custom activities, not default ones
        setCustomActivities((prev) => {
            const updated = prev.map((activity) =>
                activity.id === activityId
                    ? { ...activity, ...updates }
                    : activity
            );
            localStorage.setItem(
                "weekendly-custom-activities",
                JSON.stringify(updated)
            );
            return updated;
        });
        showToast(`Activity updated successfully! 🎉`);
    };

    const handleEditActivityTime = (
        _activityId: string,
        startTime: string,
        endTime: string
    ) => {
        // This would update the scheduled activity's time in the current plan
        // For now, we'll show a toast
        showToast(`Activity time updated to ${startTime}-${endTime}! ⏰`);
    };

    const handleSelectTheme = (
        themeActivities: string[],
        availableActivities: Activity[]
    ) => {
        loadWeekendTheme(themeActivities, availableActivities);
        showToast("Weekend theme applied! Check your schedule 📅");
        setActiveTab("schedule");
    };

    const totalActivities = Object.values(currentPlan?.days || {}).reduce(
        (total, dayActivities) => total + dayActivities.length,
        0
    );
    return (
        <div className="app">
            <Header
                totalActivities={totalActivities}
                onClearSchedule={clearSchedule}
            />

            <NavBar activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="app-main">
                {activeTab === "calendar" && (
                    <CalendarTab
                        selectedDates={calendarSelectedDates}
                        onDateSelect={setCalendarSelectedDates}
                        onSwitchToActivities={() => setActiveTab("activities")}
                    />
                )}

                {activeTab === "themes" && (
                    <ThemesTab
                        availableActivities={allActivities}
                        onSelectTheme={handleSelectTheme}
                    />
                )}

                {activeTab === "activities" && (
                    <ActivitiesTab
                        selectedDateKey={selectedDateKey}
                        onSelectDateKey={setSelectedDateKey}
                        allActivities={allActivities}
                        onSelectActivity={handleSelectActivity}
                        onAddCustomActivity={handleAddCustomActivity}
                        onEditActivity={handleEditActivity}
                    />
                )}

                {activeTab === "schedule" && (
                    <ScheduleTab onEditActivityTime={handleEditActivityTime} />
                )}

                {activeTab === "plans" && <PlansTab />}
            </main>

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
            />

            {timePickerModal.activity && (
                <TimePickerModal
                    activity={timePickerModal.activity}
                    dayName={timePickerModal.dayName}
                    isOpen={timePickerModal.isOpen}
                    onClose={handleTimePickerClose}
                    onConfirm={handleTimePickerConfirm}
                />
            )}

            <ConflictModal
                isOpen={conflictModal.isOpen}
                message={conflictModal.message}
                onConfirm={handleConflictConfirm}
                onCancel={handleConflictCancel}
                onSuggestAlternative={handleConflictSuggestAlternative}
                hasAlternative={conflictModal.pendingActivity !== null}
            />
        </div>
    );
}

function App() {
    return (
        <WeekendPlannerProvider>
            <AppContent />
        </WeekendPlannerProvider>
    );
}

export default App;
