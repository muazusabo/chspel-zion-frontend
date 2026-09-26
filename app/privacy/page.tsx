import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
      <section className="container max-w-2xl py-16 space-y-8 text-slate-700 leading-relaxed">
        <div>
          <h2 className="text-xl text-ink mb-3">Information We Collect</h2>
          <p>
            When you register or give through SAZU FCS, we collect information
            such as your name, email address, phone number, and academic
            details (department, faculty, level, matric number) to identify
            you as a member of the fellowship.
          </p>
        </div>
        <div>
          <h2 className="text-xl text-ink mb-3">Payment Information</h2>
          <p>
            Giving to SAZU FCS is handled through approved manual transfers.
            We store the transfer reference, amount, and approval status for
            proper record keeping, but we do not collect card details through
            the website.
          </p>
        </div>
        <div>
          <h2 className="text-xl text-ink mb-3">How We Use Your Information</h2>
          <p>
            Your information is used to manage your fellowship membership,
            generate giving receipts, send relevant communications (such as
            announcements or payment confirmations), and improve the
            fellowship&apos;s programs.
          </p>
        </div>
        <div>
          <h2 className="text-xl text-ink mb-3">Data Security</h2>
          <p>
            Passwords are hashed and never stored in plain text. Access to
            administrative data is restricted by role, and all sensitive
            actions are logged.
          </p>
        </div>
        <p className="text-sm text-slate-400">
                </p>
      </section>
    </>
  );
}
