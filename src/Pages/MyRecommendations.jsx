import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import Swal from 'sweetalert2';

const MyRecommendations = () => {
    const { user } = useContext(AuthContext);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadRecommendations = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:3000/my-recommendations?email=${user?.email}`);
            setRecommendations(res.data);
        } catch (error) {
            setRecommendations([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email) {
            loadRecommendations();
        }
    }, [user?.email]);

    const handleDelete = async (id, queryId) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete this recommendation?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirm.isConfirmed) {
            try {
                const deleteRes = await axios.delete(`http://localhost:3000/recommendations/${id}`);
                if (deleteRes.status === 200) {
                    await loadRecommendations();
                    Swal.fire('Deleted!', 'Your recommendation has been deleted.', 'success');
                } else {
                    Swal.fire('Error!', 'Failed to delete recommendation.', 'error');
                }
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete recommendation.', 'error');
            }
        }
    };

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Query Title</th>
                            <th>Recommended Product</th>
                            <th>Reason</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500">Loading...</td>
                            </tr>
                        ) : recommendations.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500">No recommendations found.</td>
                            </tr>
                        ) : (
                            recommendations.map((rec, idx) => (
                                <tr key={rec._id}>
                                    <th>{idx + 1}</th>
                                    <td>{rec.queryTitle}</td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={rec.productImage}
                                                alt={rec.productName}
                                                className="w-10 h-10 rounded-md object-cover"
                                            />
                                            <span className="font-semibold">{rec.productName}</span>
                                        </div>
                                    </td>
                                    <td>{rec.reason}</td>
                                    <td>{rec.createdAt ? new Date(rec.createdAt).toLocaleString() : ''}</td>
                                    <td>
                                        <button
                                            className="btn btn-error text-white"
                                            onClick={() => handleDelete(rec._id, rec.queryId)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyRecommendations;
