'use client'

import { useActionState } from 'react'
import { registerForEvent } from '@/app/dashboard/events/actions'
import { Ticket } from 'lucide-react'

// Match the return type of registerForEvent exactly
// or ensure registerForEvent handles nulls.
const initialState = {
    error: null as string | null,
    success: false
}

export default function RegisterButton({ eventId }: { eventId: string }) {
    const [state, formAction, isPending] = useActionState(registerForEvent, initialState)

    if (state?.success) {
        return (
            <div className="flex items-center justify-center p-4 bg-green-50 rounded-md border border-green-200">
                <Ticket className="h-6 w-6 text-green-600 mr-2" />
                <p className="text-lg font-medium text-green-800">You have successfully registered!</p>
            </div>
        )
    }

    return (
        <form action={formAction}>
            <input type="hidden" name="eventId" value={eventId} />
            {state?.error && (
                <div className="mb-4 rounded-md bg-red-50 p-4 text-center">
                    <p className="text-sm text-red-700">{state.error}</p>
                </div>
            )}
            <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
                {isPending ? 'Registering...' : 'Register Now'}
            </button>
        </form>
    )
}
