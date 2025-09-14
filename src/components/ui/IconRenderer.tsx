import React from "react";
import { activityIcons } from "../../utils/iconMapping";
import { Target } from "lucide-react";

interface IconRendererProps {
    iconKey: string;
    size?: number;
    className?: string;
}

const IconRenderer: React.FC<IconRendererProps> = ({
    iconKey,
    size = 16,
    className = "",
}) => {
    // Get the icon component from the mapping
    const IconComponent =
        activityIcons[iconKey as keyof typeof activityIcons] || Target;

    return <IconComponent size={size} className={className} />;
};

export default IconRenderer;
