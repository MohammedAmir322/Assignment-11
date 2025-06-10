import React from 'react';
import { Link } from 'react-router';


// Dummy images for slider (replace with your own or use Unsplash links)
const sliderImages = [
    {
        src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
        caption: "Find the Best Products for You"
    },
    {
        src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
        caption: "Ask, Discover, and Get Recommendations"
    },
    {
        src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        caption: "Community Driven Product Queries"
    }
];

// Dummy recent queries (replace with real data from your backend)
const recentQueries = [
    {
        id: 1,
        question: "What is the best laptop for programming in 2025?",
        user: "Alice",
        date: "2025-06-10"
    },
    {
        id: 2,
        question: "Can anyone recommend a good budget smartphone?",
        user: "Bob",
        date: "2025-06-09"
    },
    {
        id: 3,
        question: "Which wireless headphones have the best battery life?",
        user: "Charlie",
        date: "2025-06-08"
    },
    {
        id: 4,
        question: "Is there a smartwatch that works well with both Android and iOS?",
        user: "Diana",
        date: "2025-06-07"
    },
    {
        id: 5,
        question: "Best camera for travel photography?",
        user: "Eve",
        date: "2025-06-06"
    },
    {
        id: 6,
        question: "Affordable tablets for students?",
        user: "Frank",
        date: "2025-06-05"
    }
];

// Simple slider component
function Slider() {
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % sliderImages.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-64 md:h-80 relative overflow-hidden rounded-xl shadow-lg mb-8">
            {sliderImages.map((img, idx) => (
                <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ${current === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <img
                        src={img.src}
                        alt={img.caption}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <h2 className="text-2xl md:text-4xl font-bold text-white text-center drop-shadow-lg animate-fade-in">
                            {img.caption}
                        </h2>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Extra Section 1: Animated Stats
function StatsSection() {
    return (
        <div className="my-12 py-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-around gap-8">
            <div className="text-center animate-bounce">
                <div className="text-4xl font-bold text-purple-700">10K+</div>
                <div className="text-lg text-gray-700">Queries Solved</div>
            </div>
            <div className="text-center animate-pulse">
                <div className="text-4xl font-bold text-pink-700">5K+</div>
                <div className="text-lg text-gray-700">Active Users</div>
            </div>
            <div className="text-center animate-bounce">
                <div className="text-4xl font-bold text-blue-700">1K+</div>
                <div className="text-lg text-gray-700">Product Reviews</div>
            </div>
        </div>
    );
}

// Extra Section 2: Call to Action
function CTASection() {
    return (
        <div className="my-12 py-10 px-6 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
                <h3 className="text-2xl md:text-3xl font-bold text-blue-700 mb-2">Ready to Ask or Recommend?</h3>
                <p className="text-gray-700 mb-4">Join our community and help others by sharing your experience or get the best advice for your next purchase.</p>
                <Link to="/register" className="btn btn-primary mr-2">Get Started</Link>
                <Link to="/queries" className="btn btn-outline">View Queries</Link>
            </div>
            <div className="w-40 h-40 md:w-56 md:h-56 flex items-center justify-center animate-spin-slow">
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#38bdf8" strokeWidth="8" fill="none" />
                    <circle cx="50" cy="50" r="30" stroke="#a21caf" strokeWidth="4" fill="none" />
                    <circle cx="50" cy="50" r="20" stroke="#22d3ee" strokeWidth="2" fill="none" />
                </svg>
            </div>
        </div>
    );
}

const Home = () => {
    return (
        <div className="min-h-screen bg-base-100">
            {/* Slider Section */}
            <Slider />

            {/* Recent Queries Section */}
            <section className="max-w-5xl mx-auto px-4">
                <h2 className="text-2xl font-bold mb-4 text-center">Recent Queries</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recentQueries.map((query) => (
                        <div key={query.id} className="bg-white rounded-lg shadow p-5 hover:shadow-xl transition">
                            <div className="font-semibold text-lg mb-2">{query.question}</div>
                            <div className="text-sm text-gray-500 mb-1">
                                Asked by <span className="font-bold">{query.user}</span>
                            </div>
                            <div className="text-xs text-gray-400">{query.date}</div>
                            <Link to="/queries" className="btn btn-link btn-xs mt-2 px-0">See More</Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Extra Section 1: Animated Stats */}
            <StatsSection />

            {/* Extra Section 2: Call to Action */}
            <CTASection />

            {/* Footer */}
            <footer className="mt-12 py-6 bg-base-200 text-center text-gray-600 rounded-t-xl">
                &copy; {new Date().getFullYear()} Product Recommend. All rights reserved.
            </footer>
        </div>
    );
};

export default Home;