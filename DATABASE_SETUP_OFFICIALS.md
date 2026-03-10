# 🗄️ Database Setup Guide - Officials Assignment System

## 📋 Collections to Create

You need to create **2 new collections** in Appwrite:

1. **officials** - Department official profiles
2. **request_assignments** - Assignment tracking

---

## 🚀 Step-by-Step Setup

### Collection 1: `officials`

#### Step 1: Create Collection
1. Go to Appwrite Console → Databases → Your Database
2. Click **"Create Collection"**
3. **Name**: `Department Officials`
4. **Collection ID**: `officials` (or auto-generate)

#### Step 2: Add Attributes

Click **"Create Attribute"** for each field below:

| # | Attribute Name | Type | Size | Required | Default | Array |
|---|----------------|------|------|----------|---------|-------|
| 1 | `userId` | String | 255 | ✅ Yes | - | ❌ No |
| 2 | `name` | String | 255 | ✅ Yes | - | ❌ No |
| 3 | `email` | String | 255 | ✅ Yes | - | ❌ No |
| 4 | `phone` | String | 20 | ❌ No | - | ❌ No |
| 5 | `department` | String | 100 | ✅ Yes | - | ❌ No |
| 6 | `designation` | String | 255 | ❌ No | - | ❌ No |
| 7 | `district` | String | 255 | ✅ Yes | - | ❌ No |
| 8 | `state` | String | 255 | ✅ Yes | - | ❌ No |
| 9 | `status` | String | 50 | ✅ Yes | ACTIVE | ❌ No |
| 10 | `approvedBy` | String | 255 | ❌ No | - | ❌ No |
| 11 | `approvedAt` | String | 255 | ❌ No | - | ❌ No |

#### Step 3: Set Permissions
1. Go to **Settings** tab
2. Under **Permissions**:
   - **Read**: Select "Any" (so MLAs can see officials)
   - **Create**: Select "Users" (initially, can be restricted later)
   - **Update**: Select "Users"
   - **Delete**: None (only via backend/admin)

#### Step 4: Create Indexes
1. Go to **Indexes** tab
2. Create these indexes:

**Index 1:**
- **Key**: `department`
- **Type**: Key
- **Attributes**: `department` (ASC)

**Index 2:**
- **Key**: `district`
- **Type**: Key
- **Attributes**: `district` (ASC)

**Index 3:**
- **Key**: `userId`
- **Type**: Key
- **Attributes**: `userId` (ASC)

#### Step 5: Copy Collection ID
- Copy the **Collection ID** from the top of the page
- Save it for the `.env` file

---

### Collection 2: `request_assignments`

#### Step 1: Create Collection
1. Click **"Create Collection"**
2. **Name**: `Request Assignments`
3. **Collection ID**: `request_assignments` (or auto-generate)

#### Step 2: Add Attributes

Click **"Create Attribute"** for each field below:

| # | Attribute Name | Type | Size | Required | Default | Array |
|---|----------------|------|------|----------|---------|-------|
| 1 | `helpRequestId` | String | 255 | ✅ Yes | - | ❌ No |
| 2 | `mlaId` | String | 255 | ✅ Yes | - | ❌ No |
| 3 | `mlaName` | String | 255 | ✅ Yes | - | ❌ No |
| 4 | `officialId` | String | 255 | ✅ Yes | - | ❌ No |
| 5 | `officialName` | String | 255 | ✅ Yes | - | ❌ No |
| 6 | `department` | String | 100 | ✅ Yes | - | ❌ No |
| 7 | `assignedAt` | String | 255 | ✅ Yes | - | ❌ No |
| 8 | `assignmentNotes` | String | 2000 | ❌ No | - | ❌ No |
| 9 | `status` | String | 50 | ✅ Yes | ASSIGNED | ❌ No |
| 10 | `officialNotes` | String | 2000 | ❌ No | - | ❌ No |
| 11 | `startedAt` | String | 255 | ❌ No | - | ❌ No |
| 12 | `completedAt` | String | 255 | ❌ No | - | ❌ No |
| 13 | `completionProof` | String | 1000 | ❌ No | - | ❌ No |
| 14 | `completionProofType` | String | 50 | ❌ No | - | ❌ No |
| 15 | `completionProofId` | String | 255 | ❌ No | - | ❌ No |

