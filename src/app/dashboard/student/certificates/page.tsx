import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CertificateList from '@/components/dashboard/CertificateList'

export default async function CertificatesPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Get Profile for Name
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

    // Get Certificates (Attended Events)
    const { data: certificates } = await supabase
        .from('participation')
        .select(`
            id,
            status,
            events (
                title,
                end_date
            )
        `)
        .eq('student_id', user.id)
        .in('status', ['attended', 'contributed', 'certified'])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
                <p className="text-gray-500 mt-1">Download certificates for events you have successfully attended.</p>
            </div>

            <CertificateList
                certificates={certificates || []}
                studentName={profile?.full_name || 'Student'}
            />
        </div>
    )
}
