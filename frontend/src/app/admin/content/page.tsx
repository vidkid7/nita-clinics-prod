'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiSave,
  FiEdit,
  FiImage,
  FiHome,
  FiInfo,
  FiPhone,
  FiUsers,
  FiStar,
  FiMapPin,
  FiGrid,
} from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { get, put, getErrorMessage } from '@/lib/api';

export default function ContentManagementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Hero Section
  const [heroContent, setHeroContent] = useState({
    pillText: 'NITA Clinic · Kathmandu',
    title: 'Your Health,',
    highlightText: 'Our Priority.',
    subtitle:
      'Specialist consultations, preventive check-ups and vaccination — all under one roof in Kathmandu.',
    ctaText: 'Book Appointment',
    ctaSecondaryText: 'Call Now',
    backgroundImage:
      'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=900&q=85&fit=crop&crop=faces,center',
    badge1: '15,000+',
    badge2: '4.8/5',
    badge3: '10+ Yrs',
  });

  // About Section
  const [aboutContent, setAboutContent] = useState({
    title: 'About Nita Clinic',
    subtitle: 'Trusted Healthcare in Nepal',
    description: 'Nita Clinic is a modern clinic in Kathmandu providing comprehensive healthcare services with experienced specialists and updated technology.',
    mission: 'To provide accessible, affordable, and quality healthcare while maintaining the highest standards of safety and professionalism.',
    yearsExperience: '15+',
    happyPatients: '10,000+',
    clinicalServices: '25+',
    expertDentists: '8',
  });

  // Services Section
  const [servicesContent, setServicesContent] = useState({
    title: 'Our Services',
    subtitle: 'Comprehensive Clinical Care',
    description: 'We offer a wide range of healthcare services to meet your family health needs.',
  });

  // Contact Section
  const [contactContent, setContactContent] = useState({
    badgeLabel: 'Get in Touch',
    title: 'Ready to Start Your|Health Journey?',
    subtitle:
      'From specialist consultations to lab tests and preventive care, our team is here to support your family every step of the way. Book online in minutes.',
    phone: '+977 01-4533361',
    whatsapp: '+977 9841234567',
    email: 'info@nitaclinics.com',
    address: 'Kathmandu, Nepal',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0391772!2d85.3450!3d27.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQzJzAyLjAiTiA4NcKwMjAnNDIuMCJF!5e0!3m2!1sen!2snp!4v1234567890',
    workingHours: 'Mon-Fri: 9AM-6PM, Sat: 9AM-4PM',
  });

  const sections = [
    { id: 'hero', label: 'Hero Section', icon: FiHome },
    { id: 'about', label: 'About Section', icon: FiInfo },
    { id: 'services', label: 'Services Section', icon: FiGrid },
    { id: 'contact', label: 'Contact Section', icon: FiPhone },
    { id: 'statistics', label: 'Statistics', icon: FiStar },
    { id: 'home-images', label: 'Home page photos', icon: FiImage, href: '/admin/content/home-images' },
  ];

  // Load content from database on mount
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const pageSlug = 'home';
        
        // Load hero section
        try {
          const heroData: any = await get(`content/page/${pageSlug}/hero`);
          if (heroData && heroData.content) {
            const c = heroData.content as any;
            setHeroContent({
              pillText: c.badgeText || heroContent.pillText,
              title: c.title || heroContent.title,
              highlightText: c.highlightText || heroContent.highlightText,
              subtitle: c.subtitle || heroContent.subtitle,
              ctaText: c.primaryCtaText || heroContent.ctaText,
              ctaSecondaryText: c.secondaryCtaText || heroContent.ctaSecondaryText,
              backgroundImage: c.backgroundImage || heroContent.backgroundImage,
              badge1: c.stats?.yearsExperience || heroContent.badge1,
              badge2: c.stats?.expertDentists || heroContent.badge2,
              badge3: c.stats?.happyPatients || heroContent.badge3,
            });
          }
        } catch (e) {
          // use hero defaults
        }

        // Load about section
        try {
          const aboutData: any = await get(`content/page/${pageSlug}/about`);
          if (aboutData && aboutData.content) {
            const c = aboutData.content as any;
            setAboutContent({
              title: c.title || aboutContent.title,
              subtitle: c.badgeLabel || aboutContent.subtitle,
              description: c.paragraph1 || aboutContent.description,
              mission: c.paragraph2 || aboutContent.mission,
              yearsExperience: c.experienceYears || aboutContent.yearsExperience,
              happyPatients: heroContent.badge3 || aboutContent.happyPatients,
              clinicalServices: '25+',
              expertDentists: heroContent.badge2 || aboutContent.expertDentists,
            });
          }
        } catch (e) {
          // use about defaults
        }

        // Load services section
        try {
          const servicesData: any = await get(`content/page/${pageSlug}/services`);
          if (servicesData && servicesData.content) {
            const c = servicesData.content as Record<string, string>;
            setServicesContent({
              title: c.badgeLabel || c.title || servicesContent.title,
              subtitle: c.title || c.subtitle || servicesContent.subtitle,
              description: c.subtitle || c.description || servicesContent.description,
            });
          }
        } catch (e) {
          // use services defaults
        }

        // Load contact section
        try {
          const contactData: any = await get(`content/page/${pageSlug}/contact`);
          if (contactData && contactData.content) {
            const c = contactData.content as any;
            setContactContent({
              badgeLabel: c.badgeLabel || contactContent.badgeLabel,
              title: c.title || contactContent.title,
              subtitle: c.subtitle || contactContent.subtitle,
              phone: c.phone || contactContent.phone,
              whatsapp: c.whatsapp || contactContent.whatsapp,
              email: c.email || contactContent.email,
              address: c.address || contactContent.address,
              mapEmbed: c.mapEmbed || contactContent.mapEmbed,
              workingHours: c.workingHours || contactContent.workingHours,
            });
          }
        } catch (e) {
          // use contact defaults
        }
      } catch (error) {
        console.error('Failed to load content', error);
        // Continue with defaults if loading fails
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const pageSlug = 'home';
      
      // Save hero section
      await put(`content/page/${pageSlug}/hero`, {
        content: {
          badgeText: heroContent.pillText,
          title: heroContent.title,
          highlightText: heroContent.highlightText,
          subtitle: heroContent.subtitle,
          primaryCtaText: heroContent.ctaText,
          secondaryCtaText: heroContent.ctaSecondaryText,
          backgroundImage: heroContent.backgroundImage,
          stats: {
            yearsExperience: heroContent.badge1,
            expertDentists: heroContent.badge2,
            happyPatients: heroContent.badge3,
          },
        },
      });

      // Save about section
      await put(`content/page/${pageSlug}/about`, {
        content: {
          badgeLabel: aboutContent.subtitle,
          title: aboutContent.title,
          paragraph1: aboutContent.description,
          paragraph2: aboutContent.mission,
          experienceYears: aboutContent.yearsExperience,
          features: [
            'Modern lab equipment and sterilization',
            'Experienced and certified specialists',
            'Comfortable and hygienic environment',
            'Affordable treatment options',
            'Urgent care support available',
            'Personalized patient care',
          ],
        },
      });

      // Save services section
      await put(`content/page/${pageSlug}/services`, {
        content: {
          badgeLabel: servicesContent.title,
          title: servicesContent.subtitle,
          subtitle: servicesContent.description,
        },
      });

      // Save contact section
      await put(`content/page/${pageSlug}/contact`, {
        content: {
          badgeLabel: contactContent.badgeLabel,
          title: contactContent.title,
          subtitle: contactContent.subtitle,
          phone: contactContent.phone,
          whatsapp: contactContent.whatsapp,
          email: contactContent.email,
          address: contactContent.address,
          mapEmbed: contactContent.mapEmbed,
          workingHours: contactContent.workingHours,
        },
      });

      toast.success('Content saved successfully');
    } catch (error) {
      console.error('Failed to save content', error);
      toast.error(getErrorMessage(error) || 'Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Content Management</h1>
          <p className="text-neutral-600 mt-1">Edit website content and sections</p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving}>
          <FiSave className="w-4 h-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-soft p-4 sticky top-24">
            <h3 className="text-sm font-medium text-neutral-500 mb-3 uppercase tracking-wider">Sections</h3>
            <nav className="space-y-1">
              {sections.map((section) => {
                if (section.href) {
                  return (
                    <a
                      key={section.id}
                      href={section.href}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-neutral-600 hover:bg-neutral-100"
                    >
                      <section.icon className="w-5 h-5" />
                      {section.label}
                    </a>
                  );
                }
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary-600 text-white'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-soft p-6">
            {/* Hero Section */}
            {activeSection === 'hero' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
                  <FiHome className="w-5 h-5 text-primary-600" />
                  Hero Section
                </h2>

                <Input
                  label="Top pill text"
                  value={heroContent.pillText}
                  onChange={(e) => setHeroContent({ ...heroContent, pillText: e.target.value })}
                  helperText="Small line above the headline (e.g. location tag)"
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Title (first line)"
                    value={heroContent.title}
                    onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                  />
                  <Input
                    label="Title (gradient line)"
                    value={heroContent.highlightText}
                    onChange={(e) => setHeroContent({ ...heroContent, highlightText: e.target.value })}
                    helperText="Second line, shown with gradient styling"
                  />
                </div>

                <Textarea
                  label="Subtitle"
                  value={heroContent.subtitle}
                  onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
                  rows={2}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Primary CTA Text"
                    value={heroContent.ctaText}
                    onChange={(e) => setHeroContent({ ...heroContent, ctaText: e.target.value })}
                  />
                  <Input
                    label="Secondary CTA Text"
                    value={heroContent.ctaSecondaryText}
                    onChange={(e) => setHeroContent({ ...heroContent, ctaSecondaryText: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    label="Hero stat line 1"
                    value={heroContent.badge1}
                    onChange={(e) => setHeroContent({ ...heroContent, badge1: e.target.value })}
                    helperText="Shown in the stats row under CTAs"
                  />
                  <Input
                    label="Hero stat line 2"
                    value={heroContent.badge2}
                    onChange={(e) => setHeroContent({ ...heroContent, badge2: e.target.value })}
                  />
                  <Input
                    label="Hero stat line 3"
                    value={heroContent.badge3}
                    onChange={(e) => setHeroContent({ ...heroContent, badge3: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Background Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-20 bg-neutral-100 rounded-lg overflow-hidden">
                      <img src={heroContent.backgroundImage} alt="Hero" className="w-full h-full object-cover" />
                    </div>
                    <Button variant="secondary" size="sm">
                      <FiImage className="w-4 h-4 mr-2" />
                      Change Image
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* About Section */}
            {activeSection === 'about' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
                  <FiInfo className="w-5 h-5 text-primary-600" />
                  About Section
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Main heading"
                    value={aboutContent.title}
                    onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
                  />
                  <Input
                    label="Badge (small pill)"
                    value={aboutContent.subtitle}
                    onChange={(e) => setAboutContent({ ...aboutContent, subtitle: e.target.value })}
                  />
                </div>

                <Textarea
                  label="Description"
                  value={aboutContent.description}
                  onChange={(e) => setAboutContent({ ...aboutContent, description: e.target.value })}
                  rows={4}
                />

                <Textarea
                  label="Mission Statement"
                  value={aboutContent.mission}
                  onChange={(e) => setAboutContent({ ...aboutContent, mission: e.target.value })}
                  rows={3}
                />
              </motion.div>
            )}

            {/* Services Section */}
            {activeSection === 'services' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
                  <FiGrid className="w-5 h-5 text-primary-600" />
                  Services Section
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Badge (small label above heading)"
                    value={servicesContent.title}
                    onChange={(e) => setServicesContent({ ...servicesContent, title: e.target.value })}
                  />
                  <Input
                    label="Main heading"
                    value={servicesContent.subtitle}
                    onChange={(e) => setServicesContent({ ...servicesContent, subtitle: e.target.value })}
                  />
                </div>

                <Textarea
                  label="Intro paragraph (under heading)"
                  value={servicesContent.description}
                  onChange={(e) => setServicesContent({ ...servicesContent, description: e.target.value })}
                  rows={2}
                />

                <div className="bg-neutral-50 p-4 rounded-lg">
                  <p className="text-sm text-neutral-600">
                    To manage the home page service cards, go to{' '}
            <a href="/admin/services" className="text-primary-600 hover:underline">Home page services</a>
                  </p>
                </div>
              </motion.div>
            )}

            {/* Contact Section */}
            {activeSection === 'contact' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
                  <FiPhone className="w-5 h-5 text-primary-600" />
                  Contact Section
                </h2>

                <Input
                  label="Small badge (pill above headline)"
                  value={contactContent.badgeLabel}
                  onChange={(e) => setContactContent({ ...contactContent, badgeLabel: e.target.value })}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Headline (use | before accent part, e.g. Ready|Health)"
                    value={contactContent.title}
                    onChange={(e) => setContactContent({ ...contactContent, title: e.target.value })}
                  />
                  <Input
                    label="Supporting paragraph"
                    value={contactContent.subtitle}
                    onChange={(e) => setContactContent({ ...contactContent, subtitle: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Phone"
                    value={contactContent.phone}
                    onChange={(e) => setContactContent({ ...contactContent, phone: e.target.value })}
                  />
                  <Input
                    label="WhatsApp"
                    value={contactContent.whatsapp}
                    onChange={(e) => setContactContent({ ...contactContent, whatsapp: e.target.value })}
                  />
                  <Input
                    label="Email"
                    value={contactContent.email}
                    onChange={(e) => setContactContent({ ...contactContent, email: e.target.value })}
                  />
                  <Input
                    label="Address"
                    value={contactContent.address}
                    onChange={(e) => setContactContent({ ...contactContent, address: e.target.value })}
                  />
                </div>

                <Input
                  label="Working Hours"
                  value={contactContent.workingHours}
                  onChange={(e) => setContactContent({ ...contactContent, workingHours: e.target.value })}
                />

                <Textarea
                  label="Google Maps Embed URL"
                  value={contactContent.mapEmbed}
                  onChange={(e) => setContactContent({ ...contactContent, mapEmbed: e.target.value })}
                  rows={2}
                  helperText="Paste the Google Maps embed URL here"
                />
              </motion.div>
            )}

            {/* Statistics Section */}
            {activeSection === 'statistics' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
                  <FiStar className="w-5 h-5 text-primary-600" />
                  Statistics
                </h2>
                <p className="text-neutral-600 text-sm">
                  These statistics are displayed throughout the website to build trust with visitors.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Years of Experience"
                    value={aboutContent.yearsExperience}
                    onChange={(e) => setAboutContent({ ...aboutContent, yearsExperience: e.target.value })}
                  />
                  <Input
                    label="Happy Patients"
                    value={aboutContent.happyPatients}
                    onChange={(e) => setAboutContent({ ...aboutContent, happyPatients: e.target.value })}
                  />
                  <Input
                    label="Clinical Services"
                    value={aboutContent.clinicalServices}
                    onChange={(e) => setAboutContent({ ...aboutContent, clinicalServices: e.target.value })}
                  />
                  <Input
                    label="Expert Dentists"
                    value={aboutContent.expertDentists}
                    onChange={(e) => setAboutContent({ ...aboutContent, expertDentists: e.target.value })}
                  />
                </div>

                <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                  <h3 className="font-medium text-primary-900 mb-2">Preview</h3>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary-600">{aboutContent.yearsExperience}</p>
                      <p className="text-sm text-neutral-600">Years Experience</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary-600">{aboutContent.happyPatients}</p>
                      <p className="text-sm text-neutral-600">Happy Patients</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary-600">{aboutContent.clinicalServices}</p>
                      <p className="text-sm text-neutral-600">Services</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary-600">{aboutContent.expertDentists}</p>
                      <p className="text-sm text-neutral-600">Dentists</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
