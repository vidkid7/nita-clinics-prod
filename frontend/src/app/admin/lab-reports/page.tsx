'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiFile,
  FiChevronLeft,
  FiChevronRight,
  FiUpload,
  FiX,
} from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import toast from 'react-hot-toast';
import { get, post, patch, del, uploadFile, getErrorMessage, type PaginatedResponse } from '@/lib/api';

// ── Types ────────────────────────────────────────────────────────────────────

interface PatientListItem {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
}

interface LabReport {
  id: string;
  patientId: string;
  testName: string;
  reportDate: string;
  reportFileUrl?: string | null;
  reportFileName?: string | null;
  remarks?: string;
  isVerified: boolean;
  isVisibleToPatient: boolean;
  createdAt: string;
  updatedAt: string;
  patient?: PatientListItem | null;
}

interface PaginatedLabReports {
  data: LabReport[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface LabReportFormData {
  patientId: string;
  testName: string;
  reportDate: string;
  reportFileUrl: string;
  reportFileName: string;
  remarks: string;
}

const emptyForm: LabReportFormData = {
  patientId: '',
  testName: '',
  reportDate: new Date().toISOString().split('T')[0],
  reportFileUrl: '',
  reportFileName: '',
  remarks: '',
};

// ── Component ────────────────────────────────────────────────────────────────

export default function AdminLabReportsPage() {
  const [reports, setReports] = useState<LabReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingReport, setEditingReport] = useState<LabReport | null>(null);
  const [deletingReport, setDeletingReport] = useState<LabReport | null>(null);
  const [formData, setFormData] = useState<LabReportFormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [patientOptions, setPatientOptions] = useState<PatientListItem[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pendingReportFile, setPendingReportFile] = useState<File | null>(null);
  const reportFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // ── Fetch reports ──────────────────────────────────────────────────────────

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) {
        params.set('search', debouncedSearch);
      }
      const response = await get<PaginatedLabReports>(`lab-reports?${params}`);
      setReports(response.data ?? []);
      setTotalPages(response.totalPages ?? 1);
      setTotal(response.total ?? 0);
    } catch (error) {
      console.error('Failed to load lab reports', error);
      toast.error(getErrorMessage(error) || 'Failed to load lab reports');
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (!showFormModal) return;
    let cancelled = false;
    const er = editingReport;
    (async () => {
      try {
        setPatientsLoading(true);
        const res = await get<PaginatedResponse<PatientListItem>>('patients', {
          params: {
            limit: 100,
            page: 1,
            sortBy: 'fullName',
            sortOrder: 'asc',
          },
        });
        let list = res?.data ?? [];
        if (er?.patient && !list.some((p) => p.id === er.patientId)) {
          list = [
            {
              id: er.patient.id,
              fullName: er.patient.fullName,
              email: er.patient.email,
              phone: er.patient.phone,
            },
            ...list,
          ];
        } else if (er && !list.some((p) => p.id === er.patientId)) {
          list = [{ id: er.patientId, fullName: 'Current patient' }, ...list];
        }
        if (!cancelled) setPatientOptions(list);
      } catch {
        if (!cancelled) setPatientOptions([]);
      } finally {
        if (!cancelled) setPatientsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showFormModal, editingReport?.id]);

  // ── Create / Edit ──────────────────────────────────────────────────────────

  const resetReportFileInput = () => {
    setPendingReportFile(null);
    if (reportFileInputRef.current) {
      reportFileInputRef.current.value = '';
    }
  };

  const openCreateModal = () => {
    setEditingReport(null);
    setFormData(emptyForm);
    resetReportFileInput();
    setShowFormModal(true);
  };

  const openEditModal = (report: LabReport) => {
    setEditingReport(report);
    resetReportFileInput();
    setFormData({
      patientId: report.patientId,
      testName: report.testName,
      reportDate: report.reportDate?.split('T')[0] || '',
      reportFileUrl: report.reportFileUrl || '',
      reportFileName: report.reportFileName || '',
      remarks: report.remarks || '',
    });
    setShowFormModal(true);
  };

  const handleReportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPendingReportFile(null);
      return;
    }
    const isPdf = file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/');
    if (!isPdf && !isImage) {
      toast.error('Please upload a PDF or image file');
      e.target.value = '';
      setPendingReportFile(null);
      return;
    }
    const maxBytes = isPdf ? 25 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error(isPdf ? 'PDF must be 25MB or smaller' : 'Image must be 5MB or smaller');
      e.target.value = '';
      setPendingReportFile(null);
      return;
    }
    setPendingReportFile(file);
  };

  const handleFormSubmit = async () => {
    if (!formData.patientId.trim() || !formData.testName.trim()) {
      toast.error('Patient and test name are required');
      return;
    }

    setIsSaving(true);
    try {
      let reportFileUrl = formData.reportFileUrl.trim() || undefined;
      let reportFileName = formData.reportFileName.trim() || undefined;

      if (pendingReportFile) {
        toast.loading('Uploading to cloud storage…', { id: 'lab-report-upload' });
        const uploaded = await uploadFile(
          'media/upload',
          pendingReportFile,
          undefined,
          'lab-reports',
        );
        toast.dismiss('lab-report-upload');
        reportFileUrl = uploaded.url;
        reportFileName = uploaded.name || pendingReportFile.name;
      }

      const payload = {
        patientId: formData.patientId.trim(),
        testName: formData.testName.trim(),
        reportDate: formData.reportDate
          ? new Date(formData.reportDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        reportFileUrl,
        reportFileName,
        remarks: formData.remarks.trim() || undefined,
      };

      if (editingReport) {
        await patch(`lab-reports/${editingReport.id}`, payload);
        toast.success('Lab report updated successfully');
      } else {
        await post('lab-reports', payload);
        toast.success('Lab report created successfully');
      }
      setShowFormModal(false);
      setFormData(emptyForm);
      setEditingReport(null);
      resetReportFileInput();
      fetchReports();
    } catch (error) {
      toast.dismiss('lab-report-upload');
      console.error('Failed to save lab report', error);
      toast.error(getErrorMessage(error) || 'Failed to save lab report');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const openDeleteModal = (report: LabReport) => {
    setDeletingReport(report);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deletingReport) return;
    try {
      await del(`lab-reports/${deletingReport.id}`);
      toast.success('Lab report deleted successfully');
      setShowDeleteModal(false);
      setDeletingReport(null);
      fetchReports();
    } catch (error) {
      console.error('Failed to delete lab report', error);
      toast.error(getErrorMessage(error) || 'Failed to delete lab report');
    }
  };

  // ── Verify ─────────────────────────────────────────────────────────────────

  const handleVerify = async (report: LabReport) => {
    try {
      await patch(`lab-reports/${report.id}/verify`, {});
      toast.success('Report verified successfully');
      setReports((prev) =>
        prev.map((r) => (r.id === report.id ? { ...r, isVerified: true } : r))
      );
    } catch (error) {
      console.error('Failed to verify report', error);
      toast.error(getErrorMessage(error) || 'Failed to verify report');
    }
  };

  // ── Toggle visibility ─────────────────────────────────────────────────────

  const handleToggleVisibility = async (report: LabReport) => {
    try {
      await patch(`lab-reports/${report.id}/toggle-visibility`, {});
      toast.success(
        report.isVisibleToPatient
          ? 'Report hidden from patient'
          : 'Report visible to patient'
      );
      setReports((prev) =>
        prev.map((r) =>
          r.id === report.id
            ? { ...r, isVisibleToPatient: !r.isVisibleToPatient }
            : r
        )
      );
    } catch (error) {
      console.error('Failed to toggle visibility', error);
      toast.error(getErrorMessage(error) || 'Failed to toggle visibility');
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">
            Lab Reports
          </h1>
          <p className="text-neutral-600 mt-1">
            Manage patient lab reports ({total} total)
          </p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<FiPlus />} onClick={openCreateModal}>
          Add Report
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-soft p-4">
        <Input
          placeholder="Search by test name or patient name..."
          leftIcon={<FiSearch className="w-5 h-5" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="text-left px-4 py-3 font-medium text-neutral-600">
                  Test Name
                </th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">
                  Patient
                </th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">
                  Report Date
                </th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">
                  File
                </th>
                <th className="text-center px-4 py-3 font-medium text-neutral-600">
                  Verified
                </th>
                <th className="text-center px-4 py-3 font-medium text-neutral-600">
                  Visible
                </th>
                <th className="text-right px-4 py-3 font-medium text-neutral-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                    Loading lab reports...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                    {searchQuery
                      ? 'No lab reports match your search.'
                      : 'No lab reports found. Click "Add Report" to create one.'}
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-neutral-900">
                        {report.testName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      <span className="font-medium text-neutral-800 block">
                        {report.patient?.fullName ?? '—'}
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">{report.patientId}</span>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {formatDate(report.reportDate)}
                    </td>
                    <td className="px-4 py-3">
                      {report.reportFileUrl && report.reportFileName ? (
                        <a
                          href={report.reportFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 hover:underline"
                        >
                          <FiFile className="w-4 h-4" />
                          <span className="truncate max-w-[150px]">
                            {report.reportFileName}
                          </span>
                        </a>
                      ) : report.reportFileName ? (
                        <span className="text-neutral-500 text-xs">{report.reportFileName} (no link)</span>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {report.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <FiCheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => handleVerify(report)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
                        >
                          Verify
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleVisibility(report)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                          report.isVisibleToPatient
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                        }`}
                        title={
                          report.isVisibleToPatient
                            ? 'Click to hide from patient'
                            : 'Click to show to patient'
                        }
                      >
                        {report.isVisibleToPatient ? (
                          <>
                            <FiEye className="w-3 h-3" />
                            Visible
                          </>
                        ) : (
                          <>
                            <FiEyeOff className="w-3 h-3" />
                            Hidden
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(report)}
                          className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(report)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200">
            <p className="text-sm text-neutral-600">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<FiChevronLeft className="w-4 h-4" />}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<FiChevronRight className="w-4 h-4" />}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingReport(null);
          setFormData(emptyForm);
          resetReportFileInput();
        }}
        title={editingReport ? 'Edit Lab Report' : 'Add Lab Report'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Patient <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                value={formData.patientId}
                disabled={!!editingReport || patientsLoading}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, patientId: e.target.value }))
                }
                required
              >
                <option value="">
                  {patientsLoading ? 'Loading patients…' : 'Select a patient'}
                </option>
                {patientOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName}
                    {p.phone ? ` · ${p.phone}` : ''}
                  </option>
                ))}
              </select>
              {editingReport && (
                <p className="text-xs text-neutral-500 mt-1">Patient cannot be changed when editing.</p>
              )}
            </div>
            <Input
              label="Test Name"
              placeholder="Enter test name"
              value={formData.testName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, testName: e.target.value }))
              }
              required
            />
          </div>

          <Input
            label="Report Date"
            type="date"
            value={formData.reportDate}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, reportDate: e.target.value }))
            }
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Report file
            </label>
            <p className="text-xs text-neutral-500 mb-2">
              Upload a PDF or image — stored in Cloudinary (folder <code className="text-neutral-600">lab-reports</code>
              ). Optional for new reports; when editing, leave empty to keep the current file.
            </p>
            <input
              ref={reportFileInputRef}
              type="file"
              accept="application/pdf,.pdf,image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleReportFileChange}
            />
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                leftIcon={<FiUpload className="w-4 h-4" />}
                onClick={() => reportFileInputRef.current?.click()}
                disabled={isSaving}
              >
                {pendingReportFile ? 'Change file' : 'Choose file'}
              </Button>
              {pendingReportFile && (
                <button
                  type="button"
                  onClick={resetReportFileInput}
                  className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                  disabled={isSaving}
                >
                  <FiX className="w-4 h-4" /> Remove
                </button>
              )}
            </div>
            {pendingReportFile ? (
              <p className="text-sm text-neutral-700 mt-2">
                Selected: <span className="font-medium">{pendingReportFile.name}</span> (
                {(pendingReportFile.size / 1024).toFixed(1)} KB)
              </p>
            ) : editingReport && (formData.reportFileUrl || formData.reportFileName) ? (
              <p className="text-sm text-neutral-600 mt-2">
                Current file:{' '}
                {formData.reportFileUrl ? (
                  <a
                    href={formData.reportFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline font-medium"
                  >
                    {formData.reportFileName || 'Open report'}
                  </a>
                ) : (
                  <span>{formData.reportFileName || '—'}</span>
                )}
              </p>
            ) : !editingReport ? (
              <p className="text-sm text-neutral-400 mt-2">No file selected (optional)</p>
            ) : null}
          </div>

          <Textarea
            label="Remarks"
            placeholder="Any additional remarks..."
            value={formData.remarks}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, remarks: e.target.value }))
            }
            rows={3}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowFormModal(false);
                setEditingReport(null);
                setFormData(emptyForm);
                resetReportFileInput();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleFormSubmit}
              isLoading={isSaving}
            >
              {editingReport ? 'Update Report' : 'Create Report'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingReport(null);
        }}
        title="Delete Lab Report"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-neutral-600">
            Are you sure you want to delete the report{' '}
            <span className="font-medium text-neutral-900">
              {deletingReport?.testName}
            </span>{' '}
            for patient{' '}
            <span className="font-medium text-neutral-900">
              {deletingReport?.patientId}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowDeleteModal(false);
                setDeletingReport(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
