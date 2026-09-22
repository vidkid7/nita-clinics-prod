import Link from 'next/link';
import { BRAND } from '@/lib/brand';

const EFFECTIVE_DATE = 'September 22, 2026';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-neutral-50">
      <section className="relative overflow-hidden bg-primary-950 py-16 text-white md:py-20">
        <div className="pointer-events-none absolute inset-0 plus-pattern opacity-[0.08]" aria-hidden="true" />
        <div className="container-custom relative">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-teal-300">Legal · Your privacy matters</p>
          <h1 className="max-w-3xl font-heading text-4xl font-bold leading-tight md:text-5xl">Privacy Policy</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-primary-100 md:text-lg">
            This policy explains how Nita Clinic handles information shared through our website,
            appointment requests, enquiries, and related digital services.
          </p>
          <p className="mt-6 text-sm text-primary-300">Effective date: {EFFECTIVE_DATE}</p>
        </div>
      </section>

      <article className="container-custom py-12 md:py-16">
        <div className="mx-auto max-w-3xl space-y-10 text-[15px] leading-7 text-neutral-700">
          <section aria-labelledby="scope">
            <h2 id="scope" className="font-heading text-2xl font-bold text-neutral-900">1. Scope of this policy</h2>
            <p className="mt-3">
              This policy applies to the public Nita Clinic website and information you submit through
              forms or other features on it. Nita Clinic is a healthcare provider in Kathmandu, Nepal,
              operating from {BRAND.addressFull}.
            </p>
            <p className="mt-3">
              By using the website, you acknowledge that you have read this policy. If you do not agree
              with it, please do not submit personal information through the site.
            </p>
          </section>

          <section aria-labelledby="collect">
            <h2 id="collect" className="font-heading text-2xl font-bold text-neutral-900">2. Information we may collect</h2>
            <p className="mt-3">Depending on how you use the website, we may receive:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li><strong>Contact information:</strong> name, phone number, email address, and preferred contact method.</li>
              <li><strong>Appointment information:</strong> requested service, preferred date or time, and any details you choose to include in a message.</li>
              <li><strong>Enquiry information:</strong> the subject and content of a message sent to the clinic.</li>
              <li><strong>Technical information:</strong> device, browser, approximate location, pages visited, and diagnostic data needed to keep the website secure and reliable.</li>
            </ul>
            <p className="mt-3">
              Please share only information needed to help us respond. Do not use a public website form
              to send emergency information or highly sensitive medical records.
            </p>
          </section>

          <section aria-labelledby="use">
            <h2 id="use" className="font-heading text-2xl font-bold text-neutral-900">3. How we use information</h2>
            <p className="mt-3">We may use submitted information to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>respond to questions and appointment requests;</li>
              <li>confirm, reschedule, or follow up on a requested visit or service;</li>
              <li>provide information about clinic services when relevant to your enquiry;</li>
              <li>operate, troubleshoot, secure, and improve the website; and</li>
              <li>meet applicable legal, clinical, accounting, or safety obligations.</li>
            </ul>
            <p className="mt-3">
              Submitting an appointment request does not by itself guarantee an appointment. The clinic
              may contact you to verify details and confirm availability.
            </p>
          </section>

          <section aria-labelledby="sharing">
            <h2 id="sharing" className="font-heading text-2xl font-bold text-neutral-900">4. When information may be shared</h2>
            <p className="mt-3">
              We do not sell your personal information. We may share the minimum information needed with
              trusted providers that help us host the website, store appointment data, deliver email, or
              protect our systems. Those providers may process information only for the services they
              provide to us.
            </p>
            <p className="mt-3">
              We may also disclose information when required by law, to protect patients or the public,
              to prevent fraud or abuse, or as part of a lawful business or service transition.
            </p>
          </section>

          <section aria-labelledby="cookies">
            <h2 id="cookies" className="font-heading text-2xl font-bold text-neutral-900">5. Cookies and technical data</h2>
            <p className="mt-3">
              The website may use essential browser storage, cookies, or similar technologies to keep
              pages working, remember preferences, measure performance, and help us detect abuse. You can
              manage cookies through your browser settings, although disabling essential storage may affect
              some features.
            </p>
          </section>

          <section aria-labelledby="retention">
            <h2 id="retention" className="font-heading text-2xl font-bold text-neutral-900">6. Retention and security</h2>
            <p className="mt-3">
              We keep information only for as long as reasonably needed for the purpose it was collected,
              to provide care or support, to maintain business records, or to meet legal obligations. We
              use reasonable administrative, technical, and organisational safeguards, but no internet
              transmission or storage system can be guaranteed completely secure.
            </p>
          </section>

          <section aria-labelledby="rights">
            <h2 id="rights" className="font-heading text-2xl font-bold text-neutral-900">7. Your choices and requests</h2>
            <p className="mt-3">
              You may contact us to ask what information we hold about you, request a correction, or ask
              us to stop using information for a particular enquiry where permitted by applicable law. We
              may need to verify your identity before completing a request and may retain information we
              are legally required to keep.
            </p>
          </section>

          <section aria-labelledby="children">
            <h2 id="children" className="font-heading text-2xl font-bold text-neutral-900">8. Children and medical emergencies</h2>
            <p className="mt-3">
              A parent or authorised guardian should submit information for a child. This website is not
              an emergency service and is not a substitute for urgent medical care. For an emergency,
              contact local emergency services or go to the nearest emergency department.
            </p>
          </section>

          <section aria-labelledby="changes">
            <h2 id="changes" className="font-heading text-2xl font-bold text-neutral-900">9. Changes to this policy</h2>
            <p className="mt-3">
              We may update this policy when our services, technology, or legal obligations change. The
              effective date at the top of this page shows when the current version was published.
            </p>
          </section>

          <section aria-labelledby="contact" className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft md:p-8">
            <h2 id="contact" className="font-heading text-2xl font-bold text-neutral-900">10. Contact us</h2>
            <p className="mt-3">For privacy questions or requests, contact Nita Clinic:</p>
            <address className="mt-4 not-italic text-neutral-700">
              <strong className="text-neutral-900">Nita Clinic</strong><br />
              {BRAND.addressFull}<br />
              <a className="font-semibold text-primary-700 underline decoration-primary-200 underline-offset-4 hover:text-primary-900" href={`mailto:${BRAND.email}`}>{BRAND.email}</a><br />
              <a className="font-semibold text-primary-700 underline decoration-primary-200 underline-offset-4 hover:text-primary-900" href={`tel:${BRAND.phone.replace(/[^0-9+]/g, '')}`}>{BRAND.phone}</a>
            </address>
            <p className="mt-6 text-sm text-neutral-500">
              You can also return to the <Link href="/contact" className="font-semibold text-primary-700 hover:text-primary-900">Contact Us</Link> page for general enquiries.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
