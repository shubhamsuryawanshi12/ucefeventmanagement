'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { EventType, AttendanceMethod } from '@/types'

export async function createEvent(prevState: unknown, formData: FormData) {
    const supabase = await createClient()

    // Get current user (organizer)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const event_type = formData.get('event_type') as EventType
    const start_date = formData.get('start_date') as string
    const end_date = formData.get('end_date') as string
    const venue = formData.get('venue') as string
    const capacity = parseInt(formData.get('capacity') as string)
    const attendance_method = formData.get('attendance_method') as AttendanceMethod

    const { error } = await supabase
        .from('events')
        .insert({
            organizer_id: user.id,
            title,
            description,
            event_type,
            start_date,
            end_date,
            venue,
            capacity,
            attendance_method,
            stage: 'published', // Auto-publish for now, could be 'draft'
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/organizer')
    redirect('/dashboard/organizer')
}
