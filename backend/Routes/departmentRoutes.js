// // src/routes/departmentRoutes.js

// import { Router } from 'express'
// import { DepartmentsController } from '../controllers/DepartmentsController.js'
// import {authenticated, manager} from '../middleware/Authentication.js'

// const router = Router()
// const departmentsController = new DepartmentsController()

// // Protect all routes
// router.use(authenticated)

// // Public routes (for authenticated users)
// router.get(
//   '/organisation/:organisationId',
//   departmentsController.getDepartments
// )
// router.get('/:id', departmentsController.getDepartment)

// // Admin only routes
// // router.use(manager)
// router.post(
//   '/organisation/:organisationId',
//   departmentsController.createDepartment
// )
// router.put('/:id', departmentsController.updateDepartment)
// router.delete('/:id', departmentsController.deleteDepartment)
// router.post('/:id/assign-employees', departmentsController.assignEmployees)

// export default router
