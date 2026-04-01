import React from 'react';
import { Edit2, Trash2, Mail, Phone, MapPin, Package, DollarSign, Layers } from 'lucide-react';

const SupplierList = ({ suppliers, products = [], onEdit, onDelete }) => {
    const getProductDetails = (productData) => {
        if (!productData) return null;
        // If productData is populated (has name, price), return it directly
        if (productData.name) return productData;
        // Otherwise, find it in the products array
        return products.find(p => p._id === productData);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'InStock':
                return 'bg-green-100 text-green-800';
            case 'LowStock':
                return 'bg-yellow-100 text-yellow-800';
            case 'OutOfStock':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (suppliers.length === 0) {
        return (
            <div className="bg-white p-8 rounded-xl shadow border border-gray-100 text-center">
                <p className="text-gray-500">No suppliers found. Add some to get started.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {suppliers.map(supplier => (
                <div key={supplier._id} className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                            {/* Supplier Header */}
                            <div className="flex justify-between items-start mb-5">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{supplier.name}</h3>
                                    <div className="space-y-2">
                                        {supplier.email && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                <a href={`mailto:${supplier.email}`} className="hover:text-indigo-600">{supplier.email}</a>
                                            </div>
                                        )}
                                        {supplier.contactNumber && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                <span>{supplier.contactNumber}</span>
                                            </div>
                                        )}
                                        {supplier.address && (
                                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                                <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                                                <span className="line-clamp-2">{supplier.address}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2 ml-4">
                                    <button onClick={() => onEdit(supplier)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => onDelete(supplier._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {supplier.notes && (
                                <div className="mb-4 pt-3 border-t border-gray-50">
                                    <p className="text-sm text-gray-600 italic">"{supplier.notes}"</p>
                                </div>
                            )}

                            {/* Products Section */}
                            <div className="mt-5 pt-5 border-t border-gray-50">
                                <div className="flex items-center gap-2 mb-4">
                                    <Package className="h-5 w-5 text-indigo-600" />
                                    <h4 className="font-bold text-gray-900 text-lg">Products ({(supplier.products?.length || 0) + (supplier.manualProducts?.length || 0)})</h4>
                                </div>

                                {(supplier.products && supplier.products.length > 0) || (supplier.manualProducts && supplier.manualProducts.length > 0) ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {/* System Products */}
                                        {supplier.products && supplier.products.map((item, idx) => {
                                            const product = getProductDetails(item.productId);
                                            if (!product) return null;
                                            
                                            return (
                                                <div key={`sys-${idx}`} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-indigo-300 transition-all">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <h5 className="font-bold text-gray-900 text-base mb-1">{product.name}</h5>
                                                        </div>
                                                        <div className="flex gap-4 ml-4">
                                                            <div className="text-right">
                                                                <p className="text-xs text-gray-600 font-semibold">Price</p>
                                                                <p className="text-lg font-bold text-emerald-600">${product.price}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xs text-gray-600 font-semibold">Quantity</p>
                                                                <p className="text-lg font-bold text-blue-600">{item.quantity} units</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Manual Products */}
                                        {supplier.manualProducts && supplier.manualProducts.map((item, idx) => (
                                            <div key={`manual-${idx}`} className="bg-white rounded-lg border border-indigo-300 p-4 hover:shadow-md transition-all">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h5 className="font-bold text-gray-900 text-base mb-1">{item.name}</h5>
                                                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Custom</span>
                                                    </div>
                                                    <div className="flex gap-4 ml-4">
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-600 font-semibold">Price</p>
                                                            <p className="text-lg font-bold text-emerald-600">${item.price}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-600 font-semibold">Quantity</p>
                                                            <p className="text-lg font-bold text-blue-600">{item.quantity} units</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-500 font-medium">No products assigned to this supplier</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

export default SupplierList;
