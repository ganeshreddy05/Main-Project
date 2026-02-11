# 🚀 Quick Setup: Department Work Orders - Appwrite Configuration

## ⚡ Fast Setup Guide

### Step 1: Create New Collection

**Collection Name**: `department_work_orders`

**Collection ID**: `department_work_orders` (or use in .env as `VITE_WORK_ORDERS_COLLECTION_ID`)

---

## Step 2: Add Attributes (Copy & Paste Ready)

### Required Attributes (Must Have)

| Attribute | Type | Size | Required | Array | Default |
|-----------|------|------|----------|-------|---------|
| `workOrderId` | String | 255 | ✅ Yes | No | - |
| `roadReportId` | String | 255 | ✅ Yes | No | - |
| `mlaId` | String | 255 | ✅ Yes | No | - |
| `mlaName` | String | 255 | ✅ Yes | No | - |
| `mlaConstituency` | String | 255 | ✅ Yes | No | - |
| `assignedDepartment` | Enum | - | ✅ Yes | No | - |
| `priorityLevel` | Enum | - | ✅ Yes | No | `medium` |
| `status` | Enum | - | ✅ Yes | No | `pending` |
| `mlaInstructions` | String | 5000 | ✅ Yes | No | - |
| `assignedAt` | String | 255 | ✅ Yes | No | - |
| `updatedAt` | String | 255 | ✅ Yes | No | - |

### Optional Attributes (Add Later if Needed)

| Attribute | Type | Size | Required |
|-----------|------|------|----------|
| `assignedToOfficialId` | String | 255 | No |
| `assignedToOfficialName` | String | 255 | No |
| `officialResponse` | String | 5000 | No |
| `estimatedCompletionDate` | String | 255 | No |
| `actualCompletionDate` | String | 255 | No |
| `acceptedAt` | String | 255 | No |
| `startedAt` | String | 255 | No |
| `completedAt` | String | 255 | No |
| `rejectedAt` | String | 255 | No |
| `rejectionReason` | String | 1000 | No |
| `progressNotes` | String | 5000 | No |
| `attachments` | String | 5000 | No |

---

## Step 3: Enum Values (EXACT VALUES - Copy This)

### 📋 Enum: `assignedDepartment`

**In Appwrite: Add these as comma-separated or individual elements**

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

**As comma-separated string (if Appwrite asks)**:
```
WATER_SUPPLY,DRAINAGE_SANITATION,ELECTRICITY,STREET_LIGHTS,HEALTHCARE,EDUCATION,PUBLIC_INFRASTRUCTURE,AGRICULTURE,LAW_ORDER_SAFETY,WASTE_MANAGEMENT,TRANSPORTATION,DIGITAL_CONNECTIVITY,OTHER_COMMUNITY
```

---

### ⚡ Enum: `priorityLevel`

```
low
medium
high
urgent
critical
```

**As comma-separated**:
```
low,medium,high,urgent,critical
```

**Default Value**: `medium`

---

### 📊 Enum: `status`

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

**As comma-separated**:
```
pending,assigned,accepted,in_progress,on_hold,completed,verified,rejected,cancelled
```

**Default Value**: `pending`

---

## Step 4: Update Existing `road_reports` Collection

Add these **3 optional attributes**:

| Attribute | Type | Size | Required | Enum Values |
|-----------|------|------|----------|-------------|
| `assignedToDepartment` | String | 100 | ❌ No | - |
| `departmentStatus` | Enum | - | ❌ No | `not_assigned`, `assigned`, `in_progress`, `completed` |
| `workOrderId` | String | 255 | ❌ No | - |

**For `departmentStatus` enum**:
```
not_assigned
assigned
in_progress
completed
```

**As comma-separated**:
```
not_assigned,assigned,in_progress,completed
```

---

## Step 5: Add to .env File

```env
VITE_WORK_ORDERS_COLLECTION_ID=department_work_orders
```

---

## ✅ Verification Checklist

After setting up in Appwrite, verify:

- [ ] Collection `department_work_orders` created
- [ ] All 11 required attributes added
- [ ] `assignedDepartment` enum has 13 values
- [ ] `priorityLevel` enum has 5 values (default: medium)
- [ ] `status` enum has 9 values (default: pending)
- [ ] `road_reports` collection updated with 3 new attributes
- [ ] `departmentStatus` enum has 4 values
- [ ] `.env` file updated with collection ID

---

## 🎯 Minimal Setup (Start Small)

If you want to start with just the essentials:

### Minimum Required Attributes:
1. `workOrderId` - String, 255
2. `roadReportId` - String, 255
3. `mlaId` - String, 255
4. `mlaName` - String, 255
5. `assignedDepartment` - Enum (13 values)
6. `status` - Enum (9 values, default: pending)
7. `mlaInstructions` - String, 5000
8. `assignedAt` - String, 255

### You can add the rest later as features grow!

---

## 📚 Reference

**Department Constants File**: 
`src/constants/departmentConstants.js`

**This file already has**:
- ✅ All 13 department definitions
- ✅ Icons and colors
- ✅ Department labels
- ✅ Helper functions

**You can reuse the same constants in your work order system!**

---

## 🔐 Permissions (Set in Appwrite)

### For Collection: `department_work_orders`

**Create**:
- Role: `mla`

**Read**:
- Any authenticated user (can refine later)

**Update**:
- Role: `mla` (their own work orders)
- Role: `official` (work orders for their department)
- Role: `admin`

**Delete**:
- Role: `admin` only

---

## 🎉 You're Ready!

After completing these steps, your database will be ready to:
1. ✅ Store work order assignments from MLAs
2. ✅ Track department assignments
3. ✅ Monitor status through workflow
4. ✅ Let officials update progress
5. ✅ Link work orders to road reports

**Next step**: Start building the UI components! 🚀
