import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';

const AddQueries = () => {
	const { user } = useContext(AuthContext) || {};
	const navigate = useNavigate();

	const [productName, setProductName] = useState('');
	const [productBrand, setProductBrand] = useState('');
	const [productImage, setProductImage] = useState('');
	const [queryTitle, setQueryTitle] = useState('');
	const [reason, setReason] = useState('');
	const [category, setCategory] = useState('');
	const [tags, setTags] = useState('');
	const [submitting, setSubmitting] = useState(false);

	const handleAddQueries = async (e) => {
		e.preventDefault();
		if (!user?.email) {
			Swal.fire('Login required', 'You must be logged in to add a query.', 'warning');
			navigate('/login');
			return;
		}

		const tagsArray = tags
			.split(',')
			.map(t => t.trim())
			.filter(Boolean);

		const newQuery = {
			productName,
			productBrand,
			productImage,
			queryTitle,
			reason,
			category,
			tags: tagsArray,
			email: user.email,
			userName: user.displayName || user.email.split('@')[0],
			userPhoto: user.photoURL || '',
			createdAt: new Date().toISOString(),
			recommendationCount: 0,
			isResolved: false
		};

		try {
			setSubmitting(true);
			const response = await axios.post('https://product-server-navy.vercel.app/queries', newQuery);
			if (response.data?.insertedId) {
				Swal.fire({ title: 'Query Added!', icon: 'success', timer: 1400, showConfirmButton: false });
				// reset form
				setProductName('');
				setProductBrand('');
				setProductImage('');
				setQueryTitle('');
				setReason('');
				setCategory('');
				setTags('');
				setTimeout(() => navigate('/my-queries'), 600);
			} else {
				throw new Error('Unexpected response');
			}
		} catch (err) {
			console.error(err);
			Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to add the query.' });
		} finally {
			setSubmitting(false);
		}
	};

	if (!user?.email) {
		return (
			<div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow text-center">
				<p className="mb-4">You must be logged in to add a query.</p>
				<button onClick={() => navigate('/login')} className="btn btn-primary">Go to Login</button>
			</div>
		);
	}

	return (
		<div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
			<div className="relative inline-flex group mb-6">
				<div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
				<button
					onClick={() => navigate('/my-queries')}
					className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 rounded-xl focus:outline-none"
					type="button"
				>
					Go Back
				</button>
			</div>

			<h2 className="text-2xl font-bold mb-6 text-purple-700">Add a New Query</h2>
			<form onSubmit={handleAddQueries} className="flex flex-col gap-4">
				<input type="text" placeholder="Product Name" className="input input-bordered w-full" value={productName} onChange={e => setProductName(e.target.value)} required />
				<input type="text" placeholder="Product Brand" className="input input-bordered w-full" value={productBrand} onChange={e => setProductBrand(e.target.value)} required />
				<input type="url" placeholder="Product Image URL" className="input input-bordered w-full" value={productImage} onChange={e => setProductImage(e.target.value)} />
				<input type="text" placeholder="Query Title" className="input input-bordered w-full" value={queryTitle} onChange={e => setQueryTitle(e.target.value)} required />
				<textarea placeholder="Details..." className="textarea textarea-bordered w-full" rows={4} value={reason} onChange={e => setReason(e.target.value)} required />
				<select className="select select-bordered w-full" value={category} onChange={e => setCategory(e.target.value)} required>
					<option value="">Select Category</option>
					<option value="Electronics">Electronics</option>
					<option value="Fashion">Fashion</option>
					<option value="Home Appliances">Home Appliances</option>
					<option value="Beauty & Personal Care">Beauty & Personal Care</option>
					<option value="Sports & Outdoors">Sports & Outdoors</option>
					<option value="Books & Media">Books & Media</option>
					<option value="Food & Beverages">Food & Beverages</option>
					<option value="Automotive">Automotive</option>
					<option value="Health & Wellness">Health & Wellness</option>
					<option value="Other">Other</option>
				</select>
				<input type="text" placeholder="Tags (comma-separated)" className="input input-bordered w-full" value={tags} onChange={e => setTags(e.target.value)} />
				<button className="btn btn-primary mt-2" type="submit" disabled={submitting}>
					{submitting ? 'Submitting...' : 'Add Query'}
				</button>
			</form>
		</div>
	);
};

export default AddQueries;

