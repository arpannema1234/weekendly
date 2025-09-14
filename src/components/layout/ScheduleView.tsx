import React from "react";
import type { WeekendPlan } from "../../types";
import DroppableDay from "../dnd/DroppableDay";
import DragDropProvider from "../dnd/DragDropProvider";
import withScrolling, { createHorizontalStrength } from "react-dnd-scrolling";
import "./ScheduleView.css";

interface ScheduleViewProps {
    weekendPlan: WeekendPlan;
    onRemoveActivity: (id: string) => void;
    onMoveActivity: (
        activityId: string,
        sourceDate: string,
        targetDate: string
    ) => void;
    onEditActivityTime?: (
        id: string,
        startTime: string,
        endTime: string
    ) => void;
}

// Create a scrolling component with horizontal auto-scroll
const ScrollingContainer = withScrolling("div");

// Create horizontal strength function for auto-scroll
const horizontalStrength = createHorizontalStrength(150);

const ScheduleView: React.FC<ScheduleViewProps> = ({
    weekendPlan,
    onRemoveActivity,
    onMoveActivity,
    onEditActivityTime,
}) => {
    return (
        <DragDropProvider>
            <div className="schedule-view">
                <h2>{weekendPlan.name}</h2>

                <div className="plan-date-range">
                    {weekendPlan.startDate === weekendPlan.endDate
                        ? new Date(
                              weekendPlan.startDate + "T00:00:00.000Z"
                          ).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                          })
                        : `${new Date(
                              weekendPlan.startDate + "T00:00:00.000Z"
                          ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                          })} - ${new Date(
                              weekendPlan.endDate + "T00:00:00.000Z"
                          ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                          })}`}
                </div>

                <ScrollingContainer
                    className="schedule-days-horizontal"
                    horizontalStrength={horizontalStrength}
                >
                    {weekendPlan.planDays.map((planDay) => {
                        const dayActivities =
                            weekendPlan.days[planDay.date] || [];

                        return (
                            <DroppableDay
                                key={planDay.date}
                                planDay={planDay}
                                activities={dayActivities}
                                onDropActivity={onMoveActivity}
                                onRemoveActivity={onRemoveActivity}
                                onEditActivityTime={onEditActivityTime}
                            />
                        );
                    })}
                </ScrollingContainer>
            </div>
        </DragDropProvider>
    );
};

export default ScheduleView;
