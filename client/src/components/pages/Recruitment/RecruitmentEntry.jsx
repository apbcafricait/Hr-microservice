import React from 'react'
import ApplicantDetails from './ApplicantDetails'
import Applicants from './Applicants'
import RecruitmentDashboard from './RecruitmentDashboard'
import RecruitmentReports from './RecruitmentReports'
import InterviewResults from './InterviewResults'
import JobPostings from './JobPostings'
import JobApplicationForm from './JobApplicationForm'
import InterviewSchedule from './InterviewSchedule'
import CandidateShortlist from './CandidateShortlist'

const RecruitmentEntry = () => {
  return (
   <>
   <JobPostings />
   <Applicants />
   <InterviewSchedule />
   <InterviewResults />
   <ApplicantDetails />
   <RecruitmentDashboard />
   <JobApplicationForm />
   <CandidateShortlist />
   <RecruitmentReports />
   </>
  )
}

export default RecruitmentEntry