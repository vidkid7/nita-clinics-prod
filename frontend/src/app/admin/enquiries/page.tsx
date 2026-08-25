'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiArchive,
  FiClock,
  FiUser,
} from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import toast from 'react-hot-toast';
import { get, patch, PaginatedResponse, getErrorMessage } from '@/lib/api';

type EnquiryType = 'general' | 'appointment' | 'admission' | 'services' | 'feedback' | 'complaint';
type EnquiryStatus = 'new' | 'in_progress' | 'resolved' | 'closed';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: EnquiryType;
  subject: string;
  message: string;
  status: EnquiryStatus;
  response?: string;
  createdAt: string;
}

const statusColors: Record<EnquiryStatus, string> = {
  new: 'bg-primary-100 text-primary-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-neutral-100 text-neutral-600',
};

const typeColors: Record<EnquiryType, string> = {
  appointment: 'bg-primary-100 text-primary-700',
  services: 'bg-primary-100 text-primary-700',
  general: 'bg-neutral-100 text-neutral-700',
  feedback: 'bg-green-100 text-green-700',
  complaint: 'bg-red-100 text-red-700',
  admission: 'bg-primary-100 text-primary-700',
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | EnquiryStatus>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setIsLoading(true);
        // Call without query params to avoid potential errors
        const response = await get<PaginatedResponse<Enquiry>>('enquiries');
        setEnquiries(response.data);
      } catch (error) {
        console.error('Failed to load enquiries', error);
        toast.error(getErrorMessage(error) || 'Failed to load enquiries');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: enquiries.length,
    new: enquiries.filter((e) => e.status === 'new').length,
    resolved: enquiries.filter((e) => e.status === 'resolved').length,
    closed: enquiries.filter((e) => e.status === 'closed').length,
  };

  const updateStatus = async (id: string, newStatus: EnquiryStatus) => {
    try {
      await patch(`enquiries/${id}`, { status: newStatus });
      setEnquiries(enquiries.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
      toast.success(`Enquiry marked as ${newStatus}`);
    } catch (error) {
      console.error('Failed to update enquiry status', error);
      toast.error(getErrorMessage(error) || 'Failed to update enquiry status');
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedEnquiry) {
      toast.error('Please enter a reply message');
      return;
    }
    try {
      await patch(`enquiries/${selectedEnquiry.id}/respond`, { response: replyText });
      setEnquiries(enquiries.map((e) =>
        e.id === selectedEnquiry.id ? { ...e, status: 'resolved' as EnquiryStatus, response: replyText } : e
      ));
      toast.success('Reply sent successfully');
      setReplyText('');
      setViewModal(false);
    } catch (error) {
      console.error('Failed to send reply', error);
      toast.error(getErrorMessage(error) || 'Failed to send reply');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-neutral-900">Enquiries</h1>
        <p className="text-neutral-600 mt-1">Manage contact form submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-primary-500', filter: 'all' as const },
          { label: 'New', value: stats.new, color: 'bg-primary-500', filter: 'new' as const },
          { label: 'Resolved', value: stats.resolved, color: 'bg-green-500', filter: 'resolved' as const },
          { label: 'Closed', value: stats.closed, color: 'bg-neutral-400', filter: 'closed' as const },
        ].map((stat, index) => (
          <button
            key={index}
            onClick={() => setStatusFilter(stat.filter)}
            className={`bg-white rounded-xl p-4 shadow-soft text-left transition-all ${
              statusFilter === stat.filter ? 'ring-2 ring-primary-500' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${stat.color}`} />
              <span className="text-neutral-600 text-sm">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-soft p-4">
        <Input
          placeholder="Search by name, email, or subject..."
          leftIcon={<FiSearch className="w-5 h-5" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Enquiries List */}
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <div className="divide-y divide-neutral-100">
          {isLoading ? (
            <div className="p-8 text-center text-neutral-500">Loading enquiries...</div>
          ) : (
            filteredEnquiries.map((enquiry) => (
            <motion.div
              key={enquiry.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 hover:bg-neutral-50 transition-colors cursor-pointer ${
                enquiry.status === 'new' ? 'bg-primary-50/30' : ''
              }`}
              onClick={() => {
                setSelectedEnquiry(enquiry);
                setViewModal(true);
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiUser className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-neutral-900">{enquiry.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[enquiry.type]}`}>
                      {enquiry.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[enquiry.status]}`}>
                      {enquiry.status}
                    </span>
                  </div>
                  <p className="font-medium text-neutral-800 mt-1">{enquiry.subject}</p>
                  <p className="text-sm text-neutral-500 mt-1 line-clamp-1">{enquiry.message}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <FiMail className="w-3 h-3" />
                      {enquiry.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock className="w-3 h-3" />
                      {formatDate(enquiry.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {enquiry.status === 'new' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEnquiry(enquiry);
                        setViewModal(true);
                      }}
                      className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                      title="View & Reply"
                    >
                      <FiMessageSquare className="w-4 h-4" />
                    </button>
                  )}
                  {enquiry.status !== 'closed' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(enquiry.id, 'closed');
                      }}
                      className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg"
                      title="Close"
                    >
                      <FiArchive className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
            ))
          )}
        </div>

        {!isLoading && filteredEnquiries.length === 0 && (
          <div className="text-center py-12">
            <FiMessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">No enquiries found</p>
          </div>
        )}
      </div>

      {/* View/Reply Modal */}
      <Modal
        isOpen={viewModal}
        onClose={() => {
          setViewModal(false);
          setSelectedEnquiry(null);
          setReplyText('');
        }}
        title="Enquiry Details"
        size="lg"
      >
        {selectedEnquiry && (
          <div className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-500">Name</p>
                <p className="font-medium text-neutral-900">{selectedEnquiry.name}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Email</p>
                <p className="font-medium text-neutral-900">{selectedEnquiry.email}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Phone</p>
                <p className="font-medium text-neutral-900">{selectedEnquiry.phone}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Type</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[selectedEnquiry.type]}`}>
                  {selectedEnquiry.type}
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-neutral-500">Subject</p>
              <p className="font-medium text-neutral-900">{selectedEnquiry.subject}</p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-500">Message</p>
              <div className="bg-neutral-50 rounded-lg p-4 mt-1">
                <p className="text-neutral-700 whitespace-pre-wrap">{selectedEnquiry.message}</p>
              </div>
            </div>

            {selectedEnquiry.response && (
              <div className="pt-4 border-t">
                <p className="text-sm text-neutral-500 mb-2">Response</p>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-neutral-700 whitespace-pre-wrap">{selectedEnquiry.response}</p>
                </div>
              </div>
            )}

            {selectedEnquiry.status === 'new' && (
              <div className="pt-4 border-t">
                <Textarea
                  label="Reply"
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="ghost" onClick={() => setViewModal(false)}>
                Close
              </Button>
              {selectedEnquiry.status === 'new' && (
                <Button onClick={handleReply}>
                  <FiMail className="w-4 h-4 mr-2" />
                  Send Reply
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
