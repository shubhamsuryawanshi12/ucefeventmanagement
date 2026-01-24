'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function selfCheckIn(eventId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized', authenticated: false }

    // 1. Get current participation status
    const { data: participation, error: fetchError } = await supabase
        .from('participation')
        .select('id, status')
        .eq('event_id', eventId)
        .eq('student_id', user.id)
        .single()

    if (fetchError || !participation) {
        return { error: 'Not Registered. Please register for this event first.' }
    }

    if (participation.status === 'attended' || participation.status === 'certified') {
        return { message: 'Already Checked In', success: true } // Treated as success
    }

    // 2. Update status to 'attended'
    const { error: updateError } = await supabase
        .from('participation')
        .update({
            status: 'attended',
            attended_at: new Date().toISOString()
        })
        .eq('id', participation.id)

    if (updateError) {
        return { error: 'Failed to mark attendance. Please try again.' }
    }

    revalidatePath('/dashboard/student')
    return { success: true }
}
