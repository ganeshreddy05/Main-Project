# 🔧 ADD ATTRIBUTES FOR OFFICIAL RESPONSE SYSTEM

## Required Appwrite Database Attributes

You need to add these attributes to the `department_work_orders` collection in Appwrite.

---

## 📋 Step-by-Step Instructions

### Step 1: Login to Appwrite Console
1. Go to: https://sgp.cloud.appwrite.io/console
2. Login to your account
3. Select project: "Turn the Wheel"
4. Click "Databases" → Select your database → Click `department_work_orders` collection

### Step 2: Go to Attributes Tab
Click on the "Attributes" tab at the top of the collection page.

### Step 3: Add the Following Attributes

For each attribute below, click "Create Attribute" → Select type → Fill details → Click "Create"

---

## 📝 Attributes to Add

### 1. officialNotes
```
Type: String
Key: officialNotes
Size: 5000
Required: No
Array: No
Default: (empty)
```
**Purpose**: Official's progress notes and updates

---

### 2. officialEstimatedCompletion
```
Type: DateTime
Key: officialEstimatedCompletion
Required: No
Default: (empty)
```
**Purpose**: Estimated completion date calculated from official's input

---

### 3. issuesFaced
```
Type: String
Key: issuesFaced
Size: 2000
Required: No
Array: No
Default: (empty)
```
**Purpose**: Issues and challenges faced by official

---

### 4. resourcesNeeded
```
Type: String
Key: resourcesNeeded
Size: 2000
Required: No
Array: No
Default: (empty)
```
**Purpose**: Resources and support needed to complete work

---

### 5. rejectionReason
```
Type: String
Key: rejectionReason
Size: 1000
Required: No
Array: No
Default: (empty)
```
**Purpose**: Reason for rejecting the work order

---

### 6. acceptedAt
```
Type: DateTime
Key: acceptedAt
Required: No
Default: (empty)
```
**Purpose**: Timestamp when work order was accepted

---

### 7. startedAt
```
Type: DateTime
Key: startedAt
Required: No
Default: (empty)
```
**Purpose**: Timestamp when work started

---

### 8. completedAt
```
Type: DateTime
Key: completedAt
Required: No
Default: (empty)
```
**Purpose**: Timestamp when work was completed

---

### 9. rejectedAt
```
Type: DateTime
Key: rejectedAt
Required: No
Default: (empty)
```
**Purpose**: Timestamp when work order was rejected

---

### 10. updatedAt
```
Type: DateTime
Key: updatedAt
Required: No
Default: (empty)
```
**Purpose**: Last update timestamp

---

## ✅ Verification

After adding all attributes, your `department_work_orders` collection should have these attributes:

**Existing Attributes** (should already be there):
- `workOrderId` (String)
- `assignedDepartment` (String)
- `priorityLevel` (String)
- `mlaName` (String)
- `mlaInstructions` (String)
- `mlaConstituency` (String)
- `status` (String)
- `assignedAt` (DateTime)
- `estimatedCompletionDate` (DateTime)
- `roadReportId` (String, optional)
- `helpRequestId` (String, optional)

**New Attributes** (just added):
- ✅ `officialNotes` (String, 5000)
- ✅ `officialEstimatedCompletion` (DateTime)
- ✅ `issuesFaced` (String, 2000)
- ✅ `resourcesNeeded` (String, 2000)
- ✅ `rejectionReason` (String, 1000)
- ✅ `acceptedAt` (DateTime)
- ✅ `startedAt` (DateTime)
- ✅ `completedAt` (DateTime)
- ✅ `rejectedAt` (DateTime)
- ✅ `updatedAt` (DateTime)

---

## 🧪 Test After Setup

1. Login as official
2. Go to Work Orders page
3. Click "Respond to Work Order" on any work order
4. Fill the form with test data
5. Submit
6. Check Appwrite console to verify data is saved
7. Login as MLA to see the official's response

---

## ⚠️ Important Notes

- All new attributes are **optional** (not required)
- This allows backward compatibility with existing work orders
- String sizes are generous to allow detailed responses
- DateTime fields automatically store ISO 8601 format

---

## 🎯 Quick Copy-Paste Reference

For quick reference while adding attributes:

```
1. officialNotes - String - 5000 - Optional
2. officialEstimatedCompletion - DateTime - Optional
3. issuesFaced - String - 2000 - Optional
4. resourcesNeeded - String - 2000 - Optional
5. rejectionReason - String - 1000 - Optional
6. acceptedAt - DateTime - Optional
7. startedAt - DateTime - Optional
8. completedAt - DateTime - Optional
9. rejectedAt - DateTime - Optional
10. updatedAt - DateTime - Optional
```

---

## 🚀 After Adding Attributes

Once all attributes are added:
1. Refresh your application
2. Test the official response system
3. Verify data is being saved correctly
4. Check that MLAs can see the responses

The system will work perfectly after these attributes are added!
