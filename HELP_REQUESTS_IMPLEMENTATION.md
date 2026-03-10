# ✅ Implementation Checklist - Help Requests (Community-Focused)

## Quick Start Guide

---

## Phase 1: Database Setup (Day 1-2)

### Step 1.1: Create `help_requests` Collection in Appwrite

**Attributes to create:**

| Attribute Name | Type | Size | Required | Array | Default |
|---------------|------|------|----------|-------|---------|
| state | String | 100 | ✓ | ❌ | - |
| district | String | 100 | ✓ | ❌ | - |
| mandal | String | 100 | ✓ | ❌ | - |
| village | String | 100 | ✓ | ❌ | - |
| category | String (enum) | 50 | ✓ | ❌ | - |
| title | String | 200 | ✓ | ❌ | - |
| description | String | 2000 | ✓ | ❌ | - |
| **affectedPopulation** | Integer | - | ✓ | ❌ | 0 |
| **communityImpact** | String | 1000 | ✓ | ❌ | - |
| priority | String (enum) | 50 | ✓ | ❌ | MEDIUM |
| lat | Float | - | ✓ | ❌ | - |
| lng | Float | - | ✓ | ❌ | - |
| landmark | String | 200 | ❌ | ❌ | - |
| mediaURL | String | 500 | ❌ | ❌ | - |
| mediaType | String | 20 | ❌ | ❌ | - |
| mediaId | String | 100 | ❌ | ❌ | - |
| status | String (enum) | 50 | ✓ | ❌ | PENDING |
| userId | String | 100 | ✓ | ❌ | - |
| reporterName | String | 100 | ✓ | ❌ | - |
| reporterPhone | String | 20 | ❌ | ❌ | - |
| reporterEmail | String | 100 | ❌ | ❌ | - |
| likes | Integer | - | ✓ | ❌ | 0 |
| likedBy | String | 50 | ❌ | ✓ | - |

**Enums to configure:**

```javascript
// category enum values:
WATER_SUPPLY
DRAINAGE_SANITATION
ELECTRICITY
STREET_LIGHTS
HEALTHCARE
EDUCATION
PUBLIC_INFRASTRUCTURE
AGRICULTURE
LAW_ORDER_SAFETY
WASTE_MANAGEMENT
TRANSPORTATION
DIGITAL_CONNECTIVITY
OTHER_COMMUNITY

// priority enum values:
CRITICAL
HIGH
MEDIUM
LOW

// status enum values:
PENDING
ACKNOWLEDGED
IN_PROGRESS
RESOLVED
REJECTED
```

**Indexes to create:**
- userId (ASC)
- district (ASC)  
- status (ASC)
- category (ASC)
- $createdAt (DESC)

---

### Step 1.2: Create `mla_help_responses` Collection

**Attributes:**

| Attribute Name | Type | Size | Required |
|---------------|------|------|----------|
| helpRequestId | String | 100 | ✓ |
| mlaId | String | 100 | ✓ |
| mlaName | String | 100 | ✓ |
| responseType | String (enum) | 50 | ✓ |
| message | String | 2000 | ✓ |
| actionTaken | String | 1000 | ❌ |
| estimatedDays | Integer | - | ❌ |
| followUpRequired | Boolean | - | ✓ |
| followUpNotes | String | 500 | ❌ |

**Enum for responseType:**
```
ACKNOWLEDGED
IN_PROGRESS
RESOLVED
REJECTED
```

---

### Step 1.3: Update `.env` File

Add these collection IDs:
```env
VITE_HELP_REQUESTS_COLLECTION_ID=your_help_requests_collection_id
VITE_MLA_HELP_RESPONSES_COLLECTION_ID=your_mla_responses_collection_id
```

---

## Phase 2: Service Files (Day 3)

### Step 2.1: Create `helpRequestService.js`

