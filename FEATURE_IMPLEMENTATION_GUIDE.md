# Feature Implementation Guide

This guide shows exactly where each feature was implemented and how to find them in the codebase.

---

## 🗂️ File Structure Overview

```
src/
├── Pages/
│   ├── Queries.jsx                    ✏️ Modified (Feature 2)
│   ├── Recommend.jsx                  ✏️ Modified (Features 1 & 4)
│   ├── UserProfile.jsx                ✨ NEW (Feature 3)
│   ├── MyQueries/
│   │   └── AddQueries.jsx             ✏️ Modified (Feature 2)
│   └── Shared/
│       └── NavBar.jsx                 ✏️ Modified (Feature 3)
├── Router/
│   └── Router.jsx                     ✏️ Modified (Feature 3)
└── ...
```

---

## Feature 1: Helpful Counter System

### Implementation Location
**File:** `/src/Pages/Recommend.jsx`

### Key Code Sections

#### 1. State & Data Fetching (Lines ~18-35)
```javascript
const fetchRecommendations = async () => {
    const res = await axios.get(`https://product-server-navy.vercel.app/recommendations?queryId=${id}`);
    // Sort by helpful count (highest first)
    const sorted = res.data.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
    setRecommendations(sorted);
};
```

#### 2. Helpful Vote Handler (Lines ~78-108)
```javascript
const handleHelpful = async (recommendationId, votedBy) => {
    // Check if user is logged in
    // Check if user already voted
    // Send PATCH request to backend
    // Update UI
};
```

#### 3. UI Rendering (Lines ~185-195)
```javascript
<button
    onClick={() => handleHelpful(rec._id, rec.votedBy)}
    disabled={hasVoted}
    className={`btn btn-sm gap-2 ${hasVoted ? 'btn-success' : 'btn-outline btn-primary'}`}
>
    <FaThumbsUp />
    Helpful
</button>
<span>{rec.helpfulCount || 0} people</span>
```

### What to Look For
- ✅ `FaThumbsUp` icon import
- ✅ `handleHelpful` function
- ✅ `hasVoted` check based on `votedBy` array
- ✅ Sorting recommendations by `helpfulCount`

---

## Feature 2: Tags & Categories

### Implementation Locations

#### Part 1: Add Query Form
**File:** `/src/Pages/MyQueries/AddQueries.jsx`

**Lines 16-30:** Processing tags and category from form
```javascript
const tagsInput = form.tags.value.trim();
const tagsArray = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

const newQuery = {
    // ... existing fields
    tags: tagsArray,
    category: form.category.value,
};
```

**Lines 110-135:** Form inputs for category and tags
```javascript
<select name="category" className="select select-bordered w-full" required>
    <option value="">Select a Category</option>
    <option value="Electronics">Electronics</option>
    {/* ... more categories */}
</select>

<input
    type="text"
    name="tags"
    placeholder="Tags (comma-separated, e.g., laptop, gaming, budget-friendly)"
    className="input input-bordered w-full"
/>
```

#### Part 2: Queries Page Filtering
**File:** `/src/Pages/Queries.jsx`

**Lines 16-18:** State for filters
```javascript
const [selectedCategory, setSelectedCategory] = useState('');
const [selectedTag, setSelectedTag] = useState('');
```

**Lines 38-45:** Filter logic
```javascript
const filteredQueries = queries.filter(query => {
    const matchesSearch = query.productName?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || query.category === selectedCategory;
    const matchesTag = !selectedTag || (query.tags && query.tags.includes(selectedTag));
    return matchesSearch && matchesCategory && matchesTag;
});

const allTags = [...new Set(queries.flatMap(q => q.tags || []))].sort();
```

**Lines 50-90:** Filter UI dropdowns
```javascript
<select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
    <option value="">All Categories</option>
    {/* ... categories */}
</select>

