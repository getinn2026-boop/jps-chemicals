"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db";

import { parse } from "csv-parse/sync";

function normalizeString(value: FormDataEntryValue | null) {
  const v = (value ?? "").toString().trim();
  return v.length ? v : null;
}

function parseCsvNumber(value: unknown) {
  const n = Number(String(value ?? "").trim());
  return Number.isFinite(n) ? n : null;
}

export async function createProduct(formData: FormData) {
  const name = (formData.get("name") ?? "").toString().trim();
  const sku = normalizeString(formData.get("sku"));
  const casNumber = normalizeString(formData.get("casNumber"));
  const unit = normalizeString(formData.get("unit"));
  const currency = (normalizeString(formData.get("currency")) ?? "INR").toUpperCase();
  const defaultPriceRaw = normalizeString(formData.get("defaultPrice"));
  const supplierName = normalizeString(formData.get("supplierName"));

  if (!name) {
    return;
  }

  const supplierId = supplierName
    ? (
        await prisma.supplier.upsert({
          where: { name: supplierName },
          create: { name: supplierName },
          update: {},
          select: { id: true },
        })
      ).id
    : null;

  await prisma.product.create({
    data: {
      name,
      sku,
      casNumber,
      unit,
      currency,
      defaultPrice: defaultPriceRaw ? defaultPriceRaw : null,
      supplierId,
    },
  });

  revalidatePath("/products");
}

export async function importProductsCsv(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return;
  }

  const text = await file.text();

  const records = parse(text, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    relax_column_count: true,
    trim: true,
  }) as Array<Record<string, string>>;

  const limited = records.slice(0, 5000);

  for (const row of limited) {
    const name = (row.name ?? row.Name ?? "").toString().trim();
    if (!name) {
      continue;
    }

    const supplierName = (row.supplier ?? row.Supplier ?? "").toString().trim();
    const supplierId = supplierName
      ? (
          await prisma.supplier.upsert({
            where: { name: supplierName },
            create: { name: supplierName },
            update: {},
            select: { id: true },
          })
        ).id
      : null;

    const defaultPrice = parseCsvNumber(row.defaultPrice ?? row.price ?? row.Price);

    await prisma.product.create({
      data: {
        name,
        sku: (row.sku ?? row.SKU ?? "").toString().trim() || null,
        casNumber: (row.casNumber ?? row.cas ?? row.CAS ?? "").toString().trim() || null,
        unit: (row.unit ?? row.Unit ?? "").toString().trim() || null,
        currency: ((row.currency ?? row.Currency ?? "INR") as string).toUpperCase(),
        defaultPrice: defaultPrice === null ? null : defaultPrice.toString(),
        supplierId,
      },
    });
  }

  revalidatePath("/products");
}

