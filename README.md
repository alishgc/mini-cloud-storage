# Mini Cloud Storage

A backend REST API for uploading, storing, managing, and downloading user files.

This project was built to practice file handling, user authentication and authorization, PostgreSQL database integration, and REST API development with Node.js and Express.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- User-specific file authorization
- File upload with validation
- File listing and metadata retrieval
- File download
- File renaming
- File deletion
- PostgreSQL for file metadata and user data
- Filesystem-based file storage
- Orphaned file cleanup when metadata storage fails
- Protected file access

## Tech Stack

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **JWT**
- **bcrypt**
- **Multer**

## How It Works

The project uses PostgreSQL to store user and file metadata, while the actual uploaded files are stored on the server's filesystem.

```text
Client
  │
  ▼
Express API
  │
  ├── JWT Authentication
  │
  ├── File Upload (Multer)
  │
  ▼
Controllers
  │
  ├───────────────┐
  ▼               ▼
PostgreSQL      File System
(metadata)      (actual files)
```

Each file belongs to a specific user through the `user_id` foreign key. Protected endpoints verify the user's JWT and only allow access to files owned by that user.

## Project Structure

```text
mini-cloud-storage/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── file.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── upload.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── file.routes.js
│   ├── app.js
│   └── server.js
├── uploads/
│   └── .gitkeep
├── schema.sql
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

Make sure PostgreSQL is installed and running.

Run the schema file:

```bash
psql -U postgres -f schema.sql
```

This creates the `mini_cloud_storage` database along with the `users` and `files` tables.

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=mini_cloud_storage
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
```

Replace `your_password` and `your_jwt_secret` with your own values.

**Do not commit your `.env` file.**

### 5. Start the server

For development:

```bash
npm run dev
```

Or for production:

```bash
npm start
```

The API will run at:

```text
http://localhost:3000
```

## Authentication

The API uses JWT-based authentication.

After logging in, include the returned token in the `Authorization` header for protected endpoints:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

All file operations and the current-user endpoint require authentication.

## API Endpoints

### Authentication

| Method | Endpoint             | Description                  | Auth |
| ------ | -------------------- | ---------------------------- | ---- |
| POST   | `/api/auth/register` | Register a new user          | No   |
| POST   | `/api/auth/login`    | Login and receive JWT        | No   |
| GET    | `/api/auth/me`       | Get current user information | Yes  |

### Files

| Method | Endpoint                  | Description       | Auth |
| ------ | ------------------------- | ----------------- | ---- |
| POST   | `/api/files/upload`       | Upload a file     | Yes  |
| GET    | `/api/files`              | List user's files | Yes  |
| GET    | `/api/files/:id`          | Get file metadata | Yes  |
| GET    | `/api/files/:id/download` | Download a file   | Yes  |
| PATCH  | `/api/files/:id`          | Rename a file     | Yes  |
| DELETE | `/api/files/:id`          | Delete a file     | Yes  |

## API Examples

### Register

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Alish",
  "email": "alish@example.com",
  "password": "password123"
}
```

Example response:

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Alish",
    "email": "alish@example.com",
    "created_at": "2026-08-23T10:00:00.000Z"
  }
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "alish@example.com",
  "password": "password123"
}
```

Example response:

```json
{
  "message": "Login successful",
  "token": "YOUR_JWT_TOKEN",
  "user": {
    "id": 1,
    "name": "Alish",
    "email": "alish@example.com"
  }
}
```

Use the returned token for protected requests:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Upload a File

```http
POST /api/files/upload
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data
```

Form-data:

```text
file: example.pdf
```

Example response:

```json
{
  "message": "File uploaded successfully",
  "file": {
    "id": 1,
    "user_id": 1,
    "original_name": "example.pdf",
    "stored_name": "1787392107522-349823023.pdf",
    "mime_type": "application/pdf",
    "size": 3934,
    "created_at": "2026-08-23T10:00:00.000Z"
  }
}
```

### List Files

```http
GET /api/files
Authorization: Bearer YOUR_JWT_TOKEN
```

Example response:

```json
{
  "files": [
    {
      "id": 1,
      "original_name": "example.pdf",
      "stored_name": "1787392107522-349823023.pdf",
      "mime_type": "application/pdf",
      "size": 3934,
      "created_at": "2026-08-23T10:00:00.000Z"
    }
  ]
}
```

### Get File Metadata

```http
GET /api/files/1
Authorization: Bearer YOUR_JWT_TOKEN
```

Example response:

```json
{
  "file": {
    "id": 1,
    "original_name": "example.pdf",
    "mime_type": "application/pdf",
    "size": 3934,
    "created_at": "2026-08-23T10:00:00.000Z"
  }
}
```

### Download a File

```http
GET /api/files/1/download
Authorization: Bearer YOUR_JWT_TOKEN
```

The server returns the file using its current original filename.

### Rename a File

```http
PATCH /api/files/1
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

```json
{
  "original_name": "renamed-example.pdf"
}
```

Example response:

```json
{
  "message": "File renamed successfully",
  "file": {
    "id": 1,
    "original_name": "renamed-example.pdf",
    "mime_type": "application/pdf",
    "size": 3934,
    "created_at": "2026-08-23T10:00:00.000Z"
  }
}
```

### Delete a File

```http
DELETE /api/files/1
Authorization: Bearer YOUR_JWT_TOKEN
```

Example response:

```json
{
  "message": "File deleted successfully"
}
```

## Database Schema

The application uses two main tables:

```text
users
  │
  │ 1 : N
  ▼
files
```

### users

Stores registered user information and password hashes.

### files

Stores metadata about uploaded files and links each file to its owner through `user_id`.

The actual file contents are stored in the `uploads/` directory rather than inside PostgreSQL.

The complete database schema is available in [`schema.sql`](schema.sql).

## Security

* Passwords are hashed using bcrypt before being stored.
* JWT is used to authenticate protected requests.
* File operations verify file ownership using the authenticated user's ID.
* Uploaded files are not committed to the repository.
* `.env` is excluded from Git.
* Uploaded files are removed if their database metadata cannot be saved.

## Development Notes

This project is a learning-focused backend implementation. It uses local filesystem storage rather than cloud object storage such as Amazon S3.

The project focuses on understanding the fundamentals of authentication, authorization, file handling, database integration, and REST API design.

## License

This project is for learning and educational purposes.
