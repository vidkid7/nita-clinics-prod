'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiEdit,
  FiEye,
  FiSearch,
  FiFileText,
  FiHome,
  FiInfo,
  FiUsers,
  FiBriefcase,
  FiPhone,
  FiImage,
  FiBook,
  FiStar,
} from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import toast from 'react-hot-toast';
import { get, put, getErrorMessage } from '@/lib/api';

type KnownPageSlug =
  | '/'
  | '/about'
  | '/services'
  | '/specialists'
  | '/team'
  | '/health-card'
  | '/gallery'
  | '/blog'
  | '/contact';

interface PageDefinition {
  id: string;
  name: string;
  slug: KnownPageSlug;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface PageSection {
  id: string;
  pageSlug: string;
  sectionKey: string;
  title?: string;
  subtitle?: string;
  content?: string | Record<string, any>;
  seo?: { title?: string; description?: string };
  metadata?: Record<string, any>;
}

const pageDefinitions: PageDefinition[] = [
  {
    id: 'home',
    name: 'Home Page',
    slug: '/',
    icon: FiHome,
    description: 'Main landing page with hero, services, doctors, and testimonials',
  },
  {
    id: 'about',
    name: 'About Us',
    slug: '/about',
    icon: FiInfo,
    description: 'Clinic background, mission, and care approach',
  },
  {
    id: 'services',
    name: 'Services',
    slug: '/services',
    icon: FiBriefcase,
    description: 'List of clinical and lab services offered',
  },
  {
    id: 'specialists',
    name: 'Our Specialists',
    slug: '/specialists',
    icon: FiUsers,
    description: 'Specialist profiles and expertise areas',
  },
  {
    id: 'team',
    name: 'Team Members',
    slug: '/team',
    icon: FiFileText,
    description: 'Clinical and administrative team directory',
  },
  {
    id: 'health-card',
    name: 'Health Card',
    slug: '/health-card',
    icon: FiStar,
    description: 'Health card categories, benefits, and pricing',
  },
  {
    id: 'gallery',
    name: 'Gallery',
    slug: '/gallery',
    icon: FiImage,
    description: 'Photo and video gallery of the clinic',
  },
  {
    id: 'blog',
    name: 'Blog',
    slug: '/blog',
    icon: FiBook,
    description: 'Health knowledge hub and articles',
  },
  {
    id: 'contact',
    name: 'Contact Us',
    slug: '/contact',
    icon: FiPhone,
    description: 'Contact information and enquiry form',
  },
];

type EditableSectionKeys = 'seo' | 'hero';

interface PageEditState {
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
}

export default function PagesPage() {
  const [availablePageSlugs, setAvailablePageSlugs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; page: PageDefinition | null }>({
    open: false,
    page: null,
  });
  const [pageContent, setPageContent] = useState<PageEditState>({
    metaTitle: '',
    metaDescription: '',
    heroTitle: '',
    heroSubtitle: '',
  });

  // Load which pages have any content defined
  useEffect(() => {
    const loadPages = async () => {
      try {
        const slugs = await get<string[]>('content/pages');
        setAvailablePageSlugs(slugs);
      } catch (error) {
        console.error('Failed to load content pages', error);
        // not critical – pages are still shown from definitions
      }
    };
    loadPages();
  }, []);

  const filteredPages = pageDefinitions.filter(
    (page) =>
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const loadPageSections = async (page: PageDefinition) => {
    try {
      setIsLoading(true);
      const sections = await get<PageSection[]>(`content/page${page.slug === '/' ? '/home' : page.slug.slice(1)}`);

      const seoSection = sections.find((s) => s.sectionKey === 'seo');
      const heroSection = sections.find((s) => s.sectionKey === 'hero');

      setPageContent({
        metaTitle: seoSection?.seo?.title || (seoSection?.metadata as any)?.metaTitle || `${page.name} | Nita Clinic`,
        metaDescription:
          seoSection?.seo?.description || (seoSection?.metadata as any)?.metaDescription || page.description,
        heroTitle: (heroSection?.content as any)?.title || heroSection?.title || page.name,
        heroSubtitle: (heroSection?.content as any)?.subtitle || heroSection?.subtitle || page.description,
      });
    } catch (error) {
      console.error('Failed to load page content', error);
      // Fallback to defaults if none exist
      setPageContent({
        metaTitle: `${page.name} | Nita Clinic`,
        metaDescription: page.description,
        heroTitle: page.name,
        heroSubtitle: page.description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = async (page: PageDefinition) => {
    await loadPageSections(page);
    setEditModal({ open: true, page });
  };

  const saveSection = async (
    page: PageDefinition,
    sectionKey: EditableSectionKeys,
    payload: Partial<PageSection> & { metadata?: Record<string, any> },
  ) => {
    const slugKey = page.slug === '/' ? 'home' : page.slug.slice(1);
    await put(`content/page/${slugKey}/${sectionKey}`, payload);
  };

  const handleSave = async () => {
    if (!editModal.page) return;
    try {
      setIsLoading(true);

      // Save SEO section
      await saveSection(editModal.page, 'seo', {
        seo: {
          title: pageContent.metaTitle,
          description: pageContent.metaDescription,
        },
      });

      // Save hero section
      await saveSection(editModal.page, 'hero', {
        content: {
          title: pageContent.heroTitle,
          subtitle: pageContent.heroSubtitle,
        },
      });

      toast.success('Page content updated successfully');
      if (!availablePageSlugs.includes(editModal.page.slug)) {
        setAvailablePageSlugs((prev) => [...prev, editModal.page!.slug]);
      }
      setEditModal({ open: false, page: null });
    } catch (error) {
      console.error('Failed to save page content', error);
      toast.error(getErrorMessage(error) || 'Failed to save page content');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-neutral-900">Pages</h1>
        <p className="text-neutral-600 mt-1">Manage website pages and their content</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-soft p-4">
        <Input
          placeholder="Search pages..."
          leftIcon={<FiSearch className="w-5 h-5" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Pages Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPages.map((page) => (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-soft p-6 hover:shadow-card transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <page.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-neutral-900">{page.name}</h3>
                  <p className="text-sm text-primary-600">{page.slug}</p>
                </div>
              </div>
            </div>

            <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{page.description}</p>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <span className="text-xs text-neutral-400">
                {availablePageSlugs.includes(page.slug)
                  ? 'Content stored in CMS'
                  : 'Using default content'}
              </span>
              <div className="flex gap-2">
                <a
                  href={page.slug}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="View Page"
                >
                  <FiEye className="w-4 h-4" />
                </a>
                <button
                  onClick={() => openEditModal(page)}
                  className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Edit Page"
                >
                  <FiEdit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPages.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-soft">
          <FiFileText className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500">No pages found</p>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, page: null })}
        title={`Edit ${editModal.page?.name || 'Page'}`}
        size="lg"
      >
        <div className="p-6 space-y-6">
          {/* SEO Settings */}
          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-3">SEO Settings</h3>
            <div className="space-y-4">
              <Input
                label="Meta Title"
                value={pageContent.metaTitle}
                onChange={(e) => setPageContent({ ...pageContent, metaTitle: e.target.value })}
                helperText="Recommended: 50-60 characters"
              />
              <Textarea
                label="Meta Description"
                value={pageContent.metaDescription}
                onChange={(e) => setPageContent({ ...pageContent, metaDescription: e.target.value })}
                rows={2}
                helperText="Recommended: 150-160 characters"
              />
            </div>
          </div>

          {/* Hero Section */}
          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-3">Hero Section</h3>
            <div className="space-y-4">
              <Input
                label="Hero Title"
                value={pageContent.heroTitle}
                onChange={(e) => setPageContent({ ...pageContent, heroTitle: e.target.value })}
              />
              <Textarea
                label="Hero Subtitle"
                value={pageContent.heroSubtitle}
                onChange={(e) => setPageContent({ ...pageContent, heroSubtitle: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          {/* Page Info */}
          {editModal.page && (
            <div>
              <h3 className="text-sm font-medium text-neutral-700 mb-3">Page Information</h3>
              <div className="bg-neutral-50 rounded-lg p-4">
                <p className="text-sm text-neutral-600 mb-2">
                  <strong>Page:</strong> {editModal.page.name}
                </p>
                <p className="text-sm text-neutral-600 mb-2">
                  <strong>URL:</strong> {editModal.page.slug}
                </p>
                <p className="text-xs text-neutral-500 mt-3">
                  Currently editing SEO settings and hero section. For detailed section editing, use the Content Management page.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setEditModal({ open: false, page: null })}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
