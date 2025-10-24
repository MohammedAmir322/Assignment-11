import React, { useEffect, useMemo, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';

const UserProfile = () => {
	const { email } = useParams();
	const navigate = useNavigate();
	const { user } = useContext(AuthContext) || {};
	const [queries, setQueries] = useState([]);
	const [recs, setRecs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState('queries');
	const [profileData, setProfileData] = useState(null);

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
						<h1 className="text-3xl font-bold text-gray-800">{profileData.displayName}</h1>
						<p className="text-gray-600">{profileData.email}</p>
						{user && user.email === email && <span className="badge badge-primary mt-2">Your Profile</span>}
					</div>
				</div>
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
														<Link className="btn btn-sm" to={`/queriesCardDetails/${rec._Id}`}>
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
