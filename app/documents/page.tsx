'use client'

import Link from 'next/link'
import ProtectedLayout from '@/components/layouts/protected-layout'

export default function DocumentsPage() {
  const documents = [
    { id: 1, name: 'NDA Agreement', status: 'Signed', progress: 100, daysLeft: '0' },
    { id: 2, name: 'Contract Review', status: 'Pending', progress: 50, daysLeft: '3' },
    { id: 3, name: 'Policy Document', status: 'In Progress', progress: 75, daysLeft: '2' }
  ]

  return (
    <ProtectedLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#37322f]">Documents</h1>
            <p className="text-[#37322f]/60">Monitor document status and signer progress</p>
          </div>
          <Link href="/documents/new" className="px-5 py-2.5 bg-[#37322f] text-white rounded-lg font-medium hover:bg-[#37322f]/90 transition-colors">
            New Document
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#37322f]/10 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f7f5f3] border-b border-[#37322f]/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#37322f]">Document Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#37322f]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#37322f]">Progress</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#37322f]">Time Left</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b border-[#37322f]/10 hover:bg-[#f7f5f3]/50 transition">
                  <td className="px-6 py-4 text-[#37322f] font-medium">{doc.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                      doc.status === 'Signed' ? 'bg-green-100 text-green-700' :
                      doc.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-24 bg-[#37322f]/10 rounded-full h-2">
                      <div className="bg-[#37322f] h-2 rounded-full transition-all" style={{ width: `${doc.progress}%` }}></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#37322f]/60">{doc.daysLeft} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedLayout>
  )
}
