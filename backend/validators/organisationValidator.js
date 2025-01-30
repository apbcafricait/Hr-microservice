// src/validators/organisationValidator.js

export const validateOrganisation = data => {
  const errors = []

  if (!data.name) errors.push('Organisation name is required')
  if (!data.subdomain) errors.push('Subdomain is required')

  // Subdomain validation
  if (data.subdomain) {
    const subdomainRegex = /^[a-z0-9-]+$/
    if (!subdomainRegex.test(data.subdomain)) {
      errors.push(
        'Subdomain can only contain lowercase letters, numbers, and hyphens'
      )
    }
    if (data.subdomain.length < 3 || data.subdomain.length > 50) {
      errors.push('Subdomain must be between 3 and 50 characters')
    }
  }

  // MPesa phone validation (if provided)
  if (data.mpesaPhone) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    if (!phoneRegex.test(data.mpesaPhone)) {
      errors.push('Invalid MPesa phone number format')
    }
  }

  // Subscription status validation
  const validStatuses = ['trial', 'active', 'suspended', 'cancelled']
  if (
    data.subscriptionStatus &&
    !validStatuses.includes(data.subscriptionStatus)
  ) {
    errors.push('Invalid subscription status')
  }

  return errors.length > 0 ? errors : null
}
