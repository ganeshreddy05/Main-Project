# 🔧 SOLUTION: Fix "Unknown Department" Issue

## Problem
The official's profile doesn't have a `department` field in the Appwrite `users` collection, so the dashboard shows "Unknown".

## Root Cause
The official "anirudh" was likely created before the department field was added to the approval process, or there was an error during approval.

## ✅ Solution: Manually Update the Official's Profile

### Step 1: Go to Appwrite Console
1. Open your browser
2. Go to Appwrite Console (https://sgp.cloud.appwrite.io/console)
3. Login to your account
4. Select your project: "Turn the Wheel"

### Step 2: Navigate to Users Collection
1. Click "Databases" in the left sidebar
2. Click on your database (ID: `694f69ed001e598ac21e`)
3. Click on the `users` collection

### Step 3: Find the Official's Document
1. Look for the document where:
   - `name` = "anirudh" (or the official's name)
   - `role` = "official"
2. Click on that document to open it

### Step 4: Add the Department Field
1. Click "Update Document" or the edit button
2. Add a new attribute if it doesn't exist:
   - **Attribute Name**: `department`
   - **Value**: Choose one of these (EXACT spelling, all caps with underscores):
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
3. Click "Update" to save

### Step 5: Verify
1. Refresh the official dashboard page
2. You should now see the department name properly displayed
3. Work orders for that department should now appear

## 📋 Example: Setting Department to Water Supply

In Appwrite, the document should look like this:

```json
{
  "$id": "user_id_here",
  "userId": "user_id_here",
  "name": "anirudh",
  "email": "anirudh@example.com",
  "phone": "+91-1234567890",
  "state": "Telangana",
  "district": "Hyderabad",
  "role": "official",
  "department": "WATER_SUPPLY",  ← ADD THIS FIELD
  "designation": "Assistant Engineer",
  "status": "active"
}
```

## 🎯 Alternative: Re-register the Official

If you can't edit the document directly:

1. Delete the current official user from:
   - Appwrite Auth (Users section)
   - `users` collection
2. Go to the application and register again as a department official
3. Select the department during registration
4. Admin approves the application
5. The department will be automatically saved

## ✅ Expected Result

After adding the department field:

**Before**:
```
Department: Unknown
```

**After**:
```
Department: Water Supply
```

And work orders assigned to that department will now appear in the dashboard!

## 🔍 Verify Work Orders Are Working

After fixing the department:

1. Login as MLA
2. Go to "Help Requests" or "District Reports"
3. Click "Assign" on any item
4. Select the same department as the official (e.g., "Water Supply")
5. Fill the form and submit
6. Logout and login as the official
7. You should now see the work order in the dashboard!

## 📝 Future Prevention

For all new officials registered from now on, the department will be automatically saved during the approval process. This issue only affects officials created before the department field was added to the code.

## 🚀 Quick Fix Command (If you have Appwrite CLI)

If you have Appwrite CLI installed, you can run:

```bash
appwrite databases updateDocument \
  --databaseId 694f69ed001e598ac21e \
  --collectionId users \
  --documentId [OFFICIAL_USER_ID] \
  --data '{"department":"WATER_SUPPLY"}'
```

Replace `[OFFICIAL_USER_ID]` with the actual user ID and `WATER_SUPPLY` with the desired department.
