# 🗄️ Database Schema - Department Work Orders

## Overview
This enables MLAs to assign road reports to specific departments, and department officials can track and update their assigned work.

---

## 📋 New Collection: `department_work_orders`

### Purpose
Tracks work assignments from MLAs to department officials for road report resolution.

### Attributes

| # | Attribute Name | Type | Size | Required | Default | Enum/Description |
|---|----------------|------|------|----------|---------|------------------|
| 1 | `workOrderId` | String | 255 | ✅ Yes | - | Unique identifier |
| 2 | `roadReportId` | String | 255 | ✅ Yes | - | Reference to road report |
| 3 | `mlaId` | String | 255 | ✅ Yes | - | MLA who assigned it |
| 4 | `mlaName` | String | 255 | ✅ Yes | - | MLA name (for display) |
| 5 | `mlaConstituency` | String | 255 | ✅ Yes | - | MLA's constituency |
| 6 | `assignedDepartment` | String | 100 | ✅ Yes | - | Department enum (see below) |
| 7 | `priorityLevel` | String | 50 | ✅ Yes | medium | Priority enum (see below) |
| 8 | `status` | String | 50 | ✅ Yes | pending | Status enum (see below) |
| 9 | `mlaInstructions` | String | 5000 | ✅ Yes | - | Instructions from MLA |
| 10 | `assignedAt` | String | 255 | ✅ Yes | - | Assignment timestamp |
| 11 | `assignedToOfficialId` | String | 255 | ❌ No | - | Specific official (optional) |
| 12 | `assignedToOfficialName` | String | 255 | ❌ No | - | Official name (optional) |
| 13 | `officialResponse` | String | 5000 | ❌ No | - | Response from official |
| 14 | `estimatedCompletionDate` | String | 255 | ❌ No | - | Expected completion date |
| 15 | `actualCompletionDate` | String | 255 | ❌ No | - | Actual completion date |
| 16 | `acceptedAt` | String | 255 | ❌ No | - | When official accepted |
| 17 | `startedAt` | String | 255 | ❌ No | - | When work started |
| 18 | `completedAt` | String | 255 | ❌ No | - | When completed |
| 19 | `rejectedAt` | String | 255 | ❌ No | - | When rejected |
| 20 | `rejectionReason` | String | 1000 | ❌ No | - | Why rejected |
| 21 | `progressNotes` | String | 5000 | ❌ No | - | Progress updates (JSON array) |
| 22 | `attachments` | String | 5000 | ❌ No | - | Proof attachments (JSON array) |
| 23 | `updatedAt` | String | 255 | ✅ Yes | - | Last update timestamp |

---

## 🎯 Enum Values

### 1. `assignedDepartment` (Required)

**Use the exact enum values from your `departmentConstants.js` file:**

```
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
```

**Display Labels** (for reference):
- `WATER_SUPPLY` → 💧 Water Supply Department
- `DRAINAGE_SANITATION` → 🚰 Drainage & Sanitation
- `ELECTRICITY` → ⚡ Electricity Department
- `STREET_LIGHTS` → 💡 Street Lighting
- `HEALTHCARE` → 🏥 Health Department
- `EDUCATION` → 🎓 Education Department
- `PUBLIC_INFRASTRUCTURE` → 🏗️ Public Works (PWD)
- `AGRICULTURE` → 🌾 Agriculture Department
- `LAW_ORDER_SAFETY` → 👮 Police & Revenue
- `WASTE_MANAGEMENT` → ♻️ Waste Management
- `TRANSPORTATION` → 🚌 Transport Department
- `DIGITAL_CONNECTIVITY` → 📡 IT & Telecom
- `OTHER_COMMUNITY` → 🏛️ General Administration

### 2. `priorityLevel` (Required, Default: "medium")

```
low
medium
high
urgent
critical
```

**Usage**:
- `low` - Minor issues, can wait
- `medium` - Normal priority (default)
- `high` - Important, quick attention needed
- `urgent` - Very important, immediate attention
- `critical` - Emergency, top priority

### 3. `status` (Required, Default: "pending")

```
pending
assigned
accepted
in_progress
on_hold
completed
verified
rejected
cancelled
```

**Workflow States**:

1. **`pending`** - MLA just assigned, waiting for official to see it
2. **`assigned`** - Assigned to specific official (optional step)
3. **`accepted`** - Official accepted the work order
4. **`in_progress`** - Work is actively being done
5. **`on_hold`** - Temporarily paused (need resources, etc.)
6. **`completed`** - Official marked work as done
7. **`verified`** - MLA/Admin verified completion
8. **`rejected`** - Official cannot do it (wrong dept, etc.)
9. **`cancelled`** - MLA cancelled the assignment

---

## 📊 Update Existing Collection: `road_reports`

Add these **optional** attributes to track department assignments:

| # | Attribute Name | Type | Size | Required | Enum Values |
|---|----------------|------|------|----------|-------------|
| 24 | `assignedToDepartment` | String | 100 | ❌ No | Same as department enum |
| 25 | `departmentStatus` | String | 50 | ❌ No | `not_assigned`, `assigned`, `in_progress`, `completed` |
| 26 | `workOrderId` | String | 255 | ❌ No | Reference to work order |

---

## 🔄 Complete Workflow

### Step 1: Citizen Reports Issue
```
road_reports:
  status: "ACTIVE"
  departmentStatus: "not_assigned"
```

