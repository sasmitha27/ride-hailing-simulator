import { Router } from 'express';
import prisma from '../prismaClient';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

  const user = await prisma.adminUser.findUnique({ where: { username } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ sub: user.id, username: user.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });
  res.json({ token });
});

export default router;
