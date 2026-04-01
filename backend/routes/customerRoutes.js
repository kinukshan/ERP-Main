const express = require('express');
const router = express.Router();
const { getCustomers, createCustomer, updateCustomer, deleteCustomer, addPurchase } = require('../controllers/customerController');
const { protect, ownerOnly } = require('../middleware/auth');

// GET all customers
router.get('/', protect, getCustomers);

// POST create new customer
router.post('/', protect, ownerOnly, createCustomer);

// PUT update customer
router.put('/:id', protect, ownerOnly, updateCustomer);

// DELETE customer
router.delete('/:id', protect, ownerOnly, deleteCustomer);

// PATCH add purchase to customer
router.patch('/:id/purchase', protect, addPurchase);

module.exports = router;
