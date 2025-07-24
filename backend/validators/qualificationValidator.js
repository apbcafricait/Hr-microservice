export function validateQualification(data) {
  const errors = [];

  // Employee Name
  if (!data.employeeName || typeof data.employeeName !== "string") {
    errors.push("Employee name is required and must be a string");
  }

  // Institution Name
  if (!data.institutionName || typeof data.institutionName !== "string") {
    errors.push("Institution name is required and must be a string");
  }

  // Area of Study
  if (!data.areaOfStudy || typeof data.areaOfStudy !== "string") {
    errors.push("Area of study is required and must be a string");
  }

  // Certification
  if (!data.certification || typeof data.certification !== "string") {
    errors.push("Certification is required and must be a string");
  }

  return errors.length > 0 ? errors : null;
}