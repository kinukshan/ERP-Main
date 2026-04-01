const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

exports.createSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.create(req.body);
        
        // Update products to reference this supplier
        if (supplier.products && supplier.products.length > 0) {
            const productIds = supplier.products.map(p => p.productId);
            await Product.updateMany(
                { _id: { $in: productIds } },
                { supplier: supplier._id }
            );
        }
        
        await supplier.populate('products.productId');
        res.status(201).json(supplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find({}).populate('products.productId');
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSupplier = async (req, res) => {
    try {
        const supplierId = req.params.id;
        const oldSupplier = await Supplier.findById(supplierId);
        
        // Get old product IDs
        const oldProductIds = oldSupplier?.products?.map(p => p.productId) || [];
        
        // Update supplier
        const supplier = await Supplier.findByIdAndUpdate(supplierId, req.body, { new: true, runValidators: true });
        
        // Get new product IDs
        const newProductIds = supplier.products?.map(p => p.productId) || [];
        
        // Remove supplier reference from products that are no longer assigned
        const removedIds = oldProductIds.filter(id => !newProductIds.includes(id));
        if (removedIds.length > 0) {
            await Product.updateMany(
                { _id: { $in: removedIds } },
                { supplier: null }
            );
        }
        
        // Assign supplier to new products
        if (newProductIds.length > 0) {
            await Product.updateMany(
                { _id: { $in: newProductIds } },
                { supplier: supplierId }
            );
        }
        
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        await supplier.populate('products.productId');
        res.json(supplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        
        // Remove supplier reference from products
        if (supplier.products && supplier.products.length > 0) {
            const productIds = supplier.products.map(p => p.productId);
            await Product.updateMany(
                { _id: { $in: productIds } },
                { supplier: null }
            );
        }
        
        res.json({ message: 'Supplier removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
