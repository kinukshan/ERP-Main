require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const SegmentThresholds = require('./models/SegmentThresholds');
const Product = require('./models/Product');
const connectDB = require('./config/db');

connectDB();

const seedData = async () => {
    try {
        // Delete existing data to prevent duplicates if run multiple times
        await User.deleteMany();
        await SegmentThresholds.deleteMany();
        await Product.deleteMany();

        const ownerUser = await User.create({
            email: 'owner@test.com',
            password: 'Owner@123',
            role: 'Owner'
        });

        // Seed default segment thresholds
        const segments = await SegmentThresholds.create([
            {
                segmentName: 'Normal',
                minPurchase: 0,
                maxPurchase: 5000,
                baseDiscount: 0,
                incrementPerAmount: 0.1,
                incrementUnit: 1000
            },
            {
                segmentName: 'Gold',
                minPurchase: 5000,
                maxPurchase: 20000,
                baseDiscount: 5,
                incrementPerAmount: 0.2,
                incrementUnit: 1000
            },
            {
                segmentName: 'Platinum',
                minPurchase: 20000,
                maxPurchase: null,
                baseDiscount: 10,
                incrementPerAmount: 0.25,
                incrementUnit: 1000
            }
        ]);

        // Seed sample products
        const products = await Product.create([
            {
                name: 'Biscuit',
                sku: '20',
                category: 'Grocery',
                price: 100,
                quantity: 20,
                reorderLevel: 25,
                status: 'LowStock'
            },
            {
                name: 'Cake',
                sku: '15',
                category: 'Grocery',
                price: 100,
                quantity: 20,
                reorderLevel: 10,
                status: 'InStock'
            },
            {
                name: 'Chocolate',
                sku: '12',
                category: 'Grocery',
                price: 50,
                quantity: 15,
                reorderLevel: 20,
                status: 'InStock'
            },
            {
                name: 'Tea',
                sku: '25',
                category: 'Beverages',
                price: 75,
                quantity: 30,
                reorderLevel: 15,
                status: 'InStock'
            }
        ]);

        console.log('Seeded Owner Account:');
        console.log(`Email: ${ownerUser.email}`);
        console.log('\nSeeded Segment Thresholds:');
        segments.forEach(seg => {
            console.log(`${seg.segmentName}: Min $${seg.minPurchase} - Max ${seg.maxPurchase === null ? 'Unlimited' : '$' + seg.maxPurchase}`);
        });
        console.log('\nSeeded Products:');
        products.forEach(prod => {
            console.log(`- ${prod.name} (SKU: ${prod.sku}) - $${prod.price}`);
        });
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
