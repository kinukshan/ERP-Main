const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    contactNumber: { type: String },
    address: { type: String },
    notes: { type: String },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 0 }
    }],
    manualProducts: [{
        name: String,
        price: Number,
        quantity: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
