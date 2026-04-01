import React, { useState, useEffect } from 'react';
import { X, Package, Plus, Trash2 } from 'lucide-react';
import api from '../services/api';
import Alert from './Alert';

const SupplierForm = ({ supplier, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: supplier?.name || '',
        email: supplier?.email || '',
        contactNumber: supplier?.contactNumber || '',
        address: supplier?.address || '',
        notes: supplier?.notes || ''
    });

    const [manualProducts, setManualProducts] = useState([]);
    const [manualInput, setManualInput] = useState({
        name: '',
        price: '',
        quantity: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Initialize manual products from supplier data if editing
        if (supplier?.manualProducts && supplier.manualProducts.length > 0) {
            const converted = supplier.manualProducts.map((item, idx) => ({
                id: Date.now() + idx,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }));
            setManualProducts(converted);
        }
    }, [supplier]);

    const handleAddManualProduct = () => {
        if (!manualInput.name || !manualInput.price || !manualInput.quantity) {
            setError('Please fill in all fields (Product Name, Price, Quantity)');
            return;
        }
        
        const newProduct = {
            id: Date.now(),
            name: manualInput.name,
            price: parseFloat(manualInput.price),
            quantity: parseInt(manualInput.quantity)
        };
        
        setManualProducts([...manualProducts, newProduct]);
        setManualInput({ name: '', price: '', quantity: '' });
        setError(null);
    };

    const handleRemoveManualProduct = (productId) => {
        setManualProducts(manualProducts.filter(p => p.id !== productId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const submitData = {
                ...formData,
                products: [],
                manualProducts: manualProducts
            };

            if (supplier) {
                await api.put(`/suppliers/${supplier._id}`, submitData);
            } else {
                await api.post('/suppliers', submitData);
            }
            onSave();
        } catch (err) {
            console.error('Save error:', err);
            setError(err.response?.data?.message || 'Failed to save supplier');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">{supplier ? 'Edit Supplier' : 'Add New Supplier'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 h-auto">
                    <Alert type="error" message={error} onClose={() => setError(null)} />

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
                            <input required type="text" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                <input type="text" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.contactNumber} onChange={e => setFormData({ ...formData, contactNumber: e.target.value })} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" rows="2"
                                value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" rows="3"
                                value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                        </div>

                        {/* Products Section */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Package className="h-5 w-5 text-indigo-600" />
                                <label className="text-lg font-bold text-gray-900">Products</label>
                            </div>

                            {/* Manual Product Entry Section */}
                            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 mb-4">
                                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Add Product</h4>
                                <div className="grid grid-cols-4 gap-3">
                                    <input 
                                        type="text"
                                        placeholder="Product Name"
                                        value={manualInput.name}
                                        onChange={(e) => setManualInput({...manualInput, name: e.target.value})}
                                        className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    />
                                    <input 
                                        type="number"
                                        placeholder="Price"
                                        value={manualInput.price}
                                        onChange={(e) => setManualInput({...manualInput, price: e.target.value})}
                                        className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    />
                                    <input 
                                        type="number"
                                        placeholder="Quantity"
                                        value={manualInput.quantity}
                                        onChange={(e) => setManualInput({...manualInput, quantity: e.target.value})}
                                        className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    />
                                    <button 
                                        type="button"
                                        onClick={handleAddManualProduct}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Plus className="h-4 w-4" /> Add
                                    </button>
                                </div>
                            </div>

                            {/* Manual Products List */}
                            {manualProducts.length > 0 ? (
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="grid grid-cols-4 gap-4 bg-gray-50 border-b border-gray-200 p-3 font-semibold text-sm text-gray-700">
                                        <div>Product Name</div>
                                        <div>Price</div>
                                        <div>Quantity</div>
                                        <div className="text-center">Action</div>
                                    </div>
                                    <div className="divide-y divide-gray-200">
                                        {manualProducts.map(product => (
                                            <div key={product.id} className="grid grid-cols-4 gap-4 p-3 items-center hover:bg-gray-50">
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm font-semibold text-emerald-600">${product.price}</div>
                                                <div className="text-sm font-medium text-blue-600">{product.quantity}</div>
                                                <div className="text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveManualProduct(product.id)}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 text-center">
                                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-sm text-gray-600 font-medium">No products added yet</p>
                                    <p className="text-xs text-gray-500 mt-1">Add products using the form above</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
                                {loading ? 'Saving...' : 'Save Supplier'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SupplierForm;
