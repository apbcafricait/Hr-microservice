import React, { useState } from 'react';

const SelfAssessment = () => {
  const [ratings, setRatings] = useState({
    communication: 0,
    teamwork: 0,
    productivity: 0,
    problemSolving: 0,
  });

  const [comments, setComments] = useState('');

  const handleRatingChange = (aspect, value) => {
    setRatings({ ...ratings, [aspect]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic (e.g., save to a database or state management)
    console.log('Self-Assessment Ratings:', ratings);
    console.log('Comments:', comments);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Self Assessment</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <h3 className="text-md font-semibold">Assess Your Performance</h3>
          {['communication', 'teamwork', 'productivity', 'problemSolving'].map((aspect) => (
            <div key={aspect} className="flex items-center mb-2">
              <label className="mr-2">{aspect.charAt(0).toUpperCase() + aspect.slice(1)}:</label>
              <select
                value={ratings[aspect]}
                onChange={(e) => handleRatingChange(aspect, e.target.value)}
                className="border border-gray-300 rounded p-1"
              >
                <option value="0">Select Rating</option>
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Comments/Reflections:</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Reflect on your performance and provide comments..."
            className="border border-gray-300 rounded p-2 w-full"
            rows="4"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit Self-Assessment
        </button>
      </form>
    </div>
  );
};

export default SelfAssessment;