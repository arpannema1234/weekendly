import React, { useState } from "react";
import {
    formatDate,
    parseDate,
    getUpcomingWeekend,
    getNextWeekend,
} from "../../utils/dateManager";

interface CalendarProps {
    selectedDates: string[];
    onDateSelect: (dates: string[]) => void;
    onCreatePlan: (startDate: string, endDate: string, name: string) => void;
    className?: string;
}

const Calendar: React.FC<CalendarProps> = ({
    selectedDates,
    onDateSelect,
    onCreatePlan,
    className = "",
}) => {
    const [currentMonth, setCurrentMonth] = useState(() => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1);
    });

    const [planName, setPlanName] = useState("");
    const [selectionMode, setSelectionMode] = useState<"single" | "range">(
        "range"
    );

    const today = formatDate(new Date());
    const { saturday, sunday } = getUpcomingWeekend();

    const getDaysInMonth = (date: Date): Date[] => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const days: Date[] = [];

        // Add empty slots for days before the first day of the month
        // Convert Sunday-based index (0=Sunday) to Monday-based index (0=Monday)
        const sundayBasedStartDay = firstDay.getDay(); // 0 = Sunday
        const mondayBasedStartDay =
            sundayBasedStartDay === 0 ? 6 : sundayBasedStartDay - 1;
        for (let i = 0; i < mondayBasedStartDay; i++) {
            const emptyDate = new Date(
                year,
                month,
                1 - (mondayBasedStartDay - i)
            );
            days.push(emptyDate);
        }

        // Add all days of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            days.push(new Date(year, month, day));
        }

        // Fill the rest of the grid
        while (days.length % 7 !== 0) {
            const nextMonth = new Date(
                year,
                month + 1,
                days.length - lastDay.getDate() - mondayBasedStartDay + 1
            );
            days.push(nextMonth);
        }

        return days;
    };

    const handleDateClick = (date: Date) => {
        const dateStr = formatDate(date);
        console.log(
            "Date clicked:",
            dateStr,
            "Today:",
            today,
            "Is past:",
            dateStr < today
        );

        // Don't allow selecting past dates
        if (dateStr < today) return;

        if (selectionMode === "single") {
            console.log("Single mode: selecting", dateStr);
            onDateSelect([dateStr]);
        } else {
            // Range selection
            if (selectedDates.length === 0) {
                onDateSelect([dateStr]);
            } else if (selectedDates.length === 1) {
                const start = selectedDates[0];
                const end = dateStr;

                if (end < start) {
                    onDateSelect([end, start]);
                } else {
                    onDateSelect([start, end]);
                }
            } else {
                // Start new selection
                onDateSelect([dateStr]);
            }
        }
    };

    const handleQuickSelect = (type: "this-weekend" | "next-weekend") => {
        switch (type) {
            case "this-weekend":
                onDateSelect([saturday, sunday]);
                break;
            case "next-weekend":
                const { saturday: nextSat, sunday: nextSun } = getNextWeekend();
                onDateSelect([nextSat, nextSun]);
                break;
        }
    };

    const handleCreatePlan = () => {
        if (selectedDates.length === 0) return;

        const startDate = selectedDates[0];
        const endDate =
            selectedDates.length > 1 ? selectedDates[1] : selectedDates[0];
        const name =
            planName.trim() ||
            `Weekend Plan - ${parseDate(startDate).toLocaleDateString()}`;

        onCreatePlan(startDate, endDate, name);
        setPlanName("");
        onDateSelect([]);
    };

    const isDateSelected = (date: Date): boolean => {
        const dateStr = formatDate(date);
        if (selectedDates.length === 0) return false;

        if (selectedDates.length === 1) {
            return selectedDates[0] === dateStr;
        }

        // Range selection
        const start = selectedDates[0];
        const end = selectedDates[1];
        return dateStr >= start && dateStr <= end;
    };

    const isDateInCurrentMonth = (date: Date): boolean => {
        return date.getMonth() === currentMonth.getMonth();
    };

    const isDatePast = (date: Date): boolean => {
        return formatDate(date) < today;
    };

    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentMonth((prev) => {
            const newDate = new Date(prev);
            if (direction === "prev") {
                newDate.setMonth(prev.getMonth() - 1);
            } else {
                newDate.setMonth(prev.getMonth() + 1);
            }
            return newDate;
        });
    };

    const handleMonthChange = (monthIndex: number) => {
        console.log("Month changed to:", monthIndex);
        setCurrentMonth((prev) => {
            const newDate = new Date(prev);
            newDate.setMonth(monthIndex);
            console.log("New month set to:", newDate);
            return newDate;
        });
    };

    const handleYearChange = (year: number) => {
        console.log("Year changed to:", year);
        setCurrentMonth((prev) => {
            const newDate = new Date(prev);
            newDate.setFullYear(year);
            console.log("New year set to:", newDate);
            return newDate;
        });
    };

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const currentYear = currentMonth.getFullYear();
    const currentMonthIndex = currentMonth.getMonth();

    // Generate year options (current year to current year + 5)
    const yearOptions = [];
    for (let i = currentYear; i <= currentYear + 5; i++) {
        yearOptions.push(i);
    }

    const days = getDaysInMonth(currentMonth);

    return (
        <div className={`calendar-container ${className}`}>
            <div className="calendar-header">
                <h3>📅 Select Dates for Your Plan</h3>

                <div className="selection-mode">
                    <label>
                        <input
                            type="radio"
                            name="selectionMode"
                            checked={selectionMode === "single"}
                            onChange={() => setSelectionMode("single")}
                        />
                        Single Day
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="selectionMode"
                            checked={selectionMode === "range"}
                            onChange={() => setSelectionMode("range")}
                        />
                        Date Range
                    </label>
                </div>

                <div className="quick-select">
                    <button onClick={() => handleQuickSelect("this-weekend")}>
                        This Weekend
                    </button>
                    <button onClick={() => handleQuickSelect("next-weekend")}>
                        Next Weekend
                    </button>
                </div>
            </div>

            <div className="calendar-nav">
                <button onClick={() => navigateMonth("prev")}>‹</button>

                <div className="month-year-selectors">
                    <select
                        value={currentMonthIndex}
                        onChange={(e) =>
                            handleMonthChange(parseInt(e.target.value))
                        }
                        className="month-selector"
                    >
                        {months.map((month, index) => (
                            <option key={index} value={index}>
                                {month}
                            </option>
                        ))}
                    </select>

                    <select
                        value={currentYear}
                        onChange={(e) =>
                            handleYearChange(parseInt(e.target.value))
                        }
                        className="year-selector"
                    >
                        {yearOptions.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <button onClick={() => navigateMonth("next")}>›</button>
            </div>

            <div className="calendar-grid">
                <div className="calendar-weekdays">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day) => (
                            <div key={day} className="weekday">
                                {day}
                            </div>
                        )
                    )}
                </div>

                <div className="calendar-days">
                    {days.map((date, index) => {
                        date.getDay() === 0 && console.log("Rendering date:", date);
                        const isPast = isDatePast(date);
                        const isSelected = isDateSelected(date);
                        const isCurrentMonth = isDateInCurrentMonth(date);

                        return (
                            <button
                                key={index}
                                className={`calendar-day ${
                                    isSelected ? "selected" : ""
                                } ${!isCurrentMonth ? "other-month" : ""} ${
                                    isPast ? "past" : ""
                                }`}
                                onClick={() => handleDateClick(date)}
                                disabled={isPast}
                            >
                                {date.getDate()}
                            </button>
                        );
                    })}
                </div>
            </div>

            {selectedDates.length > 0 && (
                <div className="calendar-footer">
                    <div className="selected-info">
                        <strong>Selected: </strong>
                        {selectedDates.length === 1
                            ? parseDate(selectedDates[0]).toLocaleDateString()
                            : `${parseDate(
                                  selectedDates[0]
                              ).toLocaleDateString()} - ${parseDate(
                                  selectedDates[selectedDates.length - 1]
                              ).toLocaleDateString()}`}
                    </div>

                    <div className="plan-name-input">
                        <input
                            type="text"
                            placeholder="Plan name (optional)"
                            value={planName}
                            onChange={(e) => setPlanName(e.target.value)}
                        />
                    </div>

                    <button
                        className="create-plan-btn"
                        onClick={handleCreatePlan}
                    >
                        Create Plan
                    </button>
                </div>
            )}
        </div>
    );
};

export default Calendar;
