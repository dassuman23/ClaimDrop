import express from 'express';
const router = express.Router();
import { createDrop, getDonorStats } from '../controllers/donorController.js';

// POST /api/receivers/claim - Rider claims a drop
router.post('/claim', createDrop);

// POST /api/receivers/verify - Verify OTP at the donor location
router.post('/verify', getDonorStats);

export default router;