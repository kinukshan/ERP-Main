import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import api from '../services/api';
import CustomerModal from '../components/CustomerModal';
import CustomerFormModal from '../components/CustomerFormModal';

const ITEMS_PER_PAGE = 10;

export default function CustomerDashboard() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/customers');
            setCustomers(response.data);
        } catch {
            console.error('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    // Filter & Search Logic
    const filteredCustomers = useMemo(() => {
        if (!searchTerm) return customers;

        const term = searchTerm.toLowerCase();
        return customers.filter(c =>
            c.name.toLowerCase().includes(term) ||
            c.country.toLowerCase().includes(term) ||
            c.segment.toLowerCase() === term
        );
    }, [customers, searchTerm]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleCreateNew = () => {
        setEditingCustomer(null);
        setFormModalOpen(true);
    };

    const handleDelete = async (customer, e) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to permanently delete ${customer.name}?`)) {
            try {
                await api.delete(`/customers/${customer._id}`);
                setCustomers(prev => prev.filter(c => c._id !== customer._id));
            } catch (err) {
                alert('Failed to delete customer.');
            }
        }
    };

    const handleEdit = (customer, e) => {
        e.stopPropagation();
        setEditingCustomer(customer);
        setFormModalOpen(true);
    };

    const handleSaveCustomer = (savedCustomer, isEditing) => {
        if (isEditing) {
            setCustomers(prev => prev.map(c => c._id === savedCustomer._id ? savedCustomer : c).sort((a, b) => b.totalPurchaseAmount - a.totalPurchaseAmount));
        } else {
            setCustomers(prev => [savedCustomer, ...prev].sort((a, b) => b.totalPurchaseAmount - a.totalPurchaseAmount));
        }
        setFormModalOpen(false);
    };

    const getSegmentColor = (segment) => {
        switch (segment) {
            case 'Platinum': return 'bg-purple-100 text-purple-800';
            case 'Gold': return 'bg-amber-100 text-amber-800';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800">Customers</h2>
                    <p className="text-slate-500 mt-1">Manage and view all customer records</p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                    <Plus size={18} />
                    Add Customer
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by name, country, or segment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Country</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Segment</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Total Purchases</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedCustomers.length > 0 ? (
                            paginatedCustomers.map((customer) => (
                                <tr key={customer._id} className="border-b border-slate-200 hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                                    <td className="px-6 py-4 font-medium text-slate-900">{customer.name}</td>
                                    <td className="px-6 py-4 text-slate-600 text-sm">{customer.email}</td>
                                    <td className="px-6 py-4 text-slate-600 text-sm">{customer.country}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSegmentColor(customer.segment)}`}>
                                            {customer.segment}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-900">${customer.totalPurchaseAmount.toLocaleString()}</td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <button title="View" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            title="Edit"
                                            onClick={(e) => handleEdit(customer, e)}
                                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            title="Delete"
                                            onClick={(e) => handleDelete(customer, e)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No customers found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1.5 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}

            {/* Modals */}
            {selectedCustomer && (
                <CustomerModal
                    customer={selectedCustomer}
                    onClose={() => setSelectedCustomer(null)}
                />
            )}

            {formModalOpen && (
                <CustomerFormModal
                    customer={editingCustomer}
                    onClose={() => {
                        setFormModalOpen(false);
                        setEditingCustomer(null);
                    }}
                    onSave={handleSaveCustomer}
                />
            )}
        </div>
    );
}
