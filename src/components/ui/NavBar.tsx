import React from "react";
import { Calendar, Target, Sparkles, CalendarDays, Save } from "lucide-react";
import "./NavBar.css";

type TabType = "calendar" | "themes" | "activities" | "schedule" | "plans";

interface NavBarProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const NavBar: React.FC<NavBarProps> = ({ activeTab, onTabChange }) => {
    const navItems = [
        {
            id: "calendar" as TabType,
            label: "Calendar",
            icon: Calendar,
        },
        {
            id: "themes" as TabType,
            label: "Themes",
            icon: Target,
        },
        {
            id: "activities" as TabType,
            label: "Activities",
            icon: Sparkles,
        },
        {
            id: "schedule" as TabType,
            label: "Schedule",
            icon: CalendarDays,
        },
        {
            id: "plans" as TabType,
            label: "Plans",
            icon: Save,
        },
    ];

    return (
        <nav className="app-nav">
            {navItems.map(({ id, label, icon: Icon }) => (
                <button
                    key={id}
                    className={`nav-button ${activeTab === id ? "active" : ""}`}
                    onClick={() => onTabChange(id)}
                >
                    <Icon size={18} />
                    {label}
                </button>
            ))}
        </nav>
    );
};

export default NavBar;
