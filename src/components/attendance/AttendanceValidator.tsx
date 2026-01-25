'use client'

import { useActionState, useEffect, useRef } from 'react'
import { markAttendance, AttendanceState } from '@/app/dashboard/organizer/attendance/actions'
import { CheckCircle, AlertCircle, UserCheck } from 'lucide-react'

const initialState: AttendanceState = {
    error: undefined,
    success: undefined,
    timestamp: undefined
}

export default function AttendanceValidator({ events }: { events: any[] }) {
    const [state, formAction, isPending] = useActionState(markAttendance, initialState)
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if ((state as any)?.success) {
            // Clear email field on success
            const emailInput = formRef.current?.querySelector('input[name="email"]') as HTMLInputElement
            if (emailInput) emailInput.value = ''
            emailInput?.focus()
        }
    }, [state])

    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Mark Attendance
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Select an event and enter the student's email to mark them as present.</p>
                </div>

                <form ref={formRef} action={formAction} className="mt-5 sm:flex sm:items-center">
                    <div className="w-full sm:max-w-xs">
                        <label htmlFor="event_id" className="sr-only">
                            Event
                        </label>
                        <select
                            id="event_id"
                            name="event_id"
                            required
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                        >
                            <option value="">Select Event...</option>
                            {events.map(event => (
                                <option key={event.id} value={event.id}>
                                    {event.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full sm:max-w-xs sm:ml-3 mt-3 sm:mt-0">
                        <label htmlFor="email" className="sr-only">
                            Student Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                            placeholder="student@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                        {isPending ? 'Marking...' : 'Validate'}
                    </button>
                </form>

                {state?.error && (
                    <div className="mt-4 rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="shrink-0">
                                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{state.error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {(state as any)?.success && (
                    <div className="mt-4 rounded-md bg-green-50 p-4">
                        <div className="flex">
                            <div className="shrink-0">
                                <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">Success</h3>
                                <div className="mt-2 text-sm text-green-700">
                                    <p>{(state as any).success}</p>
                                    <p className="text-xs text-green-600 mt-1">{(state as any).timestamp}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
