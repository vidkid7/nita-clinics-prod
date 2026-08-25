'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUpload,
  FiSearch,
  FiImage,
  FiVideo,
  FiFile,
  FiTrash2,
  FiCopy,
  FiX,
  FiGrid,
  FiList,
} from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { get, uploadFile, del, PaginatedResponse, getErrorMessage } from '@/lib/api';

type MediaType = 'image' | 'video' | 'document';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: MediaType;
  mimeType: string;
  size: number;
  createdAt: string;
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | MediaType>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        setIsLoading(true);
        // Call without query params to avoid validation errors
        const response = await get<PaginatedResponse<MediaItem>>('media');
        setMedia(response.data);
      } catch (error) {
        console.error('Failed to load media', error);
        toast.error(getErrorMessage(error) || 'Failed to load media');
      } finally {
        setIsLoading(false);
      }
    };
    loadMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter]);

  const filteredMedia = media.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    const errors: string[] = [];
    const successCount = { count: 0 };

    try {
      for (const file of Array.from(files)) {
        // Validate file size
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const maxSize = isImage ? 5 * 1024 * 1024 : 100 * 1024 * 1024; // 5MB for images, 100MB for videos
        const maxSizeLabel = isImage ? '5MB' : '100MB';

        if (file.size > maxSize) {
          errors.push(`${file.name} exceeds ${maxSizeLabel} limit`);
          continue;
        }

        try {
          const result = await uploadFile('media/upload', file);
          setMedia((prev) => [result as any as MediaItem, ...prev]);
          successCount.count++;
        } catch (error) {
          errors.push(`${file.name}: ${getErrorMessage(error)}`);
        }
      }

      if (successCount.count > 0) {
        toast.success(`${successCount.count} file(s) uploaded successfully`);
      }
      if (errors.length > 0) {
        errors.forEach(err => toast.error(err));
      }
    } catch (error) {
      console.error('Upload failed', error);
      toast.error(getErrorMessage(error) || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedMedia) return;
    try {
      await del<void>(`media/${selectedMedia.id}`);
      setMedia(media.filter((m) => m.id !== selectedMedia.id));
      toast.success('File deleted successfully');
      setDeleteModal(false);
      setSelectedMedia(null);
    } catch (error) {
      console.error('Failed to delete media', error);
      toast.error(getErrorMessage(error) || 'Failed to delete media');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <FiImage className="w-6 h-6" />;
      case 'video':
        return <FiVideo className="w-6 h-6" />;
      default:
        return <FiFile className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Media Library</h1>
          <p className="text-neutral-600 mt-1">Manage your images and videos</p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={handleUpload}
          />
          <Button onClick={() => fileInputRef.current?.click()} isLoading={uploading}>
            <FiUpload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-soft p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <Input
              placeholder="Search files..."
              leftIcon={<FiSearch className="w-5 h-5" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {(['all', 'image', 'video'] as Array<'all' | MediaType>).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    typeFilter === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex border border-neutral-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-neutral-100' : 'hover:bg-neutral-50'}`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-neutral-100' : 'hover:bg-neutral-50'}`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-500">Loading media...</p>
            </div>
          ) : (
            filteredMedia.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-soft overflow-hidden group"
            >
              <div
                className="aspect-square bg-neutral-100 relative cursor-pointer"
                onClick={() => setSelectedMedia(item)}
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : item.type === 'video' ? (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                    <FiVideo className="w-12 h-12 text-white/50" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiFile className="w-12 h-12 text-neutral-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyUrl(item.url);
                    }}
                    className="p-2 bg-white rounded-lg hover:bg-neutral-100"
                    title="Copy URL"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMedia(item);
                      setDeleteModal(true);
                    }}
                    className="p-2 bg-white rounded-lg hover:bg-red-50 text-red-600"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-neutral-900 truncate">{item.name}</p>
                <p className="text-xs text-neutral-500">{item.size}</p>
              </div>
            </motion.div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">File</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Type</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Size</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Uploaded</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td className="px-6 py-8 text-center text-neutral-500" colSpan={5}>
                    Loading media...
                  </td>
                </tr>
              ) : (
                filteredMedia.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.type === 'image' ? (
                            <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            getIcon(item.type)
                          )}
                        </div>
                        <span className="font-medium text-neutral-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-neutral-600">{item.type}</span>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{formatSize(item.size)}</td>
                    <td className="px-6 py-4 text-neutral-600">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => copyUrl(item.url)}
                        className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                        title="Copy URL"
                      >
                        <FiCopy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMedia(item);
                          setDeleteModal(true);
                        }}
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
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
      )}

      {!isLoading && filteredMedia.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-soft">
          <FiImage className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500">No media files found</p>
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {selectedMedia && !deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedMedia(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white"
              onClick={() => setSelectedMedia(null)}
            >
              <FiX className="w-8 h-8" />
            </button>
            <div
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === 'image' ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.name}
                  className="w-full max-h-[80vh] object-contain rounded-lg"
                />
              ) : selectedMedia.type === 'video' ? (
                <video
                  src={selectedMedia.url}
                  controls
                  className="w-full max-h-[80vh] rounded-lg"
                />
              ) : null}
              <div className="mt-4 text-center text-white">
                <p className="font-medium">{selectedMedia.name}</p>
                <p className="text-white/60 text-sm">{formatSize(selectedMedia.size)}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setSelectedMedia(null);
        }}
        title="Delete File"
      >
        <div className="p-6">
          <p className="text-neutral-600">
            Are you sure you want to delete <strong>{selectedMedia?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
