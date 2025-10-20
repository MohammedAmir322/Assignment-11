import React, { useEffect, useState, useContext } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';
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
            // Fetch recommendations for this specific query
            const res = await axios.get(`https://product-server-navy.vercel.app/recommendations?queryId=${id}`);
            // Sort by helpful count (highest first)
            const sorted = res.data.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
            setRecommendations(sorted);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setRecommendations([]);
        }
    };

    useEffect(() => {
        // Fetch query details
        axios.get(`https://product-server-navy.vercel.app/my-queries/${id}`).then(res => setQuery(res.data));
        
        // Fetch recommendations for this query
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
            recommenderName: user?.displayName || user?.name,
            createdAt: new Date().toISOString(),
            helpfulCount: 0,
            votedBy: [],
        };

        try {
            // Save recommendation
            await axios.post('https://product-server-navy.vercel.app/recommendations', payload);
            
            Swal.fire({
                icon: 'success',
                title: 'Recommendation Added!',
                text: 'Your recommendation has been posted successfully.',
                timer: 2000,
                showConfirmButton: false
            });

            // Refetch updated recommendations
            await fetchRecommendations();

            // Clear form
            setFormData({ title: '', productName: '', productImage: '', reason: '' });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add recommendation. Please try again.',
            });
        }
    };

    const handleHelpful = async (recommendationId, votedBy) => {
        if (!user) {
            Swal.fire({
                icon: 'warning',
                title: 'Login Required',
                text: 'Please login to mark recommendations as helpful.',
            });
            return;
        }

        // Check if user already voted
        if (votedBy && votedBy.includes(user.email)) {
            Swal.fire({
                icon: 'info',
                title: 'Already Voted',
                text: 'You have already marked this recommendation as helpful.',
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }

        try {
            await axios.patch(`https://product-server-navy.vercel.app/recommendations/${recommendationId}/helpful`, {
                userEmail: user.email
            });

            // Refetch recommendations to update UI
            await fetchRecommendations();

            Swal.fire({
                icon: 'success',
                title: 'Thanks!',
                text: 'Marked as helpful.',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to mark as helpful. Please try again.',
            });
        }
    };

    const handleMarkAsBest = async (recommendationId) => {
        if (!user) {
            Swal.fire({
                icon: 'warning',
                title: 'Login Required',
                text: 'Please login to mark a best solution.',
            });
            return;
        }

        if (!query || query.email !== user.email) {
            Swal.fire({
                icon: 'error',
                title: 'Not Authorized',
                text: 'Only the query owner can mark the best solution.',
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Mark as Best Solution?',
            text: 'This will mark this recommendation as the accepted answer for your query.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, mark it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await axios.patch(`https://product-server-navy.vercel.app/recommendations/${recommendationId}/mark-best`, {
                    queryId: id
                });

                // Refetch recommendations to update UI
                await fetchRecommendations();

                Swal.fire({
                    icon: 'success',
                    title: 'Marked as Best Solution!',
                    text: 'This recommendation is now highlighted as the accepted answer.',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to mark as best solution. Please try again.',
                });
            }
        }
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
                    <p className="text-gray-500">No recommendations yet. Be the first to recommend!</p>
                ) : (
                    <>
                        {/* Accepted Solution First */}
                        {recommendations.filter(rec => rec.isAccepted).map(rec => {
                            const hasVoted = user && rec.votedBy && rec.votedBy.includes(user.email);
                            const isQueryOwner = user && query && query.email === user.email;
                            return (
                                <div key={rec._id} className="border-4 border-green-500 p-4 mb-4 rounded-lg shadow-lg bg-green-50 relative">
                                    <div className="absolute -top-3 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                        <FaCheckCircle /> Best Solution
                                    </div>
                                    <div className="flex justify-between items-start mt-2">
                                        <div className="flex-1">
                                            <p className="font-semibold text-xl text-green-800">{rec.title}</p>
                                            <p className="mt-1"><strong>Product:</strong> {rec.productName}</p>
                                            {rec.productImage && <img src={rec.productImage} alt="product" className="w-32 h-32 object-cover mt-2 rounded" />}
                                            <p className="mt-2"><strong>Reason:</strong> {rec.reason}</p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                By <button 
                                                    onClick={() => navigate(`/profile/${rec.recommenderEmail}`)}
                                                    className="font-semibold text-blue-600 hover:underline"
                                                >
                                                    {rec.recommenderName || rec.recommenderEmail}
                                                </button> on {rec.createdAt ? new Date(rec.createdAt).toLocaleString() : ''}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 ml-4">
                                            <button
                                                onClick={() => handleHelpful(rec._id, rec.votedBy)}
                                                disabled={hasVoted}
                                                className={`btn btn-sm gap-2 ${hasVoted ? 'btn-success' : 'btn-outline btn-primary'}`}
                                                title={hasVoted ? 'You found this helpful' : 'Mark as helpful'}
                                            >
                                                <FaThumbsUp className={hasVoted ? 'text-white' : ''} />
                                                Helpful
                                            </button>
                                            <span className="text-sm font-semibold">{rec.helpfulCount || 0} {(rec.helpfulCount || 0) === 1 ? 'person' : 'people'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Other Recommendations */}
                        {recommendations.filter(rec => !rec.isAccepted).map(rec => {
                            const hasVoted = user && rec.votedBy && rec.votedBy.includes(user.email);
                            const isQueryOwner = user && query && query.email === user.email;
                            return (
                                <div key={rec._id} className="border p-4 mb-3 rounded shadow-sm bg-white">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="font-semibold text-lg">{rec.title}</p>
                                            <p className="mt-1"><strong>Product:</strong> {rec.productName}</p>
                                            {rec.productImage && <img src={rec.productImage} alt="product" className="w-32 h-32 object-cover mt-2 rounded" />}
                                            <p className="mt-2"><strong>Reason:</strong> {rec.reason}</p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                By <button 
                                                    onClick={() => navigate(`/profile/${rec.recommenderEmail}`)}
                                                    className="font-semibold text-blue-600 hover:underline"
                                                >
                                                    {rec.recommenderName || rec.recommenderEmail}
                                                </button> on {rec.createdAt ? new Date(rec.createdAt).toLocaleString() : ''}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center gap-2 ml-4">
                                            {isQueryOwner && (
                                                <button
                                                    onClick={() => handleMarkAsBest(rec._id)}
                                                    className="btn btn-sm btn-success gap-1 w-full"
                                                    title="Mark this as the best solution"
                                                >
                                                    <FaCheckCircle />
                                                    Mark as Best
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleHelpful(rec._id, rec.votedBy)}
                                                disabled={hasVoted}
                                                className={`btn btn-sm gap-2 ${hasVoted ? 'btn-success' : 'btn-outline btn-primary'}`}
                                                title={hasVoted ? 'You found this helpful' : 'Mark as helpful'}
                                            >
                                                <FaThumbsUp className={hasVoted ? 'text-white' : ''} />
                                                Helpful
                                            </button>
                                            <span className="text-sm font-semibold">{rec.helpfulCount || 0} {(rec.helpfulCount || 0) === 1 ? 'person' : 'people'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );
};
export default Recommend;