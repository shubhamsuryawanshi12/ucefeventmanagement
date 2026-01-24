'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
    LayoutDashboard,
    Calendar,
    Award,
    User,
    LogOut,
    PlusCircle,
    Users,
    BarChart3,
    CheckSquare
} from 'lucide-react'
import clsx from 'clsx'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, profile, loading, signOut } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login')
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="flex h-screen flex-col items-center justify-center space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Profile Not Found</h2>
                <p className="text-gray-500">Your account was created but your profile is missing.</p>
                <button
                    onClick={() => signOut()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Sign Out & Try Again
                </button>
            </div>
        )
    }

    const getNavItems = () => {
        const common = [
            { name: 'Profile', href: '/dashboard/profile', icon: User },
        ]

        switch (profile.role) {
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

    const navigation = getNavItems()

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex">
                {/* Sidebar */}
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
                                onClick={() => signOut()}
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
                <div className="md:pl-64 flex flex-col flex-1">
                    <main className="flex-1">
                        <div className="py-6">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
