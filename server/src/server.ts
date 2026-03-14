import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import locationsRouter from './routes/locations';
import packagesRouter from './routes/packages';
import authRouter from './routes/auth';
import uploadRouter from './routes/upload';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.get('/', (req, res) => res.json({ ok: true, message: 'Ceylon Travo API' }));
app.get('/api/health', (req, res) => res.json({ ok: true, status: 'healthy' }));

app.use('/api/locations', locationsRouter);
app.use('/api/packages', packagesRouter);
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);

// serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
