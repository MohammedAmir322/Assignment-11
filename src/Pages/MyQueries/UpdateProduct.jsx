import React, { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router'; 
import Swal from 'sweetalert2';

const UpdateProduct = () => {
    const querie = useLoaderData();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        productName: querie.productName || '',
        productBrand: querie.productBrand || '',
        productImage: querie.productImage || '',
        queryTitle: querie.queryTitle || '',
        reason: querie.reason || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateQueries = (e) => {
        e.preventDefault();

        fetch(`https://product-server-navy.vercel.app/queries/${querie._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(res => res.json())
        .then(data => {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500
            });
            setTimeout(() => {
                navigate('/my-queries');
            }, 1500);
        })
        .catch(err => {
            console.error('Update failed:', err);
            Swal.fire("Error", "There was a problem updating the query.", "error");
        });
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
            <button
                className="btn btn-outline btn-lg px-8 text-lg shadow-md mb-4"
                onClick={() => navigate(-1)}
            >
                Go Back
            </button>

            <h2 className="text-2xl font-bold mb-6 text-purple-700">
                Update Your Product Query
            </h2>

            <form onSubmit={handleUpdateQueries} className="flex flex-col gap-4">
                <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="Product Name"
                    className="input input-bordered w-full"
                    required
                />
                <input
                    type="text"
                    name="productBrand"
                    value={formData.productBrand}
                    onChange={handleChange}
                    placeholder="Product Brand"
                    className="input input-bordered w-full"
                    required
                />
                <input
                    type="url"
                    name="productImage"
                    value={formData.productImage}
                    onChange={handleChange}
                    placeholder="Product Image URL"
                    className="input input-bordered w-full"
                    required
                />
                <input
                    type="text"
                    name="queryTitle"
                    value={formData.queryTitle}
                    onChange={handleChange}
                    placeholder="Query Title"
                    className="input input-bordered w-full"
                    required
                />
                <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Boycotting Reason Details"
                    className="textarea textarea-bordered w-full"
                    rows={4}
                    required
                />
                <button className="btn btn-primary mt-2" type="submit">
                    Update Query
                </button>
            </form>
        </div>
    );
};

export default UpdateProduct;