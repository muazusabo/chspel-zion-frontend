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
    <div className="fcs-receipt-print mx-auto aspect-[3/2] w-full max-w-[960px] overflow-hidden border border-[#315f91] bg-[#f4f8fb] p-[3.5%] font-serif text-[#174a7c] print:border-[#315f91] print:shadow-none">
      <div className="flex h-full flex-col text-[clamp(8px,1.35vw,14px)] leading-tight">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-[1.5%]">
            <div className="relative h-[clamp(34px,7vw,72px)] w-[clamp(34px,7vw,72px)] shrink-0 overflow-hidden rounded-full border-2 border-[#174a7c] bg-[#f8fbfd]">
              <Image src="/images/logo.jfif" alt="FCS logo" fill className="object-cover" sizes="72px" />
            </div>
            <div>
              <p className="text-[clamp(8px,1.45vw,16px)] font-bold uppercase tracking-[0.04em]">Fellowship of Christian Students</p>
              <h1 className="mt-1 text-[clamp(15px,3.4vw,36px)] font-black uppercase tracking-[0.08em]">FCS</h1>
            </div>
          </div>
          <div className="min-w-[22%] pt-1 text-right text-[clamp(8px,1.3vw,13px)]">
            <p><span className="font-bold">No.</span> <span className="border-b border-[#174a7c] px-2 font-bold">{receiptNumber}</span></p>
            <p className="mt-2"><span className="font-bold">Date:</span> <span className="border-b border-[#174a7c] px-2">{date}</span></p>
          </div>
        </div>

        <div className="my-[1.5%] flex justify-center">
          <div className="rounded-[3px] border border-[#174a7c] bg-[#27659a] px-[5%] py-[0.8%] text-[clamp(9px,1.6vw,16px)] font-bold uppercase tracking-[0.14em] text-white">
            Official Receipt
          </div>
        </div>

        <div className="space-y-[1.8%]">
          <div className="flex items-end gap-2"><span className="shrink-0 italic">Received from</span><span className="min-w-0 flex-1 border-b border-[#174a7c] px-1 pb-0.5 font-sans font-medium">{requestedName || ' '}</span></div>
          <div className="flex items-end gap-2"><span className="shrink-0 italic">The sum of</span><span className="min-w-0 flex-1 border-b border-[#174a7c] px-1 pb-0.5 font-sans font-medium">{amountInWords || ' '}</span></div>
          <div className="flex items-end gap-2"><span className="shrink-0 italic">Naira</span><span className="w-[18%] border-b border-[#174a7c] px-1 pb-0.5 font-sans font-medium">{nairaAmount}</span><span className="shrink-0 italic">Kobo</span><span className="w-[12%] border-b border-[#174a7c] px-1 pb-0.5 font-sans font-medium">{koboAmount}</span></div>
          <div className="flex items-end gap-2"><span className="shrink-0 italic">Being</span><span className="min-w-0 flex-1 border-b border-[#174a7c] px-1 pb-0.5 font-sans font-medium">{paymentType || ' '}</span></div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-5 pt-[2.5%]">
          <div className="double-rule border-2 border-[#174a7c] p-1">
            <div className="border border-[#174a7c] px-[clamp(10px,2vw,22px)] py-[clamp(5px,1vw,12px)] text-center">
              <div className="text-[clamp(8px,1.2vw,12px)] uppercase tracking-[0.12em]">Amount</div>
              <div className="mt-1 text-[clamp(16px,3vw,31px)] font-bold font-sans">₦{formattedAmount}</div>
            </div>
          </div>
          <div className="w-[34%] text-center text-[clamp(8px,1.15vw,12px)]">
            <div className="grid grid-cols-2 border border-[#174a7c]">
              <div className="border-r border-[#174a7c] px-1 py-1 font-bold uppercase">Cash</div>
              <div className="px-1 py-1 font-bold uppercase">Cheque No</div>
              <div className="min-h-[clamp(22px,4vw,42px)] border-r border-t border-[#174a7c] px-1 py-1 font-sans">{paymentMethodLabel}</div>
              <div className="min-h-[clamp(22px,4vw,42px)] border-t border-[#174a7c] break-all px-1 py-1 font-sans">{transactionReference || ' '}</div>
            </div>
          </div>
        </div>

        <div className="mt-[2%] flex items-end justify-between gap-4">
          <div className="w-[28%] border-b border-[#174a7c] pb-1 text-[clamp(8px,1.2vw,12px)]"> </div>
          <div className="text-right"><p className="text-[clamp(9px,1.35vw,14px)] font-bold uppercase tracking-[0.08em]">Received with thanks</p><p className="mt-2 text-[clamp(8px,1.1vw,11px)]">Signature</p></div>
        </div>
      </div>
    </div>
  );
}

export default FcsReceipt;
