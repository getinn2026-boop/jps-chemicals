import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/server/db";
import { createOrderFromQuote, setQuoteStatus } from "../actions";
import { BeakerIcon, DocumentTextIcon, PrinterIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { getCurrentUser, isAdmin } from "@/lib/auth";

type QuotePageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuotePage({ params }: QuotePageProps) {
  const { id } = await params;

  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      client: true,
      items: true,
      order: true,
    },
  });

  if (!quote) {
    notFound();
  }

  const currentUser = await getCurrentUser();
  const isUserAdmin = isAdmin(currentUser);

  const statusButtons = ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-slate-900">{quote.quoteNumber}</h1>
            </div>
            <div className="mt-1 text-sm text-slate-600">
              <Link href={`/clients/${quote.clientId}`} className="text-blue-600 hover:text-blue-700 hover:underline">
                {quote.client.companyName ?? quote.client.name}
              </Link>
              <span className="mx-2">•</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                quote.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                quote.status === 'SENT' ? 'bg-blue-100 text-blue-800' :
                quote.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                quote.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {quote.status}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/quotes/${quote.id}/print`}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2"
            >
              <PrinterIcon className="h-4 w-4" />
              Print / PDF
            </Link>
            {quote.order ? (
              <Link
                href={`/orders/${quote.order.id}`}
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                View Order
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            ) : (
              <form action={createOrderFromQuote}>
                <input type="hidden" name="quoteId" value={quote.id} />
                <button className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors flex items-center gap-2">
                  <ArrowRightIcon className="h-4 w-4" />
                  Convert to Order
                </button>
              </form>
            )}
          </div>
        </div>

        {isUserAdmin && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {statusButtons.map((s) => (
              <form key={s} action={setQuoteStatus}>
                <input type="hidden" name="quoteId" value={quote.id} />
                <input type="hidden" name="status" value={s} />
                <button
                  className={
                    quote.status === s
                      ? "rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
                      : "rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors"
                  }
                >
                  {s}
                </button>
              </form>
            ))}
          </div>
        )}

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 pr-4 font-medium">Description</th>
                <th className="py-3 pr-4 font-medium">Qty</th>
                <th className="py-3 pr-4 font-medium">Unit</th>
                <th className="py-3 pr-4 font-medium">Unit Price</th>
                <th className="py-3 pr-4 font-medium">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quote.items.map((it) => (
                <tr key={it.id} className="hover:bg-slate-50">
                  <td className="py-4 pr-4 font-medium text-slate-900">{it.description}</td>
                  <td className="py-4 pr-4 text-slate-700">{it.quantity.toString()}</td>
                  <td className="py-4 pr-4 text-slate-700">{it.unit ?? "—"}</td>
                  <td className="py-4 pr-4 text-slate-700">{it.unitPrice.toString()}</td>
                  <td className="py-4 pr-4 font-semibold text-slate-900">{it.lineTotal.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
            <div className="text-slate-600">Subtotal</div>
            <div className="mt-1 font-semibold text-slate-900">{quote.subtotal.toString()}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
            <div className="text-slate-600">Tax</div>
            <div className="mt-1 font-semibold text-slate-900">{quote.tax.toString()}</div>
          </div>
          <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 text-sm">
            <div className="text-blue-700 font-medium">Total</div>
            <div className="mt-1 font-bold text-blue-900 text-lg">{quote.total.toString()}</div>
          </div>
        </div>

        {quote.notes ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
            <div className="text-slate-600 font-medium mb-2">Notes</div>
            <div className="whitespace-pre-wrap text-slate-800">{quote.notes}</div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

