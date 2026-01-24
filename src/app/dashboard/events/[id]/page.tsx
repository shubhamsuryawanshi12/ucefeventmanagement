import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, Users, Ticket } from 'lucide-react'
import { format } from 'date-fns'
import RegisterButton from '@/components/events/RegisterButton'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EventDetailsPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    // 1. Fetch Event Details
    const { data: event, error } = await supabase
        .from('events')
        .select('*, profiles(full_name)')
        .eq('id', id)
        .single()

    if (error || !event) {
        notFound()
    }

    // 2. Check Participation Status
    const { data: { user } } = await supabase.auth.getUser()

    let isRegistered = false
    if (user) {
        const { data: participation } = await supabase
            .from('participation')
            .select('status')
            .eq('event_id', id)
            .eq('student_id', user.id)
            .single()

        if (participation) isRegistered = true
    }

    return (
        <div className="max-w-4xl mx-auto bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
                <div>
                    <h3 className="text-2xl leading-6 font-bold text-gray-900">
                        {event.title}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Organized by {event.profiles?.full_name}
                    </p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize
              ${event.event_type === 'hackathon' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'}`}>
                    {event.event_type}
                </span>
            </div>

            <div className="px-4 py-5 sm:p-6 space-y-6">
                {/* Meta Data */}
                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
                    <div className="flex items-center text-gray-700">
                        <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                        <span>Starts: <span className="font-semibold">{format(new Date(event.start_date), 'PPP p')}</span></span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <MapPin className="mr-2 h-5 w-5 text-gray-400" />
                        <span>Venue: <span className="font-semibold">{event.venue}</span></span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <Users className="mr-2 h-5 w-5 text-gray-400" />
                        <span>Capacity: <span className="font-semibold">{event.registration_count} / {event.capacity}</span></span>
                    </div>
                </div>

                <div className="prose max-w-none text-gray-700 border-t border-gray-100 pt-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">About this event</h4>
                    <p className="whitespace-pre-wrap">{event.description}</p>
                </div>

                {/* Action Section */}
                <div className="border-t border-gray-100 pt-6">
                    {!user ? (
                        <div className="text-center bg-yellow-50 p-4 rounded-md">
                            <p className="text-yellow-800">Please sign in to register for this event.</p>
                        </div>
                    ) : isRegistered ? (
                        <div className="flex items-center justify-center p-4 bg-green-50 rounded-md border border-green-200">
                            <Ticket className="h-6 w-6 text-green-600 mr-2" />
                            <p className="text-lg font-medium text-green-800">You are registered for this event!</p>
                        </div>
                    ) : (
                        <RegisterButton eventId={event.id} />
                    )}
                </div>
            </div>
        </div>
    )
}
