# ✅ Database Setup - Quick Summary

## 🎯 What You Need to Do in Appwrite

### 1️⃣ Create Collection: `officials`

**Purpose**: Store department official profiles

**Quick Setup**:
- Name: "Department Officials"
- Attributes: **11 total**
- Key fields: `name`, `email`, `department`, `district`, `status`
- Permissions: Read=Any, Create/Update=Users

### 2️⃣ Create Collection: `request_assignments`

**Purpose**: Track which official is assigned to which help request

**Quick Setup**:
- Name: "Request Assignments"  
- Attributes: **15 total**
- Key fields: `helpRequestId`, `officialId`, `status`, `assignmentNotes`
- Permissions: Read=Any, Create/Update=Users

---

## 📋 Detailed Attributes

### Collection 1: `officials` (11 attributes)

```
1.  userId          - String(255) - Required
2.  name            - String(255) - Required
3.  email           - String(255) - Required
4.  phone           - String(20)  - Optional
5.  department      - String(100) - Required ⭐
6.  designation     - String(255) - Optional
7.  district        - String(255) - Required
8.  state           - String(255) - Required
9.  status          - String(50)  - Required (default: ACTIVE)
10. approvedBy      - String(255) - Optional
11. approvedAt      - String(255) - Optional
```

### Collection 2: `request_assignments` (15 attributes)

```
1.  helpRequestId        - String(255)  - Required ⭐
2.  mlaId                - String(255)  - Required
3.  mlaName              - String(255)  - Required
4.  officialId           - String(255)  - Required ⭐
5.  officialName         - String(255)  - Required
6.  department           - String(100)  - Required
7.  assignedAt           - String(255)  - Required
8.  assignmentNotes      - String(2000) - Optional
9.  status               - String(50)   - Required (default: ASSIGNED)
10. officialNotes        - String(2000) - Optional
11. startedAt            - String(255)  - Optional
12. completedAt          - String(255)  - Optional
13. completionProof      - String(1000) - Optional
14. completionProofType  - String(50)   - Optional
15. completionProofId    - String(255)  - Optional
```

---

## 🔍 Required Indexes

### For `officials`:
1. `department` (key index)
2. `district` (key index)
3. `userId` (key index)

### For `request_assignments`:
1. `helpRequestId` (key index) ⭐ Most important
2. `officialId` (key index) ⭐ Most important
3. `mlaId` (key index)
4. `status` (key index)

---

## 📝 After Creating Collections

### Step 1: Copy Collection IDs
After creating each collection, copy the Collection ID from Appwrite.

### Step 2: Update `.env` File

Replace these placeholders with your actual Collection IDs:

```env
VITE_OFFICIALS_COLLECTION_ID="paste_your_officials_id_here"
VITE_REQUEST_ASSIGNMENTS_COLLECTION_ID="paste_your_assignments_id_here"
```

### Step 3: Restart Server
```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

## 🎨 Department Values (Use EXACT spelling)

When creating officials, the `department` field must be one of these:

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

## 📊 Status Values

### Official Status:
```
ACTIVE      - Currently working
INACTIVE    - Temporarily unavailable
SUSPENDED   - Suspended from duty
```

### Assignment Status:
```
ASSIGNED     - Newly assigned
IN_PROGRESS  - Official is working on it
COMPLETED    - Work finished
REJECTED     - Cannot be completed
```

---

## ✅ Verification Checklist

Before moving to next phase:

- [ ] Created `officials` collection in Appwrite
- [ ] Added all 11 attributes to `officials`
- [ ] Set permissions for `officials` (Read=Any, Create/Update=Users)
- [ ] Created 3 indexes for `officials`
- [ ] Copied `officials` Collection ID

- [ ] Created `request_assignments` collection in Appwrite
- [ ] Added all 15 attributes to `request_assignments`
- [ ] Set permissions for `request_assignments` (Read=Any, Create/Update=Users)
- [ ] Created 4 indexes for `request_assignments`
- [ ] Copied `request_assignments` Collection ID

- [ ] Updated `.env` file with both Collection IDs
- [ ] Restarted development server

---

## 🚀 What Happens Next

Once database is ready, I'll build:

### Phase 1 (Next):
1. ✅ Official Login Page
2. ✅ Official Dashboard
3. ✅ Enhanced MLA Response Modal (with assignment)
4. ✅ Official Update Modal

### Phase 2 (Later):
5. Assignment tracking in MLA dashboard
6. Completion proof upload
7. Performance metrics
8. Notifications

---

## 📞 Need Help?

If you encounter any issues:
1. Double-check attribute names (EXACT spelling matters)
2. Verify Collection IDs match in `.env`
3. Ensure indexes are created
4. Restart server after `.env` changes

---

**Files Created:**
- ✅ `DATABASE_SETUP_OFFICIALS.md` - Detailed setup guide
- ✅ `.env` - Updated with collection placeholders
- ✅ `src/constants/departmentConstants.js` - Department definitions
- ✅ `OFFICIAL_ASSIGNMENT_SYSTEM_DESIGN.md` - Overall system design

**Ready?** Let me know when collections are created! 🎉
