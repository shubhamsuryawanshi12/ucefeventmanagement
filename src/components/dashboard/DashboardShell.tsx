'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Calendar,
    Award,
    User,
    LogOut,
    PlusCircle,
    Users,
    BarChart3,
    CheckSquare,
    Menu,
    X
} from 'lucide-react'
import clsx from 'clsx'
import { createClient } from '@/lib/supabase/client'

// Navigation Mapping (Same as before)
const getNavItems = (role: string) => {
    const common = [
        { name: 'Profile', href: '/dashboard/profile', icon: User },
    ]

    switch (role) {
        case 'student':
            return [
                { name: 'My Dashboard', href: '/dashboard/student', icon: LayoutDashboard },
                { name: 'Browse Events', href: '/dashboard/events', icon: Calendar },
                { name: 'My Certificates', href: '/dashboard/student/certificates', icon: Award },
                ...common
            ]
        case 'organizer':
            return [
                { name: 'Organizer Dashboard', href: '/dashboard/organizer', icon: LayoutDashboard },
                { name: 'Create Event', href: '/dashboard/organizer/events/create', icon: PlusCircle },
                { name: 'My Events', href: '/dashboard/organizer/events', icon: Calendar },
                { name: 'Validate Attendance', href: '/dashboard/organizer/attendance', icon: CheckSquare },
                ...common
            ]
        case 'admin':
            return [
                { name: 'Admin Overview', href: '/dashboard/admin', icon: BarChart3 },
                { name: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
                { name: 'All Events', href: '/dashboard/admin/events', icon: Calendar },
                ...common
            ]
        default:
            return common
    }
}

export default function DashboardShell({
    children,
    profile
}: {
    children: React.ReactNode
    profile: any
}) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const signOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/auth/login')
    }

    const navigation = getNavItems(profile.role)

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="bg-indigo-900 text-white p-4 flex justify-between items-center md:hidden z-20 sticky top-0">
                <h1 className="text-xl font-bold tracking-wider">UCEF</h1>
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-1 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-800 focus:outline-none"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex md:hidden">
                    <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-75"
                        onClick={() => setSidebarOpen(false)}
                    ></div>

                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-800 transition-all transform ease-in-out duration-300">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <span className="sr-only">Close sidebar</span>
                                <X className="h-6 w-6 text-white" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                            <div className="flex-shrink-0 flex items-center px-4">
                                <h1 className="text-xl font-bold text-white tracking-wider">UCEF</h1>
                            </div>
                            <nav className="mt-5 px-2 space-y-1">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={clsx(
                                                isActive ? 'bg-indigo-900 text-white' : 'text-indigo-300 hover:bg-indigo-700 hover:text-white',
                                                'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                                            )}
                                        >
                                            <item.icon
                                                className={clsx(
                                                    isActive ? 'text-white' : 'text-indigo-400 group-hover:text-gray-300',
                                                    'mr-4 flex-shrink-0 h-6 w-6'
                                                )}
                                                aria-hidden="true"
                                            />
                                            {item.name}
                                        </Link>
                                    )
                                })}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 flex border-t border-indigo-700 p-4">
                            <button
                                onClick={signOut}
                                className="flex-shrink-0 group block w-full"
                            >
                                <div className="flex items-center">
                                    <div className="ml-3">
                                        <p className="text-base font-medium text-white group-hover:text-gray-200 flex items-center gap-2">
                                            <LogOut className="h-4 w-4" /> Sign Out
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                <div className="flex-1 flex flex-col min-h-0 bg-indigo-800">
                    <div className="flex items-center h-16 flex-shrink-0 px-4 bg-indigo-900">
                        <h1 className="text-xl font-bold text-white tracking-wider">UCEF</h1>
                    </div>
                    <div className="flex-1 flex flex-col overflow-y-auto">
                        <nav className="flex-1 px-2 py-4 space-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={clsx(
                                            isActive ? 'bg-indigo-900 text-white' : 'text-indigo-300 hover:bg-indigo-700 hover:text-white',
                                            'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                                        )}
                                    >
                                        <item.icon
                                            className={clsx(
                                                isActive ? 'text-white' : 'text-indigo-400 group-hover:text-gray-300',
                                                'mr-3 flex-shrink-0 h-6 w-6'
                                            )}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-indigo-700 p-4">
                        <button
                            onClick={signOut}
                            className="flex-shrink-0 w-full group block"
                        >
                            <div className="flex items-center">
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-white group-hover:text-gray-200 flex items-center gap-2">
                                        <LogOut className="h-4 w-4" /> Sign Out
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 bg-gray-100 md:pl-64">
                <main className="flex-1">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
