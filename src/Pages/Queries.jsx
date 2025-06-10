import React from 'react';

const sampleQueries = [
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
    }
];

const Queries = () => {
    return (
        <div className="max-w-2xl mx-auto mt-8 p-4">
            <h2 className="text-2xl font-bold mb-4">Recent Queries</h2>
            <ul className="space-y-4">
                {sampleQueries.map(query => (
                    <li key={query.id} className="bg-white rounded shadow p-4">
                        <div className="font-semibold">{query.question}</div>
                        <div className="text-sm text-gray-500 mt-1">
                            Asked by {query.user} on {query.date}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Queries;