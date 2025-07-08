import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';


const MyQueryRecommendations = () => {
    const { user } = useContext(AuthContext);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyQueryRecommendations = async () => {
            try {
                setLoading(true);
                const userEmail = user?.email;

                // Get all queries created by the user
                const queryRes = await axios.get(`https://product-server-navy.vercel.app/queries?userEmail=${userEmail}`);
                const queries = queryRes.data;

                let allRecs = [];

                for (const query of queries) {
                    const recRes = await axios.get(`https://product-server-navy.vercel.app/recommendations?queryId=${query._id}`);
                    const othersRecs = recRes.data.filter(r => r.recommenderEmail !== userEmail);
                    const enriched = othersRecs.map(rec => ({
                        ...rec,
                        queryTitle: query.title || query.queryTitle
                    }));
                    allRecs.push(...enriched);
                }

                setRecommendations(allRecs);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyQueryRecommendations();
    }, [user]);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Recommendations For Your Queries</h1>

            {loading ? (
                <p>Loading...</p>
            ) : recommendations.length === 0 ? (
                <p className="text-gray-500">No recommendations from others yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">Query Title</th>
                                <th className="border px-4 py-2">Recommended Product</th>
                                <th className="border px-4 py-2">Reason</th>
                                <th className="border px-4 py-2">Recommender</th>
                                <th className="border px-4 py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recommendations.map((rec, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="border px-4 py-2">{rec.queryTitle}</td>
                                    <td className="border px-4 py-2">{rec.productName}</td>
                                    <td className="border px-4 py-2">{rec.reason}</td>
                                    <td className="border px-4 py-2">{rec.recommenderName} ({rec.recommenderEmail})</td>
                                    <td className="border px-4 py-2">
                                        {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyQueryRecommendations;
