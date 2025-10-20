import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';

const AddQueries = () => {
    const { user } = useContext(AuthContext)
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
            // Advanced: tags and category for filtering/browsing
            tags: form.tags?.value
                ? form.tags.value
                    .split(',')
                    .map(t => t.trim())
                    .filter(Boolean)
                : [],
            category: form.category?.value || '',
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
            <div >

                <div class="relative inline-flex  group">
                    <div
                        class="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
                    </div>
                    <a href="/my-queries" title="Get quote now"
                    // onClick={() => navigate('/')}
                        class="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                        role="button">Go Back
                    </a>
                </div>
            </div>
           
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
                <input
                    type="text"
                    name="tags"
                    placeholder="Tags (comma-separated, e.g., laptop, gaming, budget-friendly)"
                    className="input input-bordered w-full"
                />
                <select name="category" className="select select-bordered w-full">
                    <option value="">Select Category (optional)</option>
                    <option>Electronics</option>
                    <option>Fashion</option>
                    <option>Home Appliances</option>
                    <option>Other</option>
                </select>
                <button className="btn btn-primary mt-2" type="submit">
                    Add Query
                </button>
            </form>
        </div>
    );
};
export default AddQueries;