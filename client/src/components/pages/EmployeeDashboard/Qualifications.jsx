import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useGetAllQualificationsQuery,
  useCreateQualificationMutation,
  useUpdateQualificationMutation,
  useDeleteQualificationMutation,
} from "../../../slices/qualificationSlice";
import { FaGraduationCap, FaPlus, FaEdit, FaTrash, FaUniversity, FaBriefcase, FaLanguage, FaStar, FaCertificate, FaCheckCircle } from "react-icons/fa";

const Qualifications = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const employeeId = userInfo?.employeeId || userInfo?.id;

  const [qualificationData, setQualificationData] = useState({
    id: null,
    qualificationType: "",
    institutionName: "",
    fieldOfStudy: "",
    dateObtained: "",
    certificateNumber: "",
    isVerified: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Fetch qualifications
  const { data, isLoading, isError, refetch } = useGetAllQualificationsQuery({ employeeId });
  const qualifications = data?.data?.qualifications || data || [];

  // Mutations
  const [createQualification] = useCreateQualificationMutation();
  const [updateQualification] = useUpdateQualificationMutation();
  const [deleteQualification] = useDeleteQualificationMutation();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQualificationData({ 
      ...qualificationData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await updateQualification(qualificationData).unwrap();
        alert("Qualification updated successfully");
      } else {
        const payload = {
          ...qualificationData,
          employeeId: parseInt(employeeId)
        };
        await createQualification(payload).unwrap();
        alert("Qualification added successfully");
      }

      setQualificationData({
        id: null,
        qualificationType: "",
        institutionName: "",
        fieldOfStudy: "",
        dateObtained: "",
        certificateNumber: "",
        isVerified: false,
      });
      setIsEditing(false);
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error("Error submitting qualification:", error);
      alert(`Error saving qualification: ${error?.data?.error || error?.message || 'Please try again'}`);
    }
  };

  const handleEdit = (qualification) => {
    setQualificationData({
      id: qualification.id,
      qualificationType: qualification.qualificationType,
      institutionName: qualification.institutionName,
      fieldOfStudy: qualification.fieldOfStudy,
      dateObtained: qualification.dateObtained ? qualification.dateObtained.split('T')[0] : '',
      certificateNumber: qualification.certificateNumber || '',
      isVerified: qualification.isVerified || false,
    });
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
        alert(`Error deleting qualification: ${error?.data?.error || error?.message || 'Please try again'}`);
      }
    }
  };

  const handleCancel = () => {
    setQualificationData({
      id: null,
      qualificationType: "",
      institutionName: "",
      fieldOfStudy: "",
      dateObtained: "",
      certificateNumber: "",
      isVerified: false,
    });
    setIsEditing(false);
    setShowForm(false);
  };

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
                <label htmlFor="qualificationType" className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification Type *
                </label>
                <select
                  id="qualificationType"
                  name="qualificationType"
                  value={qualificationData.qualificationType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select qualification type</option>
                  <option value="High School Diploma">High School Diploma</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="PhD">PhD</option>
                  <option value="Professional Certificate">Professional Certificate</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Name *
                </label>
                <input
                  type="text"
                  id="institutionName"
                  name="institutionName"
                  value={qualificationData.institutionName}
                  onChange={handleInputChange}
                  placeholder="Enter institution name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-2">
                  Field of Study *
                </label>
                <input
                  type="text"
                  id="fieldOfStudy"
                  name="fieldOfStudy"
                  value={qualificationData.fieldOfStudy}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science, Business Administration"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="dateObtained" className="block text-sm font-medium text-gray-700 mb-2">
                  Date Obtained *
                </label>
                <input
                  type="date"
                  id="dateObtained"
                  name="dateObtained"
                  value={qualificationData.dateObtained}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="certificateNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate Number
                </label>
                <input
                  type="text"
                  id="certificateNumber"
                  name="certificateNumber"
                  value={qualificationData.certificateNumber}
                  onChange={handleInputChange}
                  placeholder="Enter certificate/registration number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isVerified"
                  name="isVerified"
                  checked={qualificationData.isVerified}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="isVerified" className="ml-2 text-sm font-medium text-gray-700">
                  This qualification is verified
                </label>
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
                    <div className="flex items-center mb-3">
                      <FaGraduationCap className="w-5 h-5 text-blue-600 mr-3" />
                      <h4 className="text-lg font-semibold text-gray-900">
                        {qualification.qualificationType}
                      </h4>
                      {qualification.isVerified && (
                        <FaCheckCircle className="w-5 h-5 text-green-500 ml-2" title="Verified" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-gray-600 flex items-center">
                        <FaUniversity className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Institution:</span>
                        <span className="ml-2">{qualification.institutionName}</span>
                      </p>
                      
                      <p className="text-gray-600 flex items-center">
                        <FaBriefcase className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Field of Study:</span>
                        <span className="ml-2">{qualification.fieldOfStudy}</span>
                      </p>
                      
                      <p className="text-gray-600 flex items-center">
                        <FaStar className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Date Obtained:</span>
                        <span className="ml-2">{new Date(qualification.dateObtained).toLocaleDateString()}</span>
                      </p>
                      
                      {qualification.certificateNumber && (
                        <p className="text-gray-600 flex items-center">
                          <FaCertificate className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-medium">Certificate Number:</span>
                          <span className="ml-2">{qualification.certificateNumber}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center mt-4 text-sm text-gray-500">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                        Added on {new Date(qualification.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      {qualification.updatedAt !== qualification.createdAt && (
                        <span className="ml-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                          Updated {new Date(qualification.updatedAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      )}
                      {qualification.isVerified && (
                        <span className="ml-2 bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium flex items-center">
                          <FaCheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      )}
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