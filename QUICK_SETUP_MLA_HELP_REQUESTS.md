# 🚀 Quick Setup Guide - MLA Help Requests

## ⚡ 3-Minute Setup

Follow these steps to activate the MLA Help Requests feature:

---

## Step 1: Create Appwrite Collection (2 minutes)

### Go to Appwrite Console:
1. Open https://cloud.appwrite.io/
2. Login to your project
3. Click **Databases** → Select your database (`Turn the Wheel`)
4. Click **"Create Collection"**

### Collection Details:
- **Name**: `MLA Help Responses`
- **Collection ID**: Leave as auto-generated OR use: `mla_help_responses`

### Add These Attributes:

Click **"Create Attribute"** and add each of these:

| Attribute | Type | Size/Default | Required |
|-----------|------|--------------|----------|
| `helpRequestId` | String | 255 | ✅ Yes |
| `mlaId` | String | 255 | ✅ Yes |
| `mlaName` | String | 255 | ✅ Yes |
| `mlaConstituency` | String | 255 | ✅ Yes |
| `responseType` | String | 50 | ✅ Yes |
| `message` | String | 2000 | ✅ Yes |
| `actionTaken` | String | 2000 | ✅ Yes |
| `estimatedDays` | Integer | - | ❌ No |
| `followUpRequired` | Boolean | false | ❌ No |
| `followUpNotes` | String | 1000 | ❌ No |
| `respondedAt` | String | 255 | ✅ Yes |

### Set Permissions:
1. Click **"Settings"** tab in the collection
2. Under **"Permissions"**:
   - **Read Access**: Select "Any" (so citizens can see responses)
   - **Create Access**: Select "Users" (so MLAs can create responses)
   - **Update Access**: Select "Users" (optional, for editing responses)
   - **Delete Access**: Select "Users" (optional, for deleting responses)

### Create Indexes:
1. Click **"Indexes"** tab
2. Create Index 1:
   - Key: `helpRequestId`
   - Type: Key
   - Attributes: `helpRequestId` (ASC)
3. Create Index 2:
   - Key: `mlaId`
   - Type: Key
   - Attributes: `mlaId` (ASC)

### Copy Collection ID:
- At the top of the collection page, you'll see **Collection ID**
- Click the **copy icon** next to it
- Save this ID for Step 2

---

## Step 2: Update Environment Variable (30 seconds)

1. Open **`.env`** file in your project root
2. Find this line:
   ```
   VITE_MLA_HELP_RESPONSES_COLLECTION_ID="mla_help_responses"
   ```
3. Replace `"mla_help_responses"` with the Collection ID you copied
   ```
   VITE_MLA_HELP_RESPONSES_COLLECTION_ID="6a7b8c9d0e1f2g3h4i5j"
   ```
   (Use your actual Collection ID!)
4. **Save the file**

---

## Step 3: Restart Dev Server (30 seconds)

In your terminal:

1. **Stop the server**: Press `Ctrl + C`
2. **Start it again**: 
   ```bash
   npm run dev
   ```

---

## ✅ That's It! Test the Feature

### As MLA:
1. Login to MLA Portal: `/mla/login`
2. Go to Dashboard
3. Click **"Help Requests"** button
4. You should see all help requests from your constituency
5. Click **"Respond"** on any request
6. Fill the form and submit

### As Citizen:
1. Login as Citizen: `/login`
2. Go to **Help Requests**
3. Click **"View Details"** on any request
4. You should see MLA responses (if any)

---

## 🎉 Success!

If you can see the Help Requests page and submit responses, the feature is working!

---

## ❌ Troubleshooting

### Error: "Collection not found"
- **Solution**: Double-check the Collection ID in `.env` matches Appwrite
- Make sure to restart the dev server after changing `.env`

### Error: "Permission denied"
- **Solution**: Go to Appwrite Console → Collection Settings → Permissions
- Make sure "Users" can Create and "Any" can Read

### Help Requests page is blank
- **Solution**: Check if there are any help requests in the database
- Create a test help request as a citizen first

---

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all environment variables are correct
3. Ensure Appwrite collection exists with correct permissions
4. Restart the development server

---

**Happy Coding! 🚀**
