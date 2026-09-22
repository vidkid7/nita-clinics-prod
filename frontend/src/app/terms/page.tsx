import Link from 'next/link';
import { BRAND } from '@/lib/brand';

const EFFECTIVE_DATE = 'September 22, 2026';

export default function TermsOfServicePage() {
  return (
    <div className="bg-neutral-50">
      <section className="relative overflow-hidden bg-primary-950 py-16 text-white md:py-20">
        <div className="pointer-events-none absolute inset-0 plus-pattern opacity-[0.08]" aria-hidden="true" />
        <div className="container-custom relative">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-teal-300">Legal · Clear expectations</p>
          <h1 className="max-w-3xl font-heading text-4xl font-bold leading-tight md:text-5xl">Terms of Service</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-primary-100 md:text-lg">
            These terms explain the rules for using the Nita Clinic website and submitting requests for
            appointments or healthcare services.
          </p>
          <p className="mt-6 text-sm text-primary-300">Effective date: {EFFECTIVE_DATE}</p>
        </div>
      </section>

      <article className="container-custom py-12 md:py-16">
        <div className="mx-auto max-w-3xl space-y-10 text-[15px] leading-7 text-neutral-700">
          <section aria-labelledby="acceptance">
            <h2 id="acceptance" className="font-heading text-2xl font-bold text-neutral-900">1. Acceptance of these terms</h2>
            <p className="mt-3">
              By accessing or using this website, you agree to these Terms of Service and our{' '}
              <Link href="/privacy" className="font-semibold text-primary-700 underline decoration-primary-200 underline-offset-4 hover:text-primary-900">Privacy Policy</Link>.
              If you do not agree, please stop using the website. “Nita Clinic”, “we”, “us”, and “our” refer
              to the clinic operating from {BRAND.addressFull}.
            </p>
          </section>

          <section aria-labelledby="website">
            <h2 id="website" className="font-heading text-2xl font-bold text-neutral-900">2. Website information</h2>
            <p className="mt-3">
              We aim to keep service descriptions, prices, opening hours, clinician information, and other
              content useful and current. Details can change without notice, and website content may contain
              errors or omissions. Please confirm important information with the clinic before relying on it.
            </p>
            <p className="mt-3">
              Website content is general information only. It is not a diagnosis, prescription, or substitute
              for an examination or advice from a qualified healthcare professional.
            </p>
          </section>

          <section aria-labelledby="appointments">
            <h2 id="appointments" className="font-heading text-2xl font-bold text-neutral-900">3. Appointment requests</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>An online form sends a request; it does not guarantee a slot or create a doctor-patient relationship.</li>
              <li>You must provide accurate contact details and promptly tell us if they change.</li>
              <li>The clinic may contact you by phone or email to verify the request, discuss availability, or arrange a different time.</li>
              <li>Please arrive on time and contact the clinic as soon as possible if you need to cancel or reschedule.</li>
              <li>Fees, availability, and service requirements may vary. The clinic will communicate applicable charges before care where reasonably possible.</li>
            </ul>
          </section>

          <section aria-labelledby="medical">
            <h2 id="medical" className="font-heading text-2xl font-bold text-neutral-900">4. Medical and emergency information</h2>
            <p className="mt-3">
              Nita Clinic provides healthcare services through its clinical team, subject to professional
              assessment and applicable clinical policies. Information on this website cannot account for your
              complete medical history or individual circumstances.
            </p>
            <p className="mt-3 font-semibold text-neutral-900">
              This website is not an emergency service. If you have a medical emergency, contact local
              emergency services or go to the nearest emergency department instead of waiting for an online reply.
            </p>
          </section>

          <section aria-labelledby="acceptable-use">
            <h2 id="acceptable-use" className="font-heading text-2xl font-bold text-neutral-900">5. Acceptable use</h2>
            <p className="mt-3">You agree not to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>use the website for unlawful, fraudulent, abusive, or harmful activity;</li>
              <li>submit another person’s information without appropriate authority;</li>
              <li>attempt to gain unauthorised access to the website, accounts, systems, or data;</li>
              <li>introduce malware, scrape or overload the website, or interfere with another visitor’s use; or</li>
              <li>copy, republish, or exploit website content except as permitted by law or with written permission.</li>
            </ul>
          </section>

          <section aria-labelledby="accounts">
            <h2 id="accounts" className="font-heading text-2xl font-bold text-neutral-900">6. Accounts and communications</h2>
            <p className="mt-3">
              If a feature requires an account, you are responsible for keeping access details confidential
              and for activity carried out through your account. You agree that we may send service-related
              communications about requests, appointments, reports, or changes to the website using the contact
              details you provide.
            </p>
          </section>

          <section aria-labelledby="ownership">
            <h2 id="ownership" className="font-heading text-2xl font-bold text-neutral-900">7. Content and intellectual property</h2>
            <p className="mt-3">
              Unless stated otherwise, the website design, branding, text, graphics, photographs, and software
              are owned by or licensed to Nita Clinic. We grant you a limited, revocable, non-exclusive right to
              access the website for personal, non-commercial use. All other rights are reserved.
            </p>
          </section>

          <section aria-labelledby="third-party">
            <h2 id="third-party" className="font-heading text-2xl font-bold text-neutral-900">8. Third-party services and links</h2>
            <p className="mt-3">
              The website may link to maps, payment providers, communication tools, social networks, or other
              third-party services. Those services have their own terms and privacy practices. Nita Clinic is not
              responsible for the availability, content, security, or policies of third-party services.
            </p>
          </section>

          <section aria-labelledby="availability">
            <h2 id="availability" className="font-heading text-2xl font-bold text-neutral-900">9. Availability and liability</h2>
            <p className="mt-3">
              We work to keep the website reliable, but access may be interrupted for maintenance, updates,
              technical faults, or events outside our reasonable control. To the extent permitted by applicable
              law, the website and its general information are provided without a guarantee that every page will
              always be complete, available, or error-free.
            </p>
            <p className="mt-3">
              Nothing in these terms excludes or limits a responsibility that cannot lawfully be excluded or
              limited, including rights and protections that apply to healthcare services or consumers.
            </p>
          </section>

          <section aria-labelledby="changes">
            <h2 id="changes" className="font-heading text-2xl font-bold text-neutral-900">10. Changes and termination</h2>
            <p className="mt-3">
              We may update these terms, add or remove website features, or suspend access when necessary. The
              effective date at the top of this page identifies the current version. We may restrict access if
              we reasonably believe the website is being misused or these terms are being breached.
            </p>
          </section>

          <section aria-labelledby="contact" className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft md:p-8">
            <h2 id="contact" className="font-heading text-2xl font-bold text-neutral-900">11. Contact us</h2>
            <p className="mt-3">Questions about these terms can be sent to:</p>
            <address className="mt-4 not-italic text-neutral-700">
              <strong className="text-neutral-900">Nita Clinic</strong><br />
              {BRAND.addressFull}<br />
              <a className="font-semibold text-primary-700 underline decoration-primary-200 underline-offset-4 hover:text-primary-900" href={`mailto:${BRAND.email}`}>{BRAND.email}</a><br />
              <a className="font-semibold text-primary-700 underline decoration-primary-200 underline-offset-4 hover:text-primary-900" href={`tel:${BRAND.phone.replace(/[^0-9+]/g, '')}`}>{BRAND.phone}</a>
            </address>
            <p className="mt-6 text-sm text-neutral-500">
              For appointment help, visit the <Link href="/appointments/book" className="font-semibold text-primary-700 hover:text-primary-900">Book Appointment</Link> page.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
