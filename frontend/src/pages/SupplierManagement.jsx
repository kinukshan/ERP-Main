import React, { useState, useEffect } from 'react';
import { Plus, Package } from 'lucide-react';
import api from '../services/api';
import Alert from '../components/Alert';
import SupplierList from '../components/SupplierList';
import SupplierForm from '../components/SupplierForm';

const SupplierManagement = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('suppliers');

    const [showForm, setShowForm] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/suppliers');
            setSuppliers(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch suppliers');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (err) {
            console.error('Failed to fetch products');
        }
    };

    useEffect(() => {
        fetchSuppliers();
        fetchProducts();
    }, []);

    const handleSaved = () => {
        setShowForm(false);
        setEditingSupplier(null);
        fetchSuppliers();
        fetchProducts();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this supplier? Note: Ensure no products are currently linked to this supplier.')) {
            try {
                await api.delete(`/suppliers/${id}`);
                fetchSuppliers();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete supplier');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Supplier Management</h1>
                    <p className="text-gray-500 mt-1">Manage your inventory suppliers, contacts, and products</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
                >
                    <Plus className="h-4 w-4" /> Add Supplier
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('suppliers')}
                    className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                        activeTab === 'suppliers'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Suppliers
                </button>
                <button
                    onClick={() => setActiveTab('products')}
                    className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 flex items-center gap-2 ${
                        activeTab === 'products'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <Package className="h-4 w-4" /> Products
                </button>
            </div>

            <Alert type="error" message={error} onClose={() => setError(null)} />

            {/* Suppliers Tab */}
            {activeTab === 'suppliers' && (
                loading ? (
                    <div className="p-8 text-center text-gray-500">Loading Suppliers...</div>
                ) : (
                    <SupplierList
                        suppliers={suppliers}
                        products={products}
                        onEdit={(s) => { setEditingSupplier(s); setShowForm(true); }}
                        onDelete={handleDelete}
                    />
                )
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
                <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                    {products.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No products found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">SKU</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Reorder Level</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Supplier</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {products.map(product => {
                                        const supplierInfo = suppliers.find(s => s._id === product.supplier);
                                        const statusColor = 
                                            product.status === 'InStock' ? 'bg-green-100 text-green-800' :
                                            product.status === 'LowStock' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800';

                                        return (
                                            <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                                                <td className="px-6 py-4 text-sm font-mono text-gray-600">{product.sku}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{product.category || '-'}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">${product.price}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{product.quantity}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{product.reorderLevel}</td>
                                                <td className="px-6 py-4 text-sm text-indigo-600 font-medium">{supplierInfo?.name || 'Unassigned'}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                                                        {product.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {(showForm || editingSupplier) && (
                <SupplierForm
                    supplier={editingSupplier}
                    onClose={() => { setShowForm(false); setEditingSupplier(null); }}
                    onSave={handleSaved}
                />
            )}
        </div>
    );
};

export default SupplierManagement;
