# Add `readByUser` Field to MLA Response Collections

## ⚠️ IMPORTANT: Database Schema Update Required

To enable the notification system for MLA responses, you need to add a new boolean attribute to your Appwrite collections.

## Steps to Update:

### 1. **MLA Help Responses Collection**

1. Go to your Appwrite Console
2. Navigate to: **Databases** → Select your database → **mla_help_responses** collection
3. Go to **Attributes** tab
4. Click **Create Attribute** → Select **Boolean**
5. Fill in:
   - **Attribute ID**: `readByUser`
   - **Default Value**: `false`
   - **Required**: ☑️ Yes
6. Click **Create**

### 2. **MLA Road Report Responses Collection** (if you have one)

1. Go to **mla_responses** collection (for road reports)
2. Follow the same steps above to add `readByUser` boolean attribute
3. Set Default Value to `false`

## What This Field Does:

- **`readByUser: false`** → User hasn't seen the MLA response yet (shows as **NEW** notification)
- **`readByUser: true`** → User has clicked and viewed the notification

## After Adding the Field:

The notification system will automatically:
- ✅ Show a **red badge** with count of unread MLA responses
- ✅ Display **"✅ MLA Responded to your request"** notifications
- ✅ Highlight new notifications with **green background**
- ✅ Mark notifications as read when user clicks them
- ✅ Navigate to Help Requests page when clicked

## Testing:

1. Have an MLA respond to one of your help requests
2. Log in as the citizen who created the request
3. You should see:
   - Red notification badge in top bar
   - Green highlighted notification in dropdown
   - Message: "MLA Responded to your request"

## Notification Features:

- Shows up to 10 most recent MLA responses
- Displays:
  - Request title
  - MLA response message
  - Response date
  - Green dot for unread notifications
- Click notification to:
  - Mark as read
  - Navigate to Help Requests page
  - Close notification panel