### Step 2: MLA Reviews & Assigns to Department
```
MLA Action:
  1. Views road report
  2. Adds MLA response (existing functionality)
  3. Clicks "Assign to Department"
  4. Selects department & priority
  5. Adds instructions

Creates:
  department_work_orders:
    status: "pending"
    priorityLevel: "high"
    assignedDepartment: "PUBLIC_WORKS"
    mlaInstructions: "Please fix potholes on Main Road"

Updates:
  road_reports:
    departmentStatus: "assigned"
    assignedToDepartment: "PUBLIC_WORKS"
    workOrderId: "xyz123"
```

### Step 3: Department Official Sees Assignment
```
department_work_orders:
  status: "pending" → "accepted"
  acceptedAt: timestamp
  assignedToOfficialId: official's ID
  estimatedCompletionDate: "2026-02-20"
```

### Step 4: Official Starts Work
```
department_work_orders:
  status: "accepted" → "in_progress"
  startedAt: timestamp
  progressNotes: [
    {
      date: "2026-02-12",
      note: "Team deployed to site"
    }
  ]
```

### Step 5: Official Updates Progress
```
department_work_orders:
  progressNotes: [
    {...},
    {
      date: "2026-02-15",
      note: "50% complete, materials ordered"
    }
  ]
```

### Step 6: Official Completes Work
```
department_work_orders:
  status: "in_progress" → "completed"
  completedAt: timestamp
  actualCompletionDate: "2026-02-18"
  attachments: ["url1", "url2"] // Before/after photos
  officialResponse: "Work completed successfully. Potholes filled."

Updates:
  road_reports:
    departmentStatus: "completed"
```

### Step 7: MLA Verifies (Optional)
```
department_work_orders:
  status: "completed" → "verified"
  
Updates:
  road_reports:
    status: "RESOLVED"
```

---

## 🎨 UI Components Needed

### 1. MLA Dashboard - Road Report Card
Add button: **"Assign to Department"**

### 2. MLA - Assignment Modal
```
┌─────────────────────────────────────┐
│ Assign to Department                │
├─────────────────────────────────────┤
│ Department: [Dropdown]              │
│ Priority:   [Dropdown]              │
│ Due Date:   [Date Picker]           │
│                                     │
│ Instructions:                       │
│ [Text Area]                         │
│                                     │
│ [Cancel] [Assign Work]              │
└─────────────────────────────────────┘
```

### 3. Department Official Dashboard
New section: **"My Work Orders"**

Tabs:
- Pending (need to accept)
- In Progress (actively working)
- Completed (finished work)
- All

### 4. Work Order Detail Page
```
┌─────────────────────────────────────┐
│ Work Order #WO-12345                │
│ Status: IN PROGRESS                 │
├─────────────────────────────────────┤
│ Original Report:                    │
│   From: Main Road to City Center    │
│   Issue: Potholes                   │
│                                     │
│ Assigned by: MLA John Doe           │
│ Constituency: District 5            │
│ Priority: HIGH                      │
│                                     │
│ Instructions:                       │
│   "Please fix all potholes..."      │
│                                     │
│ Progress:                           │
│   ▓▓▓▓▓▓░░░░ 60%                    │
│                                     │
│ [Update Status] [Add Progress Note] │
└─────────────────────────────────────┘
```

---

## 🔐 Permissions

### Collection: `department_work_orders`

**Create**:
- Users with role "mla"

**Read**:
- MLA who created it
- Users with role "official" AND matching department
- Users with role "admin"

**Update**:
- MLA who created it (limited fields)
- Assigned official (status, response, etc.)
- Users with role "admin"

**Delete**:
- Users with role "admin" only

---

## 📱 Notification System (Future Enhancement)

When MLA assigns work:
- ✉️ Notify all officials in that department

When official accepts:
- ✉️ Notify the MLA

When official completes:
- ✉️ Notify the MLA
- ✉️ Notify the original reporter (citizen)

---

## 🎯 Quick Setup Summary

### In Appwrite Console:

1. **Create Collection**: `department_work_orders`

2. **Add Attributes** (copy from table above)

3. **Set Enums**:
   - `assignedDepartment`: All 13 department values
   - `priorityLevel`: low, medium, high, urgent, critical
   - `status`: pending, assigned, accepted, in_progress, on_hold, completed, verified, rejected, cancelled

4. **Update `road_reports` Collection**:
   - Add `assignedToDepartment` (String, 100, optional)
   - Add `departmentStatus` (String, 50, optional, enum: not_assigned, assigned, in_progress, completed)
   - Add `workOrderId` (String, 255, optional)

5. **Set Permissions**:
   - Create: Role "mla"
   - Read: Conditions based on mlaId or department match
   - Update: MLA owner or assigned official
   - Delete: Admin only

---

## ✅ Benefits of This Design

1. **Clear Workflow**: Each step is tracked
2. **Accountability**: Know who's responsible at each stage
3. **Progress Tracking**: Officials can update progress
4. **History**: Full audit trail of assignments
5. **Priority Management**: Urgent issues get attention
6. **Department Filtering**: Officials only see their work
7. **MLA Oversight**: MLAs can track department performance
8. **Citizen Updates**: Citizens see their reports are being acted on

---

## 🚀 Implementation Priority

### Phase 1 (MVP):
- ✅ Create work order when MLA assigns
- ✅ Officials see assigned work
- ✅ Officials can accept/reject
- ✅ Officials can mark complete
- ✅ Basic status tracking

### Phase 2 (Enhanced):
- Progress notes
- File attachments
- Estimated dates
- Priority levels

### Phase 3 (Advanced):
- Reassignment
- MLA verification
- Analytics dashboard
- Automated notifications

---

**Start with Phase 1 and you'll have a working system!** 🎉
