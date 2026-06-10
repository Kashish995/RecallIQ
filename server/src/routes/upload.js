const express = require('express');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const { protect } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.post('/pdf', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const mockConcepts = [
      { name: 'Concept from ' + req.file.originalname, description: 'Auto extracted concept', topic: 'General' },
      { name: 'Key Idea 1', description: 'Important idea from the material', topic: 'General' },
      { name: 'Key Idea 2', description: 'Another concept from the material', topic: 'General' },
    ];
    const material = await prisma.material.create({ data: { title: req.file.originalname, type: 'pdf', userId: req.userId } });
    const saved = await Promise.all(mockConcepts.map(c => prisma.concept.create({ data: { ...c, userId: req.userId, retention: 100 } })));
    res.json({ material, concepts: saved, count: saved.length });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/url', protect, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL required' });
    const isYT = url.includes('youtube') || url.includes('youtu.be');
    const mockConcepts = [
      { name: 'Main Topic', description: 'Core concept from the resource', topic: 'General' },
      { name: 'Supporting Idea', description: 'Secondary concept extracted', topic: 'General' },
    ];
    const material = await prisma.material.create({ data: { title: url, type: isYT ? 'youtube' : 'article', url, userId: req.userId } });
    const saved = await Promise.all(mockConcepts.map(c => prisma.concept.create({ data: { ...c, userId: req.userId, retention: 100 } })));
    res.json({ material, concepts: saved, count: saved.length });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/', protect, async (req, res) => {
  try {
    const materials = await prisma.material.findMany({ where: { userId: req.userId }, orderBy: { createdAt: 'desc' } });
    res.json({ materials });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;