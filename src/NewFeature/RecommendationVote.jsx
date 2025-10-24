import React from 'react';
// We'll use a popular icon library, react-icons. 
// Install it with: npm install react-icons
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './Recommendation.css';

/**
 * Displays a single recommendation card with voting controls.
 *
 * @param {object} props
 * @param {object} props.recommendation - The recommendation object.
 * (e.g., { _id, productName, comment, upvotes: [email1], downvotes: [email2] })
 * @param {string} props.currentUserEmail - The email of the currently logged-in user.
 * @param {function} props.onVote - Callback function: (recommendationId, 'up' | 'down')
 */
const RecommendationVote = ({ recommendation, currentUserEmail, onVote }) => {
  
  // --- 1. Calculate Derived Data ---
  // Use optional chaining (?) for safety in case arrays are missing
  const voteCount = (recommendation.upvotes?.length || 0) - (recommendation.downvotes?.length || 0);
  
  // Check if the current user is in either array
  const hasUpvoted = recommendation.upvotes?.includes(currentUserEmail);
  const hasDownvoted = recommendation.downvotes?.includes(currentUserEmail);

  // --- 2. Event Handlers ---
  // These handlers just pass the ID and vote type up to the parent
  const handleUpvote = () => {
    onVote(recommendation._id, 'up');
  };

  const handleDownvote = () => {
    onVote(recommendation._id, 'down');
  };

  return (
    <div className="recommendation-card">
      <div className="vote-controls">
        <button 
          onClick={handleUpvote} 
          // Dynamically add the 'active' class
          className={`vote-btn upvote ${hasUpvoted ? 'active' : ''}`}
          aria-label="Upvote"
        >
          <FaArrowUp />
        </button>
        
        <span className="vote-count">{voteCount}</span>
        
        <button 
          onClick={handleDownvote}
          className={`vote-btn downvote ${hasDownvoted ? 'active' : ''}`}
          aria-label="Downvote"
        >
          <FaArrowDown />
        </button>
      </div>
      
      <div className="recommendation-content">
        {/* Display the actual recommendation details */}
        <h4>{recommendation.productName}</h4>
        <p>{recommendation.comment}</p>
        <small>Recommended by: {recommendation.userEmail}</small>
      </div>
    </div>
  );
};

export default RecommendationVote;