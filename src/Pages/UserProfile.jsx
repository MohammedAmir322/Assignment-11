import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import { FaUser, FaQuestionCircle, FaComments, FaThumbsUp } from 'react-icons/fa';

const UserProfile = () => {
    const { email } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [userQueries, setUserQueries] = useState([]);
    const [userRecommendations, setUserRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('queries'); // 'queries' or 'recommendations'

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                // Fetch user's queries
                const queriesRes = await axios.get(`https://product-server-navy.vercel.app/my-queries?email=${email}`);
                setUserQueries(queriesRes.data);

                // Fetch user's recommendations
                const recsRes = await axios.get(`https://product-server-navy.vercel.app/my-recommendations?email=${email}`);
                setUserRecommendations(recsRes.data);

                // Calculate total helpful votes received
                const totalHelpful = recsRes.data.reduce((sum, rec) => sum + (rec.helpfulCount || 0), 0);

                setProfileData({
                    email: email,
                    totalQueries: queriesRes.data.length,
                    totalRecommendations: recsRes.data.length,
                    totalHelpfulVotes: totalHelpful
                });
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (email) {
            fetchProfileData();
        }
    }, [email]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="max-w-4xl mx-auto mt-10 p-6">
                <p className="text-center text-gray-500">Profile not found.</p>
            </div>
        );
    }

    const isOwnProfile = user && user.email === email;

    return (
        <div className="max-w-6xl mx-auto mt-6 p-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg p-8 text-white mb-6">
                <div className="flex items-center gap-6">
                    <div className="avatar placeholder">
                        <div className="bg-white text-purple-600 rounded-full w-24 h-24 flex items-center justify-center">
                            <FaUser className="text-5xl" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {isOwnProfile ? 'Your Profile' : `${email.split('@')[0]}'s Profile`}
                        </h1>
                        <p className="text-white/90">{email}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                        <FaQuestionCircle className="text-4xl mx-auto mb-2" />
                        <p className="text-3xl font-bold">{profileData.totalQueries}</p>
                        <p className="text-sm opacity-90">Queries Posted</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                        <FaComments className="text-4xl mx-auto mb-2" />
                        <p className="text-3xl font-bold">{profileData.totalRecommendations}</p>
                        <p className="text-sm opacity-90">Recommendations Made</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                        <FaThumbsUp className="text-4xl mx-auto mb-2" />
                        <p className="text-3xl font-bold">{profileData.totalHelpfulVotes}</p>
                        <p className="text-sm opacity-90">Helpful Votes Received</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs tabs-boxed bg-base-200 mb-4">
                <button
                    className={`tab ${activeTab === 'queries' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('queries')}
                >
                    Queries ({userQueries.length})
                </button>
                <button
                    className={`tab ${activeTab === 'recommendations' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('recommendations')}
                >
                    Recommendations ({userRecommendations.length})
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow p-6">
                {activeTab === 'queries' ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Queries Posted</h2>
                        {userQueries.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No queries posted yet.</p>
                        ) : (
                            <div className="grid gap-4">
                                {userQueries.map(query => (
                                    <div
                                        key={query._id}
                                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => navigate(`/recommend/${query._id}`)}
                                    >
                                        <div className="flex gap-4">
                                            {query.productImage && (
                                                <img
                                                    src={query.productImage}
                                                    alt={query.productName}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg">{query.queryTitle}</h3>
                                                <p className="text-sm text-gray-600">Product: {query.productName}</p>
                                                {query.category && (
                                                    <span className="badge badge-primary badge-sm mt-1">{query.category}</span>
                                                )}
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {new Date(query.createdAt).toLocaleDateString()} • {query.recommendationCount || 0} recommendations
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Recommendations Made</h2>
                        {userRecommendations.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No recommendations made yet.</p>
                        ) : (
                            <div className="grid gap-4">
                                {userRecommendations.map(rec => (
                                    <div
                                        key={rec._id}
                                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg">{rec.title}</h3>
                                                <p className="text-sm text-gray-600">
                                                    Recommended Product: <strong>{rec.productName}</strong>
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    For query: {rec.queryTitle}
                                                </p>
                                                {rec.productImage && (
                                                    <img
                                                        src={rec.productImage}
                                                        alt={rec.productName}
                                                        className="w-24 h-24 object-cover rounded mt-2"
                                                    />
                                                )}
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {new Date(rec.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded">
                                                <FaThumbsUp className="text-green-600" />
                                                <span className="font-semibold text-green-700">
                                                    {rec.helpfulCount || 0}
                                                </span>
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
