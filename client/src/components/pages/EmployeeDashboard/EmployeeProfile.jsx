import React from 'react'
import PersonalDetails from './PersonalDetails'
import ContactDetails from './ContactDetails'
import CustomFields from './CustomFields'

export const EmployeeProfile = () => {
  return (
    <div>
      <PersonalDetails />
      <ContactDetails />
      <CustomFields />
    </div>
  )
  
}
