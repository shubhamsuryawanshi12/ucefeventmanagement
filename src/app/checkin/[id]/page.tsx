'use client'

import { useEffect, useState, use } from 'react'
import { selfCheckIn } from '../actions'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
    params: Promise<{ id: string }>
}

export default function CheckInPage({ params }: PageProps) {
    // Unwrap params using React.use() or await depending on Next.js version. 
    // Since 'params' is a Promise in the latest Next.js 15 types, we treat it as such, 
    // but client components with async props are tricky. 
    // For safety in this specific setup, we'll use the 'use' hook pattern if available or basic state.
    // However, simpler pattern for client components receiving params:
    const { id } = use(params)

    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'unauth'>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        const performCheckIn = async () => {
            try {
                const result = await selfCheckIn(id)

                if (result.error) {
                    if (result.authenticated === false) {
                        setStatus('unauth')
                    } else {
                        setStatus('error')
                        setMessage(result.error)
                    }
                } else {
                    setStatus('success')
                    setMessage(result.message || 'Successfully Checked In!')
                }
            } catch {
                setStatus('error')
                setMessage('An unexpected error occurred.')
            }
        }

        performCheckIn()
    }, [id])

    if (status === 'unauth') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white shadow rounded-lg p-6 text-center">
                    <XCircle className="mx-auto h-12 w-12 text-red-500" />
                    <h2 className="mt-4 text-xl font-bold text-gray-900">Authentication Required</h2>
                    <p className="mt-2 text-gray-500">You need to sign in to check in for this event.</p>
                    <div className="mt-6">
                        <Link href={`/auth/login?next=/checkin/${id}`} className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white shadow rounded-lg p-8 text-center">
                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                        <h2 className="mt-4 text-xl font-medium text-gray-900">Verifying Attendance...</h2>
                        <p className="mt-2 text-gray-500">Please wait while we check you in.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <div className="rounded-full bg-green-100 p-3">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">Checked In!</h2>
                        <p className="mt-2 text-gray-600">{message}</p>
                        <div className="mt-6">
                            <Link href="/dashboard/student" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                Go to Dashboard &rarr;
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <div className="rounded-full bg-red-100 p-3">
                            <XCircle className="h-12 w-12 text-red-600" />
                        </div>
                        <h2 className="mt-4 text-xl font-bold text-gray-900">Check-in Failed</h2>
                        <p className="mt-2 text-gray-600">{message}</p>
                        <div className="mt-6">
                            <Link href="/dashboard/events" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                View Events &rarr;
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
