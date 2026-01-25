import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Calendar, MapPin, Users } from 'lucide-react'

export default async function MyEventsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', user.id)
        .order('start_date', { ascending: true })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
                    <p className="text-gray-500 mt-1">Manage all your hosted events</p>
                </div>
                <Link
                    href="/dashboard/organizer/events/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Create New Event
                </Link>
            </div>

            {(!events || events.length === 0) ? (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
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
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event: any) => (
                        <div key={event.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.stage === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {event.stage}
                                    </span>
                                    <span className="text-sm text-gray-500 capitalize">{event.event_type}</span>
                                </div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2 truncate">
                                    {event.title}
                                </h3>
                                <div className="space-y-2 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                        <p>{new Date(event.start_date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                        <p>{event.venue}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                        <p>{event.registration_count} / {event.capacity} Registered</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-4 sm:px-6">
                                <Link
                                    href={`/dashboard/organizer/events/${event.id}`}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Manage Event <span aria-hidden="true">&rarr;</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
