import React, { useEffect, useState } from 'react';
import { Link } from 'react-router'; // Corrected import


const stats = [
    { label: "Queries", value: 1200 },
    { label: "Recommendations", value: 3500 },
    { label: "Active Users", value: 800 },
];



const Home = () => {
    
    const [recentQueries, setRecentQueries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://product-server-navy.vercel.app/my-queries')
            .then(res => res.json())
            .then(data => {
                // Show only the 6 most recent
                const sorted = [...data].sort(
                    (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
                );
                setRecentQueries(sorted.slice(0, 6));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div>
            {/* Slider Section */}
            <div className="carousel w-full rounded-lg shadow-2xl overflow-hidden">
    <div id="slide1" className="carousel-item relative w-full">
        <img 
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80"
            className="" 
            style={{ height: "500px", objectFit: "cover", width: "100%" }} 
        />
        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide4" className="btn btn-circle">❮</a>
            <a href="#slide2" className="btn btn-circle">❯</a>
        </div>
    </div>
    <div id="slide2" className="carousel-item relative w-full">
        <img
            src="https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1470&q=80"
            className=""
            style={{ height: "500px", objectFit: "cover", width: "100%" }}
        />
        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide1" className="btn btn-circle">❮</a>
            <a href="#slide3" className="btn btn-circle">❯</a>
        </div>
    </div>
    <div id="slide3" className="carousel-item relative w-full">
        <img
            src="https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1470&q=80"
            className=""
            style={{ height: "500px", objectFit: "cover", width: "100%" }}
        />
        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide2" className="btn btn-circle">❮</a>
            <a href="#slide4" className="btn btn-circle">❯</a>
        </div>
    </div>
    <div id="slide4" className="carousel-item relative w-full">
        <img
            src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1470&q=80"
            className=""
            style={{ height: "500px", objectFit: "cover", width: "100%" }}
        />
        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide3" className="btn btn-circle">❮</a>
            <a href="#slide1" className="btn btn-circle">❯</a>
        </div>
    </div>
</div>

            {/* Recent Queries Section */}
            <div className="max-w-5xl mx-auto px-4 my-12">
                <h2 className="text-2xl font-bold mb-4 text-center">Recent Queries</h2>
                {loading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recentQueries.map((query) => (
                            <div key={query._id || query.id} className="bg-white rounded-lg shadow p-5 hover:shadow-xl transition">
                                <img
                                    src={query.image}
                                    alt={query.productName}
                                    className="w-full h-40 object-cover rounded mb-3"

                                />
                                <div className="font-semibold text-lg mb-1">{query.queryTitle}</div>
                                <div className="text-sm text-gray-500 mb-1">
                                    <span className="font-bold">Product:</span> {query.productName}
                                </div>
                                <div className="text-sm text-gray-500 mb-1">
                                    <span className="font-bold">Brand:</span> {query.productBrand}
                                </div>
                                <div className="text-sm text-gray-500 mb-1">
                                    <span className="font-bold">Recommendation:</span> {query.recommendationCount ?? 0}
                                </div>
                                <Link to="/queries" className="btn btn-link btn-xs mt-2 px-0">See More</Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Extra Section 1: Animated Stats */}
            <section className="my-12 py-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl shadow flex flex-col md:flex-row items-center justify-around gap-8 animate-fade-in">
                {stats.map((stat, idx) => (
                    <div key={idx} className="text-center">
                        <div className="text-4xl md:text-5xl font-extrabold text-purple-700 animate-bounce">{stat.value}+</div>
                        <div className="text-lg md:text-xl font-semibold text-gray-700 mt-2">{stat.label}</div>
                    </div>
                ))}
            </section>

            {/* Extra Section 2: Call to Action */}
            <section className="my-12 py-10 px-6 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center animate-fade-in-up">
                <h3 className="text-2xl md:text-3xl font-bold text-pink-600 mb-4 text-center">
                    Ready to Ask or Recommend?
                </h3>
                <p className="text-gray-600 mb-6 text-center max-w-xl">
                    Join our community and help others make better product choices. Share your experience or get advice from real users!
                </p>
                <Link to="/add-queries" className="btn btn-accent btn-lg shadow-md animate-pulse">
                    Add Your Query
                </Link>
            </section>
      

           
            <section className="my-12 py-10 px-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl shadow-lg flex flex-col items-center justify-center animate-fade-in-up">
                <h3 className="text-2xl md:text-3xl font-bold text-green-700 mb-4 text-center">
                    Featured Community Members
                </h3>
                <p className="text-gray-600 mb-8 text-center max-w-xl">
                    Meet some of our most active and helpful members who make this platform a great place to get advice and share experiences!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                    <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
                        <img src="https://i.ibb.co/yFx4P9Rp/9.jpg" alt="User" className="w-20 h-20 rounded-full mb-3 border-4 border-green-300" />
                        <div className="font-bold text-lg mb-1">Ahmed R.</div>
                        <div className="text-sm text-gray-500 mb-2">Electronics Enthusiast</div>
                        <p className="text-gray-600 text-center">“I love helping people find the best gadgets for their needs!”</p>
                    </div>
                    <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
                        <img src="https://i.ibb.co/k2Vw57Cp/8.jpg" alt="User" className="w-20 h-20 rounded-full mb-3 border-4 border-green-300" />
                        <div className="font-bold text-lg mb-1">Sara M.</div>
                        <div className="text-sm text-gray-500 mb-2">Home Appliances Guru</div>
                        <p className="text-gray-600 text-center">“Sharing my experience with kitchen appliances is my passion!”</p>
                    </div>
                    <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
                        <img src="https://i.ibb.co/CsBQRKNZ/1.jpg" alt="User" className="w-20 h-20 rounded-full mb-3 border-4 border-green-300" />
                        <div className="font-bold text-lg mb-1">Mohamed K.</div>
                        <div className="text-sm text-gray-500 mb-2">Tech Reviewer</div>
                        <p className="text-gray-600 text-center">“I enjoy reviewing products and helping others make smart choices.”</p>
                    </div>
                </div>
            </section>




        </div>
    );
};

export default Home;