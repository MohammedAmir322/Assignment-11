import React from 'react';
import { useNavigate, Link } from 'react-router';
import Swal from 'sweetalert2';
import axios from 'axios';

const QueryCard = ({ querie, onDelete, handlesetNewQuery }) => {
    const navigate = useNavigate();
    // console.log(querie);

    const handleDelete = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`https://product-server-navy.vercel.app/queries/${querie._id}`)
                    .then(res => {
                        console.log(res.data.result.deletedCount);

                        if (res.data.result.deletedCount) {
                            console.log("under card", querie);

                            handlesetNewQuery(querie._id)

                            Swal.fire({
                                title: "Deleted!",
                                text: "Your query has been deleted.",
                                icon: "success"
                            });
                            if (onDelete) onDelete(querie._id);

                        }
                    })
                    .catch(error => {
                        console.error('Delete failed:', error);
                        Swal.fire("Error", "There was a problem deleting the query.", "error");
                    });
            }
        });
    };

    const handleUpdate = () => {
        navigate(`/updateProduct/${querie._id}`);
    };

    return (
        <div className="bg-white rounded-xl shadow p-4 flex flex-col w-full max-w-md mx-auto">
            {/* Image Section */}
            <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
                <img
                    src={querie.productImage || "https://via.placeholder.com/400x200?text=No+Image"}
                    alt="Product"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-grow justify-between">
                <div>
                    <div className="font-semibold text-lg mb-2">{querie.queryTitle}</div>
                    <div className="text-sm text-gray-500 mb-1">
                        <span className="font-bold">Product:</span> {querie.productName}
                    </div>
                    <div className="text-sm text-gray-500 mb-1">
                        <span className="font-bold">Brand:</span> {querie.productBrand}
                    </div>
                    <div className="text-sm text-gray-500 mb-1">
                        <span className="font-bold">Reason:</span> {querie.reason}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                        {querie.timestamp ? new Date(querie.timestamp).toLocaleString() : ""}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-2 mt-4">
                    <Link to={`/queriesCardDetails/${querie._id}`}>
                        <button className="btn btn-info btn-xs w-full sm:w-auto">
                            View Details
                        </button>
                    </Link>
                    <button
                        className="btn btn-warning btn-xs w-full sm:w-auto"
                        onClick={handleUpdate}
                    >
                        Update
                    </button>
                    <button
                        className="btn btn-error btn-xs w-full sm:w-auto"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QueryCard;