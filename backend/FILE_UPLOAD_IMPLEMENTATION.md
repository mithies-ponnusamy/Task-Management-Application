# Backend File Upload Implementation

## Dependencies Required:
Run this command in the backend directory:
```bash
npm install multer
```

## Files Added/Modified:

### 1. Project Model (Project.js) ✅
- Added `files` array field with complete file metadata
- Added `links` array field with link information  
- Added `budget` field

### 2. Project Controller (projectController.js) ✅
- Added `uploadProjectFiles` method for file uploads
- Added `deleteProjectFile` method for file deletion
- Added `addProjectLink` method for adding links
- Added `deleteProjectLink` method for removing links

### 3. Upload Middleware (uploadMiddleware.js) ✅
- Created multer configuration for file handling
- File size limit: 10MB per file
- Maximum 5 files per upload
- Allowed file types: PDF, Word, Excel, PowerPoint, Text, Images
- Files stored in `backend/uploads/` directory

### 4. Admin Routes (adminRoutes.js) ✅
- Added POST `/api/admin/projects/:id/files` for file upload
- Added DELETE `/api/admin/projects/:id/files/:fileId` for file deletion
- Added POST `/api/admin/projects/:id/links` for link addition
- Added DELETE `/api/admin/projects/:id/links/:linkId` for link deletion

## Static File Serving:
Add this to your server.js to serve uploaded files:
```javascript
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

## Frontend Integration Required:
The frontend needs to be updated to call these backend APIs instead of storing data locally.

## API Endpoints:

### File Upload:
```
POST /api/admin/projects/:id/files
Content-Type: multipart/form-data
Body: files (array of files)
```

### File Delete:
```
DELETE /api/admin/projects/:id/files/:fileId
```

### Add Link:
```
POST /api/admin/projects/:id/links
Content-Type: application/json
Body: { url, title?, description? }
```

### Delete Link:
```
DELETE /api/admin/projects/:id/links/:linkId
```

## Next Steps:
1. Install multer: `npm install multer`
2. Add static file serving to server.js
3. Update frontend to use these APIs
4. Test file upload/download functionality
