import React, { useState } from 'react';
import { X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import api from '../services/api';
import Alert from './Alert';

const StockUpdateModal = ({ product, onClose, onUpdate }) => {
    const [updateType, setUpdateType] = useState('add'); // 'add', 'subtract', 'absolute'
    const [quantity, setQuantity] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        let finalQuantity = quantity;
        let isDelta = false;

        if (updateType === 'add') {
            finalQuantity = quantity;
            isDelta = true;
        } else if (updateType === 'subtract') {
            finalQuantity = -quantity;
            isDelta = true;
        }

        try {
            await api.patch(`/products/${product._id}/stock`, {
                quantity: finalQuantity,
                isDelta
            });
            onUpdate();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update stock');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full m-4">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">Update Stock: {product.name}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6">
                    <Alert type="error" message={error} onClose={() => setError(null)} />

                    <div className="bg-gray-50 rounded-lg p-4 mb-6 flex justify-between items-center border border-gray-200">
                        <span className="text-sm text-gray-600 font-medium">Current Stock</span>
                        <span className="text-2xl font-bold text-gray-900">{product.quantity}</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                className={`py-2 px-3 flex flex-col items-center justify-center rounded-lg border text-sm font-medium transition-colors ${updateType === 'add' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                onClick={() => setUpdateType('add')}
                            >
                                <ArrowUpCircle className="h-5 w-5 mb-1 text-emerald-500" />
                                Add
                            </button>
                            <button
                                type="button"
                                className={`py-2 px-3 flex flex-col items-center justify-center rounded-lg border text-sm font-medium transition-colors ${updateType === 'subtract' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                onClick={() => setUpdateType('subtract')}
                            >
                                <ArrowDownCircle className="h-5 w-5 mb-1 text-red-500" />
                                Remove
                            </button>
                            <button
                                type="button"
                                className={`py-2 px-3 flex flex-col items-center justify-center rounded-lg border text-sm font-medium transition-colors ${updateType === 'absolute' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                onClick={() => setUpdateType('absolute')}
                            >
                                <span className="text-lg font-bold mb-0.5 mt-[-2px]">=</span>
                                Set Exact
                            </button>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {updateType === 'absolute' ? 'New Total Quantity' : 'Quantity Change'}
                            </label>
                            <input
                                required
                                type="number"
                                min="0"
                                className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
                                {loading ? 'Updating...' : 'Confirm Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StockUpdateModal;
