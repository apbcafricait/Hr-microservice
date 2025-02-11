// qualificationsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  workExperiences: [
    { company: 'TCS', title: 'TESTER', from: '2020-09-02', to: '2023-07-16', comment: 'HII HELLO' }
  ],
  educations: [
    { level: "Bachelor's Degree", year: '', gpa: '' }
  ],
  skills: [],
  languages: []
};

const qualificationsSlice = createSlice({
  name: 'qualifications',
  initialState,
  reducers: {
    addWorkExperience: (state) => {
      state.workExperiences.push({ company: '', title: '', from: '', to: '', comment: '' });
    },
    addEducation: (state) => {
      state.educations.push({ level: '', year: '', gpa: '' });
    },
    addSkill: (state) => {
      state.skills.push('');
    },
    addLanguage: (state) => {
      state.languages.push('');
    },
    updateWorkExperience: (state, action) => {
      const { index, field, value } = action.payload;
      state.workExperiences[index][field] = value;
    },
    updateEducation: (state, action) => {
      const { index, field, value } = action.payload;
      state.educations[index][field] = value;
    },
    updateSkill: (state, action) => {
      const { index, value } = action.payload;
      state.skills[index] = value;
    },
    updateLanguage: (state, action) => {
      const { index, value } = action.payload;
      state.languages[index] = value;
    },
    deleteWorkExperience: (state, action) => {
      state.workExperiences = state.workExperiences.filter((_, i) => i !== action.payload);
    },
    deleteEducation: (state, action) => {
      state.educations = state.educations.filter((_, i) => i !== action.payload);
    },
    deleteSkill: (state, action) => {
      state.skills = state.skills.filter((_, i) => i !== action.payload);
    },
    deleteLanguage: (state, action) => {
      state.languages = state.languages.filter((_, i) => i !== action.payload);
    }
  }
});

export const {
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
} = qualificationsSlice.actions;

export default qualificationsSlice.reducer;