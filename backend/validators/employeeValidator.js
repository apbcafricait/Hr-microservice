// src/validators/employeeValidator.js

export const validateEmployee = data => {
  const errors = []

  if (!data.userId) errors.push('User ID is required')
  if (!data.organisationId) errors.push('Organisation ID is required')
  if (!data.firstName) errors.push('First name is required')
  if (!data.lastName) errors.push('Last name is required')
  if (!data.nationalId) errors.push('National ID is required')
  if (!data.dateOfBirth) errors.push('Date of birth is required')
  if (!data.position) errors.push('Position is required')
  if (!data.employmentDate) errors.push('Employment date is required')
  if (!data.salary || data.salary <= 0) errors.push('Valid salary is required')

  // Additional validations
  if (data.nationalId && data.nationalId.length < 5) {
    errors.push('National ID must be at least 5 characters long')
  }

  if (data.salary && data.salary < 0) {
    errors.push('Salary cannot be negative')
  }

  const now = new Date()
  const dob = new Date(data.dateOfBirth)
  const age = now.getFullYear() - dob.getFullYear()
  if (age < 18) {
    errors.push('Employee must be at least 18 years old')
  }

  return errors.length > 0 ? errors : null
}
