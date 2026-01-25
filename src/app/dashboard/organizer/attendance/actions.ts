'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type AttendanceState = {
    error?: string
    success?: string
    timestamp?: string
}

export async function markAttendance(prevState: AttendanceState, formData: FormData): Promise<AttendanceState> {
    const supabase = await createClient()
    const event_id = formData.get('event_id') as string
    const email = formData.get('email') as string

    if (!event_id || !email) {
        return { error: 'Event and Email are required.' }
    }

    // 1. Find the Student Profile by Email
    const { data: student, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .ilike('email', email.trim()) // Case insensitive
        .single()

    if (profileError || !student) {
        return { error: 'Student with this email not found.' }
    }

    // 2. Mark as Attended (Upsert to handle walk-ins if we allow them, otherwise update)
    // For now, let's assume they must be registered. Or we can just insert?
    // Let's use Upsert to be safe - "Register + Attend" in one go.

    const { error: participationError } = await supabase
        .from('participation')
        .upsert({
            student_id: student.id,
            event_id: event_id,
            status: 'attended',
            attended_at: new Date().toISOString()
        }, { onConflict: 'student_id, event_id' })

    if (participationError) {
        return { error: participationError.message }
    }

    return {
        success: `Marked ${student.full_name} as Attended`,
        timestamp: new Date().toLocaleTimeString()
    }
}
