import  { useState, useEffect } from "react";

const Dependents = () => {
  // State to manage dependents and attachments
  const [dependents, setDependents] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock API data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulated API data (replace with actual API calls)
      const fetchedDependents = [
        { id: 1, name: "John Doe", relationship: "Son", dob: "2010-05-01" },
        { id: 2, name: "Jane Doe", relationship: "Daughter", dob: "2015-08-15" },
      ];
      const fetchedAttachments = [
        {
          id: 1,
          fileName: "Document.pdf",
          description: "Birth Certificate",
          size: "1.2MB",
          type: "PDF",
          dateAdded: "2025-02-19",
          addedBy: "Admin",
        },
      ];
      setDependents(fetchedDependents);
      setAttachments(fetchedAttachments);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Add a new dependent
  const addDependent = () => {
    const newDependent = {
      id: Date.now(), // Unique ID
      name: "New Dependent",
      relationship: "Relationship",
      dob: "YYYY-MM-DD",
    };
    setDependents([...dependents, newDependent]);
  };

  // Add a new attachment
  const addAttachment = () => {
    const newAttachment = {
      id: Date.now(),
      fileName: "NewFile.docx",
      description: "Description",
      size: "0.5MB",
      type: "DOCX",
      dateAdded: new Date().toLocaleDateString(),
      addedBy: "Admin",
    };
    setAttachments([...attachments, newAttachment]);
  };

  // Remove a dependent by ID
  const removeDependent = (id) => {
    setDependents(dependents.filter((dependent) => dependent.id !== id));
  };

  // Remove an attachment by ID
  const removeAttachment = (id) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id));
  };

  return (
    <div className="space-y-8 p-6">
      {/* Dependents Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Assigned Dependents</h2>
          <button
            onClick={addDependent}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            + Add
          </button>
        </div>
        <div className="border rounded-lg">
          {loading ? (
            <p className="p-4 text-gray-500">Loading...</p>
          ) : dependents.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Relationship</th>
                  <th className="px-4 py-2">Date of Birth</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dependents.map((dependent) => (
                  <tr key={dependent.id} className="border-b">
                    <td className="px-4 py-2">{dependent.name}</td>
                    <td className="px-4 py-2">{dependent.relationship}</td>
                    <td className="px-4 py-2">{dependent.dob}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => removeDependent(dependent.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-4 text-gray-500">No Records Found</p>
          )}
        </div>
      </div>

      {/* Attachments Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Attachments</h2>
          <button
            onClick={addAttachment}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            + Add
          </button>
        </div>
        <div className="border rounded-lg">
          {loading ? (
            <p className="p-4 text-gray-500">Loading...</p>
          ) : attachments.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-2">File Name</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Size</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Date Added</th>
                  <th className="px-4 py-2">Added By</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attachments.map((attachment) => (
                  <tr key={attachment.id} className="border-b">
                    <td className="px-4 py-2">{attachment.fileName}</td>
                    <td className="px-4 py-2">{attachment.description}</td>
                    <td className="px-4 py-2">{attachment.size}</td>
                    <td className="px-4 py-2">{attachment.type}</td>
                    <td className="px-4 py-2">{attachment.dateAdded}</td>
                    <td className="px-4 py-2">{attachment.addedBy}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => removeAttachment(attachment.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-4 text-gray-500">No Records Found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dependents;
