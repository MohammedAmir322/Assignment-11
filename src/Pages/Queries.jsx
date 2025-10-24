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
	const [searchParams, setSearchParams] = useSearchParams();

	const [columns, setColumns] = useState(3);
	const [queries, setQueries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');

	// initialize filters from URL params
	const [selectedTag, setSelectedTag] = useState(() => searchParams.get('tag') || '');
	const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') || '');

	// fetch queries (server-side filtering if tag/category provided)
	const loadQueries = async () => {
		setLoading(true);
		try {
			const qs = new URLSearchParams();
			if (selectedTag) qs.set('tag', selectedTag);
			if (selectedCategory) qs.set('category', selectedCategory);
			const url = `https://product-server-navy.vercel.app/my-queries${qs.toString() ? `?${qs.toString()}` : ''}`;
			const res = await axios.get(url);
			setQueries(Array.isArray(res.data) ? res.data : []);
		} catch (error) {
			console.error('Failed to load queries', error);
			setQueries([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadQueries();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedTag, selectedCategory]);

	// sync URL params
	useEffect(() => {
		const next = new URLSearchParams();
		if (selectedTag) next.set('tag', selectedTag);
		if (selectedCategory) next.set('category', selectedCategory);
		setSearchParams(next, { replace: true });
	}, [selectedTag, selectedCategory, setSearchParams]);

	// derive categories and tags from fetched queries
	const categories = useMemo(() => [...new Set(queries.map(q => q.category).filter(Boolean))], [queries]);
	const allTags = useMemo(() => [...new Set(queries.flatMap(q => q.tags || []))], [queries]);

	// filter client-side by search + selected filters
	const filteredQueries = useMemo(() => {
		const term = search.trim().toLowerCase();
		return queries.filter(q => {
			const matchesSearch =
				!term ||
				(q.productName && q.productName.toLowerCase().includes(term)) ||
				(q.queryTitle && q.queryTitle.toLowerCase().includes(term));
			const matchesCategory = !selectedCategory || q.category === selectedCategory;
			const matchesTag = !selectedTag || (Array.isArray(q.tags) && q.tags.includes(selectedTag));
			return matchesSearch && matchesCategory && matchesTag;
		});
	}, [queries, search, selectedCategory, selectedTag]);

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
					placeholder="Search by Product Name or Query Title..."
					value={search}
					onChange={e => setSearch(e.target.value)}
					className="input input-bordered w-full max-w-md"
				/>

				<div className="flex gap-3 items-center">
					<select
						className="select select-bordered"
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value)}
					>
						<option value="">All Categories</option>
						{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
					</select>

					<input
						type="text"
						placeholder="Filter by tag (or click a tag below)"
						value={selectedTag}
						onChange={(e) => setSelectedTag(e.target.value)}
						className="input input-bordered"
					/>
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
				</div>
			</div>

			{/* Tag quick filters */}
			{allTags.length > 0 && (
				<div className="mb-4 flex flex-wrap gap-2 items-center">
					<span className="text-sm font-medium text-gray-600">Tags:</span>
					{allTags.slice(0, 20).map(tag => (
						<button
							key={tag}
							onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
							className={`btn btn-xs ${selectedTag === tag ? 'btn-primary' : 'btn-outline'}`}
						>
							{tag}
						</button>
					))}
					{selectedTag && (
						<button onClick={() => setSelectedTag('')} className="btn btn-xs btn-ghost">Clear Tag</button>
					)}
				</div>
			)}

			<div className={`grid ${gridClass} gap-6`}>
				{loading ? (
					<div className="col-span-full text-center text-gray-500">Loading...</div>
				) : filteredQueries.length === 0 ? (
					<div className="col-span-full text-center text-gray-500">No queries found.</div>
				) : (
					filteredQueries.map(query => (
						<div key={query._id || query.id} className="bg-white rounded shadow p-6 flex flex-col justify-between">
							{(query.productImage || query.image) && (
								<img
									src={query.productImage || query.image}
									alt={query.productName}
									className="w-full h-40 object-cover rounded mb-4"
								/>
							)}
							<div>
								<div className="font-semibold text-lg mb-2">{query.queryTitle || query.question}</div>
								<div className="text-sm text-gray-500 mb-1"><span className="font-bold">Product:</span> {query.productName}</div>
								{query.category && (
									<div className="text-sm text-gray-500 mb-1">
										<span className="font-bold">Category:</span>
										<span className="badge badge-outline badge-sm ml-1">{query.category}</span>
									</div>
								)}
								<div className="text-sm text-gray-500 mb-1"><span className="font-bold">Date:</span> {query.createdAt ? new Date(query.createdAt).toLocaleDateString() : query.date}</div>
								<div className="text-sm text-gray-500 mb-1"><span className="font-bold">Recommendation Count:</span> {query.recommendationCount ?? 0}</div>

								{Array.isArray(query.tags) && query.tags.length > 0 && (
									<div className="mt-2 flex flex-wrap gap-2">
										{query.tags.map((tag, idx) => (
											<button
												key={idx}
												type="button"
												className="badge badge-outline badge-sm"
												onClick={() => setSelectedTag(tag)}
											>
												#{tag}
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