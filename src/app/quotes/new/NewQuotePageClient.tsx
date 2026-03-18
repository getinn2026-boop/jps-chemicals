'use client';

import { useState } from 'react';
import Link from "next/link";
import { createQuote } from "../actions";
import { BeakerIcon, DocumentTextIcon, PlusIcon, ArrowLeftIcon, BuildingOfficeIcon, PhoneIcon, EnvelopeIcon, TrashIcon } from "@heroicons/react/24/outline";
import ProductAutocomplete from "./ProductAutocomplete";

interface Client {
  id: string;
  name: string;
  companyName: string | null;
  email: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  unit: string;
  defaultPrice: number;
  supplier: {
    name: string;
  };
}

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  lineTotal: number;
  product?: Product;
}

interface NewQuotePageProps {
  clients: Client[];
}

export default function NewQuotePageClient({ clients }: NewQuotePageProps) {
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([
    {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unit: "",
      unitPrice: 0,
      lineTotal: 0
    }
  ]);

  const addNewLine = () => {
    if (quoteItems.length >= 10) return; // Limit to 10 items
    
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unit: "",
      unitPrice: 0,
      lineTotal: 0
    };
    
    setQuoteItems([...quoteItems, newItem]);
  };

  const removeLine = (id: string) => {
    if (quoteItems.length <= 1) return; // Keep at least one item
    setQuoteItems(quoteItems.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setQuoteItems(quoteItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Recalculate line total if quantity or unit price changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.lineTotal = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const handleProductSelect = (itemId: string, product: Product) => {
    setQuoteItems(quoteItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          description: product.name,
          unit: product.unit || "",
          unitPrice: product.defaultPrice || 0,
          lineTotal: item.quantity * (product.defaultPrice || 0),
          product: product
        };
      }
      return item;
    }));
  };

  const calculateTotals = () => {
    const subtotal = quoteItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* JPS Chemicals Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <BuildingOfficeIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">JPS Chemicals</h1>
              <p className="text-blue-100">Your Trusted Chemical Solutions Partner</p>
            </div>
          </div>
          <div className="text-right text-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <PhoneIcon className="h-4 w-4" />
              <span>+91-123-456-7890</span>
            </div>
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="h-4 w-4" />
              <span>info@jpschemicals.com</span>
            </div>
            <div className="text-xs mt-2">
              <div>Mon-Fri: 9:00 AM - 6:00 PM</div>
              <div>GST: 27AAACJ1234A1ZP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mb-6">
        <Link
          href="/quotes"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Quotes
        </Link>
      </div>

      {/* Quote Form */}
      <form action={createQuote} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <DocumentTextIcon className="h-5 w-5 text-blue-600" />
            Create New Chemical Quote
          </h2>
          <p className="text-slate-600 text-sm mt-1">Generate a professional quotation for chemical products</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Client Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Client <span className="text-red-500">*</span>
              </label>
              <select
                name="clientId"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                required
              >
                <option value="">Choose a client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.companyName ? `${client.companyName} (${client.name})` : client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Quote Valid Until</label>
              <input
                name="validUntil"
                type="date"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
            <textarea
              name="notes"
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white resize-none"
              placeholder="Additional notes for this quotation..."
            />
          </div>

          {/* Chemical Products Section */}
          <div className="bg-slate-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <BeakerIcon className="h-5 w-5 text-blue-600" />
                Chemical Products
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">
                  {quoteItems.length} of 10 products
                </span>
                <button
                  type="button"
                  onClick={addNewLine}
                  disabled={quoteItems.length >= 10}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Line
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 pr-6 font-medium">Chemical Product / Description</th>
                    <th className="py-3 pr-6 font-medium">Quantity</th>
                    <th className="py-3 pr-6 font-medium">Unit</th>
                    <th className="py-3 pr-6 font-medium">Unit Price</th>
                    <th className="py-3 pr-6 font-medium">Line Total</th>
                    <th className="py-3 pr-6 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quoteItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-white">
                      <td className="py-3 pr-6">
                        <ProductAutocomplete
                          name={`itemDescription_${index}`}
                          placeholder={index === 0 ? "Start typing chemical name..." : "Search chemical..."}
                          onProductSelect={(product) => handleProductSelect(item.id, product)}
                        />
                        <input
                          type="hidden"
                          name={`itemDescription_${index}`}
                          value={item.description}
                        />
                      </td>
                      <td className="py-3 pr-6">
                        <input
                          name={`itemQuantity_${index}`}
                          type="number"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                        />
                      </td>
                      <td className="py-3 pr-6">
                        <select
                          name={`itemUnit_${index}`}
                          value={item.unit}
                          onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                          className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                        >
                          <option value="">Select unit</option>
                          <option value="kg">kg</option>
                          <option value="g">g</option>
                          <option value="mg">mg</option>
                          <option value="L">L</option>
                          <option value="mL">mL</option>
                          <option value="gal">gal</option>
                          <option value="drum">drum</option>
                          <option value="barrel">barrel</option>
                          <option value="pail">pail</option>
                          <option value="bag">bag</option>
                          <option value="sack">sack</option>
                          <option value="ton">ton</option>
                          <option value="lb">lb</option>
                          <option value="oz">oz</option>
                          <option value="fl oz">fl oz</option>
                          <option value="cylinder">cylinder</option>
                          <option value="bottle">bottle</option>
                          <option value="can">can</option>
                          <option value="pallet">pallet</option>
                          <option value="box">box</option>
                          <option value="case">case</option>
                        </select>
                      </td>
                      <td className="py-3 pr-6">
                        <input
                          name={`itemUnitPrice_${index}`}
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="w-28 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                        />
                      </td>
                      <td className="py-3 pr-6 font-semibold text-slate-900">
                        ₹{item.lineTotal.toFixed(2)}
                      </td>
                      <td className="py-3 pr-6">
                        {quoteItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLine(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove line"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">GST (18%):</span>
                    <span className="font-semibold">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg border-t border-slate-200 pt-2">
                    <span className="font-semibold text-slate-900">Total:</span>
                    <span className="font-bold text-slate-900">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden inputs for totals */}
          <input type="hidden" name="subtotal" value={subtotal} />
          <input type="hidden" name="tax" value={tax} />
          <input type="hidden" name="total" value={total} />
          <input type="hidden" name="taxRate" value={18} />

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-6 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Add chemical products to create your quotation
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={addNewLine}
                disabled={quoteItems.length >= 10}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusIcon className="h-4 w-4" />
                Add Line
              </button>
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2">
                <DocumentTextIcon className="h-4 w-4" />
                Create Chemical Quote
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}