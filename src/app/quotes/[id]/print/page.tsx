import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/server/db";
import { PrintButton } from "./PrintButton";

type QuotePrintPageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuotePrintPage({ params }: QuotePrintPageProps) {
  const { id } = await params;

  const quote = await prisma.quote.findUnique({
    where: { id },
    include: { client: true, items: true },
  });

  if (!quote) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 print:hidden">
        <Link href={`/quotes/${quote.id}`} className="text-sm font-medium text-blue-700 hover:underline">
          Back to quote
        </Link>
        <PrintButton />
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 print:border-0 print:bg-white print:p-0 print:text-black">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-lg font-semibold">JPS Chemicals</div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 print:text-zinc-700">
              Quotation
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="font-semibold">{quote.quoteNumber}</div>
            <div className="text-zinc-600 dark:text-zinc-400 print:text-zinc-700">
              {quote.createdAt.toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800 print:border-zinc-300">
            <div className="text-sm font-semibold">Bill To</div>
            <div className="mt-2 text-sm">
              <div className="font-medium">{quote.client.companyName ?? quote.client.name}</div>
              {quote.client.companyName ? <div>{quote.client.name}</div> : null}
              {quote.client.address ? <div className="whitespace-pre-wrap">{quote.client.address}</div> : null}
              {quote.client.email ? <div>{quote.client.email}</div> : null}
              {quote.client.phone ? <div>{quote.client.phone}</div> : null}
              {quote.client.gstin ? <div>GSTIN: {quote.client.gstin}</div> : null}
            </div>
          </div>
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800 print:border-zinc-300">
            <div className="text-sm font-semibold">Details</div>
            <div className="mt-2 text-sm">
              <div>
                <span className="text-zinc-600 dark:text-zinc-400 print:text-zinc-700">Status: </span>
                <span className="font-medium">{quote.status}</span>
              </div>
              {quote.validUntil ? (
                <div>
                  <span className="text-zinc-600 dark:text-zinc-400 print:text-zinc-700">Valid Until: </span>
                  <span className="font-medium">{quote.validUntil.toLocaleDateString()}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-zinc-600 dark:text-zinc-400 print:text-zinc-700">
              <tr>
                <th className="py-2 pr-4 font-medium">Description</th>
                <th className="py-2 pr-4 font-medium">Qty</th>
                <th className="py-2 pr-4 font-medium">Unit</th>
                <th className="py-2 pr-4 font-medium">Unit Price</th>
                <th className="py-2 pr-4 font-medium">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((it) => (
                <tr key={it.id} className="border-t border-zinc-100 dark:border-zinc-900 print:border-zinc-300">
                  <td className="py-3 pr-4 font-medium">{it.description}</td>
                  <td className="py-3 pr-4">{it.quantity.toString()}</td>
                  <td className="py-3 pr-4">{it.unit ?? "—"}</td>
                  <td className="py-3 pr-4">{it.unitPrice.toString()}</td>
                  <td className="py-3 pr-4">{it.lineTotal.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-sm space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-zinc-600 dark:text-zinc-400 print:text-zinc-700">Subtotal</div>
              <div className="font-semibold">{quote.subtotal.toString()}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-zinc-600 dark:text-zinc-400 print:text-zinc-700">Tax</div>
              <div className="font-semibold">{quote.tax.toString()}</div>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-200 pt-2 dark:border-zinc-800 print:border-zinc-300">
              <div className="font-semibold">Total</div>
              <div className="font-semibold">{quote.total.toString()}</div>
            </div>
          </div>
        </div>

        {quote.notes ? (
          <div className="mt-6 rounded-lg border border-zinc-200 p-4 text-sm dark:border-zinc-800 print:border-zinc-300">
            <div className="font-semibold">Notes / Terms</div>
            <div className="mt-2 whitespace-pre-wrap">{quote.notes}</div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
