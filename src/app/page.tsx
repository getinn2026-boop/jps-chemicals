import Link from "next/link";
import { prisma } from "@/server/db";
import { UsersIcon, BeakerIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  let clientCount = 0;
  let productCount = 0;
  let quoteCount = 0;
  let followUps: any[] = [];
  let dbError = false;

  try {
    const results = await Promise.all([
      prisma.client.count(),
      prisma.masterProduct.count(),
      prisma.quote.count(),
      prisma.quote.findMany({
        where: {
          status: "SENT",
          createdAt: { lt: threeDaysAgo },
        },
        orderBy: { createdAt: "asc" },
        take: 10,
        include: { client: true },
      }),
    ]);

    clientCount = results[0];
    productCount = results[1];
    quoteCount = results[2];
    followUps = results[3];
  } catch (error) {
    console.error("Database connection failed:", error);
    dbError = true;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {dbError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-red-800 font-medium">⚠️ Database Connection Error</h2>
          <p className="text-red-700 text-sm mt-1">
            Unable to connect to the database. If you are on Vercel, make sure you have set up a PostgreSQL database and added the <code className="bg-red-100 px-1 rounded">DATABASE_URL</code> environment variable in your Vercel project settings.
          </p>
        </div>
      )}

      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl text-white">
        <h1 className="text-4xl font-bold mb-4">Chemical Supply Management</h1>
        <p className="text-xl text-blue-100 mb-8">Streamline your chemical business with professional quotation management and client tracking</p>
        <div className="flex justify-center gap-4">
          <Link href="/quotes/new" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Create New Quote
          </Link>
          <Link href="/products" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Browse Products
          </Link>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Clients</p>
              <p className="text-3xl font-bold text-slate-900">{clientCount}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <Link href="/clients" className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
            View all clients →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Chemical Products</p>
              <p className="text-3xl font-bold text-slate-900">{productCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BeakerIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <Link href="/products" className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
            Browse products →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Quotes</p>
              <p className="text-3xl font-bold text-slate-900">{quoteCount}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <Link href="/quotes" className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
            Manage quotes →
          </Link>
        </div>
      </section>

      {/* Follow-up Section */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between gap-3 mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Quotes to Follow Up</h2>
          <Link href="/quotes?status=SENT" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 pr-4 font-medium">Quote #</th>
                <th className="py-3 pr-4 font-medium">Client</th>
                <th className="py-3 pr-4 font-medium">Created</th>
                <th className="py-3 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {followUps.length === 0 ? (
                <tr>
                  <td className="py-8 text-center text-slate-500" colSpan={4}>
                    No follow-ups needed right now. Great job!
                  </td>
                </tr>
              ) : (
                followUps.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50">
                    <td className="py-3 pr-4">
                      <Link href={`/quotes/${q.id}`} className="font-medium text-blue-600 hover:text-blue-700">
                        {q.quoteNumber}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 font-medium">{q.client.companyName ?? q.client.name}</td>
                    <td className="py-3 pr-4 text-slate-600">{q.createdAt.toLocaleDateString()}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Needs Follow-up
                      </span>
                    </td>
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
