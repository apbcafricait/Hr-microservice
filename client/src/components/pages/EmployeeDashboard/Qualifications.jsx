// Qualifications.js

import { useSelector, useDispatch } from 'react-redux';
import {
  addWorkExperience,
  addEducation,
  addSkill,
  addLanguage,
  updateWorkExperience,
  updateEducation,
  updateSkill,
  updateLanguage,
  deleteWorkExperience,
  deleteEducation,
  deleteSkill,
  deleteLanguage
} from '../../../slices/qualificationSlice'

const Qualifications = () => {
  const dispatch = useDispatch();
  const workExperiences = useSelector(state => state.qualifications.workExperiences);
  const educations = useSelector(state => state.qualifications.educations);
  const skills = useSelector(state => state.qualifications.skills);
  const languages = useSelector(state => state.qualifications.languages);

  const handleWorkExperienceChange = (index, field, value) => {
    dispatch(updateWorkExperience({ index, field, value }));
  };

  const handleEducationChange = (index, field, value) => {
    dispatch(updateEducation({ index, field, value }));
  };

  const handleSkillChange = (index, value) => {
    dispatch(updateSkill({ index, value }));
  };

  const handleLanguageChange = (index, value) => {
    dispatch(updateLanguage({ index, value }));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Qualifications</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Work Experience</h3>
        <button onClick={() => dispatch(addWorkExperience())} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">+ Add</button>
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
                    <button onClick={() => dispatch(deleteWorkExperience(index))} className="text-red-500">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Education</h3>
        <button onClick={() => dispatch(addEducation())} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">+ Add</button>
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
                    <button onClick={() => dispatch(deleteEducation(index))} className="text-red-500">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Skills</h3>
        <button onClick={() => dispatch(addSkill())} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">+ Add</button>
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
              <button onClick={() => dispatch(deleteSkill(index))} className="text-red-500 ml-2">Delete</button>
            </div>
          ))
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Languages</h3>
        <button onClick={() => dispatch(addLanguage())} className="bg-blue-500 text-white px-4 py-2 rounded">+ Add</button>
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
              <button onClick={() => dispatch(deleteLanguage(index))} className="text-red-500 ml-2">Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Qualifications;