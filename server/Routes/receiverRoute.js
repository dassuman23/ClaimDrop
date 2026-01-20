import express from 'express';
import { claimDrop, verifyOTP, getAvailableDrops } from '../controllers/receiverController.js';
import { checkAuth } from '../middleware/authMiddleware.js';
const router = express.Router();
router.get('/available', getAvailableDrops);
router.post('/claim', checkAuth, claimDrop);
router.post('/verify', checkAuth, verifyOTP);

export default router;