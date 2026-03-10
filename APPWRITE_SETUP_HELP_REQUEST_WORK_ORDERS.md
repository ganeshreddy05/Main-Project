# ⚠️ IMPORTANT: Appwrite Database Setup for Help Request Work Orders

## 🎯 Required Action

You MUST add the `helpRequestId` attribute to your Appwrite `department_work_orders` collection for this feature to work.

## 📋 Step-by-Step Instructions

### 1. Login to Appwrite Console
- Go to your Appwrite dashboard
- Navigate to your project

### 2. Open the Work Orders Collection
- Click on "Databases" in the sidebar
- Select your database (check your `.env` file for `VITE_DATABASE_ID`)
- Find and click on `department_work_orders` collection (check `.env` for `VITE_WORK_ORDERS_COLLECTION_ID`)

### 3. Add the New Attribute

Click on "Attributes" tab, then "Create Attribute"

**Attribute Configuration:**
```
Attribute Type: String
Key: helpRequestId
Size: 255 characters
Required: No (unchecked)
Array: No (unchecked)
Default: (leave empty)
```

### 4. Verify Existing Attributes

Make sure your `department_work_orders` collection has ALL these attributes:

| Attribute Name | Type | Required | Notes |
|----------------|------|----------|-------|
| `workOrderId` | String | Yes | Unique work order ID |
| `roadReportId` | String | No | For road reports (existing) |
| `helpRequestId` | String | No | For help requests (NEW!) |
| `mlaId` | String | Yes | MLA user ID |
| `mlaName` | String | Yes | MLA name |
| `mlaConstituency` | String | Yes | MLA district |
| `assignedDepartment` | String (Enum) | Yes | Department name |
| `priorityLevel` | String (Enum) | Yes | Priority level |
| `status` | String (Enum) | Yes | Work order status |
| `mlaInstructions` | String | Yes | Instructions text |
| `estimatedCompletionDate` | DateTime | No | Expected completion |
| `assignedAt` | DateTime | Yes | Assignment timestamp |
| `updatedAt` | DateTime | Yes | Last update timestamp |
| `acceptedAt` | DateTime | No | When official accepted |
| `startedAt` | DateTime | No | When work started |
| `completedAt` | DateTime | No | When work completed |
| `rejectedAt` | DateTime | No | When work rejected |
| `rejectionReason` | String | No | Reason for rejection |
| `progressNotes` | String | No | Progress updates (JSON) |

### 5. Enum Values

**assignedDepartment** (String Enum):
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

**priorityLevel** (String Enum):
```
low
medium
high
urgent
critical
```

**status** (String Enum):
```
pending
accepted
in_progress
on_hold
completed
rejected
```

## 🔍 How to Check if Setup is Correct

### Test 1: Create Work Order from Road Report
1. Login as MLA
2. Go to "District Reports" (Road Reports)
3. Click "Assign" on any report
4. Fill the form and submit
5. ✅ Should work (this was already working)

### Test 2: Create Work Order from Help Request
1. Login as MLA
2. Go to "Help Requests"
3. Click "Assign" on any request
4. Fill the form and submit
5. ✅ Should work if `helpRequestId` attribute exists
6. ❌ Will fail with error if attribute is missing

### Test 3: View in Official Dashboard
1. Login as department official
2. Go to dashboard
3. ✅ Should see work orders from both:
   - Road reports (have `roadReportId`)
   - Help requests (have `helpRequestId`)

## 🚨 Common Errors

### Error: "Unknown attribute: helpRequestId"
**Cause**: The `helpRequestId` attribute doesn't exist in Appwrite
**Solution**: Follow steps above to add the attribute

### Error: "Document missing required attribute"
**Cause**: One of the required attributes is missing
**Solution**: Check all required attributes exist (see table above)

### Error: "Invalid enum value"
**Cause**: Trying to use a value not in the enum list
**Solution**: Verify enum values match exactly (case-sensitive)

## 📊 Database Relationships

```
┌─────────────────┐
│  help_requests  │
│  ─────────────  │
│  $id            │◄──────┐
│  title          │       │
│  description    │       │
│  category       │       │
│  status         │       │
└─────────────────┘       │
                          │
                          │ helpRequestId
                          │
┌─────────────────┐       │
│  road_reports   │       │
│  ─────────────  │       │
│  $id            │◄──┐   │
│  fromPlace      │   │   │
│  toPlace        │   │   │
│  condition      │   │   │
└─────────────────┘   │   │
                      │   │
                      │   │
                      │   │
        ┌─────────────┴───┴──────────────┐
        │  department_work_orders        │
        │  ────────────────────────────  │
        │  workOrderId                   │
        │  roadReportId (optional)       │
        │  helpRequestId (optional)      │◄── NEW!
        │  mlaId                         │
        │  assignedDepartment            │
        │  priorityLevel                 │
        │  status                        │
        │  mlaInstructions               │
        └────────────────────────────────┘
```

## ✅ Verification Checklist

Before testing, verify:

- [ ] Appwrite console is accessible
- [ ] `department_work_orders` collection exists
- [ ] `helpRequestId` attribute is added (String, 255, optional)
- [ ] All required attributes exist (see table above)
- [ ] Enum values are correctly configured
- [ ] Collection permissions allow:
  - MLAs to create documents
  - Officials to read documents for their department
  - Officials to update documents

## 🔐 Permissions Setup

The `department_work_orders` collection should have these permissions:

**Create**:
- Role: MLA (users with role "mla")

**Read**:
- Role: MLA (to see their own work orders)
- Role: Official (to see work orders for their department)

**Update**:
- Role: Official (to update status, add notes)

**Delete**:
- Role: Admin only (optional)

## 🎉 Once Setup is Complete

After adding the `helpRequestId` attribute:

1. ✅ MLAs can assign both road reports AND help requests
2. ✅ Work orders are created successfully
3. ✅ Officials see work orders from both sources
4. ✅ Complete workflow is functional
5. ✅ No database errors

## 📞 Need Help?

If you encounter issues:
1. Check browser console for error messages
2. Check Appwrite console for failed requests
3. Verify attribute names match exactly (case-sensitive)
4. Ensure enum values are correct
5. Check collection permissions

## 🚀 Ready to Test!

Once you've added the `helpRequestId` attribute, the system is ready to use!

Test the complete flow:
1. Citizen reports issue → Help Request created
2. MLA sees issue → Responds and Assigns to department
3. Work Order created → Linked to help request
4. Official receives work order → Can manage and complete it
5. Status updates throughout → Everyone stays informed
