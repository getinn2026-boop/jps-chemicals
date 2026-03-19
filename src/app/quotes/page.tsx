import Link from "next/link";
import { prisma } from "@/server/db";
import { BeakerIcon, DocumentTextIcon, PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const dynamic = 'force-dynamic';

type QuotesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function QuotesPage({ searchParams }: QuotesPageProps) {
  const params = (await searchParams) ?? {};
  const qParam = params.q;
  const statusParam = params.status;

  const q = typeof qParam === "string" ? qParam.trim() : "";
  const statusInput = typeof statusParam === "string" ? statusParam.trim() : "";
  const statusOptions = ["", "DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"];
  const status = statusOptions.includes(statusInput) ? statusInput : "";

  let quotes: any[] = [];
  let dbError = false;

  try {
    quotes = await prisma.quote.findMany({
      where: {
        ...(q
          ? {
              OR: [
                { quoteNumber: { contains: q, mode: "insensitive" } },
                { client: { name: { contains: q, mode: "insensitive" } } },
                { client: { companyName: { contains: q, mode: "insensitive" } } },
              ],
            }
          : {}),
        ...(status ? { status: status as never } : {}),
      },
      include: { client: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  } catch (error) {
    console.error("Database connection failed in quotes page:", error);
    dbError = true;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {dbError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-red-800 font-medium">⚠️ Database Connection Error</h2>
          <p className="text-red-700 text-sm mt-1">
            Unable to connect to the database. Make sure you have configured a valid PostgreSQL database and <code className="bg-red-100 px-1 rounded">DATABASE_URL</code> on Vercel.
          </p>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <DocumentTextIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900">Chemical Quotations</h1>
        </div>
        <p className="text-slate-600">Manage your chemical product quotations and track client proposals</p>
      </div>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <form action="/quotes" className="flex items-center gap-2">
                  <input
                    name="q"
                    defaultValue={q}
                    placeholder="Search quote or client"
                    className="w-80 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <select
                    name="status"
                    defaultValue={status}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s ? s : "All statuses"}
                      </option>
                    ))}
                  </select>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Search
                  </button>
                </form>
              </div>
            </div>
            <Link
              href="/quotes/new"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              New Quote
            </Link>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 pr-6 font-medium">Quote</th>
                  <th className="py-3 pr-6 font-medium">Client</th>
                  <th className="py-3 pr-6 font-medium">Status</th>
                  <th className="py-3 pr-6 font-medium">Total</th>
                  <th className="py-3 pr-6 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotes.length === 0 ? (
                  <tr>
                    <td className="py-8 text-center text-slate-500" colSpan={5}>
                      No chemical quotations found.
                    </td>
                  </tr>
                ) : (
                  quotes.map((qt: any) => (
                    <tr key={qt.id} className="hover:bg-slate-50">
                      <td className="py-4 pr-6">
                        <Link href={`/quotes/${qt.id}`} className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
                          <div className="flex items-center gap-2">
                            <DocumentTextIcon className="h-4 w-4" />
                            {qt.quoteNumber}
                          </div>
                        </Link>
                      </td>
                      <td className="py-4 pr-6">
                        <Link href={`/clients/${qt.clientId}`} className="text-slate-900 hover:text-blue-600 hover:underline">
                          {qt.client.companyName ?? qt.client.name}
                        </Link>
                      </td>
                      <td className="py-4 pr-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          qt.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                          qt.status === 'SENT' ? 'bg-blue-100 text-blue-800' :
                          qt.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                          qt.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {qt.status}
                        </span>
                      </td>
                      <td className="py-4 pr-6 font-semibold text-slate-900">{qt.total.toString()}</td>
                      <td className="py-4 pr-6 text-slate-600">{qt.createdAt.toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
