const express = require('express');
const router = express.Router();
const { getSegments, updateSegment } = require('../controllers/segmentController');
const { protect, ownerOnly } = require('../middleware/auth');

// GET all segments
router.get('/', protect, getSegments);

// PUT update segment
router.put('/:id', protect, ownerOnly, updateSegment);

module.exports = router;
