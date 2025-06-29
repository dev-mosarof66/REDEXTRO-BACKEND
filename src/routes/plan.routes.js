import express from 'express';
import {
  createPlan,
  getPlanById,
  updatePlan,
  deletePlan
} from '../controllers/plan.controllers.js';
import { authMiddleware } from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.route('/').post(authMiddleware, createPlan)
router.route('/:id').post(authMiddleware, getPlanById)
router.route('/delete/:id').delete(authMiddleware, deletePlan)
router.route('/update/:id').put(authMiddleware, updatePlan)

export default router;
