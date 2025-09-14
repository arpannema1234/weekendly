import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { WeekendPlan, ScheduledActivity, Activity } from "../types";
import { generateId, addHours } from "../utils/time";
import {
    formatDate,
    getUpcomingWeekend,
    createPlanDay,
    sortPlanDays,
    getNextDate,
    getPreviousDate,
    getDayName,
} from "../utils/dateManager";
import {
    findConflictingActivities,
    generateConflictMessage,
    findNextAvailableTimeSlot,
} from "../utils/timeConflicts";

const createEmptyWeekendPlan = (): WeekendPlan => {
    const { saturday, sunday } = getUpcomingWeekend();
    const days: { [dateKey: string]: ScheduledActivity[] } = {};
    const planDays = [createPlanDay(saturday), createPlanDay(sunday)];

    days[saturday] = [];
    days[sunday] = [];

    return {
        id: generateId(),
        name: "My Weekend Plan",
        startDate: saturday,
        endDate: sunday,
        days,
        activeDays: [saturday, sunday],
        planDays: sortPlanDays(planDays),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};

interface SchedulePlannerContextType {
    currentPlan: WeekendPlan;
    savedPlans: WeekendPlan[];
    addActivityToSchedule: (
        activity: Activity,
        dateKey: string,
        startTime?: string,
        endTime?: string
    ) => void;
    removeActivityFromSchedule: (activityId: string) => void;
    updateActivityTime: (activityId: string, newStartTime: string) => void;
    clearSchedule: () => void;
    loadWeekendTheme: (
        themeActivities: string[],
        availableActivities: Activity[]
    ) => void;
    addDay: (afterDateKey?: string) => void;
    removeDay: (dateKey: string, force?: boolean) => void;
    dayHasActivities: (dateKey: string) => boolean;
    getDayActivityCount: (dateKey: string) => number;
    createNewPlan: (
        startDate: string,
        endDate: string,
        name: string
    ) => WeekendPlan;
    savePlan: (plan?: WeekendPlan) => void;
    loadPlan: (planId: string) => void;
    deleteSavedPlan: (planId: string) => void;
    duplicatePlan: (
        planId: string,
        newName?: string
    ) => WeekendPlan | undefined;
    moveActivity: (
        activityId: string,
        sourceDate: string,
        targetDate: string
    ) => void;
    checkActivityConflicts: (
        activity: Activity,
        dateKey: string,
        startTime: string,
        endTime: string
    ) => {
        hasConflicts: boolean;
        conflicts: ScheduledActivity[];
        message: string;
    };
    checkMoveConflicts: (
        activityId: string,
        targetDate: string
    ) => {
        hasConflicts: boolean;
        conflicts: ScheduledActivity[];
        message: string;
        activityName: string;
    };
    suggestAlternativeTime: (
        activity: Activity,
        dateKey: string,
        preferredStartTime?: string
    ) => {
        startTime: string;
        endTime: string;
    } | null;
    addActivityToScheduleForced: (
        activity: Activity,
        dateKey: string,
        startTime: string,
        endTime: string
    ) => void;
}

const SchedulePlannerContext = createContext<
    SchedulePlannerContextType | undefined
>(undefined);

interface SchedulePlannerProviderProps {
    children: ReactNode;
}

export const SchedulePlannerProvider: React.FC<SchedulePlannerProviderProps> = ({
    children,
}) => {
    const [savedPlans, setSavedPlans] = useState<WeekendPlan[]>(() => {
        // Load saved plans from localStorage
        const saved = localStorage.getItem("schedule-forge-saved-plans");
        if (saved) {
            try {
                return JSON.parse(saved).map((plan: any) => ({
                    ...plan,
                    createdAt: new Date(plan.createdAt),
                    updatedAt: new Date(plan.updatedAt),
                }));
            } catch {
                return [];
            }
        }
        return [];
    });

    const [currentPlan, setCurrentPlan] = useState<WeekendPlan>(() => {
        // Try to load from localStorage
        const saved = localStorage.getItem("schedule-forge-current-plan");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                // Check if it's old format with saturday/sunday properties
                if (
                    parsed.saturday !== undefined ||
                    parsed.sunday !== undefined
                ) {
                    // Migrate old data to new format with current weekend dates
                    const { saturday, sunday } = getUpcomingWeekend();
                    const migratedPlan: WeekendPlan = {
                        id: parsed.id || generateId(),
                        name: parsed.name || "My Weekend Plan",
                        startDate: saturday,
                        endDate: sunday,
                        days: {
                            [saturday]: parsed.saturday || [],
                            [sunday]: parsed.sunday || [],
                        },
                        activeDays: [saturday, sunday],
                        planDays: [
                            createPlanDay(saturday),
                            createPlanDay(sunday),
                        ],
                        createdAt: new Date(parsed.createdAt) || new Date(),
                        updatedAt: new Date(parsed.updatedAt) || new Date(),
                    };
                    return migratedPlan;
                }

                // Check if new format has required properties
                if (parsed.days && parsed.activeDays) {
                    return {
                        ...parsed,
                        createdAt: new Date(parsed.createdAt),
                        updatedAt: new Date(parsed.updatedAt),
                    };
                }

                return createEmptyWeekendPlan();
            } catch {
                return createEmptyWeekendPlan();
            }
        }
        return createEmptyWeekendPlan();
    });

    // Save to localStorage whenever the plan changes
    useEffect(() => {
        localStorage.setItem(
            "schedule-forge-current-plan",
            JSON.stringify(currentPlan)
        );
    }, [currentPlan]);

    // Save to localStorage whenever saved plans change
    useEffect(() => {
        localStorage.setItem(
            "schedule-forge-saved-plans",
            JSON.stringify(savedPlans)
        );
    }, [savedPlans]);

    const addActivityToSchedule = (
        activity: Activity,
        dateKey: string,
        startTime?: string,
        endTime?: string
    ) => {
        const scheduledActivities = currentPlan.days[dateKey] || [];

        // Find a suitable time slot if not provided
        let proposedStartTime = startTime || "09:00";
        let proposedEndTime = endTime;

        if (!startTime) {
            // Start at 9 AM if no activities, otherwise find the next available slot
            if (scheduledActivities.length === 0) {
                proposedStartTime = "09:00";
            } else {
                // Sort activities by start time and find next available slot
                const sortedActivities = [...scheduledActivities].sort((a, b) =>
                    a.startTime.localeCompare(b.startTime)
                );
                const lastActivity =
                    sortedActivities[sortedActivities.length - 1];
                proposedStartTime = lastActivity.endTime;
            }
        }

        // Use provided end time or calculate from duration
        if (!proposedEndTime) {
            proposedEndTime = addHours(proposedStartTime, activity.duration);
        }

        // Get the day name from the date
        const dayName = getDayName(new Date(dateKey + "T00:00:00.000Z"));

        const newScheduledActivity: ScheduledActivity = {
            id: generateId(),
            activity,
            day: dayName,
            date: dateKey,
            startTime: proposedStartTime,
            endTime: proposedEndTime,
        };

        setCurrentPlan((prev) => ({
            ...prev,
            days: {
                ...prev.days,
                [dateKey]: [
                    ...(prev.days[dateKey] || []),
                    newScheduledActivity,
                ],
            },
            updatedAt: new Date(),
        }));
    };

    const removeActivityFromSchedule = (activityId: string) => {
        setCurrentPlan((prev) => {
            const newDays = { ...prev.days };
            Object.keys(newDays).forEach((day) => {
                newDays[day] = newDays[day].filter((a) => a.id !== activityId);
            });

            return {
                ...prev,
                days: newDays,
                updatedAt: new Date(),
            };
        });
    };

    const updateActivityTime = (activityId: string, newStartTime: string) => {
        setCurrentPlan((prev) => {
            const updateDay = (activities: ScheduledActivity[]) =>
                activities.map((activity) => {
                    if (activity.id === activityId) {
                        return {
                            ...activity,
                            startTime: newStartTime,
                            endTime: addHours(
                                newStartTime,
                                activity.activity.duration
                            ),
                        };
                    }
                    return activity;
                });

            const newDays = { ...prev.days };
            Object.keys(newDays).forEach((day) => {
                newDays[day] = updateDay(newDays[day]);
            });

            return {
                ...prev,
                days: newDays,
                updatedAt: new Date(),
            };
        });
    };

    const clearSchedule = () => {
        setCurrentPlan((prev) => {
            const clearedDays: { [day: string]: ScheduledActivity[] } = {};
            prev.activeDays.forEach((day) => {
                clearedDays[day] = [];
            });

            return {
                ...prev,
                days: clearedDays,
                updatedAt: new Date(),
            };
        });
    };

    const loadWeekendTheme = (
        themeActivities: string[],
        availableActivities: Activity[]
    ) => {
        // Clear current schedule first
        clearSchedule();

        // Process theme activities with proper state management
        setCurrentPlan((prev) => {
            const updatedPlan = { ...prev };
            const sortedDays = sortPlanDays(updatedPlan.planDays);

            // Track activities added to each day during this operation
            const dayActivities: { [dateKey: string]: ScheduledActivity[] } =
                {};

            // Initialize with existing (empty) activities
            sortedDays.forEach((day) => {
                dayActivities[day.date] = [
                    ...(updatedPlan.days[day.date] || []),
                ];
            });

            // Schedule each theme activity
            themeActivities.forEach((activityId, index) => {
                const activity = availableActivities.find(
                    (a) => a.id === activityId
                );
                if (!activity) return;

                let scheduled = false;

                // Try to place on preferred day (cycling through days)
                const preferredDayIndex = index % sortedDays.length;
                const preferredDateKey = sortedDays[preferredDayIndex].date;

                // Check if we can schedule on the preferred day
                const availableSlot = findNextAvailableTimeSlot(
                    activity.duration,
                    dayActivities[preferredDateKey],
                    "09:00"
                );

                if (availableSlot) {
                    // Schedule on preferred day
                    const dayName = getDayName(
                        new Date(preferredDateKey + "T00:00:00.000Z")
                    );
                    const newScheduledActivity: ScheduledActivity = {
                        id: generateId(),
                        activity,
                        day: dayName,
                        date: preferredDateKey,
                        startTime: availableSlot.startTime,
                        endTime: availableSlot.endTime,
                    };

                    dayActivities[preferredDateKey].push(newScheduledActivity);
                    scheduled = true;
                } else {
                    // Try other days if preferred day is full
                    for (const planDay of sortedDays) {
                        if (planDay.date === preferredDateKey) continue; // Already tried

                        const slot = findNextAvailableTimeSlot(
                            activity.duration,
                            dayActivities[planDay.date],
                            "09:00"
                        );

                        if (slot) {
                            const dayName = getDayName(
                                new Date(planDay.date + "T00:00:00.000Z")
                            );
                            const newScheduledActivity: ScheduledActivity = {
                                id: generateId(),
                                activity,
                                day: dayName,
                                date: planDay.date,
                                startTime: slot.startTime,
                                endTime: slot.endTime,
                            };

                            dayActivities[planDay.date].push(
                                newScheduledActivity
                            );
                            scheduled = true;
                            break;
                        }
                    }
                }

                // If still not scheduled, force on preferred day (shouldn't happen with good themes)
                if (!scheduled) {
                    const dayName = getDayName(
                        new Date(preferredDateKey + "T00:00:00.000Z")
                    );
                    const newScheduledActivity: ScheduledActivity = {
                        id: generateId(),
                        activity,
                        day: dayName,
                        date: preferredDateKey,
                        startTime: "09:00",
                        endTime: addHours("09:00", activity.duration),
                    };

                    dayActivities[preferredDateKey].push(newScheduledActivity);
                }
            });

            return {
                ...updatedPlan,
                days: dayActivities,
                updatedAt: new Date(),
            };
        });
    };

    const addDay = (afterDateKey?: string) => {
        setCurrentPlan((prev) => {
            let newDateKey: string;

            if (afterDateKey) {
                const nextDate = getNextDate(afterDateKey);
                if (prev.activeDays.includes(nextDate)) {
                    return prev; // Can't add day - already exists
                }
                newDateKey = nextDate;
            } else {
                // Add day before first day
                const sortedDays = sortPlanDays(prev.planDays);
                const firstDate = sortedDays[0].date;
                const prevDate = getPreviousDate(firstDate);
                if (prev.activeDays.includes(prevDate)) {
                    return prev; // Can't add day - already exists
                }
                newDateKey = prevDate;
            }

            const newPlanDay = createPlanDay(newDateKey);
            const updatedPlanDays = sortPlanDays([
                ...prev.planDays,
                newPlanDay,
            ]);

            return {
                ...prev,
                activeDays: [...prev.activeDays, newDateKey],
                planDays: updatedPlanDays,
                startDate: updatedPlanDays[0].date,
                endDate: updatedPlanDays[updatedPlanDays.length - 1].date,
                days: {
                    ...prev.days,
                    [newDateKey]: [],
                },
                updatedAt: new Date(),
            };
        });
    };

    // Check if a day has scheduled activities
    const dayHasActivities = (dateKey: string): boolean => {
        return (
            currentPlan.days[dateKey] && currentPlan.days[dateKey].length > 0
        );
    };

    // Get the number of activities in a day
    const getDayActivityCount = (dateKey: string): number => {
        return currentPlan.days[dateKey]?.length || 0;
    };

    const removeDay = (dateKey: string, force: boolean = false) => {
        setCurrentPlan((prev) => {
            // Don't remove if it's the last day
            if (prev.activeDays.length <= 1) {
                return prev;
            }

            // Don't remove if it has activities unless forced
            if (!force && prev.days[dateKey] && prev.days[dateKey].length > 0) {
                return prev;
            }

            const newActiveDays = prev.activeDays.filter((d) => d !== dateKey);
            const newPlanDays = prev.planDays.filter(
                (pd) => pd.date !== dateKey
            );
            const newDays = { ...prev.days };
            delete newDays[dateKey];

            return {
                ...prev,
                activeDays: newActiveDays,
                planDays: newPlanDays,
                startDate: newPlanDays[0]?.date || prev.startDate,
                endDate:
                    newPlanDays[newPlanDays.length - 1]?.date || prev.endDate,
                days: newDays,
                updatedAt: new Date(),
            };
        });
    };

    const createNewPlan = (
        startDate: string,
        endDate: string,
        name: string
    ) => {
        const dateRange = [];
        const start = new Date(startDate + "T00:00:00.000Z");
        const end = new Date(endDate + "T00:00:00.000Z");

        for (
            let date = new Date(start);
            date <= end;
            date.setDate(date.getDate() + 1)
        ) {
            dateRange.push(formatDate(date));
        }

        const planDays = dateRange.map((date) => createPlanDay(date));
        const days: { [dateKey: string]: ScheduledActivity[] } = {};

        dateRange.forEach((date) => {
            days[date] = [];
        });

        const newPlan: WeekendPlan = {
            id: generateId(),
            name,
            startDate,
            endDate,
            days,
            activeDays: dateRange,
            planDays: sortPlanDays(planDays),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        setCurrentPlan(newPlan);
        return newPlan;
    };

    const savePlan = (plan?: WeekendPlan) => {
        const planToSave = plan || currentPlan;
        const existingIndex = savedPlans.findIndex(
            (p) => p.id === planToSave.id
        );

        if (existingIndex !== -1) {
            // Update existing plan
            setSavedPlans((prev) =>
                prev.map((p) =>
                    p.id === planToSave.id
                        ? { ...planToSave, updatedAt: new Date() }
                        : p
                )
            );
        } else {
            // Add new plan
            setSavedPlans((prev) => [
                ...prev,
                { ...planToSave, updatedAt: new Date() },
            ]);
        }
    };

    const loadPlan = (planId: string) => {
        const plan = savedPlans.find((p) => p.id === planId);
        if (plan) {
            setCurrentPlan(plan);
        }
    };

    const deleteSavedPlan = (planId: string) => {
        setSavedPlans((prev) => prev.filter((p) => p.id !== planId));
    };

    const duplicatePlan = (planId: string, newName?: string) => {
        const plan = savedPlans.find((p) => p.id === planId);
        if (plan) {
            const duplicatedPlan = {
                ...plan,
                id: generateId(),
                name: newName || `${plan.name} (Copy)`,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setSavedPlans((prev) => [...prev, duplicatedPlan]);
            return duplicatedPlan;
        }
    };

    const moveActivity = (
        activityId: string,
        sourceDate: string,
        targetDate: string
    ) => {
        setCurrentPlan((prev) => {
            // Find the activity in the source date
            const sourceActivities = prev.days[sourceDate] || [];
            const activityToMove = sourceActivities.find(
                (a) => a.id === activityId
            );

            if (!activityToMove) return prev;

            // Remove activity from source date
            const updatedSourceActivities = sourceActivities.filter(
                (a) => a.id !== activityId
            );

            // Add activity to target date with updated date
            const targetActivities = prev.days[targetDate] || [];
            const movedActivity = {
                ...activityToMove,
                date: targetDate,
                day: getDayName(new Date(targetDate + "T00:00:00.000Z")),
            };

            return {
                ...prev,
                days: {
                    ...prev.days,
                    [sourceDate]: updatedSourceActivities,
                    [targetDate]: [...targetActivities, movedActivity],
                },
                updatedAt: new Date(),
            };
        });
    };

    // function to check for conflicts when adding activities
    const checkActivityConflicts = (
        activity: Activity,
        dateKey: string,
        startTime: string,
        endTime: string
    ): {
        hasConflicts: boolean;
        conflicts: ScheduledActivity[];
        message: string;
    } => {
        const existingActivities = currentPlan.days[dateKey] || [];
        const conflicts = findConflictingActivities(
            { startTime, endTime },
            existingActivities
        );

        return {
            hasConflicts: conflicts.length > 0,
            conflicts,
            message: generateConflictMessage(conflicts, activity.name),
        };
    };

    // function to check for conflicts when moving activities
    const checkMoveConflicts = (
        activityId: string,
        targetDate: string
    ): {
        hasConflicts: boolean;
        conflicts: ScheduledActivity[];
        message: string;
        activityName: string;
    } => {
        // Find the activity being moved
        let activityToMove: ScheduledActivity | undefined = undefined;

        // Search through all days to find the activity
        for (const dayActivities of Object.values(currentPlan.days)) {
            const found = dayActivities.find((a) => a.id === activityId);
            if (found) {
                activityToMove = found;
                break;
            }
        }

        if (!activityToMove) {
            return {
                hasConflicts: false,
                conflicts: [],
                message: "",
                activityName: "",
            };
        }

        const targetActivities = currentPlan.days[targetDate] || [];
        const conflicts = findConflictingActivities(
            {
                startTime: activityToMove.startTime,
                endTime: activityToMove.endTime,
            },
            targetActivities,
            activityId // Exclude the activity being moved
        );

        return {
            hasConflicts: conflicts.length > 0,
            conflicts,
            message: generateConflictMessage(
                conflicts,
                activityToMove.activity.name
            ),
            activityName: activityToMove.activity.name,
        };
    };

    // New function to suggest alternative time
    const suggestAlternativeTime = (
        activity: Activity,
        dateKey: string,
        preferredStartTime?: string
    ): {
        startTime: string;
        endTime: string;
    } | null => {
        const existingActivities = currentPlan.days[dateKey] || [];
        return findNextAvailableTimeSlot(
            activity.duration,
            existingActivities,
            preferredStartTime
        );
    };

    // Force add activity (ignoring conflicts)
    const addActivityToScheduleForced = (
        activity: Activity,
        dateKey: string,
        startTime: string,
        endTime: string
    ) => {
        const dayName = getDayName(new Date(dateKey + "T00:00:00.000Z"));

        const newScheduledActivity: ScheduledActivity = {
            id: generateId(),
            activity,
            day: dayName,
            date: dateKey,
            startTime,
            endTime,
        };

        setCurrentPlan((prev) => ({
            ...prev,
            days: {
                ...prev.days,
                [dateKey]: [
                    ...(prev.days[dateKey] || []),
                    newScheduledActivity,
                ],
            },
            updatedAt: new Date(),
        }));
    };

    const value: SchedulePlannerContextType = {
        currentPlan,
        savedPlans,
        addActivityToSchedule,
        removeActivityFromSchedule,
        updateActivityTime,
        clearSchedule,
        loadWeekendTheme,
        addDay,
        removeDay,
        createNewPlan,
        savePlan,
        loadPlan,
        deleteSavedPlan,
        duplicatePlan,
        moveActivity,
        checkActivityConflicts,
        checkMoveConflicts,
        suggestAlternativeTime,
        addActivityToScheduleForced,
        dayHasActivities,
        getDayActivityCount,
    };

    return (
        <SchedulePlannerContext.Provider value={value}>
            {children}
        </SchedulePlannerContext.Provider>
    );
};

export const useSchedulePlannerContext = (): SchedulePlannerContextType => {
    const context = useContext(SchedulePlannerContext);
    if (context === undefined) {
        throw new Error(
            "useSchedulePlannerContext must be used within a SchedulePlannerProvider"
        );
    }
    return context;
};
