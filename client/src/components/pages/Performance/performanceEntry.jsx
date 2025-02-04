import React from 'react'
import EmployeeProgress from './EmployeeProgress'
import PerformanceDashboard from './PerformanceDashboard'
import PerformanceReviews from './PerformanceReviews'
import ReviewHistory from './ReviewHistory'
import SelfAssessment from './SelfAssessment'
import GoalSetting from './GoalSetting'
import PerformanceMetrics from './PerformanceMetrics'
import Feedback from './Feedback'
import ManagerAssessment from './ManagerAssessment'

const PerformanceEntry = () => {
  return (
    <>
    <PerformanceReviews />
    <GoalSetting />
    <PerformanceMetrics />
    <Feedback />
    <EmployeeProgress />
    <PerformanceDashboard />
    <ReviewHistory />
    <SelfAssessment />
    <ManagerAssessment />
</>
  )
}

export default PerformanceEntry