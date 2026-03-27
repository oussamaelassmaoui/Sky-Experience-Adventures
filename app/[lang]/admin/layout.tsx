'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Plane,
    CalendarCheck,
    LogOut,
    Settings,
    Menu,
    X,
    User,
    MessageSquare,
    FileText,
    Users
} from 'lucide-react';

interface AdminUser {
    id: string;
    email: string;
    username: string;
    role: string;
}

export default function AdminLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = use(params);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    // Check authentication & load user info
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token && !pathname.includes('/login')) {
            router.push(`/${lang}/admin/login`);
        }
        const stored = localStorage.getItem('adminUser');
        if (stored) {
            try { setAdminUser(JSON.parse(stored)); } catch { /* ignore */ }
        }
    }, [pathname, lang, router]);

    // Handle resize for mobile responsiveness
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsMobile(true);
                setIsSidebarOpen(false);
            } else {
                setIsMobile(false);
                setIsSidebarOpen(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // If on login page, render without layout
    if (pathname.includes('/login')) {
        return <>{children}</>;
    }

    const isEditor = adminUser?.role === 'editor';

    const navigation = [
        { name: 'Dashboard', href: `/${lang}/admin`, icon: LayoutDashboard },
        { name: 'Flights', href: `/${lang}/admin/flights`, icon: Plane },
        { name: 'Reservations', href: `/${lang}/admin/reservations`, icon: CalendarCheck },
        { name: 'Reviews', href: `/${lang}/admin/reviews`, icon: MessageSquare },
        { name: 'Blog', href: `/${lang}/admin/blogs`, icon: FileText },
        // Hidden for editor role
        ...(!isEditor ? [{ name: 'Users', href: `/${lang}/admin/users`, icon: Users }] : []),
    ];

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push(`/${lang}/admin/login`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar Overlay for Mobile */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    bg-[#1a2632] text-white w-64 transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20 lg:hover:w-64'}
                    flex flex-col shadow-xl
                `}
                onMouseEnter={() => !isMobile && setIsSidebarOpen(true)}
                onMouseLeave={() => !isMobile && setIsSidebarOpen(false)}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-center border-b border-gray-700/50">
                    {isSidebarOpen ? (
                        <h1 className="text-xl font-bold bg-gradient-to-r from-[#C04000] to-orange-500 bg-clip-text text-transparent">
                            SKY ADMIN
                        </h1>
                    ) : (
                        <span className="font-bold text-[#C04000]">SA</span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                                    ${isActive
                                        ? 'bg-[#C04000] text-white shadow-lg shadow-orange-900/20'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }
                                `}
                            >
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={`whitespace-nowrap transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden group-hover:block'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / User */}
                <div className="p-4 border-t border-gray-700/50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                        <LogOut size={22} />
                        <span className={`whitespace-nowrap ${isSidebarOpen ? 'block' : 'hidden'}`}>
                            Logout
                        </span>
                    </button>

                    {isSidebarOpen && (
                        <div className="mt-4 flex items-center gap-3 px-2">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                                <User size={16} />
                            </div>
                            <div className="text-xs min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-white font-medium truncate">
                                        {adminUser?.username || 'Admin'}
                                    </span>
                                    <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${adminUser?.role === 'admin'
                                        ? 'bg-orange-500/20 text-orange-400'
                                        : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {adminUser?.role || 'admin'}
                                    </span>
                                </div>
                                <div className="text-gray-500 truncate">{adminUser?.email || ''}</div>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header (Mobile Only Toggle) */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="ml-4 font-bold text-gray-800">Sky Experience Admin</span>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

