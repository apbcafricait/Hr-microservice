import React, { useState } from 'react';

const JobPostings = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [requirements, setRequirements] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to create a job posting
    console.log({ jobTitle, jobDescription, requirements });
  };

  return (
    <div>
      <h2>Create Job Posting</h2>
      <form onSubmit={handleSubmit}>
        <label>Job Title:</label>
        <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
        <br />
        <label>Job Description:</label>
        <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
        <br />
        <label>Requirements:</label>
        <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} />
        <br />
        <button type="submit">Create Job</button>
      </form>
    </div>
  );
};

export default JobPostings;
