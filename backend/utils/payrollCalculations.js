// src/utils/payrollCalculations.js

const CONSTANTS = {
  NSSF: {
    TIER1_LOWER: 6000,
    TIER2_UPPER: 18000,
    CONTRIBUTION_PERCENTAGE: 6
  },
  SHIF: {
    // New SHIF rates based on Social Health Insurance Act
    RATE: 2.75, // 2.75% of gross salary
    MIN_CONTRIBUTION: 300, // Minimum monthly contribution
    MAX_CONTRIBUTION: 5000 // Maximum monthly contribution
  },
  HOUSING_LEVY: {
    RATE: 1.5
  },
  PAYE: {
    RATES: [
      { min: 0, max: 24000, rate: 10 },
      { min: 24001, max: 32333, rate: 25 },
      { min: 32334, max: 500000, rate: 30 },
      { min: 500001, max: 800000, rate: 32.5 },
      { min: 800001, max: Infinity, rate: 35 }
    ],
    PERSONAL_RELIEF: 2400
  }
}

// Calculate SHIF contribution
export const calculateSHIF = grossSalary => {
  const { RATE, MIN_CONTRIBUTION, MAX_CONTRIBUTION } = CONSTANTS.SHIF
  const contribution = (grossSalary * RATE) / 100

  // Ensure contribution is within bounds
  if (contribution < MIN_CONTRIBUTION) return MIN_CONTRIBUTION
  if (contribution > MAX_CONTRIBUTION) return MAX_CONTRIBUTION

  return contribution
}

// Update the main calculation function
export const calculatePayroll = grossSalary => {
  // Calculate NSSF
  const nssfDeduction = calculateNSSF(grossSalary)

  // Calculate SHIF (replacing NHIF)
  const shifDeduction = calculateSHIF(grossSalary)

  // Calculate Housing Levy
  const housingLevy = calculateHousingLevy(grossSalary)

  // Calculate taxable income (Gross - NSSF)
  const taxableIncome = grossSalary - nssfDeduction.amount

  // Calculate PAYE
  const payeDeduction = calculatePAYE(taxableIncome)

  // Calculate total deductions
  const totalDeductions =
    nssfDeduction.amount + shifDeduction + housingLevy + payeDeduction

  // Calculate net salary
  const netSalary = grossSalary - totalDeductions

  return {
    grossSalary,
    deductions: {
      nssf: {
        amount: nssfDeduction.amount,
        tier: nssfDeduction.tier
      },
      shif: shifDeduction, // Changed from NHIF to SHIF
      housingLevy,
      paye: payeDeduction
    },
    totalDeductions,
    netSalary
  }
}
