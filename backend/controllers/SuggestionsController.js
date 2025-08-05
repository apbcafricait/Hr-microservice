// src/controllers/SuggestionsController.js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class SuggestionsController {
  // GET a single suggestion by its id
  async getSuggestion (req, res) {
    try {
      const id = parseInt(req.params.id)
      const suggestion = await prisma.suggestion.findUnique({
        where: { id },
        include: {
          organisation: { select: { name: true, id: true } } // Adjust fields as needed
        }
      })
      if (!suggestion) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Suggestion not found' })
      }
      return res.status(200).json({ status: 'success', data: suggestion })
    } catch (error) {
      return res
        .status(500)
        .json({
          status: 'error',
          message: 'Failed to fetch suggestion',
          error: error.message
        })
    }
  }

  // GET all suggestions with pagination and optional filtering by organisationId
  async getAllSuggestions (req, res) {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10
      const skip = (page - 1) * limit
      const whereClause = {}
      if (req.query.organisationId) {
        whereClause.organisationId = parseInt(req.query.organisationId)
      }
      const [suggestions, total] = await Promise.all([
        prisma.suggestion.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            organisation: { select: { name: true } }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.suggestion.count({ where: whereClause })
      ])
      return res.status(200).json({
        status: 'success',
        data: {
          suggestions,
          pagination: { total, pages: Math.ceil(total / limit), page, limit }
        }
      })
    } catch (error) {
      return res
        .status(500)
        .json({
          status: 'error',
          message: 'Failed to fetch suggestions',
          error: error.message
        })
    }
  }

  // POST: Create a new suggestion
async createSuggestion(req, res) {
  try {
    const employeeId = req.user?.employeeId;
    const organisationId = req.user?.organisationId; 

    const { content, isAnonymous } = req.body;

    if (!employeeId || !organisationId || !content) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: employeeId, organisationId, or content',
      });
    }

    const suggestion = await prisma.suggestion.create({
      data: {
        organisationId,
        content,
        isAnonymous: isAnonymous !== undefined ? Boolean(isAnonymous) : true,
        employee: { connect: { id: employeeId } },
      },
    });

    return res.status(201).json({ status: 'success', data: suggestion });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create suggestion',
      error: error.message,
    });
  }
}


  // PUT: Update an existing suggestion (admin-only, if updates are allowed)
  async updateSuggestion (req, res) {
    try {
      const id = parseInt(req.params.id)
      const { content, isAnonymous } = req.body
      const updateData = {}
      if (content !== undefined) updateData.content = content
      if (isAnonymous !== undefined)
        updateData.isAnonymous = Boolean(isAnonymous)

      const suggestion = await prisma.suggestion.update({
        where: { id },
        data: updateData
      })
      return res.status(200).json({ status: 'success', data: suggestion })
    } catch (error) {
      return res
        .status(500)
        .json({
          status: 'error',
          message: 'Failed to update suggestion',
          error: error.message
        })
    }
  }

  // DELETE: Remove a suggestion (admin-only)
  async deleteSuggestion (req, res) {
    try {
      const id = parseInt(req.params.id)
      const suggestion = await prisma.suggestion.delete({
        where: { id }
      })
      return res
        .status(200)
        .json({
          status: 'success',
          message: 'Suggestion deleted',
          data: suggestion
        })
    } catch (error) {
      return res
        .status(500)
        .json({
          status: 'error',
          message: 'Failed to delete suggestion',
          error: error.message
        })
    }
  }
}

export default SuggestionsController
