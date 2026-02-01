'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LogOut, User, Calendar, Clock } from 'lucide-react'

export default function DashboardLayout({ children }) {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [mounted, setMounted] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        setMounted(true)
        const userData = localStorage.getItem('user')
        if (userData) {
            setUser(JSON.parse(userData))
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/')
    }

    const nav = [
        { label: 'Event Types', href: '/dashboard', icon: Link },
        { label: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
        { label: 'Availability', href: '/dashboard/availability', icon: Clock },
    ]

    // Prevent hydration mismatch
    if (!mounted) return null

    return (
        <div className="flex min-h-screen bg-gray-50 relative">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-40 px-4 h-16 flex items-center justify-between">
                <div className="font-bold text-lg">Cal.com</div>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    {mobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 border-r border-gray-200 bg-white fixed md:sticky top-0 h-screen flex flex-col z-50 transition-transform duration-200
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 border-b border-gray-200 hidden md:block">
                    <h2 className="text-xl font-bold tracking-tight text-black">Cal.com</h2>
                    <p className="text-xs text-gray-500 mt-1">Scheduling Made Easy</p>
                </div>

                <div className="p-6 border-b border-gray-200 md:hidden">
                    <h2 className="text-xl font-bold">Menu</h2>
                </div>

                <nav className="p-4 flex-1">
                    {nav.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${pathname === item.href
                                ? 'bg-gray-100 font-medium text-black'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {/* Simple icon logic if we want to be fancy, but labels are fine for now */}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    {/* User Profile */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 mb-2">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                            {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-black truncate">
                                {user?.name || user?.username || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
                {children}
            </main>
        </div>
    )
}
