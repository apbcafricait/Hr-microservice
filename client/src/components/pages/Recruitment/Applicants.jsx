import React, { useState, useEffect } from 'react';

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    // Fetch applicants from the server (mock data for now)
    setApplicants([
      { id: 1, name: 'Alice Doe', position: 'Software Engineer', status: 'Applied' },
      { id: 2, name: 'Bob Smith', position: 'UI/UX Designer', status: 'Interviewed' },
    ]);
  }, []);

  return (
    <div>
      <h2>Applicants</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant) => (
            <tr key={applicant.id}>
              <td>{applicant.name}</td>
              <td>{applicant.position}</td>
              <td>{applicant.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Applicants;
