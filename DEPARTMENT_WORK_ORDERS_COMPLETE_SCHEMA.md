# 📊 COMPLETE DATABASE SCHEMA: department_work_orders

## Collection Information
- **Collection ID**: `department_work_orders`
- **Database ID**: `694f69ed001e598ac21e`
- **Purpose**: Store work orders assigned by MLAs to department officials

---

## 🗂️ ALL ATTRIBUTES

### Core Work Order Information

| # | Attribute Name | Type | Size | Required | Default | Description |
|---|----------------|------|------|----------|---------|-------------|
| 1 | `workOrderId` | String | 255 | Yes | - | Unique work order ID (e.g., WO-1234567890-abc123) |
| 2 | `assignedDepartment` | String | 100 | Yes | - | Department assigned to (e.g., WATER_SUPPLY, PUBLIC_WORKS) |
| 3 | `priorityLevel` | String | 50 | Yes | - | Priority: low, medium, high, urgent, critical |
| 4 | `status` | String | 50 | Yes | pending | Status: pending, accepted, in_progress, completed, rejected |

### MLA Information

| # | Attribute Name | Type | Size | Required | Default | Description |
|---|----------------|------|------|----------|---------|-------------|
| 5 | `mlaName` | String | 255 | Yes | - | Name of the MLA who assigned the work order |
| 6 | `mlaConstituency` | String | 255 | Yes | - | MLA's constituency |
| 7 | `mlaInstructions` | String | 5000 | Yes | - | Detailed instructions from MLA |

### Source Reference (One of these will be filled)

| # | Attribute Name | Type | Size | Required | Default | Description |
|---|----------------|------|------|----------|---------|-------------|
| 8 | `roadReportId` | String | 255 | No | - | ID of the road report (if work order is from road report) |
| 9 | `helpRequestId` | String | 255 | No | - | ID of the help request (if work order is from help request) |

### Timestamps (MLA Side)

| # | Attribute Name | Type | Required | Default | Description |
|---|----------------|------|----------|---------|-------------|
| 10 | `assignedAt` | DateTime | Yes | - | When MLA assigned the work order |
| 11 | `estimatedCompletionDate` | DateTime | No | - | MLA's estimated completion date |

### Official Response Data

| # | Attribute Name | Type | Size | Required | Default | Description |
|---|----------------|------|------|----------|---------|-------------|
| 12 | `officialNotes` | String | 5000 | No | - | Official's progress notes and updates |
| 13 | `officialEstimatedCompletion` | DateTime | - | No | - | Official's estimated completion date (calculated from estimated days) |
| 14 | `issuesFaced` | String | 2000 | No | - | Issues and challenges faced by official |
| 15 | `resourcesNeeded` | String | 2000 | No | - | Resources and support needed by official |
| 16 | `rejectionReason` | String | 1000 | No | - | Reason for rejecting the work order |

### Status Timestamps (Official Side)

| # | Attribute Name | Type | Required | Default | Description |
|---|----------------|------|----------|---------|-------------|
| 17 | `acceptedAt` | DateTime | No | - | When official accepted the work order |
| 18 | `startedAt` | DateTime | No | - | When official started working on it |
| 19 | `completedAt` | DateTime | No | - | When official completed the work |
| 20 | `rejectedAt` | DateTime | No | - | When official rejected the work order |
| 21 | `updatedAt` | DateTime | No | - | Last update timestamp |

---

## 📋 COMPLETE ATTRIBUTE LIST (21 Total)

### Quick Reference for Appwrite Setup

