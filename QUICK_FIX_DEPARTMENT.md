# 🚀 QUICK FIX: Add Department Attribute to Appwrite

## ⚡ 3-Minute Fix

### Step 1: Open Appwrite Console
Go to: https://sgp.cloud.appwrite.io/console

### Step 2: Navigate to Users Collection
```
Databases → [Your Database] → users collection → Attributes tab
```

### Step 3: Create Department Attribute
Click "Create Attribute" → Select "String"

```
Attribute Key: department
Size: 100
Required: No
Array: No
Default: (empty)
```

Click "Create" ✅

### Step 4: Create Designation Attribute (Optional)
Click "Create Attribute" → Select "String"

```
Attribute Key: designation
Size: 100
Required: No
Array: No
Default: (empty)
```

Click "Create" ✅

---

## ✅ That's It!

After adding these attributes:
- ✅ New officials will have their department saved automatically
- ✅ Officials will see their department in the dashboard
- ✅ Work orders will appear correctly
- ✅ System will work as expected

---

## 🔄 For Existing Officials

If you already have officials registered (like "anirudh"):

1. Go to `users` collection
2. Find their document
3. Click "Update Document"
4. Add `department` field with value like `WATER_SUPPLY`
5. Save

---

## 📋 Valid Department Values

Use EXACT values (all caps with underscores):

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

---

## 🧪 Test After Setup

1. Register a new official with department "Water Supply"
2. Admin approves
3. Login as official
4. ✅ Should see "Department: Water Supply"
5. MLA assigns work order to "Water Supply"
6. ✅ Official should see the work order

---

## 📞 Still Having Issues?

Check:
- [ ] `department` attribute exists in `users` collection
- [ ] Attribute type is "String"
- [ ] Attribute is not required (optional)
- [ ] Existing officials have been updated with department value
- [ ] Department values match exactly (case-sensitive)

---

## 🎯 Why This Matters

**Without the attribute:**
- Code tries to save department → Appwrite rejects → Department not saved → Shows "Unknown"

**With the attribute:**
- Code tries to save department → Appwrite accepts → Department saved → Shows correctly

**The code is already correct - it just needs the database column to exist!**
