import React from 'react';
import { Edit2, RefreshCcw, Trash2 } from 'lucide-react';

const ProductList = ({ products, onEdit, onUpdateStock, onDelete }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const isOwner = user?.role === 'Owner';

    const getStatusColor = (status) => {
        switch (status) {
            case 'InStock': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'LowStock': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'OutOfStock': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (products.length === 0) {
        return (
            <div className="bg-white p-8 rounded-xl shadow border border-gray-100 text-center">
                <p className="text-gray-500">No products found. Add some to get started.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                    <div className="text-sm text-gray-500">{product.category}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{product.quantity}</div>
                                    <div className="text-xs text-gray-400">Reorder at: {product.reorderLevel}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(product.status)}`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => onUpdateStock(product)} className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg" title="Update Stock">
                                            <RefreshCcw className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => onEdit(product)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg" title="Edit Details">
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        {isOwner && (
                                            <button onClick={() => onDelete(product._id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg" title="Delete Product">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;
