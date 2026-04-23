# Planora API Documentation & Test Cases

This document outlines the core REST API endpoints available in the Planora backend, along with sample JSON requests (test cases) and expected responses.

---

## 1. Authentication (`/auth`)

### 1.1 User Registration
- **Route**: `POST /auth/register`
- **Access**: Public
- **Description**: Registers a new user account.

**Request (Sample JSON):**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "name": "Alex Johnson",
  "phoneNumber": "+8801700000000",
  "role": "USER"
}
```

**Success Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cm3r5...",
    "email": "newuser@example.com",
    "name": "Alex Johnson",
    "role": "USER"
  }
}
```

### 1.2 User Login
- **Route**: `POST /auth/login`
- **Access**: Public
- **Description**: Authenticates a user and returns a JWT.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "cm3r5...",
    "email": "newuser@example.com",
    "role": "USER"
  }
}
```

**Error Response (401 Unauthorized - Wrong Password):**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "errorSources": []
}
```

---

## 2. Events (`/events`)

### 2.1 Get All Public Events
- **Route**: `GET /events`
- **Access**: Public
- **Query Params**: `?searchTerm=Tech&category=TECHNOLOGY&status=UPCOMING&page=1&limit=10`

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Events retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 15
  },
  "data": [
    {
      "id": "evt_123",
      "title": "Tech Conference 2024",
      "status": "UPCOMING",
      "priceCents": 150000,
      "category": "TECHNOLOGY",
      "capacity": 500,
      "joined": 45
    }
  ]
}
```

### 2.2 Create a New Event
- **Route**: `POST /events`
- **Access**: `OWNER` or `ADMIN`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Note that images are uploaded via `multipart/form-data`. Below is the data representation.

**Request Body (Form Data simulation):**
```json
{
  "title": "React Masterclass",
  "description": "Learn advanced React patterns.",
  "category": "TECHNOLOGY",
  "status": "UPCOMING",
  "isPublic": true,
  "priceCents": 50000,
  "capacity": 50,
  "date": "2024-12-01T10:00:00.000Z",
  "location": "Dhaka, Bangladesh"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": "evt_789",
    "title": "React Masterclass",
    "coverImageUrl": "https://res.cloudinary.com/..."
  }
}
```

---

## 3. Payments & Participation (`/payments`)

### 3.1 Initiate Payment (SSLCommerz)
- **Route**: `POST /payments/init`
- **Access**: `USER`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Initiates a payment session for a paid event.

**Request:**
```json
{
  "eventId": "evt_123",
  "invitationId": null,
  "phoneNumber": "+8801711111111"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment initiated successfully",
  "data": {
    "paymentUrl": "https://sandbox.sslcommerz.com/gwprocess/v4/gw.php?Q=..."
  }
}
```

### 3.2 Join Free Event
- **Route**: `POST /events/:id/join`
- **Access**: `USER`
- **Headers**: `Authorization: Bearer <token>`

**Request:**
```json
{}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully joined the event",
  "data": {
    "id": "part_123",
    "eventId": "evt_456",
    "userId": "user_789"
  }
}
```

**Error Response (400 Bad Request - Event is full):**
```json
{
  "success": false,
  "message": "Event has reached maximum capacity",
  "errorSources": []
}
```

---

## 4. Reviews (`/reviews`)

### 4.1 Create a Review
- **Route**: `POST /reviews`
- **Access**: `USER` (Must have attended the event)
- **Headers**: `Authorization: Bearer <token>`

**Request:**
```json
{
  "eventId": "evt_123",
  "rating": 5,
  "comment": "Absolutely loved the conference! Great speakers."
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "id": "rev_123",
    "rating": 5,
    "comment": "Absolutely loved the conference! Great speakers.",
    "createdAt": "2024-10-25T14:48:00.000Z"
  }
}
```

---

## 5. Invitations (`/invitations`)

### 5.1 Send Invitation (Private Event)
- **Route**: `POST /invitations`
- **Access**: `OWNER` of the event or `ADMIN`
- **Headers**: `Authorization: Bearer <token>`

**Request:**
```json
{
  "eventId": "evt_123",
  "email": "invitee@example.com"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Invitation sent successfully",
  "data": {
    "id": "inv_456",
    "status": "PENDING",
    "email": "invitee@example.com"
  }
}
```

---

## 6. Admin operations (`/admin`)

### 6.1 Delete User
- **Route**: `DELETE /admin/users/:id`
- **Access**: `ADMIN`
- **Headers**: `Authorization: Bearer <token>`

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Response (403 Forbidden - Deleting self):**
```json
{
  "success": false,
  "message": "Admins cannot delete their own account.",
  "errorSources": []
}
```
