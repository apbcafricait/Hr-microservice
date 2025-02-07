import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';  // Import moment.js

import 'react-big-calendar/lib/css/react-big-calendar.css';

// Use momentLocalizer with the moment library
const localizer = momentLocalizer(moment);

const InterviewSchedule = () => {
  const [events, setEvents] = useState([]);
  const [candidateName, setCandidateName] = useState('');
  const [interviewerName, setInterviewerName] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [candidatePosition, setCandidatePosition] = useState('');
  const [showForm, setShowForm] = useState(false);

  const positions = [
    { name: 'Software Engineer', interviewTime: '09:00' },
    { name: 'Data Analyst', interviewTime: '10:00' },
    { name: 'Product Manager', interviewTime: '11:00' },
  ];

  // Handler to add interview to the calendar
  const handleAddInterview = () => {
    const interviewTime = positions.find(position => position.name === candidatePosition)?.interviewTime;

    // If no interview time is assigned for the selected position
    if (!interviewTime) {
      alert('Please select a valid position with an assigned interview time.');
      return;
    }

    const newEvent = {
      title: `${candidateName} - ${candidatePosition} Interview`,
      start: moment(`${interviewDate} ${interviewTime}`).toDate(),
      end: moment(`${interviewDate} ${interviewTime}`).add(30, 'minutes').toDate(), // 30 minutes interview duration
    };

    setEvents([...events, newEvent]);
    setShowForm(false); // Hide form after submission
  };

  // Handler to show the form
  const handleShowForm = () => {
    setShowForm(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-center text-2xl font-semibold text-green-600 mb-4">Congratulations on Making the Shortlist!</h2>
      <p className="text-center text-gray-600 mb-6">
        Following your shortlisting, we are thrilled to invite you to an interview scheduled for the dates below.
        Please note that different positions have specific interview times, so ensure you select the correct slot!
      </p>

      {/* Button to show interview form */}
      <button
        onClick={handleShowForm}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-6 block mx-auto"
      >
        Schedule an Interview
      </button>

      {showForm && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Schedule Your Interview</h3>
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Candidate Name</label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter candidate's name"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Interviewer Name</label>
            <input
              type="text"
              value={interviewerName}
              onChange={(e) => setInterviewerName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter interviewer's name"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Candidate Position</label>
            <select
              value={candidatePosition}
              onChange={(e) => setCandidatePosition(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Position</option>
              {positions.map((position, index) => (
                <option key={index} value={position.name}>{position.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Interview Date</label>
            <input
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            onClick={handleAddInterview}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Add Interview
          </button>
        </div>
      )}

      {/* Calendar to show scheduled interviews */}
      <div className="mt-8">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>

      {/* List of scheduled interviews */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-700">Scheduled Interviews:</h3>
        <ul className="space-y-4 mt-4">
          {events.map((event, index) => (
            <li key={index} className="bg-gray-100 p-4 rounded-lg shadow">
              <strong>{event.title}</strong><br />
              Date: {moment(event.start).format('YYYY-MM-DD')}<br />
              Time: {moment(event.start).format('hh:mm A')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InterviewSchedule;
