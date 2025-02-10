import  { useState } from 'react';

const Qualifications = () => {
  const [workExperiences, setWorkExperiences] = useState([
    { company: 'TCS', title: 'TESTER', from: '2020-09-02', to: '2023-07-16', comment: 'HII HELLO' }
  ]);

  const [educations, setEducations] = useState([
    { level: "Bachelor's Degree", year: '', gpa: '' }
  ]);

  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);

  const addWorkExperience = () => {
    setWorkExperiences([...workExperiences, { company: '', title: '', from: '', to: '', comment: '' }]);
  };

  const addEducation = () => {
    setEducations([...educations, { level: '', year: '', gpa: '' }]);
  };

  const addSkill = () => {
    setSkills([...skills, '']);
  };

  const addLanguage = () => {
    setLanguages([...languages, '']);
  };

  const handleWorkExperienceChange = (index, field, value) => {
    const updatedExperiences = [...workExperiences];
    updatedExperiences[index][field] = value;
    setWorkExperiences(updatedExperiences);
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducations = [...educations];
    updatedEducations[index][field] = value;
    setEducations(updatedEducations);
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
  };

  const handleLanguageChange = (index, value) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index] = value;
    setLanguages(updatedLanguages);
  };

  const deleteWorkExperience = (index) => {
    const updatedExperiences = workExperiences.filter((_, i) => i !== index);
    setWorkExperiences(updatedExperiences);
  };

  const deleteEducation = (index) => {
    const updatedEducations = educations.filter((_, i) => i !== index);
    setEducations(updatedEducations);
  };

  const deleteSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };

  const deleteLanguage = (index) => {
    const updatedLanguages = languages.filter((_, i) => i !== index);
    setLanguages(updatedLanguages);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Qualifications</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Work Experience</h3>
        <button onClick={addWorkExperience} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">+ Add</button>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Company</th>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">From</th>
                <th className="py-2 px-4 border-b">To</th>
                <th className="py-2 px-4 border-b">Comment</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workExperiences.map((experience, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      value={experience.company}
                      onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      value={experience.title}
                      onChange={(e) => handleWorkExperienceChange(index, 'title', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="date"
                      value={experience.from}
                      onChange={(e) => handleWorkExperienceChange(index, 'from', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="date"
                      value={experience.to}
                      onChange={(e) => handleWorkExperienceChange(index, 'to', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      value={experience.comment}
                      onChange={(e) => handleWorkExperienceChange(index, 'comment', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => deleteWorkExperience(index)} className="text-red-500">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Education</h3>
        <button onClick={addEducation} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">+ Add</button>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Level</th>
                <th className="py-2 px-4 border-b">Year</th>
                <th className="py-2 px-4 border-b">GPA/Serve</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {educations.map((education, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      value={education.level}
                      onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      value={education.year}
                      onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      value={education.gpa}
                      onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => deleteEducation(index)} className="text-red-500">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Skills</h3>
        <button onClick={addSkill} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">+ Add</button>
        {skills.length === 0 ? (
          <p>No Records Found</p>
        ) : (
          skills.map((skill, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button onClick={() => deleteSkill(index)} className="text-red-500 ml-2">Delete</button>
            </div>
          ))
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Languages</h3>
        <button onClick={addLanguage} className="bg-blue-500 text-white px-4 py-2 rounded">+ Add</button>
        {languages.length === 0 ? (
          <p>No Records Found</p>
        ) : (
          languages.map((language, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={language}
                onChange={(e) => handleLanguageChange(index, e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button onClick={() => deleteLanguage(index)} className="text-red-500 ml-2">Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Qualifications;