"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Eye,
  FileUp,
  Receipt as ReceiptIcon,
  Search,
  X,
} from "lucide-react";
import { api, uploadReceiptFile } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PaymentStatus, Transaction, Paginated } from "@/types";

interface AdminReceiptRequest extends Transaction {
  user?: { fullName: string; email: string } | null;
}

const STATUS_VARIANT: Record<
  PaymentStatus,
  "default" | "gold" | "forest" | "urgent"
> = {
  PENDING: "gold",
  SUCCESSFUL: "forest",
  FAILED: "urgent",
  CANCELLED: "default",
  REFUNDED: "default",
};
const STATUSES: (PaymentStatus | "ALL")[] = [
  "ALL",
  "PENDING",
  "SUCCESSFUL",
  "FAILED",
];

function transferValue(
  request: AdminReceiptRequest,
  key: "transferReference" | "transferDate",
) {
  return request.metadata?.[key] ?? "—";
}

function screenshotUrl(request: AdminReceiptRequest) {
  return request.metadata?.transactionScreenshotUrl ?? null;
}

export default function AdminReceiptsPage() {
  const [data, setData] = useState<Paginated<AdminReceiptRequest> | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PaymentStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<AdminReceiptRequest | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const loadRequests = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (search) params.set("search", search);
    if (status !== "ALL") params.set("status", status);
    api
      .get<Paginated<AdminReceiptRequest>>(`/api/admin/payments?${params}`)
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(loadRequests, [page, search, status]);

  const approve = async (id: string) => {
    setActioningId(id);
    try {
      await api.patch(`/api/admin/payments/${id}/approve`);
      loadRequests();
    } finally {
      setActioningId(null);
    }
  };

  const reject = async (id: string) => {
    setActioningId(id);
    try {
      await api.patch(`/api/admin/payments/${id}/reject`);
      loadRequests();
    } finally {
      setActioningId(null);
    }
  };

  const upload = async (request: AdminReceiptRequest) => {
    const file = fileRefs.current[request.id]?.files?.[0];
    if (!file || !request.receipt) return;
    setActioningId(request.id);
    try {
      await uploadReceiptFile(request.receipt.id, file);
      loadRequests();
    } finally {
      setActioningId(null);
      if (fileRefs.current[request.id])
        fileRefs.current[request.id]!.value = "";
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Receipts"
        description="Review offline receipt requests; receipts are generated automatically after approval"
      />
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            placeholder="Name, email, transaction reference…"
            className="pl-10"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value as PaymentStatus | "ALL");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((item) => (
              <SelectItem key={item} value={item}>
                {item === "ALL"
                  ? "All Statuses"
                  : item === "SUCCESSFUL"
                    ? "Approved"
                    : item === "FAILED"
                      ? "Rejected"
                      : item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4 flex flex-col gap-3 rounded-md border border-ink-100 bg-paper p-4 sm:flex-row sm:items-end">
        <label className="min-w-0 flex-1 text-sm font-medium text-ink">
          View transaction details
          <select
            className="mt-1 block h-10 w-full rounded-sm border border-ink-200 bg-paper px-3 text-sm font-normal"
            defaultValue=""
            onChange={(event) => {
              const request = data?.items.find(
                (item) => item.id === event.target.value,
              );
              if (request) setSelectedRequest(request);
            }}
          >
            <option value="">Select a payment to view details</option>
            {(data?.items ?? []).map((request) => (
              <option key={request.id} value={request.id}>
                {request.user?.fullName ?? "Anonymous"} ·{" "}
                {formatCurrency(request.amount)} ·{" "}
                {request.status === "SUCCESSFUL"
                  ? "APPROVED"
                  : request.status === "FAILED"
                    ? "REJECTED"
                    : request.status}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs font-normal text-slate-500">
            Choose a payment to open its full transaction details.
          </span>
        </label>
      </div>
      {loading && <Loading />}
      {!loading && data?.items.length === 0 && (
        <EmptyState icon={ReceiptIcon} title="No receipt requests found." />
      )}
      {!loading && data && data.items.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-md border border-ink-100 bg-paper">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment date</th>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Receipt</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {data.items.map((request) => (
                  <tr key={request.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium">
                        {request.user?.fullName ?? "—"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {request.user?.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatCurrency(request.amount)}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {transferValue(request, "transferDate") !== "—"
                        ? formatDate(
                            String(transferValue(request, "transferDate")),
                          )
                        : "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">
                      {transferValue(request, "transferReference")}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANT[request.status]}>
                        {request.status === "SUCCESSFUL"
                          ? "APPROVED"
                          : request.status === "FAILED"
                            ? "REJECTED"
                            : request.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {request.receipt
                        ? request.receipt.pdfUrl
                          ? "Generated + uploaded"
                          : "Generated automatically"
                        : "After approval"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <input
                          ref={(element) => {
                            fileRefs.current[request.id] = element;
                          }}
                          type="file"
                          accept="application/pdf,image/jpeg,image/png,image/webp,image/gif,image/avif"
                          className="hidden"
                          onChange={() => upload(request)}
                        />
                        {request.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => approve(request.id)}
                              disabled={actioningId === request.id}
                              className="inline-flex items-center gap-1 rounded border border-forest-200 bg-forest-50 px-2 py-1 text-xs font-medium text-forest-700 disabled:opacity-60"
                            >
                              <Check size={12} /> Approve
                            </button>
                            <button
                              onClick={() => reject(request.id)}
                              disabled={actioningId === request.id}
                              className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 disabled:opacity-60"
                            >
                              <X size={12} /> Reject
                            </button>
                          </>
                        )}
                        {request.status === "SUCCESSFUL" && request.receipt && (
                          <button
                            onClick={() =>
                              fileRefs.current[request.id]?.click()
                            }
                            disabled={actioningId === request.id}
                            className="inline-flex items-center gap-1 rounded border border-ink-200 px-2 py-1 text-xs font-medium text-ink disabled:opacity-60"
                          >
                            <FileUp size={12} />{" "}
                            {request.receipt.pdfUrl
                              ? "Replace file"
                              : "Attach optional file"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onChange={setPage}
          />
        </>
      )}

      <Dialog
        open={selectedRequest !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedRequest(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction details</DialogTitle>
            <DialogDescription>
              Review the member&apos;s giving request and transfer evidence.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6 text-sm">
              <div className="flex flex-col gap-3 border-b border-ink-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium text-ink">
                    {selectedRequest.user?.fullName ?? "Anonymous member"}
                  </p>
                  <p className="mt-1 text-slate-500">
                    {selectedRequest.user?.email ?? "No email provided"}
                  </p>
                </div>
                <Badge variant={STATUS_VARIANT[selectedRequest.status]}>
                  {selectedRequest.status === "SUCCESSFUL"
                    ? "APPROVED"
                    : selectedRequest.status === "FAILED"
                      ? "REJECTED"
                      : selectedRequest.status}
                </Badge>
              </div>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">
                    Amount
                  </dt>
                  <dd className="mt-1 font-medium">
                    {formatCurrency(selectedRequest.amount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">
                    Giving type
                  </dt>
                  <dd className="mt-1">
                    {selectedRequest.givingType.replace("_", " ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">
                    Payment date
                  </dt>
                  <dd className="mt-1">
                    {formatDate(selectedRequest.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">
                    Transaction reference
                  </dt>
                  <dd className="mt-1 break-all font-mono text-xs">
                    {selectedRequest.reference || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">
                    Transfer date
                  </dt>
                  <dd className="mt-1">
                    {transferValue(selectedRequest, "transferDate") !== "—"
                      ? formatDate(
                          String(
                            transferValue(selectedRequest, "transferDate"),
                          ),
                        )
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">
                    Transfer reference
                  </dt>
                  <dd className="mt-1 break-all font-mono text-xs">
                    {transferValue(selectedRequest, "transferReference")}
                  </dd>
                </div>
              </dl>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Member note
                </p>
                <p className="mt-1 whitespace-pre-wrap text-slate-700">
                  {selectedRequest.note || "No note provided."}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Transfer screenshot
                </p>
                {screenshotUrl(selectedRequest) ? (
                  <a
                    href={screenshotUrl(selectedRequest) as string}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-ink underline underline-offset-4"
                  >
                    Open uploaded screenshot
                  </a>
                ) : (
                  <p className="mt-1 text-slate-500">No screenshot uploaded.</p>
                )}
              </div>
              <div className="border-t border-ink-100 pt-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Receipt
                </p>
                <p className="mt-1 text-slate-700">
                  {selectedRequest.receipt?.pdfUrl
                    ? "Receipt generated and an uploaded file is attached."
                    : selectedRequest.receipt
                      ? "Receipt generated automatically. Members can download the PDF now."
                      : "Receipt will be generated after approval."}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
