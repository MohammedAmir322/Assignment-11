import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';

const AddQueries = () => {
    const {user}= useContext(AuthContext)
    const navigate = useNavigate();

    const handleAddQueries = async e => {
        e.preventDefault();
        const form = e.target;

        // Collect form data
        const newQuery = {
            productName: form.productName.value,
            productBrand: form.productBrand.value,
            productImage: form.productImage.value,
            queryTitle: form.queryTitle.value,
            reason: form.reason.value,
            email: user.email,
            createdAt: new Date().toISOString(),
            recommendationCount: 0,
        };

        try {
            const response = await axios.post('https://product-server-navy.vercel.app/queries', newQuery);
            if (response.data.insertedId) {
                Swal.fire({
                    title: "Query Added Successfully!",
                    icon: "success",
                    text: "This new Query has been saved and published.",
                    showConfirmButton: false,
                    timer: 1500,
                });
                form.reset();
                setTimeout(() => {
                    navigate('/my-queries');
                }, 1500);
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong while saving the query!",
                confirmButtonColor: "#d33",
            });
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
            <button
                className="btn btn-outline btn-lg px-8 text-lg shadow-md"
                onClick={() => navigate('/')}
            >
                Go Back
            </button>
            <h2 className="text-2xl font-bold mb-6 text-purple-700">Add a New Query</h2>
            <form onSubmit={handleAddQueries} className="flex flex-col gap-4">
                <input
                    type="text"
                    name="productName"
                    placeholder="Product Name"
                    className="input input-bordered w-full"
                    required
                />
                <input
                    type="text"
                    name="productBrand"
                    placeholder="Product Brand"
                    className="input input-bordered w-full"
                    required
                />
                <input
                    type="url"
                    name="productImage"
                    placeholder="Product Image URL"
                    className="input input-bordered w-full"
                    required
                />
                <input
                    type="text"
                    name="queryTitle"
                    placeholder="Query Title (e.g., Is there any better product that gives me the same quality?)"
                    className="input input-bordered w-full"
                    required
                />
                <textarea
                    name="reason"
                    placeholder="Boycotting Reason Details (the reason you don’t want this product)"
                    className="textarea textarea-bordered w-full"
                    rows={4}
                    required
                />
                <button className="btn btn-primary mt-2" type="submit">
                    Add Query
                </button>
            </form>
        </div>
    );
};
export default AddQueries;