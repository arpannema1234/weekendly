import ThemeSelector from "../layout/ThemeSelector";
import type { Activity } from "../../types";

interface ThemesTabProps {
    availableActivities: Activity[];
    onSelectTheme: (
        themeActivities: string[],
        availableActivities: Activity[]
    ) => void;
}

const ThemesTab: React.FC<ThemesTabProps> = ({
    availableActivities,
    onSelectTheme,
}) => {
    return (
        <ThemeSelector
            onSelectTheme={onSelectTheme}
            availableActivities={availableActivities}
        />
    );
};

export default ThemesTab;