```javascript
// src/services/helpRequestService.js

import { databases, storage, ID, Query } from "./appwriteConfig";

const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
const HELP_COLLECTION_ID = import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

// ⚠️ VALIDATION: Check if request is valid community issue
export const validateCommunityImpact = (data) => {
  const errors = [];
  
  // Check affected population
  if (!data.affectedPopulation || data.affectedPopulation < 10) {
    errors.push("Issue must affect at least 10 people/families to qualify as community issue");
  }
  
  // Check community impact description
  if (!data.communityImpact || data.communityImpact.trim().length < 20) {
    errors.push("Please describe how this issue affects the community (minimum 20 characters)");
  }
  
  // Check if category is valid (not personal)
  const validCategories = [
    "WATER_SUPPLY", "DRAINAGE_SANITATION", "ELECTRICITY", 
    "STREET_LIGHTS", "HEALTHCARE", "EDUCATION",
    "PUBLIC_INFRASTRUCTURE", "AGRICULTURE", "LAW_ORDER_SAFETY",
    "WASTE_MANAGEMENT", "TRANSPORTATION", "DIGITAL_CONNECTIVITY",
    "OTHER_COMMUNITY"
  ];
  
  if (!validCategories.includes(data.category)) {
    errors.push("Invalid category selected");
  }
  
  return errors;
};

// Create Help Request (with validation)
export const createHelpRequest = async (data) => {
  // Validate first
  const errors = validateCommunityImpact(data);
  if (errors.length > 0) {
    throw new Error(errors.join(". "));
  }
  
  return databases.createDocument(
    DATABASE_ID,
    HELP_COLLECTION_ID,
    ID.unique(),
    data
  );
};

// Get requests by district
export const getHelpRequestsByDistrict = (district) => {
  return databases.listDocuments(
    DATABASE_ID,
    HELP_COLLECTION_ID,
    [
      Query.equal("district", district),
      Query.orderDesc("$createdAt"),
    ]
  );
};

// Get requests by user
export const getMyHelpRequests = (userId) => {
  return databases.listDocuments(
    DATABASE_ID,
    HELP_COLLECTION_ID,
    [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"),
    ]
  );
};

// Update request status
export const updateHelpRequestStatus = (id, status) => {
  return databases.updateDocument(
    DATABASE_ID,
    HELP_COLLECTION_ID,
    id,
    { status }
  );
};

// Like request
export const likeHelpRequest = (id, likedBy) => {
  return databases.updateDocument(
    DATABASE_ID,
    HELP_COLLECTION_ID,
    id,
    {
      likedBy,
      likes: likedBy.length,
    }
  );
};

// Upload media
export const uploadHelpMedia = async (file) => {
  const uploaded = await storage.createFile(
    BUCKET_ID,
    ID.unique(),
    file
  );

  const fileUrl = storage.getFileView(BUCKET_ID, uploaded.$id);

  return {
    mediaId: uploaded.$id,
    mediaURL: fileUrl.href,
    mediaType: file.type.startsWith("video") ? "VIDEO" : "IMAGE",
  };
};
```

---

### Step 2.2: Create `mlaHelpResponseService.js`

```javascript
// src/services/mlaHelpResponseService.js

import { databases, ID, Query } from "./appwriteConfig";

const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
const RESPONSES_COLLECTION_ID = import.meta.env.VITE_MLA_HELP_RESPONSES_COLLECTION_ID;
const HELP_COLLECTION_ID = import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID;

// Create MLA response
export const createMLAResponse = async (data) => {
  // Create response document
  const response = await databases.createDocument(
    DATABASE_ID,
    RESPONSES_COLLECTION_ID,
    ID.unique(),
    data
  );
  
  // Update help request status
  await databases.updateDocument(
    DATABASE_ID,
    HELP_COLLECTION_ID,
    data.helpRequestId,
    { status: data.responseType }
  );
  
  return response;
};

// Get responses for a help request
export const getResponsesByRequestId = (helpRequestId) => {
  return databases.listDocuments(
    DATABASE_ID,
    RESPONSES_COLLECTION_ID,
    [
      Query.equal("helpRequestId", helpRequestId),
      Query.orderDesc("$createdAt"),
    ]
  );
};
```

---

## Phase 3: Category Constants (Day 3)

### Step 3.1: Create `helpRequestConstants.js`

