# 📋 Quick Copy-Paste Reference for Appwrite Setup

## Enum Values to Copy-Paste

### 1️⃣ Category Enum (13 values)
**Copy and paste these one by one when creating the `category` attribute:**

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

### 2️⃣ Priority Enum (4 values)
**Copy and paste for `priority` attribute:**

```
CRITICAL
HIGH
MEDIUM
LOW
```

---

### 3️⃣ Status Enum (5 values)
**Copy and paste for `status` attribute:**

```
PENDING
ACKNOWLEDGED
IN_PROGRESS
RESOLVED
REJECTED
```

---

### 4️⃣ Response Type Enum (4 values)
**Copy and paste for `responseType` attribute in mla_help_responses:**

```
ACKNOWLEDGED
IN_PROGRESS
RESOLVED
REJECTED
```

---

## 📊 Attribute Quick Reference Table

### `help_requests` Collection Attributes (23 total)

| # | Key | Type | Size | Required | Min | Max | Default | Array | Enum? |
|---|-----|------|------|----------|-----|-----|---------|-------|-------|
| 1 | state | String | 100 | ✅ | - | - | - | ❌ | - |
| 2 | district | String | 100 | ✅ | - | - | - | ❌ | - |
| 3 | mandal | String | 100 | ✅ | - | - | - | ❌ | - |
| 4 | village | String | 100 | ✅ | - | - | - | ❌ | - |
| 5 | category | Enum | - | ✅ | - | - | - | ❌ | 13 values ⬆️ |
| 6 | title | String | 200 | ✅ | - | - | - | ❌ | - |
| 7 | description | String | 2000 | ✅ | - | - | - | ❌ | - |
| 8 | affectedPopulation | Integer | - | ✅ | 10 | 100000 | 0 | ❌ | - |
| 9 | communityImpact | String | 1000 | ✅ | - | - | - | ❌ | - |
| 10 | priority | Enum | - | ✅ | - | - | MEDIUM | ❌ | 4 values ⬆️ |
| 11 | status | Enum | - | ✅ | - | - | PENDING | ❌ | 5 values ⬆️ |
| 12 | lat | Float | - | ✅ | -90 | 90 | - | ❌ | - |
| 13 | lng | Float | - | ✅ | -180 | 180 | - | ❌ | - |
| 14 | landmark | String | 200 | ❌ | - | - | - | ❌ | - |
| 15 | mediaURL | String | 500 | ❌ | - | - | - | ❌ | - |
| 16 | mediaType | String | 20 | ❌ | - | - | - | ❌ | - |
| 17 | mediaId | String | 100 | ❌ | - | - | - | ❌ | - |
| 18 | userId | String | 100 | ✅ | - | - | - | ❌ | - |
| 19 | reporterName | String | 100 | ✅ | - | - | - | ❌ | - |
| 20 | reporterPhone | String | 20 | ❌ | - | - | - | ❌ | - |
| 21 | reporterEmail | String | 100 | ❌ | - | - | - | ❌ | - |
| 22 | likes | Integer | - | ✅ | - | - | 0 | ❌ | - |
| 23 | likedBy | String | 100 | ❌ | - | - | - | ✅ YES | - |

---

### `mla_help_responses` Collection Attributes (10 total)

| # | Key | Type | Size | Required | Default | Enum? |
|---|-----|------|------|----------|---------|-------|
| 1 | helpRequestId | String | 100 | ✅ | - | - |
| 2 | mlaId | String | 100 | ✅ | - | - |
| 3 | mlaName | String | 100 | ✅ | - | - |
| 4 | mlaConstituency | String | 100 | ❌ | - | - |
| 5 | responseType | Enum | - | ✅ | - | 4 values ⬆️ |
| 6 | message | String | 2000 | ✅ | - | - |
| 7 | actionTaken | String | 1000 | ❌ | - | - |
| 8 | estimatedDays | Integer | - | ❌ | - | - |
| 9 | followUpRequired | Boolean | - | ✅ | false | - |
| 10 | followUpNotes | String | 500 | ❌ | - | - |

---

## 🔍 Index Names and Configuration

### For `help_requests`:

```
Index 1:
- Key: userId_idx
- Type: key
- Attribute: userId
- Order: ASC

Index 2:
- Key: district_idx
- Type: key
- Attribute: district
- Order: ASC

Index 3:
- Key: status_idx
- Type: key
- Attribute: status
- Order: ASC

Index 4:
- Key: category_idx
- Type: key
- Attribute: category
- Order: ASC

Index 5:
- Key: created_idx
- Type: key
- Attribute: $createdAt
- Order: DESC
```

