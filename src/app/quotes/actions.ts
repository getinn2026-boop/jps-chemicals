"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/server/db";
import { nextOrderNumber, nextQuoteNumber } from "@/server/numbering";
import { parseNumber, roundMoney, toDecimalString } from "@/server/money";
import { getCurrentUser, isAdmin } from "@/lib/auth";

function normalizeString(value: FormDataEntryValue | null) {
  const v = (value ?? "").toString().trim();
  return v.length ? v : null;
}

const quoteStatuses = ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"] as const;

export async function createQuote(formData: FormData) {
  const clientId = (formData.get("clientId") ?? "").toString().trim();
  if (!clientId) {
    return;
  }

  const quoteNumber = await nextQuoteNumber();

  const validUntilRaw = normalizeString(formData.get("validUntil"));
  const validUntil = validUntilRaw ? new Date(validUntilRaw) : null;
  const notes = normalizeString(formData.get("notes"));

  const desc = formData.getAll("itemDescription").map((v) => v.toString());
  const qty = formData.getAll("itemQuantity").map((v) => v.toString());
  const unit = formData.getAll("itemUnit").map((v) => v.toString());
  const price = formData.getAll("itemUnitPrice").map((v) => v.toString());

  const items: Array<{
    description: string;
    quantity: string;
    unit: string | null;
    unitPrice: string;
    lineTotal: string;
  }> = [];

  let subtotal = 0;

  for (let i = 0; i < desc.length; i += 1) {
    const description = desc[i].trim();
    if (!description) {
      continue;
    }

    const q = Number(qty[i] ?? "0");
    const p = Number(price[i] ?? "0");
    const lineTotal = roundMoney(q * p);
    subtotal = roundMoney(subtotal + lineTotal);

    items.push({
      description,
      quantity: toDecimalString(q),
      unit: (unit[i] ?? "").toString().trim() || null,
      unitPrice: toDecimalString(p),
      lineTotal: toDecimalString(lineTotal),
    });
  }

  const taxRate = parseNumber(formData.get("taxRate"));
  const tax = roundMoney((subtotal * taxRate) / 100);
  const total = roundMoney(subtotal + tax);

  const quote = await prisma.quote.create({
    data: {
      quoteNumber,
      clientId,
      validUntil,
      notes,
      subtotal: toDecimalString(subtotal),
      tax: toDecimalString(tax),
      total: toDecimalString(total),
      items: {
        create: items,
      },
      activities: {
        create: {
          type: "QUOTE_CREATED",
          message: `Quote ${quoteNumber} created`,
          clientId,
        },
      },
    },
    select: { id: true },
  });

  revalidatePath("/quotes");
  revalidatePath(`/clients/${clientId}`);
  redirect(`/quotes/${quote.id}`);
}

export async function setQuoteStatus(formData: FormData) {
  // Check if user is admin
  const user = await getCurrentUser();
  if (!isAdmin(user)) {
    console.error('Unauthorized: Only admins can change quote status');
    return;
  }

  const quoteId = (formData.get("quoteId") ?? "").toString().trim();
  const status = (formData.get("status") ?? "").toString().trim();

  if (!quoteId) {
    return;
  }

  if (!quoteStatuses.includes(status as (typeof quoteStatuses)[number])) {
    return;
  }

  const quote = await prisma.quote.update({
    where: { id: quoteId },
    data: {
      status: status as (typeof quoteStatuses)[number],
      activities: {
        create: {
          type: "QUOTE_STATUS_CHANGED",
          message: `Quote status changed to ${status} by admin ${user.name}`,
        },
      },
    },
    select: { clientId: true },
  });

  revalidatePath("/quotes");
  revalidatePath(`/quotes/${quoteId}`);
  revalidatePath(`/clients/${quote.clientId}`);
}

export async function createOrderFromQuote(formData: FormData) {
  const quoteId = (formData.get("quoteId") ?? "").toString().trim();
  if (!quoteId) {
    return;
  }

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: { items: true },
  });

  if (!quote) {
    return;
  }

  const orderNumber = await nextOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      clientId: quote.clientId,
      quoteId: quote.id,
      subtotal: quote.subtotal,
      tax: quote.tax,
      total: quote.total,
      items: {
        create: quote.items.map((i) => ({
          description: i.description,
          quantity: i.quantity,
          unit: i.unit,
          unitPrice: i.unitPrice,
          lineTotal: i.lineTotal,
          productId: i.productId,
        })),
      },
      activities: {
        create: [
          { type: "ORDER_CREATED", message: `Order ${orderNumber} created from quote` },
          { type: "ORDER_CREATED", message: `Order ${orderNumber} created from quote`, clientId: quote.clientId },
        ],
      },
    },
    select: { id: true },
  });

  await prisma.quote.update({
    where: { id: quoteId },
    data: {
      status: "ACCEPTED",
      activities: {
        create: { type: "QUOTE_CONVERTED", message: `Quote converted to order ${orderNumber}` },
      },
    },
  });

  revalidatePath("/orders");
  revalidatePath("/quotes");
  revalidatePath(`/quotes/${quoteId}`);
  revalidatePath(`/clients/${quote.clientId}`);
  redirect(`/orders/${order.id}`);
}
