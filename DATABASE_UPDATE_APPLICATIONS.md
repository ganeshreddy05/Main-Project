# 🔧 Database Update - Support Both MLAs and Department Officials

## 📋 Update the `mla_applications` Collection

To support both MLA and Department Official applications in one collection, add these new attributes:

---

## New Attributes to Add

| # | Attribute Name | Type | Size | Required | Default | Description |
|---|----------------|------|------|----------|---------|-------------|
| 1 | `officialType` | String | 50 | ❌ No | MLA | Either "MLA" or "DEPARTMENT_OFFICIAL" |
| 2 | `department` | String | 100 | ❌ No | - | Department (only for officials) |
| 3 | `designation` | String | 255 | ❌ No | - | Job title (only for officials) |

**Note**: Since these are optional, existing MLA applications won't break!

---

## Alternative (Recommended): Create Separate Collection

For better organization, create a new collection: `official_applications`

### Collection: `official_applications`

| # | Attribute | Type | Size | Required | Description |
|---|-----------|------|------|----------|-------------|
| 1 | applicationId | String | 255 | ✅ Yes | Unique application ID |
| 2 | userId | String | 255 | ❌ No | Will be filled after approval |
| 3 | officialType | String | 50 | ✅ Yes | MLA or DEPARTMENT_OFFICIAL |
| 4 | name | String | 255 | ✅ Yes | Full name |
| 5 | email | String | 255 | ✅ Yes | Email address |
| 6 | phone | String | 20 | ✅ Yes | Phone number |
| 7 | state | String | 255 | ✅ Yes | State |
| 8 | district | String | 255 | ✅ Yes | District/Constituency |
| 9 | department | String | 100 | ❌ No | Department (for officials) |
| 10 | designation | String | 255 | ❌ No | Job title (for officials) |
| 11 | partyName | String | 255 | ❌ No | Political party (for MLAs) |
| 12 | govtIdProof | String | 1000 | ✅ Yes | ID proof URL |
| 13 | verificationStatus | String | 50 | ✅ Yes | pending/approved/rejected |
| 14 | appliedAt | String | 255 | ✅ Yes | Application timestamp |
| 15 | approvedBy | String | 255 | ❌ No | Admin who approved |
| 16 | approvedAt | String | 255 | ❌ No | Approval timestamp |

**Permissions:**
- Read: Users with role "admin"
- Create: Any (public can apply)
- Update: Users with role "admin"
- Delete: Users with role "admin"

---

## 🎯 Quick Decision

### Option 1: Update Existing Collection
✅ **Pros**: Simpler, no new collection needed
❌ **Cons**: Mixed data, harder to manage

### Option 2: Create New Collection (Recommended)
✅ **Pros**: Clean separation, better organization
✅ **Pros**: Can have different approval workflows
❌ **Cons**: One extra collection

**My Recommendation**: Use **Option 1** for simplicity. Just add 3 new optional attributes to `mla_applications`.

---

## ⚙️ Implementation Steps

### If Using Option 1 (Update Existing):

1. Go to Appwrite → `mla_applications` collection
2. Add these 3 new attributes:
   - `officialType` (String, 50, optional, default: "MLA")
   - `department` (String, 100, optional)
   - `designation` (String, 255, optional)
3. Done! No code changes needed.

### If Using Option 2 (New Collection):

1. Create new collection `official_applications`
2. Add all 16 attributes as listed above
3. Update `.env`:
   ```env
   VITE_OFFICIAL_APPLICATIONS_COLLECTION_ID="your_collection_id"
   ```
4. Update `GovernmentOfficialRegister.jsx` to use new collection

---

## 📝 Environment Variable

If creating new collection, add to `.env`:

```env
# Government Officials Applications
VITE_OFFICIAL_APPLICATIONS_COLLECTION_ID="official_applications"
```

Replace with actual Collection ID after creating in Appwrite.

---

✅ **Done!** Your unified registration system is ready!
