'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function registerForEvent(prevState: unknown, formData: FormData) {
    const supabase = await createClient()

    const eventId = formData.get('eventId') as string

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Check if already registered
    const { data: existing } = await supabase
        .from('participation')
        .select('id')
        .eq('student_id', user.id)
        .eq('event_id', eventId)
        .single()

    if (existing) {
        return { error: 'You are already registered for this event.' }
    }

    const { error } = await supabase
        .from('participation')
        .insert({
            student_id: user.id,
            event_id: eventId,
            status: 'registered'
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/student')
    revalidatePath(`/dashboard/events/${eventId}`)
    return { success: true }
}
