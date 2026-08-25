'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FiSave,
  FiGlobe,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiYoutube,
  FiImage,
} from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { get, post, getErrorMessage } from '@/lib/api';
import { clearSettingsCache } from '@/hooks/useSettings';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState({
    // General
    siteName: 'Nita Clinic',
    tagline: 'Your Health, Our Priority',
    siteDescription: 'Trusted clinic & lab care in Kathmandu with specialist services and modern lab facilities.',
    logo: '/logo.png',
    favicon: '/logo.png',

    // Contact
    phone: '+977 01-4533361',
    whatsapp: '+977 9841234567',
    email: 'info@nitaclinics.com',
    address: 'Kathmandu, Nepal',

    // Working Hours
    weekdayHours: '9:00 AM - 6:00 PM',
    saturdayHours: '9:00 AM - 4:00 PM',
    sundayHours: 'Closed',

    // Social Media
    facebook: 'https://www.facebook.com/profile.php?id=61592513670112',
    instagram: 'https://instagram.com/nitaclinics',
    twitter: 'https://twitter.com/nitaclinics',
    linkedin: '',
    youtube: '',

    // SEO
    metaTitle: 'Nita Clinic - Trusted Clinic & Lab Care in Kathmandu',
    metaDescription: 'Nita Clinic provides specialist consultations, lab tests, and preventive healthcare in Kathmandu.',
    metaKeywords: 'nita clinic, clinic, kathmandu, lab tests, health checkup, vaccination',
  });

  // Load settings from database on mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const data = await get<Record<string, string>>('settings/object');
        if (data && Object.keys(data).length > 0) {
          setSettings(prev => ({
            ...prev,
            ...data
          }));
        }
      } catch (error) {
        console.error('Failed to load settings', error);
        // Continue with defaults if loading fails
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'branding');

      const response: any = await post('media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newLogoUrl = response.url;
      setSettings({ ...settings, logo: newLogoUrl });

      // Auto-save logo to database immediately
      await post('settings/bulk', {
        settings: [{ key: 'logo', value: newLogoUrl, category: 'general' }],
      });

      // Clear settings cache so other components reload with new logo
      clearSettingsCache();

      toast.success('Logo uploaded and saved successfully');
    } catch (error) {
      console.error('Failed to upload logo', error);
      toast.error(getErrorMessage(error) || 'Failed to upload logo');
    } finally {
      setIsUploadingLogo(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      toast.error('Favicon size must be less than 1MB');
      return;
    }

    setIsUploadingFavicon(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'branding');

      const response: any = await post('media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newFaviconUrl = response.url;
      setSettings({ ...settings, favicon: newFaviconUrl });

      // Auto-save favicon to database immediately
      await post('settings/bulk', {
        settings: [{ key: 'favicon', value: newFaviconUrl, category: 'general' }],
      });

      // Clear settings cache so other components reload with new favicon
      clearSettingsCache();

      toast.success('Favicon uploaded and saved successfully');
    } catch (error) {
      console.error('Failed to upload favicon', error);
      toast.error(getErrorMessage(error) || 'Failed to upload favicon');
    } finally {
      setIsUploadingFavicon(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Omit `home_services` — edited on Admin → Home services; avoid stale overwrite from this form.
      const settingsArray = Object.entries(settings)
        .filter(([key]) => key !== 'home_services')
        .map(([key, value]) => ({
          key,
          value: value ?? '',
          category: 'general',
        }));

      await post('settings/bulk', { settings: settingsArray });
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings', error);
      toast.error(getErrorMessage(error) || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: FiGlobe },
    { id: 'contact', label: 'Contact', icon: FiPhone },
    { id: 'social', label: 'Social Media', icon: FiFacebook },
    { id: 'seo', label: 'SEO', icon: FiGlobe },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Settings</h1>
          <p className="text-neutral-600 mt-1">Manage website configuration</p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving}>
          <FiSave className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-soft">
        <div className="flex border-b border-neutral-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Site Name"
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                />
                <Input
                  label="Tagline"
                  value={settings.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                />
              </div>
              <Textarea
                label="Site Description"
                value={settings.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                rows={3}
              />
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden">
                      <img src={settings.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      ref={logoInputRef}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => logoInputRef.current?.click()}
                      isLoading={isUploadingLogo}
                      disabled={isUploadingLogo}
                    >
                      <FiImage className="w-4 h-4 mr-2" />
                      {isUploadingLogo ? 'Uploading...' : 'Change'}
                    </Button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">Recommended: 200x200px, Max 5MB</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Favicon</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {settings.favicon ? (
                        <img src={settings.favicon} alt="Favicon" className="w-full h-full object-contain p-2" />
                      ) : (
                        <FiImage className="w-8 h-8 text-neutral-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFaviconUpload}
                      className="hidden"
                      ref={faviconInputRef}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => faviconInputRef.current?.click()}
                      isLoading={isUploadingFavicon}
                      disabled={isUploadingFavicon}
                    >
                      <FiImage className="w-4 h-4 mr-2" />
                      {isUploadingFavicon ? 'Uploading...' : 'Change'}
                    </Button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">Recommended: 32x32px or 64x64px, Max 1MB</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Contact Settings */}
          {activeTab === 'contact' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Phone Number"
                  leftIcon={<FiPhone className="w-5 h-5" />}
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
                <Input
                  label="WhatsApp Number"
                  leftIcon={<FiPhone className="w-5 h-5" />}
                  value={settings.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                />
                <Input
                  label="Email Address"
                  type="email"
                  leftIcon={<FiMail className="w-5 h-5" />}
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                <Input
                  label="Address"
                  leftIcon={<FiMapPin className="w-5 h-5" />}
                  value={settings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <h3 className="text-lg font-heading font-semibold mb-4">Working Hours</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <Input
                    label="Mon - Fri"
                    leftIcon={<FiClock className="w-5 h-5" />}
                    value={settings.weekdayHours}
                    onChange={(e) => handleChange('weekdayHours', e.target.value)}
                  />
                  <Input
                    label="Saturday"
                    leftIcon={<FiClock className="w-5 h-5" />}
                    value={settings.saturdayHours}
                    onChange={(e) => handleChange('saturdayHours', e.target.value)}
                  />
                  <Input
                    label="Sunday"
                    leftIcon={<FiClock className="w-5 h-5" />}
                    value={settings.sundayHours}
                    onChange={(e) => handleChange('sundayHours', e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Social Media Settings */}
          {activeTab === 'social' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Facebook"
                  leftIcon={<FiFacebook className="w-5 h-5" />}
                  placeholder="https://facebook.com/your-page"
                  value={settings.facebook}
                  onChange={(e) => handleChange('facebook', e.target.value)}
                />
                <Input
                  label="Instagram"
                  leftIcon={<FiInstagram className="w-5 h-5" />}
                  placeholder="https://instagram.com/your-handle"
                  value={settings.instagram}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                />
                <Input
                  label="Twitter"
                  leftIcon={<FiTwitter className="w-5 h-5" />}
                  placeholder="https://twitter.com/your-handle"
                  value={settings.twitter}
                  onChange={(e) => handleChange('twitter', e.target.value)}
                />
                <Input
                  label="LinkedIn"
                  leftIcon={<FiLinkedin className="w-5 h-5" />}
                  placeholder="https://linkedin.com/company/your-page"
                  value={settings.linkedin}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                />
                <Input
                  label="YouTube"
                  leftIcon={<FiYoutube className="w-5 h-5" />}
                  placeholder="https://youtube.com/@your-channel"
                  value={settings.youtube}
                  onChange={(e) => handleChange('youtube', e.target.value)}
                />
              </div>
            </motion.div>
          )}

          {/* SEO Settings */}
          {activeTab === 'seo' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Input
                label="Meta Title"
                value={settings.metaTitle}
                onChange={(e) => handleChange('metaTitle', e.target.value)}
                helperText="Recommended: 50-60 characters"
              />
              <Textarea
                label="Meta Description"
                value={settings.metaDescription}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                rows={3}
                helperText="Recommended: 150-160 characters"
              />
              <Input
                label="Meta Keywords"
                value={settings.metaKeywords}
                onChange={(e) => handleChange('metaKeywords', e.target.value)}
                helperText="Separate keywords with commas"
              />

              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-900 mb-2">Search Preview</h4>
                <div className="bg-white p-4 rounded border border-neutral-200">
                  <p className="text-lg text-primary-600 font-medium truncate">{settings.metaTitle}</p>
                  <p className="text-green-600 text-sm">www.nitaclinics.com</p>
                  <p className="text-neutral-600 text-sm line-clamp-2">{settings.metaDescription}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
