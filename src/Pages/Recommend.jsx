import React, { useEffect, useState, useContext } from 'react';
import { Navigate, useParams } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';

const Recommend = () => {
    const { id } = useParams(); // query ID from URL
    const { user } = useContext(AuthContext);
    const [query, setQuery] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        productName: '',
        productImage: '',
        reason: '',
    });

    useEffect(() => {
        // Fetch query details
        axios.get(`https://product-server-navy.vercel.app/my-queries/${id}`).then(res => setQuery(res.data));

        // Fetch recommendations
        axios.get(`https://product-server-navy.vercel.app/my-recommendations?email=${user?.email}`)
            .then(res => setRecommendations(res.data));
    }, [id]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            queryId: id,
            queryTitle: query?.title || query?.queryTitle,
            recommenderEmail: user?.email,
            recommenderName: user?.name,
            createdAt: new Date().toISOString(),
        };

        // Save recommendation
        await axios.post('https://product-server-navy.vercel.app/recommendations', payload);

        // Refetch updated recommendations
        const updated = await axios.get(`https://product-server-navy.vercel.app/my-recommendations?email=${user?.email}`);
        setRecommendations(updated.data);

        // Clear form
        setFormData({ title: '', productName: '', productImage: '', reason: '' });
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <button to="/my-queries"
                onClick={() => window.history.back()}
                className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                &larr; Back
            </button>
            {query && (
                <>
                    <h2 className="text-2xl font-bold mb-2">{query.title || query.queryTitle}</h2>
                    {query.image && (
                        <img src={query.image} alt="product" className="w-32 h-32 object-cover mt-2" />
                    )}
                    <p><strong>Product:</strong> {query.productName}</p>
                    <p className="mt-2"><strong>Brand</strong> {query.brand}</p>
                    <p><strong>Created by:</strong> {query.userName} ({query.userEmail})</p>
                </>
            )}

            {/* Add Recommendation Form */}
            <div className="mt-6 border-t pt-4">
                <h3 className="text-xl font-semibold mb-2">Add A Recommendation</h3>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <input
                        name="title"
                        placeholder="Recommendation Title"
                        value={formData.title}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                    <input
                        name="productName"
                        placeholder="Recommended Product Name"
                        value={formData.productName}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                    <input
                        name="productImage"
                        type="url"
                        placeholder="Recommended Product Image URL (must be a valid image link)"
                        value={formData.productImage}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                    <textarea
                        name="reason"
                        placeholder="Recommendation Reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2">Add Recommendation</button>
                </form>
            </div>

            {/* Recommendation List */}
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">All Recommendations</h3>
                {recommendations.length === 0 ? (
                    <p className="text-gray-500">No recommendations yet.</p>
                ) : (
                    recommendations.map(rec => (
                        <div key={rec._id} className="border p-4 mb-3 rounded">
                            <p className="font-semibold">{rec.title}</p>
                            <p><strong>Product:</strong> {rec.productName}</p>
                            {rec.productImage && <img src={rec.productImage} alt="product" className="w-32 h-32 object-cover mt-2" />}
                            <p className="mt-1"><strong>Reason:</strong> {rec.reason}</p>
                            <p className="mt-1"><strong>User:</strong> {rec.recommenderEmail}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                By {rec.recommenderName} on {rec.createdAt ? new Date(rec.createdAt).toLocaleString() : ''}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
export default Recommend;