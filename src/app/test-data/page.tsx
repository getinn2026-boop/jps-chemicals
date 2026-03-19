import { prisma } from "@/server/db";
import { BeakerIcon, UserIcon, TruckIcon } from "@heroicons/react/24/outline";

export const dynamic = 'force-dynamic';

export default async function TestDataPage() {
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-yellow-800 font-medium">⚠️ Database Configuration Missing</div>
            <div className="text-yellow-700 text-sm mt-1">
              DATABASE_URL environment variable is not configured. Please set up your database connection.
            </div>
            <div className="text-yellow-600 text-xs mt-2">
              For local development: Copy .env.example to .env and configure your database URL.
              
              For Vercel deployment: Set the DATABASE_URL environment variable in your Vercel project settings.
              
              For production: Use Vercel Postgres or connect to your PostgreSQL database.
            </div>
          </div>
        </div>
      );
    }

    let suppliers = [];
    let clients = [];
    let products = [];
    let error = null;

    try {
      // Try to fetch data from database
      const results = await Promise.allSettled([
        prisma.supplier.findMany({
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        prisma.client.findMany({
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        prisma.product.findMany({
          include: { supplier: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);

      if (results[0].status === 'fulfilled') suppliers = results[0].value;
      if (results[1].status === 'fulfilled') clients = results[1].value;
      if (results[2].status === 'fulfilled') products = results[2].value;

      // Check for any rejected promises
      const rejected = results.filter(result => result.status === 'rejected');
      if (rejected.length > 0) {
        error = rejected[0].reason;
      }
    } catch (dbError: any) {
      error = dbError;
    }

    if (error) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800 font-medium">❌ Database Connection Error</div>
            <div className="text-red-700 text-sm mt-1">
              {error.message || 'Unable to connect to database'}
            </div>
            <div className="text-red-600 text-xs mt-2">
              Error details: {error.code || 'Unknown error code'}
            </div>
            <div className="mt-4 p-3 bg-slate-50 rounded border text-xs text-slate-600">
              <strong>Quick Fix:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>For local: Ensure your database is running and DATABASE_URL is correct</li>
                <li>For Vercel: Check your DATABASE_URL environment variable is set correctly</li>
                <li>For Vercel Postgres: Make sure you've set up Vercel Postgres in your project</li>
                <li>Try running: npm run postinstall (to regenerate Prisma client)</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Test Data Access</h1>
          <p className="text-slate-600">Verifying that seeded data is accessible in the web app</p>
          <div className="mt-2 text-xs text-green-600">
            ✅ Database connection successful
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Suppliers */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <TruckIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Suppliers ({suppliers.length})</h2>
            </div>
            <div className="space-y-2">
              {suppliers.map((supplier: any) => (
                <div key={supplier.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium text-slate-900">{supplier