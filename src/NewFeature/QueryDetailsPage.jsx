import React, { useState, useMemo, useEffect } from 'react';
import RecommendationVote from './RecommendationVote';
import './Recommendation.css';

// --- We no longer use Mock Data ---
// const MOCK_RECOMMENDATIONS = [ ... ];
// const CURRENT_USER_EMAIL = 'alice@example.com'; 

// This component now takes props for the query ID and the user's email
const QueryDetailsPage = ({ queryId, currentUserEmail }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 1. DATA FETCHING ---
  // Use useEffect to fetch data when the component loads or queryId changes
  useEffect(() => {
    // Don't fetch if there's no queryId
    if (!queryId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Use the backend URL you provided
    fetch(`https://product-server-navy.vercel.app/recommendations/${queryId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        setRecommendations(data);
      })
      .catch(err => {
        console.error("Failed to fetch recommendations:", err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [queryId]); // Re-run this effect if the queryId prop changes

  
  // --- 2. UPDATED VOTE HANDLER ---
  /**
   * This function now does two things:
   * 1. (Optimistic Update): Updates the UI immediately.
   * 2. (API Call): Sends the vote to your backend to save it.
   */
  const handleVote = async (recommendationId, voteType) => {
    if (!currentUserEmail) {
      alert("Please log in to vote.");
      return;
    }

    // --- Part 1: Optimistic UI Update ---
    // This updates the screen *instantly* for a fast user experience.
    // We store the *previous* state in case we need to roll back.
    const previousRecommendations = [...recommendations];

    setRecommendations(prevRecs =>
      prevRecs.map(rec => {
        if (rec._id !== recommendationId) return rec; // Not the one we're voting on

        // Create a copy of the recommendation to modify
        const newRec = { ...rec };
        const hasUpvoted = newRec.upvotes.includes(currentUserEmail);
        const hasDownvoted = newRec.downvotes.includes(currentUserEmail);

        // Remove user from both arrays first to handle vote-switching
        newRec.upvotes = newRec.upvotes.filter(email => email !== currentUserEmail);
        newRec.downvotes = newRec.downvotes.filter(email => email !== currentUserEmail);

        // Add user to the correct array if they weren't already there
        if (voteType === 'up' && !hasUpvoted) {
          newRec.upvotes.push(currentUserEmail);
        } else if (voteType === 'down' && !hasDownvoted) {
          newRec.downvotes.push(currentUserEmail);
        }
        return newRec;
      })
    );

    // --- Part 2: API Call to Backend ---
    try {
      // **IMPORTANT:** I am *guessing* your vote endpoint URL.
      // You might need to change this URL to match your backend route.
      // A common pattern is PATCH /recommendations/:recommendationId
      const response = await fetch(`https://product-server-navy.vercel.app/recommendations/${recommendationId}`, {
        method: 'PATCH', // PATCH is used for updating a resource
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voteType: voteType,
          userEmail: currentUserEmail
          // Your backend *must* be set up to receive these fields
        })
      });

      if (!response.ok) {
        // If the server fails, throw an error to trigger the 'catch' block
        throw new Error('Vote failed to save on server.');
      }
      
      // If successful, do nothing. Our optimistic update is correct.
      console.log('Vote saved!');

    } catch (err) {
      console.error("Failed to submit vote:", err);
      // **Rollback!** If the API call fails,
      // reset the state to what it was before our optimistic update.
      alert('Your vote could not be saved. Please try again.');
      setRecommendations(previousRecommendations);
    }
  };

  // --- 3. SORTING (No change needed) ---
  const sortedRecommendations = useMemo(() => {
    if (sortBy === 'top') {
      return [...recommendations].sort((a, b) => {
        const voteA = (a.upvotes?.length || 0) - (a.downvotes?.length || 0);
        const voteB = (b.upvotes?.length || 0) - (b.downvotes?.length || 0);
        return voteB - voteA;
      });
    }
    return recommendations;
  }, [recommendations, sortBy]);

  // --- 4. RENDER (Added loading/error states) ---
  if (isLoading) {
    return <div>Loading recommendations...</div>;
  }

  if (error) {
    return <div>Error: Failed to load recommendations. {error}</div>;
  }

  return (
    <div className="query-details-container">
      <h2>Product Recommendations</h2>
      
      <div className="sort-controls">
        <p>Sort by:</p>
        <button 
          onClick={() => setSortBy('default')}
          className={sortBy === 'default' ? 'active' : ''}
        >
          Default
        </button>
        <button 
          onClick={() => setSortBy('top')}
          className={sortBy === 'top' ? 'active' : ''}
        >
          Top Rated
        </button>
      </div>

      <div className="recommendations-list">
        {sortedRecommendations.length === 0 ? (
          <p>No recommendations submitted yet. Be the first!</p>
        ) : (
          sortedRecommendations.map(rec => (
            <RecommendationVote 
              key={rec._id}
              recommendation={rec}
              // Pass the prop down to the child component
              currentUserEmail={currentUserEmail}
              onVote={handleVote}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default QueryDetailsPage;