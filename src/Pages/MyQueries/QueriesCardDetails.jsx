import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Link, useParams } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';

const QueriesCardDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [query, setQuery] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const isOwner = useMemo(() => {
        if (!user || !query) return false;
        return (query.userEmail || query.email) === user.email;
    }, [user, query]);

    const sortRecs = (recs) => {
        return [...recs].sort((a, b) => {
            const aAccepted = a.isAccepted ? 1 : 0;
            const bAccepted = b.isAccepted ? 1 : 0;
            if (bAccepted !== aAccepted) return bAccepted - aAccepted; // accepted first
            const aCount = a.helpfulCount || 0;
            const bCount = b.helpfulCount || 0;
            return bCount - aCount; // then most helpful
        });
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const queryRes = await axios.get(`https://product-server-navy.vercel.app/queries/${id}`);
            setQuery(queryRes.data);

            const recs = await axios.get(`https://product-server-navy.vercel.app/recommendations?queryId=${id}`);
            const normalized = (recs.data || []).map(r => ({
                helpfulCount: 0,
                votedBy: [],
                isAccepted: false,
                ...r,
            }));
            setRecommendations(sortRecs(normalized));
        } finally {
            setLoading(false);
        }
    };

    const handleHelpful = async (rec) => {
        if (!user?.email) return;
        if ((rec.votedBy || []).includes(user.email)) return;

        // Optimistic update
        setRecommendations(prev => sortRecs(prev.map(r => r._id === rec._id
            ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1, votedBy: [...(r.votedBy || []), user.email] }
            : r
        )));

        try {
            await axios.patch(`https://product-server-navy.vercel.app/recommendations/${rec._id}/helpful`, {
                userEmail: user.email,
            });
        } catch (e) {
            // Revert on failure
            setRecommendations(prev => sortRecs(prev.map(r => r._id === rec._id
                ? { ...r, helpfulCount: Math.max(0, (r.helpfulCount || 1) - 1), votedBy: (r.votedBy || []).filter(v => v !== user.email) }
                : r
            )));
        }
    };

    const handleMarkBest = async (rec) => {
        if (!isOwner) return;
        // Optimistic: mark only this as accepted
        const previous = recommendations;
        setRecommendations(prev => sortRecs(prev.map(r => ({ ...r, isAccepted: r._id === rec._id }))));
        try {
            await axios.patch(`https://product-server-navy.vercel.app/recommendations/${rec._id}/accept`, {
                queryId: id,
            });
            // Optionally refresh
            // await fetchData();
        } catch (e) {
            // Revert on failure
            setRecommendations(previous);
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
                    <p>
                        <strong>Created by:</strong>{' '}
                        <Link className="link" to={`/user/${encodeURIComponent(query.userEmail || query.email)}`}>
                            {query.userName || query.userEmail || query.email}
                        </Link>
                    </p>
                    <p><strong>Recommendations:</strong> {query.recommendationCount || 0}</p>
                    <p><strong>User:</strong> {query.email || 'N/A'}</p>
                    {query.category && (
                        <p className="mt-1"><strong>Category:</strong> {query.category}</p>
                    )}
                    {(query.tags || []).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {(query.tags || []).map(tag => (
                                <span key={tag} className="badge badge-outline">#{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Recommendations List */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Recommendations</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : recommendations.length === 0 ? (
                    <p className="text-gray-500">No recommendations yet.</p>
                ) : (
                    recommendations.map((rec) => {
                        const alreadyVoted = (rec.votedBy || []).includes(user?.email);
                        return (
                            <div
                                key={rec._id}
                                className={`border p-4 mb-3 rounded ${rec.isAccepted ? 'border-green-500 bg-green-50' : ''}`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="font-semibold text-lg">{rec.title}</div>
                                        <div className="text-sm text-gray-600">
                                            <strong>Product:</strong> {rec.productName}
                                        </div>
                                        {rec.productImage && (
                                            <img src={rec.productImage} alt="product" className="w-28 h-28 object-cover mt-2 rounded" />
                                        )}
                                        <div className="mt-2"><strong>Reason:</strong> {rec.reason}</div>
                                        <div className="text-xs text-gray-500 mt-2">
                                            By{' '}
                                            <Link className="link" to={`/user/${encodeURIComponent(rec.recommenderEmail)}`}>
                                                {rec.recommenderName || rec.recommenderEmail}
                                            </Link>{' '}
                                            on {rec.createdAt ? new Date(rec.createdAt).toLocaleString() : ''}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <button
                                            className={`btn btn-sm ${alreadyVoted ? 'btn-ghost' : 'btn-outline'}`}
                                            onClick={() => handleHelpful(rec)}
                                            disabled={!user?.email || alreadyVoted}
                                            title={alreadyVoted ? 'You already marked this helpful' : 'Mark as helpful'}
                                        >
                                            👍 Helpful ({rec.helpfulCount || 0})
                                        </button>
                                        {isOwner && (
                                            <button
                                                className={`btn btn-sm ${rec.isAccepted ? 'btn-success' : 'btn-outline'}`}
                                                onClick={() => handleMarkBest(rec)}
                                                disabled={rec.isAccepted}
                                            >
                                                {rec.isAccepted ? 'Best Solution' : 'Mark as Best'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default QueriesCardDetails;
