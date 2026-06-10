const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { protect } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', protect, async (req, res) => {
  try {
    const userId = req.userId;
    const concepts = await prisma.concept.findMany({ where: { userId } });
    const revisions = await prisma.revision.findMany({ where: { userId }, orderBy: { revisedAt: 'desc' } });
    const materials = await prisma.material.findMany({ where: { userId } });

    const calcRetention = (lastRevised) => {
      const days = (Date.now() - new Date(lastRevised).getTime()) / (1000 * 60 * 60 * 24);
      return Math.max(5, Math.round(100 * Math.exp(-0.7 * days)));
    };

    const withRet = concepts.map(c => ({ ...c, retention: calcRetention(c.lastRevised) }));
    const avgRetention = withRet.length ? Math.round(withRet.reduce((s, c) => s + c.retention, 0) / withRet.length) : 0;

    const weeklyTrend = Array.from({ length: 8 }, (_, i) => {
      const start = new Date(); start.setDate(start.getDate() - (7 - i) * 7);
      const end = new Date(start); end.setDate(end.getDate() + 7);
      return { week: `Wk${i + 1}`, count: concepts.filter(c => new Date(c.createdAt) >= start && new Date(c.createdAt) < end).length };
    });

    const topicBreakdown = {};
    withRet.forEach(c => {
      if (!topicBreakdown[c.topic]) topicBreakdown[c.topic] = { total: 0, weak: 0 };
      topicBreakdown[c.topic].total++;
      if (c.retention < 50) topicBreakdown[c.topic].weak++;
    });

    let streak = 0;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 30; i++) {
      const day = new Date(today); day.setDate(day.getDate() - i);
      const has = revisions.some(r => { const d = new Date(r.revisedAt); d.setHours(0,0,0,0); return d.getTime() === day.getTime(); });
      if (has) streak++; else if (i > 0) break;
    }

    res.json({ totalConcepts: concepts.length, avgRetention, weakConcepts: withRet.filter(c => c.retention < 40).length, strongConcepts: withRet.filter(c => c.retention >= 60).length, totalRevisions: revisions.length, totalMaterials: materials.length, streak, weeklyTrend, topicBreakdown });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;