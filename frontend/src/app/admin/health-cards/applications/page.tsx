'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { get, getErrorMessage, patch } from '@/lib/api';
import {
  X, FileText, Image as ImageIcon, ExternalLink, ShieldCheck, Download, Search,
} from 'lucide-react';

type DocumentType =
  | 'passport'
  | 'citizenship'
  | 'driving_license'
  | 'nmc_registration'
  | 'employee_id'
  | null;

const DOCUMENT_TYPE_LABEL: Record<string, string> = {
  passport: 'Passport',
  citizenship: 'Citizenship Certificate',
  driving_license: 'Driving License',
  nmc_registration: 'NMC Registration',
  employee_id: 'Employee ID',
};

const HOLDER_TYPE_LABEL: Record<string, string> = {
  doctor: 'Doctor',
  doctor_family: 'Doctor Family',
  partner_staff: 'Partner Staff',
  general_public: 'General Public',
};

const HOLDER_TYPE_TINT: Record<string, string> = {
  doctor: 'bg-sky-100 text-sky-800',
  doctor_family: 'bg-rose-100 text-rose-800',
  partner_staff: 'bg-emerald-100 text-emerald-800',
  general_public: 'bg-violet-100 text-violet-800',
};

type Application = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  holderType: 'doctor' | 'doctor_family' | 'partner_staff' | 'general_public';
  status: 'pending' | 'approved' | 'rejected';
  organization?: string;
  nmcRegistrationId?: string;
  relationWithDoctor?: string;
  documentType?: DocumentType;
  documentNumber?: string;
  documentFileName?: string;
  documentPath?: string;
  documentMimeType?: string;
  documentSizeBytes?: number;
  cardNumber?: string;
  rejectionReason?: string;
  createdAt: string;
};

/** Resolve a server-stored documentPath to a fully-qualified URL the browser can fetch. */
function resolveDocumentUrl(documentPath: string | undefined): string | null {
  if (!documentPath) return null;
  if (documentPath.startsWith('http://') || documentPath.startsWith('https://')) {
    return documentPath;
  }
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  // Strip the trailing /api/v1 if present so we hit the public static root
  const origin = apiBase.replace(/\/api\/v1\/?$/, '');
  return `${origin}${documentPath}`;
}

