import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
// import { Package, ExternalLink } from 'lucide-react';
import { AuthContext } from '../Context/AuthContext';

const MyQueryRecommendations = () => {
	const { user } = useContext(AuthContext) || {};
	const [recommendations, setRecommendations] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (user?.email) {
			const fetchMyQueryRecommendations = async () => {
				try {
					setLoading(true);
					const userEmail = user.email;
					const queryRes = await axios.get(`https://product-server-navy.vercel.app/queries?email=${userEmail}`);
					const queries = Array.isArray(queryRes.data) ? queryRes.data : [];
					let allRecs = [];
					for (const query of queries) {
						const recRes = await axios.get(`https://product-server-navy.vercel.app/recommendations?queryId=${query._id}`);
						const othersRecs = Array.isArray(recRes.data)
							? recRes.data.filter(r => r.recommenderEmail !== userEmail)
							: [];
						const enriched = othersRecs.map(rec => ({
							...rec,
							queryTitle: query.title || query.queryTitle,
							queryId: query._id
						}));
						allRecs.push(...enriched);
					}
					allRecs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
					setRecommendations(allRecs);
				} catch (error) {
					console.error('Error fetching recommendations:', error);
				} finally {
					setLoading(false);
				}
			};
			fetchMyQueryRecommendations();
		}
	}, [user]);

	return (
		<div className="min-h-[calc(100vh-16rem)] bg-gray-50 py-12 px-4">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Recommendations For Me</h1>
					<p className="text-gray-600">All recommendations others have made for your queries</p>
				</div>
				{loading ? (
					<div className="flex items-center justify-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
					</div>
				) : recommendations.length > 0 ? (
					<div className="bg-white rounded-xl shadow-lg overflow-hidden">
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Query</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommendation</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommended Product</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">By</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{recommendations.map((rec) => (
										<tr key={rec._id} className="hover:bg-gray-50">
											<td className="px-6 py-4">
												<p className="text-sm font-medium text-gray-900 line-clamp-2">{rec.queryTitle}</p>
											</td>
											<td className="px-6 py-4">
												<div>
													<p className="text-sm font-medium text-gray-900">{rec.recommendationTitle || rec.title}</p>
													<p className="text-sm text-gray-500 line-clamp-2 mt-1">{rec.recommendationReason || rec.reason}</p>
												</div>
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center space-x-3">
													<img
														src={rec.recommendedProductImage || rec.productImage || 'https://placehold.co/100x100/eee/ccc?text=No+Image'}
														alt={rec.recommendedProductName || rec.productName}
														className="h-12 w-12 rounded object-cover"
														onError={e => e.currentTarget.src = 'https://placehold.co/100x100/eee/ccc?text=Error'}
													/>
													<span className="text-sm text-gray-900">{rec.recommendedProductName || rec.productName}</span>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<p className="text-sm font-medium text-gray-900">{rec.recommenderName}</p>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{new Date(rec.createdAt).toLocaleDateString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<Link
													to={`/queries/${rec.queryId}`}
													className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
												>
													<ExternalLink className="h-5 w-5" />
												</Link>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				) : (
					<div className="text-center py-16 bg-white rounded-xl shadow-md">
						{/* <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" /> */}
						<h3 className="text-xl font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
						<p className="text-gray-600 mb-6">
							You haven't received any recommendations for your queries yet
						</p>
						<Link
							to="/queries"
							className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
						>
							View My Queries
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default MyQueryRecommendations;

