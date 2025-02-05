import React from 'react';

const ReviewHistory = () => {
  // Sample review data
  const reviews = [
    {
      date: '2023-01-15',
      rating: 4.5,
      comments: 'Great performance and teamwork!',
    },
    {
      date: '2023-06-10',
      rating: 4.2,
      comments: 'Consistent performance, but room for improvement in time management.',
    },
    {
      date: '2023-11-05',
      rating: 4.8,
      comments: 'Exceptional work on the recent project! Keep it up.',
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Review History</h2>

      {/* Review List */}
      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <ul className="list-disc pl-5">
          {reviews.map((review, index) => (
            <li key={index} className="mb-4">
              <p><strong>Date:</strong> {review.date}</p>
              <p><strong>Rating:</strong> {review.rating} / 5.0</p>
              <p><strong>Comments:</strong> {review.comments}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Performance Evolution Chart (Example Placeholder) */}
      <div className="mt-6">
        <h3 className="text-md font-semibold">Performance Evolution</h3>
        <div style={{ width: '100%', height: '200px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <p style={{ textAlign: 'center', paddingTop: '80px' }}>Performance Ratings Over Time (Placeholder)</p>
          {/* Here, you can integrate a chart library to visualize the performance evolution */}
        </div>
      </div>
    </div>
  );
};

export default ReviewHistory;