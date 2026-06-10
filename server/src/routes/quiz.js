const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

const quizBank = [
  { question: 'Which four conditions must hold for Deadlock?', options: ['Mutual exclusion, hold and wait, no preemption, circular wait', 'Circular wait only', 'Hold and wait only', 'Preemption and sharing'], answer: 0, difficulty: 'medium', topic: 'OS' },
  { question: 'Time complexity of Binary Search?', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(n log n)'], answer: 2, difficulty: 'easy', topic: 'DSA' },
  { question: 'What does ACID stand for?', options: ['Atomicity Consistency Isolation Durability', 'Access Control Integrity Data', 'Availability Concurrency Independence Durability', 'None'], answer: 0, difficulty: 'easy', topic: 'DBMS' },
  { question: 'A semaphore initialized to 1 acts as?', options: ['Counting semaphore', 'Binary semaphore / Mutex', 'Spinlock', 'Monitor'], answer: 1, difficulty: 'medium', topic: 'OS' },
  { question: 'Heap Sort worst case complexity?', options: ['O(n²)', 'O(n log n)', 'O(log n)', 'O(n)'], answer: 1, difficulty: 'easy', topic: 'DSA' },
  { question: 'B+ Tree is used in databases for?', options: ['Storing adjacency lists', 'Indexing for range queries', 'Hashing', 'Sorting in memory'], answer: 1, difficulty: 'hard', topic: 'DBMS' },
  { question: 'What does a Page Fault trigger?', options: ['Process termination', 'Loading page from disk to RAM', 'Creating new process', 'Memory failure'], answer: 1, difficulty: 'medium', topic: 'OS' },
  { question: 'BFS uses which data structure?', options: ['Stack', 'Priority Queue', 'Queue', 'Linked List'], answer: 2, difficulty: 'easy', topic: 'DSA' },
];

router.get('/', protect, async (req, res) => {
  try {
    const shuffled = quizBank.sort(() => Math.random() - 0.5).slice(0, 8);
    res.json({ questions: shuffled });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;