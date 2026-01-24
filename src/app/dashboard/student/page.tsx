import { createClient } from '@/lib/supabase/server'
import EventCard from '@/components/events/EventCard'
import NextLink from 'next/link'

export const dynamic = 'force-dynamic'

export default async function StudentDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>Please log in to view your dashboard.</div>
    }

    // Fetch participations with event details
    const { data: participations, error } = await supabase
        .from('participation')
        .select(`
            *,
            events (
                id,
                title,
                start_date,
                end_date,
                venue,
                stage,
                event_type,
                registration_count,
                capacity,
                banner_url
            )
        `)
        .eq('student_id', user.id)
        .order('registered_at', { ascending: false })

    if (error) {
        console.log('User ID:', user.id)
        console.error('Supabase Error Details:', JSON.stringify(error, null, 2))
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
                <h3 className="font-bold">Error loading dashboard</h3>
                <p>Could not fetch your events. Please try refreshing.</p>
                <pre className="text-xs mt-2 overflow-auto">{JSON.stringify(error, null, 2)}</pre>
            </div>
        )
    }

    const upcomingEvents = participations?.filter(p => p.events.stage !== 'completed' && p.events.stage !== 'archived') || []
    const pastEvents = participations?.filter(p => p.events.stage === 'completed' || p.events.stage === 'archived') || []

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Track your upcoming events and participation history.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Registered</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{participations?.length || 0}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Events Attended</dt>
                        <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                            {participations?.filter(p => p.status === 'attended' || p.status === 'certified').length || 0}
                        </dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Certified</dt>
                        <dd className="mt-1 text-3xl font-semibold text-green-600">
                            {participations?.filter(p => p.status === 'certified').length || 0}
                        </dd>
                    </div>
                </div>
            </div>

            {/* Upcoming Events */}
            <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">My Upcoming Events</h2>
                {upcomingEvents.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {upcomingEvents.map((p) => (
                            <div key={p.id} className="relative">
                                {/* Status Badge Overlay */}
                                <div className="absolute top-2 right-2 z-10">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize shadow-sm
                        ${p.status === 'registered' ? 'bg-blue-100 text-blue-800' :
                                            p.status === 'attended' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                        {p.status}
                                    </span>
                                </div>
                                <EventCard
                                    event={p.events}
                                    action={
                                        <NextLink
                                            href={`/dashboard/events/${p.events.id}`}
                                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                        >
                                            View Details &rarr;
                                        </NextLink>
                                    }
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <p className="text-gray-500">You have not registered for any upcoming events.</p>
                        <NextLink href="/dashboard/events" className="mt-2 inline-block text-indigo-600 hover:text-indigo-500 font-medium">
                            Browse available events &rarr;
                        </NextLink>
                    </div>
                )}
            </div>

            {/* Past Events */}
            {pastEvents.length > 0 && (
                <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4 text-gray-500">Participation History</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 opacity-75 grayscale hover:grayscale-0 transition-all">
                        {pastEvents.map((p) => (
                            <div key={p.id} className="relative">
                                <div className="absolute top-2 right-2 z-10">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize shadow-sm
                            ${p.status === 'certified' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'}`}>
                                        {p.status}
                                    </span>
                                </div>
                                <EventCard event={p.events} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
