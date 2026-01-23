import express from 'express';
const router = express.Router();
import { createDrop, getDonorStats, updateStoreLocation } from '../controllers/donorController.js';
import { checkAuth } from '../middleware/authMiddleware.js';
router.post('/drop', checkAuth, createDrop);


router.post('/get', checkAuth, getDonorStats);
router.post('/location', checkAuth, updateStoreLocation);

export default router;