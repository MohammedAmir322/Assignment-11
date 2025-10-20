import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import { FaUser, FaQuestionCircle, FaLightbulb, FaThumbsUp, FaCalendarAlt } from 'react-icons/fa';

const UserProfile = () => {
    const { userEmail } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('queries');

    useEffect(() => {
        fetchProfileData();
    }, [userEmail]);

    const fetchProfileData = async () => {
        setLoading(true);
        try {
            // Fetch user's queries
            const queriesRes = await axios.get(`https://product-server-navy.vercel.app/my-queries?email=${userEmail}`);
            
            // Fetch user's recommendations
            const recommendationsRes = await axios.get(`https://product-server-navy.vercel.app/my-recommendations?email=${userEmail}`);
            
            // Calculate total helpful votes received
            const totalHelpfulVotes = recommendationsRes.data.reduce((total, rec) => {
                return total + (rec.helpfulCount || 0);
            }, 0);

            setProfileData({
                userEmail,
                queries: queriesRes.data,
                recommendations: recommendationsRes.data,
                totalQueries: queriesRes.data.length,
                totalRecommendations: recommendationsRes.data.length,
                totalHelpfulVotes
            });
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg"></div>
                    <p className="mt-4">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-600">Profile not found</h2>
                    <p className="mt-2 text-gray-500">The user profile you're looking for doesn't exist.</p>
                    <button 
                        onClick={() => navigate(-1)}
                        className="btn btn-primary mt-4"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                &larr; Back
            </button>

            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                        <FaUser className="text-3xl text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {profileData.userEmail}
                        </h1>
                        <p className="text-gray-600">Community Member</p>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <FaQuestionCircle className="text-2xl text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-800">{profileData.totalQueries}</div>
                        <div className="text-sm text-blue-600">Queries Posted</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                        <FaLightbulb className="text-2xl text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-800">{profileData.totalRecommendations}</div>
                        <div className="text-sm text-green-600">Recommendations Made</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                        <FaThumbsUp className="text-2xl text-yellow-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-yellow-800">{profileData.totalHelpfulVotes}</div>
                        <div className="text-sm text-yellow-600">Helpful Votes Received</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('queries')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'queries'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Queries ({profileData.totalQueries})
                        </button>
                        <button
                            onClick={() => setActiveTab('recommendations')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'recommendations'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Recommendations ({profileData.totalRecommendations})
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'queries' && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Queries Posted</h3>
                            {profileData.queries.length === 0 ? (
                                <p className="text-gray-500">No queries posted yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {profileData.queries.map(query => (
                                        <div key={query._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-lg font-semibold text-gray-800">
                                                    {query.queryTitle || query.question}
                                                </h4>
                                                <span className="text-sm text-gray-500 flex items-center">
                                                    <FaCalendarAlt className="mr-1" />
                                                    {formatDate(query.createdAt || query.date)}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-2">
                                                <strong>Product:</strong> {query.productName}
                                            </p>
                                            {query.category && (
                                                <span className="badge badge-primary badge-sm mr-2">{query.category}</span>
                                            )}
                                            {query.tags && query.tags.map((tag, index) => (
                                                <span key={index} className="badge badge-outline badge-sm mr-1">{tag}</span>
                                            ))}
                                            <div className="mt-2 text-sm text-gray-500">
                                                <span className="font-semibold">Recommendations:</span> {query.recommendationCount || 0}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'recommendations' && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Recommendations Made</h3>
                            {profileData.recommendations.length === 0 ? (
                                <p className="text-gray-500">No recommendations made yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {profileData.recommendations.map(rec => (
                                        <div key={rec._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-lg font-semibold text-gray-800">{rec.title}</h4>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-500 flex items-center">
                                                        <FaThumbsUp className="mr-1" />
                                                        {rec.helpfulCount || 0} helpful
                                                    </span>
                                                    <span className="text-sm text-gray-500 flex items-center">
                                                        <FaCalendarAlt className="mr-1" />
                                                        {formatDate(rec.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 mb-2">
                                                <strong>Product:</strong> {rec.productName}
                                            </p>
                                            <p className="text-gray-700 mb-2">
                                                <strong>Reason:</strong> {rec.reason}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                <strong>For Query:</strong> {rec.queryTitle}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;