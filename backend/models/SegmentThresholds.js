const mongoose = require('mongoose');

const segmentThresholdsSchema = new mongoose.Schema({
    segmentName: { type: String, required: true, enum: ['Normal', 'Gold', 'Platinum'], unique: true },
    minPurchase: { type: Number, required: true },
    maxPurchase: { type: Number, default: null },
    baseDiscount: { type: Number, required: true },
    incrementPerAmount: { type: Number, required: true },
    incrementUnit: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('SegmentThresholds', segmentThresholdsSchema);
