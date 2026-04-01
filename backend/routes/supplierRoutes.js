const express = require('express');
const router = express.Router();
const { createSupplier, getSuppliers, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const { protect, ownerOnly } = require('../middleware/auth');

router.route('/')
    .get(protect, getSuppliers)
    .post(protect, createSupplier);

router.route('/:id')
    .put(protect, updateSupplier)
    .delete(protect, ownerOnly, deleteSupplier);

module.exports = router;
