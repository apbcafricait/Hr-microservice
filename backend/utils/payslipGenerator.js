// src/utils/payslipGenerator.js

import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import { formatCurrency } from './formatters.js'

export const generatePayslip = async (employee, payrollData, monthYear) => {
  try {
    // Create directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads', 'payslips')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Generate filename
    const fileName = `payslip_${employee.id}_${monthYear.replace('-', '_')}.pdf`
    const filePath = path.join(uploadDir, fileName)

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 10
    })

    // Pipe PDF to file
    doc.pipe(fs.createWriteStream(filePath))

    // Add company logo (if exists)
    // const logoPath = path.join(process.cwd(), 'assets', 'logo.png');
    // if (fs.existsSync(logoPath)) {
    //     doc.image(logoPath, 50, 50, { width: 100 });
    // }

    // Document title
    doc
      .font('Helvetica-Bold')
      .fontSize(20)
      .text('PAYSLIP', { align: 'center' })
      .moveDown()

    // Company details
    doc
      .fontSize(12)
      .text('Company Name Ltd', { align: 'center' })
      .fontSize(10)
      .text('P.O. Box 12345-00100, Nairobi, Kenya', { align: 'center' })
      .text('Tel: +254 700 000000', { align: 'center' })
      .moveDown()

    // Payslip period
    const date = new Date(monthYear)
    const monthName = date.toLocaleString('default', { month: 'long' })
    const year = date.getFullYear()

    doc
      .fontSize(12)
      .text(`Payslip for ${monthName} ${year}`, { align: 'center' })
      .moveDown()

    // Employee details section
    doc
      .font('Helvetica-Bold')
      .fontSize(11)
      .text('Employee Details', { underline: true })
      .moveDown(0.5)

    const employeeDetails = [
      ['Employee Name:', `${employee.firstName} ${employee.lastName}`],
      ['Employee ID:', employee.employeeId || 'N/A'],
      ['Department:', employee.department || 'N/A'],
      ['Position:', employee.position || 'N/A'],
      ['NSSF Number:', employee.nssfNumber || 'N/A'],
      ['SHIF Number:', employee.shifNumber || 'N/A'],
      ['KRA PIN:', employee.kraPIN || 'N/A']
    ]

    // Create employee details table
    const startX = 50
    let currentY = doc.y
    const lineHeight = 20

    employeeDetails.forEach(([label, value]) => {
      doc
        .font('Helvetica-Bold')
        .text(label, startX, currentY)
        .font('Helvetica')
        .text(value, startX + 200, currentY)
      currentY += lineHeight
    })

    doc.moveDown(2)

    // Earnings and Deductions
    const tableTop = doc.y
    const tableLeft = 50
    const columnWidth = 140

    // Headers
    doc
      .font('Helvetica-Bold')
      .text('Earnings', tableLeft, tableTop)
      .text('Amount (KES)', tableLeft + columnWidth, tableTop)
      .text('Deductions', tableLeft + columnWidth * 2, tableTop)
      .text('Amount (KES)', tableLeft + columnWidth * 3, tableTop)
      .moveDown()

    // Draw lines
    doc
      .moveTo(tableLeft, tableTop + 20)
      .lineTo(tableLeft + columnWidth * 4, tableTop + 20)
      .stroke()

    // Content
    let rowTop = tableTop + 30

    // Earnings
    doc
      .font('Helvetica')
      .text('Basic Salary', tableLeft, rowTop)
      .text(
        formatCurrency(payrollData.grossSalary),
        tableLeft + columnWidth,
        rowTop
      )

    // Deductions
    doc
      .text('PAYE', tableLeft + columnWidth * 2, rowTop)
      .text(
        formatCurrency(payrollData.deductions.paye),
        tableLeft + columnWidth * 3,
        rowTop
      )

    rowTop += lineHeight

    doc
      .text('House Allowance', tableLeft, rowTop)
      .text(formatCurrency(0), tableLeft + columnWidth, rowTop)
      .text('NSSF', tableLeft + columnWidth * 2, rowTop)
      .text(
        formatCurrency(payrollData.deductions.nssf.amount),
        tableLeft + columnWidth * 3,
        rowTop
      )


    rowTop += lineHeight

    doc
      .text('Transport Allowance', tableLeft, rowTop)
      .text(formatCurrency(0), tableLeft + columnWidth, rowTop)
      .text('SHIF', tableLeft + columnWidth * 2, rowTop)
      .text(
        formatCurrency(payrollData.deductions.shif),
        tableLeft + columnWidth * 3,
        rowTop
      )

    rowTop += lineHeight

    doc
      .text('', tableLeft, rowTop)
      .text('', tableLeft + columnWidth, rowTop)
      .text('Housing Levy', tableLeft + columnWidth * 2, rowTop)
      .text(
        formatCurrency(payrollData.deductions.housingLevy),
        tableLeft + columnWidth * 3,
        rowTop
      )

    rowTop += lineHeight * 2

    // Totals
    doc
      .moveTo(tableLeft, rowTop - 10)
      .lineTo(tableLeft + columnWidth * 4, rowTop - 10)
      .stroke()

    doc
      .font('Helvetica-Bold')
      .text('Total Earnings', tableLeft, rowTop)
      .text(
        formatCurrency(payrollData.grossSalary),
        tableLeft + columnWidth,
        rowTop
      )
      .text('Total Deductions', tableLeft + columnWidth * 2, rowTop)
      .text(
        formatCurrency(payrollData.totalDeductions),
        tableLeft + columnWidth * 3,
        rowTop
      )

    rowTop += lineHeight * 2

    // Net Pay
    doc
      .fontSize(12)
      .text('Net Pay:', tableLeft, rowTop)
      .text(
        formatCurrency(payrollData.netSalary),
        tableLeft + columnWidth,
        rowTop
      )

    rowTop += lineHeight * 2

    // Payment Details
    doc
      .font('Helvetica-Bold')
      .fontSize(11)
      .text('Payment Details', tableLeft, rowTop, { underline: true })
      .moveDown(0.5)

    const paymentDetails = [
      ['Bank Name:', employee.bankName || 'N/A'],
      ['Branch:', employee.bankBranch || 'N/A'],
      ['Account Number:', employee.bankAccount || 'N/A']
    ]

    paymentDetails.forEach(([label, value]) => {
      doc
        .font('Helvetica-Bold')
        .text(label, tableLeft)
        .font('Helvetica')
        .text(value, tableLeft + 200)
    })

    // Footer
    doc
      .fontSize(8)
      .text(
        'This is a computer-generated document and does not require a signature.',
        {
          align: 'center',
          bottom: 50
        }
      )

    // Finalize PDF
    doc.end()

    return filePath
  } catch (error) {
    console.error('Error generating payslip:', error)
    throw new Error('Failed to generate payslip')
  }
}



export default generatePayslip
