import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';

const QueriesCardDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [query, setQuery] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    const fetchData = async () => {
        const queryRes = await axios.get(`https://product-server-navy.vercel.app/queries/${id}`);
        setQuery(queryRes.data);

        const recs = await axios.get(`https://product-server-navy.vercel.app/recommendations?queryId=${id}`);
        setRecommendations(recs.data);
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
                    <p><strong>Created by:</strong> {query.userName} ({query.userEmail})</p>
                    <p><strong>Recommendations:</strong> {query.recommendationCount || 0}</p>
                    <p><strong>User:</strong> {query.email || 'N/A'}</p>
                </div>
            )}
 
        </div>
    );
};

export default QueriesCardDetails;
