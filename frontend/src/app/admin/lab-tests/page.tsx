'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiTag,
  FiList,
  FiStar,
  FiToggleLeft,
  FiToggleRight,
} from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { get, post, patch, del, getErrorMessage, type PaginatedResponse } from '@/lib/api';
import type { LabTest, LabTestCategory } from '@/types';

// ---------------------------------------------------------------------------
// Form state types
// ---------------------------------------------------------------------------

interface CategoryForm {
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface TestForm {
  name: string;
  categoryId: string;
  description: string;
  price: number;
  originalPrice: number;
  sampleType: string;
  turnaround: string;
  preparation: string;
  isPopular: boolean;
  tags: string;
  includes: string;
}

const emptyCategoryForm: CategoryForm = { name: '', description: '', icon: '', color: '#3b82f6' };

const emptyTestForm: TestForm = {
  name: '',
  categoryId: '',
  description: '',
  price: 0,
  originalPrice: 0,
  sampleType: '',
  turnaround: '',
  preparation: '',
  isPopular: false,
  tags: '',
  includes: '',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminLabTestsPage() {
  // ---- shared state ----
  const [activeTab, setActiveTab] = useState<'categories' | 'tests'>('categories');
  const [searchQuery, setSearchQuery] = useState('');

  // ---- category state ----
  const [categories, setCategories] = useState<LabTestCategory[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catModal, setCatModal] = useState<{ open: boolean; category: LabTestCategory | null }>({
    open: false,
    category: null,
  });
  const [catDeleteModal, setCatDeleteModal] = useState<{
    open: boolean;
    category: LabTestCategory | null;
  }>({ open: false, category: null });
  const [catForm, setCatForm] = useState<CategoryForm>(emptyCategoryForm);
  const [catSaving, setCatSaving] = useState(false);

  // ---- test state ----
  const [tests, setTests] = useState<LabTest[]>([]);
  const [testLoading, setTestLoading] = useState(true);
  const [testModal, setTestModal] = useState<{ open: boolean; test: LabTest | null }>({
    open: false,
    test: null,
  });
  const [testDeleteModal, setTestDeleteModal] = useState<{
    open: boolean;
    test: LabTest | null;
  }>({ open: false, test: null });
  const [testForm, setTestForm] = useState<TestForm>(emptyTestForm);
  const [testSaving, setTestSaving] = useState(false);
  const [filterCategoryId, setFilterCategoryId] = useState('all');

  // -----------------------------------------------------------------------
  // Data fetching
  // -----------------------------------------------------------------------

  const loadCategories = useCallback(async () => {
    try {
      setCatLoading(true);
      const res = await get<LabTestCategory[]>('lab-tests/categories', {
        params: { includeInactive: 'true' },
      });
      setCategories(Array.isArray(res) ? res : []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCatLoading(false);
    }
  }, []);

  const loadTests = useCallback(async () => {
    try {
      setTestLoading(true);
      const all: LabTest[] = [];
      let page = 1;
      let totalPages = 1;
      do {
        const res = await get<PaginatedResponse<LabTest>>('lab-tests/admin', {
          params: {
            page,
            limit: 100,
            sortBy: 'order',
            sortOrder: 'asc',
          },
        });
        all.push(...(res?.data ?? []));
        totalPages = res?.totalPages ?? 1;
        page += 1;
      } while (page <= totalPages);
      setTests(all);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setTestLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    loadTests();
  }, [loadCategories, loadTests]);

  // -----------------------------------------------------------------------
  // Category CRUD
  // -----------------------------------------------------------------------

  const openCatModal = (category: LabTestCategory | null) => {
    if (category) {
      setCatForm({
        name: category.name,
        description: category.description ?? '',
        icon: category.icon ?? '',
        color: category.color ?? '#3b82f6',
      });
    } else {
      setCatForm(emptyCategoryForm);
    }
    setCatModal({ open: true, category });
  };

  const saveCat = async () => {
    if (!catForm.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setCatSaving(true);
    try {
      if (catModal.category) {
        await patch(`lab-tests/categories/${catModal.category.id}`, catForm);
        toast.success('Category updated');
      } else {
        await post('lab-tests/categories', catForm);
        toast.success('Category created');
      }
      setCatModal({ open: false, category: null });
      loadCategories();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCatSaving(false);
    }
  };

  const deleteCat = async () => {
    if (!catDeleteModal.category) return;
    try {
      await del(`lab-tests/categories/${catDeleteModal.category.id}`);
      toast.success('Category deleted');
      setCatDeleteModal({ open: false, category: null });
      loadCategories();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const toggleCatActive = async (cat: LabTestCategory) => {
    try {
      await patch(`lab-tests/categories/${cat.id}`, { isActive: !cat.isActive });
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, isActive: !c.isActive } : c)),
      );
      toast.success('Status updated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // -----------------------------------------------------------------------
  // Test CRUD
  // -----------------------------------------------------------------------

  const openTestModal = (test: LabTest | null) => {
    if (test) {
      setTestForm({
        name: test.name,
        categoryId: test.categoryId,
        description: test.description ?? '',
        price: test.price,
        originalPrice: test.originalPrice ?? 0,
        sampleType: test.sampleType ?? '',
        turnaround: test.turnaround ?? '',
        preparation: test.preparation ?? '',
        isPopular: test.isPopular,
        tags: (test.tags ?? []).join(', '),
        includes: (test.includes ?? []).join(', '),
      });
    } else {
      setTestForm({ ...emptyTestForm, categoryId: filterCategoryId !== 'all' ? filterCategoryId : '' });
    }
    setTestModal({ open: true, test });
  };

  const saveTest = async () => {
    if (!testForm.name.trim()) {
      toast.error('Test name is required');
      return;
    }
    if (!testForm.categoryId) {
      toast.error('Please select a category');
      return;
    }
    if (testForm.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    setTestSaving(true);
    try {
      const payload = {
        name: testForm.name,
        categoryId: testForm.categoryId,
        description: testForm.description || undefined,
        price: Number(testForm.price),
        originalPrice: testForm.originalPrice ? Number(testForm.originalPrice) : undefined,
        sampleType: testForm.sampleType || undefined,
        turnaround: testForm.turnaround || undefined,
        preparation: testForm.preparation || undefined,
        isPopular: testForm.isPopular,
        tags: testForm.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        includes: testForm.includes
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (testModal.test) {
        await patch(`lab-tests/${testModal.test.id}`, payload);
        toast.success('Test updated');
      } else {
        await post('lab-tests', payload);
        toast.success('Test created');
      }
      setTestModal({ open: false, test: null });
      loadTests();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setTestSaving(false);
    }
  };

  const deleteTest = async () => {
    if (!testDeleteModal.test) return;
    try {
      await del(`lab-tests/${testDeleteModal.test.id}`);
      toast.success('Test deleted');
      setTestDeleteModal({ open: false, test: null });
      loadTests();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const toggleTestActive = async (test: LabTest) => {
    try {
      await patch(`lab-tests/${test.id}`, { isActive: !test.isActive });
      setTests((prev) =>
        prev.map((t) => (t.id === test.id ? { ...t, isActive: !t.isActive } : t)),
      );
      toast.success('Status updated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const toggleTestPopular = async (test: LabTest) => {
    try {
      await patch(`lab-tests/${test.id}`, { isPopular: !test.isPopular });
      setTests((prev) =>
        prev.map((t) => (t.id === test.id ? { ...t, isPopular: !t.isPopular } : t)),
      );
      toast.success('Popular status updated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // -----------------------------------------------------------------------
  // Filtering
  // -----------------------------------------------------------------------

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredTests = tests.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategoryId === 'all' || t.categoryId === filterCategoryId;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? 'Unknown';

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  const tabs = [
    { id: 'categories' as const, label: 'Categories', icon: FiTag },
    { id: 'tests' as const, label: 'Tests', icon: FiList },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Lab Tests</h1>
          <p className="text-neutral-600 mt-1">Manage lab test categories and individual tests</p>
        </div>
        <Button onClick={() => (activeTab === 'categories' ? openCatModal(null) : openTestModal(null))}>
          <FiPlus className="w-4 h-4 mr-2" />
          Add {activeTab === 'categories' ? 'Category' : 'Test'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Categories', value: categories.length, color: 'bg-primary-500' },
          { label: 'Total Tests', value: tests.length, color: 'bg-blue-500' },
          { label: 'Active Tests', value: tests.filter((t) => t.isActive).length, color: 'bg-green-500' },
          { label: 'Popular Tests', value: tests.filter((t) => t.isPopular).length, color: 'bg-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${stat.color}`} />
              <span className="text-neutral-600 text-sm">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-neutral-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-soft">
        <div className="border-b border-neutral-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery('');
                }}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-primary-600'
                    : 'text-neutral-600 border-transparent hover:text-neutral-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-neutral-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={`Search ${activeTab}...`}
                leftIcon={<FiSearch className="w-5 h-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {activeTab === 'tests' && (
              <select
                value={filterCategoryId}
                onChange={(e) => setFilterCategoryId(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === 'categories' ? (
            /* ---------- CATEGORIES TABLE ---------- */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Category</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Slug</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Icon</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Color</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Tests</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Status</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-neutral-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {catLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-neutral-500">
                        Loading categories...
                      </td>
                    </tr>
                  ) : filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-neutral-500">
                        No categories found
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-neutral-900">{cat.name}</p>
                          {cat.description && (
                            <p className="text-sm text-neutral-500 truncate max-w-xs">
                              {cat.description}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600">{cat.slug}</td>
                        <td className="px-6 py-4 text-sm text-neutral-600">{cat.icon || '—'}</td>
                        <td className="px-6 py-4">
                          {cat.color ? (
                            <div className="flex items-center gap-2">
                              <div
                                className="w-5 h-5 rounded border border-neutral-200"
                                style={{ backgroundColor: cat.color }}
                              />
                              <span className="text-sm text-neutral-600">{cat.color}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-neutral-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600">
                          {tests.filter((t) => t.categoryId === cat.id).length}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleCatActive(cat)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              cat.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {cat.isActive ? 'active' : 'inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openCatModal(cat)}
                              className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setCatDeleteModal({ open: true, category: cat })}
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
          ) : (
            /* ---------- TESTS TABLE ---------- */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Test</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Category</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Price</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Sample</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Turnaround</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Popular</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Status</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-neutral-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {testLoading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-neutral-500">
                        Loading tests...
                      </td>
                    </tr>
                  ) : filteredTests.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-neutral-500">
                        No tests found
                      </td>
                    </tr>
                  ) : (
                    filteredTests.map((test) => (
                      <tr key={test.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-neutral-900">{test.name}</p>
                          {test.description && (
                            <p className="text-sm text-neutral-500 truncate max-w-xs">
                              {test.description}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-primary-50 text-primary-700">
                            {getCategoryName(test.categoryId)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-neutral-900">Rs. {test.price}</span>
                          {test.originalPrice && test.originalPrice > test.price && (
                            <span className="text-sm text-neutral-400 line-through ml-1">
                              Rs. {test.originalPrice}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600">
                          {test.sampleType || '—'}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600">
                          {test.turnaround || '—'}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleTestPopular(test)}
                            title="Toggle popular"
                          >
                            {test.isPopular ? (
                              <FiStar className="w-5 h-5 text-amber-500 fill-amber-500" />
                            ) : (
                              <FiStar className="w-5 h-5 text-neutral-300" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleTestActive(test)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              test.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {test.isActive ? 'active' : 'inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openTestModal(test)}
                              className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setTestDeleteModal({ open: true, test })}
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
          )}
        </div>
      </div>

      {/* ================================================================ */}
      {/* CATEGORY MODALS                                                   */}
      {/* ================================================================ */}

      {/* Add / Edit Category */}
      <Modal
        isOpen={catModal.open}
        onClose={() => setCatModal({ open: false, category: null })}
        title={catModal.category ? 'Edit Category' : 'Add Category'}
        size="md"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. Blood Tests"
              value={catForm.name}
              onChange={(e) => setCatForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <textarea
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[80px]"
              placeholder="Brief description of the category"
              value={catForm.description}
              onChange={(e) => setCatForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Icon</label>
              <input
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 🩸 or icon name"
                value={catForm.icon}
                onChange={(e) => setCatForm((f) => ({ ...f, icon: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-10 h-10 rounded border border-neutral-300 cursor-pointer"
                  value={catForm.color}
                  onChange={(e) => setCatForm((f) => ({ ...f, color: e.target.value }))}
                />
                <input
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="#3b82f6"
                  value={catForm.color}
                  onChange={(e) => setCatForm((f) => ({ ...f, color: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setCatModal({ open: false, category: null })}
            >
              Cancel
            </Button>
            <Button onClick={saveCat} isLoading={catSaving}>
              {catModal.category ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Category Confirmation */}
      <Modal
        isOpen={catDeleteModal.open}
        onClose={() => setCatDeleteModal({ open: false, category: null })}
        title="Delete Category"
      >
        <div className="p-6">
          <p className="text-neutral-600">
            Are you sure you want to delete <strong>{catDeleteModal.category?.name}</strong>? This
            will also affect any tests linked to this category.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="ghost"
              onClick={() => setCatDeleteModal({ open: false, category: null })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={deleteCat}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* ================================================================ */}
      {/* TEST MODALS                                                       */}
      {/* ================================================================ */}

      {/* Add / Edit Test */}
      <Modal
        isOpen={testModal.open}
        onClose={() => setTestModal({ open: false, test: null })}
        title={testModal.test ? 'Edit Test' : 'Add Test'}
        size="lg"
      >
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Complete Blood Count (CBC)"
                value={testForm.name}
                onChange={(e) => setTestForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={testForm.categoryId}
                onChange={(e) => setTestForm((f) => ({ ...f, categoryId: e.target.value }))}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Sample Type</label>
              <input
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Blood, Urine, Swab"
                value={testForm.sampleType}
                onChange={(e) => setTestForm((f) => ({ ...f, sampleType: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Price (Rs.) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0"
                value={testForm.price || ''}
                onChange={(e) => setTestForm((f) => ({ ...f, price: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Original Price (Rs.)
              </label>
              <input
                type="number"
                min={0}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0"
                value={testForm.originalPrice || ''}
                onChange={(e) =>
                  setTestForm((f) => ({ ...f, originalPrice: Number(e.target.value) }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Turnaround</label>
              <input
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 24 hours, Same day"
                value={testForm.turnaround}
                onChange={(e) => setTestForm((f) => ({ ...f, turnaround: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Preparation</label>
              <input
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Fasting 8-12 hours"
                value={testForm.preparation}
                onChange={(e) => setTestForm((f) => ({ ...f, preparation: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
              <textarea
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[80px]"
                placeholder="Brief description of the test"
                value={testForm.description}
                onChange={(e) => setTestForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. blood, routine, health-check"
                value={testForm.tags}
                onChange={(e) => setTestForm((f) => ({ ...f, tags: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Includes (comma-separated)
              </label>
              <input
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Hemoglobin, WBC Count, RBC Count"
                value={testForm.includes}
                onChange={(e) => setTestForm((f) => ({ ...f, includes: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setTestForm((f) => ({ ...f, isPopular: !f.isPopular }))}
                  className="text-neutral-600"
                >
                  {testForm.isPopular ? (
                    <FiToggleRight className="w-6 h-6 text-primary-600" />
                  ) : (
                    <FiToggleLeft className="w-6 h-6" />
                  )}
                </button>
                <span className="text-sm font-medium text-neutral-700">Mark as Popular</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setTestModal({ open: false, test: null })}>
              Cancel
            </Button>
            <Button onClick={saveTest} isLoading={testSaving}>
              {testModal.test ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Test Confirmation */}
      <Modal
        isOpen={testDeleteModal.open}
        onClose={() => setTestDeleteModal({ open: false, test: null })}
        title="Delete Test"
      >
        <div className="p-6">
          <p className="text-neutral-600">
            Are you sure you want to delete <strong>{testDeleteModal.test?.name}</strong>? This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="ghost"
              onClick={() => setTestDeleteModal({ open: false, test: null })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={deleteTest}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
