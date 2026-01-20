import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import donorRoutes from './Routes/donorRoute.js';
import receiverRoutes from './Routes/receiverRoute.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/donors', donorRoutes);
app.use('/api/receivers', receiverRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ClaimDrop Logistics Server (ESM) running on port ${PORT}`);
});