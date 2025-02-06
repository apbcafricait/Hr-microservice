import { useState } from 'react';

const JobPostings = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [jobCategory, setJobCategory] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobStatus, setJobStatus] = useState('Active');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!jobTitle || !jobDescription || !requirements || !jobCategory || !salaryRange || !jobLocation || !jobType) {
      alert('Please fill out all required fields.');
      return;
    }

    // Logic to create a job posting
    console.log({
      jobTitle,
      jobDescription,
      requirements,
      jobCategory,
      salaryRange,
      jobLocation,
      jobType,
      companyName,
      jobStatus,
    });

    // Simulate success message
    setSuccessMessage('Job posting created successfully!');
    
    // Clear the form after submission
    setJobTitle('');
    setJobDescription('');
    setRequirements('');
    setJobCategory('');
    setSalaryRange('');
    setJobLocation('');
    setJobType('');
    setCompanyName('');
    setJobStatus('Active');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-green-600 mb-4">Create Job Posting</h2>
      
      {/* Success message */}
      {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium text-gray-700">Job Title:</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter job title"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Job Description:</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter job description"
            rows="5"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Requirements:</label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter job requirements"
            rows="5"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Job Category:</label>
          <select
            value={jobCategory}
            onChange={(e) => setJobCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="">Select Category</option>
            <option value="Technology">Technology</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Finance">Finance</option>
            {/* More categories */}
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Salary Range:</label>
          <input
            type="text"
            value={salaryRange}
            onChange={(e) => setSalaryRange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter salary range"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Job Location:</label>
          <input
            type="text"
            value={jobLocation}
            onChange={(e) => setJobLocation(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter job location"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Job Type:</label>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="">Select Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Company Name (Optional):</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter company name"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Job Status:</label>
          <select
            value={jobStatus}
            onChange={(e) => setJobStatus(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600"
        >
          Create Job Posting
        </button>
      </form>
    </div>
  );
};

export default JobPostings;
