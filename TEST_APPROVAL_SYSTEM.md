# ✅ Government Official Approval - Test Checklist

## 🧪 How to Test the Complete System

### Test 1: Register as Department Official

1. **Open browser** and go to: `http://localhost:5173/register`

2. **Click "Government Official"** (the green button with briefcase icon)

3. **Fill in the form**:
   - Name: `Test Official`
   - Email: `testofficial@example.com`
   - Phone: `+91-9876543210`
   - State: Select any state (e.g., `Telangana`)
   - District: Select any district (e.g., `Hyderabad`)
   - Department: Select `WATER_SUPPLY` (or any other)
   - Designation: `Assistant Engineer` (optional)
   - Government ID: Upload any image/PDF file
   - Password: `Test@12345`
   - Confirm Password: `Test@12345`

4. **Click Submit**

5. **Verify success screen** shows:
   - ✅ "Application Submitted!"
   - ✅ Message about waiting for admin approval
   - ✅ "Back to Home" button

---

### Test 2: Admin Reviews Application

1. **Login as Admin**:
   - Go to: `http://localhost:5173/admin/login`
   - Use your admin credentials

2. **Navigate to Applications**:
   - Click **"MLA Applications"** in the left sidebar

3. **Verify the applications page** shows:
   - ✅ Stats cards: Total, Pending, Approved, Rejected
   - ✅ Search bar
   - ✅ Status filter dropdown
   - ✅ Applications table

4. **Find the test application**:
   - Look for "Test Official" in the table
   - Verify it shows:
     - ✅ Green "Official" badge (not MLA badge)
     - ✅ Department: "💧 Water Supply"
     - ✅ Designation: "Assistant Engineer"
     - ✅ Status: "Pending" with yellow badge

5. **Click "Review" button**

6. **Verify modal shows**:
   - ✅ Personal Information section
   - ✅ Location Information section
   - ✅ Department Information section (shows department + designation)
   - ✅ Government ID Proof link (clickable)
   - ✅ Application Timeline
   - ✅ "Reject Application" button (red)
   - ✅ "Approve & Create Account" button (green)

7. **Click ID Proof link**:
   - ✅ Verify document opens in new tab

8. **Click "Approve & Create Account"**

9. **Verify alert shows**:
   - ✅ "Application approved!"
   - ✅ Shows login path: `/login`
   - ✅ Shows email and password info

---

### Test 3: Verify User Created Correctly

1. **Still in Admin Dashboard**, click **"Users"** in sidebar

2. **Verify stats show**:
   - ✅ 5 stat cards displayed
   - ✅ "Officials" card shows count: 1

3. **Filter by Officials**:
   - Click the filter dropdown
   - Select **"Govt Officials"**

4. **Verify the test user appears**:
   - ✅ Name: "Test Official"
   - ✅ Email: "testofficial@example.com"
   - ✅ Role badge: Green "GOVT OFFICIAL"
   - ✅ District: "Hyderabad"
   - ✅ Status: Green "Active"

5. **Click "View Details" (eye icon)**

6. **Verify modal shows all information**:
   - ✅ All personal details
   - ✅ Location information
   - ✅ Account information

---

### Test 4: Verify Application Status Updated

1. **Go back to "MLA Applications"**

2. **Filter by "Approved"**

3. **Verify the test application**:
   - ✅ Shows green "Approved" badge
   - ✅ Still shows "Official" type badge

4. **Click "Review"** on the approved application

5. **Verify modal shows**:
   - ✅ Green status banner
   - ✅ All application details
   - ✅ NO approve/reject buttons (since already approved)

---

### Test 5: Test Filtering and Search

#### In MLA Applications:

1. **Test Status Filter**:
   - ✅ "All Status" - shows all applications
   - ✅ "Pending" - shows only pending
   - ✅ "Approved" - shows only approved
   - ✅ "Rejected" - shows only rejected

