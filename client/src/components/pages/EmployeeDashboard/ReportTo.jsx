import  { useState } from "react";

const ReportTo = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [subordinates, setSubordinates] = useState([]);
  const [attachments, setAttachments] = useState([]);

  // Simulate adding a supervisor
  const addSupervisor = () => {
    const newSupervisor = {
      name: "John Doe",
      reportingMethod: "Direct",
    };
    setSupervisors([...supervisors, newSupervisor]);
  };

  // Simulate adding a subordinate
  const addSubordinate = () => {
    const newSubordinate = {
      name: "Jane Smith",
      reportingMethod: "Indirect",
    };
    setSubordinates([...subordinates, newSubordinate]);
  };

  // Simulate adding an attachment
  const addAttachment = () => {
    const newAttachment = {
      fileName: "example.pdf",
      description: "Example Attachment",
      size: "500KB",
      type: "PDF",
      dateAdded: "2025-02-10",
      addedBy: "Admin",
    };
    setAttachments([...attachments, newAttachment]);
  };

  return (
    <div className="p-6">
      {/* Report To Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Report To</h2>
        <div className="border border-gray-300 p-4 rounded">
          {/* Supervisors Section */}
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2">Assigned Supervisors</h3>
            {supervisors.length === 0 ? (
              <p>No Records Found</p>
            ) : (
              <table className="table-auto w-full text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="p-2">Name</th>
                    <th className="p-2">Reporting Method</th>
                  </tr>
                </thead>
                <tbody>
                  {supervisors.map((supervisor, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{supervisor.name}</td>
                      <td className="p-2">{supervisor.reportingMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button
              onClick={addSupervisor}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Supervisor
            </button>
          </div>

          {/* Subordinates Section */}
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2">Assigned Subordinates</h3>
            {subordinates.length === 0 ? (
              <p>No Records Found</p>
            ) : (
              <table className="table-auto w-full text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="p-2">Name</th>
                    <th className="p-2">Reporting Method</th>
                  </tr>
                </thead>
                <tbody>
                  {subordinates.map((subordinate, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{subordinate.name}</td>
                      <td className="p-2">{subordinate.reportingMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button
              onClick={addSubordinate}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Subordinate
            </button>
          </div>

          {/* Attachments Section */}
          <div>
            <h3 className="text-md font-semibold mb-2">Attachments</h3>
            {attachments.length === 0 ? (
              <p>No Records Found</p>
            ) : (
              <table className="table-auto w-full text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="p-2">File Name</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">Size</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Date Added</th>
                    <th className="p-2">Added By</th>
                  </tr>
                </thead>
                <tbody>
                  {attachments.map((attachment, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{attachment.fileName}</td>
                      <td className="p-2">{attachment.description}</td>
                      <td className="p-2">{attachment.size}</td>
                      <td className="p-2">{attachment.type}</td>
                      <td className="p-2">{attachment.dateAdded}</td>
                      <td className="p-2">{attachment.addedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button
              onClick={addAttachment}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Attachment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportTo;
