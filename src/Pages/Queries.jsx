import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
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
    const [searchParams, setSearchParams] = useSearchParams();
    const [tagFilter, setTagFilter] = useState(searchParams.get('tag') || '');
    const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTag, setSelectedTag] = useState('');

 
    const loadQueries = async () => {
        setLoading(true);
        try {
            const qs = new URLSearchParams();
            if (tagFilter) qs.set('tag', tagFilter);
            if (categoryFilter) qs.set('category', categoryFilter);
            const url = `https://product-server-navy.vercel.app/my-queries${qs.toString() ? `?${qs.toString()}` : ''}`;
            const res = await axios.get(url);
            setQueries(res.data);
        } catch (error) {
            setQueries([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQueries();
    }, [tagFilter, categoryFilter]);

    useEffect(() => {
        const next = new URLSearchParams();
        if (tagFilter) next.set('tag', tagFilter);
        if (categoryFilter) next.set('category', categoryFilter);
        setSearchParams(next);
    }, [tagFilter, categoryFilter, setSearchParams]);

    const filteredQueries = useMemo(() => {
        return queries.filter(query => {
            const matchesText = query.productName?.toLowerCase().includes(search.toLowerCase());
            const matchesTag = tagFilter ? Array.isArray(query.tags) && query.tags.includes(tagFilter) : true;
            const matchesCategory = categoryFilter ? query.category === categoryFilter : true;
            return matchesText && matchesTag && matchesCategory;
        });
    }, [queries, search, tagFilter, categoryFilter]);
    const filteredQueries = queries.filter(query => {
        const matchesSearch = query.productName?.toLowerCase().includes(search.toLowerCase()) ||
                            query.queryTitle?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !selectedCategory || query.category === selectedCategory;
        const matchesTag = !selectedTag || (query.tags && query.tags.includes(selectedTag));
        return matchesSearch && matchesCategory && matchesTag;
    });

    // Get unique categories and tags for filter options
    const categories = [...new Set(queries.map(q => q.category).filter(Boolean))];
    const allTags = [...new Set(queries.flatMap(q => q.tags || []))];
    
    const handleTagClick = (tag) => {
        setSelectedTag(selectedTag === tag ? '' : tag);
    };

    const gridClass = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    }[columns];

    return (
        <div className="max-w-5xl mx-auto mt-8 p-4">
            <h2 className="text-2xl font-bold mb-4">All Queries</h2>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by Product Name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="input input-bordered w-full max-w-md"
                />
                <div className="flex gap-3 items-center">
                    <input
                        type="text"
                        placeholder="Filter by tag (e.g., gaming)"
                        value={tagFilter}
                        onChange={(e) => setTagFilter(e.target.value)}
                        className="input input-bordered"
                    />
                    <select
                        className="select select-bordered"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option>Electronics</option>
                        <option>Fashion</option>
                        <option>Home Appliances</option>
                        <option>Other</option>
                    </select>
                </div>
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
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <input
                        type="text"
                        placeholder="Search by Product Name or Query Title..."
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
                <div className="flex flex-col md:flex-row gap-4">
                    <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="select select-bordered w-full max-w-xs"
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium text-gray-600 self-center">Tags:</span>
                        {allTags.slice(0, 10).map(tag => (
                            <button
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                className={`btn btn-xs ${selectedTag === tag ? 'btn-primary' : 'btn-outline'}`}
                            >
                                {tag}
                            </button>
                        ))}
                        {selectedTag && (
                            <button
                                onClick={() => setSelectedTag('')}
                                className="btn btn-xs btn-ghost"
                            >
                                Clear Tag
                            </button>
                        )}
                    </div>
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
                                        <span className="font-bold">Category:</span> 
                                        <span className="badge badge-outline badge-sm ml-1">{query.category}</span>
                                    </div>
                                )}
                                <div className="text-sm text-gray-500 mb-1">
                                    <span className="font-bold">Date:</span> {query.createdAt ? new Date(query.createdAt).toLocaleDateString() : query.date}
                                </div>
                                <div className="text-sm text-gray-500 mb-1">
                                    <span className="font-bold">Recommendation Count:</span> {query.recommendationCount ?? 0}
                                </div>
                            {Array.isArray(query.tags) && query.tags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {query.tags.map((tag, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            className="badge badge-outline badge-sm"
                                            onClick={() => setTagFilter(tag)}
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {query.category && (
                                <div className="mt-1">
                                    <span className="badge badge-info badge-outline">{query.category}</span>
                                </div>
                            )}
                                {query.tags && query.tags.length > 0 && (
                                    <div className="mt-2">
                                        <div className="flex flex-wrap gap-1">
                                            {query.tags.map((tag, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleTagClick(tag)}
                                                    className="badge badge-primary badge-sm cursor-pointer hover:badge-primary-focus"
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
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