import Link from "next/link";
import { prisma } from "@/server/db";

type OrdersPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = (await searchParams) ?? {};
  const qParam = params.q;
  const q = typeof qParam === "string" ? qParam.trim() : "";

  const orders = await prisma.order.findMany({
    where: q
      ? {
          OR: [
            { orderNumber: { contains: q, mode: "insensitive" } },
            { client: { name: { contains: q, mode: "insensitive" } } },
            { client: { companyName: { contains: q, mode: "insensitive" } } },
          ],
        }
      : undefined,
    include: { client: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-base font-semibold">Orders</h1>
          <form action="/orders" className="flex items-center gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search order or client"
              className="w-72 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-black dark:focus:border-zinc-600"
            />
            <button className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800">
              Search
            </button>
          </form>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-zinc-600 dark:text-zinc-400">
              <tr>
                <th className="py-2 pr-4 font-medium">Order</th>
                <th className="py-2 pr-4 font-medium">Client</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Total</th>
                <th className="py-2 pr-4 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td className="py-3 text-zinc-600 dark:text-zinc-400" colSpan={5}>
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((o: any) => (
                  <tr key={o.id} className="border-t border-zinc-100 dark:border-zinc-900">
                    <td className="py-3 pr-4">
                      <Link href={`/orders/${o.id}`} className="font-medium hover:underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      <Link href={`/clients/${o.clientId}`} className="hover:underline">
                        {o.client.companyName ?? o.client.name}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">{o.status}</td>
                    <td className="py-3 pr-4">{o.total.toString()}</td>
                    <td className="py-3 pr-4">{o.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

