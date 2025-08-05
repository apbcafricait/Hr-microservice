// // src/validators/departmentValidator.js

// export const validateDepartment = data => {
//   const errors = []

//   if (!data.organisationId) {
//     errors.push('Organisation ID is required')
//   }

//   if (!data.name) {
//     errors.push('Department name is required')
//   } else if (data.name.length < 2 || data.name.length > 100) {
//     errors.push('Department name must be between 2 and 100 characters')
//   }

//   if (data.description && data.description.length > 500) {
//     errors.push('Description cannot exceed 500 characters')
//   }

//   return errors.length > 0 ? errors : null
// }
