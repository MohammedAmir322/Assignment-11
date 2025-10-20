import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';
import Swal from 'sweetalert2';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';

const QueriesCardDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [query, setQuery] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    const fetchData = async () => {
        try {
            const queryRes = await axios.get(`https://product-server-navy.vercel.app/queries/${id}`);
            setQuery(queryRes.data);

            const recs = await axios.get(`https://product-server-navy.vercel.app/recommendations?queryId=${id}`);
            // Sort recommendations by helpful count (descending) and then by accepted status
            const sortedRecs = recs.data.sort((a, b) => {
                if (a.isAccepted && !b.isAccepted) return -1;
                if (!a.isAccepted && b.isAccepted) return 1;
                return (b.helpfulCount || 0) - (a.helpfulCount || 0);
            });
            setRecommendations(sortedRecs);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleVoteHelpful = async (recommendationId) => {
        if (!user) {
            Swal.fire('Please login', 'You need to be logged in to vote', 'warning');
            return;
        }

        try {
            const response = await axios.post(`https://product-server-navy.vercel.app/recommendations/${recommendationId}/vote`, {
                userEmail: user.email
            });
            
            if (response.data.success) {
                // Refresh recommendations to show updated counts
                await fetchData();
                Swal.fire({
                    title: 'Vote recorded!',
                    text: response.data.message,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            if (error.response?.status === 400) {
                Swal.fire('Already voted', 'You have already voted for this recommendation', 'info');
            } else {
                Swal.fire('Error', 'Failed to record vote', 'error');
            }
        }
    };

    const handleMarkAsBest = async (recommendationId) => {
        if (!user || user.email !== query?.email) {
            Swal.fire('Not authorized', 'Only the query owner can mark the best solution', 'warning');
            return;
        }

        try {
            const response = await axios.post(`https://product-server-navy.vercel.app/recommendations/${recommendationId}/mark-best`, {
                queryId: id
            });
            
            if (response.data.success) {
                await fetchData();
                Swal.fire({
                    title: 'Best solution marked!',
                    text: 'This recommendation has been marked as the best solution',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to mark as best solution', 'error');
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <button
                onClick={() => window.history.back()}
                className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                &larr; Back
            </button>

            {query && (
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">{query.title || query.queryTitle}</h2>
                    <p><strong>Product:</strong> {query.productName}</p>
                    {query.productImage && (
                        <img src={query.productImage} alt="product" className="w-32 h-32 object-cover mt-2" />
                    )}
                    <p className="mt-2"><strong>Brand:</strong> {query.productBrand}</p>
                    {query.category && (
                        <p><strong>Category:</strong> <span className="badge badge-outline">{query.category}</span></p>
                    )}
                    {query.tags && query.tags.length > 0 && (
                        <div className="mt-2">
                            <strong>Tags:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {query.tags.map((tag, index) => (
                                    <span key={index} className="badge badge-primary badge-sm">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    <p><strong>Created by:</strong> 
                        <button 
                            onClick={() => navigate(`/user/${query.userEmail || query.email}`)}
                            className="link link-primary ml-1"
                        >
                            {query.userName || query.userEmail || query.email}
                        </button>
                    </p>
                    <p><strong>Recommendations:</strong> {query.recommendationCount || 0}</p>
                    <p><strong>User:</strong> {query.email || 'N/A'}</p>
                    {query.isResolved && (
                        <div className="alert alert-success mt-2">
                            <span>✅ This query has been resolved with a best solution!</span>
                        </div>
                    )}
                </div>
            )}

            {/* Recommendations Section */}
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Recommendations ({recommendations.length})</h3>
                {recommendations.length === 0 ? (
                    <p className="text-gray-500">No recommendations yet. Be the first to recommend a solution!</p>
                ) : (
                    <div className="space-y-4">
                        {recommendations.map(rec => (
                            <div key={rec._id} className={`border rounded-lg p-4 ${rec.isAccepted ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                                {rec.isAccepted && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="badge badge-success">✅ Best Solution</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-lg">{rec.title}</h4>
                                        <p><strong>Recommended Product:</strong> {rec.productName}</p>
                                        {rec.productImage && (
                                            <img src={rec.productImage} alt="recommended product" className="w-24 h-24 object-cover mt-2 rounded" />
                                        )}
                                        <p className="mt-2"><strong>Reason:</strong> {rec.reason}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            By 
                                            <button 
                                                onClick={() => navigate(`/user/${rec.recommenderEmail}`)}
                                                className="link link-primary ml-1"
                                            >
                                                {rec.recommenderName || rec.recommenderEmail}
                                            </button>
                                            on {rec.createdAt ? new Date(rec.createdAt).toLocaleString() : ''}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between border-t pt-3">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handleVoteHelpful(rec._id)}
                                            className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
                                                rec.votedBy?.includes(user?.email) 
                                                    ? 'bg-blue-100 text-blue-700' 
                                                    : 'bg-gray-100 hover:bg-blue-50 text-gray-700'
                                            }`}
                                            disabled={rec.votedBy?.includes(user?.email)}
                                        >
                                            {rec.votedBy?.includes(user?.email) ? <AiFillLike /> : <AiOutlineLike />}
                                            <span>Helpful ({rec.helpfulCount || 0})</span>
                                        </button>
                                    </div>
                                    
                                    {user && user.email === query?.email && !rec.isAccepted && (
                                        <button
                                            onClick={() => handleMarkAsBest(rec._id)}
                                            className="btn btn-success btn-sm"
                                        >
                                            Mark as Best Solution
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QueriesCardDetails;
