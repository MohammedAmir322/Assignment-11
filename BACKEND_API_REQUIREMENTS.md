# Backend API Requirements for New Features

This document outlines the backend API changes required to support the four new advanced features added to the Product Recommendation System frontend.

---

## Overview of New Features

1. **Rating and "Helpful" Counter System** - Upvote recommendations with vote tracking
2. **Tagging and Category System** - Filter queries by tags and categories
3. **Public User Profile Page** - Display user statistics and contributions
4. **Mark as Best Solution** - Allow query owners to mark accepted answers

---

## 1. Rating and "Helpful" Counter System

### Database Schema Changes

#### Recommendations Collection
Add the following fields to the `recommendations` collection:

```javascript
{
  // ... existing fields ...
  helpfulCount: { type: Number, default: 0 },
  votedBy: [{ type: String }]  // Array of user emails who voted
}
```

### Required API Endpoints

#### PATCH `/recommendations/:id/helpful`
Mark a recommendation as helpful (upvote).

**Request Body:**
```json
{
  "userEmail": "user@example.com"
}
```

**Backend Logic:**
1. Check if `userEmail` already exists in the `votedBy` array
2. If not present:
   - Increment `helpfulCount` by 1 using `$inc`
   - Add `userEmail` to `votedBy` array using `$addToSet`
3. If already present, return error or message

**Response:**
```json
{
  "success": true,
  "message": "Marked as helpful",
  "helpfulCount": 15
}
```

**MongoDB Example:**
```javascript
const { userEmail } = req.body;
const { id } = req.params;

// Check if user already voted
const recommendation = await db.recommendations.findOne({ 
  _id: ObjectId(id),
  votedBy: userEmail 
});

if (recommendation) {
  return res.status(400).json({ 
    success: false, 
    message: "Already voted" 
  });
}

// Update the recommendation
const result = await db.recommendations.updateOne(
  { _id: ObjectId(id) },
  { 
    $inc: { helpfulCount: 1 },
    $addToSet: { votedBy: userEmail }
  }
);

res.json({ success: true, message: "Marked as helpful" });
```

### Modified Endpoints

#### POST `/recommendations`
Update to include new fields when creating recommendations:
```json
{
  // ... existing fields ...
  "helpfulCount": 0,
  "votedBy": []
}
```

#### GET `/recommendations?queryId=:queryId`
Ensure the response includes `helpfulCount` and `votedBy` fields.

---

## 2. Tagging and Category System

### Database Schema Changes

#### Queries Collection
Add the following fields to the `queries` collection:

```javascript
{
  // ... existing fields ...
  tags: [{ type: String }],      // Array of tag strings
  category: { type: String }     // Category name
}
```

### Required API Endpoints

#### POST `/queries`
Update to accept and save `tags` and `category` fields.

**Request Body:**
```json
{
  "productName": "iPhone 13",
  "productBrand": "Apple",
  "productImage": "https://...",
  "queryTitle": "Looking for alternatives",
  "reason": "Too expensive",
  "email": "user@example.com",
  "tags": ["smartphone", "budget-friendly", "android"],
  "category": "Electronics",
  "createdAt": "2025-10-20T...",
  "recommendationCount": 0
}
```

#### GET `/my-queries` or `/queries`
Update to support filtering by tag and category.

**Query Parameters:**
- `tag` - Filter by specific tag (e.g., `?tag=gaming`)
- `category` - Filter by category (e.g., `?category=Electronics`)
- Can combine both: `?category=Electronics&tag=laptop`

**Backend Logic:**
```javascript
const { tag, category, email } = req.query;
const filter = {};

if (email) filter.email = email;
if (category) filter.category = category;
if (tag) filter.tags = tag;

const queries = await db.queries.find(filter).toArray();
res.json(queries);
```

**Response:** Include `tags` and `category` in all query responses.

---

## 3. Public User Profile Page

### Required API Endpoints

#### GET `/my-queries?email=:email`
Fetch all queries posted by a specific user.

**Response:**
```json
[
  {
    "_id": "...",
    "productName": "...",
    "queryTitle": "...",
    "category": "Electronics",
    "tags": ["laptop", "gaming"],
    "createdAt": "...",
    "recommendationCount": 5
    // ... other fields
  }
]
```

#### GET `/my-recommendations?email=:email`
Fetch all recommendations made by a specific user.

**Response:**
```json
[
  {
    "_id": "...",
    "title": "...",
    "productName": "...",
    "queryTitle": "Original query title",
    "queryId": "...",
    "recommenderEmail": "user@example.com",
    "recommenderName": "John Doe",
    "helpfulCount": 12,
    "votedBy": ["...", "..."],
    "createdAt": "..."
    // ... other fields
  }
]
```

**Note:** The frontend aggregates these to calculate:
- Total Queries Posted
- Total Recommendations Made
- Total Helpful Votes Received (sum of all `helpfulCount`)

---

## 4. Mark as Best Solution Feature

### Database Schema Changes

#### Recommendations Collection
Add the following field:

```javascript
{
  // ... existing fields ...
  isAccepted: { type: Boolean, default: false }
}
```

#### Queries Collection (Optional but Recommended)
Add a field to track if a query has been resolved:

```javascript
{
  // ... existing fields ...
  isResolved: { type: Boolean, default: false },
  acceptedRecommendationId: { type: String }  // Optional: store the ID of accepted recommendation
}
```

### Required API Endpoints

#### PATCH `/recommendations/:id/mark-best`
Mark a recommendation as the best solution for a query.

**Request Body:**
```json
{
  "queryId": "query123"
}
```

**Backend Logic:**
1. Verify the requesting user is the owner of the query (check `query.email` matches authenticated user)
2. Set `isAccepted: false` for ALL other recommendations under the same `queryId`
3. Set `isAccepted: true` for the selected recommendation
4. Update the query's `isResolved: true` (optional)

