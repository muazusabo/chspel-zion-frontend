import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = { title: 'Terms of Use' };

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Use" />
      <section className="container max-w-2xl py-16 space-y-8 text-slate-700 leading-relaxed">
        <div>
          <h2 className="text-xl text-ink mb-3">Using This Platform</h2>
          <p>
            This platform is provided for members and friends of SAZU FCS to
            stay informed, connect with the fellowship, and give offerings
            and donations. By registering, you agree to provide accurate
            information and use the platform respectfully.
          </p>
        </div>
        <div>
          <h2 className="text-xl text-ink mb-3">Giving &amp; Receipts</h2>
          <p>
            All giving is voluntary. Receipts are generated only after an
            admin approves a manual transfer or donation record, and can be
            downloaded or verified at any time via the receipt verification
            page.
          </p>
        </div>
        <div>
          <h2 className="text-xl text-ink mb-3">Account Responsibility</h2>
          <p>
            You are responsible for keeping your login credentials secure.
            Contact an administrator immediately if you suspect unauthorized
            access to your account.
          </p>
        </div>
        <p className="text-sm text-slate-400">
          [This is placeholder legal content. Replace with SAZU FCS&apos;s
          finalized terms of use before going live.]
        </p>
      </section>
    </>
  );
}
