/**
 * Department Constants for Officials Assignment System
 * These map help request categories to government departments
 */

export const DEPARTMENTS = {
    WATER_SUPPLY: {
        value: "WATER_SUPPLY",
        label: "Water Supply Department",
        icon: "💧",
        color: "blue",
        description: "Handles water supply, pipelines, and water quality issues"
    },
    DRAINAGE_SANITATION: {
        value: "DRAINAGE_SANITATION",
        label: "Drainage & Sanitation",
        icon: "🚰",
        color: "teal",
        description: "Manages drainage, sewage, and sanitation systems"
    },
    ELECTRICITY: {
        value: "ELECTRICITY",
        label: "Electricity Department",
        icon: "⚡",
        color: "yellow",
        description: "Power supply, transformers, and electrical infrastructure"
    },
    STREET_LIGHTS: {
        value: "STREET_LIGHTS",
        label: "Street Lighting",
        icon: "💡",
        color: "amber",
        description: "Street lights installation and maintenance"
    },
    HEALTHCARE: {
        value: "HEALTHCARE",
        label: "Health Department",
        icon: "🏥",
        color: "red",
        description: "Hospitals, clinics, and healthcare facilities"
    },
    EDUCATION: {
        value: "EDUCATION",
        label: "Education Department",
        icon: "🎓",
        color: "indigo",
        description: "Schools, colleges, and educational infrastructure"
    },
    PUBLIC_INFRASTRUCTURE: {
        value: "PUBLIC_INFRASTRUCTURE",
        label: "Public Works (PWD)",
        icon: "🏗️",
        color: "gray",
        description: "Buildings, roads, markets, and public facilities"
    },
    AGRICULTURE: {
        value: "AGRICULTURE",
        label: "Agriculture Department",
        icon: "🌾",
        color: "green",
        description: "Irrigation, farming support, and agricultural issues"
    },
    LAW_ORDER_SAFETY: {
        value: "LAW_ORDER_SAFETY",
        label: "Police & Revenue",
        icon: "👮",
        color: "slate",
        description: "Security, law and order, and safety concerns"
    },
    WASTE_MANAGEMENT: {
        value: "WASTE_MANAGEMENT",
        label: "Waste Management",
        icon: "♻️",
        color: "emerald",
        description: "Garbage collection and waste disposal"
    },
    TRANSPORTATION: {
        value: "TRANSPORTATION",
        label: "Transport Department",
        icon: "🚌",
        color: "purple",
        description: "Public transport and bus services"
    },
    DIGITAL_CONNECTIVITY: {
        value: "DIGITAL_CONNECTIVITY",
        label: "IT & Telecom",
        icon: "📡",
        color: "cyan",
        description: "Internet, network, and digital infrastructure"
    },
    OTHER_COMMUNITY: {
        value: "OTHER_COMMUNITY",
        label: "General Administration",
        icon: "🏛️",
        color: "zinc",
        description: "Miscellaneous community issues"
    }
};

// Array format for dropdowns
export const DEPARTMENTS_ARRAY = Object.values(DEPARTMENTS);

// Map help request category to department
export const CATEGORY_TO_DEPARTMENT = {
    WATER_SUPPLY: "WATER_SUPPLY",
    DRAINAGE_SANITATION: "DRAINAGE_SANITATION",
    ELECTRICITY: "ELECTRICITY",
    STREET_LIGHTS: "STREET_LIGHTS",
    HEALTHCARE: "HEALTHCARE",
    EDUCATION: "EDUCATION",
    PUBLIC_INFRASTRUCTURE: "PUBLIC_INFRASTRUCTURE",
    AGRICULTURE: "AGRICULTURE",
    LAW_ORDER_SAFETY: "LAW_ORDER_SAFETY",
    WASTE_MANAGEMENT: "WASTE_MANAGEMENT",
    TRANSPORTATION: "TRANSPORTATION",
    DIGITAL_CONNECTIVITY: "DIGITAL_CONNECTIVITY",
    OTHER_COMMUNITY: "OTHER_COMMUNITY"
};

// Get department by category
export const getDepartmentByCategory = (category) => {
    const deptValue = CATEGORY_TO_DEPARTMENT[category];
    return DEPARTMENTS[deptValue] || DEPARTMENTS.OTHER_COMMUNITY;
};

// Assignment status options
export const ASSIGNMENT_STATUS = {
    ASSIGNED: {
        value: "ASSIGNED",
        label: "Assigned",
        color: "blue",
        icon: "📋",
        description: "Newly assigned to official"
    },
    IN_PROGRESS: {
        value: "IN_PROGRESS",
        label: "In Progress",
        color: "orange",
        icon: "⚙️",
        description: "Official is currently working on it"
    },
    COMPLETED: {
        value: "COMPLETED",
        label: "Completed",
        color: "green",
        icon: "✅",
        description: "Work has been successfully completed"
    },
    REJECTED: {
        value: "REJECTED",
        label: "Rejected",
        color: "red",
        icon: "❌",
        description: "Cannot be completed"
    }
};

export const ASSIGNMENT_STATUS_ARRAY = Object.values(ASSIGNMENT_STATUS);

// Official status options
export const OFFICIAL_STATUS = {
    ACTIVE: {
        value: "ACTIVE",
        label: "Active",
        color: "green",
        description: "Currently working"
    },
    INACTIVE: {
        value: "INACTIVE",
        label: "Inactive",
        color: "gray",
        description: "Temporarily not available"
    },
    SUSPENDED: {
        value: "SUSPENDED",
        label: "Suspended",
        color: "red",
        description: "Suspended from duty"
    }
};

export const OFFICIAL_STATUS_ARRAY = Object.values(OFFICIAL_STATUS);

// Color classes for Tailwind CSS
export const DEPARTMENT_COLORS = {
    blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-700",
        badge: "bg-blue-100 text-blue-800"
    },
    teal: {
        bg: "bg-teal-50",
        border: "border-teal-200",
        text: "text-teal-700",
        badge: "bg-teal-100 text-teal-800"
    },
    yellow: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-700",
        badge: "bg-yellow-100 text-yellow-800"
    },
    amber: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        badge: "bg-amber-100 text-amber-800"
    },
    red: {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        badge: "bg-red-100 text-red-800"
    },
    indigo: {
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        text: "text-indigo-700",
        badge: "bg-indigo-100 text-indigo-800"
    },
    gray: {
        bg: "bg-gray-50",
        border: "border-gray-200",
        text: "text-gray-700",
        badge: "bg-gray-100 text-gray-800"
    },
    green: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        badge: "bg-green-100 text-green-800"
    },
    slate: {
        bg: "bg-slate-50",
        border: "border-slate-200",
        text: "text-slate-700",
        badge: "bg-slate-100 text-slate-800"
    },
    emerald: {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-700",
        badge: "bg-emerald-100 text-emerald-800"
    },
    purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-700",
        badge: "bg-purple-100 text-purple-800"
    },
    cyan: {
        bg: "bg-cyan-50",
        border: "border-cyan-200",
        text: "text-cyan-700",
        badge: "bg-cyan-100 text-cyan-800"
    },
    zinc: {
        bg: "bg-zinc-50",
        border: "border-zinc-200",
        text: "text-zinc-700",
        badge: "bg-zinc-100 text-zinc-800"
    }
};
