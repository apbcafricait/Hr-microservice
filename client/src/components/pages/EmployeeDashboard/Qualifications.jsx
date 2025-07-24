import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useGetAllQualificationsQuery,
  useCreateQualificationMutation,
  useUpdateQualificationMutation,
  useDeleteQualificationMutation,
} from "../../../slices/qualificationSlice";
import { FaGraduationCap } from "react-icons/fa";

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

  // Fetch qualifications with query args
  const { data, isLoading, isError } = useGetAllQualificationsQuery({});
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
    } catch (error) {
      console.error("Error submitting qualification:", error);
    }
  };

  const handleEdit = (qualification) => {
    setQualificationData(qualification);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this qualification?")) {
      try {
        await deleteQualification(id).unwrap();
        alert("Qualification deleted successfully");
      } catch (error) {
        console.error("Error deleting qualification:", error);
      }
    }
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

  if (isLoading) return <p>Loading qualifications...</p>;
  if (isError) return <p>Error loading qualifications</p>;

  return (
    <div>
      <h2>
        <FaGraduationCap style={{ marginRight: "8px" }} />
        {isEditing ? "Edit Qualification" : "Add Qualification"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="institution">Institution:</label>
          <input
            type="text"
            id="institution"
            name="institution"
            value={qualificationData.institution}
            onChange={handleInputChange}
            placeholder="Enter institution"
            required
          />
        </div>
        <div>
          <label htmlFor="qualification">Qualification:</label>
          <input
            type="text"
            id="qualification"
            name="qualification"
            value={qualificationData.qualification}
            onChange={handleInputChange}
            placeholder="Enter qualification"
            required
          />
        </div>
        <div>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={qualificationData.startDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={qualificationData.endDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit">{isEditing ? "Update" : "Add"} Qualification</button>
        {isEditing && (
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        )}
      </form>

      <h2>
        <FaGraduationCap style={{ marginRight: "8px" }} />
        Qualifications List
      </h2>
      <ul>
        {qualifications.map((qualification) => (
          <li key={qualification.id}>
            <FaGraduationCap style={{ marginRight: "4px" }} />
            <strong>{qualification.institution}</strong> - {qualification.qualification} (
              {new Date(qualification.startDate).toLocaleDateString()} to{" "}
              {new Date(qualification.endDate).toLocaleDateString()})
            <button onClick={() => handleEdit(qualification)}>Edit</button>
            <button onClick={() => handleDelete(qualification.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Qualifications;