2. **Test Search**:
   - Search "Test Official" - ✅ finds the application
   - Search "testofficial@example.com" - ✅ finds the application
   - Search "Hyderabad" - ✅ finds the application
   - Search "Water" - ✅ finds the application

#### In Users Page:

1. **Test Role Filter**:
   - ✅ "All Roles" - shows all users
   - ✅ "Citizens" - shows only citizens
   - ✅ "MLAs" - shows only MLAs
   - ✅ **"Govt Officials"** - shows only officials ✨
   - ✅ "Admins" - shows only admins

2. **Test Search**:
   - Search "Test Official" - ✅ finds the user
   - Search "testofficial@example.com" - ✅ finds the user
   - Search "Hyderabad" - ✅ finds the user

---

### Test 6: Visual Verification

#### Check Color Coding:

**MLA Applications Page**:
- ✅ MLA applications show purple "MLA" badge
- ✅ Official applications show green "Official" badge
- ✅ Pending status: yellow badge
- ✅ Approved status: green badge
- ✅ Rejected status: red badge

**Users Page**:
- ✅ Citizens: blue "CITIZEN" badge
- ✅ MLAs: purple "MLA" badge
- ✅ **Officials: green "GOVT OFFICIAL" badge** ✨
- ✅ Admins: red "ADMIN" badge

**Stats Cards**:
- ✅ All 5 cards display properly
- ✅ Icons show correctly
- ✅ Numbers are accurate

---

### Test 7: Dashboard Home

1. **Click "Dashboard"** in sidebar

2. **Verify stats show**:
   - ✅ Total Users card
   - ✅ Subtext shows: "X Citizens, Y MLAs, **Z Officials**" ✨
   - ✅ Road Reports card
   - ✅ Pending MLA Applications card (count includes officials)
   - ✅ Resolution Rate card

3. **Verify Quick Actions**:
   - ✅ "Manage Users" card
   - ✅ "Review MLAs" card shows pending count
   - ✅ "View Reports" card

---

## 🎯 Expected Results Summary

After all tests, you should see:

### ✅ Registration:
- Government officials can register with department info
- Applications are created as pending

### ✅ Admin Review:
- All applications visible in admin dashboard
- Both MLAs and Officials shown with different badges
- Department info displayed for officials
- Can approve/reject applications

### ✅ Approval Process:
- **Correctly creates users with role: "official"** ✨
- Stores department and designation
- Updates application status

### ✅ User Management:
- Officials counted separately
- Filter works
- Badge shows correctly
- Search works

### ✅ Statistics:
- All dashboards show correct counts
- Breakdowns include officials

---

## 🐛 What Was Fixed

The critical bug that was fixed:

**BEFORE**: All approved officials got `role: "mla"`
**AFTER**: Officials get `role: "official"` ✅

This ensures:
- ✅ Correct categorization
- ✅ Proper filtering
- ✅ Accurate statistics
- ✅ Department info stored
- ✅ Separate badge display

---

## 📸 Screenshot Checklist

Take screenshots of:
1. ✅ Registration form with "Government Official" selected
2. ✅ MLA Applications page showing official with green badge
3. ✅ Application detail modal showing department info
4. ✅ Users page with 5 stat cards
5. ✅ Users page filtered by "Govt Officials"
6. ✅ User detail showing green "GOVT OFFICIAL" badge
7. ✅ Dashboard home showing officials in breakdown

---

## ✅ Success Criteria

All tests pass if:
- ✅ Can register as government official
- ✅ Application appears in admin dashboard
- ✅ Shows as "Official" type (not MLA)
- ✅ Shows department information
- ✅ Admin can approve
- ✅ **User created with role: "official"** ✨
- ✅ Appears in users list with correct badge
- ✅ Can be filtered separately
- ✅ Stats show officials count
- ✅ All searches and filters work

**If all checkboxes are ticked, the system is working perfectly!** 🎉
