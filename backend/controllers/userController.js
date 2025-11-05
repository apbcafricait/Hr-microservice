import prisma from "../../db/prisma.js";


import { encryptPassword } from "../utils/encryptPassword.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";


import { asyncHandler } from "../middleware/asyncHandler.js";


//api/users - GET
//Get all users
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await prisma.users.findMany();
    res.json(users);
});

//Register a new user
//POST /api/users
//Access: Public
const RegisterUser = asyncHandler(async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'Request body is missing' })
    }

    const {
      email,
      password,
      firstName,
      lastName,
      nationalId,
      dateOfBirth,
      organisationName,
      organisationSubdomain,
      mpesaPhone,
      position,
      employmentDate = new Date(), // Default to today
      salary = 0.0 // Default salary (can be updated later)
    } = req.body

    // Validate required fields
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !nationalId ||
      !dateOfBirth ||
      !organisationName ||
      !organisationSubdomain
    ) {
      return res.status(400).json({
        message: 'Required fields missing',
        requiredFields: [
           'email',
          'password',
          'firstName',
          'lastName',
          'nationalId',
          'dateOfBirth',
          'organisationName',
          'organisationSubdomain',
        ]
      })
    }

    const encrypted_password = await encryptPassword(password)

    // Use a transaction to ensure all database operations succeed or fail together
    const result = await prisma.$transaction(async prisma => {
      // 1. Create the user with admin role
      const user = await prisma.users.create({
        data: {
          email,
          password_hash: encrypted_password,
          role: 'admin'
        }
      })

      // 2. Create the organization with the user as creator
      const organisation = await prisma.organisation.create({
        data: {
          name: organisationName,
          subdomain: organisationSubdomain,
          mpesaPhone,
          createdBy: user.id,
          subscriptionStatus: 'trial'
        }
      })

      // 3. Create the employee record linking the user to the organization
      const employee = await prisma.employee.create({
        data: {
          userId: user.id,
          organisationId: organisation.id,
          firstName,
          lastName,
          nationalId,
          dateOfBirth: new Date(dateOfBirth),
          position,
          employmentDate: new Date(employmentDate),
          salary
        }
      })

      // 4. Create leave balance for the employee
      const leaveBalance = await prisma.leaveBalance.create({
        data: {
          employeeId: employee.id,
          annualLeave: 21,
          sickLeave: 7,
          compassionateLeave: 3
        }
      })

      // 5. Create employee contact record (optional)
      const employeeContact = await prisma.employeeContact.create({
        data: {
          employeeId: employee.id,
          email: email,
          phone: mpesaPhone
        }
      })

      return { user, organisation, employee, leaveBalance, employeeContact }
    })

    // Generate JWT token for the user
    await generateToken(res, result.user.id)

    // Return success response with user data
    res.status(201).json({
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
      employee: {
        id: result.employee.id,
        firstName: result.employee.firstName,
        lastName: result.employee.lastName,
        position: result.employee.position
      },
      organisation: {
        id: result.organisation.id,
        name: result.organisation.name,
        subdomain: result.organisation.subdomain
      }
    })
  } catch (error) {
    console.error('Error registering user:', error)

    // Handle specific errors
    if (error.code === 'P2002') {
      // Unique constraint violation
      const field = error.meta?.target[0]
      return res.status(400).json({
        message: `${field} already exists. Please use a different ${field}.`
      })
    }

    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Logout user
//Post /api/users/logout
const logout = asyncHandler(async (req, res) => {
  // Clear the JWT cookie to log out the user
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })
  res.status(200).json({ success: true, data: {} })
})


//Login a user
//POST /api/users/login
//Access: Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
 
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
 
    const user = await prisma.users.findUnique({
      where: { email: email.toLowerCase() }
    });
 
    if (!user || !user.password_hash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log(user.id);
 
    try {
      const isMatch = await bcrypt.compare(password, user.password_hash);
     
      if (isMatch) {
        await generateToken(res, user.id);
        res.json({
          id: user.id,
          email: user.email,
          role: user.role
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
        console.error("Error logging in user:", error);
      res.status(500).json({ message: "Server error during authentication" });
    }
  });
export { getAllUsers, RegisterUser, loginUser, logout };
