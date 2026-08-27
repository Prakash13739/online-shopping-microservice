# Auth Service API Specification

Base URL: `http://localhost:8080/api/auth` (Direct Service: `http://localhost:8081/api/auth`)

## 1. Register User
- **Method**: `POST`
- **Path**: `/register`
- **Auth**: Public
- **Request Body**:
```json
{
  "name": "Alex Smith",
  "email": "alex@example.com",
  "password": "Password123!",
  "phone": "+1 (555) 123-4567"
}
```
- **Success Response** (`201 Created`):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 3,
    "name": "Alex Smith",
    "email": "alex@example.com",
    "role": "ROLE_CUSTOMER",
    "token": "eyJhbGciOiJIUzI1NiJ9..."
  },
  "timestamp": "2026-08-27T20:30:00"
}
```

## 2. Login User
- **Method**: `POST`
- **Path**: `/login`
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "customer@shopsphere.com",
  "password": "customer123"
}
```
- **Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 2,
    "name": "Jane Doe",
    "email": "customer@shopsphere.com",
    "role": "ROLE_CUSTOMER",
    "token": "eyJhbGciOiJIUzI1NiJ9..."
  },
  "timestamp": "2026-08-27T20:30:00"
}
```

## 3. Get Current User (`/me`)
- **Method**: `GET`
- **Path**: `/me`
- **Auth**: `Bearer <token>`
- **Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Current user profile retrieved",
  "data": {
    "id": 2,
    "name": "Jane Doe",
    "email": "customer@shopsphere.com",
    "role": "ROLE_CUSTOMER",
    "phone": "+1 (555) 438-9210"
  },
  "timestamp": "2026-08-27T20:30:00"
}
```

## 4. Validate Token (Inter-service)
- **Method**: `POST`
- **Path**: `/validate`
- **Auth**: Public / Internal
- **Request Body**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```
- **Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "userId": 2,
    "email": "customer@shopsphere.com",
    "role": "ROLE_CUSTOMER",
    "valid": true
  },
  "timestamp": "2026-08-27T20:30:00"
}
```
