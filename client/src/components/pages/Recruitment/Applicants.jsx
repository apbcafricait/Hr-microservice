import  { useState } from 'react';

const Application = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    resume: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Application submitted: ${JSON.stringify(formData, null, 2)}`);
    setFormData({ name: '', email: '', position: '', resume: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        {/* Header Section */}
        <div className="text-center mb-6">
          <img
            src="https://via.placeholder.com/80"
            alt="APBC Africa Logo"
            className="mx-auto mb-4 rounded-full"
          />
          <h1 className="text-2xl font-bold text-gray-800">APBC Africa</h1>
          <p className="text-gray-500 italic">
            Empowering Solutions, Enabling Futures
          </p>
        </div>

        {/* Introduction Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            About APBC Africa
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Welcome to APBC Africa! We are a leading company specializing in:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>
              <strong>CCTV Installations:</strong> Advanced security solutions
              tailored to meet your needs.
            </li>
            <li>
              <strong>IT Services:</strong> Comprehensive IT services,
              including infrastructure development, maintenance, and support.
            </li>
            <li>
              <strong>Audit and Accountancy:</strong> Professional financial
              services to help businesses maintain compliance and achieve their
              goals.
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            Join our dynamic team and contribute to shaping the future of these
            industries. Fill out the application form below to get started!
          </p>
        </div>

        {/* Form Section */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Job Application Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-600 font-medium mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-600 font-medium mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="position"
              className="block text-gray-600 font-medium mb-1"
            >
              Position Applying For
            </label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Select a position
              </option>
              <option value="Software Developer">Software Developer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Data Analyst">Data Analyst</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="resume"
              className="block text-gray-600 font-medium mb-1"
            >
              Resume Link
            </label>
            <input
              type="url"
              id="resume"
              name="resume"
              value={formData.resume}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Paste your resume link"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-lg py-2 font-medium hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Application;
