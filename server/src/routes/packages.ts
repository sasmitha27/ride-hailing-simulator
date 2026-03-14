import { Router } from 'express';
import prisma from '../prismaClient';
import fs from 'fs';
import path from 'path';

const router = Router();

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

function tryDeleteUploadedFile(imageUrl?: string) {
  if (!imageUrl || typeof imageUrl !== 'string') return;
  const idx = imageUrl.indexOf('/uploads/');
  if (idx === -1) return;
  const filename = imageUrl.substring(idx + '/uploads/'.length);
  const filePath = path.join(uploadsDir, filename);
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.warn('Failed to delete uploaded file', filePath, err);
  }
}

// GET /api/packages
router.get('/', async (req, res) => {
  const packages = await prisma.package.findMany({ orderBy: { id: 'asc' } });
  res.json(packages);
});

// POST /api/packages
router.post('/', async (req, res) => {
  try {
    const { title, destination, locationId, duration, price, description, imageUrl, includes, featured } = req.body;
    const pkg = await prisma.package.create({
      data: { title, destination, locationId: Number(locationId), duration: Number(duration), price: Number(price), description, imageUrl, includes: includes || [], featured: !!featured }
    });
    res.status(201).json(pkg);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create package' });
  }
});

// PUT /api/packages/:id
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    // if imageUrl changed, remove old uploaded file
    const existing = await prisma.package.findUnique({ where: { id } });
    if (existing && existing.imageUrl && req.body.imageUrl && existing.imageUrl !== req.body.imageUrl) {
      tryDeleteUploadedFile(existing.imageUrl);
    }
    const updated = await prisma.package.update({ where: { id }, data: req.body });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update package' });
  }
});

// DELETE /api/packages/:id
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const existing = await prisma.package.findUnique({ where: { id } });
    if (existing) {
      tryDeleteUploadedFile(existing.imageUrl);
    }
    await prisma.package.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete package' });
  }
});

export default router;
