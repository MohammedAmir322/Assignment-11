import React, { useEffect, useState, useContext, useMemo } from 'react';
import { Link, useParams } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';

const QueriesCardDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [query, setQuery] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [queryRes, recsRes] = await Promise.all([
                axios.get(`https://product-server-navy.vercel.app/queries/${id}`),
                axios.get(`https://product-server-navy.vercel.app/recommendations?queryId=${id}`),
            ]);
            setQuery(queryRes.data);
            setRecommendations(Array.isArray(recsRes.data) ? recsRes.data : []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const votedKey = useMemo(() => (user?.email ? `voted_recs_${user.email}` : 'voted_recs_guest'), [user?.email]);

    const hasVoted = (recId) => {
        try {
            const raw = localStorage.getItem(votedKey);
            const set = raw ? new Set(JSON.parse(raw)) : new Set();
            return set.has(recId);
        } catch {
            return false;
        }
    };

    const markVoted = (recId) => {
        try {
            const raw = localStorage.getItem(votedKey);
            const set = raw ? new Set(JSON.parse(raw)) : new Set();
            set.add(recId);
            localStorage.setItem(votedKey, JSON.stringify(Array.from(set)));
        } catch {
            // ignore
        }
    };

    const handleHelpful = async (rec) => {
        if (!user?.email) return;
        if (hasVoted(rec._id)) return;
        try {
            const { data } = await axios.post(
                `https://product-server-navy.vercel.app/recommendations/${rec._id}/helpful`,
                { voterEmail: user.email }
            );
            const updatedCount = data?.helpfulCount ?? (rec.helpfulCount || 0) + 1;
            setRecommendations(prev => prev.map(r => r._id === rec._id ? { ...r, helpfulCount: updatedCount, votedBy: Array.isArray(r.votedBy) ? [...r.votedBy, user.email] : [user.email] } : r));
            markVoted(rec._id);
        } catch {
            // Fallback optimistic update if backend doesn't support the endpoint
            setRecommendations(prev => prev.map(r => r._id === rec._id ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r));
            markVoted(rec._id);
        }
    };

    const handleAccept = async (rec) => {
        if (!user?.email || !query) return;
        const ownerEmail = query.userEmail || query.email;
        if (user.email !== ownerEmail) return;
        try {
            await axios.post(`https://product-server-navy.vercel.app/recommendations/${rec._id}/accept`, { queryId: query._id || id });
            setRecommendations(prev => prev.map(r => ({ ...r, isAccepted: r._id === rec._id })));
        } catch {
            // Optimistic update
            setRecommendations(prev => prev.map(r => ({ ...r, isAccepted: r._id === rec._id })));
        }
    };

    const sortedRecommendations = useMemo(() => {
        return [...recommendations].sort((a, b) => {
            const aAccepted = a.isAccepted ? 1 : 0;
            const bAccepted = b.isAccepted ? 1 : 0;
            if (aAccepted !== bAccepted) return bAccepted - aAccepted;
            const aHelpful = a.helpfulCount || 0;
            const bHelpful = b.helpfulCount || 0;
            if (aHelpful !== bHelpful) return bHelpful - aHelpful;
            const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return bDate - aDate;
        });
    }, [recommendations]);

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
                    <p><strong>Created by:</strong> {query.userName} ({query.userEmail || query.email})</p>
                    <p><strong>Recommendations:</strong> {query.recommendationCount || 0}</p>
                    {Array.isArray(query.tags) && query.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {query.tags.map((tag, idx) => (
                                <Link key={idx} to={`/queries?tag=${encodeURIComponent(tag)}`} className="badge badge-outline badge-sm cursor-pointer">#{tag}</Link>
                            ))}
                        </div>
                    )}
                    {query.category && (
                        <div className="mt-1"><span className="badge badge-info badge-outline">{query.category}</span></div>
                    )}
                </div>
            )}
 
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Recommendations</h3>
                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : sortedRecommendations.length === 0 ? (
                    <p className="text-gray-500">No recommendations yet.</p>
                ) : (
                    <div className="space-y-3">
                        {sortedRecommendations.map((rec) => {
                            const alreadyVoted = (Array.isArray(rec.votedBy) && user?.email ? rec.votedBy.includes(user.email) : false) || hasVoted(rec._id);
                            const canAccept = user?.email && (user.email === (query?.userEmail || query?.email));
                            return (
                                <div key={rec._id} className={`border p-4 rounded ${rec.isAccepted ? 'border-green-500 bg-green-50' : ''}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="font-semibold text-lg">{rec.title}</div>
                                        {rec.isAccepted && (
                                            <span className="badge badge-success">Accepted</span>
                                        )}
                                    </div>
                                    <div className="mt-1 text-sm text-gray-600">
                                        <strong>Product:</strong> {rec.productName}
                                    </div>
                                    {rec.productImage && (
                                        <img src={rec.productImage} alt={rec.productName} className="w-32 h-32 object-cover mt-2 rounded" />
                                    )}
                                    <div className="mt-2"><strong>Reason:</strong> {rec.reason}</div>
                                    <div className="mt-2 text-sm text-gray-500">
                                        By {rec.recommenderName || rec.recommenderEmail} {rec.recommenderEmail && (
                                            <Link className="link link-primary ml-1" to={`/user/${encodeURIComponent(rec.recommenderEmail)}`}>view profile</Link>
                                        )}
                                        {rec.createdAt && (
                                            <span className="ml-2">on {new Date(rec.createdAt).toLocaleString()}</span>
                                        )}
                                    </div>
                                    <div className="mt-3 flex items-center gap-3">
                                        <button
                                            className={`btn btn-sm ${alreadyVoted ? 'btn-ghost' : 'btn-outline'}`}
                                            disabled={alreadyVoted || !user?.email}
                                            onClick={() => handleHelpful(rec)}
                                            title={user?.email ? (alreadyVoted ? 'You already marked this helpful' : 'Mark helpful') : 'Login to vote'}
                                        >
                                            👍 Helpful {rec.helpfulCount ? `(${rec.helpfulCount})` : ''}
                                        </button>
                                        {canAccept && !rec.isAccepted && (
                                            <button className="btn btn-sm btn-success" onClick={() => handleAccept(rec)}>
                                                Mark as Best
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QueriesCardDetails;
