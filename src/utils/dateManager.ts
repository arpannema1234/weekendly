// Date management utilities for weekend planning

export const formatDate = (date: Date): string => {
    // Use local date components to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const parseDate = (dateString: string): Date => {
    return new Date(dateString + "T00:00:00.000Z");
};

export const getDayName = (date: Date): string => {
    const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];
    return days[date.getDay()];
};

export const getDisplayName = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        month: "short",
        day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
};

export const getNextDate = (currentDate: string): string => {
    const date = parseDate(currentDate);
    date.setDate(date.getDate() + 1);
    return formatDate(date);
};

export const getPreviousDate = (currentDate: string): string => {
    const date = parseDate(currentDate);
    date.setDate(date.getDate() - 1);
    return formatDate(date);
};

export const getUpcomingWeekend = (): { saturday: string; sunday: string } => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    let saturday: Date;
    let sunday: Date;

    if (dayOfWeek === 0) {
        // If today is Sunday, "this weekend" is yesterday (Saturday) + today (Sunday)
        saturday = new Date(today);
        saturday.setDate(today.getDate() - 1); // Yesterday (Saturday)
        sunday = new Date(today); // Today (Sunday)
    } else if (dayOfWeek === 6) {
        // If today is Saturday, "this weekend" is today (Saturday) + tomorrow (Sunday)
        saturday = new Date(today); // Today (Saturday)
        sunday = new Date(today);
        sunday.setDate(today.getDate() + 1); // Tomorrow (Sunday)
    } else {
        // For other days, calculate the upcoming Saturday and Sunday
        const daysUntilSaturday = 6 - dayOfWeek;
        saturday = new Date(today);
        saturday.setDate(today.getDate() + daysUntilSaturday);
        sunday = new Date(saturday);
        sunday.setDate(saturday.getDate() + 1);
    }

    return {
        saturday: formatDate(saturday),
        sunday: formatDate(sunday),
    };
};

export const getNextWeekend = (): { saturday: string; sunday: string } => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    let daysUntilNextSaturday: number;

    if (dayOfWeek === 0) {
        // If today is Sunday, next weekend starts in 6 days (next Saturday)
        daysUntilNextSaturday = 6;
    } else if (dayOfWeek === 6) {
        // If today is Saturday, next weekend starts in 7 days (next Saturday)
        daysUntilNextSaturday = 7;
    } else {
        // For other days, next weekend is 7 days after the upcoming Saturday
        const daysUntilThisSaturday = 6 - dayOfWeek;
        daysUntilNextSaturday = daysUntilThisSaturday + 7;
    }

    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + daysUntilNextSaturday);

    const nextSunday = new Date(nextSaturday);
    nextSunday.setDate(nextSaturday.getDate() + 1);

    return {
        saturday: formatDate(nextSaturday),
        sunday: formatDate(nextSunday),
    };
};

export const createPlanDay = (date: string): import("../types").PlanDay => {
    const dateObj = parseDate(date);
    return {
        date,
        dayName: getDayName(dateObj),
        displayName: getDisplayName(dateObj),
    };
};

export const sortPlanDays = (
    planDays: import("../types").PlanDay[]
): import("../types").PlanDay[] => {
    return planDays.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
};

export const getDateRange = (startDate: string, endDate: string): string[] => {
    const dates: string[] = [];
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    for (
        let date = new Date(start);
        date <= end;
        date.setDate(date.getDate() + 1)
    ) {
        dates.push(formatDate(date));
    }

    return dates;
};

export const isValidDateRange = (
    startDate: string,
    endDate: string
): boolean => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    return start <= end;
};
