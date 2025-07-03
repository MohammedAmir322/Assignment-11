import React from 'react';

const MyRecommendations = () => {
    return (
        <div>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Query Title</th>
                            <th>Recommended Product</th>
                            <th>Reason</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>1</th>
                            <td>Coke er moto deshi drink ache?</td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <img
                                        src="https://randomuser.me/api/portraits/men/32.jpg"
                                        alt="Curran Yates"
                                        className="w-10 h-10 rounded-md object-cover"
                                    />
                                    <span className="font-semibold">Curran Yates</span>
                                </div>
                            </td>
                            <td>Aliquip sint officia</td>
                            <td>
                                <button className="btn btn-error text-white">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default MyRecommendations;