```
CORE WORK ORDER (4 attributes):
1.  workOrderId              - String (255)    - Required
2.  assignedDepartment       - String (100)    - Required
3.  priorityLevel            - String (50)     - Required
4.  status                   - String (50)     - Required

MLA INFORMATION (3 attributes):
5.  mlaName                  - String (255)    - Required
6.  mlaConstituency          - String (255)    - Required
7.  mlaInstructions          - String (5000)   - Required

SOURCE REFERENCE (2 attributes):
8.  roadReportId             - String (255)    - Optional
9.  helpRequestId            - String (255)    - Optional

MLA TIMESTAMPS (2 attributes):
10. assignedAt               - DateTime        - Required
11. estimatedCompletionDate  - DateTime        - Optional

OFFICIAL RESPONSE (5 attributes):
12. officialNotes            - String (5000)   - Optional
13. officialEstimatedCompletion - DateTime     - Optional
14. issuesFaced              - String (2000)   - Optional
15. resourcesNeeded          - String (2000)   - Optional
16. rejectionReason          - String (1000)   - Optional

STATUS TIMESTAMPS (5 attributes):
17. acceptedAt               - DateTime        - Optional
18. startedAt                - DateTime        - Optional
19. completedAt              - DateTime        - Optional
20. rejectedAt               - DateTime        - Optional
21. updatedAt                - DateTime        - Optional
```

---

## 🔧 Appwrite Setup Instructions

### Attributes That Should Already Exist (11)
These were created when you first set up work orders:

1. ✅ `workOrderId` (String, 255, Required)
2. ✅ `assignedDepartment` (String, 100, Required)
3. ✅ `priorityLevel` (String, 50, Required)
4. ✅ `status` (String, 50, Required)
5. ✅ `mlaName` (String, 255, Required)
6. ✅ `mlaConstituency` (String, 255, Required)
7. ✅ `mlaInstructions` (String, 5000, Required)
8. ✅ `roadReportId` (String, 255, Optional)
9. ✅ `helpRequestId` (String, 255, Optional)
10. ✅ `assignedAt` (DateTime, Required)
11. ✅ `estimatedCompletionDate` (DateTime, Optional)

### Attributes You Need to Add (10)
For the official response system:

1. ⚠️ `officialNotes` (String, 5000, Optional)
2. ⚠️ `officialEstimatedCompletion` (DateTime, Optional)
3. ⚠️ `issuesFaced` (String, 2000, Optional)
4. ⚠️ `resourcesNeeded` (String, 2000, Optional)
5. ⚠️ `rejectionReason` (String, 1000, Optional)
6. ⚠️ `acceptedAt` (DateTime, Optional)
7. ⚠️ `startedAt` (DateTime, Optional)
8. ⚠️ `completedAt` (DateTime, Optional)
9. ⚠️ `rejectedAt` (DateTime, Optional)
10. ⚠️ `updatedAt` (DateTime, Optional)

---

## 📊 Sample Work Order Document

Here's what a complete work order document looks like:

```json
{
  "$id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "$createdAt": "2026-02-16T05:00:00.000Z",
  "$updatedAt": "2026-02-16T10:30:00.000Z",
  
  // Core Work Order
  "workOrderId": "WO-1708070400-abc123",
  "assignedDepartment": "WATER_SUPPLY",
  "priorityLevel": "high",
  "status": "in_progress",
  
  // MLA Information
  "mlaName": "Rajesh Kumar",
  "mlaConstituency": "Hyderabad Central",
  "mlaInstructions": "Fix water supply issue in Rampur village. Multiple families affected. Please prioritize this work.",
  
  // Source Reference
  "roadReportId": null,
  "helpRequestId": "65e1a2b3c4d5e6f7g8h9i0j1",
  
  // MLA Timestamps
  "assignedAt": "2026-02-16T05:00:00.000Z",
  "estimatedCompletionDate": "2026-02-23T00:00:00.000Z",
  
  // Official Response
  "officialNotes": "Work started on 16th Feb. Completed pipeline inspection. Found leak in main line. Repair work in progress.",
  "officialEstimatedCompletion": "2026-02-21T00:00:00.000Z",
  "issuesFaced": "Delayed by 1 day due to heavy rain. Waiting for cement delivery.",
  "resourcesNeeded": "Need 2 additional workers and excavator for digging.",
  "rejectionReason": null,
  
  // Status Timestamps
  "acceptedAt": "2026-02-16T06:30:00.000Z",
  "startedAt": "2026-02-16T08:00:00.000Z",
  "completedAt": null,
  "rejectedAt": null,
  "updatedAt": "2026-02-16T10:30:00.000Z"
}
```

