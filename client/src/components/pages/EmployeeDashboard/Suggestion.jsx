import { useState } from "react";
import { useCreateSuggestionMutation, useGetAllSuggestionsQuery } from "../../../slices/suggestionsApiSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import EmployeeHeader from "../../Layouts/EmployeeHeader";
import { useGetEmployeeQuery } from "../../../slices/employeeSlice";
import { skipToken } from '@reduxjs/toolkit/query';

const Suggestion = ({ hideHeader = false }) => {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [createSuggestion, { isLoading: isSubmitting }] = useCreateSuggestionMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: employee, isLoading: isEmployeeLoading } = useGetEmployeeQuery(id);
  const organisationId = employee?.data.employee.organisation.id;
  const employeeId = parseInt(employee?.data.employee.id);
  console.log(employeeId, "employee id")
  

  // Fetch all suggestions for the organisation without pagination
  const {
    data: suggestions,
    isLoading: isSuggestionsLoading,
    error: suggestionsError,
    refetch,
  } = useGetAllSuggestionsQuery(
    organisationId ? { organisationId } : skipToken, // Fetch by organisationId only
    { skip: !organisationId }
  );

  // Filter suggestions to only include those matching the current employee's employeeId
  const totalSuggestions = suggestions?.data?.suggestions || [];
  console.log(totalSuggestions, "Total Suggestions")
  const filteredSuggestions = totalSuggestions.filter(
    (suggestion) => suggestion.employeeId === employeeId
  );
console.log(filteredSuggestions, "GFiltered")
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!organisationId || !employeeId) {
      toast.error("Organisation or Employee ID not available. Please try again.");
      return;
    }
    try {
      const body = {
        organisationId,
        employeeId,
        content,
        isAnonymous,
      };
      const response = await createSuggestion(body).unwrap();
      toast.success("Suggestion submitted successfully!");
      console.log("Suggestion created:", response);
      setContent("");
      setIsAnonymous(true);
      refetch(); // Refetch suggestions after submission
    } catch (error) {
      console.error("Failed to submit suggestion:", error);
      toast.error("Failed to submit the suggestion. Please try again.");
    }
  };

  // Helper function to format ISO dates to "YYYY-MM-DD"
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!hideHeader && <EmployeeHeader />}
      <main className="flex-1 max-w-4xl mx-auto w-full p-6">
        {/* Enhanced Suggestion Form */}
        <section className="bg-white rounded-xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Submit a Suggestion
            </h2>
            <p className="text-indigo-100 mt-1 text-sm">Share your ideas to improve our workplace</p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Suggestion Content</label>
              <div className="relative">
                <textarea
                  id="content"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out hover:border-indigo-400 resize-none"
                  rows="4"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your suggestion here..."
                  required
                />
                <svg
                  className="absolute left-3 top-4 w-5 h-5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAnonymous"
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition-all duration-300"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <label htmlFor="isAnonymous" className="ml-2 text-sm font-medium text-gray-700">
                Submit as anonymous
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              disabled={isSubmitting || isEmployeeLoading}
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              )}
              <span>{isSubmitting ? "Submitting..." : "Submit Suggestion"}</span>
            </button>
          </form>
        </section>

        {/* Suggestions Table (Filtered by employeeId) */}
        <section className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Past Suggestions</h2>
          <div className="overflow-x-auto">
            {isEmployeeLoading || isSuggestionsLoading ? (
              <div className="text-center py-4 text-gray-500">Loading suggestions...</div>
            ) : suggestionsError ? (
              <div className="text-center py-4 text-red-500">
                Error loading suggestions: {suggestionsError?.data?.message || "Unknown error"}
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Content</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Submitted At</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Anonymous</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((suggestion) => (
                      <tr key={suggestion.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-600">{suggestion.content}</td>
                        <td className="px-6 py-4 text-gray-600">{formatDate(suggestion.createdAt)}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {suggestion.isAnonymous ? "Yes" : "No"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                        No suggestions found for you.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Suggestion;