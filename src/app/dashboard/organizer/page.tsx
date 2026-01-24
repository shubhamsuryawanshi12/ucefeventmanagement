import { createClient } from '@/lib/supabase/server'
import EventCard from '@/components/events/EventCard'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function OrganizerDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div>Unauthorized</div>

    const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', user.id)
        .order('created_at', { ascending: false })

    if (error) return <div>Error loading events</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Organizer Dashboard</h1>
                <Link
                    href="/dashboard/organizer/events/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Create New Event
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {events && events.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
                        {events.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                action={
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">
                                            {event.registration_count} registered
                                        </span>
                                        <Link
                                            href={`/dashboard/organizer/events/${event.id}`}
                                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                        >
                                            Manage Event &rarr;
                                        </Link>
                                    </div>
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new event.</p>
                        <div className="mt-6">
                            <Link
                                href="/dashboard/organizer/events/create"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Create Event
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
