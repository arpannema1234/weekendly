import type { ScheduledActivity } from "../types";

/**
 * Converts time string (HH:mm) to minutes since midnight for easier comparison
 */
export const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

/**
 * Converts minutes since midnight back to time string (HH:mm)
 */
export const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}`;
};

/**
 * Checks if two time ranges overlap
 * @param start1 Start time of first activity (HH:mm)
 * @param end1 End time of first activity (HH:mm)
 * @param start2 Start time of second activity (HH:mm)
 * @param end2 End time of second activity (HH:mm)
 * @returns true if the time ranges overlap
 */
export const doTimeRangesOverlap = (
    start1: string,
    end1: string,
    start2: string,
    end2: string
): boolean => {
    const start1Minutes = timeToMinutes(start1);
    const end1Minutes = timeToMinutes(end1);
    const start2Minutes = timeToMinutes(start2);
    const end2Minutes = timeToMinutes(end2);

    // Two ranges overlap if:
    // start1 < end2 AND start2 < end1
    return start1Minutes < end2Minutes && start2Minutes < end1Minutes;
};

/**
 * Finds conflicting activities for a new activity in a given day
 * @param newActivity The activity being added/moved
 * @param existingActivities Activities already scheduled for the day
 * @param excludeActivityId Optional activity ID to exclude from conflict checking (useful for moves)
 * @returns Array of conflicting activities
 */
export const findConflictingActivities = (
    newActivity: {
        startTime: string;
        endTime: string;
    },
    existingActivities: ScheduledActivity[],
    excludeActivityId?: string
): ScheduledActivity[] => {
    return existingActivities.filter((existing) => {
        // Skip the activity being moved (in case of drag-drop)
        if (excludeActivityId && existing.id === excludeActivityId) {
            return false;
        }

        return doTimeRangesOverlap(
            newActivity.startTime,
            newActivity.endTime,
            existing.startTime,
            existing.endTime
        );
    });
};

/**
 * Generates a human-readable conflict message
 * @param conflictingActivities Array of conflicting activities
 * @param newActivityName Name of the activity being added
 * @returns Formatted conflict warning message
 */
export const generateConflictMessage = (
    conflictingActivities: ScheduledActivity[],
    newActivityName: string
): string => {
    if (conflictingActivities.length === 0) {
        return "";
    }

    const conflicts = conflictingActivities
        .map((activity) => {
            const activityName = activity.activity.name;
            const timeRange = `${activity.startTime}-${activity.endTime}`;
            return `• ${activityName} (${timeRange})`;
        })
        .join("\n");

    const conflictWord =
        conflictingActivities.length === 1 ? "activity" : "activities";

    return `⚠️ Time Conflict Warning!

"${newActivityName}" overlaps with existing ${conflictWord}:

${conflicts}

Do you want to proceed anyway? This will create overlapping activities in your schedule.`;
};

/**
 * Finds the next available time slot for an activity
 * @param duration Activity duration in hours
 * @param existingActivities Activities already scheduled for the day
 * @param preferredStartTime Preferred start time (optional)
 * @returns Object with suggested start and end times, or null if no slot found
 */
export const findNextAvailableTimeSlot = (
    duration: number,
    existingActivities: ScheduledActivity[],
    preferredStartTime: string = "09:00"
): { startTime: string; endTime: string } | null => {
    const durationMinutes = duration * 60;
    const startOfDay = timeToMinutes("06:00"); // 6 AM
    const endOfDay = timeToMinutes("23:59"); // 11:59 PM

    // Sort existing activities by start time
    const sortedActivities = [...existingActivities].sort(
        (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );

    let currentTime = Math.max(timeToMinutes(preferredStartTime), startOfDay);

    // Check if we can fit before the first activity
    if (sortedActivities.length === 0) {
        const endTime = minutesToTime(currentTime + durationMinutes);
        return {
            startTime: minutesToTime(currentTime),
            endTime: endTime,
        };
    }

    // Try to fit before the first activity
    const firstActivityStart = timeToMinutes(sortedActivities[0].startTime);
    if (currentTime + durationMinutes <= firstActivityStart) {
        return {
            startTime: minutesToTime(currentTime),
            endTime: minutesToTime(currentTime + durationMinutes),
        };
    }

    // Try to fit between activities
    for (let i = 0; i < sortedActivities.length - 1; i++) {
        const currentActivityEnd = timeToMinutes(sortedActivities[i].endTime);
        const nextActivityStart = timeToMinutes(
            sortedActivities[i + 1].startTime
        );

        const gapStart = Math.max(currentTime, currentActivityEnd);
        const availableTime = nextActivityStart - gapStart;

        if (availableTime >= durationMinutes) {
            return {
                startTime: minutesToTime(gapStart),
                endTime: minutesToTime(gapStart + durationMinutes),
            };
        }
    }

    // Try to fit after the last activity
    const lastActivityEnd = timeToMinutes(
        sortedActivities[sortedActivities.length - 1].endTime
    );
    const finalSlotStart = Math.max(currentTime, lastActivityEnd);

    if (finalSlotStart + durationMinutes <= endOfDay) {
        return {
            startTime: minutesToTime(finalSlotStart),
            endTime: minutesToTime(finalSlotStart + durationMinutes),
        };
    }

    // No available slot found
    return null;
};
