export const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

export const addHours = (time: string, hours: number): string => {
    const [h, m] = time.split(":").map(Number);
    const totalMinutes = h * 60 + m + hours * 60;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, "0")}:${newMinutes
        .toString()
        .padStart(2, "0")}`;
};

export const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getTimeSlots = (
    start: string = "06:00",
    end: string = "23:00"
): string[] => {
    const slots: string[] = [];
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    let currentH = startH;
    let currentM = startM;

    while (currentH < endH || (currentH === endH && currentM <= endM)) {
        slots.push(
            `${currentH.toString().padStart(2, "0")}:${currentM
                .toString()
                .padStart(2, "0")}`
        );
        currentM += 30;
        if (currentM >= 60) {
            currentM = 0;
            currentH++;
        }
    }

    return slots;
};