---

## 🎯 Field Usage by Status

### When Status = "pending"
**Filled by MLA:**
- workOrderId, assignedDepartment, priorityLevel, status
- mlaName, mlaConstituency, mlaInstructions
- roadReportId OR helpRequestId
- assignedAt, estimatedCompletionDate

**Not yet filled:**
- All official response fields
- All status timestamps

### When Status = "accepted"
**Additionally filled:**
- officialNotes (optional)
- officialEstimatedCompletion (if estimated days provided)
- resourcesNeeded (optional)
- acceptedAt (timestamp)
- updatedAt (timestamp)

### When Status = "in_progress"
**Additionally filled:**
- officialNotes (progress updates)
- issuesFaced (optional)
- resourcesNeeded (optional)
- startedAt (timestamp)
- updatedAt (timestamp)

### When Status = "completed"
**Additionally filled:**
- officialNotes (final notes)
- completedAt (actual completion date)
- updatedAt (timestamp)

### When Status = "rejected"
**Additionally filled:**
- rejectionReason (required)
- issuesFaced (optional)
- rejectedAt (timestamp)
- updatedAt (timestamp)

---

## 🔐 Permissions Required

### Read Permission
- Role: `users` (all authenticated users)
- Allows: MLAs and Officials to view work orders

### Create Permission
- Role: `users` with role "mla"
- Allows: Only MLAs can create work orders

### Update Permission
- Role: `users`
- Allows: Officials to update work order status and add responses

### Delete Permission
- Role: `users` with role "admin"
- Allows: Only admins can delete work orders (if needed)

---

## 📏 Size Recommendations

| Field Type | Size | Reason |
|------------|------|--------|
| Short IDs | 255 | Enough for UUIDs and generated IDs |
| Department Names | 100 | Longest department name is ~30 chars |
| Status/Priority | 50 | Enum values are short |
| Names | 255 | Full names with titles |
| Instructions | 5000 | Detailed instructions from MLA |
| Notes | 5000 | Detailed progress updates |
| Issues/Resources | 2000 | Moderate detail |
| Rejection Reason | 1000 | Brief explanation |

---

## 🧪 Validation Rules

### Required Fields (Must be filled when creating)
- workOrderId
- assignedDepartment
- priorityLevel
- status
- mlaName
- mlaConstituency
- mlaInstructions
- assignedAt

### Conditional Required Fields
- `rejectionReason`: Required when status = "rejected"
- `completedAt`: Required when status = "completed"
- Either `roadReportId` OR `helpRequestId` should be filled (not both)

### Enum Values

**assignedDepartment**:
```
PUBLIC_WORKS
WATER_SUPPLY
ELECTRICITY
HEALTHCARE
EDUCATION
AGRICULTURE
POLICE_LAW_ORDER
WASTE_MANAGEMENT
TRANSPORTATION
DIGITAL_CONNECTIVITY
HOUSING
SOCIAL_WELFARE
REVENUE_ADMINISTRATION
```

**priorityLevel**:
```
low
medium
high
urgent
critical
```

**status**:
```
pending
accepted
in_progress
completed
rejected
```

---

## 🎯 Summary

**Total Attributes**: 21

**Already Exist**: 11 (core work order fields)

**Need to Add**: 10 (official response fields)

**All Optional**: The 10 new attributes are optional for backward compatibility

**Purpose**: Enable detailed communication between MLAs and officials for better work order management

---

## 📞 Quick Setup Checklist

- [ ] Verify 11 existing attributes are present
- [ ] Add 10 new attributes for official responses
- [ ] Set correct data types and sizes
- [ ] Mark new attributes as optional
- [ ] Verify permissions are correct
- [ ] Test creating a work order
- [ ] Test official response
- [ ] Verify data saves correctly

**After setup, your work order system will be complete!** 🎉
