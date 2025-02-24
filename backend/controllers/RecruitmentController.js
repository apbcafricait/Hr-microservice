import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class RecruitmentController {
  // Create a new candidate
  async createCandidate (req, res) {
    try {
      const {
        jobTitle,
        vacancy,
        hiringManager,
        status,
        candidateName,
        keywords,
        methodOfApplication,
        dateOfApplication,
        from,
        to
      } = req.body

      const candidate = await prisma.candidate.create({
        data: {
          jobTitle,
          vacancy,
          hiringManager,
          status,
          candidateName,
          keywords,
          methodOfApplication,
          dateOfApplication: new Date(dateOfApplication),
          from: from ? new Date(from) : null,
          to: to ? new Date(to) : null
        }
      })

      return res.status(201).json({ status: 'success', data: candidate })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create candidate',
        error: error.message
      })
    }
  }

  // Get all candidates
  async getAllCandidates (req, res) {
    try {
      const candidates = await prisma.candidate.findMany({
        orderBy: { dateOfApplication: 'desc' }
      })

      return res.status(200).json({ status: 'success', data: candidates })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch candidates',
        error: error.message
      })
    }
  }

  // Get a single candidate by ID
  async getCandidate (req, res) {
    try {
      const id = parseInt(req.params.id)
      const candidate = await prisma.candidate.findUnique({
        where: { id }
      })

      if (!candidate) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Candidate not found' })
      }

      return res.status(200).json({ status: 'success', data: candidate })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch candidate',
        error: error.message
      })
    }
  }

  // Update a candidate
  async updateCandidate (req, res) {
    try {
      const id = parseInt(req.params.id)
      const {
        jobTitle,
        vacancy,
        hiringManager,
        status,
        candidateName,
        keywords,
        methodOfApplication,
        dateOfApplication,
        from,
        to
      } = req.body

      const updatedCandidate = await prisma.candidate.update({
        where: { id },
        data: {
          jobTitle,
          vacancy,
          hiringManager,
          status,
          candidateName,
          keywords,
          methodOfApplication,
          dateOfApplication: new Date(dateOfApplication),
          from: from ? new Date(from) : null,
          to: to ? new Date(to) : null
        }
      })

      return res.status(200).json({ status: 'success', data: updatedCandidate })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update candidate',
        error: error.message
      })
    }
  }

  // Delete a candidate
  async deleteCandidate (req, res) {
    try {
      const id = parseInt(req.params.id)
      await prisma.candidate.delete({ where: { id } })

      return res.status(200).json({
        status: 'success',
        message: 'Candidate deleted'
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete candidate',
        error: error.message
      })
    }
  }

  // Create a new vacancy
  async createVacancy (req, res) {
    try {
      const { jobTitle, vacancy, hiringManager, status } = req.body

      const vacancyCreated = await prisma.vacancy.create({
        data: {
          jobTitle,
          vacancy,
          hiringManager,
          status
        }
      })

      return res.status(201).json({ status: 'success', data: vacancyCreated })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create vacancy',
        error: error.message
      })
    }
  }

  // Get all vacancies
  async getAllVacancies (req, res) {
    try {
      const vacancies = await prisma.vacancy.findMany()

      return res.status(200).json({ status: 'success', data: vacancies })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch vacancies',
        error: error.message
      })
    }
  }

  // Get a single vacancy by ID
  async getVacancy (req, res) {
    try {
      const id = parseInt(req.params.id)
      const vacancy = await prisma.vacancy.findUnique({
        where: { id }
      })

      if (!vacancy) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Vacancy not found' })
      }

      return res.status(200).json({ status: 'success', data: vacancy })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch vacancy',
        error: error.message
      })
    }
  }

  // Update a vacancy
  async updateVacancy (req, res) {
    try {
      const id = parseInt(req.params.id)
      const { jobTitle, vacancy, hiringManager, status } = req.body

      const updatedVacancy = await prisma.vacancy.update({
        where: { id },
        data: {
          jobTitle,
          vacancy,
          hiringManager,
          status
        }
      })

      return res.status(200).json({ status: 'success', data: updatedVacancy })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update vacancy',
        error: error.message
      })
    }
  }

  // Delete a vacancy
  async deleteVacancy (req, res) {
    try {
      const id = parseInt(req.params.id)
      await prisma.vacancy.delete({ where: { id } })

      return res.status(200).json({
        status: 'success',
        message: 'Vacancy deleted'
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete vacancy',
        error: error.message
      })
    }
  }
}

export default RecruitmentController
