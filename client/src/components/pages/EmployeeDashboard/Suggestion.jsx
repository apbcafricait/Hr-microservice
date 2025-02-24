import { useState } from "react";
import { useCreateSuggestionMutation } from "../../../slices/suggestionsApiSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import EmployeeHeader from "../../Layouts/EmployeeHeader"; // Import the new header component

const Suggestion = ({ hideHeader = false }) => {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [createSuggestion, { isLoading }] = useCreateSuggestionMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const organisationId = orgEmpData?.data.employee.organisation.id;

    try {
      const body = {
        organisationId,
        content,
        isAnonymous,
      };
      const response = await createSuggestion(body).unwrap();
      toast.success("Suggestion submitted successfully!");
      console.log("Suggestion created:", response);
      setContent("");
      setIsAnonymous(true);
    } catch (error) {
      console.error("Failed to submit suggestion:", error);
      toast.error("Failed to submit the suggestion. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {!hideHeader && <EmployeeHeader />}
      <main className="flex-1 p-6">
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-4">Submit a Suggestion</h2>
          <form onSubmit={handleSubmit}>
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
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Suggestion"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Suggestion