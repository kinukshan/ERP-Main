import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, AlertOctagon, Plus } from 'lucide-react';
import api from '../services/api';
import Alert from '../components/Alert';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import StockUpdateModal from '../components/StockUpdateModal';
import NotificationsPanel from '../components/NotificationsPanel';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const InventoryDashboard = () => {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modals state
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [stockModalProduct, setStockModalProduct] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [productsRes, suppliersRes] = await Promise.all([
                api.get('/products'),
                api.get('/suppliers')
            ]);
            setProducts(productsRes.data);
            setSuppliers(suppliersRes.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleProductSaved = () => {
        setShowProductForm(false);
        setEditingProduct(null);
        fetchDashboardData();
    };

    const handleStockUpdated = () => {
        setStockModalProduct(null);
        fetchDashboardData();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchDashboardData();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    const stats = {
        total: products.length,
        inStock: products.filter(p => p.status === 'InStock').length,
        lowStock: products.filter(p => p.status === 'LowStock').length,
        outOfStock: products.filter(p => p.status === 'OutOfStock').length,
    };

    const chartData = {
        labels: ['In Stock', 'Low Stock', 'Out of Stock'],
        datasets: [
            {
                data: [stats.inStock, stats.lowStock, stats.outOfStock],
                backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
                borderWidth: 0,
            },
        ],
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Alert type="error" message={error} onClose={() => setError(null)} />

            <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Products" value={stats.total} icon={Package} color="bg-blue-500" />
                    <StatCard title="In Stock" value={stats.inStock} icon={Package} color="bg-emerald-500" />
                    <StatCard title="Low Stock" value={stats.lowStock} icon={AlertTriangle} color="bg-amber-500" />
                    <StatCard title="Out of Stock" value={stats.outOfStock} icon={AlertOctagon} color="bg-red-500" />
                </div>

                <div className="w-full md:w-1/3 bg-white p-4 rounded-xl shadow border border-gray-100 flex items-center justify-center">
                    <div className="h-48 w-48 relative">
                        {stats.total > 0 ? (
                            <Pie data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />
                        ) : (
                            <p className="text-gray-400 text-sm absolute inset-0 flex items-center justify-center">No Data</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Inventory Status</h2>
                        <button
                            onClick={() => setShowProductForm(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <Plus className="h-4 w-4" /> Add Product
                        </button>
                    </div>

                    <ProductList
                        products={products}
                        onEdit={(p) => { setEditingProduct(p); setShowProductForm(true); }}
                        onUpdateStock={(p) => setStockModalProduct(p)}
                        onDelete={handleDelete}
                    />
                </div>

                <div className="lg:col-span-1">
                    <NotificationsPanel />
                </div>
            </div>

            {(showProductForm || editingProduct) && (
                <ProductForm
                    product={editingProduct}
                    suppliers={suppliers}
                    onClose={() => { setShowProductForm(false); setEditingProduct(null); }}
                    onSave={handleProductSaved}
                />
            )}

            {stockModalProduct && (
                <StockUpdateModal
                    product={stockModalProduct}
                    onClose={() => setStockModalProduct(null)}
                    onUpdate={handleStockUpdated}
                />
            )}
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex items-center gap-4">
        <div className={`${color} p-3 rounded-lg text-white`}>
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

export default InventoryDashboard;
