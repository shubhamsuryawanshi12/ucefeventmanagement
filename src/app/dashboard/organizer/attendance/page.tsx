import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AttendanceValidator from '@/components/attendance/AttendanceValidator'

export default async function AttendancePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Fetch Events managed by this organizer
    const { data: events } = await supabase
        .from('events')
        .select('id, title')
        .eq('organizer_id', user.id)
        .order('start_date', { ascending: false })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Validate Attendance</h1>
                <p className="text-gray-500 mt-1">Select an event and enter student details to mark attendance manually.</p>
            </div>

            <AttendanceValidator events={events || []} />
        </div>
    )
}
