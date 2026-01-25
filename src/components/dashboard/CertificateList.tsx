'use client'

import { generateCertificate } from '@/lib/certificate'
import { Award, Download, Calendar } from 'lucide-react'

interface CertificateProps {
    certificates: any[]
    studentName: string
}

export default function CertificateList({ certificates, studentName }: CertificateProps) {
    if (certificates.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <Award className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates yet</h3>
                <p className="mt-1 text-sm text-gray-500">Attend events to earn certificates.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
                <div key={cert.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="p-2 bg-indigo-100 rounded-full">
                                <Award className="h-6 w-6 text-indigo-600" />
                            </span>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                Verified
                            </span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2 truncate">
                            {cert.events.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                            <Calendar className="shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <p>{new Date(cert.events.end_date).toLocaleDateString('en-GB')}</p>
                        </div>
                        <button
                            onClick={() => generateCertificate(studentName, cert.events.title, cert.events.end_date, cert.id)}
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <Download className="-ml-1 mr-2 h-4 w-4" />
                            Download
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