<select value={selectedTag} onChange={e => setSelectedTag(e.target.value)}>
    <option value="">All Tags</option>
    {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
</select>
```

**Lines 95-110:** Display tags on cards
```javascript
{query.tags && query.tags.length > 0 && (
    <div className="flex flex-wrap gap-1 mt-2">
        {query.tags.map((tag, idx) => (
            <button
                onClick={() => setSelectedTag(tag)}
                className="badge badge-outline badge-sm cursor-pointer hover:badge-secondary"
            >
                {tag}
            </button>
        ))}
    </div>
)}
```

### What to Look For
- ✅ Tags input field (comma-separated)
- ✅ Category dropdown (9 categories)
- ✅ Filter dropdowns on Queries page
- ✅ Dynamic tag list from existing queries
- ✅ Clickable tag badges on query cards
- ✅ Clear Filters button

---

## Feature 3: User Profile Page

### Implementation Locations

#### Part 1: Profile Component
**File:** `/src/Pages/UserProfile.jsx` (NEW FILE - 200+ lines)

**Key Sections:**

**Lines 1-6:** Imports
```javascript
import { FaUser, FaQuestionCircle, FaComments, FaThumbsUp } from 'react-icons/fa';
```

**Lines 13-15:** State
```javascript
const [profileData, setProfileData] = useState(null);
const [userQueries, setUserQueries] = useState([]);
const [userRecommendations, setUserRecommendations] = useState([]);
const [activeTab, setActiveTab] = useState('queries');
```

**Lines 18-42:** Data fetching
```javascript
const fetchProfileData = async () => {
    // Fetch user's queries
    const queriesRes = await axios.get(`https://product-server-navy.vercel.app/my-queries?email=${email}`);
    
    // Fetch user's recommendations
    const recsRes = await axios.get(`https://product-server-navy.vercel.app/my-recommendations?email=${email}`);
    
    // Calculate total helpful votes
    const totalHelpful = recsRes.data.reduce((sum, rec) => sum + (rec.helpfulCount || 0), 0);
    
    setProfileData({
        email: email,
        totalQueries: queriesRes.data.length,
        totalRecommendations: recsRes.data.length,
        totalHelpfulVotes: totalHelpful
    });
};
```

**Lines 60-85:** Profile header with stats
```javascript
<div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg p-8">
    {/* Avatar */}
    {/* User info */}
    {/* Stats cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <FaQuestionCircle />
            <p className="text-3xl font-bold">{profileData.totalQueries}</p>
            <p>Queries Posted</p>
        </div>
        {/* Similar cards for recommendations and helpful votes */}
    </div>
</div>
```

**Lines 87-95:** Tabs
```javascript
<div className="tabs tabs-boxed">
    <button className={`tab ${activeTab === 'queries' ? 'tab-active' : ''}`}>
        Queries ({userQueries.length})
    </button>
    <button className={`tab ${activeTab === 'recommendations' ? 'tab-active' : ''}`}>
        Recommendations ({userRecommendations.length})
    </button>
</div>
```

#### Part 2: Router Configuration
**File:** `/src/Router/Router.jsx`

**Line 19:** Import
```javascript
import UserProfile from "../Pages/UserProfile";
```

**Lines 76-79:** Route
```javascript
{
    path: "/profile/:email",
    element: <PrivetRouter><UserProfile></UserProfile></PrivetRouter>,
},
```

#### Part 3: Navigation Links
**File:** `/src/Pages/Shared/NavBar.jsx`

**Lines 125-132:** Profile link in dropdown
```javascript
<li>
    <NavLink 
        to={`/profile/${user.email}`}
        onClick={() => setShowMenu(false)}
        className="btn btn-ghost btn-sm w-full justify-start"
    >
        My Profile
    </NavLink>
</li>
```

**File:** `/src/Pages/Recommend.jsx`

**Lines 238-242:** Clickable username
```javascript
<button 
    onClick={() => navigate(`/profile/${rec.recommenderEmail}`)}
    className="font-semibold text-blue-600 hover:underline"
>
    {rec.recommenderName || rec.recommenderEmail}
</button>
```

### What to Look For
- ✅ New `UserProfile.jsx` component
- ✅ Route with email parameter: `/profile/:email`
- ✅ "My Profile" link in navbar dropdown
- ✅ Clickable usernames in recommendations
- ✅ Three statistics cards
- ✅ Tabs for Queries and Recommendations

---

## Feature 4: Mark as Best Solution

### Implementation Location
**File:** `/src/Pages/Recommend.jsx`

### Key Code Sections

#### 1. Import Icon (Line 6)
```javascript
import { FaThumbsUp, FaCheckCircle } from 'react-icons/fa';
```

#### 2. Mark as Best Handler (Lines 110-145)
```javascript
const handleMarkAsBest = async (recommendationId) => {
    // Check if user is logged in
    if (!user) return;
    
    // Check if user is query owner
    if (!query || query.email !== user.email) {
        Swal.fire({ title: 'Not Authorized', text: 'Only the query owner can mark the best solution.' });
        return;
    }
    
    // Confirmation dialog
    const result = await Swal.fire({
        title: 'Mark as Best Solution?',
        showCancelButton: true,
        confirmButtonText: 'Yes, mark it!'
    });
    
    if (result.isConfirmed) {
        // Send PATCH request
        await axios.patch(`https://product-server-navy.vercel.app/recommendations/${recommendationId}/mark-best`, {
            queryId: id
        });
        
        await fetchRecommendations();
    }
};
```

#### 3. UI Rendering - Accepted Solution (Lines 170-210)
```javascript
{/* Accepted Solution First */}
{recommendations.filter(rec => rec.isAccepted).map(rec => (
    <div className="border-4 border-green-500 p-4 rounded-lg shadow-lg bg-green-50 relative">
        <div className="absolute -top-3 left-4 bg-green-500 text-white px-3 py-1 rounded-full">
            <FaCheckCircle /> Best Solution
        </div>
        {/* Recommendation content */}
    </div>
))}
```

#### 4. UI Rendering - Mark as Best Button (Lines 230-238)
```javascript
{isQueryOwner && (
    <button
        onClick={() => handleMarkAsBest(rec._id)}
        className="btn btn-sm btn-success gap-1"
        title="Mark this as the best solution"
    >
        <FaCheckCircle />
        Mark as Best
    </button>
)}
```

#### 5. Conditional Display Logic (Lines 215-220)
```javascript
const isQueryOwner = user && query && query.email === user.email;

// Split recommendations into accepted and not accepted
recommendations.filter(rec => rec.isAccepted)  // Show first
recommendations.filter(rec => !rec.isAccepted)  // Show after
```

### What to Look For
- ✅ `FaCheckCircle` icon import
- ✅ `handleMarkAsBest` function
- ✅ Authorization check for query owner
- ✅ Confirmation dialog before marking
- ✅ Green border/background for accepted solutions
- ✅ "Best Solution" badge at top
- ✅ "Mark as Best" button only visible to query owner
- ✅ Accepted solutions displayed first

---

## 🎨 Visual Design Elements

### Color Schemes Used

**Feature 1 - Helpful Counter:**
- Default: Blue outline button (`btn-outline btn-primary`)
- Voted: Green solid button (`btn-success`)

**Feature 2 - Tags & Categories:**
- Category badge: Primary color (`badge-primary`)
- Tag badges: Outline with hover effect (`badge-outline hover:badge-secondary`)

**Feature 3 - User Profile:**
- Header: Purple to blue gradient (`from-purple-500 to-blue-500`)
- Stats cards: White with transparency (`bg-white/20 backdrop-blur-sm`)
- Icons: White on gradient background

**Feature 4 - Best Solution:**
- Border: Green 4px (`border-4 border-green-500`)
- Background: Light green (`bg-green-50`)
- Badge: Green with white text (`bg-green-500 text-white`)
- Button: Green (`btn-success`)

### Icons Used (from react-icons/fa)

| Feature | Icon | Usage |
|---------|------|-------|
| Feature 1 | `FaThumbsUp` | Helpful button |
| Feature 3 | `FaUser` | Profile avatar placeholder |
| Feature 3 | `FaQuestionCircle` | Queries stat card |
| Feature 3 | `FaComments` | Recommendations stat card |
| Feature 3 | `FaThumbsUp` | Helpful votes stat card |
| Feature 4 | `FaCheckCircle` | Best solution badge & button |

---

## 🧪 Quick Testing Guide

### Test Feature 1 (Helpful Counter)
1. Go to any query: `/recommend/:id`
2. Look for "Helpful" button on recommendations
3. Click it (while logged in)
4. Should turn green and increment counter
5. Try clicking again - should show "already voted"

### Test Feature 2 (Tags & Categories)
1. Go to "Add Query" page: `/add-queries`
2. Fill form including category and tags
3. Submit query
4. Go to "Queries" page: `/queries`
5. Use category dropdown to filter
6. Click on a tag badge to filter by tag
7. Click "Clear Filters" to reset

### Test Feature 3 (User Profile)
1. Click on your avatar in navbar
2. Click "My Profile"
3. Should see your statistics
4. Switch between Queries and Recommendations tabs
5. Go to any recommendation
6. Click on the recommender's name
7. Should see their profile

### Test Feature 4 (Best Solution)
1. Create a query (or use existing one you own)
2. Have someone add a recommendation
3. Go to your query: `/recommend/:id`
4. You should see green "Mark as Best" button
5. Click it and confirm
6. Recommendation should move to top with green styling
7. Log in as different user - button should not appear

---

## 📋 Code Quality Checklist

- ✅ No linter errors in modified files
- ✅ All imports properly organized
- ✅ Consistent code formatting
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Error handling with SweetAlert2
- ✅ Loading states for async operations
- ✅ Accessibility (buttons have titles/aria-labels where needed)
- ✅ DRY principle followed (no duplicate code)
- ✅ Component reusability maintained
- ✅ Clean separation of concerns

---

## 🔍 Debugging Tips

### Feature Not Working?

**Check 1: Network Tab**
- Open browser DevTools → Network tab
- Look for API calls to backend
- Check if requests are returning expected data

**Check 2: Console Errors**
- Open browser DevTools → Console tab
- Look for any JavaScript errors
- Common issues: undefined variables, async timing

**Check 3: Backend Integration**
- Verify backend API is running
- Check if new fields exist in database
- Test endpoints with Postman/Thunder Client

**Check 4: Authentication**
- Ensure user is logged in for protected features
- Check if `user` context has correct data
- Verify JWT token is being sent

### Common Issues

**Issue:** "Already voted" shows immediately
- **Cause:** Backend not clearing `votedBy` array properly
- **Fix:** Check backend PATCH endpoint implementation

**Issue:** Tags not filtering
- **Cause:** Tags might be stored as string instead of array
- **Fix:** Ensure backend saves tags as array: `["tag1", "tag2"]`

**Issue:** "Mark as Best" button not appearing
- **Cause:** Query owner check failing
- **Fix:** Log `query.email` and `user.email` to console and compare

**Issue:** Profile shows 0 for all stats
- **Cause:** Backend not returning data for email filter
- **Fix:** Check API endpoint: `/my-queries?email=user@example.com`

---

## 📝 Summary of Changes

| File | Lines Changed | Type | Features |
|------|---------------|------|----------|
| `/src/Pages/Recommend.jsx` | ~100 | Modified | 1, 4 |
| `/src/Pages/Queries.jsx` | ~80 | Modified | 2 |
| `/src/Pages/MyQueries/AddQueries.jsx` | ~30 | Modified | 2 |
| `/src/Pages/UserProfile.jsx` | ~200 | **NEW** | 3 |
| `/src/Router/Router.jsx` | ~5 | Modified | 3 |
| `/src/Pages/Shared/NavBar.jsx` | ~10 | Modified | 3 |
| **Total** | **~425 lines** | | **All 4** |

---

## 🎓 Learning Points

These features demonstrate:

1. **State Management:** Managing complex UI states across components
2. **API Integration:** Making PATCH requests, handling responses
3. **Conditional Rendering:** Showing/hiding UI based on user roles
4. **Data Aggregation:** Combining data from multiple sources (profile stats)
5. **User Authorization:** Checking permissions before allowing actions
6. **Array Operations:** Filtering, mapping, reducing data
7. **Async/Await:** Handling asynchronous operations properly
8. **Error Handling:** Graceful error messages to users
9. **Responsive Design:** Mobile-first approach
10. **Component Architecture:** Clean, reusable code structure

---

**Happy Coding! 🚀**
