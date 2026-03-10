# 🗄️ Help Requests Database Setup Guide

## Your Appwrite Details
- **Project ID**: `694f68cd003270ab126c`
- **Endpoint**: `https://sgp.cloud.appwrite.io/v1`
- **Database ID**: `694f69ed001e598ac21e`

---

## 📋 Collections to Create

You need to create **2 new collections**:

1. ✅ **`help_requests`** - Main collection for help requests
2. ✅ **`mla_help_responses`** - MLA responses to help requests

**Note**: I see you already have `VITE_HELP_REQUESTS_COLLECTION_ID="help_request"` in your .env file. We'll use that or create a new one with proper schema.

---

## 🎯 STEP-BY-STEP GUIDE

### Step 1: Open Appwrite Console

1. Go to: **https://cloud.appwrite.io/console**
2. Login to your account
3. Select project: **"Turn the Wheel"**
4. Click on **"Databases"** in left sidebar
5. Click on your database: **`694f69ed001e598ac21e`**

---

### Step 2: Create/Update `help_requests` Collection

#### Option A: If collection `help_request` already exists:
1. Click on the existing `help_request` collection
2. Go to **"Attributes"** tab
3. **Check if it has the required attributes** (see list below)
4. If missing attributes, add them one by one

#### Option B: If creating fresh:
1. Click **"Create Collection"** button
2. **Collection ID**: `help_requests` (or keep existing `help_request`)
3. **Name**: `Help Requests`
4. Click **"Create"**

---

### Step 3: Add Attributes to `help_requests`

Click **"Create Attribute"** for each of these:

---

#### 📍 **Geographic Attributes**

| # | Attribute Key | Type | Size | Required | Default | Array |
|---|--------------|------|------|----------|---------|-------|
| 1 | `state` | String | 100 | ✅ Yes | - | ❌ No |
| 2 | `district` | String | 100 | ✅ Yes | - | ❌ No |
| 3 | `mandal` | String | 100 | ✅ Yes | - | ❌ No |
| 4 | `village` | String | 100 | ✅ Yes | - | ❌ No |

**How to create:**
```
1. Click "Create Attribute" → Select "String"
2. Key: state
3. Size: 100
4. Required: YES
5. Array: NO
6. Click "Create"

Repeat for district, mandal, village
```

---

#### 📝 **Issue Details Attributes**

| # | Attribute Key | Type | Size | Required | Default | Array | Enum Values |
|---|--------------|------|------|----------|---------|-------|-------------|
| 5 | `category` | Enum | - | ✅ Yes | - | ❌ No | See below ⬇️ |
| 6 | `title` | String | 200 | ✅ Yes | - | ❌ No | - |
| 7 | `description` | String | 2000 | ✅ Yes | - | ❌ No | - |

**For `category` Enum, add these values:**
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

**How to create category enum:**
```
1. Click "Create Attribute" → Select "Enum"
2. Key: category
3. Elements: Add each value above (13 total)
4. Required: YES
5. Default: Leave empty
6. Click "Create"
```

---

#### ⚠️ **COMMUNITY VALIDATION Attributes** (NEW - Critical!)

| # | Attribute Key | Type | Size | Required | Default | Array |
|---|--------------|------|------|----------|---------|-------|
| 8 | `affectedPopulation` | Integer | - | ✅ Yes | 0 | ❌ No |
| 9 | `communityImpact` | String | 1000 | ✅ Yes | - | ❌ No |

**How to create:**
```
For affectedPopulation:
1. Click "Create Attribute" → Select "Integer"
2. Key: affectedPopulation
3. Required: YES
4. Default: 0
5. Min: 10 (IMPORTANT - enforces minimum 10 people)
6. Max: 100000
7. Click "Create"

For communityImpact:
1. Click "Create Attribute" → Select "String"
2. Key: communityImpact
3. Size: 1000
4. Required: YES
5. Click "Create"
```

---

#### 🎯 **Priority & Status Attributes**

| # | Attribute Key | Type | Required | Default | Enum Values |
|---|--------------|------|----------|---------|-------------|
| 10 | `priority` | Enum | ✅ Yes | MEDIUM | See below ⬇️ |
| 11 | `status` | Enum | ✅ Yes | PENDING | See below ⬇️ |

**For `priority` Enum:**
```
CRITICAL
HIGH
MEDIUM
LOW
```

**For `status` Enum:**
```
PENDING
ACKNOWLEDGED
IN_PROGRESS
RESOLVED
REJECTED
```

---

#### 📍 **Location Attributes**

| # | Attribute Key | Type | Size | Required | Default |
|---|--------------|------|------|----------|---------|
| 12 | `lat` | Float | - | ✅ Yes | - |
| 13 | `lng` | Float | - | ✅ Yes | - |
| 14 | `landmark` | String | 200 | ❌ No | - |

**How to create:**
```
For lat and lng:
1. Click "Create Attribute" → Select "Float"
2. Key: lat (then lng)
3. Required: YES
4. Min: -90 (for lat) or -180 (for lng)
5. Max: 90 (for lat) or 180 (for lng)
6. Click "Create"

For landmark:
1. String type, size 200, NOT required
```

---

#### 📷 **Media Attributes**

| # | Attribute Key | Type | Size | Required | Default |
|---|--------------|------|------|----------|---------|
| 15 | `mediaURL` | String | 500 | ❌ No | - |
| 16 | `mediaType` | String | 20 | ❌ No | - |
| 17 | `mediaId` | String | 100 | ❌ No | - |

**All NOT required** (optional photo/video)

---

#### 👤 **User Information Attributes**

