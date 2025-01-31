// src/validators/documentValidator.js

export const validateDocument = data => {
  const errors = []

  if (!data.employeeId) {
    errors.push('Employee ID is required')
  }

  if (!data.documentType) {
    errors.push('Document type is required')
  }

  // Validate document type
  const validDocumentTypes = ['CV', 'ID', 'Contract']
  if (!validDocumentTypes.includes(data.documentType)) {
    errors.push('Invalid document type. Must be CV, ID, or Contract')
  }

  if (!data.filePath) {
    errors.push('File path is required')
  }

  return errors.length > 0 ? errors : null
}
