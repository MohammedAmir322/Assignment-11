import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router';
import axios from 'axios';

const UserProfile = () => {
  const { email } = useParams();
  const [queries, setQueries] = useState([]);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('queries');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [qRes, rRes] = await Promise.all([
          axios.get(`https://product-server-navy.vercel.app/only-my-queries?email=${encodeURIComponent(email)}`),
          axios.get(`https://product-server-navy.vercel.app/my-recommendations?email=${encodeURIComponent(email)}`),
        ]);
        setQueries(Array.isArray(qRes.data) ? qRes.data : []);
        setRecs(Array.isArray(rRes.data) ? rRes.data : []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [email]);

  const stats = useMemo(() => {
    const totalQueries = queries.length;
    const totalRecs = recs.length;
    const totalHelpful = recs.reduce((sum, r) => sum + (r.helpfulCount || 0), 0);
    return { totalQueries, totalRecs, totalHelpful };
  }, [queries, recs]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button onClick={() => window.history.back()} className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">&larr; Back</button>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-neutral text-neutral-content flex items-center justify-center text-2xl">
          {email?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{email}</h1>
          <div className="text-sm text-gray-500">Public profile</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Total Queries</div>
          <div className="text-2xl font-bold">{stats.totalQueries}</div>
        </div>
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Total Recommendations</div>
          <div className="text-2xl font-bold">{stats.totalRecs}</div>
        </div>
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Helpful Votes Received</div>
          <div className="text-2xl font-bold">{stats.totalHelpful}</div>
        </div>
      </div>

      <div className="tabs mb-4">
        <a className={`tab tab-bordered ${activeTab === 'queries' ? 'tab-active' : ''}`} onClick={() => setActiveTab('queries')}>Queries</a>
        <a className={`tab tab-bordered ${activeTab === 'recs' ? 'tab-active' : ''}`} onClick={() => setActiveTab('recs')}>Recommendations</a>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : activeTab === 'queries' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {queries.length === 0 ? (
            <p className="text-gray-500">No queries yet.</p>
          ) : (
            queries.map(q => (
              <div key={q._id} className="border rounded p-4">
                <div className="font-semibold">{q.queryTitle}</div>
                <div className="text-sm text-gray-500">{q.productName}</div>
                <div className="text-sm text-gray-500">{q.createdAt ? new Date(q.createdAt).toLocaleDateString() : ''}</div>
                <Link className="btn btn-sm mt-2" to={`/queriesCardDetails/${q._id}`}>View</Link>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {recs.length === 0 ? (
            <p className="text-gray-500">No recommendations yet.</p>
          ) : (
            recs.map(r => (
              <div key={r._id} className={`border rounded p-4 ${r.isAccepted ? 'border-green-500 bg-green-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{r.title}</div>
                  {r.isAccepted && <span className="badge badge-success">Accepted</span>}
                </div>
                <div className="text-sm"><strong>Product:</strong> {r.productName}</div>
                <div className="text-sm"><strong>Helpful:</strong> {r.helpfulCount || 0}</div>
                <div className="text-xs text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</div>
                {r.queryId && <Link className="btn btn-sm mt-2" to={`/queriesCardDetails/${r.queryId}`}>View Thread</Link>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
