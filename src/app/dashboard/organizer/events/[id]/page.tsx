import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import QRCodeGenerator from '@/components/utils/QRCodeGenerator'
import { CheckCircle, Clock } from 'lucide-react'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function OrganizerEventManagePage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div>Unauthorized</div>

    // Fetch event details
    const { data: event } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .eq('organizer_id', user.id)
        .single()

    if (!event) notFound()

    // Fetch participants
    const { data: participants } = await supabase
        .from('participation')
        .select('*, profiles(full_name, email, student_id)')
        .eq('event_id', id)
        .order('registered_at', { ascending: true })

    const checkInUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkin/${event.id}`

    return (
        <div className="space-y-6">
            <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Manage: {event.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {event.address} • {new Date(event.start_date).toLocaleDateString()}
                    </p>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                    <Link
                        href={`/dashboard/organizer/events/${id}/edit`}
                        className="ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Edit Event
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column: Stats & QR */}
                <div className="space-y-6 lg:col-span-1">
                    {/* QR Code Card */}
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6 text-center">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">Event Check-in QR</h3>
                            <div className="mt-4 flex justify-center">
                                <QRCodeGenerator data={checkInUrl} />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                Show this code to attendees to mark their attendance.
                            </p>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Registration Stats</h3>
                            <dl className="grid grid-cols-1 gap-5 text-center">
                                <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5">
                                    <dt className="truncate text-sm font-medium text-gray-500">Registered</dt>
                                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{participants?.length || 0}</dd>
                                </div>
                                <div className="overflow-hidden rounded-lg bg-green-50 px-4 py-5">
                                    <dt className="truncate text-sm font-medium text-green-700">Attended</dt>
                                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-700">
                                        {participants?.filter((p: any) => p.status === 'attended' || p.status === 'certified').length || 0}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* Right Column: Participant List */}
                <div className="lg:col-span-2">
                    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">Participants</h3>
                        </div>
                        <ul role="list" className="divide-y divide-gray-200">
                            {participants?.map((participant: unknown) => {
                                const p = participant as any
                                return (
                                    <li key={p.id} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
                                        <div className="flex min-w-0 gap-x-4">
                                            <div className="min-w-0 flex-auto">
                                                <p className="text-sm font-semibold leading-6 text-gray-900">
                                                    {p.profiles?.full_name}
                                                </p>
                                                <p className="mt-1 flex text-xs leading-5 text-gray-500">
                                                    <a href={`mailto:${p.profiles?.email}`} className="relative truncate hover:underline">
                                                        {p.profiles?.email}
                                                    </a>
                                                    <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                                        {p.profiles?.student_id || 'No ID'}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-x-4">
                                            <div className="sm:flex sm:flex-col sm:items-end">
                                                <div className="flex items-center gap-1">
                                                    {p.status === 'registered' && <Clock className="h-4 w-4 text-blue-500" />}
                                                    {p.status === 'attended' && <CheckCircle className="h-4 w-4 text-green-500" />}
                                                    <p className="text-sm leading-6 text-gray-900 capitalize font-medium">{p.status}</p>
                                                </div>
                                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                                    Registered: {new Date(p.registered_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                            {participants?.length === 0 && (
                                <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
                                    No participants registered yet.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
