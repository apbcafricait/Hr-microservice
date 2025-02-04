import React from 'react'
import LeaveDashboard from './LeaveDashboard'
import ApplyLeave from './ApplyLeave'
import LeaveRequests from './LeaveRequests'
import LeaveHistory from './LeaveHistory'
import LeaveApproval from './LeaveApproval'
import LeaveBalance from './LeaveBalance'
import LeaveTypeManagement from './LeaveTypeManagement'
import LeaveSettings from './LeaveSettings'


const index = () => {
// LeaveManagementEntry.jsx is the entry point for the leave management section.
// This file will import all the other components and may serve as the entry point to export and set up routing for the leave management section if needed.
  return (
    <>
      <LeaveDashboard />
      <ApplyLeave />
      <LeaveRequests />
      <LeaveHistory />
      <LeaveApproval />
      <LeaveBalance />
      <LeaveTypeManagement />
      <LeaveSettings />
    </>
  )
}

export default index