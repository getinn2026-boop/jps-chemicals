"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db";
import { Prisma } from "@prisma/client";

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
  try {
    const data = {
      name: formData.get("name") as string,
      sku: (formData.get("sku") as string) || null,
      casNumber: (formData.get("casNumber") as string) || null,
      unit: (formData.get("unit") as string) || null,
      hsnCode: (formData.get("hsnCode") as string) || null,
      grade: (formData.get("grade") as string) || null,
      listPrice: formData.get("listPrice")
        ? new Prisma.Decimal(formData.get("listPrice") as string)
        : null,
      supplierId: (formData.get("supplierId") as string) || null,
    };

    const product = await prisma.masterProduct.create({
      data,
    });

    revalidatePath("/products");
    return { success: true, product };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "Failed to create product" };
  }
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

    const listPrice = parseCsvNumber(row.listPrice ?? row.defaultPrice ?? row.price ?? row.Price);

    await prisma.masterProduct.create({
      data: {
        name,
        sku: (row.sku ?? row.SKU ?? "").toString().trim() || null,
        casNumber: (row.casNumber ?? row.cas ?? row.CAS ?? "").toString().trim() || null,
        unit: (row.unit ?? row.Unit ?? "").toString().trim() || null,
        hsnCode: (row.hsnCode ?? row.HSN ?? "").toString().trim() || null,
        grade: (row.grade ?? row.Grade ?? "").toString().trim() || null,
        listPrice,
        currency: ((row.currency ?? row.Currency ?? "INR") as string).toUpperCase(),
        supplierId,
      },
    });
  }

  revalidatePath("/products");
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      sku: (formData.get("sku") as string) || null,
      casNumber: (formData.get("casNumber") as string) || null,
      unit: (formData.get("unit") as string) || null,
      hsnCode: (formData.get("hsnCode") as string) || null,
      grade: (formData.get("grade") as string) || null,
      listPrice: formData.get("listPrice")
        ? new Prisma.Decimal(formData.get("listPrice") as string)
        : null,
      supplierId: (formData.get("supplierId") as string) || null,
    };

    const product = await prisma.masterProduct.update({
      where: { id },
      data,
    });

    revalidatePath("/products");
    return { success: true, product };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.masterProduct.delete({
      where: { id },
    });
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}



