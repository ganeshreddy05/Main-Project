# Appwrite Services

This directory contains all Appwrite-related service modules for the Turn the Wheel application.

## Structure

- **`config.js`** - Appwrite client configuration and initialization
- **`auth.js`** - Authentication service (login, register, logout, password management)
- **`database.js`** - Database operations for all collections (users, road reports, help requests, MLA applications, etc.)
- **`storage.js`** - File storage operations (upload, download, delete)
- **`index.js`** - Central exports for easy importing

## Usage

### Importing Services

```javascript
// Import specific services
import { authService, databaseService, storageService } from "@/appwrite";

// Or import specific utilities
import { account, databases, storage, ID, Query } from "@/appwrite";
```

### Authentication Examples

```javascript
import { authService } from "@/appwrite";

// Register a new user
await authService.register(email, password, name);

// Login
await authService.login(email, password);

// Get current user
const user = await authService.getCurrentUser();

// Logout
await authService.logout();
```

### Database Examples

```javascript
import { databaseService, Query } from "@/appwrite";

// Create a user
await databaseService.createUser({
  userId: "user123",
  name: "John Doe",
  email: "john@example.com",
  role: "citizen",
  status: "active"
});

// Get road reports with filters
const reports = await databaseService.getRoadReports([
  Query.equal("district", "Hyderabad"),
  Query.orderDesc("$createdAt")
]);

// Update a document
await databaseService.updateRoadReport(reportId, {
  status: "resolved"
});
```

### Storage Examples

```javascript
import { storageService } from "@/appwrite";

// Upload a file
const file = document.querySelector('input[type="file"]').files[0];
const uploadedFile = await storageService.uploadFile(file);

// Get file preview URL
const previewUrl = storageService.getFileView(fileId);

// Delete a file
await storageService.deleteFile(fileId);
```

## Environment Variables Required

Make sure these are set in your `.env` file:

```
VITE_APPWRITE_ENDPOINT=https://sgp.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_DATABASE_ID=your_database_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id
VITE_USERS_COLLECTION_ID=users
VITE_ROAD_REPORTS_COLLECTION_ID=road_reports
VITE_HELP_REQUESTS_COLLECTION_ID=help_request
VITE_TRAVEL_ALERTS_COLLECTION_ID=travel_alerts
VITE_MLA_APPLICATIONS_COLLECTION_ID=mla_applications
VITE_MLA_RESPONSES_COLLECTION_ID=mla_responses
```

## Notes

- All services include error handling and logging
- The database service provides both generic CRUD operations and collection-specific helpers
- Storage service supports both single and multiple file operations
- Authentication service includes session management and account update methods
