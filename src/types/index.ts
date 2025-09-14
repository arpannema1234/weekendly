export interface Activity {
    id: string;
    name: string;
    description: string;
    category: ActivityCategory;
    duration: number; // in hours
    icon: string;
    mood: Mood;
    timeOfDay: TimeOfDay[];
    color: string;
}

export interface ScheduledActivity {
    id: string;
    activity: Activity;
    day: string; // Keep day name for backward compatibility
    date: string; // ISO date string (YYYY-MM-DD)
    startTime: string; // format: "HH:mm"
    endTime: string; // format: "HH:mm"
}

export interface PlanDay {
    date: string; // ISO date string (YYYY-MM-DD)
    dayName: string; // monday, tuesday, etc.
    displayName: string; // "Monday, Sep 13"
}

export interface WeekendPlan {
    id: string;
    name: string;
    theme?: WeekendTheme;
    startDate: string; // ISO date string for the plan's start date
    endDate: string; // ISO date string for the plan's end date
    days: { [dateKey: string]: ScheduledActivity[] }; // dateKey format: YYYY-MM-DD
    activeDays: string[]; // Array of date keys (YYYY-MM-DD)
    planDays: PlanDay[]; // Ordered array of plan days with full date info
    createdAt: Date;
    updatedAt: Date;
}

export const ActivityCategory = {
    FOOD: "food",
    OUTDOOR: "outdoor",
    INDOOR: "indoor",
    SOCIAL: "social",
    WELLNESS: "wellness",
    ENTERTAINMENT: "entertainment",
    PRODUCTIVITY: "productivity",
    HOBBIES: "hobbies",
} as const;

export type ActivityCategory =
    (typeof ActivityCategory)[keyof typeof ActivityCategory];

export const Mood = {
    RELAXED: "relaxed",
    ENERGETIC: "energetic",
    SOCIAL: "social",
    ADVENTUROUS: "adventurous",
    CREATIVE: "creative",
    PEACEFUL: "peaceful",
} as const;

export type Mood = (typeof Mood)[keyof typeof Mood];

export const TimeOfDay = {
    EARLY_MORNING: "early_morning", // 6-9 AM
    MORNING: "morning", // 9-12 PM
    AFTERNOON: "afternoon", // 12-5 PM
    EVENING: "evening", // 5-8 PM
    NIGHT: "night", // 8-11 PM
} as const;

export type TimeOfDay = (typeof TimeOfDay)[keyof typeof TimeOfDay];

export const WeekendTheme = {
    LAZY: "lazy",
    ADVENTUROUS: "adventurous",
    FAMILY: "family",
    ROMANTIC: "romantic",
    PRODUCTIVE: "productive",
    SOCIAL: "social",
} as const;

export type WeekendTheme = (typeof WeekendTheme)[keyof typeof WeekendTheme];

export interface TimeSlot {
    time: string;
    label: string;
}

export interface AppState {
    activities: Activity[];
    currentPlan: WeekendPlan;
    savedPlans: WeekendPlan[];
    selectedCategory: ActivityCategory | null;
    selectedMood: Mood | null;
}
