'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ProfileState = {
    error?: string
    success?: string
}

export async function updateProfile(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const full_name = formData.get('full_name') as string
    const department = formData.get('department') as string
    const student_id = formData.get('student_id') as string
    const phone = formData.get('phone') as string
    const bio = formData.get('bio') as string

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name,
            department,
            student_id,
            phone,
            bio,
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/profile')
    return { success: 'Profile updated successfully' }
}
