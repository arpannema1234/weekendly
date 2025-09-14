import {
    Target,
    Users,
    Music,
    Book,
    ChefHat,
    Palette,
    Heart,
    Gamepad2,
    Trees,
    Coffee,
    Theater,
    Camera,
    Waves,
    Bike,
    Puzzle,
    Tent,
    Sunrise,
    Pizza,
    Film,
    Palmtree,
    Dumbbell,
    Sparkles,
    Home,
    Car,
    Plane,
    ShoppingCart,
    Smartphone,
    Laptop,
    Utensils,
    Salad,
    Cake,
    Bed,
    Brush,
} from "lucide-react";

// Icon mapping for activities
export const activityIcons = {
    target: Target,
    users: Users,
    music: Music,
    book: Book,
    chefHat: ChefHat,
    palette: Palette,
    heart: Heart,
    gamepad: Gamepad2,
    trees: Trees,
    coffee: Coffee,
    theater: Theater,
    camera: Camera,
    waves: Waves,
    bike: Bike,
    puzzle: Puzzle,
    tent: Tent,
    sunrise: Sunrise,
    pizza: Pizza,
    film: Film,
    palmtree: Palmtree,
    dumbbell: Dumbbell,
    sparkles: Sparkles,
    home: Home,
    car: Car,
    plane: Plane,
    shoppingCart: ShoppingCart,
    smartphone: Smartphone,
    laptop: Laptop,
    utensils: Utensils,
    salad: Salad,
    cake: Cake,
    bed: Bed,
    cleaning: Brush,
};

// Activity icon options for selection
export const activityIconOptions = [
    { key: "target", name: "Target", component: Target },
    { key: "users", name: "Social", component: Users },
    { key: "music", name: "Music", component: Music },
    { key: "book", name: "Reading", component: Book },
    { key: "chefHat", name: "Cooking", component: ChefHat },
    { key: "palette", name: "Art", component: Palette },
    { key: "heart", name: "Wellness", component: Heart },
    { key: "gamepad", name: "Gaming", component: Gamepad2 },
    { key: "trees", name: "Nature", component: Trees },
    { key: "coffee", name: "Coffee", component: Coffee },
    { key: "theater", name: "Theater", component: Theater },
    { key: "camera", name: "Photography", component: Camera },
    { key: "waves", name: "Swimming", component: Waves },
    { key: "bike", name: "Cycling", component: Bike },
    { key: "puzzle", name: "Puzzles", component: Puzzle },
    { key: "tent", name: "Camping", component: Tent },
    { key: "sunrise", name: "Morning", component: Sunrise },
    { key: "pizza", name: "Pizza", component: Pizza },
    { key: "film", name: "Movies", component: Film },
    { key: "palmtree", name: "Beach", component: Palmtree },
    { key: "dumbbell", name: "Exercise", component: Dumbbell },
    { key: "sparkles", name: "Fun", component: Sparkles },
    { key: "home", name: "Home", component: Home },
    { key: "car", name: "Driving", component: Car },
    { key: "plane", name: "Travel", component: Plane },
    { key: "shoppingCart", name: "Shopping", component: ShoppingCart },
    { key: "smartphone", name: "Phone", component: Smartphone },
    { key: "laptop", name: "Work", component: Laptop },
    { key: "utensils", name: "Dining", component: Utensils },
    { key: "salad", name: "Healthy Food", component: Salad },
    { key: "cake", name: "Dessert", component: Cake },
    { key: "bed", name: "Rest", component: Bed },
    { key: "cleaning", name: "Cleaning", component: Brush },
];

// Default icon mapping for common activities
export const getDefaultIcon = (activityName: string): string => {
    const name = activityName.toLowerCase();

    if (name.includes("cook") || name.includes("kitchen")) return "chefHat";
    if (name.includes("read") || name.includes("book")) return "book";
    if (name.includes("music") || name.includes("song")) return "music";
    if (name.includes("art") || name.includes("paint") || name.includes("draw"))
        return "palette";
    if (
        name.includes("exercise") ||
        name.includes("gym") ||
        name.includes("workout")
    )
        return "dumbbell";
    if (name.includes("game") || name.includes("play")) return "gamepad";
    if (name.includes("photo") || name.includes("picture")) return "camera";
    if (name.includes("swim") || name.includes("pool")) return "waves";
    if (name.includes("bike") || name.includes("cycle")) return "bike";
    if (name.includes("coffee") || name.includes("cafe")) return "coffee";
    if (
        name.includes("movie") ||
        name.includes("film") ||
        name.includes("cinema")
    )
        return "film";
    if (
        name.includes("social") ||
        name.includes("friend") ||
        name.includes("people")
    )
        return "users";
    if (
        name.includes("nature") ||
        name.includes("park") ||
        name.includes("outdoor")
    )
        return "trees";
    if (name.includes("shop") || name.includes("mall") || name.includes("buy"))
        return "shoppingCart";
    if (
        name.includes("travel") ||
        name.includes("trip") ||
        name.includes("vacation")
    )
        return "plane";
    if (
        name.includes("work") ||
        name.includes("office") ||
        name.includes("computer")
    )
        return "laptop";
    if (name.includes("sleep") || name.includes("nap") || name.includes("rest"))
        return "bed";
    if (
        name.includes("clean") ||
        name.includes("tidy") ||
        name.includes("organize")
    )
        return "cleaning";
    if (name.includes("food") || name.includes("eat") || name.includes("meal"))
        return "utensils";

    return "target"; // Default fallback
};
