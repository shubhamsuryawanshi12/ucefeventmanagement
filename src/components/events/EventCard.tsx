import { Event } from '@/types'
import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'
import { format } from 'date-fns'

interface EventCardProps {
    event: Event
    action?: React.ReactNode
}

export default function EventCard({ event, action }: EventCardProps) {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
              ${event.event_type === 'hackathon' ? 'bg-purple-100 text-purple-800' :
                                event.event_type === 'workshop' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'}`}>
                            {event.event_type}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
              ${event.stage === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {event.stage.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                <div className="mt-4">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 group-hover:text-indigo-600 transition-colors">
                        <Link href={`/dashboard/events/${event.id}`} className="focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            {event.title}
                        </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {event.description}
                    </p>
                </div>

                <div className="mt-4 flex flex-col space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                        <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                        <span>
                            {format(new Date(event.start_date), 'MMM d, yyyy h:mm a')}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                        <span>{event.venue || 'TBA'}</span>
                    </div>
                    <div className="flex items-center">
                        <Users className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                        <span>{event.registration_count} / {event.capacity || '∞'} enrolled</span>
                    </div>
                </div>
            </div>
            {action && (
                <div className="bg-gray-50 px-4 py-4 sm:px-6 relative z-10">
                    {action}
                </div>
            )}
        </div>
    )
}
