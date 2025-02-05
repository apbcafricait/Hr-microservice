import React, { useState } from 'react';

const PerformanceReviews = () => {
  // Sample review data
  const [reviews, setReviews] = useState([
    {
      id: 1,
      employeeName: 'Alice Johnson',
      date: '2023-01-15',
      rating: 4.5,
      comments: 'Great performance and teamwork!',
    },
    {
      id: 2,
      employeeName: 'Bob Smith',
      date: '2023-06-10',
      rating: 4.2,
      comments: 'Consistent performance, but room for improvement in time management.',
    },
  ]);

  const [newReview, setNewReview] = useState({
    employeeName: '',
    date: '',
    rating: 0,
    comments: '',
  });

  // Handle input changes for the new review form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  // Add new review
  const addReview = () => {
    setReviews([...reviews, { ...newReview, id: reviews.length + 1 }]);
    setNewReview({ employeeName: '', date: '', rating: 0, comments: '' });
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Performance Reviews</h2>

      {/* Review List */}
      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <ul className="list-disc pl-5 mb-4">
          {reviews.map((review) => (
            <li key={review.id} className="mb-4">
              <p><strong>Employee:</strong> {review.employeeName}</p>
              <p><strong>Date:</strong> {review.date}</p>
              <p><strong>Rating:</strong> {review.rating} / 5.0</p>
              <p><strong>Comments:</strong> {review.comments}</p>
            </li>
          ))}
        </ul>
      )}

      {/* New Review Form */}
      <h3 className="text-md font-semibold mb-2">Add New Review</h3>
      <div className="mb-4">
        <input
          type="text"
          name="employeeName"
          placeholder="Employee Name"
          value={newReview.employeeName}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="date"
          name="date"
          value={newReview.date}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating (1-5)"
          value={newReview.rating}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full"
          min="1"
          max="5"
        />
        <textarea
          name="comments"
          placeholder="Comments"
          value={newReview.comments}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full"
          rows="4"
        />
        <button
          onClick={addReview}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Review
        </button>
      </div>
    </div>
  );
};

export default PerformanceReviews;