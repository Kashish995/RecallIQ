const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { protect } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

const calcRetention = (lastRevised) => {
  const days = (Date.now() - new Date(lastRevised).getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(5, Math.round(100 * Math.exp(-0.7 * days)));
};

router.get('/', protect, async (req, res) => {
  try {
    const concepts = await prisma.concept.findMany({ where: { userId: req.userId }, orderBy: { createdAt: 'desc' } });
    res.json({ concepts: concepts.map(c => ({ ...c, retention: calcRetention(c.lastRevised) })) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const { name, description, topic } = req.body;
    if (!name || !topic) return res.status(400).json({ error: 'Name and topic required' });
    const concept = await prisma.concept.create({
      data: { name, description: description || '', topic, userId: req.userId, retention: 100 }
    });
    res.status(201).json({ concept });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/:id/revise', protect, async (req, res) => {
  try {
    const concept = await prisma.concept.findFirst({ where: { id: req.params.id, userId: req.userId } });
    if (!concept) return res.status(404).json({ error: 'Not found' });
    const updated = await prisma.concept.update({
      where: { id: req.params.id },
      data: { retention: Math.min(100, concept.retention + 25), lastRevised: new Date() }
    });
    await prisma.revision.create({ data: { userId: req.userId, conceptId: req.params.id, score: req.body.score || 80 } });
    res.json({ concept: updated });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await prisma.concept.deleteMany({ where: { id: req.params.id, userId: req.userId } });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;