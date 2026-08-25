export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  authorRole: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: string;
  views: number;
  readingTime: number;
}

export const FALLBACK_BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'Stay Safe This Monsoon Season: Health Tips from Our Doctors',
    slug: 'stay-safe-this-monsoon-season',
    excerpt: 'Monsoon brings waterborne and respiratory illnesses. Here are simple steps to protect your family throughout the season.',
    featuredImage: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=1200&q=85',
    author: 'Dr. Nita Clinic Team',
    authorRole: 'General Medicine',
    category: 'Preventive Health',
    tags: ['monsoon', 'waterborne disease', 'prevention', 'seasonal health'],
    isPublished: true,
    publishedAt: '2026-03-15T08:00:00Z',
    views: 1240,
    readingTime: 5,
    content: `
      <h2>Why Monsoon Season Demands Extra Health Attention</h2>
      <p>The monsoon season in Nepal brings relief from the summer heat, but it also brings a surge in waterborne diseases, respiratory infections, and vector-borne illnesses. Every year, we see a significant increase in patient visits for diarrhea, typhoid, dengue, and leptospirosis during the rainy months.</p>
      <p>At NITA Clinic, we've compiled practical, doctor-approved tips to help you and your family stay healthy throughout the monsoon season.</p>

      <h2>1. Drink Only Safe Water</h2>
      <p>The most critical step during monsoon is ensuring the water you drink is safe. Contaminated water is the primary cause of typhoid, cholera, and hepatitis A.</p>
      <ul>
        <li>Always boil tap water for at least one minute before drinking</li>
        <li>Use a water purifier with UV or RO filtration</li>
        <li>Avoid street-side drinks, sugarcane juice, and untreated water</li>
        <li>When eating out, request bottled or purified water</li>
      </ul>

      <h2>2. Be Careful with Food</h2>
      <p>Food contamination rises sharply during monsoon. Flies and insects carry pathogens from garbage to your food, and the warm, humid weather accelerates bacterial growth.</p>
      <ul>
        <li>Avoid raw salads and cut fruits from street vendors</li>
        <li>Eat freshly cooked, hot meals whenever possible</li>
        <li>Wash vegetables and fruits thoroughly before cooking</li>
        <li>Keep kitchen surfaces clean and dry</li>
        <li>Refrigerate leftovers immediately and reheat thoroughly</li>
      </ul>

      <h2>3. Protect Against Dengue and Malaria</h2>
      <p>Standing water is the breeding ground for mosquitoes that carry dengue and malaria. Kathmandu has seen increasing dengue cases during recent monsoon seasons.</p>
      <ul>
        <li>Empty and clean all containers that collect water (flower pots, buckets, tyres)</li>
        <li>Use mosquito nets, especially for children and elderly</li>
        <li>Apply mosquito repellent when outdoors</li>
        <li>Wear long sleeves and pants during early morning and evening</li>
        <li>Seek immediate medical attention for sudden high fever with body aches</li>
      </ul>

      <h2>4. Respiratory Health During Monsoon</h2>
      <p>The increased humidity and temperature fluctuations during monsoon can trigger respiratory issues, especially in children and those with asthma or chronic lung disease.</p>
      <ul>
        <li>Keep your home well-ventilated to prevent mold growth</li>
        <li>Change wet clothes immediately after getting drenched</li>
        <li>Wash hands frequently, especially before meals</li>
        <li>If you have asthma, keep your inhaler accessible at all times</li>
      </ul>

      <h2>5. Leptospirosis — The Hidden Monsoon Risk</h2>
      <p>Leptospirosis is a bacterial infection spread through contact with water or soil contaminated by animal urine. It's often contracted by walking through flooded streets barefoot.</p>
      <ul>
        <li>Always wear proper footwear when walking through puddles or flooded areas</li>
        <li>Wash and dry your feet thoroughly after exposure to floodwater</li>
        <li>Seek medical care if you develop fever, headache, and muscle pain after flood exposure</li>
      </ul>

      <h2>6. When to See a Doctor Immediately</h2>
      <p>Some monsoon illnesses can escalate quickly. Don't delay — visit NITA Clinic or your nearest health facility if you experience:</p>
      <ul>
        <li>High fever (above 38.5°C / 101.3°F) for more than 2 days</li>
        <li>Severe diarrhea or vomiting with signs of dehydration</li>
        <li>Skin rashes with fever</li>
        <li>Difficulty breathing or chest pain</li>
        <li>Yellowing of eyes or skin (jaundice)</li>
      </ul>

      <h2>Vaccination — Your Best Shield</h2>
      <p>Several monsoon illnesses are vaccine-preventable. We recommend ensuring you and your family are up to date on:</p>
      <ul>
        <li>Typhoid vaccine (especially important for children)</li>
        <li>Hepatitis A vaccine</li>
        <li>Cholera vaccine (for high-risk individuals)</li>
      </ul>
      <p>Visit our vaccination clinic to check which vaccines you or your family may need.</p>

      <blockquote>Stay hydrated, eat well, and don't ignore early symptoms. Monsoon health protection starts with simple daily habits.</blockquote>

      <p>If you have any concerns about your health or need a lab test, NITA Clinic is open 7 days a week. Call us at +977 01-4533361 or book an appointment online.</p>
    `,
  },
  {
    id: 'b2',
    title: 'Why Adults and Children Both Need Regular Vaccination',
    slug: 'adults-and-kids-need-vaccination',
    excerpt: 'Immunization is not just for children. Discover which vaccines adults should keep updated and why they matter for lifelong health.',
    featuredImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=85',
    author: 'Dr. Nita Clinic Team',
    authorRole: 'Vaccination Specialist',
    category: 'Vaccination',
    tags: ['vaccination', 'immunization', 'adult vaccines', 'preventive care'],
    isPublished: true,
    publishedAt: '2026-02-20T08:00:00Z',
    views: 980,
    readingTime: 4,
    content: `
      <h2>Vaccination Is Not Just for Children</h2>
      <p>Most people associate vaccination with childhood immunization schedules. However, immunity from certain childhood vaccines wanes over time, and many adults remain unprotected from diseases that vaccines can prevent. At NITA Clinic, we strongly advocate for adult vaccination as an essential part of preventive healthcare.</p>

      <h2>Why Do Adults Need Vaccines?</h2>
      <p>There are several important reasons why adults require vaccination:</p>
      <ul>
        <li><strong>Waning immunity:</strong> Some childhood vaccines lose effectiveness over time and require booster doses</li>
        <li><strong>New vaccines:</strong> Several vaccines were not available when today's adults were children</li>
        <li><strong>Age-related vulnerability:</strong> Older adults are more susceptible to complications from preventable diseases</li>
        <li><strong>Occupational risks:</strong> Healthcare workers, teachers, and travellers face higher exposure risks</li>
        <li><strong>Community protection:</strong> Vaccinated adults protect vulnerable people around them (herd immunity)</li>
      </ul>

      <h2>Recommended Vaccines for Adults</h2>

      <h3>Influenza (Flu) Vaccine — Annually</h3>
      <p>Flu viruses change every year. Annual flu vaccination is recommended for all adults, especially those over 50, pregnant women, healthcare workers, and people with chronic diseases. Influenza can cause serious complications including pneumonia.</p>

      <h3>Tetanus, Diphtheria & Pertussis (Tdap) — Every 10 Years</h3>
      <p>Even if you were vaccinated as a child, tetanus protection needs a booster every 10 years. If you haven't had a booster in the last 10 years, it's time. The pertussis (whooping cough) component is especially important for adults who are around infants.</p>

      <h3>Hepatitis B Vaccine</h3>
      <p>If you were not vaccinated as a child or are unsure of your status, a 3-dose hepatitis B vaccine series is recommended. This is especially important for healthcare workers, those with multiple sexual partners, and people who travel frequently.</p>

      <h3>Hepatitis A Vaccine</h3>
      <p>Hepatitis A is spread through contaminated food and water. In Nepal, where food safety standards vary, hepatitis A vaccination is especially recommended for travellers and people who frequently eat outside.</p>

      <h3>Typhoid Vaccine</h3>
      <p>Typhoid is endemic in Nepal and South Asia. Adults who frequently travel or live in areas with poor sanitation should ensure they are vaccinated. Booster doses are typically needed every 2–3 years.</p>

      <h2>Vaccines for Older Adults (60+)</h2>
      <p>As we age, our immune systems become less effective, making us more vulnerable to severe illness. We particularly recommend:</p>
      <ul>
        <li><strong>Pneumococcal vaccine</strong> — protects against pneumonia and meningitis</li>
        <li><strong>Shingles (Herpes Zoster) vaccine</strong> — reduces the risk of painful shingles outbreaks</li>
        <li><strong>Annual influenza vaccine</strong></li>
        <li><strong>COVID-19 boosters</strong> as recommended by Nepal's health guidelines</li>
      </ul>

      <h2>Vaccines During Pregnancy</h2>
      <p>Pregnant women and their unborn babies benefit significantly from vaccination. We recommend:</p>
      <ul>
        <li><strong>Tdap vaccine</strong> — protects the newborn from pertussis before they can be vaccinated</li>
        <li><strong>Influenza vaccine</strong> — safe during pregnancy and protects both mother and newborn</li>
      </ul>

      <h2>How to Check Your Vaccination Status</h2>
      <p>If you're unsure about which vaccines you've received, our team at NITA Clinic can help you review your medical history and check immunity levels through blood tests (antibody titres) for certain diseases.</p>

      <blockquote>Prevention is always better and cheaper than treatment. One vaccine today can prevent weeks of illness, hospitalization, and complications tomorrow.</blockquote>

      <p>Visit our vaccination clinic for a personalized immunization consultation. We offer all major adult vaccines at competitive prices.</p>
    `,
  },
  {
    id: 'b3',
    title: 'Understanding Preventive Health Check-up Packages',
    slug: 'understanding-preventive-checkup-packages',
    excerpt: 'Choosing the right check-up package can catch health problems early. A guide to our male and female preventive health plans.',
    featuredImage: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=1200&q=85',
    author: 'Nita Path Labs',
    authorRole: 'Lab Specialist',
    category: 'Check-up',
    tags: ['health checkup', 'preventive care', 'lab tests', 'packages'],
    isPublished: true,
    publishedAt: '2026-01-10T08:00:00Z',
    views: 1560,
    readingTime: 6,
    content: `
      <h2>Why Regular Health Check-ups Matter</h2>
      <p>Most serious health conditions — including diabetes, hypertension, thyroid disorders, and many cancers — develop silently without obvious symptoms for months or years. Regular preventive health check-ups are designed to detect these conditions early, when treatment is most effective and least costly.</p>
      <p>At NITA Clinic, we offer comprehensive health check-up packages for men, women, and specialized screenings — designed to give you a complete picture of your health.</p>

      <h2>What Is Included in a Typical Health Package?</h2>
      <p>Our health packages cover multiple systems of the body through lab tests, imaging, and clinical consultations. Here's what you can typically expect:</p>

      <h3>Blood Tests</h3>
      <ul>
        <li><strong>Complete Blood Count (CBC)</strong> — checks red/white blood cells, hemoglobin, platelets</li>
        <li><strong>Blood Sugar (Fasting & PP)</strong> — screens for diabetes and pre-diabetes</li>
        <li><strong>HbA1c</strong> — 3-month average blood sugar indicator (important for diabetics)</li>
        <li><strong>Lipid Profile</strong> — measures cholesterol levels and heart disease risk</li>
        <li><strong>Liver Function Tests (LFT)</strong> — assesses liver health</li>
        <li><strong>Kidney Function Tests (KFT)</strong> — screens for kidney disease</li>
        <li><strong>Thyroid Function Tests (TFT)</strong> — checks for hypothyroidism/hyperthyroidism</li>
      </ul>

      <h3>Urine & Stool Tests</h3>
      <ul>
        <li>Complete Urinalysis — screens for urinary tract infections and kidney issues</li>
        <li>Stool routine examination (selected packages)</li>
      </ul>

      <h3>Imaging</h3>
      <ul>
        <li>Ultrasound of abdomen — checks liver, gallbladder, kidneys, spleen, and uterus/ovaries</li>
        <li>Chest X-ray — screens for lung and cardiac issues</li>
      </ul>

      <h3>Cardiac Screening</h3>
      <ul>
        <li>ECG (Electrocardiogram) — checks heart rhythm and electrical activity</li>
      </ul>

      <h2>Women's Specific Screenings</h2>
      <p>Our female health packages include additional tests that are particularly important for women:</p>
      <ul>
        <li><strong>PAP Smear</strong> — screens for cervical cancer (recommended every 1–3 years for women 21+)</li>
        <li><strong>Pelvic Ultrasound</strong> — checks for ovarian cysts, fibroids, and uterine abnormalities</li>
        <li><strong>Breast Examination</strong> — clinical breast exam by a specialist</li>
        <li><strong>CA-125</strong> — ovarian cancer marker (selected packages)</li>
        <li><strong>Hormonal profile</strong> — FSH, LH, estradiol for reproductive health</li>
      </ul>

      <h2>How to Choose the Right Package</h2>
      <p>The right package depends on several factors:</p>
      <ul>
        <li><strong>Age:</strong> Younger adults (20–35) benefit from basic screenings; older adults need more comprehensive panels</li>
        <li><strong>Family history:</strong> If diabetes, heart disease, or cancer runs in your family, prioritize those screenings</li>
        <li><strong>Lifestyle:</strong> Smokers need lung and cardiovascular screening; sedentary professionals benefit from metabolic panels</li>
        <li><strong>Gender-specific needs:</strong> Women need gynecological screenings; men may need PSA testing after 45</li>
      </ul>

      <h2>How Often Should You Get Checked?</h2>
      <ul>
        <li><strong>Age 20–35, healthy:</strong> Every 2–3 years</li>
        <li><strong>Age 35–50:</strong> Annually</li>
        <li><strong>Age 50+:</strong> Every 6–12 months</li>
        <li><strong>With chronic diseases (diabetes, hypertension):</strong> Every 3–6 months as advised</li>
      </ul>

      <h2>Preparing for Your Check-up</h2>
      <p>For accurate results, especially for fasting blood tests:</p>
      <ul>
        <li>Fast for 8–12 hours (water is allowed)</li>
        <li>Avoid strenuous exercise the day before</li>
        <li>Bring any previous reports for comparison</li>
        <li>List all current medications to discuss with your doctor</li>
      </ul>

      <blockquote>A health check-up is not just a test — it's a conversation with your body. Early detection saves lives and reduces healthcare costs dramatically.</blockquote>

      <p>Book your health check-up package at NITA Clinic today. Our packages start from NPR 1,500 and include a post-test consultation with our doctors to explain your results.</p>
    `,
  },
  {
    id: 'b4',
    title: 'Early Signs of Diabetes You Should Never Ignore',
    slug: 'early-signs-of-diabetes',
    excerpt: 'Type 2 diabetes develops silently. Recognizing the early warning signs can prevent serious complications down the line.',
    featuredImage: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=85',
    author: 'Dr. Nita Clinic Team',
    authorRole: 'Internal Medicine',
    category: 'Disease Awareness',
    tags: ['diabetes', 'blood sugar', 'early detection', 'lifestyle'],
    isPublished: true,
    publishedAt: '2025-12-05T08:00:00Z',
    views: 2100,
    readingTime: 5,
    content: `
      <h2>The Silent Epidemic: Type 2 Diabetes</h2>
      <p>Diabetes affects millions of people in Nepal and South Asia, yet many are diagnosed only after complications have already developed. Type 2 diabetes is particularly deceptive — it can progress for years without obvious symptoms while quietly damaging your kidneys, eyes, nerves, and heart.</p>
      <p>Knowing the early warning signs can help you seek diagnosis and treatment before serious damage occurs.</p>

      <h2>8 Early Warning Signs of Diabetes</h2>

      <h3>1. Frequent Urination (Polyuria)</h3>
      <p>When blood sugar is high, the kidneys work overtime to filter and absorb the excess glucose. This leads to frequent urination, particularly at night (nocturia). If you find yourself waking up multiple times to urinate, it warrants investigation.</p>

      <h3>2. Excessive Thirst (Polydipsia)</h3>
      <p>Frequent urination causes dehydration, leading to constant thirst. You may drink large quantities of water but still feel thirsty. This cycle of thirst and urination is a classic early sign.</p>

      <h3>3. Unexplained Weight Loss</h3>
      <p>Despite eating normally or even more than usual, people with uncontrolled diabetes often lose weight. This happens because the body cannot use glucose for energy and starts breaking down fat and muscle instead.</p>

      <h3>4. Extreme Fatigue</h3>
      <p>When cells can't absorb glucose efficiently, they are starved of energy. This causes persistent fatigue that doesn't improve with rest.</p>

      <h3>5. Blurred Vision</h3>
      <p>High blood sugar causes the lens of the eye to swell, leading to blurred or fluctuating vision. This is often an early sign and should not be dismissed as just "eye strain."</p>

      <h3>6. Slow-Healing Wounds</h3>
      <p>Diabetes impairs blood flow and the immune response, causing even small cuts and bruises to heal slowly. Recurring skin infections or wounds that don't heal are a red flag.</p>

      <h3>7. Tingling or Numbness in Hands/Feet</h3>
      <p>Nerve damage (diabetic neuropathy) can begin early, causing tingling, numbness, or burning sensations in the extremities. This is often experienced as "pins and needles."</p>

      <h3>8. Darkened Skin Patches (Acanthosis Nigricans)</h3>
      <p>Dark, velvety patches of skin in the neck creases, armpits, or groin are a sign of insulin resistance — a precursor to Type 2 diabetes. This is particularly common in South Asian populations.</p>

      <h2>Risk Factors You Should Know</h2>
      <ul>
        <li>Family history of diabetes</li>
        <li>Overweight or obesity (especially abdominal fat)</li>
        <li>Age over 45</li>
        <li>Sedentary lifestyle</li>
        <li>History of gestational diabetes</li>
        <li>Polycystic ovary syndrome (PCOS)</li>
        <li>High blood pressure or high cholesterol</li>
      </ul>

      <h2>How Is Diabetes Diagnosed?</h2>
      <p>A simple blood test can diagnose or rule out diabetes. At NITA Path Labs, we offer:</p>
      <ul>
        <li><strong>Fasting Blood Sugar (FBS)</strong> — done after 8 hours of fasting</li>
        <li><strong>Post-prandial Blood Sugar (PPBS)</strong> — done 2 hours after eating</li>
        <li><strong>HbA1c</strong> — reflects average blood sugar over 3 months (no fasting required)</li>
        <li><strong>Oral Glucose Tolerance Test (OGTT)</strong> — gold standard for diagnosis</li>
      </ul>

      <h2>Can Diabetes Be Prevented?</h2>
      <p>Lifestyle changes can significantly reduce the risk of developing Type 2 diabetes:</p>
      <ul>
        <li>Maintain a healthy weight — even losing 5–7% of body weight reduces risk substantially</li>
        <li>Exercise regularly — aim for 150 minutes of moderate activity per week</li>
        <li>Eat a balanced diet rich in fiber and low in refined sugars</li>
        <li>Avoid smoking and excessive alcohol</li>
        <li>Get regular screenings, especially if you have risk factors</li>
      </ul>

      <blockquote>Don't wait for symptoms to become severe. A simple blood test today could save you from a lifetime of complications.</blockquote>
    `,
  },
  {
    id: 'b5',
    title: 'Understanding Tuberculosis: Symptoms, Diagnosis & Treatment',
    slug: 'understanding-tuberculosis',
    excerpt: 'TB remains a major public health concern in Nepal. Learn how to recognize symptoms, how diagnosis works, and what modern treatment involves.',
    featuredImage: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=1200&q=85',
    author: 'Dr. Nita Clinic Team',
    authorRole: 'Pulmonology & TB Specialist',
    category: 'Disease Awareness',
    tags: ['tuberculosis', 'TB', 'respiratory', 'diagnosis', 'DOTS'],
    isPublished: true,
    publishedAt: '2025-11-18T08:00:00Z',
    views: 1890,
    readingTime: 7,
    content: `
      <h2>Tuberculosis in Nepal: A Persistent Challenge</h2>
      <p>Despite significant progress in global TB control, Nepal continues to face a high burden of tuberculosis. Nepal is classified as one of the high TB burden countries by the WHO. With approximately 69,000 new TB cases estimated annually, TB remains one of the leading infectious disease killers in the country.</p>
      <p>The good news: TB is treatable, and with proper diagnosis and adherence to treatment, most patients recover fully.</p>

      <h2>What Is Tuberculosis?</h2>
      <p>Tuberculosis is a bacterial infection caused by <em>Mycobacterium tuberculosis</em>. While it primarily affects the lungs (pulmonary TB), it can also affect other organs including the lymph nodes, spine, kidneys, and brain (extrapulmonary TB).</p>
      <p>TB spreads through the air when an infected person coughs, sneezes, or speaks. It is NOT spread through touch, sharing utensils, or sexual contact.</p>

      <h2>Recognizing the Symptoms</h2>
      <h3>Pulmonary (Lung) TB — Classic Symptoms</h3>
      <ul>
        <li>Persistent cough lasting more than 2–3 weeks</li>
        <li>Coughing up blood or blood-stained sputum (hemoptysis)</li>
        <li>Chest pain or tightness</li>
        <li>Shortness of breath</li>
      </ul>

      <h3>Systemic (Whole Body) Symptoms</h3>
      <ul>
        <li>Fever, especially in the evenings</li>
        <li>Night sweats (soaking the bedclothes)</li>
        <li>Unintentional weight loss</li>
        <li>Extreme fatigue and weakness</li>
        <li>Loss of appetite</li>
      </ul>

      <h2>Latent vs. Active TB</h2>
      <p>Not everyone infected with TB becomes sick immediately. Understanding the difference is important:</p>
      <ul>
        <li><strong>Latent TB:</strong> The bacteria are dormant in the body. The person has no symptoms and is NOT contagious. However, latent TB can reactivate, especially if the immune system weakens.</li>
        <li><strong>Active TB:</strong> The bacteria are active, causing symptoms and making the person contagious. Immediate treatment is essential.</li>
      </ul>

      <h2>Diagnosis at NITA Clinic</h2>
      <p>We offer comprehensive TB diagnosis using the most current methods:</p>
      <ul>
        <li><strong>Sputum Smear Microscopy</strong> — traditional, fast, detects active pulmonary TB</li>
        <li><strong>GeneXpert MTB/RIF</strong> — highly accurate, results in 2 hours, also detects drug resistance (MDR-TB)</li>
        <li><strong>Chest X-ray</strong> — visualizes lung lesions and disease extent</li>
        <li><strong>Tuberculin Skin Test (Mantoux)</strong> — screens for latent TB infection</li>
        <li><strong>IGRA Blood Test</strong> — modern blood test for latent TB</li>
        <li><strong>TB Culture</strong> — gold standard, confirms diagnosis and drug sensitivity (takes 2–8 weeks)</li>
      </ul>

      <h2>Treatment: The DOTS Strategy</h2>
      <p>TB is treated with a combination of antibiotics, typically over 6 months. Nepal follows the WHO-recommended Directly Observed Treatment, Short-course (DOTS) strategy.</p>
      <ul>
        <li><strong>First 2 months (Intensive Phase):</strong> 4 drugs — Isoniazid, Rifampicin, Pyrazinamide, Ethambutol</li>
        <li><strong>Next 4 months (Continuation Phase):</strong> 2 drugs — Isoniazid, Rifampicin</li>
      </ul>
      <p><strong>Critical:</strong> It is essential to complete the full course of treatment, even if you feel better after a few weeks. Stopping early leads to drug-resistant TB (MDR-TB), which is much harder and more expensive to treat.</p>

      <h2>Who Is at Higher Risk?</h2>
      <ul>
        <li>People living with HIV</li>
        <li>Close contacts of active TB patients</li>
        <li>Malnourished individuals</li>
        <li>Diabetics (3x higher risk)</li>
        <li>Smokers and heavy alcohol users</li>
        <li>Healthcare workers</li>
        <li>People in overcrowded living conditions</li>
      </ul>

      <h2>Prevention</h2>
      <ul>
        <li><strong>BCG vaccination</strong> for all newborns — protects against severe forms of TB in children</li>
        <li>Ensure good ventilation in living and working spaces</li>
        <li>Cover mouth when coughing or sneezing</li>
        <li>Complete treatment for latent TB if recommended by your doctor</li>
        <li>Get screened if you've been in close contact with a TB patient</li>
      </ul>

      <blockquote>TB is curable. The key is early detection and completing the full course of treatment. Don't ignore a cough that persists for more than 2–3 weeks.</blockquote>

      <p>NITA Clinic's TB clinic offers free or subsidized TB testing under government programs. Contact us for details.</p>
    `,
  },
  {
    id: 'b6',
    title: 'Heart Health: Managing Blood Pressure Naturally',
    slug: 'managing-blood-pressure-naturally',
    excerpt: 'Hypertension is a silent killer. Here are proven lifestyle strategies to keep your blood pressure in a healthy range without relying solely on medications.',
    featuredImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&q=85',
    author: 'Dr. Nita Clinic Team',
    authorRole: 'Cardiology',
    category: 'Heart Health',
    tags: ['hypertension', 'blood pressure', 'heart health', 'lifestyle'],
    isPublished: true,
    publishedAt: '2025-10-22T08:00:00Z',
    views: 1450,
    readingTime: 6,
    content: `
      <h2>The Silent Killer: Hypertension in Nepal</h2>
      <p>High blood pressure (hypertension) affects an estimated 1 in 4 adults in Nepal, yet many don't know they have it — because it rarely causes symptoms until it has caused serious damage to the heart, kidneys, eyes, or brain.</p>
      <p>The good news: blood pressure is highly controllable, and for many people with mildly elevated readings, lifestyle changes alone can bring it into a healthy range.</p>

      <h2>Understanding Blood Pressure Numbers</h2>
      <ul>
        <li><strong>Normal:</strong> Below 120/80 mmHg</li>
        <li><strong>Elevated:</strong> 120–129 systolic, below 80 diastolic</li>
        <li><strong>Stage 1 Hypertension:</strong> 130–139/80–89 mmHg</li>
        <li><strong>Stage 2 Hypertension:</strong> 140+ / 90+ mmHg</li>
        <li><strong>Hypertensive Crisis:</strong> Above 180/120 — requires immediate medical attention</li>
      </ul>

      <h2>1. The DASH Diet — Proven to Lower Blood Pressure</h2>
      <p>The Dietary Approaches to Stop Hypertension (DASH) diet is the gold standard for blood pressure management through nutrition.</p>
      <ul>
        <li>Increase fruits, vegetables, and whole grains</li>
        <li>Choose low-fat dairy products</li>
        <li>Limit red meat, sweets, and sugary beverages</li>
        <li>Include nuts, seeds, and legumes</li>
        <li>Reduce sodium (salt) intake to less than 2,300 mg/day</li>
      </ul>

      <h2>2. Reduce Salt (Sodium) Intake</h2>
      <p>The Nepal diet is often high in salt through pickles, achaar, processed foods, and heavy seasoning. Reducing sodium intake can lower blood pressure by 5–6 mmHg in some people.</p>
      <ul>
        <li>Don't add extra salt at the table</li>
        <li>Limit achaar, pickles, and processed snacks</li>
        <li>Read labels on packaged foods</li>
        <li>Use herbs and spices for flavour instead of salt</li>
      </ul>

      <h2>3. Regular Physical Activity</h2>
      <p>Regular aerobic exercise can lower blood pressure by 5–8 mmHg. Aim for:</p>
      <ul>
        <li>At least 150 minutes of moderate activity per week (brisk walking, cycling, swimming)</li>
        <li>Or 75 minutes of vigorous activity per week</li>
        <li>Include strength training 2 days per week</li>
      </ul>

      <h2>4. Maintain a Healthy Weight</h2>
      <p>Blood pressure rises with excess weight. For every 10 kg of weight lost, blood pressure can drop by 5–20 mmHg. Even modest weight loss has significant benefits.</p>

      <h2>5. Limit Alcohol</h2>
      <p>Excessive alcohol raises blood pressure and reduces the effectiveness of blood pressure medications. Limit to no more than 1 drink/day for women and 2 drinks/day for men.</p>

      <h2>6. Quit Smoking</h2>
      <p>Each cigarette temporarily raises blood pressure. Long-term smoking damages blood vessel walls, contributing to chronic hypertension and dramatically increasing cardiovascular risk.</p>

      <h2>7. Stress Management</h2>
      <p>Chronic stress contributes to elevated blood pressure. Practice:</p>
      <ul>
        <li>Yoga and breathing exercises (pranayama)</li>
        <li>Meditation or mindfulness</li>
        <li>Adequate sleep (7–9 hours per night)</li>
        <li>Taking breaks from screens and stressful work</li>
      </ul>

      <h2>8. Monitor Your Blood Pressure at Home</h2>
      <p>Home monitoring helps you track whether your lifestyle changes are working and provides more accurate readings than occasional clinic visits. We recommend a validated automated upper arm blood pressure monitor.</p>

      <blockquote>You don't always need medications to control blood pressure. But you do need to be consistent. Small daily habits add up to dramatically better cardiovascular health.</blockquote>

      <p>If your blood pressure is above 140/90 despite lifestyle changes, medication may be necessary. Consult our doctors at NITA Clinic for a personalized management plan.</p>
    `,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return FALLBACK_BLOG_POSTS.find((p) => p.slug === slug);
}
