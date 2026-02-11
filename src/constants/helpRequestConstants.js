// Help Request Categories (13 community infrastructure types)
export const HELP_CATEGORIES = {
    WATER_SUPPLY: {
        value: "WATER_SUPPLY",
        label: "Water Supply",
        icon: "💧",
        description: "Community water supply issues - No water, contaminated water, pipeline leaks affecting area",
        priority: "HIGH"
    },
    DRAINAGE_SANITATION: {
        value: "DRAINAGE_SANITATION",
        label: "Drainage & Sanitation",
        icon: "🚰",
        description: "Drainage overflow, sewage issues, public toilet problems",
        priority: "HIGH"
    },
    ELECTRICITY: {
        value: "ELECTRICITY",
        label: "Electricity",
        icon: "⚡",
        description: "Power cuts, transformer issues affecting the area",
        priority: "MEDIUM"
    },
    STREET_LIGHTS: {
        value: "STREET_LIGHTS",
        label: "Street Lights",
        icon: "💡",
        description: "Street lighting issues making areas unsafe",
        priority: "MEDIUM"
    },
    HEALTHCARE: {
        value: "HEALTHCARE",
        label: "Healthcare",
        icon: "🏥",
        description: "Issues with PHC, medical facilities, ambulance",
        priority: "CRITICAL"
    },
    EDUCATION: {
        value: "EDUCATION",
        label: "Education & Schools",
        icon: "📚",
        description: "School infrastructure, teacher shortage",
        priority: "MEDIUM"
    },
    PUBLIC_INFRASTRUCTURE: {
        value: "PUBLIC_INFRASTRUCTURE",
        label: "Public Infrastructure",
        icon: "🏛️",
        description: "Community halls, bus stops, markets",
        priority: "LOW"
    },
    AGRICULTURE: {
        value: "AGRICULTURE",
        label: "Agriculture Support",
        icon: "🌾",
        description: "Irrigation, crop protection, fertilizers",
        priority: "MEDIUM"
    },
    LAW_ORDER_SAFETY: {
        value: "LAW_ORDER_SAFETY",
        label: "Law & Order / Safety",
        icon: "🛡️",
        description: "Security issues affecting community",
        priority: "HIGH"
    },
    WASTE_MANAGEMENT: {
        value: "WASTE_MANAGEMENT",
        label: "Waste Management",
        icon: "🚮",
        description: "Garbage collection, cleanliness",
        priority: "MEDIUM"
    },
    TRANSPORTATION: {
        value: "TRANSPORTATION",
        label: "Transportation",
        icon: "🚌",
        description: "Bus services, connectivity",
        priority: "MEDIUM"
    },
    DIGITAL_CONNECTIVITY: {
        value: "DIGITAL_CONNECTIVITY",
        label: "Digital Connectivity",
        icon: "📡",
        description: "Internet/mobile network issues",
        priority: "LOW"
    },
    OTHER_COMMUNITY: {
        value: "OTHER_COMMUNITY",
        label: "Other Community Issue",
        icon: "⚠️",
        description: "Other legitimate community issues",
        priority: "LOW"
    }
};

// Convert to array for easier mapping
export const HELP_CATEGORIES_ARRAY = Object.values(HELP_CATEGORIES);

// Validation Rules
export const VALIDATION_RULES = {
    MIN_AFFECTED_POPULATION: 10,
    MIN_COMMUNITY_IMPACT_LENGTH: 20,

    GUIDELINES: [
        "✅ Report issues affecting your colony, village, or mandal",
        "✅ Issues must affect multiple families (minimum 10+ people)",
        "✅ Focus on public infrastructure and services",
        "❌ Do NOT report personal or family-specific problems",
        "❌ Do NOT request jobs, loans, or personal favors",
        "❌ Do NOT report neighbor disputes or personal conflicts"
    ]
};

// Priority colors for UI
export const PRIORITY_COLORS = {
    CRITICAL: "bg-red-500 text-white",
    HIGH: "bg-orange-500 text-white",
    MEDIUM: "bg-yellow-500 text-white",
    LOW: "bg-blue-500 text-white"
};

// Status colors for UI
export const STATUS_COLORS = {
    PENDING: "bg-gray-500 text-white",
    ACKNOWLEDGED: "bg-blue-500 text-white",
    IN_PROGRESS: "bg-yellow-500 text-white",
    RESOLVED: "bg-green-500 text-white",
    REJECTED: "bg-red-500 text-white"
};
