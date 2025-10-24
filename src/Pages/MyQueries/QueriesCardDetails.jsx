import React, { useEffect, useState,  } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
// import { AuthContext } from '../../Context/AuthContext';

const QueriesCardDetails = () => {
    const { id } = useParams();
    // const { user } = useContext(AuthContext);
    const [query, setQuery] = useState(null);
    const [ setRecommendations] = useState([]);

    const fetchData = async () => {
        try {
            const queryRes = await axios.get(`https://product-server-navy.vercel.app/queries/${id}`);
            setQuery(queryRes.data);

            const recs = await axios.get(`https://product-server-navy.vercel.app/recommendations?queryId=${id}`);
            setRecommendations(recs.data);
        } catch (error) {
            console.error("Error fetching data:", error);
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
               
                <div className="mb-6 p-4 border rounded-lg shadow-xl bg-white 
                                transition-all duration-300 ease-in-out 
                                hover:shadow-2xl hover:scale-[1.02]">
                    
                    <h2 className="text-2xl font-bold mb-4">{query.title || query.queryTitle}</h2>
                    
                    <div className="flex flex-col md:flex-row gap-6">
                        
                        {query.productImage && (
                            <div className="flex-shrink-0 rounded-md overflow-hidden"> 
                                <img 
                                    src={query.productImage} 
                                    alt="product" 
                                    className="w-full md:w-64 h-64 object-cover rounded-md shadow-lg 
                                               transition-transform duration-300 ease-in-out hover:scale-105" 
                                />
                            </div>
                        )}
                        <div className="flex-grow space-y-2">
                            <p><strong>Product:</strong> {query.productName}</p>
                            <p><strong>Brand:</strong> {query.productBrand}</p>
                            <p><strong>Created by:</strong> {query.userName} ({query.userEmail})</p>
                            <p><strong>Recommendations:</strong> {query.recommendationCount || 0}</p>
                            <p><strong>User:</strong> {query.email || 'N/A'}</p>
                        </div>
                    </div>
                </div>

)}
        </div>
    );
};

export default QueriesCardDetails;