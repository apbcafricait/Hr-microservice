
const ApplicantDetails = () => {
  const applicant = {
    name: 'John Doe',
    degree: 'Bachelor of Science in Computer Science',
    specialization: 'Software Development',
    experience: [
      {
        role: 'Frontend Developer',
        company: 'Tech Solutions Ltd.',
        duration: '2 years',
      },
      {
        role: 'Software Engineer Intern',
        company: 'Innovatech Inc.',
        duration: '6 months',
      },
    ],
    careerVision: 'To leverage cutting-edge technologies to create innovative and sustainable solutions that enhance human life.',
    whyConsider: 'My strong academic background, hands-on experience in software development, and commitment to continuous learning make me an excellent fit for your dynamic team.',
    resumeLink: 'https://example.com/resume-john-doe',
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        {/* Applicant Name */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{applicant.name}</h1>

        {/* Education and Specialization */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Educational Background</h2>
          <p className="text-gray-600">{applicant.degree}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Area of Specialization</h2>
          <p className="text-gray-600">{applicant.specialization}</p>
        </div>

        {/* Work Experience */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Work Experience</h2>
          <ul className="space-y-4">
            {applicant.experience.map((job, index) => (
              <li key={index} className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium text-gray-800">{job.role}</p>
                <p className="text-gray-600">{job.company} - {job.duration}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Career Vision */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Career Vision</h2>
          <p className="text-gray-600">{applicant.careerVision}</p>
        </div>

        {/* Why Consider */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Why Consider This Applicant</h2>
          <p className="text-gray-600">{applicant.whyConsider}</p>
        </div>

        {/* Resume Link */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Resume</h2>
          <a
            href={applicant.resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View Resume
          </a>
        </div>

        {/* Footer */}
        <div className="text-right">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={() => alert('Feedback sent to the applicant!')}
          >
            Provide Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetails;