function formatBytes(bytes?: number): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function AdminHealthCardApplicationsPage() {
  const [rows, setRows] = useState<Application[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | Application['status']>('all');
  const [search, setSearch] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [viewing, setViewing] = useState<Application | null>(null);

  const load = async () => {
    try {
      const data = await get<Application[]>('health-card/applications/admin');
      setRows(data || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        const matchesStatus = statusFilter === 'all' || row.status === statusFilter;
        const text =
          `${row.fullName} ${row.phone} ${row.email ?? ''} ${row.documentNumber ?? ''}`.toLowerCase();
        return matchesStatus && text.includes(search.toLowerCase());
      }),
    [rows, search, statusFilter]
  );

  const approve = async (id: string) => {
    try {
      await patch(`health-card/applications/${id}/approve`, { status: 'approved' });
      toast.success('Application approved');
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const reject = async (id: string) => {
    try {
      await patch(`health-card/applications/${id}/reject`, {
        status: 'rejected',
        rejectionReason,
      });
      toast.success('Application rejected');
      setRejectingId(null);
      setRejectionReason('');
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const stats = useMemo(
    () => ({
      total: rows.length,
      pending: rows.filter((r) => r.status === 'pending').length,
      approved: rows.filter((r) => r.status === 'approved').length,
      rejected: rows.filter((r) => r.status === 'rejected').length,
    }),
    [rows]
  );

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">
            Health Card Applications
          </h1>
          <p className="text-neutral-600">
            Review uploaded identity documents, then approve or reject incoming applications.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-1 font-semibold">
            {stats.pending} pending
          </span>
          <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-1 font-semibold">
            {stats.approved} approved
          </span>
          <span className="rounded-full bg-red-100 text-red-800 px-2.5 py-1 font-semibold">
            {stats.rejected} rejected
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-4 grid md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, email, document no."
            className="w-full rounded-lg border border-neutral-300 pl-8 pr-3 py-2 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | Application['status'])}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          onClick={load}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border border-neutral-200">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-700">
            <tr>
              <th className="px-4 py-3 text-left">Applicant</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">ID Document</th>
              <th className="px-4 py-3 text-left">Applied</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-neutral-500">
                  No applications match the current filters.
                </td>
              </tr>
            )}
            {filtered.map((row) => {
              const docUrl = resolveDocumentUrl(row.documentPath);
              const isImage = row.documentMimeType?.startsWith('image/');
              return (
                <tr key={row.id} className="border-t border-neutral-100 align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutral-900">{row.fullName}</p>
                    <p className="text-xs text-neutral-500">{row.phone}</p>
                    {row.email && <p className="text-xs text-neutral-500">{row.email}</p>}
                    {row.organization && (
                      <p className="text-xs text-neutral-500">Org: {row.organization}</p>
                    )}
                    {row.nmcRegistrationId && (
                      <p className="text-xs text-neutral-500">NMC: {row.nmcRegistrationId}</p>
                    )}
                    {row.relationWithDoctor && (
                      <p className="text-xs text-neutral-500">
                        Relation: {row.relationWithDoctor}
                      </p>
                    )}
                    {row.cardNumber && (
                      <p className="text-xs text-green-700">Card: {row.cardNumber}</p>
                    )}
                    {row.rejectionReason && (
                      <p className="text-xs text-red-600">Reason: {row.rejectionReason}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        HOLDER_TYPE_TINT[row.holderType] ?? 'bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      {HOLDER_TYPE_LABEL[row.holderType] ?? row.holderType}
                    </span>
                  </td>
                  <td className="px-4 py-3 min-w-[180px]">
                    {row.documentType ? (
                      <div className="flex items-start gap-2">
                        {isImage && docUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={docUrl}
                            alt="Document"
                            className="w-12 h-12 object-cover rounded-md border border-neutral-200 cursor-pointer"
                            onClick={() => setViewing(row)}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-md bg-red-50 border border-red-200 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-red-500" />
                          </div>
                        )}
                        <div className="text-xs space-y-0.5 min-w-0">
                          <p className="font-medium text-neutral-800">
                            {DOCUMENT_TYPE_LABEL[row.documentType] ?? row.documentType}
                          </p>
                          {row.documentNumber && (
                            <p className="text-neutral-600 truncate">No. {row.documentNumber}</p>
                          )}
                          <p className="text-neutral-500">
                            {formatBytes(row.documentSizeBytes)}
                          </p>
                          {docUrl && (
                            <button
                              onClick={() => setViewing(row)}
                              className="text-primary-600 hover:underline inline-flex items-center gap-1"
                            >
                              View <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-400 italic">No document uploaded</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                        row.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : row.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-y-2 min-w-[160px]">
                    {row.status === 'pending' && (
                      <>
                        <button
                          className="btn-primary text-xs w-full"
                          onClick={() => approve(row.id)}
                        >
                          Approve
                        </button>
                        {rejectingId === row.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              className="w-full rounded-lg border border-neutral-300 px-2 py-1 text-xs"
                              placeholder="Rejection reason"
                            />
                            <button
                              className="btn-secondary text-xs w-full"
                              onClick={() => reject(row.id)}
                            >
                              Confirm Reject
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn-secondary text-xs w-full"
                            onClick={() => setRejectingId(row.id)}
                          >
                            Reject
                          </button>
                        )}
                      </>
                    )}
                    {row.status !== 'pending' && (
                      <span className="text-xs text-neutral-400 italic">No actions</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {viewing && (
        <DocumentViewerModal
          application={viewing}
          onClose={() => setViewing(null)}
        />
      )}
    </main>
  );
}

function DocumentViewerModal({
  application,
  onClose,
}: {
  application: Application;
  onClose: () => void;
}) {
  const docUrl = resolveDocumentUrl(application.documentPath);
  const isImage = application.documentMimeType?.startsWith('image/');
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="font-semibold text-neutral-900">Identity Document</h2>
            <p className="text-xs text-neutral-500">
              {application.fullName} ·{' '}
              {DOCUMENT_TYPE_LABEL[application.documentType ?? ''] ??
                application.documentType ??
                '—'}
              {application.documentNumber ? ` · No. ${application.documentNumber}` : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 bg-neutral-100 flex items-center justify-center min-h-[300px] max-h-[70vh] overflow-auto">
          {docUrl && isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={docUrl}
              alt={`${application.fullName}'s document`}
              className="max-h-[65vh] max-w-full object-contain rounded-md shadow"
            />
          ) : docUrl ? (
            <iframe
              src={docUrl}
              title="Document"
              className="w-full h-[65vh] rounded-md border bg-white"
            />
          ) : (
            <div className="text-center text-neutral-500">
              <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-neutral-300" />
              <p>No document on file for this application.</p>
            </div>
          )}
        </div>
        <div className="p-4 border-t flex items-center justify-between">
          <p className="text-xs text-neutral-500">
            {application.documentFileName} · {formatBytes(application.documentSizeBytes)}
          </p>
          {docUrl && (
            <a
              href={docUrl}
              download={application.documentFileName ?? 'document'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary-600 hover:underline"
            >
              <Download className="w-4 h-4" /> Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
