'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiShield,
  FiKey,
  FiLock,
  FiSmartphone,
  FiMonitor,
  FiLogOut,
  FiAlertTriangle,
  FiCheck,
  FiX,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { post, getErrorMessage } from '@/lib/api';

const mockSessions = [
  {
    id: '1',
    device: 'Windows PC - Chrome',
    location: 'Kathmandu, Nepal',
    ip: '103.123.xxx.xxx',
    lastActive: '2026-02-02T10:30:00',
    current: true,
  },
  {
    id: '2',
    device: 'iPhone - Safari',
    location: 'Kathmandu, Nepal',
    ip: '103.123.xxx.xxx',
    lastActive: '2026-02-01T14:15:00',
    current: false,
  },
  {
    id: '3',
    device: 'MacBook - Firefox',
    location: 'Bhaktapur, Nepal',
    ip: '103.124.xxx.xxx',
    lastActive: '2026-01-28T09:00:00',
    current: false,
  },
];

export default function SecuritySettingsPage() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoutAllModal, setLogoutAllModal] = useState(false);
  const [sessions, setSessions] = useState(mockSessions);

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [twoFactor, setTwoFactor] = useState({
    enabled: false,
    method: 'app', // 'app' | 'sms' | 'email'
  });

  const passwordRequirements = [
    { label: 'At least 8 characters', met: passwords.new.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(passwords.new) },
    { label: 'One lowercase letter', met: /[a-z]/.test(passwords.new) },
    { label: 'One number', met: /[0-9]/.test(passwords.new) },
    { label: 'One special character', met: /[^A-Za-z0-9]/.test(passwords.new) },
  ];

  const allRequirementsMet = passwordRequirements.every((r) => r.met);

  const handleChangePassword = async () => {
    if (!passwords.current) {
      toast.error('Please enter your current password');
      return;
    }
    if (!allRequirementsMet) {
      toast.error('Password does not meet requirements');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await post('auth/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      toast.success('Password changed successfully');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      console.error('Change password failed', error);
      toast.error(getErrorMessage(error) || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTwoFactor({ ...twoFactor, enabled: !twoFactor.enabled });
      toast.success(twoFactor.enabled ? '2FA disabled' : '2FA enabled');
    } catch (error) {
      toast.error('Failed to update 2FA settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    toast.success('Session revoked');
  };

  const handleLogoutAll = () => {
    setSessions(sessions.filter((s) => s.current));
    setLogoutAllModal(false);
    toast.success('All other sessions logged out');
  };

  const formatDate = (dateStr: string) => {
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
      <div>
        <h1 className="text-2xl font-heading font-bold text-neutral-900">Security Settings</h1>
        <p className="text-neutral-600 mt-1">Manage your account security and sessions</p>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h2 className="text-lg font-heading font-semibold flex items-center gap-2 mb-6">
          <FiKey className="w-5 h-5 text-primary-600" />
          Change Password
        </h2>

        <div className="max-w-md space-y-4">
          <div className="relative">
            <Input
              label="Current Password"
              type={showPassword ? 'text' : 'password'}
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600"
            >
              {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600"
            >
              {showNewPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>

          {passwords.new && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-neutral-50 rounded-lg p-4"
            >
              <p className="text-sm font-medium text-neutral-700 mb-2">Password requirements:</p>
              <ul className="space-y-1">
                {passwordRequirements.map((req, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      req.met ? 'bg-green-500 text-white' : 'bg-neutral-200'
                    }`}>
                      {req.met && <FiCheck className="w-3 h-3" />}
                    </span>
                    <span className={req.met ? 'text-green-700' : 'text-neutral-600'}>
                      {req.label}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          <div className="relative">
            <Input
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              error={passwords.confirm && passwords.new !== passwords.confirm ? 'Passwords do not match' : undefined}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600"
            >
              {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>

          <Button
            onClick={handleChangePassword}
            isLoading={isLoading}
            disabled={!allRequirementsMet || passwords.new !== passwords.confirm}
          >
            Update Password
          </Button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h2 className="text-lg font-heading font-semibold flex items-center gap-2 mb-4">
          <FiShield className="w-5 h-5 text-primary-600" />
          Two-Factor Authentication
        </h2>

        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              twoFactor.enabled ? 'bg-green-100 text-green-600' : 'bg-neutral-200 text-neutral-500'
            }`}>
              {twoFactor.enabled ? <FiShield className="w-6 h-6" /> : <FiLock className="w-6 h-6" />}
            </div>
            <div>
              <p className="font-medium text-neutral-900">
                {twoFactor.enabled ? '2FA is enabled' : '2FA is disabled'}
              </p>
              <p className="text-sm text-neutral-500">
                {twoFactor.enabled
                  ? 'Your account is protected with two-factor authentication'
                  : 'Add an extra layer of security to your account'}
              </p>
            </div>
          </div>
          <Button
            variant={twoFactor.enabled ? 'ghost' : 'primary'}
            onClick={handleToggle2FA}
          >
            {twoFactor.enabled ? 'Disable' : 'Enable'}
          </Button>
        </div>

        {twoFactor.enabled && (
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            {[
              { id: 'app', label: 'Authenticator App', icon: FiSmartphone, desc: 'Use Google/Microsoft Authenticator' },
              { id: 'sms', label: 'SMS', icon: FiSmartphone, desc: 'Receive codes via SMS' },
              { id: 'email', label: 'Email', icon: FiMonitor, desc: 'Receive codes via email' },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setTwoFactor({ ...twoFactor, method: method.id })}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  twoFactor.method === method.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <method.icon className={`w-6 h-6 mb-2 ${
                  twoFactor.method === method.id ? 'text-primary-600' : 'text-neutral-400'
                }`} />
                <p className="font-medium text-neutral-900">{method.label}</p>
                <p className="text-sm text-neutral-500">{method.desc}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
            <FiMonitor className="w-5 h-5 text-primary-600" />
            Active Sessions
          </h2>
          <Button variant="ghost" size="sm" onClick={() => setLogoutAllModal(true)}>
            <FiLogOut className="w-4 h-4 mr-2" />
            Logout All Other Sessions
          </Button>
        </div>

        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`p-4 rounded-lg border ${
                session.current ? 'border-green-200 bg-green-50' : 'border-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    session.current ? 'bg-green-100 text-green-600' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    <FiMonitor className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-neutral-900">{session.device}</p>
                      {session.current && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500">
                      {session.location} • IP: {session.ip}
                    </p>
                    <p className="text-xs text-neutral-400">
                      Last active: {formatDate(session.lastActive)}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevokeSession(session.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="font-heading font-semibold text-amber-900 flex items-center gap-2 mb-4">
          <FiAlertTriangle className="w-5 h-5" />
          Security Tips
        </h3>
        <ul className="space-y-2 text-sm text-amber-800">
          <li className="flex items-start gap-2">
            <FiCheck className="w-4 h-4 mt-0.5 text-amber-600" />
            Use a strong, unique password that you don't use for other accounts
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="w-4 h-4 mt-0.5 text-amber-600" />
            Enable two-factor authentication for added security
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="w-4 h-4 mt-0.5 text-amber-600" />
            Regularly review and revoke unused sessions
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="w-4 h-4 mt-0.5 text-amber-600" />
            Never share your password or 2FA codes with anyone
          </li>
        </ul>
      </div>

      {/* Logout All Modal */}
      <Modal
        isOpen={logoutAllModal}
        onClose={() => setLogoutAllModal(false)}
        title="Logout All Sessions"
      >
        <div className="p-6">
          <p className="text-neutral-600">
            This will log you out from all other devices. You will remain logged in on this device.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setLogoutAllModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleLogoutAll}>
              Logout All
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
