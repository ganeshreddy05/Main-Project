# 🏛️ Department Officials Assignment System - Design Document

## 📋 Overview

This system allows MLAs to assign help requests to department officials (Electricity, Water, Education, etc.) who can then work on resolving the issues and update the status.

---

## 🎯 Complete Workflow

```
1. CITIZEN reports a help request (e.g., "No water supply in colony")
   ↓
2. MLA sees request in dashboard
   ↓
3. MLA responds AND assigns to a department official
   ↓
4. OFFICIAL logs in and sees assigned requests
   ↓
5. OFFICIAL updates status (In Progress → Completed)
   ↓
6. MLA sees completion status in dashboard
   ↓
7. CITIZEN sees updates in their help request details
```

---

## 👥 User Roles

### 1. Citizen (Already Exists)
- Reports help requests
- Views MLA responses
- Views official updates

### 2. MLA (Already Exists + Enhanced)
- Views help requests
- Responds to requests
- **NEW**: Assigns requests to officials
- **NEW**: Tracks assignment status

### 3. Official (NEW Role)
- **Department-based**: Electricity, Water, Education, Healthcare, etc.
- Receives assignments from MLA
- Updates progress on assigned requests
- Marks requests as completed with proof

---

## 🗄️ Database Schema

### New Collection 1: `officials`

Stores department official profiles.

| Attribute | Type | Size | Required | Description |
|-----------|------|------|----------|-------------|
| `userId` | String | 255 | Yes | Reference to users collection |
| `name` | String | 255 | Yes | Official's full name |
| `email` | String | 255 | Yes | Official's email |
| `phone` | String | 20 | No | Contact number |
| `department` | String | 100 | Yes | ELECTRICITY, WATER, EDUCATION, etc. |
| `designation` | String | 255 | No | Job title (e.g., "Assistant Engineer") |
| `district` | String | 255 | Yes | District they serve |
| `state` | String | 255 | Yes | State they serve |
| `status` | String | 50 | Yes | ACTIVE, INACTIVE, SUSPENDED |
| `approvedBy` | String | 255 | No | MLA/Admin who approved them |
| `approvedAt` | String | 255 | No | Approval timestamp |

**Permissions:**
- Read: Users with role "mla" or "official"
- Create: Admin only
- Update: Admin only
- Delete: Admin only

---

### New Collection 2: `request_assignments`

Tracks which official is assigned to which help request.

| Attribute | Type | Size | Required | Description |
|-----------|------|------|----------|-------------|
| `helpRequestId` | String | 255 | Yes | Reference to help_requests |
| `mlaId` | String | 255 | Yes | MLA who assigned it |
| `mlaName` | String | 255 | Yes | MLA's name |
| `officialId` | String | 255 | Yes | Official who received assignment |
| `officialName` | String | 255 | Yes | Official's name |
| `department` | String | 100 | Yes | Department category |
| `assignedAt` | String | 255 | Yes | When it was assigned |
| `assignmentNotes` | String | 2000 | No | MLA's instructions to official |
| `status` | String | 50 | Yes | ASSIGNED, IN_PROGRESS, COMPLETED, REJECTED |
| `officialNotes` | String | 2000 | No | Official's progress notes |
| `startedAt` | String | 255 | No | When official started work |
| `completedAt` | String | 255 | No | When work was completed |
| `completionProof` | String | 1000 | No | Photo/document URL |
| `completionProofType` | String | 50 | No | IMAGE or VIDEO |
| `completionProofId` | String | 255 | No | Appwrite file ID |

