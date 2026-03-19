import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/server/db-simple";
import ClientCatalog from "./ClientCatalog";

export const dynamic = 'force-dynamic';

type ClientPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClientPage({ params }: ClientPageProps) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      clientProducts: {
        include: {
          masterProduct: true,
        },
        orderBy: { updatedAt: "desc" },
      },
      quotes: { orderBy: { createdAt: "desc" }, take: 20 },
      orders: { orderBy: { createdAt: "desc" }, take: 20 },
      activities: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });

  if (!client) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {client.companyName ?? client.name}
            </h1>
            {client.companyName ? (
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {client.name}
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/quotes/new?clientId=${client.id}`}
              className="rounded-lg bg-zinc-950 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              New Quote
            </Link>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
            <div className="text-zinc-600 dark:text-zinc-400">Email</div>
            <div className="mt-1 font-medium">{client.email ?? "—"}</div>
          </div>
          <div className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
            <div className="text-zinc-600 dark:text-zinc-400">Phone</div>
            <div className="mt-1 font-medium">{client.phone ?? "—"}</div>
          </div>
          <div className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
            <div className="text-zinc-600 dark:text-zinc-400">GSTIN</div>
            <div className="mt-1 font-medium">{client.gstin ?? "—"}</div>
          </div>
          <div className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800 sm:col-span-2 lg:col-span-3">
            <div className="text-zinc-600 dark:text-zinc-400">Address</div>
            <div className="mt-1 whitespace-pre-wrap font-medium">{client.address ?? "—"}</div>
          </div>
        </div>
      </section>

      {/* Client Catalog Section */}
      <ClientCatalog client={client} clientProducts={client.clientProducts} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
        <div className="space-y-6">
          <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold">Recent Quotes</h2>
              <Link href="/quotes" className="text-sm font-medium text-blue-700 hover:underline">
                All quotes
              </Link>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="text-zinc-600 dark:text-zinc-400">
                  <tr>
                    <th className="py-2 pr-4 font-medium">Quote</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 pr-4 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {client.quotes.length === 0 ? (
                    <tr>
                      <td className="py-3 text-zinc-600 dark:text-zinc-400" colSpan={3}>
                        No quotes yet.
                      </td>
                    </tr>
                  ) : (
                    client.quotes.map((q: any) => (
                      <tr key={q.id} className="border-t border-zinc-100 dark:border-zinc-900">
                        <td className="py-3 pr-4">
                          <Link href={`/quotes/${q.id}`} className="font-medium hover:underline">
                            {q.quoteNumber}
                          </Link>
                        </td>
                        <td className="py-3 pr-4">{q.status}</td>
                        <td className="py-3 pr-4">{q.createdAt.toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold">Recent Orders</h2>
              <Link href="/orders" className="text-sm font-medium text-blue-700 hover:underline">
                All orders
              </Link>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="text-zinc-600 dark:text-zinc-400">
                  <tr>
                    <th className="py-2 pr-4 font-medium">Order</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 pr-4 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {client.orders.length === 0 ? (
                    <tr>
                      <td className="py-3 text-zinc-600 dark:text-zinc-400" colSpan={3}>
                        No orders yet.
                      </td>
                    </tr>
                  ) : (
                    client.orders.map((o: any) => (
                      <tr key={o.id} className="border-t border-zinc-100 dark:border-zinc-900">
                        <td className="py-3 pr-4">
                          <Link href={`/orders/${o.id}`} className="font-medium hover:underline">
                            {o.orderNumber}
                          </Link>
                        </td>
                        <td className="py-3 pr-4">{o.status}</td>
                        <td className="py-3 pr-4">{o.createdAt.toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-base font-semibold">Activity</h2>
          <div className="mt-4 space-y-3">
            {client.activities.length === 0 ? (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">No activity yet.</div>
            ) : (
              client.activities.map((a: any) => (
                <div
                  key={a.id}
                  className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium">{a.type}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      {a.createdAt.toLocaleString()}
                    </div>
                  </div>
                  <div className="mt-1 text-zinc-700 dark:text-zinc-300">{a.message}</div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
