const Product = require('../models/Product');
const Notification = require('../models/Notification');

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        await checkAndCreateNotification(product);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate('supplier', 'name email');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        Object.assign(product, req.body);
        await product.save(); // Triggers status recalculation
        await checkAndCreateNotification(product);

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Also cleanup related notifications
        await Notification.deleteMany({ productId: product._id });

        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateStock = async (req, res) => {
    try {
        const { quantity, isDelta } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ message: 'Product not found' });

        const oldStatus = product.status;

        if (isDelta) {
            product.quantity += Number(quantity);
        } else {
            product.quantity = Number(quantity);
        }

        await product.save(); // Recalculates status automatically

        if (product.status !== oldStatus) {
            await checkAndCreateNotification(product, true);
        }

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: { $in: ['LowStock', 'OutOfStock'] } }).populate('supplier', 'name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Helper to handle auto-notifications
const checkAndCreateNotification = async (product, force = false) => {
    if (product.status === 'InStock' && !force) return;

    if (product.status === 'LowStock' || product.status === 'OutOfStock') {
        const message = product.status === 'OutOfStock'
            ? `Product ${product.name} (SKU: ${product.sku}) is Out of Stock.`
            : `Product ${product.name} (SKU: ${product.sku}) is running low on stock (${product.quantity} left).`;

        // Prevent duplicate spamming: check if unread notification exists for this product and status
        const existing = await Notification.findOne({ productId: product._id, type: product.status, isRead: false });

        if (!existing) {
            await Notification.create({
                productId: product._id,
                type: product.status,
                message: message
            });
        }
    }
}
