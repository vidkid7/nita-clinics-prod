export type SpecialistPageData = {
  title: string;
  description: string;
  heading: string;
  icon: string;
  heroVideo: {
    src: string;
    poster: string;
  };
  gradient: string;
  accentColor: string;
  intro: string;
  conditions: string[];
  procedures: string[];
  faq: Array<{ q: string; a: string }>;
  fallbackDoctors: FallbackDoctor[];
};

export type FallbackDoctor = {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  rating: number;
  availableDays: string;
  bio: string;
  phone: string;
  isTopRated?: boolean;
  images: string[];
};

export const SPECIALIST_META: Record<string, SpecialistPageData> = {
  'gynecology-obstetrics': {
    title: 'Gynecology & Obstetrics | Nita Clinic',
    description:
      "Expert gynecology and obstetrics care at Nita Clinic. Prenatal care, delivery, and women's health services.",
    heading: 'Gynecology & Obstetrics',
    icon: '♀',
    heroVideo: {
      src: '/videos/hero/gynecology-consult.mp4',
      poster: '/videos/hero/gynecology-consult.jpg',
    },
    gradient: 'from-rose-700 to-pink-800',
    accentColor: 'bg-rose-500',
    intro:
      "Comprehensive women's health services covering routine gynecology, reproductive health, prenatal monitoring, and antenatal care — delivered by experienced consultants.",
    conditions: [
      'PCOS / Polycystic Ovary Syndrome',
      'Uterine Fibroids',
      'Infertility & Fertility Support',
      'Prenatal & Antenatal Care',
      'Menstrual Disorders',
      'Cervical Health',
      'Menopausal Symptoms',
      'Pregnancy Complications',
      'Family Planning',
    ],
    procedures: [
      'Prenatal Checkup',
      'Antenatal Monitoring',
      'Postnatal Care',
      'Family Planning Consultation',
      'Cervical PAP Smear',
      'Hormonal Profile Testing',
      'Pregnancy Test & Confirmation',
    ],
    faq: [
      {
        q: 'When should I see a gynecologist?',
        a: 'Annual checkups are recommended for women above 18. You should see a specialist immediately for unusual bleeding, pelvic pain, or any reproductive concerns.',
      },
      {
        q: 'Is prenatal care available?',
        a: 'Yes. Our obstetrics team offers full antenatal monitoring from first trimester through delivery planning and postnatal care.',
      },
      {
        q: 'Do I need a referral to see your gynecologist?',
        a: 'No referral is required. You can book a direct appointment online or by calling our clinic.',
      },
      {
        q: 'What should I bring to my first appointment?',
        a: 'Bring any prior medical reports, recent test results, your last menstrual cycle dates, and a list of current medications if any.',
      },
    ],
    fallbackDoctors: [
      { id: 'current-dibya-poudel', name: 'Dibya Poudel', specialization: 'Obstetrics & Gynecology', qualification: 'MBBS, MD/MS (OBGYN)', experience: 0, rating: 0, availableDays: 'By appointment', bio: 'Obstetrics and gynecology specialist. NMC No: 14243.', phone: '+977 01-4533361', images: [] },
      { id: 'current-rupa-bajagain', name: 'Rupa Bajagain', specialization: 'Obstetrics & Gynecology', qualification: 'MD (Obstetrics and Gynecology)', experience: 0, rating: 0, availableDays: 'Morning 7–8 AM · Evening 4–7 PM · Saturday 11 AM–2 PM', bio: 'Obstetrics and gynecology specialist. NMC No: 9845.', phone: '+977 01-4533361', images: [] },
    ],
  },

  pediatrics: {
    title: 'Pediatrician | Nita Clinic',
    description:
      'Qualified pediatrician at Nita Clinic providing comprehensive child healthcare from newborn to adolescent.',
    heading: 'Pediatrician',
    icon: '👶',
    heroVideo: {
      src: '/videos/hero/pediatric-consult.mp4',
      poster: '/videos/hero/pediatric-consult.jpg',
    },
    gradient: 'from-primary-700 to-primary-800',
    accentColor: 'bg-primary-500',
    intro:
      'Specialized medical care for infants, children, and adolescents — covering growth monitoring, immunization, developmental assessment, and pediatric illness management.',
    conditions: [
      'Common Cold, Flu & Fever',
      'Asthma & Respiratory Issues',
      'Growth & Developmental Disorders',
      'Nutritional Deficiency',
      'Diarrhea & Gastroenteritis',
      'Ear & Throat Infections',
      'Neonatal Concerns',
      'Behavioral & Learning Challenges',
      'Vaccine-Preventable Diseases',
      'Developmental Milestones',
    ],
    procedures: [
      'Growth Monitoring & Charting',
      'Vaccination Review & Planning',
      'Developmental Assessment',
      'Neonatal Checkup',
      'Nutritional Counseling',
      'Pediatric Blood & Urine Tests',
    ],
    faq: [
      {
        q: 'What age range does pediatrics cover?',
        a: 'Our pediatric care supports children from newborn stage through adolescence (up to 18 years).',
      },
      {
        q: 'Can I get vaccination guidance here?',
        a: 'Yes. Our team supports routine, catch-up, and travel immunization planning aligned with national and international guidelines.',
      },
      {
        q: 'How do I prepare my child for the first visit?',
        a: 'Bring their vaccination card, any previous health records, and note current symptoms. Most children adjust quickly in our child-friendly environment.',
      },
      {
        q: 'Do you handle newborn care?',
        a: 'Yes. We provide neonatal checkups, weight monitoring, feeding guidance, and jaundice assessments for newborns.',
      },
    ],
    fallbackDoctors: [
      { id: 'current-rupesh-jha', name: 'Rupesh Jha', specialization: 'Pediatrics', qualification: 'MBBS, MD (Pediatrics)', experience: 0, rating: 0, availableDays: 'By appointment', bio: 'Pediatrician. NMC No: 20021.', phone: '+977 01-4533361', images: [] },
      { id: 'current-sudeep-kc', name: 'Sudeep KC', specialization: 'Pediatrics & Pediatric Critical Care', qualification: 'MBBS, MD (Pediatrics), DM (Pediatric Critical Care)', experience: 0, rating: 0, availableDays: 'Evening 6–7 PM · Friday 1–7 PM', bio: 'Pediatrician and pediatric critical care specialist. NMC No: 14691.', phone: '+977 01-4533361', images: [] },
    ],
  },

  tuberculosis: {
    title: 'Tuberculosis (TB) Specialist | Nita Clinic',
    description:
      'Expert tuberculosis diagnosis and treatment at Nita Clinic using modern NTCC-aligned protocols.',
    heading: 'Tuberculosis (TB)',
    icon: '🫁',
    heroVideo: {
      src: '/videos/hero/tb-xray-doctor.mp4',
      poster: '/videos/hero/tb-xray-doctor.jpg',
    },
    gradient: 'from-emerald-700 to-teal-800',
    accentColor: 'bg-emerald-600',
    intro:
      'Focused diagnosis, treatment monitoring, and prevention for pulmonary and extra-pulmonary tuberculosis — aligned with NTCC protocols and WHO guidelines.',
    conditions: [
      'Pulmonary Tuberculosis',
      'Latent TB Infection (LTBI)',
      'Drug-Resistant TB (MDR-TB)',
      'Extra-Pulmonary TB',
      'TB Lymphadenitis',
      'Pleural TB',
      'TB Meningitis',
      'TB Peritonitis',
      'Bone & Joint TB',
      'Miliary (Disseminated) TB',
      'ADSN — Active Drug Safety & Monitoring',
      'Chest Conditions Requiring Cleaning & Drainage',
    ],
    procedures: [
      'Sputum Smear Microscopy (AFB)',
      'GeneXpert MTB/RIF',
      'Chest X-ray (Digital)',
      'Culture & Drug Sensitivity Test',
      'DOTS Therapy Initiation',
      'Treatment Monitoring',
      'Tuberculin Skin Test (TST)',
      'IGRA (Interferon-Gamma Release Assay)',
      'ADSN — Active Drug Safety Monitoring',
      'Chest Cleaning & Pleural Fluid Management',
    ],
    faq: [
      {
        q: 'Is TB treatment free?',
        a: 'First-line anti-TB medicines are available under national programs. Please consult our specialist for details on your specific case and coverage.',
      },
      {
        q: 'How long does TB treatment take?',
        a: 'Standard treatment is 6 months. Drug-resistant TB may require 9–24 months depending on the type and response.',
      },
      {
        q: 'Can TB spread to family members?',
        a: 'Pulmonary TB is airborne. Family contacts should be screened. Our team provides contact tracing advice and preventive therapy options.',
      },
      {
        q: 'What are the symptoms of TB?',
        a: 'Persistent cough for 2+ weeks, blood in sputum, unexplained weight loss, night sweats, and prolonged fever are key symptoms requiring urgent evaluation.',
      },
    ],
    fallbackDoctors: [
      {
        id: 'current-nita-chaudhary',
        name: 'Nita Chaudhary',
        specialization: 'Tuberculosis (TB)',
        qualification: 'MBBS',
        experience: 0,
        rating: 0,
        availableDays: 'By appointment',
        bio: 'Medical doctor. NMC No: 17887.',
        phone: '+977 01-4533361',
        images: [],
      },
    ],
  },

  orthopedics: {
    title: 'Orthopedics | Nita Clinic',
    description:
      'Expert orthopedic care at Nita Clinic for bone, joint, muscle, and spine conditions, fractures, and post-injury rehabilitation.',
    heading: 'Orthopedics',
    icon: '🦴',
    heroVideo: {
      src: '/videos/hero/orthopedic-consult.mp4',
      poster: '/videos/hero/orthopedic-consult.jpg',
    },
    gradient: 'from-indigo-700 to-violet-800',
    accentColor: 'bg-indigo-500',
    intro:
      'Comprehensive musculoskeletal care covering bone, joint, muscle, and spine conditions — from acute fractures and trauma to chronic arthritis and post-injury rehabilitation — delivered by experienced orthopedic consultants.',
    conditions: [
      'Osteoarthritis & Joint Pain',
      'Back & Neck Pain',
      'Sciatica & Disc Problems',
      'Tendon & Ligament Injuries',
      'Shoulder & Knee Pain',
      'Osteoporosis',
      'Carpal Tunnel Syndrome',
      'Plantar Fasciitis',
      'Frozen Shoulder',
      'Knee & Hip Arthritis',
    ],
    procedures: [
      'Digital X-Ray & Bone Density',
      'Joint Aspiration & Injection',
      'Cast & Splint Application',
      'Orthopedic Consultation',
      'Post-Operative Care',
      'Spine & Posture Evaluation',
      'Pain Management',
    ],
    faq: [
      {
        q: 'When should I see an orthopedic specialist?',
        a: 'See a specialist for persistent joint or bone pain, swelling after an injury, limited movement, numbness, or any suspected fracture that does not improve within a few days.',
      },
      {
        q: 'What should I bring to my first appointment?',
        a: 'Bring any prior X-rays, MRI or CT reports, a list of current medications, and details of how and when your symptoms started.',
      },
    ],
    fallbackDoctors: [
      {
        id: 'current-gopesh-thakur',
        name: 'Gopesh Thakur',
        specialization: 'Orthopedics',
        qualification: 'MBBS, MS Orthopaedic',
        experience: 0,
        rating: 0,
        availableDays: 'By appointment',
        bio: 'Orthopaedic specialist. NMC No: 2646.',
        phone: '+977 01-4533361',
        images: [],
      },
    ],
  },
};
