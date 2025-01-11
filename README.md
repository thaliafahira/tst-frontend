# Swagger API Documentation

## **Endpoints**

---

### **1. User Registration**

**`POST /auth/register`**

This endpoint allows users to register by providing a username, email, and password.

**Request Body**  
Content Type: `application/json`  
Schema Example:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Responses**  
| Code | Description                       |
|------|-----------------------------------|
| 201  | User registered successfully      |
| 400  | Bad request (missing fields)      |
| 500  | Internal server error             |

---

### **2. User Login**

**`POST /auth/login`**

This endpoint allows users to log in using their email and password.

**Request Body**  
Content Type: `application/json`  
Schema Example:
```json
{
  "email": "string",
  "password": "string"
}
```

**Responses**  
| Code | Description                       |
|------|-----------------------------------|
| 200  | Login successful                  |
| 400  | Bad request (missing fields)      |
| 404  | User not found                    |
| 500  | Internal server error             |

---

### **3. Generate Wedding Invitation**

**`POST /api/invitations/generate`**

This endpoint allows users to generate a wedding invitation image based on the provided details.

**Request Body**  
Content Type: `application/json`  
Schema Example:
```json
{
  "theme": "classic",
  "details": "John Doe & Jane Smith, 12th February 2025, at Sunset Garden",
  "additionalInfo": "Dress Code: Formal, RSVP by 5th February"
}
```

**Responses**  
| Code | Description                                         |
|------|-----------------------------------------------------|
| 200  | Successfully generated the invitation              |
| 400  | Bad request (missing required fields or invalid data) |
| 500  | Internal server error, failed to generate invitation |

**Example Successful Response**  
Content Type: `application/json`  
Schema Example:
```json
{
  "status": "success",
  "imageUrl": "https://generated-invitations.com/invitation-12345.png"
}
```

**Example Error Response (400)**  
Content Type: `application/json`  
Schema Example:
```json
{
  "status": "error",
  "message": "All fields are required."
}
```

**Example Error Response (500)**  
Content Type: `application/json`  
Schema Example:
```json
{
  "status": "error",
  "message": "An error occurred while generating the invitation."
}
```
