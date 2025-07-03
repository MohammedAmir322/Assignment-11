import React from 'react';
import { useNavigate } from 'react-router'; // Fixed import
import Swal from 'sweetalert2';

const AddQueries = () => {
    const navigate = useNavigate();

    const handleAddQueries = e => {
        e.preventDefault();
        const form = e.target;
        // const formData = new FormData(form);
        // const queriesData = Object.fromEntries(formData.entries());

        
        const newQuery = {
            // ...queriesData,
            createdAt: new Date().toISOString(),
            recommendationCount: 0,
        };

        fetch('http://localhost:3000/queries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newQuery),
        })
            .then(res => res.json())
            .then(data => {
                if (data.insertedId) {
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
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong while saving the query!",
                    confirmButtonColor: "#d33",
                });
            });
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