#### Step 3: Set Permissions
1. Go to **Settings** tab
2. Under **Permissions**:
   - **Read**: Select "Any" (so citizens can see who's assigned)
   - **Create**: Select "Users" (MLAs can create assignments)
   - **Update**: Select "Users" (Officials can update status)
   - **Delete**: None

#### Step 4: Create Indexes
1. Go to **Indexes** tab
2. Create these indexes:

**Index 1:**
- **Key**: `helpRequestId`
- **Type**: Key
- **Attributes**: `helpRequestId` (ASC)

**Index 2:**
- **Key**: `officialId`
- **Type**: Key
- **Attributes**: `officialId` (ASC)

**Index 3:**
- **Key**: `mlaId`
- **Type**: Key
- **Attributes**: `mlaId` (ASC)

**Index 4:**
- **Key**: `status`
- **Type**: Key
- **Attributes**: `status` (ASC)

#### Step 5: Copy Collection ID
- Copy the **Collection ID** from the top of the page
- Save it for the `.env` file

---

## 📝 Update .env File

After creating both collections, add these lines to your `.env` file:

```env
# Officials Assignment System
VITE_OFFICIALS_COLLECTION_ID="your_officials_collection_id_here"
VITE_REQUEST_ASSIGNMENTS_COLLECTION_ID="your_request_assignments_collection_id_here"
```

Replace the placeholder values with the actual Collection IDs you copied.

---

## ✅ Verification Checklist

Before proceeding, verify:

- [ ] Created `officials` collection with 11 attributes
- [ ] Created `request_assignments` collection with 15 attributes
- [ ] Set proper permissions on both collections
- [ ] Created all required indexes
- [ ] Copied both Collection IDs
- [ ] Updated `.env` file with Collection IDs
- [ ] Restarted development server (`npm run dev`)

---

## 📊 Department Values Reference

When creating officials, use these department values (EXACT spelling):

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

---

## 🎯 Assignment Status Values

The `status` field in `request_assignments` can have these values:

```
ASSIGNED       - Newly assigned to official
IN_PROGRESS    - Official is working on it
COMPLETED      - Work finished
REJECTED       - Cannot be completed
```

---

## 👥 Creating Test Officials (Optional)

After setting up collections, you can manually create test officials:

### Example Official 1:
```json
{
  "userId": "create_user_first_in_auth",
  "name": "Ravi Kumar",
  "email": "ravi.water@example.com",
  "phone": "+91 9876543210",
  "department": "WATER_SUPPLY",
  "designation": "Assistant Engineer",
  "district": "Hyderabad",
  "state": "Telangana",
  "status": "ACTIVE",
  "approvedBy": "admin",
  "approvedAt": "2026-02-11T16:45:00Z"
}
```

### Example Official 2:
```json
{
  "userId": "create_user_first_in_auth",
  "name": "Sita Devi",
  "email": "sita.electricity@example.com",
  "phone": "+91 9876543211",
  "department": "ELECTRICITY",
  "designation": "Junior Engineer",
  "district": "Hyderabad",
  "state": "Telangana",
  "status": "ACTIVE",
  "approvedBy": "admin",
  "approvedAt": "2026-02-11T16:45:00Z"
}
```

---

## 🔐 User Role Setup

You also need to add the "official" role to your user system.

### In Appwrite Auth:

When creating officials' accounts:
1. Go to **Auth** → **Users**
2. Click **"Create User"**
3. Fill in details
4. After creation, you'll need to store their role in your `users` collection

The `users` collection should have a `role` field that accepts:
- `citizen`
- `mla`
- `admin`
- **`official`** (NEW)

---

## 🚨 Important Notes

1. **Collection IDs**: Use the actual IDs from Appwrite, not the names
2. **Environment Variables**: Must restart dev server after updating `.env`
3. **Permissions**: Start with "Any" for Read, can be restricted later
4. **Indexes**: Critical for performance when filtering assignments
5. **Testing**: Create at least 1-2 test officials to verify the system

---

## ⚡ Quick Setup Checklist

```
□ Step 1: Create 'officials' collection (11 attributes)
□ Step 2: Set permissions for 'officials'
□ Step 3: Create indexes for 'officials'
□ Step 4: Copy 'officials' Collection ID

□ Step 5: Create 'request_assignments' collection (15 attributes)
□ Step 6: Set permissions for 'request_assignments'
□ Step 7: Create indexes for 'request_assignments'
□ Step 8: Copy 'request_assignments' Collection ID

□ Step 9: Update .env file with both Collection IDs
□ Step 10: Restart development server
□ Step 11: Create test official accounts (optional)
```

---

## 🎉 Next Steps

Once you've completed the database setup:

1. ✅ Update `.env` with Collection IDs
2. ✅ Restart dev server
3. ✅ Let me know, and I'll build:
   - Official Login page
   - Official Dashboard
   - Enhanced MLA Assignment feature
   - Official Update Modal

---

**Ready to proceed?** Let me know when the database is set up! 🚀
