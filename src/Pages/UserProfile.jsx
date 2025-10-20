import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';

const UserProfile = () => {
    const { email } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [userQueries, setUserQueries] = useState([]);
    const [userRecommendations, setUserRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('queries');
    const [stats, setStats] = useState({
        totalQueries: 0,
        totalRecommendations: 0,
        totalHelpfulVotes: 0,
        resolvedQueries: 0
    });

    useEffect(() => {
        if (email) {
            fetchUserProfile();
        }
    }, [email]);

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            // Fetch user queries
            const queriesRes = await axios.get(`https://product-server-navy.vercel.app/user-queries?email=${email}`);
            setUserQueries(queriesRes.data);

            // Fetch user recommendations
            const recommendationsRes = await axios.get(`https://product-server-navy.vercel.app/my-recommendations?email=${email}`);
            setUserRecommendations(recommendationsRes.data);

            // Calculate stats
            const totalQueries = queriesRes.data.length;
            const totalRecommendations = recommendationsRes.data.length;
            const resolvedQueries = queriesRes.data.filter(q => q.isResolved).length;
            const totalHelpfulVotes = recommendationsRes.data.reduce((sum, rec) => sum + (rec.helpfulCount || 0), 0);

            setStats({
                totalQueries,
                totalRecommendations,
                totalHelpfulVotes,
                resolvedQueries
            });

            // Set profile data (using email as identifier)
            setProfileData({
                email: email,
                displayName: queriesRes.data[0]?.userName || recommendationsRes.data[0]?.recommenderName || email.split('@')[0]
            });

        } catch (error) {
            console.error('Error fetching user profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-600">User not found</h2>
                    <button onClick={() => navigate('/')} className="btn btn-primary mt-4">
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <button
                onClick={() => window.history.back()}
                className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                ← Back
            </button>

            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center gap-6">
                    <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-24 h-24">
                            <span className="text-3xl font-bold">
                                {profileData.displayName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-800">{profileData.displayName}</h1>
                        <p className="text-gray-600">{profileData.email}</p>
                        {user && user.email === email && (
                            <span className="badge badge-primary mt-2">Your Profile</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="stat bg-white rounded-lg shadow-md">
                    <div className="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Total Queries</div>
                    <div className="stat-value text-primary">{stats.totalQueries}</div>
                </div>

                <div className="stat bg-white rounded-lg shadow-md">
                    <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Recommendations</div>
                    <div className="stat-value text-secondary">{stats.totalRecommendations}</div>
                </div>

                <div className="stat bg-white rounded-lg shadow-md">
                    <div className="stat-figure text-accent">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Helpful Votes</div>
                    <div className="stat-value text-accent">{stats.totalHelpfulVotes}</div>
                </div>

                <div className="stat bg-white rounded-lg shadow-md">
                    <div className="stat-figure text-success">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Resolved Queries</div>
                    <div className="stat-value text-success">{stats.resolvedQueries}</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs tabs-boxed mb-6">
                <button 
                    className={`tab ${activeTab === 'queries' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('queries')}
                >
                    Queries ({stats.totalQueries})
                </button>
                <button 
                    className={`tab ${activeTab === 'recommendations' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('recommendations')}
                >
                    Recommendations ({stats.totalRecommendations})
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
                {activeTab === 'queries' && (
                    <div>
                        <h3 className="text-xl font-bold mb-4">User Queries</h3>
                        {userQueries.length === 0 ? (
                            <p className="text-gray-500">No queries posted yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {userQueries.map(query => (
                                    <div key={query._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <img
                                            src={query.productImage}
                                            alt={query.productName}
                                            className="w-full h-32 object-cover rounded mb-3"
                                        />
                                        <h4 className="font-semibold text-lg mb-2">{query.queryTitle}</h4>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <strong>Product:</strong> {query.productName}
                                        </p>
                                        {query.category && (
                                            <p className="text-sm text-gray-600 mb-1">
                                                <strong>Category:</strong> <span className="badge badge-outline badge-xs">{query.category}</span>
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-600 mb-2">
                                            <strong>Recommendations:</strong> {query.recommendationCount || 0}
                                        </p>
                                        {query.isResolved && (
                                            <span className="badge badge-success badge-sm">Resolved</span>
                                        )}
                                        <div className="mt-3">
                                            <button
                                                onClick={() => navigate(`/queriesCardDetails/${query._id}`)}
                                                className="btn btn-primary btn-sm w-full"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'recommendations' && (
                    <div>
                        <h3 className="text-xl font-bold mb-4">User Recommendations</h3>
                        {userRecommendations.length === 0 ? (
                            <p className="text-gray-500">No recommendations made yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {userRecommendations.map(rec => (
                                    <div key={rec._id} className={`border rounded-lg p-4 ${rec.isAccepted ? 'border-green-500 bg-green-50' : ''}`}>
                                        {rec.isAccepted && (
                                            <span className="badge badge-success mb-2">✅ Best Solution</span>
                                        )}
                                        <div className="flex gap-4">
                                            {rec.productImage && (
                                                <img
                                                    src={rec.productImage}
                                                    alt={rec.productName}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h4 className="font-semibold">{rec.title}</h4>
                                                <p className="text-sm text-gray-600">
                                                    <strong>Product:</strong> {rec.productName}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="text-sm text-gray-500">
                                                        👍 {rec.helpfulCount || 0} helpful votes
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;