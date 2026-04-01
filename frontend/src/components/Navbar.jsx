import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, Users, Truck, LogOut, UserCircle, Settings } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/inventory', icon: Package, roles: ['Owner', 'User'] },
        { name: 'Suppliers', path: '/suppliers', icon: Truck, roles: ['Owner'] },
        { name: 'Users', path: '/users', icon: Users, roles: ['Owner'] },
        { name: 'Customers', path: '/customers', icon: UserCircle, roles: ['Owner', 'User'] },
        { name: 'Segments', path: '/segments', icon: Settings, roles: ['Owner'] },
    ];

    return (
        <nav className="bg-indigo-600 shadow-lg text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <Package className="h-8 w-8" />
                        <span className="font-bold text-xl tracking-tight">StockFlow MS</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex space-x-4">
                            {navItems.map((item) => {
                                if (!item.roles.includes(user?.role)) return null;
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-500'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-4 ml-4 pl-4 border-l border-indigo-400">
                            <span className="text-sm font-medium bg-indigo-800 px-3 py-1 rounded-full border border-indigo-400">
                                {user?.role}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1 text-sm font-medium text-indigo-100 hover:text-white hover:bg-indigo-500 px-3 py-2 rounded-md transition-colors"
                                title="Logout"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
