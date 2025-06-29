import express from 'express';
import { signup, login, logout, editProfile, getAllPlans, getProfile, getAllNotification, pushNotification, verifyEmail, updatePassword, sendVerificationCode, checkVerificationCode } from '../controllers/user.controllers.js';
import { authMiddleware } from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-email/:id', verifyEmail);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.put('/edit-profile', authMiddleware, editProfile);
router.get('/plans', authMiddleware, getAllPlans);
router.get('/', authMiddleware, getProfile);
router.get('/notifications', authMiddleware, getAllNotification);
router.post('/push/notification', authMiddleware, pushNotification);
router.post('/forget-password/send-code', sendVerificationCode);
router.post('/forget-password/verify-code',authMiddleware, checkVerificationCode);
router.post('/reset-password', authMiddleware, updatePassword);

export default router;

