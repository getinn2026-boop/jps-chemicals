import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/server/db";
import { setOrderStatus } from "../actions";

export const dynamic = 'force-dynamic';

type OrderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      client: true,
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{order.orderNumber}</h1>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              <Link href={`/clients/${order.clientId}`} className="hover:underline">
                {order.client.companyName ?? order.client.name}
              </Link>
              <span className="mx-2">•</span>
              <span>{order.status}</span>
            </div>
          </div>
          {order.quoteId ? (
            <Link
              href={`/quotes/${order.quoteId}`}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              View Quote
            </Link>
          ) : null}
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-zinc-600 dark:text-zinc-400">
              <tr>
                <th className="py-2 pr-4 font-medium">Description</th>
                <th className="py-2 pr-4 font-medium">Qty</th>
                <th className="py-2 pr-4 font-medium">Unit</th>
                <th className="py-2 pr-4 font-medium">Unit Price</th>
                <th className="py-2 pr-4 font-medium">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it) => (
                <tr key={it.id} className="border-t border-zinc-100 dark:border-zinc-900">
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

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
            <div className="text-zinc-600 dark:text-zinc-400">Subtotal</div>
            <div className="mt-1 font-semibold">{order.subtotal.toString()}</div>
          </div>
          <div className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
            <div className="text-zinc-600 dark:text-zinc-400">Tax</div>
            <div className="mt-1 font-semibold">{order.tax.toString()}</div>
          </div>
          <div className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
            <div className="text-zinc-600 dark:text-zinc-400">Total</div>
            <div className="mt-1 font-semibold">{order.total.toString()}</div>
          </div>
        </div>
      </section>
    </div>
  );
}

