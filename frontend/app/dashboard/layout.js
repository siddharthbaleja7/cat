'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LogOut, User, Calendar, Clock, Link as LinkIcon } from 'lucide-react'

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

        { label: 'Event types', href: '/dashboard', icon: LinkIcon },
        { label: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
        { label: 'Availability', href: '/dashboard/availability', icon: Clock },
    ]


    // Prevent hydration mismatch
    if (!mounted) return null

    return (
        <div className="flex min-h-screen bg-background relative">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-[#101010] border-b border-[#2C2C2C] z-40 px-4 h-16 flex items-center justify-between text-white">
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
                w-[240px] border-r border-[#2C2C2C] bg-[#101010] fixed md:sticky top-0 h-screen flex flex-col z-50 transition-transform duration-200
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-4 flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">
                        C
                    </div>
                    <span className="font-semibold text-white">Siddharth B...</span>
                </div>

                <div className="px-2">
                    <button className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-400 hover:text-white rounded-md mb-6">
                        <span>Event types</span>
                    </button>

                    <nav className="space-y-0.5">
                        {nav.map(item => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? 'bg-[#1C1C1C] text-white'
                                        : 'text-[#878787] hover:bg-[#1C1C1C] hover:text-white'
                                        }`}
                                >
                                    <Icon size={16} strokeWidth={2} />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="mt-6 space-y-0.5">
                        <div className="px-3 py-2 text-sm font-medium text-[#878787] flex items-center justify-between cursor-pointer hover:text-white">
                            <span>Apps</span>
                            <span className="text-xs">▼</span>
                        </div>
                        <div className="px-3 py-2 text-sm font-medium text-[#878787] flex items-center gap-3 cursor-pointer hover:bg-[#1C1C1C] hover:text-white rounded-md">
                            <span className="w-4 h-4 text-center">⚡</span>
                            Workflows
                        </div>
                        <div className="px-3 py-2 text-sm font-medium text-[#878787] flex items-center gap-3 cursor-pointer hover:bg-[#1C1C1C] hover:text-white rounded-md">
                            <span className="w-4 h-4 text-center">📊</span>
                            Insights
                        </div>
                    </div>
                </div>

                <div className="flex-1" />

                {/* Bottom Section */}
                <div className="p-2 space-y-0.5 mb-4">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#878787] hover:bg-[#1C1C1C] hover:text-white rounded-md"
                    >
                        <span className="w-4 h-4">↗</span>
                        View public page
                    </Link>

                    <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#878787] hover:bg-[#1C1C1C] hover:text-white rounded-md cursor-pointer">
                        <span className="w-4 h-4">⚙️</span>
                        Settings
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
                {children}
            </main>
        </div>
    )
}
