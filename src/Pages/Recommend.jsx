import React, { useEffect, useState, useContext } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import { FaThumbsUp, FaCheckCircle } from 'react-icons/fa';

const Recommend = () => {
    const { id } = useParams(); // query ID from URL
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [query, setQuery] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        productName: '',
        productImage: '',
        reason: '',
    });

    const fetchRecommendations = async () => {
        try {
            const recs = await axios.get(`https://product-server-navy.vercel.app/recommendations?queryId=${id}`);
        // Sort recommendations: accepted first, then by helpful count (descending), then by creation date
        const sortedRecs = recs.data.sort((a, b) => {
            // Accepted recommendations first
            if (a.isAccepted && !b.isAccepted) return -1;
            if (!a.isAccepted && b.isAccepted) return 1;
            
            // Then by helpful count
            const helpfulA = a.helpfulCount || 0;
            const helpfulB = b.helpfulCount || 0;
            if (helpfulA !== helpfulB) {
                return helpfulB - helpfulA;
            }
            
            // Finally by creation date
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
            setRecommendations(sortedRecs);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    const handleHelpfulClick = async (recommendationId) => {
        if (!user) {
            alert('Please log in to vote for recommendations');
            return;
        }

        try {
            await axios.post(`https://product-server-navy.vercel.app/recommendations/${recommendationId}/helpful`, {
                userEmail: user.email
            });
            // Refresh recommendations to get updated counts
            fetchRecommendations();
        } catch (error) {
            console.error('Error voting for recommendation:', error);
            alert('Error voting for recommendation. Please try again.');
        }
    };

    const isVotedByUser = (recommendation) => {
        return recommendation.votedBy && recommendation.votedBy.includes(user?.email);
    };

    const handleMarkAsBest = async (recommendationId) => {
        if (!user) {
            alert('Please log in to mark recommendations as best solution');
            return;
        }

        if (user.email !== query?.userEmail) {
            alert('Only the query owner can mark recommendations as best solution');
            return;
        }

        try {
            await axios.post(`https://product-server-navy.vercel.app/recommendations/${recommendationId}/mark-best`, {
                queryId: id
            });
            // Refresh data to get updated status
            fetchRecommendations();
        } catch (error) {
            console.error('Error marking recommendation as best:', error);
            alert('Error marking recommendation as best. Please try again.');
        }
    };

    const isQueryOwner = user?.email === query?.userEmail;

    useEffect(() => {
        // Fetch query details
        axios.get(`https://product-server-navy.vercel.app/my-queries/${id}`).then(res => setQuery(res.data));

        // Fetch recommendations
        fetchRecommendations();
    }, [id]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            queryId: id,
            queryTitle: query?.title || query?.queryTitle,
            recommenderEmail: user?.email,
            recommenderName: user?.name,
            createdAt: new Date().toISOString(),
        };

        // Save recommendation
        await axios.post('https://product-server-navy.vercel.app/recommendations', payload);

        // Refetch updated recommendations
        fetchRecommendations();

        // Clear form
        setFormData({ title: '', productName: '', productImage: '', reason: '' });
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <button to="/my-queries"
                onClick={() => window.history.back()}
                className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                &larr; Back
            </button>
            {query && (
                <>
                    <h2 className="text-2xl font-bold mb-2">{query.title || query.queryTitle}</h2>
                    {query.image && (
                        <img src={query.image} alt="product" className="w-32 h-32 object-cover mt-2" />
                    )}
                    <p><strong>Product:</strong> {query.productName}</p>
                    <p className="mt-2"><strong>Brand</strong> {query.brand}</p>
                    <p><strong>Created by:</strong> {query.userName} ({query.userEmail})</p>
                </>
            )}

            {/* Add Recommendation Form */}
            <div className="mt-6 border-t pt-4">
                <h3 className="text-xl font-semibold mb-2">Add A Recommendation</h3>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <input
                        name="title"
                        placeholder="Recommendation Title"
                        value={formData.title}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                    <input
                        name="productName"
                        placeholder="Recommended Product Name"
                        value={formData.productName}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                    <input
                        name="productImage"
                        type="url"
                        placeholder="Recommended Product Image URL (must be a valid image link)"
                        value={formData.productImage}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                    <textarea
                        name="reason"
                        placeholder="Recommendation Reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2">Add Recommendation</button>
                </form>
            </div>

            {/* Recommendation List */}
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">All Recommendations ({recommendations.length})</h3>
                {recommendations.length === 0 ? (
                    <p className="text-gray-500">No recommendations yet.</p>
                ) : (
                    <div className="space-y-4">
                        {recommendations.map(rec => (
                            <div key={rec._id} className={`border rounded-lg p-6 shadow-sm ${
                                rec.isAccepted 
                                    ? 'border-green-500 bg-green-50' 
                                    : 'border-gray-200 bg-white'
                            }`}>
                                {rec.isAccepted && (
                                    <div className="flex items-center gap-2 mb-3 text-green-700">
                                        <FaCheckCircle className="text-lg" />
                                        <span className="font-semibold">Best Solution</span>
                                    </div>
                                )}
                                
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="text-lg font-semibold text-gray-800">{rec.title}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">
                                            {rec.helpfulCount || 0} helpful
                                        </span>
                                        <button
                                            onClick={() => handleHelpfulClick(rec._id)}
                                            disabled={!user || isVotedByUser(rec)}
                                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                                                isVotedByUser(rec)
                                                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
                                            }`}
                                        >
                                            <FaThumbsUp className="text-xs" />
                                            {isVotedByUser(rec) ? 'Voted' : 'Helpful'}
                                        </button>
                                        {isQueryOwner && !rec.isAccepted && (
                                            <button
                                                onClick={() => handleMarkAsBest(rec._id)}
                                                className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                                            >
                                                <FaCheckCircle className="text-xs" />
                                                Mark as Best
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <p className="text-gray-600">
                                        <strong>Product:</strong> {rec.productName}
                                    </p>
                                    {rec.productImage && (
                                        <img 
                                            src={rec.productImage} 
                                            alt={rec.productName} 
                                            className="w-32 h-32 object-cover mt-2 rounded"
                                        />
                                    )}
                                </div>
                                
                                <p className="text-gray-700 mb-3">
                                    <strong>Reason:</strong> {rec.reason}
                                </p>
                                
                                <div className="text-sm text-gray-500 border-t pt-3">
                                    <p>
                                        By <button 
                                            onClick={() => navigate(`/profile/${rec.recommenderEmail}`)}
                                            className="text-blue-600 hover:text-blue-800 underline font-semibold"
                                        >
                                            {rec.recommenderName || rec.recommenderEmail}
                                        </button> on{' '}
                                        {rec.createdAt ? new Date(rec.createdAt).toLocaleString() : 'Unknown date'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default Recommend;