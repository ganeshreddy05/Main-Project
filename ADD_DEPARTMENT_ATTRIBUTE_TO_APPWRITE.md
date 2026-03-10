# 🔧 ADD DEPARTMENT ATTRIBUTE TO USERS COLLECTION

## Problem
Officials can't see work orders because the `department` field doesn't exist as an attribute in the Appwrite `users` collection.

## Solution
Add the `department` attribute to the `users` collection in Appwrite so that every official's department is saved during registration.

---

## 📋 Step-by-Step Instructions

### Step 1: Login to Appwrite Console
1. Open your browser
2. Go to: https://sgp.cloud.appwrite.io/console
3. Login to your account
4. Select project: **"Turn the Wheel"**

### Step 2: Navigate to Users Collection
1. Click **"Databases"** in the left sidebar
2. Click on your database (ID: `694f69ed001e598ac21e`)
3. Click on the **`users`** collection

### Step 3: Go to Attributes Tab
1. Click on the **"Attributes"** tab (at the top of the collection page)
2. You'll see a list of existing attributes like:
   - `userId` (String)
   - `name` (String)
   - `email` (String)
   - `phone` (String)
   - `state` (String)
   - `district` (String)
   - `role` (String)
   - `status` (String)

### Step 4: Add Department Attribute
1. Click the **"Create Attribute"** button
2. Select **"String"** as the attribute type
3. Fill in the details:

```
Attribute Key: department
Size: 100
Required: No (unchecked)
Array: No (unchecked)
Default Value: (leave empty)
```

4. Click **"Create"**
5. Wait for the attribute to be created (may take a few seconds)

### Step 5: Add Designation Attribute (Optional)
While you're here, also add the `designation` attribute for officials:

1. Click **"Create Attribute"** again
2. Select **"String"**
3. Fill in:

```
Attribute Key: designation
Size: 100
Required: No (unchecked)
Array: No (unchecked)
Default Value: (leave empty)
```

4. Click **"Create"**

---

## ✅ Verify the Attributes

After creating the attributes, your `users` collection should have these attributes:

| Attribute Name | Type | Size | Required | Notes |
|----------------|------|------|----------|-------|
| `userId` | String | 255 | Yes | User's unique ID |
| `name` | String | 255 | Yes | User's full name |
| `email` | String | 255 | Yes | User's email |
| `phone` | String | 50 | Yes | User's phone |
| `state` | String | 100 | Yes | User's state |
| `district` | String | 100 | Yes | User's district |
| `role` | String | 50 | Yes | citizen/mla/official/admin |
| `status` | String | 50 | Yes | active/inactive |
| **`department`** | **String** | **100** | **No** | **For officials only** |
| **`designation`** | **String** | **100** | **No** | **For officials only** |

---

## 🎯 How It Works After Adding the Attribute

### 1. New Official Registration
When a new official registers:
1. They select their department during registration
2. Admin approves the application
3. The code automatically saves the department to the `users` collection
4. Official can login and see their department in the dashboard

### 2. Work Order Assignment
When an MLA assigns a work order:
1. MLA selects a department (e.g., "Water Supply")
2. Work order is created with `assignedDepartment: "WATER_SUPPLY"`
3. Officials with `department: "WATER_SUPPLY"` can see the work order
4. Officials from other departments cannot see it

### 3. Official Dashboard
When an official logs in:
1. System reads their `department` from the `users` collection
2. Fetches work orders where `assignedDepartment` matches their department
3. Displays work orders in the dashboard

---

## 🔄 For Existing Officials (Like Anirudh)

After adding the `department` attribute, you need to manually update existing officials:

### Option 1: Update Manually in Appwrite
1. Go to `users` collection
2. Find each official's document
3. Click "Update Document"
4. Add the `department` field with the correct value
5. Save

### Option 2: Re-register
1. Delete the existing official from:
   - Appwrite Auth (Users section)
   - `users` collection
2. Register again through the application
3. Admin approves
4. Department will be saved automatically

---

## 📊 Department Values

When updating or creating officials, use these EXACT values for the `department` field:

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

**IMPORTANT**: Use EXACT spelling with underscores and all caps!

---

## 🧪 Testing After Setup

### Test 1: Create New Official
1. Go to `/government-official-register`
2. Select "Department Official"
3. Fill in details and select department (e.g., "Water Supply")
4. Submit application
5. Admin approves
6. Login as official
7. ✅ Department should show correctly in dashboard

### Test 2: Assign Work Order
1. Login as MLA
2. Go to "Help Requests" or "District Reports"
3. Click "Assign" on any item
4. Select department (e.g., "Water Supply")
5. Submit
6. Login as official from that department
7. ✅ Work order should appear in dashboard

### Test 3: Department Filtering
1. Create work orders for different departments
2. Login as official from "Water Supply"
3. ✅ Should only see work orders for "Water Supply"
4. ❌ Should NOT see work orders for other departments

---

## 🚨 Common Issues & Solutions

### Issue 1: "Unknown attribute: department"
**Cause**: The `department` attribute doesn't exist in the collection
**Solution**: Follow Step 4 above to create the attribute

### Issue 2: Department shows "Unknown"
**Cause**: The official's document doesn't have a value in the `department` field
**Solution**: Update the document manually or re-register the official

### Issue 3: No work orders showing
**Cause**: Official's department doesn't match work order's `assignedDepartment`
**Solution**: 
- Check official's `department` value
- Check work order's `assignedDepartment` value
- Ensure they match EXACTLY (case-sensitive)

### Issue 4: All officials see all work orders
**Cause**: The filtering logic is not working
**Solution**: Check the `getWorkOrdersByDepartment` function in `workOrderService.js`

---

## 📝 Code Reference

The code that saves the department is in `MLAApplications.jsx` (lines 77-80):

```javascript
// Add department and designation for officials
if (application.officialType === "DEPARTMENT_OFFICIAL") {
    userProfileData.department = application.department;
    userProfileData.designation = application.designation || "";
}
```

This code will work ONLY if the `department` attribute exists in the Appwrite collection!

---

## ✅ Final Checklist

Before testing, ensure:

- [ ] `department` attribute exists in `users` collection
- [ ] `designation` attribute exists in `users` collection (optional)
- [ ] Existing officials have been updated with their department
- [ ] New officials can register and select department
- [ ] Admin can approve officials
- [ ] Officials can login and see their department
- [ ] Work orders are filtered by department

---

## 🎉 Expected Result

After completing these steps:

1. ✅ Every official will have a department saved
2. ✅ Officials will see their department in the dashboard
3. ✅ Officials will only see work orders for their department
4. ✅ MLAs can assign work orders to specific departments
5. ✅ Complete workflow will function correctly

---

## 📞 Need Help?

If you're still having issues:
1. Check browser console for errors
2. Check Appwrite console for failed requests
3. Verify attribute names match exactly
4. Ensure department values use correct format (all caps with underscores)
