# API Endpoints for Advanced Features

This document outlines the additional API endpoints needed to support the four advanced features implemented in the Product Recommendation System.

## Feature 1: Rating and Helpful Counter System

### POST /recommendations/:id/helpful
Mark a recommendation as helpful by a user.

**Request Body:**
```json
{
  "userEmail": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vote recorded successfully"
}
```

**Backend Implementation Notes:**
- Check if user has already voted for this recommendation
- If not voted: increment `helpfulCount` and add user email to `votedBy` array
- If already voted: return error or ignore

## Feature 2: Tagging and Category System

### Updated POST /queries
Create a new query with tags and category.

**Request Body:**
```json
{
  "productName": "iPhone 15",
  "productBrand": "Apple",
  "productImage": "https://example.com/image.jpg",
  "queryTitle": "Is there a better alternative?",
  "reason": "Too expensive",
  "tags": ["smartphone", "expensive", "apple"],
  "category": "Electronics",
  "email": "user@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "recommendationCount": 0
}
```

### GET /queries?tag=:tag
Filter queries by tag.

### GET /queries?category=:category
Filter queries by category.

## Feature 3: Public User Profile Page

### GET /profile/:userEmail
Get user profile data including statistics.

**Response:**
```json
{
  "userEmail": "user@example.com",
  "queries": [...],
  "recommendations": [...],
  "totalQueries": 5,
  "totalRecommendations": 12,
  "totalHelpfulVotes": 25
}
```

## Feature 4: Mark as Best Solution

### POST /recommendations/:id/mark-best
Mark a recommendation as the best solution for a query.

**Request Body:**
```json
{
  "queryId": "query_id_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Recommendation marked as best solution"
}
```

**Backend Implementation Notes:**
- Verify that the requesting user is the owner of the query
- Set `isAccepted: true` for the selected recommendation
- Set `isAccepted: false` for all other recommendations of the same query
- Set `isResolved: true` on the parent query document

## Database Schema Updates

### Queries Collection
Add these fields to existing query documents:
```json
{
  "tags": ["tag1", "tag2", "tag3"],
  "category": "Electronics",
  "isResolved": false
}
```

### Recommendations Collection
Add these fields to existing recommendation documents:
```json
{
  "helpfulCount": 0,
  "votedBy": ["user1@example.com", "user2@example.com"],
  "isAccepted": false
}
```

## Error Handling

All endpoints should return appropriate HTTP status codes:
- 200: Success
- 400: Bad Request (invalid data)
- 401: Unauthorized (user not logged in)
- 403: Forbidden (user doesn't have permission)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error

## Frontend Integration

The frontend components have been updated to:
1. Display helpful counters and voting buttons
2. Show tags and categories with filtering
3. Link to user profiles from usernames
4. Show "Mark as Best" buttons for query owners
5. Highlight accepted solutions with special styling

All features are designed to work seamlessly with the existing codebase and maintain backward compatibility.