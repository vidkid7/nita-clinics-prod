'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiArrowLeft, FiSave, FiUpload } from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { get, patch, getErrorMessage, uploadFile } from '@/lib/api';

const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().min(20, 'Excerpt must be at least 20 characters'),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  featuredImage: z.string().optional(),
  author: z.string().min(2, 'Author name is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
  isPublished: z.boolean().optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

const categories = [
  { value: 'Preventive Health', label: 'Preventive Health' },
  { value: 'Vaccination', label: 'Vaccination' },
  { value: 'Check-up', label: 'Check-up' },
  { value: 'Disease Awareness', label: 'Disease Awareness' },
  { value: 'Heart Health', label: 'Heart Health' },
  { value: 'General Medicine', label: 'General Medicine' },
  { value: 'Pediatrics', label: 'Pediatrics' },
  { value: "Women's Health", label: "Women's Health" },
  { value: 'Lab Services', label: 'Lab Services' },
];

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
  });

  const featuredImage = watch('featuredImage');
  const isPublished = watch('isPublished');

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;

      setIsLoadingPost(true);
      try {
        const post = await get<BlogPost>(`blog/${id}`);
        setValue('title', post.title);
        setValue('excerpt', post.excerpt);
        setValue('content', post.content);
        setValue('featuredImage', post.featuredImage || '');
        setValue('author', post.author);
        setValue('category', post.category);
        setValue('tags', post.tags?.join(', ') || '');
        setValue('isPublished', post.isPublished);
        if (post.featuredImage) {
          setImagePreview(post.featuredImage);
        }
      } catch (error) {
        console.error('Failed to load blog post', error);
        toast.error(getErrorMessage(error) || 'Failed to load blog post');
        router.push('/admin/blog');
      } finally {
        setIsLoadingPost(false);
      }
    };

    loadPost();
  }, [id, router, setValue]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadFile('media/upload', file);
      setValue('featuredImage', result.url);
      setImagePreview(result.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Failed to upload image', error);
      toast.error(getErrorMessage(error) || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: BlogFormData) => {
    setIsLoading(true);
    try {
      const tagsArray = data.tags
        ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [];

      await patch(`blog/${id}`, {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: data.featuredImage || undefined,
        author: data.author,
        category: data.category,
        tags: tagsArray,
        isPublished: data.isPublished || false,
      });

      toast.success('Blog post updated successfully');
      router.push('/admin/blog');
    } catch (error) {
      console.error('Failed to update blog post', error);
      toast.error(getErrorMessage(error) || 'Failed to update blog post');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog">
            <Button variant="ghost" size="sm">
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-neutral-900">Edit Blog Post</h1>
            <p className="text-neutral-600 mt-1">Update blog article content</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <Input
                label="Post Title"
                placeholder="Enter blog post title..."
                error={errors.title?.message}
                {...register('title')}
                required
              />
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <Textarea
                label="Excerpt"
                placeholder="Write a brief summary of the article..."
                rows={3}
                error={errors.excerpt?.message}
                {...register('excerpt')}
                required
                helperText="This will be shown in the blog listing and preview cards"
              />
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Write your blog post content here. You can use HTML tags for formatting..."
                rows={20}
                error={errors.content?.message}
                {...register('content')}
                required
                className="font-mono text-sm"
                helperText="You can use HTML tags for formatting. For example: <p>Paragraph</p>, <h2>Heading</h2>, <ul><li>List item</li></ul>, <strong>Bold</strong>, <em>Italic</em>"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Publish Settings */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Publish Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-700">Published</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isPublished}
                      onChange={(e) => setValue('isPublished', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <p className="text-xs text-neutral-500">
                  {isPublished
                    ? 'This post will be visible to the public'
                    : 'This post will be saved as a draft'}
                </p>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Featured Image</h3>
              <div className="space-y-4">
                {imagePreview || featuredImage ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-100">
                    <img
                      src={imagePreview || featuredImage || ''}
                      alt="Featured"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setValue('featuredImage', '');
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="aspect-video border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <FiUpload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                      <p className="text-sm text-neutral-500">No image uploaded</p>
                    </div>
                  </div>
                )}
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    disabled={isUploading}
                  >
                    <FiUpload className="w-4 h-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </label>
                {featuredImage && (
                  <Input
                    label="Image URL"
                    value={featuredImage}
                    onChange={(e) => setValue('featuredImage', e.target.value)}
                    helperText="Or paste image URL directly"
                  />
                )}
              </div>
            </div>

            {/* Author & Category */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Details</h3>
              <div className="space-y-4">
                <Input
                  label="Author"
                  placeholder="Dr. John Smith"
                  error={errors.author?.message}
                  {...register('author')}
                  required
                />
                <Select
                  label="Category"
                  options={categories}
                  placeholder="Select category"
                  error={errors.category?.message}
                  {...register('category')}
                  required
                />
                <Input
                  label="Tags (comma-separated)"
                  placeholder="health tips, preventive care, wellness"
                  error={errors.tags?.message}
                  {...register('tags')}
                  helperText="Separate tags with commas"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 bg-white rounded-xl shadow-soft p-6">
          <Link href="/admin/blog">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
          <Button type="submit" isLoading={isLoading}>
            <FiSave className="w-4 h-4 mr-2" />
            Update Post
          </Button>
        </div>
      </form>
    </div>
  );
}