```javascript
// src/constants/helpRequestConstants.js

export const HELP_CATEGORIES = {
  WATER_SUPPLY: {
    value: "WATER_SUPPLY",
    label: "Water Supply",
    icon: "💧",
    description: "Community water supply issues - No water, contaminated water, pipeline leaks affecting area",
    examples: ["Colony without water for 3 days", "Water pipeline burst in main road"],
    priority: "HIGH" // Default priority
  },
  DRAINAGE_SANITATION: {
    value: "DRAINAGE_SANITATION",
    label: "Drainage & Sanitation",
    icon: "🚰",
    description: "Drainage overflow, sewage issues, public toilet problems",
    examples: ["Drainage overflow in colony", "Blocked sewage lines"],
    priority: "HIGH"
  },
  ELECTRICITY: {
    value: "ELECTRICITY",
    label: "Electricity",
    icon: "⚡",
    description: "Power cuts, transformer issues affecting the area",
    examples: ["Frequent power cuts", "Transformer not working"],
    priority: "MEDIUM"
  },
  STREET_LIGHTS: {
    value: "STREET_LIGHTS",
    label: "Street Lights",
    icon: "💡",
    description: "Street lighting issues making areas unsafe",
    examples: ["Street lights not working", "Dark roads"],
    priority: "MEDIUM"
  },
  HEALTHCARE: {
    value: "HEALTHCARE",
    label: "Healthcare",
    icon: "🏥",
    description: "Issues with PHC, medical facilities, ambulance",
    examples: ["No doctor at PHC", "Medicines not available"],
    priority: "CRITICAL"
  },
  EDUCATION: {
    value: "EDUCATION",
    label: "Education & Schools",
    icon: "📚",
    description: "School infrastructure, teacher shortage",
    examples: ["School building damaged", "No teachers"],
    priority: "MEDIUM"
  },
  PUBLIC_INFRASTRUCTURE: {
    value: "PUBLIC_INFRASTRUCTURE",
    label: "Public Infrastructure",
    icon: "🏛️",
    description: "Community halls, bus stops, markets",
    examples: ["Community hall roof leaking", "Bus stop broken"],
    priority: "LOW"
  },
  AGRICULTURE: {
    value: "AGRICULTURE",
    label: "Agriculture Support",
    icon: "🌾",
    description: "Irrigation, crop protection, fertilizers",
    examples: ["Canal not getting water", "Pest attack"],
    priority: "MEDIUM"
  },
  LAW_ORDER_SAFETY: {
    value: "LAW_ORDER_SAFETY",
    label: "Law & Order / Safety",
    icon: "🛡️",
    description: "Security issues affecting community",
    examples: ["Theft incidents", "Need police patrolling"],
    priority: "HIGH"
  },
  WASTE_MANAGEMENT: {
    value: "WASTE_MANAGEMENT",
    label: "Waste Management",
    icon: "🚮",
    description: "Garbage collection, cleanliness",
    examples: ["Garbage not collected", "Illegal dumping"],
    priority: "MEDIUM"
  },
  TRANSPORTATION: {
    value: "TRANSPORTATION",
    label: "Transportation",
    icon: "🚌",
    description: "Bus services, connectivity",
    examples: ["No bus service", "Poor connectivity"],
    priority: "MEDIUM"
  },
  DIGITAL_CONNECTIVITY: {
    value: "DIGITAL_CONNECTIVITY",
    label: "Digital Connectivity",
    icon: "📡",
    description: "Internet/mobile network issues",
    examples: ["No network coverage", "Poor internet"],
    priority: "LOW"
  },
  OTHER_COMMUNITY: {
    value: "OTHER_COMMUNITY",
    label: "Other Community Issue",
    icon: "⚠️",
    description: "Other legitimate community issues",
    examples: ["Park maintenance", "Cemetery wall collapsed"],
    priority: "LOW"
  }
};

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

export const PRIORITY_COLORS = {
  CRITICAL: "bg-red-500",
  HIGH: "bg-orange-500",
  MEDIUM: "bg-yellow-500",
  LOW: "bg-blue-500"
};

export const STATUS_COLORS = {
  PENDING: "bg-gray-500",
  ACKNOWLEDGED: "bg-blue-500",
  IN_PROGRESS: "bg-yellow-500",
  RESOLVED: "bg-green-500",
  REJECTED: "bg-red-500"
};
```

