import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetAllReportsQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
  useDeleteReportMutation,
} from "../../../slices/ReportSlice";
import { useGetEmployeeQuery } from "../../../slices/employeeSlice";
import EmployeeHeader from "../../Layouts/EmployeeHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReportTo = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;

  // Fetch employee data
  const {
    data: employee,
    isLoading: isEmployeeLoading,
    error: employeeError,
  } = useGetEmployeeQuery(id);

  const employeeId = employee?.data?.employee?.id || "";
  const organisationId = employee?.data?.employee?.organisation?.id || "";

  // Fetch all reports
  const { data: reports, isLoading: isReportsLoading } = useGetAllReportsQuery({
    employeeId,
    organisationId,
  });

  // Mutations
  const [createReport] = useCreateReportMutation();
  const [updateReport] = useUpdateReportMutation();
  const [deleteReport] = useDeleteReportMutation();

  // State
  const [comment, setComment] = useState("");
  const [editReportId, setEditReportId] = useState(null);

  // Handlers
  const handleSaveReport = async () => {
    if (!employeeId || !organisationId || !comment.trim()) {
      toast.error("Please ensure all fields are filled out before submitting.");
      return;
    }

    const reportData = { employeeId, organisationId, comment };

    try {
      if (editReportId) {
        // Update existing report
        const response = await updateReport({ id: editReportId, ...reportData }).unwrap();
        toast.success("Report updated successfully!");
        console.log("Updated Report:", response);
      } else {
        // Create new report
        const response = await createReport(reportData).unwrap();
        toast.success("Report saved successfully!");
        console.log("Created Report:", response);
      }
      setComment("");
      setEditReportId(null); // Reset editing state
    } catch (error) {
      console.error("Failed to save the report:", error);
      toast.error("Error saving the report. Please try again.");
    }
  };

  const handleEditReport = (report) => {
    setEditReportId(report.id);
    setComment(report.comment);
  };

  const handleDeleteReport = async (reportId) => {
    try {
      await deleteReport(reportId).unwrap();
      toast.success("Report deleted successfully!");
    } catch (error) {
      console.error("Failed to delete the report:", error);
      toast.error("Error deleting the report. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <EmployeeHeader />

      <div className="pt-24 p-6 flex-1">
        <h2 className="text-lg font-semibold mb-4">Report To</h2>
        <div className="border border-gray-300 p-4 rounded">
          {isEmployeeLoading && <p>Loading employee data...</p>}
          {employeeError && <p>Error loading employee data.</p>}
          {!isEmployeeLoading && !employeeError && (
            <>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Add a comment"
                  rows="4"
                ></textarea>
              </div>
              <button
                onClick={handleSaveReport}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
              >
                {editReportId ? "Update Report" : "Save Report"}
              </button>
            </>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">Reports</h3>
          {isReportsLoading ? (
            <p>Loading reports...</p>
          ) : (
            reports?.map((report) => (
              <div
                key={report.id}
                className="border border-gray-200 p-3 rounded mb-2"
              >
                <p>Employee ID: {report.employeeId}</p>
                <p>Organisation ID: {report.organisationId}</p>
                <p>Comment: {report.comment}</p>
                <div className="mt-2">
                  <button
                    onClick={() => handleEditReport(report)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ReportTo;
