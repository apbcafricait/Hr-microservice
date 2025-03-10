import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import prisma from '../../db/prisma.js'

dotenv.config() // Ensure environment variables are loaded

// Middleware to authenticate users
const authenticated = (req, res, next) => {
  const myToken = req.cookies.authToken
  if (!myToken) {
    return res.status(401).json({ message: 'Not authorized' })
  }

  try {
    const decoded = jwt.verify(myToken, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    console.error('Error verifying token:', error)
    return res.status(401).json({ message: 'Not authorized' })
  }
}

// The key issue is here - admin middleware needs to return a function
const admin = () => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated' })
      }

      const id = req.user.id
      console.log('Admin middleware - User ID:', id) // Debug

      const user = await prisma.users.findUnique({
        where: { id }
      })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      console.log('User from DB:', user) // Debug
      const isAdmin = user.role === 'admin'
      if (!isAdmin) {
        return res.status(403).json({ message: 'Not authorized as Admin' })
      }

      next()
    } catch (error) {
      console.error('Error verifying user role:', error)
      return res.status(500).json({ message: 'Server error' })
    }
<<<<<<< HEAD
=======

    const id = req.user.id
    console.log('Admin middleware - User ID:', id) // Debug

    const user = await prisma.users.findUnique({
      where: { id }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const isAdmin = user.role === 'admin'
    if (!isAdmin) {
      return res.status(403).json({ message: 'Not authorized as Admin' })
    }

    next()
  } catch (error) {
    console.error('Error verifying user role:', error)
    // return res.status(500).json({ message: 'Server error' })
>>>>>>> c3c03d64abb599b1f1a8df311cbe6ae6869855b5
  }
}

// Same fix for manager middleware
const manager = () => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated' })
      }

      const id = req.user.id
      console.log('Manager middleware - User ID:', id) // Debug

      const user = await prisma.users.findUnique({
        where: { id }
      })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const isManager = user.role === 'manager'
      if (!isManager) {
        return res.status(403).json({ message: 'Not authorized as Manager' })
      }

      next() // Proceed if user is manager
    } catch (error) {
      console.error('Error verifying user role:', error)
      return res.status(500).json({ message: 'Server error' })
    }
  }
}

export { authenticated, admin, manager }