---

## Phase 4: UI Components (Day 4-7)

### Files to Create:

1. **`GuidelinesPopup.jsx`** - Shows guidelines before creating request
2. **`CreateHelpRequest.jsx`** - Form with validation
3. **`HelpRequestList.jsx`** - Display requests
4. **`HelpRequestCard.jsx`** - Single request preview
5. **`HelpRequestDetail.jsx`** - Full request view
6. **`MLAHelpRequests.jsx`** - MLA dashboard
7. **`MLAResponseModal.jsx`** - MLA response form

---

## 🎯 Key Implementation Points

### ⚠️ CRITICAL: Validation Must Be Strong

```javascript
// In CreateHelpRequest.jsx - before submit:

const validateForm = () => {
  // Check affected population
  if (affectedPopulation < 10) {
    alert("⚠️ This appears to be a personal issue.\n\n" +
          "Help Requests are for COMMUNITY problems affecting " +
          "minimum 10 families.\n\n" +
          "Personal issues should be handled at local offices.");
    return false;
  }
  
  // Check community impact
  if (!communityImpact || communityImpact.length < 20) {
    alert("Please describe how this issue affects the COMMUNITY " +
          "(not just you personally)");
    return false;
  }
  
  return true;
};
```

---

### 📋 Guidelines Popup (Must Show First!)

```jsx
// GuidelinesPopup.jsx

const GuidelinesPopup = ({ onAccept, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md">
        <h2 className="text-xl font-bold mb-4">⚠️ IMPORTANT GUIDELINES</h2>
        
        <div className="space-y-4">
          <div className="bg-green-50 p-3 rounded">
            <p className="font-semibold text-green-800">✅ DO Report:</p>
            <ul className="text-sm text-green-700 ml-4 mt-1">
              <li>• Community infrastructure issues</li>
              <li>• Problems affecting 10+ families</li>
              <li>• Public services (water, electricity, etc.)</li>
            </ul>
          </div>
          
          <div className="bg-red-50 p-3 rounded">
            <p className="font-semibold text-red-800">❌ Do NOT Report:</p>
            <ul className="text-sm text-red-700 ml-4 mt-1">
              <li>• Personal problems (jobs, loans, documents)</li>
              <li>• Individual family issues</li>
              <li>• Neighbor disputes</li>
            </ul>
          </div>
        </div>
        
        <div className="flex gap-2 mt-6">
          <button 
            onClick={onAccept}
            className="flex-1 bg-indigo-600 text-white py-2 rounded"
          >
            I Understand
          </button>
          <button 
            onClick={onCancel}
            className="px-4 bg-gray-200 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## ✅ Testing Checklist

### Test Valid Requests:
- [ ] Water shortage affecting 50 families
- [ ] Street lights not working in colony
- [ ] PHC without doctor
- [ ] Garbage not collected for weeks

### Test Invalid Requests (Should Fail):
- [ ] affectedPopulation = 5 (less than 10)
- [ ] communityImpact = "I need water" (too short)
- [ ] Category = personal issue

### Test MLA Response:
- [ ] MLA can view all requests in constituency
- [ ] MLA can respond and update status
- [ ] Citizen receives update notification

---

## 🎉 Success Criteria

Your Help Requests feature is successful when:

✅ Only community issues are submitted (no spam)
✅ All requests affect 10+ people
✅ MLAs can easily filter and prioritize
✅ Citizens know what to report and what not to
✅ System stays focused and actionable

---

## 📞 Need Help?

Refer to these documents:
- `HELP_REQUESTS_FLOW.md` - Complete detailed flow
- `HELP_REQUESTS_QUICK_SUMMARY.md` - Quick reference
- `ROAD_REPORTS_VS_HELP_REQUESTS.md` - Comparison guide

**Good luck with implementation! 🚀**
