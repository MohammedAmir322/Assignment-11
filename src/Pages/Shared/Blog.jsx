import React from 'react';

const Blog = () => {
    const faqs = [
        {
            question: "How does the Product Recommendation System work?",
            answer: "Our system allows users to post queries about products they want alternatives for. Other community members can then provide recommendations based on their experience. Each recommendation can be voted as helpful, and query owners can mark the best solution."
        },
        {
            question: "What makes a good product query?",
            answer: "A good query should include clear details about the product you're looking to replace, including the brand name, specific model/type, and most importantly, your reason for seeking alternatives. Adding relevant tags helps others find and respond to your query."
        },
        {
            question: "How can I make effective recommendations?",
            answer: "When recommending alternatives, focus on providing specific details about why the product is a good alternative. Include your personal experience, key features, and how it compares to the original product. Adding an image and clear reasoning helps others make informed decisions."
        },
        {
            question: "What are helpful votes and how do they work?",
            answer: "Users can mark recommendations as 'helpful' if they find the information valuable. These votes help surface the most useful recommendations and contribute to the recommender's reputation in the community. Each user can vote once per recommendation."
        },
        {
            question: "How does the 'Best Solution' feature work?",
            answer: "The original query poster can mark one recommendation as the 'Best Solution'. This helps other users quickly identify the most effective alternative and marks the query as resolved. The best solution appears highlighted at the top of the recommendations list."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
                    About Our Product Recommendation System
                </h1>
                
                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                {faq.question}
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-blue-900 mb-4">
                        Want to Get Started?
                    </h2>
                    <p className="text-blue-800 mb-4">
                        Join our community to start sharing your product experiences and helping others make informed decisions.
                    </p>
                    <div className="flex gap-4">
                        <a href="/queries" className="btn btn-primary">
                            Browse Queries
                        </a>
                        <a href="/add-queries" className="btn btn-outline btn-primary">
                            Post a Query
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
