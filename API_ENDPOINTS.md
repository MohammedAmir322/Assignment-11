# Backend API Endpoints Required for New Features

This document outlines the new API endpoints that need to be implemented on the backend to support the advanced features.

## Current Base URL
`https://product-server-navy.vercel.app`

## New Endpoints Required

### 1. Rating/Voting System

#### Vote for a recommendation
- **POST** `/recommendations/:id/vote`
- **Body**: `{ userEmail: string }`
- **Response**: `{ success: boolean, message: string, helpfulCount: number }`
- **Description**: Toggles vote for a recommendation. If user already voted, removes vote; otherwise adds vote.

### 2. Best Solution Feature

#### Mark recommendation as best solution
- **POST** `/recommendations/:id/mark-best`
- **Body**: `{ queryId: string }`
- **Response**: `{ success: boolean, message: string }`
- **Description**: Marks a recommendation as the best solution and unmarks any previous best solution for the same query.

### 3. User Profile System

#### Get user queries
- **GET** `/user-queries?email={email}`
- **Response**: Array of query objects for the specified user
- **Description**: Returns all queries created by a specific user.

#### Get user statistics
- **GET** `/user-stats?email={email}`
- **Response**: 
```json
{
  "totalQueries": number,
  "totalRecommendations": number,
  "totalHelpfulVotes": number,
  "resolvedQueries": number
}
```

### 4. Enhanced Query Filtering

#### Get queries with filters
- **GET** `/my-queries?category={category}&tag={tag}&search={search}`
- **Response**: Array of filtered query objects
- **Description**: Returns queries filtered by category, tag, or search term.

## Updated Data Models

### Query Schema Updates
```javascript
{
  // ... existing fields
  tags: [String],           // Array of tag strings
  category: String,         // Category selection
  isResolved: Boolean       // Whether query has a best solution
}
```

### Recommendation Schema Updates
```javascript
{
  // ... existing fields
  helpfulCount: Number,     // Number of helpful votes
  votedBy: [String],        // Array of user emails who voted
  isAccepted: Boolean       // Whether this is the best solution
}
```

## Implementation Notes

1. **Voting Logic**: Ensure users can only vote once per recommendation
2. **Best Solution Logic**: Only one recommendation per query can be marked as best
3. **User Statistics**: Calculate stats by aggregating data from queries and recommendations collections
4. **Tag Filtering**: Use MongoDB `$in` operator for tag matching
5. **Category Filtering**: Simple string matching for categories

## Security Considerations

1. Validate user authentication for all POST requests
2. Ensure users can only mark best solutions for their own queries
3. Prevent duplicate voting by checking `votedBy` array
4. Sanitize tag inputs to prevent injection attacks