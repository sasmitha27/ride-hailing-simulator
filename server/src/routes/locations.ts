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

// GET /api/locations
router.get('/', async (req, res) => {
  const locations = await prisma.location.findMany({ orderBy: { id: 'asc' } });
  res.json(locations);
});

// POST /api/locations
router.post('/', async (req, res) => {
  const { name, country, continent, description, imageUrl, featured } = req.body;
  try {
    const loc = await prisma.location.create({ data: { name, country, continent, description, imageUrl, featured } });
    res.status(201).json(loc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create location' });
  }
});

// PUT /api/locations/:id
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    // if imageUrl changed, remove old uploaded file
    const existing = await prisma.location.findUnique({ where: { id } });
    if (existing && existing.imageUrl && req.body.imageUrl && existing.imageUrl !== req.body.imageUrl) {
      tryDeleteUploadedFile(existing.imageUrl);
    }
    const updated = await prisma.location.update({ where: { id }, data: req.body });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// DELETE /api/locations/:id
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    // delete package images for this location
    const pkgs = await prisma.package.findMany({ where: { locationId: id } });
    for (const p of pkgs) {
      tryDeleteUploadedFile(p.imageUrl);
    }
    await prisma.package.deleteMany({ where: { locationId: id } });
    // delete location image
    const existing = await prisma.location.findUnique({ where: { id } });
    if (existing) tryDeleteUploadedFile(existing.imageUrl);
    await prisma.location.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete location' });
  }
});

export default router;
