
import { useState } from "react";


const Suggestion = () => {
    const [content, setContent] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(true);
  
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Submit a Suggestion</h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Suggestion Content
            </label>
            <textarea
              id="content"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your suggestion here..."
              required
            ></textarea>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isAnonymous"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <label
              htmlFor="isAnonymous"
              className="ml-2 text-sm text-gray-700"
            >
              Submit as anonymous
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Submit Suggestion
          </button>
        </form>
      </div>
    );
  };
  
  export default Suggestion;
  