import express from 'express';
import { authenticated, superAdmin } from '../middleware/Authentication.js';
import {
  listOrganisations,
  getOrganisation,
  updateOrganisationSubscription,
  cancelOrganisationSubscription,
  listUsers,
  updateUserRole,
  updateUserStatus,
} from '../controllers/SuperAdminController.js';

const router = express.Router();

// All routes require auth + super admin
router.use(authenticated, superAdmin());

// Organisations management
router.get('/organisations', listOrganisations);
router.get('/organisations/:id', getOrganisation);
router.patch('/organisations/:id/subscription', updateOrganisationSubscription);
router.post('/organisations/:id/subscription/cancel', cancelOrganisationSubscription);

// Users management
router.get('/users', listUsers);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', updateUserStatus);

export default router;

