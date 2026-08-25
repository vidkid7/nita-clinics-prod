'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUpload,
  FiSearch,
  FiImage,
  FiVideo,
  FiTrash2,
  FiEdit,
  FiX,
  FiEye,
  FiEyeOff,
  FiGrid,
  FiList,
  FiFolder,
} from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import toast from 'react-hot-toast';
import { get, uploadFile, del, patch, PaginatedResponse, getErrorMessage } from '@/lib/api';

type MediaType = 'image' | 'video' | 'document';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: MediaType;
  mimeType: string;
  size: number;
  folder?: string;
  alt?: string;
  caption?: string;
  isActive?: boolean;
  category?: string;
  createdAt: string;
}

const categories = [
  { value: 'all', label: 'All Folders' },
];

export default function GalleryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [folderFilter, setFolderFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [previewModal, setPreviewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editForm, setEditForm] = useState({
    name: '',
    folder: '',
    alt: '',
    caption: '',
  });

  const loadMedia = async (folder?: string) => {
    try {
      setLoading(true);
      // Call without query params to avoid validation errors
      const response = await get<PaginatedResponse<MediaItem>>('media');
      setItems(response.data);
    } catch (error) {
      console.error('Failed to load media', error);
      toast.error(getErrorMessage(error) || 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const data = await get<string[]>('media/folders');
      setFolders(data);
    } catch (error) {
      console.error('Failed to load media folders', error);
      // non-critical
    }
  };

  useEffect(() => {
    loadMedia();
    loadFolders();
  }, []);

  useEffect(() => {
    loadMedia(folderFilter === 'all' ? undefined : folderFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderFilter]);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.caption || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = folderFilter === 'all' || item.folder === folderFilter;
    return matchesSearch && matchesFolder;
  });

  const stats = {
    total: items.length,
    images: items.filter((i) => i.type === 'image').length,
    videos: items.filter((i) => i.type === 'video').length,
    active: items.filter((i) => i.isActive !== false).length,
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const result = await uploadFile('media/upload', file);
        setItems((prev) => [result as any as MediaItem, ...prev]);
      }
      toast.success(`${files.length} file(s) uploaded successfully`);
      loadFolders();
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

  const openEditModal = (item: MediaItem) => {
    setSelectedItem(item);
    setEditForm({
      name: item.name,
      folder: item.folder || '',
      alt: item.alt || '',
      caption: item.caption || '',
    });
    setEditModal(true);
  };

  const handleEdit = async () => {
    if (!selectedItem) return;
    try {
      const updated = await patch<MediaItem, Partial<MediaItem>>(`media/${selectedItem.id}`, {
        alt: editForm.alt,
        caption: editForm.caption,
      });
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      toast.success('Media item updated');
      setEditModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Failed to update media', error);
      toast.error(getErrorMessage(error) || 'Failed to update media');
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await del<void>(`media/${selectedItem.id}`);
      setItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
      toast.success('Media item deleted');
      setDeleteModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Failed to delete media', error);
      toast.error(getErrorMessage(error) || 'Failed to delete media');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Gallery Management</h1>
          <p className="text-neutral-600 mt-1">Manage photos and videos for the website gallery</p>
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Items', value: stats.total, icon: FiFolder, color: 'bg-primary-500' },
          { label: 'Images', value: stats.images, icon: FiImage, color: 'bg-primary-500' },
          { label: 'Videos', value: stats.videos, icon: FiVideo, color: 'bg-primary-500' },
          { label: 'Active', value: stats.active, icon: FiEye, color: 'bg-green-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-soft">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-neutral-600 text-sm">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-neutral-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-soft p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <Input
              placeholder="Search gallery..."
              leftIcon={<FiSearch className="w-5 h-5" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <Select
              options={[
                { value: 'all', label: 'All Folders' },
                ...folders.map((f) => ({ value: f, label: f })),
              ]}
              value={folderFilter}
              onChange={(e) => setFolderFilter(e.target.value)}
              className="w-40"
            />
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

      {/* Gallery Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(loading ? [] : filteredItems).map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-white rounded-xl shadow-soft overflow-hidden group ${
                !item.isActive ? 'opacity-60' : ''
              }`}
            >
              <div
                className="aspect-square bg-neutral-100 relative cursor-pointer"
                onClick={() => {
                  setSelectedItem(item);
                  setPreviewModal(true);
                }}
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                    <FiVideo className="w-12 h-12 text-white/50" />
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // no active toggle in backend; could be extended later
                    }}
                    className={`p-2 rounded-lg ${
                      'bg-white text-neutral-700'
                    }`}
                    title={item.isActive ? 'Hide from gallery' : 'Show in gallery'}
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(item);
                    }}
                    className="p-2 bg-white rounded-lg hover:bg-neutral-100"
                    title="Edit"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(item);
                      setDeleteModal(true);
                    }}
                    className="p-2 bg-white rounded-lg hover:bg-red-50 text-red-600"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Type Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.type === 'image'
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-primary-100 text-primary-700'
                  }`}>
                    {item.type}
                  </span>
                </div>

                {/* Folder Badge */}
                {item.folder && (
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-neutral-800/80 text-white rounded-full text-xs">
                      {item.folder}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-neutral-900 truncate">{item.name}</p>
                <p className="text-xs text-neutral-500 truncate">{item.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Item</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Type</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Date</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {(loading ? [] : filteredItems).map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden">
                        {item.type === 'image' ? (
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                            <FiVideo className="w-5 h-5 text-white/50" />
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-neutral-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      item.type === 'image'
                        ? 'bg-primary-100 text-primary-700'
                        : item.type === 'video'
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{item.folder || '-'}</td>
                  <td className="px-6 py-4 text-neutral-600">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setPreviewModal(true);
                        }}
                        className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                        title="Preview"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                        title="Edit"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-soft">
          <FiImage className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500">No gallery items found</p>
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {previewModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => {
              setPreviewModal(false);
              setSelectedItem(null);
            }}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
              onClick={() => {
                setPreviewModal(false);
                setSelectedItem(null);
              }}
            >
              <FiX className="w-8 h-8" />
            </button>
            <div
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'image' ? (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.name}
                  className="w-full max-h-[80vh] object-contain rounded-lg"
                />
              ) : (
                <video
                  src={selectedItem.url}
                  controls
                  className="w-full max-h-[80vh] rounded-lg"
                />
              )}
              <div className="mt-4 text-center text-white">
                <p className="font-medium">{selectedItem.name}</p>
                <p className="text-white/60 text-sm capitalize">{selectedItem.category}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal}
        onClose={() => {
          setEditModal(false);
          setSelectedItem(null);
        }}
        title="Edit Gallery Item"
      >
        <div className="p-6 space-y-4">
          <Input
            label="Name"
            value={editForm.name}
            disabled
          />
          <Input
            label="Folder"
            value={editForm.folder}
            disabled
          />
          <Input
            label="Alt Text"
            value={editForm.alt}
            onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
          />
          <Input
            label="Caption"
            value={editForm.caption}
            onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setSelectedItem(null);
        }}
        title="Delete Gallery Item"
      >
        <div className="p-6">
          <p className="text-neutral-600">
            Are you sure you want to delete <strong>{selectedItem?.name}</strong>?
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
