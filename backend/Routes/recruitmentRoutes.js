import { Router } from 'express'
import RecruitmentController from '../controllers/RecruitmentController.js'

const router = Router()
const recruitmentController = new RecruitmentController()

// Candidates Routes
router.post(
  '/candidates',
  recruitmentController.createCandidate.bind(recruitmentController)
)
router.get(
  '/candidates',
  recruitmentController.getAllCandidates.bind(recruitmentController)
)
router.get(
  '/candidates/:id',
  recruitmentController.getCandidate.bind(recruitmentController)
)
router.put(
  '/candidates/:id',
  recruitmentController.updateCandidate.bind(recruitmentController)
)
router.delete(
  '/candidates/:id',
  recruitmentController.deleteCandidate.bind(recruitmentController)
)

// Vacancies Routes
router.post(
  '/vacancies',
  recruitmentController.createVacancy.bind(recruitmentController)
)
router.get(
  '/vacancies',
  recruitmentController.getAllVacancies.bind(recruitmentController)
)
router.get(
  '/vacancies/:id',
  recruitmentController.getVacancy.bind(recruitmentController)
)
router.put(
  '/vacancies/:id',
  recruitmentController.updateVacancy.bind(recruitmentController)
)
router.delete(
  '/vacancies/:id',
  recruitmentController.deleteVacancy.bind(recruitmentController)
)

export default router
