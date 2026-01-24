import { createClient } from '@/lib/supabase/server'
import EventCard from '@/components/events/EventCard'
import { Event } from '@/types'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
    const supabase = await createClient()

    const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .eq('stage', 'published') // Only show published events
        .order('start_date', { ascending: true })

    if (error) {
        return <div>Error loading events</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Upcoming Campus Events</h1>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(events as Event[]).map((event) => (
                    <div key={event.id} className="relative">
                        <EventCard
                            event={event}
                            action={
                                <Link
                                    href={`/dashboard/events/${event.id}`}
                                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    View Details & Register
                                </Link>
                            }
                        />
                    </div>
                ))}
            </div>

            {events?.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No upcoming events found.</p>
                </div>
            )}
        </div>
    )
}