**Permissions:**
- Read: Any (Citizens can see who's working on their request)
- Create: Users with role "mla"
- Update: Users with role "official" or "mla"
- Delete: Admin only

---

### Modified Collection: `users`

Add new role option for officials:

| Field | Current Values | New Values |
|-------|----------------|------------|
| `role` | citizen, mla, admin | citizen, mla, admin, **official** |

---

### Modified Collection: `help_requests`

Add assignment tracking fields:

| New Attribute | Type | Description |
|---------------|------|-------------|
| `isAssigned` | Boolean | Whether assigned to an official |
| `assignedTo` | String | Official ID (if assigned) |
| `assignmentStatus` | String | ASSIGNED, IN_PROGRESS, COMPLETED |

---

## 🎨 UI Components

### 1. MLA Components

#### A. Enhanced Response Modal (`MLAAssignmentModal.jsx`)

Add assignment section to existing response modal:

```
┌────────────────────────────────────────────────┐
│ Respond & Assign to Official                  │
├────────────────────────────────────────────────┤
│                                                │
│ [Response form - already exists]               │
│                                                │
│ ┌─ Assign to Department Official ────────┐   │
│ │                                         │   │
│ │ Department: [Dropdown: Water ▼]        │   │
│ │                                         │   │
│ │ Select Official:                        │   │
│ │ ○ Ravi Kumar - Water Dept, Hyderabad   │   │
│ │ ○ Sita Devi - Water Dept, Hyderabad    │   │
│ │                                         │   │
│ │ Assignment Instructions:                │   │
│ │ [Textarea: Please inspect the area...] │   │
│ │                                         │   │
│ │ ☑ Send notification to official        │   │
│ └─────────────────────────────────────────┘   │
│                                                │
│         [Cancel]  [Submit Response]            │
└────────────────────────────────────────────────┘
```

#### B. Assignment Status Tracker (`AssignmentStatusCard.jsx`)

Shows in help request details:

```
┌─ Assignment Status ──────────────────────────┐
│                                              │
│ 👤 Assigned to: Ravi Kumar                  │
│    Water Department, Hyderabad              │
│                                              │
│ 📅 Assigned on: Feb 11, 2026                │
│ 🏷️ Status: IN PROGRESS                      │
│                                              │
│ 📝 Official's Notes:                         │
│    "Team visited site. Pipeline repair       │
│     scheduled for tomorrow."                 │
│                                              │
│ ⏱️ Last updated: 2 hours ago                 │
└──────────────────────────────────────────────┘
```

---

### 2. Official Components

#### A. Official Login Page (`OfficialLogin.jsx`)

Similar to MLA login, for department officials.

```
┌────────────────────────────────────────────┐
│                                            │
│           🏛️ Official Portal               │
│      Department Officials Login            │
│                                            │
│  Email:    [___________________________]  │
│                                            │
│  Password: [___________________________]  │
│                                            │
│         [Login as Official]                │
│                                            │
│  Back to Main Portal                       │
└────────────────────────────────────────────┘
```

#### B. Official Dashboard (`OfficialDashboard.jsx`)

Main dashboard for officials:

```
┌────────────────────────────────────────────────────────────┐
│  Welcome, Ravi Kumar (Water Department)                   │
│  District: Hyderabad                                       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  📊 Stats                                                  │
│  ┌──────────┬──────────┬──────────┬──────────┐          │
│  │  Total   │  Pending │ In Prog  │ Complete │          │
│  │    25    │    8     │    12    │    5     │          │
│  └──────────┴──────────┴──────────┴──────────┘          │
│                                                            │
│  🎯 Assigned Requests                                     │
│                                                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 💧 No water supply - Kavadiguda Colony           │   │
│  │ Assigned by: MLA Ganesh Reddy                    │   │
│  │ Status: ASSIGNED                                 │   │
│  │ People affected: 200                             │   │
│  │ [View Details] [Update Status]                   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 💧 Pipeline leak on Main Road                    │   │
│  │ Assigned by: MLA Ganesh Reddy                    │   │
│  │ Status: IN_PROGRESS                              │   │
│  │ People affected: 50                              │   │
│  │ [View Details] [Update Status]                   │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

#### C. Official Update Modal (`OfficialUpdateModal.jsx`)

For updating assignment status:

```
┌────────────────────────────────────────────┐
│ Update Assignment Status                   │
├────────────────────────────────────────────┤
│                                            │
│ Request: No water supply in colony         │
│                                            │
│ Update Status:                             │
│ ⦿ In Progress                              │
│ ○ Completed                                │
│ ○ Rejected                                 │
│                                            │
│ Progress Notes:                            │
│ [Textarea:                                 │
│  Team visited the site. Found main         │
│  pipeline damaged. Repair work scheduled   │
│  for February 12, 2026.                    │
│ ]                                          │
│                                            │
│ [If Completed]:                            │
│ Upload Completion Proof:                   │
│ 📷 [Upload Photo/Video]                    │
│                                            │
│     [Cancel]  [Submit Update]              │
└────────────────────────────────────────────┘
```

---

## 🔄 Complete Data Flow

### Flow 1: Assignment Process

```
1. MLA Response Modal
   ├─ MLA fills response
   ├─ MLA selects department
   ├─ System fetches officials in that department
   ├─ MLA selects an official
   ├─ MLA adds assignment notes
   └─ Click "Submit Response"
        ↓
2. Backend Processing
   ├─ Create MLA response in mla_help_responses
   ├─ Create assignment in request_assignments
   ├─ Update help_requests: isAssigned = true
   └─ Send notification to official (optional)
        ↓
3. Official Dashboard
   └─ New assignment appears in official's dashboard
```

### Flow 2: Official Update Process

```
1. Official Dashboard
   ├─ Official sees assigned requests
   ├─ Clicks "Update Status"
   └─ Modal opens
        ↓
2. Official Update Modal
   ├─ Select status: In Progress / Completed
   ├─ Add notes about work done
   ├─ Upload proof (if completed)
   └─ Click "Submit Update"
        ↓
3. Backend Processing
   ├─ Update request_assignments record
   ├─ Update help_requests status if completed
   └─ Update timestamps
        ↓
4. MLA & Citizen Views
   ├─ MLA sees update in their dashboard
   └─ Citizen sees update in help request details
```

---

## 🎯 Department Categories

Map help request categories to departments:

| Help Request Category | Department | Officials Handle |
|----------------------|------------|------------------|
| WATER_SUPPLY | Water Department | Pipeline repairs, water supply |
| DRAINAGE_SANITATION | PWD / Sanitation | Drainage, sewage issues |
| ELECTRICITY | Electricity Department | Power cuts, transformers |
| STREET_LIGHTS | Electricity / Municipal | Street lighting |
| HEALTHCARE | Health Department | Hospital, clinic issues |
| EDUCATION | Education Department | School infrastructure |
| PUBLIC_INFRASTRUCTURE | PWD | Buildings, roads, markets |
| AGRICULTURE | Agriculture Department | Irrigation, farming support |
| LAW_ORDER_SAFETY | Police / Revenue | Security, law and order |
| WASTE_MANAGEMENT | Municipal / Sanitation | Garbage collection |
| TRANSPORTATION | Transport Department | Bus services |
| DIGITAL_CONNECTIVITY | IT / Telecom | Network issues |
| OTHER_COMMUNITY | General Administration | Misc issues |

---

## 📊 Status Flow

### Help Request Status:
```
PENDING → ACKNOWLEDGED → IN_PROGRESS → RESOLVED
                              ↓
                        (When assigned to official)
                              ↓
                    Assignment Created
```

### Assignment Status:
```
ASSIGNED → IN_PROGRESS → COMPLETED
                ↓
              REJECTED (if cannot be done)
```

---

## 🔐 Permissions & Access Control

### Who Can See What:

| User Type | Can View | Can Create | Can Update | Can Delete |
|-----------|----------|------------|------------|------------|
| **Citizen** | Their own help requests & responses | Help requests | Their own pending requests | Their own pending requests |
| **MLA** | All requests in constituency | Responses, Assignments | Requests, Responses | - |
| **Official** | Assigned requests only | Update notes | Assignment status | - |
| **Admin** | Everything | Officials, Users | Everything | Everything |

---

## 📱 Mobile Responsiveness

All components should be mobile-friendly:
- Official's app should work on phones (field work)
- Photo upload from mobile camera
- Real-time status updates
- Push notifications (optional)

---

## ⚡ Implementation Priority

### Phase 1 (Core Functionality):
1. ✅ Create `officials` collection in Appwrite
2. ✅ Create `request_assignments` collection
3. ✅ Add "official" role to users
4. ✅ Build Official Login page
5. ✅ Build Official Dashboard
6. ✅ Enhance MLA Response Modal with assignment
7. ✅ Build Official Update Modal

### Phase 2 (Enhanced Features):
8. ⏳ Assignment status tracking in MLA dashboard
9. ⏳ Completion proof upload & preview
10. ⏳ Assignment history timeline
11. ⏳ Performance metrics (avg completion time)
12. ⏳ Push notifications

### Phase 3 (Advanced):
13. ⏳ Bulk assignments
14. ⏳ Auto-suggest officials based on workload
15. ⏳ Official performance dashboard
16. ⏳ Mobile app for officials
17. ⏳ SMS notifications

---

## 🎉 Benefits

### For MLAs:
- ✅ Can delegate work to experts
- ✅ Track progress without micromanaging
- ✅ Know exactly who's working on what
- ✅ Hold officials accountable

### For Officials:
- ✅ Clear assignments from MLAs
- ✅ Organized work dashboard
- ✅ Easy status updates
- ✅ Document work completion

### For Citizens:
- ✅ Complete transparency
- ✅ Know who's handling their issue
- ✅ See real progress updates
- ✅ Faster resolution

---

## 📝 Next Steps

Would you like me to:
1. **Create the database collections** in Appwrite?
2. **Build the Official Login & Dashboard** pages?
3. **Enhance the MLA Response Modal** with assignment feature?
4. **Build the Official Update System**?

Let me know which part you'd like to start with! 🚀
