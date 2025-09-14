import React from "react";
import type { Activity } from "../../types";
import { WEEKEND_THEMES } from "../../data/activities";
import "./ThemeSelector.css";

interface ThemeSelectorProps {
    onSelectTheme: (
        themeActivities: string[],
        availableActivities: Activity[]
    ) => void;
    availableActivities: Activity[];
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
    onSelectTheme,
    availableActivities,
}) => {
    return (
        <div className="theme-selector">
            <h3>Quick Start with Themes</h3>
            <p>Get inspired with pre-made weekend themes</p>

            <div className="themes-grid">
                {Object.entries(WEEKEND_THEMES).map(([key, theme]) => (
                    <button
                        key={key}
                        className="theme-card"
                        onClick={() =>
                            onSelectTheme(
                                theme.suggestedActivities,
                                availableActivities
                            )
                        }
                    >
                        <div className="theme-icon">{theme.icon}</div>
                        <div className="theme-info">
                            <h4 className="theme-name">{theme.name}</h4>
                            <p className="theme-description">
                                {theme.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ThemeSelector;