### For `mla_help_responses`:

```
Index 1:
- Key: helpRequestId_idx
- Type: key
- Attribute: helpRequestId
- Order: ASC

Index 2:
- Key: mlaId_idx
- Type: key
- Attribute: mlaId
- Order: ASC
```

---

## 🎯 Step-by-Step Checklist

### ✅ Collection: help_requests

#### Attributes (23 total):
- [ ] 1. state (String, 100, Required)
- [ ] 2. district (String, 100, Required)
- [ ] 3. mandal (String, 100, Required)
- [ ] 4. village (String, 100, Required)
- [ ] 5. category (Enum, 13 values, Required)
- [ ] 6. title (String, 200, Required)
- [ ] 7. description (String, 2000, Required)
- [ ] 8. affectedPopulation (Integer, Min: 10, Required) ⚠️
- [ ] 9. communityImpact (String, 1000, Required) ⚠️
- [ ] 10. priority (Enum, 4 values, Required, Default: MEDIUM)
- [ ] 11. status (Enum, 5 values, Required, Default: PENDING)
- [ ] 12. lat (Float, Min: -90, Max: 90, Required)
- [ ] 13. lng (Float, Min: -180, Max: 180, Required)
- [ ] 14. landmark (String, 200, NOT required)
- [ ] 15. mediaURL (String, 500, NOT required)
- [ ] 16. mediaType (String, 20, NOT required)
- [ ] 17. mediaId (String, 100, NOT required)
- [ ] 18. userId (String, 100, Required)
- [ ] 19. reporterName (String, 100, Required)
- [ ] 20. reporterPhone (String, 20, NOT required)
- [ ] 21. reporterEmail (String, 100, NOT required)
- [ ] 22. likes (Integer, Required, Default: 0)
- [ ] 23. likedBy (String, 100, NOT required, **ARRAY: YES**)

#### Indexes (5 total):
- [ ] userId_idx
- [ ] district_idx
- [ ] status_idx
- [ ] category_idx
- [ ] created_idx

#### Permissions:
- [ ] All users: Read, Create, Update

---

### ✅ Collection: mla_help_responses

#### Attributes (10 total):
- [ ] 1. helpRequestId (String, 100, Required)
- [ ] 2. mlaId (String, 100, Required)
- [ ] 3. mlaName (String, 100, Required)
- [ ] 4. mlaConstituency (String, 100, NOT required)
- [ ] 5. responseType (Enum, 4 values, Required)
- [ ] 6. message (String, 2000, Required)
- [ ] 7. actionTaken (String, 1000, NOT required)
- [ ] 8. estimatedDays (Integer, NOT required)
- [ ] 9. followUpRequired (Boolean, Required, Default: false)
- [ ] 10. followUpNotes (String, 500, NOT required)

#### Indexes (2 total):
- [ ] helpRequestId_idx
- [ ] mlaId_idx

#### Permissions:
- [ ] All users: Read, Create

---

## 🚨 Important Notes

### ⚠️ Critical Validation Fields:
```
affectedPopulation:
- Type: Integer
- Required: YES
- Min: 10 ← MUST SET THIS!
- Max: 100000
- This prevents personal issues (forces minimum 10 people)

communityImpact:
- Type: String
- Size: 1000
- Required: YES
- This forces users to describe community impact
```

### 📌 Array Field:
```
likedBy:
- Type: String
- Array: YES ← IMPORTANT!
- This stores user IDs who liked the request
```

---

## 🔗 Your Environment Variables

After creating collections, update your `.env`:

```env
# If using existing collection ID:
VITE_HELP_REQUESTS_COLLECTION_ID="help_request"

# Or use the new one you create:
VITE_HELP_REQUESTS_COLLECTION_ID="help_requests"

# Add this new one:
VITE_MLA_HELP_RESPONSES_COLLECTION_ID="mla_help_responses"
```

---

## 🎯 Quick Links

**Appwrite Console:**
https://cloud.appwrite.io/console

**Your Project:**
- Project ID: `694f68cd003270ab126c`
- Database ID: `694f69ed001e598ac21e`

**Direct Link to Database:**
https://cloud.appwrite.io/console/project-694f68cd003270ab126c/databases/database-694f69ed001e598ac21e

---

## ✅ Verification

After creating everything, verify:

### help_requests:
- ✅ 23 attributes visible
- ✅ 5 indexes created
- ✅ Permissions set for All Users (Read, Create, Update)

### mla_help_responses:
- ✅ 10 attributes visible
- ✅ 2 indexes created
- ✅ Permissions set for All Users (Read, Create)

---

**Once done, come back and I'll help you create the service files!** 🚀
