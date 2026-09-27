import Image from 'next/image';

export type FcsReceiptProps = {
  receiptNumber: string;
  date: string;
  requestedName: string;
  amount: number;
  amountInWords: string;
  paymentType: string;
  paymentMethod: string;
  transactionReference: string;
};

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function FcsReceipt({
  receiptNumber,
  date,
  requestedName,
  amount,
  amountInWords,
  paymentType,
  paymentMethod,
  transactionReference,
}: FcsReceiptProps) {
  const paymentMethodLabel = paymentMethod || 'Manual Transfer';
  const formattedAmount = formatMoney(amount).replace('₦', '').trim();
  const [nairaAmount, koboAmount] = formattedAmount.split('.');

  return (
    <div className="fcs-receipt-print mx-auto aspect-[3/2] w-full max-w-[960px] overflow-hidden rounded-md border border-[#d9e0e8] bg-white p-[3%] font-sans text-[#142b45] shadow-[0_16px_44px_rgba(16,26,43,0.12)] print:rounded-none print:shadow-none">
      <div className="flex h-full flex-col text-[clamp(8px,1.2vw,13px)] leading-tight">
        <header className="flex items-center justify-between gap-4 rounded-sm bg-[#10243a] px-[3%] py-[2.2%] text-white">
          <div className="flex min-w-0 items-center gap-[2.5%]">
            <div className="relative h-[clamp(40px,6vw,64px)] w-[clamp(40px,6vw,64px)] shrink-0 overflow-hidden rounded-sm bg-white p-1">
              <Image src="/images/logo.jfif" alt="FCS logo" fill className="object-contain p-1" sizes="64px" />
            </div>
            <div className="min-w-0">
              <p className="text-[clamp(8px,1vw,11px)] font-semibold uppercase text-[#e6c988]">SAZU FCS | CHAPEL OF ZION</p>
              <h1 className="mt-1 text-[clamp(12px,2vw,21px)] font-bold leading-tight">Fellowship of Christian Students</h1>
              <p className="mt-1 text-[clamp(8px,0.95vw,10px)] text-white/70">Sa&apos;adu Zungur University</p>
            </div>
          </div>
          <div className="shrink-0 text-right text-[clamp(8px,1vw,11px)]">
            <p className="font-semibold uppercase tracking-[0.08em] text-[#e6c988]">Official receipt</p>
            <p className="mt-2 font-semibold text-white">{receiptNumber}</p>
            <p className="mt-1 text-white/75">{date}</p>
          </div>
        </header>

        <div className="my-[2.5%] min-w-0 border-b border-[#d9e0e8] pb-[1.5%]">
          <p className="text-[clamp(8px,0.95vw,10px)] font-semibold uppercase tracking-[0.1em] text-[#8c6c33]">Received from</p>
          <p className="mt-1 break-words text-[clamp(13px,2vw,21px)] font-semibold text-[#142b45]">{requestedName || ' '}</p>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[1.35fr_0.85fr] gap-[2.5%]">
          <div className="flex min-w-0 flex-col justify-between py-[1%]">
            <div>
              <p className="text-[clamp(8px,0.95vw,10px)] font-semibold uppercase tracking-[0.1em] text-[#8c6c33]">The sum of</p>
              <p className="mt-1 border-b border-[#d9e0e8] pb-2 font-medium text-[#142b45]">{amountInWords || ' '}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b border-[#d9e0e8] pb-2">
              <div className="min-w-0">
                <p className="text-[clamp(8px,0.95vw,10px)] font-semibold uppercase tracking-[0.1em] text-[#8c6c33]">Being</p>
                <p className="mt-1 truncate font-medium capitalize">{paymentType || ' '}</p>
              </div>
              <div className="min-w-0">
                <p className="text-[clamp(8px,0.95vw,10px)] font-semibold uppercase tracking-[0.1em] text-[#8c6c33]">Payment method</p>
                <p className="mt-1 truncate font-medium">{paymentMethodLabel}</p>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[clamp(8px,0.95vw,10px)] font-semibold uppercase tracking-[0.1em] text-[#8c6c33]">Transaction reference</p>
              <p className="mt-1 truncate font-medium">{transactionReference || ' '}</p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center rounded-sm border border-[#e3e7ed] bg-[#f5f7f9] px-[7%] py-[5%]">
            <p className="text-[clamp(8px,0.95vw,10px)] font-semibold uppercase tracking-[0.1em] text-[#8c6c33]">Amount received</p>
            <p className="mt-2 whitespace-nowrap text-[clamp(15px,2.8vw,29px)] font-bold tracking-normal text-[#142b45]">₦{formattedAmount}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#d9e0e8] pt-2 text-[clamp(8px,0.95vw,10px)]">
              <div><p className="text-[#657386]">Naira</p><p className="mt-1 font-semibold">{nairaAmount}</p></div>
              <div><p className="text-[#657386]">Kobo</p><p className="mt-1 font-semibold">{koboAmount}</p></div>
            </div>
          </div>
        </div>

        <footer className="mt-[2.5%] flex items-end justify-between gap-4 border-t border-[#d9e0e8] pt-[2%]">
          <div className="w-[34%]">
            <div className="h-[clamp(16px,2.5vw,26px)] border-b border-[#657386]" />
            <p className="mt-1 text-[clamp(8px,0.95vw,10px)] font-semibold uppercase tracking-[0.08em]">Authorized signature</p>
            <p className="mt-1 text-[clamp(8px,0.85vw,9px)] text-[#657386]">For SAZU FCS | Chapel of Zion</p>
          </div>
          <div className="pb-1 text-right">
            <p className="text-[clamp(9px,1.25vw,13px)] font-semibold uppercase tracking-[0.04em] text-[#142b45]">Received with thanks</p>
            <p className="mt-1 text-[clamp(8px,0.9vw,10px)] text-[#657386]">Fellowship of Christian Students</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default FcsReceipt;
