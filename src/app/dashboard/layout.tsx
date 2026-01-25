import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile) {
        return (
            <div className="flex h-screen flex-col items-center justify-center space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Profile Not Found</h2>
                <p className="text-gray-500">Your account was created but your profile is missing.</p>
                <div className="text-gray-400 text-sm">Please clear your cookies or restart the browser.</div>
            </div>
        )
    }

    return (
        <DashboardShell profile={profile}>
            {children}
        </DashboardShell>
    )
}
