const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { protect } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "Email already registered" });
    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { name, email, password: hashed } });
    await prisma.concept.createMany({
      data: [
        { name: "Deadlock", topic: "OS", description: "Two processes waiting for each other indefinitely.", retention: 22, userId: user.id },
        { name: "Binary Search", topic: "DSA", description: "O(log n) search on sorted arrays.", retention: 88, userId: user.id },
        { name: "ACID Properties", topic: "DBMS", description: "Atomicity, Consistency, Isolation, Durability.", retention: 73, userId: user.id },
        { name: "Recursion", topic: "DSA", description: "Function calling itself with a base case.", retention: 61, userId: user.id },
        { name: "Virtual Memory", topic: "OS", description: "Illusion of more memory using disk space.", retention: 29, userId: user.id },
        { name: "Normalization", topic: "DBMS", description: "Organizing DB to reduce redundancy.", retention: 48, userId: user.id }
      ]
    });
    const token = signToken(user.id);
    res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    const { password: _, ...u } = user;
    res.status(201).json({ token, user: u });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: "Invalid email or password" });
    const token = signToken(user.id);
    res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    const { password: _, ...u } = user;
    res.json({ token, user: u });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

router.get("/me", protect, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { id: true, name: true, email: true, createdAt: true } });
    res.json({ user });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch("/me", protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.update({ where: { id: req.userId }, data: { name, email }, select: { id: true, name: true, email: true } });
    res.json({ user });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
