import React, { useState } from 'react';

const Feedback = () => {
  const [feedbackType, setFeedbackType] = useState('positive');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);

  const handleFeedbackTypeChange = (e) => {
    setFeedbackType(e.target.value);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (feedbackText.trim()) {
      // Add the feedback to the list
      setFeedbackList([...feedbackList, { type: feedbackType, text: feedbackText }]);
      setFeedbackText('');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Feedback Section</h2>

      {/* Feedback Request Form */}
      <form onSubmit={handleFeedbackSubmit} className="mb-4">
        <div className="mb-2">
          <label className="block mb-1">Request Feedback Type:</label>
          <select
            value={feedbackType}
            onChange={handleFeedbackTypeChange}
            className="border border-gray-300 rounded p-1"
          >
            <option value="positive">Positive</option>
            <option value="constructive">Constructive</option>
            <option value="general">General</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Feedback Message:</label>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Enter your feedback here..."
            className="border border-gray-300 rounded p-2 w-full"
            rows="4"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit Feedback
        </button>
      </form>

      {/* Feedback List */}
      <h3 className="text-md font-semibold mb-2">Received Feedback</h3>
      <ul className="list-disc pl-5">
        {feedbackList.length > 0 ? (
          feedbackList.map((feedback, index) => (
            <li key={index} className={`mb-2 ${feedback.type === 'positive' ? 'text-green-600' : feedback.type === 'constructive' ? 'text-orange-600' : 'text-gray-600'}`}>
              <strong>{feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}:</strong> {feedback.text}
            </li>
          ))
        ) : (
          <li>No feedback received yet.</li>
        )}
      </ul>
    </div>
  );
};

export default Feedback;