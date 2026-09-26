import { api } from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { CopyButton } from '@/components/shared/copy-button';
import type { ChapelAccount } from '@/types';

const FALLBACK: ChapelAccount = {
  id: '',
  bankName: '[CHAPEL BANK NAME]',
  accountName: '[CHAPEL ACCOUNT NAME]',
  accountNumber: '[ACCOUNT NUMBER]',
};

async function getAccount(): Promise<{ account: ChapelAccount; failed: boolean }> {
  const account = await api.get<ChapelAccount>('/api/chapel/account', { skipAuth: true }).catch(() => null);
  return { account: account ?? FALLBACK, failed: account === null };
}

export default async function ChapelAccountPage() {
  const { account, failed } = await getAccount();

  return (
    <>
      <PageHeader eyebrow="Give" title="Chapel Account Details" description="For those who prefer to give by direct bank transfer." />

      <section className="container py-16 max-w-lg">
        {failed && (
          <p className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-700">
            Chapel account details could not be loaded. The values below are placeholders; please refresh and try again.
          </p>
        )}
        <div className="rounded-md border border-ink-100 divide-y divide-ink-100">
          <div className="p-6">
            <p className="text-xs text-slate-400 mb-1">Bank Name</p>
            <p className="text-lg font-display">{account.bankName}</p>
          </div>
          <div className="p-6">
            <p className="text-xs text-slate-400 mb-1">Account Name</p>
            <p className="text-lg font-display">{account.accountName}</p>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 mb-1">Account Number</p>
              <p className="text-lg font-display tracking-wide">{account.accountNumber}</p>
            </div>
            <CopyButton value={account.accountNumber} />
          </div>
        </div>

        <p className="text-sm text-slate-500 mt-8 leading-relaxed">
          After making a transfer, please note your name and giving type in the
          transfer description. Then submit your giving request via the{' '}
          <a href="/give" className="text-ink underline underline-offset-4">giving page</a>{' '}
          and wait for admin approval before your receipt becomes available for download.
        </p>
      </section>
    </>
  );
}
