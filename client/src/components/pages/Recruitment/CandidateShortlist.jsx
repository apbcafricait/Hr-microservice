import { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const CandidateShortlist = () => {
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: 'Jane Smith',
      qualifications: 'Masters in Business Administration',
      experience: '5 years in Project Management',
      score: 0,
    },
    {
      id: 2,
      name: 'John Doe',
      qualifications: 'Bachelor in Computer Science',
      experience: '3 years as a Software Developer',
      score: 0,
    },
    {
      id: 3,
      name: 'Alice Johnson',
      qualifications: 'Ph.D. in Data Analytics',
      experience: '7 years in Data Science',
      score: 0,
    },
  ]);

  const handleScoreChange = (id, score) => {
    setCandidates((prevCandidates) =>
      prevCandidates.map((candidate) =>
        candidate.id === id ? { ...candidate, score } : candidate
      )
    );
  };

  const editCandidate = (candidate) => {
    alert(`Editing candidate: ${candidate.name}`);
  };

  const printCandidate = (candidate) => {
    alert(`Printing details for: ${candidate.name}`);
  };

  // Dummy pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 5;
  const totalPages = Math.ceil(candidates.length / candidatesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedCandidates = candidates.slice(
    (currentPage - 1) * candidatesPerPage,
    currentPage * candidatesPerPage
  );

  const addCandidate = () => {
    const newCandidate = {
      id: candidates.length + 1,
      name: 'New Candidate',
      qualifications: 'Unknown',
      experience: '0 years',
      score: 0,
    };
    setCandidates((prevCandidates) => [...prevCandidates, newCandidate]);
  };

  const removeCandidate = (id) => {
    setCandidates((prevCandidates) => prevCandidates.filter(candidate => candidate.id !== id));
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text('Candidate Shortlist', 20, 10);
    doc.autoTable({
      startY: 20,
      head: [['Name', 'Qualifications', 'Experience', 'Score']],
      body: candidates.map(candidate => [
        candidate.name,
        candidate.qualifications,
        candidate.experience,
        candidate.score,
      ]),
    });

    doc.save('candidate-shortlist.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-5xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Candidate Shortlist</h1>
        <p className="mb-4 text-gray-600">Congratulations to all the candidates who have successfully made it to the shortlist! We are excited about your qualifications and experience. As part of our hiring process, we will be conducting interviews, and we want to ensure you are prepared for what is next. Below, you will find details of your scheduled interview date and additional information about the next steps.</p>

        <div className="mb-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={addCandidate}
          >
            Add Candidate
          </button>
        </div>

        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2 font-medium text-gray-600">Name</th>
              <th className="border-b p-2 font-medium text-gray-600">Qualifications</th>
              <th className="border-b p-2 font-medium text-gray-600">Experience</th>
              <th className="border-b p-2 font-medium text-gray-600">Score</th>
              <th className="border-b p-2 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedCandidates.map((candidate) => (
              <tr key={candidate.id} className="border-b">
                <td className="p-2 text-gray-800">{candidate.name}</td>
                <td className="p-2 text-gray-800">{candidate.qualifications}</td>
                <td className="p-2 text-gray-800">{candidate.experience}</td>
                <td className="p-2 text-gray-800">
                  <input
                    type="number"
                    className="border rounded p-1 w-16 text-center"
                    value={candidate.score}
                    min="0"
                    max="10"
                    onChange={(e) => handleScoreChange(candidate.id, parseInt(e.target.value, 10))}
                  />
                </td>
                <td className="p-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                    onClick={() => editCandidate(candidate)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => removeCandidate(candidate.id)}
                  >
                    Remove
                  </button>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => printCandidate(candidate)}
                  >
                    Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination controls */}
        <div className="mt-4 flex justify-between items-center">
          <button
            className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-gray-800">Page {currentPage} of {totalPages}</span>
          <button
            className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        <div className="mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={downloadPDF}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateShortlist;