**MongoDB Example:**
```javascript
const { queryId } = req.body;
const { id } = req.params;

// Optional: Verify query ownership
const query = await db.queries.findOne({ _id: ObjectId(queryId) });
if (query.email !== req.user.email) {
  return res.status(403).json({ 
    success: false, 
    message: "Not authorized" 
  });
}

// First, unmark all other recommendations for this query
await db.recommendations.updateMany(
  { queryId: queryId },
  { $set: { isAccepted: false } }
);

// Then mark this one as accepted
await db.recommendations.updateOne(
  { _id: ObjectId(id) },
  { $set: { isAccepted: true } }
);

// Optional: Update query status
await db.queries.updateOne(
  { _id: ObjectId(queryId) },
  { 
    $set: { 
      isResolved: true,
      acceptedRecommendationId: id 
    } 
  }
);

res.json({ success: true, message: "Marked as best solution" });
```

**Response:**
```json
{
  "success": true,
  "message": "Marked as best solution"
}
```

### Modified Endpoints

#### GET `/recommendations?queryId=:queryId`
Ensure the response includes `isAccepted` field.

The frontend will:
- Display accepted recommendations first (with green border and badge)
- Show "Mark as Best" button only to query owners
- Only allow one accepted recommendation per query

---

## Summary of Database Schema Changes

### Queries Collection
```javascript
{
  productName: String,
  productBrand: String,
  productImage: String,
  queryTitle: String,
  reason: String,
  email: String,
  createdAt: String,
  recommendationCount: Number,
  // NEW FIELDS:
  tags: [String],                    // Feature 2
  category: String,                  // Feature 2
  isResolved: Boolean,               // Feature 4 (optional)
  acceptedRecommendationId: String   // Feature 4 (optional)
}
```

### Recommendations Collection
```javascript
{
  title: String,
  productName: String,
  productImage: String,
  reason: String,
  queryId: String,
  queryTitle: String,
  recommenderEmail: String,
  recommenderName: String,
  createdAt: String,
  // NEW FIELDS:
  helpfulCount: Number,    // Feature 1
  votedBy: [String],       // Feature 1
  isAccepted: Boolean      // Feature 4
}
```

---

## Authentication & Authorization

The following endpoints require authentication and authorization checks:

1. **POST `/queries`** - User must be logged in
2. **PATCH `/recommendations/:id/helpful`** - User must be logged in
3. **PATCH `/recommendations/:id/mark-best`** - User must be logged in AND must be the query owner
4. **POST `/recommendations`** - User must be logged in

Make sure to implement proper authentication middleware and verify user permissions before allowing these operations.

---

## Testing the Features

### Test Data Examples

#### Sample Query with Tags and Category:
```json
{
  "productName": "MacBook Pro",
  "productBrand": "Apple",
  "productImage": "https://example.com/macbook.jpg",
  "queryTitle": "Looking for a cheaper laptop alternative",
  "reason": "Too expensive for my budget",
  "email": "user@example.com",
  "tags": ["laptop", "budget-friendly", "programming"],
  "category": "Electronics",
  "createdAt": "2025-10-20T10:00:00Z",
  "recommendationCount": 0
}
```

#### Sample Recommendation with Helpful Tracking:
```json
{
  "title": "Consider Dell XPS 15",
  "productName": "Dell XPS 15",
  "productImage": "https://example.com/dell.jpg",
  "reason": "Great performance at half the price",
  "queryId": "query123",
  "queryTitle": "Looking for a cheaper laptop alternative",
  "recommenderEmail": "helper@example.com",
  "recommenderName": "Jane Doe",
  "createdAt": "2025-10-20T11:00:00Z",
  "helpfulCount": 5,
  "votedBy": ["user1@example.com", "user2@example.com"],
  "isAccepted": false
}
```

---

## Frontend-Backend Integration Checklist

- [ ] Update MongoDB schemas to include new fields
- [ ] Implement `PATCH /recommendations/:id/helpful` endpoint
- [ ] Implement `PATCH /recommendations/:id/mark-best` endpoint
- [ ] Update `POST /queries` to accept and save tags and category
- [ ] Update `GET /queries` to support tag and category filtering
- [ ] Update `POST /recommendations` to initialize new fields
- [ ] Ensure all GET endpoints return new fields in responses
- [ ] Implement authentication middleware
- [ ] Add authorization check for marking best solution (query owner only)
- [ ] Test all endpoints with sample data
- [ ] Deploy backend changes

---

## Notes for Deployment

1. **Migration Script:** You may need to run a migration script to add default values for new fields to existing documents:

```javascript
// Add default values to existing queries
db.queries.updateMany(
  { tags: { $exists: false } },
  { $set: { tags: [], category: "Other" } }
);

// Add default values to existing recommendations
db.recommendations.updateMany(
  { helpfulCount: { $exists: false } },
  { $set: { helpfulCount: 0, votedBy: [], isAccepted: false } }
);
```

2. **CORS Configuration:** Ensure your backend allows requests from the frontend domain.

3. **Error Handling:** Implement proper error handling for all new endpoints with appropriate HTTP status codes.

4. **Rate Limiting:** Consider adding rate limiting to prevent abuse of the helpful voting system.

---

## Questions or Issues?

If you encounter any issues while implementing these features, please refer to the frontend code in:
- `/src/Pages/Queries.jsx` - Tags and category filtering
- `/src/Pages/MyQueries/AddQueries.jsx` - Tags and category input
- `/src/Pages/Recommend.jsx` - Helpful counter and best solution marking
- `/src/Pages/UserProfile.jsx` - User profile data aggregation

Good luck with the implementation!
