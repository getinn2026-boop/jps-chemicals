'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import AddClientModal from "./AddClientModal";
import { UserIcon, BuildingOfficeIcon, EnvelopeIcon, PhoneIcon, PlusIcon, MagnifyingGlassIcon, BeakerIcon, ChartBarIcon } from "@heroicons/react/24/outline";

export const dynamic = 'force-dynamic';

interface Client {
  id: string;
  name: string;
  companyName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  gstin: string | null;
  createdAt: Date;
}

interface ClientStats {
  totalClients: number;
  companies: number;
  recentClients: number;
}

interface ClientsPageProps {
  clients: Client[];
  stats: ClientStats;
  searchQuery?: string;
}

export default function ClientsPage({ clients: initialClients = [], stats: initialStats = { totalClients: 0, companies: 0, recentClients: 0 }, searchQuery }: ClientsPageProps) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [stats, setStats] = useState<ClientStats>(initialStats);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const router = useRouter();
  const q = searchQuery || "";

  const handleClientAdded = () => {
    router.refresh();
  };

  // Fetch clients data if not provided
  useEffect(() => {
    if (!initialClients.length || !initialStats.totalClients) {
      fetch('/api/clients')
        .then(res => res.json())
        .then(data => {
          if (data.clients) setClients(data.clients);
          if (data.stats) setStats(data.stats);
        })
        .catch(err => console.error('Failed to fetch clients:', err));
    }
  }, [initialClients.length, initialStats.totalClients]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-6 mb-9">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-3xl shadow-xl">
                <UserIcon className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Client Management</h1>
                <p className="text-xl text-slate-600">Manage your chemical industry clients and track their quotation history</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-9 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-lg font-medium mb-1">Total Clients</p>
                    <p className="text-4xl font-bold text-blue-900 mb-2">{stats?.totalClients || 0}</p>
                    <p className="text-blue-700 text-xs font-medium">Active chemical industry partners</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-2xl shadow-lg group-hover:shadow-xl transition-all">
                    <UserIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-9 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-lg font-medium mb-1">Companies</p>
                    <p className="text-4xl font-bold text-green-900 mb-2">{stats?.companies || 0}</p>
                    <p className="text-green-700 text-xs font-medium">Registered business entities</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-2xl shadow-lg group-hover:shadow-xl transition-all">
                    <BuildingOfficeIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-9 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-lg font-medium mb-1">New This Month</p>
                    <p className="text-4xl font-bold text-purple-900 mb-2">{stats?.recentClients || 0}</p>
                    <p className="text-purple-700 text-xs font-medium">Recently added partners</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-2xl shadow-lg group-hover:shadow-xl transition-all">
                    <ChartBarIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Clients List */}
          <section>
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              {/* Search Header */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b-2 border-slate-200">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-2xl shadow-lg">
                      <BeakerIcon className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Chemical Industry Clients
                      </h2>
                      <p className="text-base text-slate-600 mt-1">Your trusted chemical supply partners</p>
                    </div>
                    <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-base font-semibold px-3 py-1 rounded-full shadow-md">
                      {clients.length} clients
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full xl:w-auto min-w-0">
                    <form action="/clients" className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative flex-1 min-w-0">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          name="q"
                          defaultValue={q}
                          placeholder="Search clients by name, company, email, or phone..."
                          className="pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white w-full text-lg shadow-sm"
                        />
                      </div>
                      <button className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 whitespace-nowrap shadow-lg hover:shadow-xl flex-shrink-0">
                        <MagnifyingGlassIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">Search</span>
                        <span className="sm:hidden">Go</span>
                      </button>
                    </form>
                    <button
                      onClick={() => setIsAddClientModalOpen(true)}
                      className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl whitespace-nowrap flex-shrink-0"
                    >
                      <PlusIcon className="h-5 w-5" />
                      <span className="hidden sm:inline">Add New Client</span>
                      <span className="sm:hidden">Add Client</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Clients Table */}
              <div className="overflow-x-auto">
                {clients.length === 0 ? (
                  <div className="text-center py-18">
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-6 rounded-3xl mx-auto mb-6 w-24 h-24 flex items-center justify-center">
                      <UserIcon className="h-12 w-12 text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">No clients found</h3>
                    <p className="text-lg text-slate-600 mb-6 max-w-md mx-auto">Get started by adding your first chemical industry client to build your partnership network</p>
                    <button
                      onClick={() => setIsAddClientModalOpen(true)}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-semibold flex items-center gap-2 mx-auto shadow-lg text-base"
                    >
                      <PlusIcon className="h-5 w-5" />
                      Add Your First Client
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {clients.map((client) => (
                      <div key={client.id} className="p-9 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-300 border-l-4 border-transparent hover:border-blue-500 group">
                        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                                {client.companyName ? (
                                  <BuildingOfficeIcon className="h-6 w-6 text-blue-700" />
                                ) : (
                                  <UserIcon className="h-6 w-6 text-blue-700" />
                                )}
                              </div>
                              <div>
                                <Link 
                                  href={`/clients/${client.id}`} 
                                  className="text-2xl font-bold text-slate-900 hover:text-blue-600 transition-colors group-hover:underline"
                                >
                                  {client.companyName || client.name}
                                </Link>
                                {client.companyName && (
                                  <p className="text-lg text-slate-600 mt-1 font-medium">{client.name}</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                              {client.email && (
                                <div className="flex items-center gap-3 text-base text-slate-600">
                                  <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-2 rounded-xl">
                                    <EnvelopeIcon className="h-5 w-5" />
                                  </div>
                                  <a href={`mailto:${client.email}`} className="hover:text-blue-600 font-medium hover:underline">
                                    {client.email}
                                  </a>
                                </div>
                              )}
                              {client.phone && (
                                <div className="flex items-center gap-3 text-base text-slate-600">
                                  <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-2 rounded-xl">
                                    <PhoneIcon className="h-5 w-5" />
                                  </div>
                                  <a href={`tel:${client.phone}`} className="hover:text-blue-600 font-medium hover:underline">
                                    {client.phone}
                                  </a>
                                </div>
                              )}
                              {client.address && (
                                <div className="flex items-start gap-3 text-base text-slate-600 md:col-span-2">
                                  <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-2 rounded-xl mt-1">
                                    <BuildingOfficeIcon className="h-5 w-5" />
                                  </div>
                                  <span className="flex-1 font-medium">{client.address}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-6 mt-6 text-sm text-slate-500">
                              <span className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-medium">Client since {client.createdAt.toLocaleDateString()}</span>
                              </span>
                              {client.gstin && (
                                <span className="bg-gradient-to-r from-slate-100 to-slate-200 px-3 py-1 rounded-full font-semibold border border-slate-200">GST: {client.gstin}</span>
                              )}
                            </div>
                          </div>
                          
                          <Link
                            href={`/clients/${client.id}`}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg text-base flex items-center gap-2 group-hover:shadow-xl"
                          >
                            <span>View Details</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onClientAdded={handleClientAdded}
      />
    </div>
  );
}