# Mini Cloud Storage

A backend API for uploading, storing, managing, and downloading user files.

Built to practice file handling, authentication, authorization, PostgreSQL, and REST API development with Node.js and Express.

## Features

- 📤 File upload with validation
- 📥 File download and retrieval
- 🔐 User authentication and authorization
- 📊 File management (list, delete, update metadata)
- 🗄️ PostgreSQL database integration
- 🛡️ Secure file storage
- ⚡ RESTful API architecture

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Multer** - File upload handling

## Project Structure

```
mini-cloud-storage/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── fileController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── fileRoutes.js
│   ├── app.js
│   └── server.js
├── uploads/
├── schema.sql
├── .env
├── .gitignore
├── package.json
└── package-lock.json
```

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/alishgc/mini-cloud-storage.git
cd mini-cloud-storage
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the database

```bash
psql -U postgres -f schema.sql
```

### 4. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mini_cloud_storage
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 5. Start the server

```bash
npm start
```

The server will start at `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Files

#### Upload File
```
POST /api/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: <binary file>
- description: "My document" (optional)
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "filename": "document.pdf",
    "size": 2048,
    "uploadedAt": "2026-08-23T10:30:00Z"
  }
}
```

#### List User's Files
```
GET /api/files
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "files": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "filename": "document.pdf",
      "size": 2048,
      "uploadedAt": "2026-08-23T10:30:00Z"
    }
  ]
}
```

#### Download File
```
GET /api/files/:fileId/download
Authorization: Bearer <token>
```

**Response:** File binary data

#### Get File Details
```
GET /api/files/:fileId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "file": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "filename": "document.pdf",
    "size": 2048,
    "uploadedAt": "2026-08-23T10:30:00Z",
    "description": "My document"
  }
}
```

#### Delete File
```
DELETE /api/files/:fileId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

#### Update File Metadata
```
PUT /api/files/:fileId
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "File updated successfully",
  "file": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "filename": "document.pdf",
    "description": "Updated description"
  }
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_NAME` | Database name |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | JWT signing secret |
| `NODE_ENV` | Environment (development/production) |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on the GitHub repository.

---

**Built with ❤️ for learning REST APIs and file handling**
