# 📋 Road Reports Collection - Additional Attributes

## What to Add to `road_reports` Collection in Appwrite

These 3 attributes will link road reports to department work orders.

---

## 🆕 New Attributes to Add

### 1. `assignedToDepartment`
- **Type**: String
- **Size**: 100
- **Required**: ❌ No (Optional)
- **Default**: Leave empty
- **Array**: No
- **Description**: Which department this report was assigned to

**Purpose**: Track which department is handling this report

**Values**: Will be one of your 13 department enum values:
- `WATER_SUPPLY`
- `DRAINAGE_SANITATION`
- `ELECTRICITY`
- `STREET_LIGHTS`
- `HEALTHCARE`
- `EDUCATION`
- `PUBLIC_INFRASTRUCTURE`
- `AGRICULTURE`
- `LAW_ORDER_SAFETY`
- `WASTE_MANAGEMENT`
- `TRANSPORTATION`
- `DIGITAL_CONNECTIVITY`
- `OTHER_COMMUNITY`

---

### 2. `departmentStatus`
- **Type**: Enum
- **Required**: ❌ No (Optional)
- **Default**: Leave empty (or `not_assigned`)
- **Array**: No
- **Description**: Current status of department work

**Enum Values**:
```
not_assigned
assigned
in_progress
completed
```

**As comma-separated**:
```
not_assigned,assigned,in_progress,completed
```

**Usage**:
- `not_assigned` - Not yet assigned to any department
- `assigned` - MLA assigned to department, waiting for official
- `in_progress` - Department official is working on it
- `completed` - Department finished the work

---

### 3. `workOrderId`
- **Type**: String
- **Size**: 255
- **Required**: ❌ No (Optional)
- **Default**: Leave empty
- **Array**: No
- **Description**: Reference to the work order document ID

**Purpose**: Links to the `department_work_orders` collection

---

## 📊 Summary Table

| Attribute | Type | Size | Required | Default | Enum Values |
|-----------|------|------|----------|---------|-------------|
| `assignedToDepartment` | String | 100 | No | - | - |
| `departmentStatus` | Enum | - | No | - | `not_assigned`, `assigned`, `in_progress`, `completed` |
| `workOrderId` | String | 255 | No | - | - |

---

## 🔄 How These Fields Work Together

### Example Flow:

**1. Initial State** (Citizen creates report):
```json
{
  "status": "ACTIVE",
  "assignedToDepartment": null,
  "departmentStatus": null,
  "workOrderId": null
}
```

**2. MLA Assigns to Department**:
```json
{
  "status": "ACTIVE",
  "assignedToDepartment": "PUBLIC_INFRASTRUCTURE",
  "departmentStatus": "assigned",
  "workOrderId": "6789xyz"
}
```

**3. Official Starts Work**:
```json
{
  "status": "ACTIVE",
  "assignedToDepartment": "PUBLIC_INFRASTRUCTURE",
  "departmentStatus": "in_progress",
  "workOrderId": "6789xyz"
}
```

**4. Work Completed**:
```json
{
  "status": "RESOLVED",
  "assignedToDepartment": "PUBLIC_INFRASTRUCTURE",
  "departmentStatus": "completed",
  "workOrderId": "6789xyz"
}
```

---

## ✅ Quick Setup Steps in Appwrite

### In Appwrite Console:

1. Go to **Database** → `road_reports` collection
2. Click **"Attributes"** tab
3. Click **"Add Attribute"** button

### Add Attribute #1:
- Click **"String"**
- Key: `assignedToDepartment`
- Size: `100`
- Required: ❌ Uncheck
- Array: ❌ Uncheck
- Default: Leave empty
- Click **"Create"**

### Add Attribute #2:
- Click **"Enum"**
- Key: `departmentStatus`
- Elements: Add 4 values:
  - `not_assigned`
  - `assigned`
  - `in_progress`
  - `completed`
- Required: ❌ Uncheck
- Array: ❌ Uncheck
- Default: Leave empty (or select `not_assigned`)
- Click **"Create"**

### Add Attribute #3:
- Click **"String"**
- Key: `workOrderId`
- Size: `255`
- Required: ❌ Uncheck
- Array: ❌ Uncheck
- Default: Leave empty
- Click **"Create"**

---

## 🎯 Why We Need These Fields

### `assignedToDepartment`:
- Shows which department is responsible
- Helps filter reports by department
- Shows on citizen's report: "Assigned to Water Supply Department"

### `departmentStatus`:
- Quick overview of department work progress
- Can show badges: "In Progress", "Completed"
- Helps MLAs track which reports need attention

### `workOrderId`:
- Links to detailed work order
- Access full assignment details
- See MLA instructions and official responses

---

## 📱 UI Display Examples

### Road Report Card (Citizen View):
```
┌─────────────────────────────────────┐
│ Pothole on Main Road               │
│ Status: ACTIVE                     │
│ 📋 Assigned to: Public Works       │
│ ⚙️  Status: In Progress             │
│ 👨‍💼 Working: PWD Team                │
└─────────────────────────────────────┘
```

### MLA Dashboard:
```
┌─────────────────────────────────────┐
│ Active Reports with Assignments    │
├─────────────────────────────────────┤
│ 🟢 5 assigned, in progress         │
│ 🟡 3 assigned, pending             │
│ 🔵 12 not assigned                 │
└─────────────────────────────────────┘
```

### Department Official Dashboard:
```
┌─────────────────────────────────────┐
│ My Department: Public Works        │
├─────────────────────────────────────┤
│ 📋 8 work orders assigned          │
│ ⚙️ 5 in progress                    │
│ ✅ 15 completed this month         │
└─────────────────────────────────────┘
```

---

## 🔍 Benefits

1. **Tracking**: Know which reports are assigned vs unassigned
2. **Accountability**: Every assignment is recorded
3. **Progress**: See status at a glance
4. **Integration**: Links reports to detailed work orders
5. **Dashboard**: Better stats for MLAs and officials
6. **Citizen Updates**: Show citizens their report is being handled

---

## ✅ Verification

After adding these attributes, verify:

- [ ] `assignedToDepartment` field added (String, 100, optional)
- [ ] `departmentStatus` field added (Enum, 4 values, optional)
- [ ] `workOrderId` field added (String, 255, optional)
- [ ] All existing road reports still load correctly
- [ ] New reports can be created without these fields
- [ ] Fields are visible in database console

---

## 🎉 You're Done!

After adding these 3 fields, your `road_reports` collection will be ready to:
- ✅ Link to department work orders
- ✅ Track department assignments
- ✅ Show work progress
- ✅ Enable MLA-to-Department workflow

**Next**: Create the `department_work_orders` collection!
