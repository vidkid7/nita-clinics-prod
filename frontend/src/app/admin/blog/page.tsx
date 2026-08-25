'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiUser,
} from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { get, patch, del, PaginatedResponse, getErrorMessage } from '@/lib/api';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  isPublished: boolean;
  publishedAt?: string;
  views: number;
}

const statusColors: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-yellow-100 text-yellow-700',
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; post: BlogPost | null }>({
    open: false,
    post: null,
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        // Call without query params to avoid 400 error
        const response = await get<PaginatedResponse<BlogPost>>('blog/admin/list', {
          params: { limit: 100, sortBy: 'publishedAt', sortOrder: 'desc' },
        });
        setPosts(response.data ?? []);
      } catch (error) {
        console.error('Failed to load blog posts', error);
        toast.error(getErrorMessage(error) || 'Failed to load blog posts');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteModal.post) return;
    try {
      await del<void>(`blog/${deleteModal.post.id}`);
      setPosts(posts.filter((p) => p.id !== deleteModal.post!.id));
      toast.success('Post deleted successfully');
      setDeleteModal({ open: false, post: null });
    } catch (error) {
      console.error('Failed to delete post', error);
      toast.error(getErrorMessage(error) || 'Failed to delete post');
    }
  };

  const togglePublish = async (id: string, current: boolean) => {
    try {
      if (current) {
        await patch(`blog/${id}/unpublish`);
        setPosts(posts.map((p) => (p.id === id ? { ...p, isPublished: false } : p)));
        toast.success('Post unpublished');
      } else {
        await patch(`blog/${id}/publish`);
        setPosts(posts.map((p) => (p.id === id ? { ...p, isPublished: true, publishedAt: new Date().toISOString() } : p)));
        toast.success('Post published');
      }
    } catch (error) {
      console.error('Failed to update post status', error);
      toast.error(getErrorMessage(error) || 'Failed to update post status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Blog Posts</h1>
          <p className="text-neutral-600 mt-1">Manage blog articles and health education content</p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
            <FiPlus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-neutral-600 text-sm">Total Posts</p>
          <p className="text-2xl font-bold text-neutral-900">{posts.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-neutral-600 text-sm">Published</p>
          <p className="text-2xl font-bold text-green-600">
            {posts.filter((p) => p.isPublished).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-neutral-600 text-sm">Total Views</p>
          <p className="text-2xl font-bold text-primary-600">
            {posts.reduce((acc, p) => acc + p.views, 0)}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-soft p-4">
        <Input
          placeholder="Search posts..."
          leftIcon={<FiSearch className="w-5 h-5" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Post</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Author</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Views</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td className="px-6 py-8 text-center text-neutral-500" colSpan={6}>
                    Loading blog posts...
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-neutral-900 line-clamp-1">{post.title}</p>
                        <p className="text-sm text-neutral-500 line-clamp-1">{post.excerpt}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-700">{post.author}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-neutral-100 rounded text-sm text-neutral-600">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublish(post.id, post.isPublished)}
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          post.isPublished ? statusColors.published : statusColors.draft
                        }`}
                      >
                        {post.isPublished ? 'published' : 'draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-600">{post.views}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {post.isPublished && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <FiEye className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ open: true, post })}
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

        {!isLoading && filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-500">No posts found</p>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, post: null })}
        title="Delete Post"
      >
        <div className="p-6">
          <p className="text-neutral-600">
            Are you sure you want to delete "<strong>{deleteModal.post?.title}</strong>"?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setDeleteModal({ open: false, post: null })}>
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
