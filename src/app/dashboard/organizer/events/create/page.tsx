'use client'

import { useActionState } from 'react' // Changed from useFormState to useActionState as per React 19/Next 15
import { createEvent } from '../actions'

const initialState = {
    error: null as string | null,
}

export default function CreateEventPage() {
    const [state, formAction, isPending] = useActionState(createEvent, initialState)

    return (
        <div className="max-w-2xl mx-auto">
            <div className="md:flex md:items-center md:justify-between mb-6">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Create New Event
                    </h2>
                </div>
            </div>

            <form action={formAction} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

                    {/* Title */}
                    <div className="sm:col-span-6">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Event Title
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Type */}
                    <div className="sm:col-span-3">
                        <label htmlFor="event_type" className="block text-sm font-medium text-gray-700">
                            Event Type
                        </label>
                        <div className="mt-1">
                            <select
                                id="event_type"
                                name="event_type"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900"
                            >
                                <option value="workshop">Workshop</option>
                                <option value="hackathon">Hackathon</option>
                                <option value="seminar">Seminar</option>
                                <option value="cultural">Cultural</option>
                                <option value="sports">Sports</option>
                                <option value="tech_talk">Tech Talk</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Attendance Method */}
                    <div className="sm:col-span-3">
                        <label htmlFor="attendance_method" className="block text-sm font-medium text-gray-700">
                            Attendance Method
                        </label>
                        <div className="mt-1">
                            <select
                                id="attendance_method"
                                name="attendance_method"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900"
                            >
                                <option value="qr">QR Code Scan</option>
                                <option value="manual">Manual Check-in</option>
                                <option value="code">Secret Code</option>
                            </select>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="sm:col-span-3">
                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                            Start Date & Time
                        </label>
                        <div className="mt-1">
                            <input
                                type="datetime-local"
                                name="start_date"
                                id="start_date"
                                required
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                            End Date & Time
                        </label>
                        <div className="mt-1">
                            <input
                                type="datetime-local"
                                name="end_date"
                                id="end_date"
                                required
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Venue */}
                    <div className="sm:col-span-4">
                        <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
                            Venue
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="venue"
                                id="venue"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Capacity */}
                    <div className="sm:col-span-2">
                        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                            Capacity
                        </label>
                        <div className="mt-1">
                            <input
                                type="number"
                                name="capacity"
                                id="capacity"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900"
                            />
                        </div>
                    </div>
                </div>

                {state?.error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Error creating event
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{state.error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="button"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isPending ? 'Creating...' : 'Create Event'}
                    </button>
                </div>
            </form>
        </div>
    )
}
