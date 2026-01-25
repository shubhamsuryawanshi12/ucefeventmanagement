'use client'

import { useActionState } from 'react'
import { updateProfile, ProfileState } from '@/app/dashboard/profile/actions'
import { User, Mail, School, BookOpen, Phone, FileText } from 'lucide-react'

const initialState: ProfileState = {
    error: undefined,
    success: undefined
}

export default function ProfileForm({ profile }: { profile: any }) {
    const [state, formAction, isPending] = useActionState(updateProfile, initialState)

    return (
        <form action={formAction} className="space-y-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Update your public profile information.
                        </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <div className="grid grid-cols-6 gap-6">

                            <div className="col-span-6 sm:col-span-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address (Read only)
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                        <Mail className="h-4 w-4" />
                                    </span>
                                    <input
                                        type="text"
                                        name="email"
                                        id="email"
                                        disabled
                                        defaultValue={profile.email}
                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 bg-gray-100 cursor-not-allowed text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                        <User className="h-4 w-4" />
                                    </span>
                                    <input
                                        type="text"
                                        name="full_name"
                                        id="full_name"
                                        defaultValue={profile.full_name}
                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                        <Phone className="h-4 w-4" />
                                    </span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        defaultValue={profile.phone || ''}
                                        placeholder="+91 9876543210"
                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">
                                    Student/Employee ID
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                        <BookOpen className="h-4 w-4" />
                                    </span>
                                    <input
                                        type="text"
                                        name="student_id"
                                        id="student_id"
                                        defaultValue={profile.student_id || ''}
                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                                    Department
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                        <School className="h-4 w-4" />
                                    </span>
                                    <input
                                        type="text"
                                        name="department"
                                        id="department"
                                        defaultValue={profile.department || ''}
                                        placeholder="Computer Science"
                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="col-span-6">
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                                    Bio / About
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        rows={3}
                                        defaultValue={profile.bio || ''}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md text-gray-900"
                                        placeholder="Tell us a little about yourself..."
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {state?.error && (
                <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-700">{state.error}</p>
                </div>
            )}

            {(state as any)?.success && (
                <div className="rounded-md bg-green-50 p-4">
                    <p className="text-sm text-green-700">{(state as any).success}</p>
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isPending ? 'Saving...' : 'Save Profile'}
                </button>
            </div>
        </form>
    )
}
