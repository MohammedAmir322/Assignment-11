import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';

const UserProfile = () => {
  const { email } = useParams();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ queries: 0, recommendations: 0, helpfulVotes: 0 });
  const [userQueries, setUserQueries] = useState([]);
  const [userRecs, setUserRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Basic profile info may come from server; if not available, derive from email
        const [qRes, rRes] = await Promise.all([
          axios.get(`https://product-server-navy.vercel.app/queries?userEmail=${email}`),
          axios.get(`https://product-server-navy.vercel.app/my-recommendations?email=${email}`),
        ]);
        const q = qRes.data || [];
        const r = rRes.data || [];
        setUserQueries(q);
        setUserRecs(r);
        const helpfulVotes = (r || []).reduce((sum, rec) => sum + (rec.helpfulCount || 0), 0);
        setStats({ queries: q.length, recommendations: r.length, helpfulVotes });
        setProfile({ email, name: r[0]?.recommenderName || q[0]?.userName || email.split('@')[0] });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [email]);

  if (loading) return <div className="p-6 max-w-5xl mx-auto">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-neutral text-neutral-content flex items-center justify-center text-2xl">
          {profile?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <div className="text-xl font-bold">{profile?.name}</div>
          <div className="text-gray-500">{profile?.email}</div>
        </div>
      </div>

      <div className="stats shadow mb-6">
        <div className="stat">
          <div className="stat-title">Total Queries</div>
          <div className="stat-value">{stats.queries}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Recommendations</div>
          <div className="stat-value">{stats.recommendations}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Helpful Votes Received</div>
          <div className="stat-value">{stats.helpfulVotes}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Queries</h3>
          {userQueries.length === 0 ? (
            <p className="text-gray-500">No queries.</p>
          ) : (
            <ul className="space-y-2">
              {userQueries.map(q => (
                <li key={q._id} className="border p-3 rounded">
                  <div className="font-semibold">{q.queryTitle}</div>
                  <div className="text-sm text-gray-600">{q.productName}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
          {userRecs.length === 0 ? (
            <p className="text-gray-500">No recommendations.</p>
          ) : (
            <ul className="space-y-2">
              {userRecs.map(r => (
                <li key={r._id} className="border p-3 rounded">
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-sm text-gray-600">{r.productName}</div>
                  <div className="text-xs text-gray-500">Helpful: {r.helpfulCount || 0}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
