# 🚀 Implementation Plan: MLA Department Assignment System

## Phase 1: MLA Assigns Work to Department ✅ START HERE

### Step 1.1: Update MLA Road Reports View
**Goal**: Add "Assign to Department" button to road report cards

**Files to Modify**:
- `src/Pages/MLA/MLARoadReports.jsx` (or wherever MLA views road reports)

**What to Add**:
- ✅ "Assign to Department" button on each road report card
- ✅ Show current assignment if already assigned
- ✅ Disable button if already assigned

---

### Step 1.2: Create Assignment Modal Component
**Goal**: Modal for MLA to assign work to department

**New File**: `src/components/AssignToDepartmentModal.jsx`

**Features**:
- ✅ Department dropdown (13 departments)
- ✅ Priority level dropdown (low, medium, high, urgent, critical)
- ✅ Instructions textarea
- ✅ Estimated completion date picker
- ✅ Submit button

**UI Design**:
```
┌─────────────────────────────────────────┐
│ Assign to Department                    │
├─────────────────────────────────────────┤
│ Original Report:                        │
│ 📍 Potholes on Main Road               │
│ 📅 Reported: Feb 10, 2026              │
│                                         │
│ Select Department: *                    │
│ [Dropdown: 13 departments]             │
│                                         │
│ Priority Level: *                       │
│ [Dropdown: low|medium|high|urgent...]  │
│                                         │
│ Expected Completion:                    │
│ [Date Picker]                          │
│                                         │
│ Instructions to Department: *           │
│ [Text Area]                            │
│                                         │
│ [Cancel] [Assign Work Order]           │
└─────────────────────────────────────────┘
```

---

### Step 1.3: Create Work Order Service
**Goal**: Functions to create and manage work orders

**New File**: `src/services/workOrderService.js`

**Functions**:
```javascript
// Create new work order
createWorkOrder(workOrderData)

// Get work orders by MLA
getWorkOrdersByMLA(mlaId)

// Get work orders by department
getWorkOrdersByDepartment(department)

// Get work order by ID
getWorkOrderById(workOrderId)

// Update work order status
updateWorkOrderStatus(workOrderId, status, updates)

// Get work orders for road report
getWorkOrdersForReport(roadReportId)
```

---

### Step 1.4: Implement Assignment Logic
**Goal**: Create work order and update road report

**Process**:
1. MLA fills modal and clicks "Assign"
2. Create document in `department_work_orders` collection
3. Update `road_reports` with:
   - `assignedToDepartment`
   - `departmentStatus: "assigned"`
   - `workOrderId`
4. Show success message
5. Refresh view

---

## Phase 2: Department Official Dashboard

### Step 2.1: Create Official Dashboard Layout
**New File**: `src/Pages/Official/OfficialDashboard.jsx`

**Features**:
- ✅ Stats cards (pending, in progress, completed)
- ✅ Work orders table with tabs
- ✅ Filters (priority, status)

---

### Step 2.2: Create Work Order List Component
**New File**: `src/components/WorkOrderList.jsx`

**Features**:
- ✅ Display work orders in cards/table
- ✅ Show priority badges
- ✅ Show status badges
- ✅ Quick actions (Accept, View Details)
- ✅ Sort by priority/date

---

### Step 2.3: Create Work Order Detail Modal
**New File**: `src/components/WorkOrderDetailModal.jsx`

**Features**:
- ✅ Show all assignment details
- ✅ Show original road report
- ✅ MLA instructions
- ✅ Timeline
- ✅ Action buttons based on status
- ✅ Add progress notes
- ✅ Update status

**UI Design**:
```
┌─────────────────────────────────────────┐
│ Work Order #WO-12345                    │
│ [HIGH PRIORITY]  [IN PROGRESS]         │
├─────────────────────────────────────────┤
│ Original Report                         │
│ 📍 Potholes on Main Road               │
│ 📅 Reported: Feb 10, 2026              │
│ 👤 Reported by: John Doe               │
│                                         │
│ Assignment Details                      │
│ 👨‍💼 Assigned by: MLA Ram Kumar         │
│ 🏛️ Constituency: District 5            │
│ 📅 Assigned: Feb 11, 2026              │
│ ⏰ Expected: Feb 20, 2026              │
│                                         │
│ Instructions:                           │
│ "Please fix all potholes on this road  │
│  before the rainy season..."           │
│                                         │
│ Progress Notes:                         │
│ ✓ Feb 12: Team deployed                │
│ ✓ Feb 15: Materials ordered            │
│ ○ Feb 18: Work in progress             │
│                                         │
│ [Update Status] [Add Note] [Complete]  │
└─────────────────────────────────────────┘
```

---

### Step 2.4: Implement Status Update Logic
**Goal**: Officials can update work order status

**Status Flow**:
```
pending → accepted → in_progress → completed
           ↓
        rejected
```

**Actions Available by Status**:
- `pending`: Accept, Reject
- `accepted`: Start Work, Reject
- `in_progress`: Mark Complete, Put on Hold
- `on_hold`: Resume Work
- `completed`: (Read only, wait for MLA verification)

---

## Phase 3: Enhanced Features

### Step 3.1: Progress Notes
**Goal**: Officials can add progress updates

**Features**:
- ✅ Add timestamped notes
- ✅ View note history
- ✅ Attach photos (before/after)

---

### Step 3.2: MLA Verification
**Goal**: MLAs can verify completed work

**Features**:
- ✅ View completed work orders
- ✅ See official's response
- ✅ View attachments
- ✅ Verify or request revision
- ✅ Update road report to "RESOLVED"

---

### Step 3.3: Dashboard Analytics
**Goal**: Stats and charts for performance

**MLA Dashboard**:
- Total assignments by department
- Completion rates
- Average completion time
- Pending vs completed

**Official Dashboard**:
- My completion rate
- Average response time
- Work load by priority

---

### Step 3.4: Notifications (Future)
**Goal**: Alert users of important events

**Events**:
- MLA assigns work → Notify department officials
- Official accepts → Notify MLA
- Official completes → Notify MLA & citizen
- Status changes → Notify relevant parties

---

## 🎯 Current Focus: Phase 1

Let's start with **Step 1.1** - Finding and updating the MLA road reports view.

**Next Actions**:
1. Find where MLAs view road reports
2. Add "Assign to Department" button
3. Create assignment modal
4. Implement assignment logic

---

## 📁 File Structure (New Files)

```
src/
├── components/
│   ├── AssignToDepartmentModal.jsx      ← NEW
│   ├── WorkOrderList.jsx                 ← NEW
│   ├── WorkOrderDetailModal.jsx          ← NEW
│   └── WorkOrderCard.jsx                 ← NEW
├── Pages/
│   └── Official/
│       ├── OfficialDashboard.jsx        ← NEW
│       └── OfficialWorkOrders.jsx        ← NEW
├── services/
│   └── workOrderService.js               ← NEW
└── constants/
    └── departmentConstants.js            ✓ EXISTS
```

---

## ✅ Definition of Done - Phase 1

Phase 1 is complete when:
- [ ] MLA can see "Assign to Department" button on road reports
- [ ] Clicking button opens assignment modal
- [ ] Modal has all required fields
- [ ] MLA can select department and priority
- [ ] Submitting creates work order in database
- [ ] Road report is updated with assignment details
- [ ] Success message is shown
- [ ] Button changes to "Assigned to [Department]"

Ready to start? 🚀
