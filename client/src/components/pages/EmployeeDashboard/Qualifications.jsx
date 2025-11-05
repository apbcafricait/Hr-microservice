import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useGetAllQualificationsQuery,
  useCreateQualificationMutation,
  useUpdateQualificationMutation,
  useDeleteQualificationMutation,
} from "../../../slices/qualificationSlice";
import { FaGraduationCap, FaPlus, FaEdit, FaTrash, FaUniversity } from "react-icons/fa";

const Qualifications = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const employeeId = userInfo?.id;

  const [qualificationData, setQualificationData] = useState({
    id: null,
    institution: "",
    qualification: "",
    startDate: "",
    endDate: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Fetch qualifications with query args
  const { data, isLoading, isError, refetch } = useGetAllQualificationsQuery({});
  const qualifications = data?.data?.qualifications || [];

  // Mutations
  const [createQualification] = useCreateQualificationMutation();
  const [updateQualification] = useUpdateQualificationMutation();
  const [deleteQualification] = useDeleteQualificationMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQualificationData({ ...qualificationData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await updateQualification(qualificationData).unwrap();
        alert("Qualification updated successfully");
      } else {
        const payload = { ...qualificationData, employeeId };
        await createQualification(payload).unwrap();
        alert("Qualification added successfully");
      }

      setQualificationData({
        id: null,
        institution: "",
        qualification: "",
        startDate: "",
        endDate: "",
      });
      setIsEditing(false);
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error("Error submitting qualification:", error);
      alert("Error saving qualification. Please try again.");
    }
  };

  const handleEdit = (qualification) => {
    setQualificationData(qualification);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this qualification?")) {
      try {
        await deleteQualification(id).unwrap();
        alert("Qualification deleted successfully");
        refetch();
      } catch (error) {
        console.error("Error deleting qualification:", error);
        alert("Error deleting qualification. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setQualificationData({
      id: null,
      institution: "",
      qualification: "",
      startDate: "",
      endDate: "",
    });
    setIsEditing(false);
    setShowForm(false);
  };

  useEffect(() => {
    if (!isEditing) {
      setQualificationData({
        id: null,
        institution: "",
        qualification: "",
        startDate: "",
        endDate: "",
      });
    }
  }, [isEditing]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-blue-600">Loading qualifications...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-red-600">Error loading qualifications</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
              <FaGraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Qualifications</h2>
              <p className="text-gray-600">Manage your educational and professional qualifications</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Add Qualification
          </button>
        </div>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Qualification" : "Add New Qualification"}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
                  Institution *
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={qualificationData.institution}
                  onChange={handleInputChange}
                  placeholder="Enter institution name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification *
                </label>
                <input
                  type="text"
                  id="qualification"
                  name="qualification"
                  value={qualificationData.qualification}
                  onChange={handleInputChange}
                  placeholder="e.g., Bachelor's Degree, Certificate"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={qualificationData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={qualificationData.endDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg"
              >
                {isEditing ? "Update Qualification" : "Add Qualification"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Qualifications List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaUniversity className="w-5 h-5 mr-2 text-blue-600" />
            Your Qualifications ({qualifications.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {qualifications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FaGraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No qualifications yet</h3>
              <p className="text-gray-500 mb-4">Start building your professional profile by adding your qualifications.</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              >
                <FaPlus className="w-4 h-4 mr-2" />
                Add Your First Qualification
              </button>
            </div>
          ) : (
            qualifications.map((qualification) => (
              <div key={qualification.id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <FaGraduationCap className="w-5 h-5 text-blue-600 mr-3" />
                      <h4 className="text-lg font-semibold text-gray-900">
                        {qualification.qualification}
                      </h4>
                    </div>
                    <p className="text-gray-600 mb-3 flex items-center">
                      <FaUniversity className="w-4 h-4 mr-2 text-gray-400" />
                      {qualification.institution}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                        {new Date(qualification.startDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short' 
                        })} - {new Date(qualification.endDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short' 
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(qualification)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit qualification"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(qualification.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete qualification"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Qualifications;
