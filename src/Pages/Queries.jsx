import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CiViewTable } from "react-icons/ci";
import { MdTableRows } from "react-icons/md";
import { LiaTableSolid } from "react-icons/lia";
import axios from 'axios';

const gridOptions = [
    { label: <CiViewTable />, value: 1 },
    { label: <MdTableRows />, value: 2 },
    { label: <LiaTableSolid />, value: 3 }
];

const Queries = () => {
    const navigate = useNavigate();
    const [columns, setColumns] = useState(3);
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTag, setSelectedTag] = useState('');

 
    const loadQueries = async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://product-server-navy.vercel.app/my-queries');
            setQueries(res.data);
        } catch (error) {
            setQueries([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQueries();
    }, []);

    const filteredQueries = queries.filter(query => {
        const matchesSearch = query.productName?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !selectedCategory || query.category === selectedCategory;
        const matchesTag = !selectedTag || (query.tags && query.tags.includes(selectedTag));
        return matchesSearch && matchesCategory && matchesTag;
    });

    // Get all unique tags from queries
    const allTags = [...new Set(queries.flatMap(q => q.tags || []))].sort();

    const gridClass = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    }[columns];

    return (
        <div className="max-w-5xl mx-auto mt-8 p-4">
            <h2 className="text-2xl font-bold mb-4">All Queries</h2>
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <input
                        type="text"
                        placeholder="Search by Product Name..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input input-bordered w-full max-w-md"
                    />
                    <div className="flex gap-2 mt-2 md:mt-0">
                        {gridOptions.map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                className={`btn btn-sm btn-square flex items-center justify-center ${columns === opt.value ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setColumns(opt.value)}
                                title={`${opt.value} Column${opt.value > 1 ? 's' : ''}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                    <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="select select-bordered select-sm w-full md:w-auto"
                    >
                        <option value="">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Home Appliances">Home Appliances</option>
                        <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                        <option value="Sports & Outdoors">Sports & Outdoors</option>
                        <option value="Food & Beverages">Food & Beverages</option>
                        <option value="Automotive">Automotive</option>
                        <option value="Books & Media">Books & Media</option>
                        <option value="Other">Other</option>
                    </select>
                    <select
                        value={selectedTag}
                        onChange={e => setSelectedTag(e.target.value)}
                        className="select select-bordered select-sm w-full md:w-auto"
                    >
                        <option value="">All Tags</option>
                        {allTags.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                    {(selectedCategory || selectedTag || search) && (
                        <button
                            onClick={() => {
                                setSearch('');
                                setSelectedCategory('');
                                setSelectedTag('');
                            }}
                            className="btn btn-sm btn-ghost"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>
            <div className={`grid ${gridClass} gap-6`}>
                {loading ? (
                    <div className="col-span-full text-center text-gray-500">Loading...</div>
                ) : filteredQueries.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500">No queries found.</div>
                ) : (
                    filteredQueries.map(query => (
                        <div key={query._id || query.id} className="bg-white rounded shadow p-6 flex flex-col justify-between">
                            <img
                                src={query.productImage || query.image}
                                alt={query.productName}
                                className="w-full h-40 object-cover rounded mb-4"
                            />
                            <div>
                                <div className="font-semibold text-lg mb-2">{query.queryTitle || query.question}</div>
                                <div className="text-sm text-gray-500 mb-1">
                                    <span className="font-bold">Product:</span> {query.productName}
                                </div>
                                {query.category && (
                                    <div className="text-sm text-gray-500 mb-1">
                                        <span className="font-bold">Category:</span> <span className="badge badge-primary badge-sm">{query.category}</span>
                                    </div>
                                )}
                                <div className="text-sm text-gray-500 mb-1">
                                    <span className="font-bold">Date:</span> {query.createdAt ? new Date(query.createdAt).toLocaleDateString() : query.date}
                                </div>
                                <div className="text-sm text-gray-500 mb-1">
                                    <span className="font-bold">Recommendation Count:</span> {query.recommendationCount ?? 0}
                                </div>
                                {query.tags && query.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {query.tags.map((tag, idx) => (
                                            <button
                                                key={idx}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedTag(tag);
                                                }}
                                                className="badge badge-outline badge-sm cursor-pointer hover:badge-secondary"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={() => navigate(`/recommend/${query._id || query.id}`)}
                                >
                                    Recommend
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Queries;