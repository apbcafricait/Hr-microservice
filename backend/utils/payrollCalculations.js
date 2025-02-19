// src/utils/payrollCalculations.js

const CONSTANTS = {
  NSSF: {
    TIER1_LIMIT: 8000, // Lower Earnings Limit
    TIER2_LIMIT: 72000, // Upper Earnings Limit
    CONTRIBUTION_RATE: 0.06, // 6%
    MAX_CONTRIBUTION: 4320 // Maximum contribution as of Feb 2025
  },
  SHIF: {
    RATE: 0.0275, // 2.75% of gross salary
    MIN_CONTRIBUTION: 300, // Minimum monthly contribution
    MAX_CONTRIBUTION: 5000 // Maximum monthly contribution
  },
  HOUSING_LEVY: {
    RATE: 0.015 // 1.5% of gross salary
  },
  PAYE: {
    RATES: [
      { min: 0, max: 24000, rate: 0.1 },
      { min: 24001, max: 32333, rate: 0.25 },
      { min: 32334, max: 500000, rate: 0.3 },
      { min: 500001, max: 800000, rate: 0.325 },
      { min: 800001, max: Infinity, rate: 0.35 }
    ],
    PERSONAL_RELIEF: 2400
  }
}

/**
 * Calculate NSSF contribution based on gross salary.
 * @param {number} grossSalary - The gross monthly salary.
 * @returns {Object} - NSSF deduction details including amount and tier.
 */
const calculateNSSF = grossSalary => {
  const { TIER1_LIMIT, TIER2_LIMIT, CONTRIBUTION_RATE, MAX_CONTRIBUTION } =
    CONSTANTS.NSSF
  let nssfContribution = 0
  let tier = ''

  if (grossSalary <= TIER1_LIMIT) {
    nssfContribution = grossSalary * CONTRIBUTION_RATE
    tier = 'Tier 1'
  } else if (grossSalary <= TIER2_LIMIT) {
    nssfContribution =
      TIER1_LIMIT * CONTRIBUTION_RATE +
      (grossSalary - TIER1_LIMIT) * CONTRIBUTION_RATE
    tier = 'Tier 1 and 2'
  } else {
    nssfContribution = MAX_CONTRIBUTION
    tier = 'Tier 1 and 2'
  }

  return {
    amount: nssfContribution,
    tier
  }
}

/**
 * Calculate SHIF contribution based on gross salary.
 * @param {number} grossSalary - The gross monthly salary.
 * @returns {number} - SHIF deduction amount.
 */
const calculateSHIF = grossSalary => {
  const { RATE, MIN_CONTRIBUTION, MAX_CONTRIBUTION } = CONSTANTS.SHIF
  const contribution = grossSalary * RATE

  if (contribution < MIN_CONTRIBUTION) return MIN_CONTRIBUTION
  if (contribution > MAX_CONTRIBUTION) return MAX_CONTRIBUTION

  return contribution
}

/**
 * Calculate Housing Levy based on gross salary.
 * @param {number} grossSalary - The gross monthly salary.
 * @returns {number} - Housing Levy deduction amount.
 */
const calculateHousingLevy = grossSalary => {
  return grossSalary * CONSTANTS.HOUSING_LEVY.RATE
}

/**
 * Calculate PAYE based on taxable income.
 * @param {number} taxableIncome - The taxable income after deductions.
 * @returns {number} - PAYE deduction amount.
 */
const calculatePAYE = taxableIncome => {
  const { RATES, PERSONAL_RELIEF } = CONSTANTS.PAYE
  let paye = 0

  for (const band of RATES) {
    if (taxableIncome > band.min) {
      const taxableAmount = Math.min(taxableIncome, band.max) - band.min
      paye += taxableAmount * band.rate
    } else {
      break
    }
  }

  paye = Math.max(paye - PERSONAL_RELIEF, 0)

  return paye
}

/**
 * Calculate the complete payroll details including all deductions and net salary.
 * @param {number} grossSalary - The gross monthly salary.
 * @returns {Object} - Payroll details including gross salary, deductions, total deductions, and net salary.
 */
export const calculatePayroll = grossSalary => {
  const nssfDeduction = calculateNSSF(grossSalary)
  const shifDeduction = calculateSHIF(grossSalary)
  const housingLevy = calculateHousingLevy(grossSalary)
  const taxableIncome = grossSalary - nssfDeduction.amount
  const payeDeduction = calculatePAYE(taxableIncome)
  const totalDeductions =
    nssfDeduction.amount + shifDeduction + housingLevy + payeDeduction
  const netSalary = grossSalary - totalDeductions

  return {
    grossSalary,
    deductions: {
      nssf: nssfDeduction,
      shif: shifDeduction,
      housingLevy,
      paye: payeDeduction
    },
    totalDeductions,
    netSalary
  }
}

