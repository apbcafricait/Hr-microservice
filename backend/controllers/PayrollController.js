// src/controllers/PayrollController.js

import { PrismaClient } from '@prisma/client'
import { calculatePayroll } from '../utils/payrollCalculations.js'
import { generatePayslip } from '../utils/payslipGenerator.js'
import fs from 'fs/promises'

const prisma = new PrismaClient()

export class PayrollController {
  // Process payroll for an employee
  async processEmployeePayroll (req, res) {
    try {
      const { employeeId } = req.params

      const { monthYear } = req.body
      
      // Validate month_year format (YYYY-MM)
      const payrollDate = new Date(monthYear)
      if (isNaN(payrollDate.getTime())) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid month_year format. Use YYYY-MM'
        })
      }

      // Check if payroll already exists for this month
      const existingPayroll = await prisma.payroll.findFirst({
        where: {
          employeeId: parseInt(employeeId),
          monthYear: payrollDate
        }
      })

      if (existingPayroll) {
        return res.status(400).json({
          status: 'error',
          message: 'Payroll already processed for this month'
        })
      }

      // Get employee details
      const employee = await prisma.employee.findUnique({
        where: { id: parseInt(employeeId) },
        include: {
          user: {
            select: {
              email: true
            }
          }
        }
      })

      if (!employee) {
        return res.status(404).json({
          status: 'error',
          message: 'Employee not found'
        })
      }

      // Calculate payroll
      const payrollCalculation = calculatePayroll(parseFloat(employee.salary))
      console.log(payrollCalculation)
    //   // Generate payslip
      const payslipPath = await generatePayslip(
        employee,
        payrollCalculation,
        monthYear
      )

      // Create payroll record
      const payroll = await prisma.payroll.create({
        data: {
          employeeId: parseInt(employeeId),
          monthYear: payrollDate,
          grossSalary: employee.salary,
          deductions: payrollCalculation.deductions,
          netSalary: payrollCalculation.netSalary,
          payslipPath
        },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
              user: {
                select: {
                  email: true
                }
              }
            }
          }
        }
      })

      return res.status(201).json({
        status: 'success',
        data: { payroll }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to process payroll',
        error: error.message
      })
    }
  }

  // Process payroll for all employees
  async processBulkPayroll (req, res) {
    try {
      const { monthYear, organisationId } = req.body

      const payrollDate = new Date(monthYear)
      console.log(payrollDate)
      if (isNaN(payrollDate.getTime())) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid month_year format. Use YYYY-MM'
        })
      }

      // Get all employees for the organisation
      const employees = await prisma.employee.findMany({
        where: {
          organisationId
        },
        include: {
          user: {
            select: {
              email: true
            }
          }
        }
      })

      const results = []
      const errors = []

      // Process payroll for each employee
      for (const employee of employees) {
        try {
          // Skip if payroll already exists
          const existingPayroll = await prisma.payroll.findFirst({
            where: {
              employeeId: employee.id,
              monthYear: payrollDate
            }
          })

          if (existingPayroll) {
            errors.push({
              employeeId: employee.id,
              message: 'Payroll already processed'
            })
            continue
          }

          const payrollCalculation = calculatePayroll(
            parseFloat(employee.salary)
          )
          const payslipPath = await generatePayslip(
            employee,
            payrollCalculation,
            monthYear
          )

          const payroll = await prisma.payroll.create({
            data: {
              employeeId: employee.id,
              monthYear: payrollDate,
              grossSalary: employee.salary,
              deductions: payrollCalculation.deductions,
              netSalary: payrollCalculation.netSalary,
              payslipPath
            }
          })

          results.push(payroll)
        } catch (error) {
          errors.push({
            employeeId: employee.id,
            message: error.message
          })
        }
      }

      return res.status(200).json({
        status: 'success',
        data: {
          processed: results.length,
          failed: errors.length,
          results,
          errors
        }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to process bulk payroll',
        error: error.message
      })
    }
  }

  // Get payroll history for an employee
  async getEmployeePayrollHistory (req, res) {
    try {
      const { employeeId } = req.params
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10

      const [payrolls, total] = await Promise.all([
        prisma.payroll.findMany({
          where: {
            employeeId: parseInt(employeeId)
          },
          orderBy: {
            monthYear: 'desc'
          },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.payroll.count({
          where: {
            employeeId: parseInt(employeeId)
          }
        })
      ])

      return res.status(200).json({
        status: 'success',
        data: {
          payrolls,
          pagination: {
            total,
            pages: Math.ceil(total / limit),
            page,
            limit
          }
        }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch payroll history',
        error: error.message
      })
    }
  }
// Add these methods to your PayrollController class

// Get payroll summaries for an organisation
async getPayrollSummaries(req, res) {
    try {
        const { organisationId } = req.params;
        const { monthYear } = req.query;

        // Parse date if provided
        const payrollDate = monthYear ? new Date(monthYear) : null;

        // Base where clause
        const whereClause = {
            employee: {
                organisationId: parseInt(organisationId)
            }
        };

        // Add month filter if provided
        if (payrollDate && !isNaN(payrollDate.getTime())) {
            whereClause.monthYear = payrollDate;
        }

        // Get all payrolls for the organisation
        const payrolls = await prisma.payroll.findMany({
            where: whereClause,
            include: {
                employee: {
                    select: {
                        firstName: true,
                        lastName: true,
                        department: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        // Calculate summaries
        const summaries = {
            totalEmployees: await prisma.employee.count({
                where: { organisationId: parseInt(organisationId) }
            }),
            processedPayrolls: payrolls.length,
            totalGrossSalary: payrolls.reduce((sum, p) => sum + Number(p.grossSalary), 0),
            totalNetSalary: payrolls.reduce((sum, p) => sum + Number(p.netSalary), 0),
            totalDeductions: {
                paye: payrolls.reduce((sum, p) => sum + Number(p.deductions.paye), 0),
                nhif: payrolls.reduce((sum, p) => sum + Number(p.deductions.nhif), 0),
                nssf: payrolls.reduce((sum, p) => sum + Number(p.deductions.nssf.amount), 0),
                housingLevy: payrolls.reduce((sum, p) => sum + Number(p.deductions.housingLevy), 0)
            },
            departmentSummaries: {},
            averageSalary: 0,
            unprocessedEmployees: 0
        };

        // Calculate department summaries
        payrolls.forEach(payroll => {
            const deptName = payroll.employee.department?.name || 'Unassigned';
            if (!summaries.departmentSummaries[deptName]) {
                summaries.departmentSummaries[deptName] = {
                    count: 0,
                    totalGross: 0,
                    totalNet: 0
                };
            }
            summaries.departmentSummaries[deptName].count++;
            summaries.departmentSummaries[deptName].totalGross += Number(payroll.grossSalary);
            summaries.departmentSummaries[deptName].totalNet += Number(payroll.netSalary);
        });

        // Calculate averages
        summaries.averageSalary = summaries.totalGrossSalary / (payrolls.length || 1);
        summaries.unprocessedEmployees = summaries.totalEmployees - summaries.processedPayrolls;

        return res.status(200).json({
            status: 'success',
            data: summaries
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Failed to fetch payroll summaries',
            error: error.message
        });
    }
}


// Get detailed department payroll summary
async getDepartmentPayrollSummary(req, res) {
    try {
        const { organisationId, departmentId } = req.params;
        const { monthYear } = req.query;

        const payrollDate = monthYear ? new Date(monthYear) : null;

        const whereClause = {
            employee: {
                organisationId: parseInt(organisationId),
                departmentId: parseInt(departmentId)
            }
        };

        if (payrollDate && !isNaN(payrollDate.getTime())) {
            whereClause.monthYear = payrollDate;
        }

        const payrolls = await prisma.payroll.findMany({
            where: whereClause,
            include: {
                employee: {
                    select: {
                        firstName: true,
                        lastName: true,
                        position: true
                    }
                }
            }
        });

        const summary = {
            totalEmployees: await prisma.employee.count({
                where: {
                    organisationId: parseInt(organisationId),
                    departmentId: parseInt(departmentId)
                }
            }),
            processedPayrolls: payrolls.length,
            totalGrossSalary: payrolls.reduce((sum, p) => sum + Number(p.grossSalary), 0),
            totalNetSalary: payrolls.reduce((sum, p) => sum + Number(p.netSalary), 0),
            totalDeductions: {
                paye: payrolls.reduce((sum, p) => sum + Number(p.deductions.paye), 0),
                nhif: payrolls.reduce((sum, p) => sum + Number(p.deductions.nhif), 0),
                nssf: payrolls.reduce((sum, p) => sum + Number(p.deductions.nssf.amount), 0),
                housingLevy: payrolls.reduce((sum, p) => sum + Number(p.deductions.housingLevy), 0)
            },
            employeeDetails: payrolls.map(p => ({
                name: `${p.employee.firstName} ${p.employee.lastName}`,
                position: p.employee.position,
                grossSalary: p.grossSalary,
                netSalary: p.netSalary,
                deductions: p.deductions
            })),
            averageSalary: 0,
            unprocessedEmployees: 0
        };

        summary.averageSalary = summary.totalGrossSalary / (payrolls.length || 1);
        summary.unprocessedEmployees = summary.totalEmployees - summary.processedPayrolls;

        return res.status(200).json({
            status: 'success',
            data: summary
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Failed to fetch department payroll summary',
            error: error.message
        });
    }
}
  // Download payslip
  async downloadPayslip (req, res) {
    try {
      const { id } = req.params

      const payroll = await prisma.payroll.findUnique({
        where: { id: parseInt(id) }
      })

      if (!payroll || !payroll.payslipPath) {
        return res.status(404).json({
          status: 'error',
          message: 'Payslip not found'
        })
      }

      // Check if file exists
      try {
        await fs.access(payroll.payslipPath)
      } catch (error) {
        return res.status(404).json({
          status: 'error',
          message: 'Payslip file not found'
        })
      }

      res.download(payroll.payslipPath)
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to download payslip',
        error: error.message
      })
    }
  }
}



export default PayrollController
