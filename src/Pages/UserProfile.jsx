import React, { useEffect, useMemo, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';

// Gemini AI Configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

// Updated Gemini AI Helper Function
const generateAIInsights = async (userData) => {
    if (!GEMINI_API_KEY) {
        throw new Error('Please configure your Gemini API key in .env file');
    }

    const prompt = `
        Analyze this user's profile data and provide an encouraging insight about their community contributions:
        - Total Queries: ${userData.totalQueries}
        - Total Recommendations: ${userData.totalRecommendations}
        - Helpful Votes Received: ${userData.totalHelpfulVotes}
        - Resolved Queries: ${userData.resolvedQueries}
    `;

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Failed to connect to AI service');
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No insight generated';
    } catch (error) {
        console.error('AI API Error:', error);
        throw new Error('Unable to generate insight at this time');
    }
};

const UserProfile = () => {
	const { email } = useParams();
	const navigate = useNavigate();
	const { user } = useContext(AuthContext) || {};
	const [queries, setQueries] = useState([]);
	const [recs, setRecs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState('queries');
	const [profileData, setProfileData] = useState(null);
	const [aiInsight, setAiInsight] = useState('');
	const [loadingInsight, setLoadingInsight] = useState(false);
	const [aiError, setAiError] = useState('');

	useEffect(() => {
		if (!email) return;
		const load = async () => {
			setLoading(true);
			try {
				const [qRes, rRes] = await Promise.all([
					axios.get(`https://product-server-navy.vercel.app/only-my-queries?email=${encodeURIComponent(email)}`),
					axios.get(`https://product-server-navy.vercel.app/my-recommendations?email=${encodeURIComponent(email)}`),
				]);
				const queriesData = Array.isArray(qRes.data) ? qRes.data : [];
				const recsData = Array.isArray(rRes.data) ? rRes.data : [];
				setQueries(queriesData);
				setRecs(recsData);

				const displayName =
					queriesData[0]?.userName ||
					recsData[0]?.recommenderName ||
					(email ? email.split('@')[0] : 'User');

				setProfileData({
					email,
					displayName,
				});
			} catch (err) {
				console.error('Error fetching profile data:', err);
				setQueries([]);
				setRecs([]);
				setProfileData({ email, displayName: email ? email.split('@')[0] : 'User' });
			} finally {
				setLoading(false);
			}
		};
		load();
	}, [email]);

	// Updated generateInsight function
	const generateInsight = async () => {
		if (!stats || loadingInsight) return;
		
		setLoadingInsight(true);
		setAiError('');
		setAiInsight('');

		try {
			const insight = await generateAIInsights(stats);
			setAiInsight(insight);
		} catch (error) {
			console.error('Generate insight error:', error);
			setAiError(error.message || 'Failed to generate insight');
			// Provide fallback content
			setAiInsight('Unable to generate AI insight. Here\'s a summary instead: ' +
				`This user has posted ${stats.totalQueries} queries and provided ${stats.totalRecommendations} recommendations.`);
		} finally {
			setLoadingInsight(false);
		}
	};

	const stats = useMemo(() => {
		const totalQueries = queries.length;
		const totalRecommendations = recs.length;
		const totalHelpfulVotes = recs.reduce((sum, r) => sum + (r.helpfulCount || 0), 0);
		const resolvedQueries = queries.filter(q => q.isResolved).length;
		return { totalQueries, totalRecommendations, totalHelpfulVotes, resolvedQueries };
	}, [queries, recs]);

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

			<div className="bg-white rounded-lg shadow-md p-6 mb-6">
				<div className="flex items-center gap-6">
					<div className="avatar placeholder">
						<div className="bg-neutral text-neutral-content rounded-full w-24 h-24 flex items-center justify-center">
							<span className="text-3xl font-bold">
								{(profileData.displayName || 'U').charAt(0).toUpperCase()}
							</span>
						</div>
					</div>
					<div className="flex-1">
						<h1 className="text-3xl font-bold text-gray-800">{user.displayName}</h1>
						<p className="text-gray-600">{profileData.email}</p>
						{user && user.email === email && <span className="badge badge-primary mt-2">Your Profile</span>}
					</div>
				</div>
			</div>

			{/* Updated AI Insight Section */}
			<div className="bg-white rounded-lg shadow-md p-6 mb-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">AI Profile Insight</h2>
					<button 
						onClick={generateInsight}
						disabled={loadingInsight}
						className={`btn ${loadingInsight ? 'loading' : ''} btn-primary btn-sm`}
					>
						{loadingInsight ? 'Generating...' : 'Generate Insight'}
					</button>
				</div>
				{aiError ? (
					<div className="text-red-600 text-sm mb-2">{aiError}</div>
				) : aiInsight ? (
					<div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
						<p className="text-gray-700 italic">{aiInsight}</p>
					</div>
				) : (
					<p className="text-gray-500">Click the button to generate an AI insight about this profile.</p>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				<div className="stat bg-white rounded-lg shadow-md p-4">
					<div className="stat-title">Total Queries</div>
					<div className="stat-value text-primary">{stats.totalQueries}</div>
				</div>
				<div className="stat bg-white rounded-lg shadow-md p-4">
					<div className="stat-title">Recommendations</div>
					<div className="stat-value text-secondary">{stats.totalRecommendations}</div>
				</div>
				<div className="stat bg-white rounded-lg shadow-md p-4">
					<div className="stat-title">Helpful Votes</div>
					<div className="stat-value text-accent">{stats.totalHelpfulVotes}</div>
				</div>
				<div className="stat bg-white rounded-lg shadow-md p-4">
					<div className="stat-title">Resolved Queries</div>
					<div className="stat-value text-success">{stats.resolvedQueries}</div>
				</div>
			</div>

			<div className="tabs tabs-boxed mb-6">
				<button className={`tab ${activeTab === 'queries' ? 'tab-active' : ''}`} onClick={() => setActiveTab('queries')}>
					Queries ({stats.totalQueries})
				</button>
				<button
					className={`tab ${activeTab === 'recommendations' ? 'tab-active' : ''}`}
					onClick={() => setActiveTab('recommendations')}
				>
					Recommendations ({stats.totalRecommendations})
				</button>
			</div>

			<div className="bg-white rounded-lg shadow-md p-6">
				{activeTab === 'queries' && (
					<div>
						<h3 className="text-xl font-bold mb-4">User Queries</h3>
						{queries.length === 0 ? (
							<p className="text-gray-500">No queries posted yet.</p>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{queries.map(query => (
									<div key={query._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
										{query.productImage && (
											<img src={query.productImage} alt={query.productName} className="w-full h-32 object-cover rounded mb-3" />
										)}
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
										{query.isResolved && <span className="badge badge-success badge-sm">Resolved</span>}
										<div className="mt-3">
											<button onClick={() => navigate(`/queriesCardDetails/${query._id}`)} className="btn btn-primary btn-sm w-full">
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
						{recs.length === 0 ? (
							<p className="text-gray-500">No recommendations made yet.</p>
						) : (
							<div className="space-y-4">
								{recs.map(rec => (
									<div key={rec._id} className={`border rounded-lg p-4 ${rec.isAccepted ? 'border-green-500 bg-green-50' : ''}`}>
										{rec.isAccepted && <span className="badge badge-success mb-2">✅ Best Solution</span>}
										<div className="flex gap-4">
											{rec.productImage && <img src={rec.productImage} alt={rec.productName} className="w-16 h-16 object-cover rounded" />}
											<div className="flex-1">
												<h4 className="font-semibold">{rec.title}</h4>
												<p className="text-sm text-gray-600">
													<strong>Product:</strong> {rec.productName}
												</p>
												{rec.reason && <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>}
												<div className="flex items-center gap-4 mt-2">
													<span className="text-sm text-gray-500">👍 {rec.helpfulCount || 0} helpful votes</span>
													<span className="text-sm text-gray-500">{rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : ''}</span>
												</div>
												{rec.queryId && (
													<div className="mt-2">
														<Link className="btn btn-sm" to={`/queriesCardDetails/${query._Id}`}>
															View Thread
														</Link>
													</div>
												)}
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
