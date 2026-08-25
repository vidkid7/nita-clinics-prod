'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiUser,
  FiKey,
} from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { get, post, patch, del, PaginatedResponse, getErrorMessage } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

type UserRole = 'super_admin' | 'admin' | 'staff';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
}

const roleColors: Record<UserRole, string> = {
  super_admin: 'bg-red-100 text-red-700',
  admin: 'bg-red-100 text-red-700',
  staff: 'bg-primary-100 text-primary-700',
};

// Only allow assigning Admin or Staff from the UI.
// Super Admin is reserved for the owner/system and not selectable.
const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
];

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editModal, setEditModal] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });
  const [passwordModal, setPasswordModal] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'staff' as UserRole,
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // Call without query params to avoid potential errors
        const response = await get<PaginatedResponse<User>>('users');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to load users', error);
        toast.error(getErrorMessage(error) || 'Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Role-based visibility:
  // - super_admin: see everyone
  // - admin: see admins + staff, but not super admin
  // - staff: see only staff
  const visibleUsers = users.filter((user) => {
    if (!currentUser) return true;
    if (currentUser.role === 'super_admin') return true;
    if (currentUser.role === 'admin') {
      return user.role !== 'super_admin';
    }
    // staff
    return user.role === 'staff';
  });

  const filteredUsers = visibleUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setFormData({ name: '', email: '', role: 'staff', password: '', confirmPassword: '' });
    setEditModal({ open: true, user: null });
  };

  const openEditModal = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role === 'super_admin' ? 'admin' : user.role,
      password: '',
      confirmPassword: '',
    });
    setEditModal({ open: true, user });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      toast.error('Please fill required fields');
      return;
    }

    if (!editModal.user && (!formData.password || formData.password !== formData.confirmPassword)) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      if (editModal.user) {
        const updated = await patch<User>(`users/${editModal.user.id}`, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        });
        setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
        toast.success('User updated');
      } else {
        const newUser = await post<User>('users', {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password,
        });
        setUsers([newUser, ...users]);
        toast.success('User added');
      }
      setEditModal({ open: false, user: null });
    } catch (error) {
      console.error('Failed to save user', error);
      toast.error(getErrorMessage(error) || 'Failed to save user');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    if ((deleteModal.user.role === 'admin' || deleteModal.user.role === 'super_admin') && 
        users.filter((u) => u.role === 'admin' || u.role === 'super_admin').length === 1) {
      toast.error('Cannot delete the only admin user');
      return;
    }
    try {
      await del<void>(`users/${deleteModal.user.id}`);
      setUsers(users.filter((u) => u.id !== deleteModal.user!.id));
      toast.success('User deleted');
      setDeleteModal({ open: false, user: null });
    } catch (error) {
      console.error('Failed to delete user', error);
      toast.error(getErrorMessage(error) || 'Failed to delete user');
    }
  };

  const handleResetPassword = async () => {
    if (!passwordModal.user) return;
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    try {
      await patch(`users/${passwordModal.user.id}`, { password: formData.password });
      toast.success('Password reset successfully');
      setPasswordModal({ open: false, user: null });
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (error) {
      console.error('Failed to reset password', error);
      toast.error(getErrorMessage(error) || 'Failed to reset password');
    }
  };

  const toggleStatus = async (id: string, current: boolean) => {
    try {
      if (current) {
        await patch(`users/${id}/deactivate`);
        setUsers(users.map((u) => (u.id === id ? { ...u, isActive: false } : u)));
        toast.success('User deactivated');
      } else {
        await patch(`users/${id}/activate`);
        setUsers(users.map((u) => (u.id === id ? { ...u, isActive: true } : u)));
        toast.success('User activated');
      }
    } catch (error) {
      console.error('Failed to update user status', error);
      toast.error(getErrorMessage(error) || 'Failed to update user status');
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Users</h1>
          <p className="text-neutral-600 mt-1">Manage admin panel users and access</p>
        </div>
        <Button onClick={openAddModal}>
          <FiPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: visibleUsers.length, color: 'bg-primary-500' },
          { label: 'Admins', value: visibleUsers.filter((u) => u.role === 'admin' || u.role === 'super_admin').length, color: 'bg-red-500' },
          { label: 'Staff', value: visibleUsers.filter((u) => u.role === 'staff').length, color: 'bg-primary-500' },
          { label: 'Active', value: visibleUsers.filter((u) => u.isActive).length, color: 'bg-green-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-soft">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${stat.color}`} />
              <span className="text-neutral-600 text-sm">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-soft p-4">
        <Input
          placeholder="Search users..."
          leftIcon={<FiSearch className="w-5 h-5" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">User</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Role</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Last Login</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td className="px-6 py-8 text-center text-neutral-500" colSpan={5}>
                    Loading users...
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{user.name}</p>
                          <p className="text-sm text-neutral-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        roleColors[user.role] || roleColors.staff
                      }`}>
                        {user.role === 'super_admin' ? 'Super Admin' : user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(user.id, user.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          user.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {user.isActive ? 'active' : 'inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-neutral-600 text-sm">
                      {formatDate(user.lastLogin || null)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {/* Only super admin can change passwords/roles of any user */}
                        {/* Admin can manage staff and self, but not other admins */}
                        {(!currentUser || currentUser.role === 'super_admin' ||
                          (currentUser.role === 'admin' && (user.role === 'staff' || user.id === currentUser.id))) && (
                          <>
                            <button
                              onClick={() => {
                                setPasswordModal({ open: true, user });
                                setFormData({ ...formData, password: '', confirmPassword: '' });
                              }}
                              className="p-2 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Reset Password"
                            >
                              <FiKey className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(user)}
                              className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {/* Only super admin can delete users */}
                        {currentUser?.role === 'super_admin' && (
                          <button
                            onClick={() => setDeleteModal({ open: true, user })}
                            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-500">No users found</p>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, user: null })}
        title={editModal.user ? 'Edit User' : 'Add New User'}
      >
        <div className="p-6 space-y-4">
          <Input
            label="Full Name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="user@clinic.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          {currentUser?.role !== 'staff' && (
            <Select
              label="Role"
              options={roleOptions}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            />
          )}
          {!editModal.user && (
            <>
              <Input
                label="Password"
                type="password"
                placeholder="Min 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setEditModal({ open: false, user: null })}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editModal.user ? 'Update' : 'Add'} User
            </Button>
          </div>
        </div>
      </Modal>

      {/* Password Reset Modal */}
      <Modal
        isOpen={passwordModal.open}
        onClose={() => setPasswordModal({ open: false, user: null })}
        title="Reset Password"
      >
        <div className="p-6 space-y-4">
          <p className="text-neutral-600">
            Reset password for <strong>{passwordModal.user?.name}</strong>
          </p>
          <Input
            label="New Password"
            type="password"
            placeholder="Min 8 characters"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setPasswordModal({ open: false, user: null })}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword}>
              Reset Password
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
        title="Delete User"
      >
        <div className="p-6">
          <p className="text-neutral-600">
            Are you sure you want to delete <strong>{deleteModal.user?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setDeleteModal({ open: false, user: null })}>
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