| # | Attribute Key | Type | Size | Required | Default | Array |
|---|--------------|------|------|----------|---------|-------|
| 18 | `userId` | String | 100 | ✅ Yes | - | ❌ No |
| 19 | `reporterName` | String | 100 | ✅ Yes | - | ❌ No |
| 20 | `reporterPhone` | String | 20 | ❌ No | - | ❌ No |
| 21 | `reporterEmail` | String | 100 | ❌ No | - | ❌ No |

---

#### ❤️ **Engagement Attributes**

| # | Attribute Key | Type | Required | Default | Array |
|---|--------------|------|----------|---------|-------|
| 22 | `likes` | Integer | ✅ Yes | 0 | ❌ No |
| 23 | `likedBy` | String | 100 | ❌ No | - | ✅ YES |

**For `likedBy`:**
```
1. Click "Create Attribute" → Select "String"
2. Key: likedBy
3. Size: 100
4. Required: NO
5. Array: YES ← IMPORTANT!
6. Click "Create"
```

---

### Step 4: Create Indexes for `help_requests`

After all attributes are created, go to **"Indexes"** tab:

Click **"Create Index"** for each:

| Index Key | Type | Attributes | Order |
|-----------|------|------------|-------|
| `userId_idx` | key | userId | ASC |
| `district_idx` | key | district | ASC |
| `status_idx` | key | status | ASC |
| `category_idx` | key | category | ASC |
| `created_idx` | key | $createdAt | DESC |

**How to create:**
```
1. Click "Create Index"
2. Key: userId_idx
3. Type: key
4. Attributes: Select "userId"
5. Order: ASC
6. Click "Create"

Repeat for each index
```

---

### Step 5: Set Permissions for `help_requests`

Go to **"Settings"** tab → **"Permissions"**

Click **"Add Role"**:

| Role | Permissions |
|------|-------------|
| **All users** | ✅ Read |
| **All users** | ✅ Create |
| **All users** | ✅ Update |

**How to configure:**
```
1. Click "Add Role"
2. Select "All users"
3. Check: Read, Create, Update
4. Click "Add"
```

**Note**: Individual document permissions will be set in code for delete operations.

---

## 🎯 STEP 6: Create `mla_help_responses` Collection

1. Go back to your Database
2. Click **"Create collection"**
3. **Collection ID**: `mla_help_responses`
4. **Name**: `MLA Help Responses`
5. Click **"Create"**

---

### Step 7: Add Attributes to `mla_help_responses`

| # | Attribute Key | Type | Size | Required | Default | Enum Values |
|---|--------------|------|------|----------|---------|-------------|
| 1 | `helpRequestId` | String | 100 | ✅ Yes | - | - |
| 2 | `mlaId` | String | 100 | ✅ Yes | - | - |
| 3 | `mlaName` | String | 100 | ✅ Yes | - | - |
| 4 | `mlaConstituency` | String | 100 | ❌ No | - | - |
| 5 | `responseType` | Enum | - | ✅ Yes | - | See below ⬇️ |
| 6 | `message` | String | 2000 | ✅ Yes | - | - |
| 7 | `actionTaken` | String | 1000 | ❌ No | - | - |
| 8 | `estimatedDays` | Integer | - | ❌ No | - | - |
| 9 | `followUpRequired` | Boolean | - | ✅ Yes | false | - |
| 10 | `followUpNotes` | String | 500 | ❌ No | - | - |

**For `responseType` Enum:**
```
ACKNOWLEDGED
IN_PROGRESS
RESOLVED
REJECTED
```

---

### Step 8: Create Index for `mla_help_responses`

| Index Key | Type | Attributes | Order |
|-----------|------|------------|-------|
| `helpRequestId_idx` | key | helpRequestId | ASC |
| `mlaId_idx` | key | mlaId | ASC |

---

### Step 9: Set Permissions for `mla_help_responses`

| Role | Permissions |
|------|-------------|
| **All users** | ✅ Read |
| **All users** | ✅ Create |

---

## ✅ Step 10: Update .env File

After creating both collections, copy their Collection IDs from Appwrite and update your `.env`:

```env
# Update these lines in your .env file:
VITE_HELP_REQUESTS_COLLECTION_ID="help_requests"
VITE_MLA_HELP_RESPONSES_COLLECTION_ID="mla_help_responses"
```

**Or if Appwrite generated different IDs, use those instead!**

---

## 📸 Quick Visual Checklist

### ✅ `help_requests` Collection Should Have:
- [x] 23 attributes total
- [x] 3 enums (category, priority, status)
- [x] 2 validation fields (affectedPopulation, communityImpact)
- [x] 1 array field (likedBy)
- [x] 5 indexes
- [x] Permissions set for All Users

### ✅ `mla_help_responses` Collection Should Have:
- [x] 10 attributes total
- [x] 1 enum (responseType)
- [x] 1 boolean (followUpRequired)
- [x] 2 indexes
- [x] Permissions set for All Users

---

## 🚨 Common Mistakes to Avoid

❌ **Don't skip validation fields!**
   - `affectedPopulation` (with min: 10)
   - `communityImpact`
   These are CRITICAL for preventing spam!

❌ **Don't forget array flag for `likedBy`**
   - Must be Array: YES

❌ **Don't forget enum values!**
   - category: 13 values
   - priority: 4 values
   - status: 5 values
   - responseType: 4 values

❌ **Don't forget indexes!**
   - They make queries faster

---

## 🎉 After Completion

Once you're done:
1. ✅ Both collections created
2. ✅ All attributes added
3. ✅ Indexes created
4. ✅ Permissions set
5. ✅ .env file updated

**Come back and I'll help you create the service files!** 🚀

---

## 🆘 Need Help?

If you get stuck:
1. Take a screenshot of the error
2. Check if all enum values are spelled correctly
3. Make sure required fields are marked as required
4. Verify indexes are created

**I'm here to help!** 💪
