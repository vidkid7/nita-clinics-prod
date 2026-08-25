'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiFileText, FiDownload, FiSearch, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { get, PaginatedResponse } from '@/lib/api';

function sanitizeFilename(name: string): string {
  return name.replace(/[/\\?%*:|"<>]/g, '-').trim() || 'lab-report';
}

export default function PatientReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('patient_auth_token');
    if (!token) { router.push('/patients/login'); return; }
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const res = await get<PaginatedResponse<any>>('lab-reports/my-reports?limit=50');
      setReports(res.data || []);
    } catch { /* silent */ } finally { setIsLoading(false); }
  };

  const filtered = reports.filter((r) =>
    r.testName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = async (report: any) => {
    const url = report.reportFileUrl as string;
    if (!url) return;

    const fromName = report.reportFileName as string | undefined;
    const extGuess = url.split('?')[0].match(/\.(pdf|png|jpe?g|gif|webp)$/i);
    const ext = extGuess ? extGuess[0] : '.pdf';
    const defaultBase = sanitizeFilename(report.testName || 'report');
    const downloadName = fromName
      ? sanitizeFilename(fromName)
      : defaultBase.endsWith(ext)
        ? defaultBase
        : `${defaultBase}${ext}`;

    setDownloadingId(report.id);
    try {
      const response = await fetch(url, { mode: 'cors', credentials: 'omit' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = downloadName;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch {
      toast.error('Download blocked by browser. Try opening the link instead.');
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/patients/dashboard" className="text-sm text-primary-600 hover:underline flex items-center gap-1 mb-2">
            <FiArrowLeft /> Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold text-neutral-900">My Lab Reports</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="relative mb-6">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 w-full"
            placeholder="Search reports by test name..."
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-neutral-500">Loading reports...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <FiFileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">No reports found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((report: any) => (
              <div key={report.id} className="bg-white rounded-xl p-4 shadow-soft flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{report.testName}</p>
                    <p className="text-sm text-neutral-500">
                      Date: {report.reportDate}
                      {report.isVerified && <span className="ml-2 text-green-600"><FiCheckCircle className="inline w-3 h-3" /> Verified</span>}
                    </p>
                  </div>
                </div>
                {report.reportFileUrl ? (
                  <button
                    type="button"
                    onClick={() => handleDownload(report)}
                    disabled={downloadingId === report.id}
                    className="btn btn-primary btn-sm disabled:opacity-60"
                  >
                    <FiDownload className="mr-1" />
                    {downloadingId === report.id ? 'Saving…' : 'Download'}
                  </button>
                ) : (
                  <span className="text-xs text-neutral-400 px-3">Awaiting file</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
