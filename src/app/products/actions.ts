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
  if (!value) return null;
  // Remove all non-numeric characters except dots and minus signs (handles commas, Rs, $, etc)
  const cleanString = String(value).replace(/[^0-9.-]+/g, "");
  if (!cleanString) return null;
  const n = Number(cleanString);
  return Number.isFinite(n) ? cleanString : null; // Return as string for Prisma.Decimal
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

    await prisma.masterProduct.create({
      data,
    });

    revalidatePath("/products");
  } catch (error) {
    console.error("Failed to create product:", error);
    throw new Error("Failed to create product");
  }
}

export async function importProductsCsv(formData: FormData) {
  try {
    const file = formData.get("file");
    if (!(file instanceof File)) {
      throw new Error("No file provided");
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
    
    // Process all rows first to gather supplier names
    const supplierNames = new Set<string>();
    for (const row of limited) {
      const supplierName = (row.supplier ?? row.Supplier ?? row.supplierName ?? "RANKEM").toString().trim();
      if (supplierName) {
        supplierNames.add(supplierName);
      }
    }

    // Bulk upsert suppliers
    const supplierMap = new Map<string, string>();
    for (const name of Array.from(supplierNames)) {
      const supplier = await prisma.supplier.upsert({
        where: { name },
        create: { name },
        update: {},
        select: { id: true, name: true },
      });
      supplierMap.set(supplier.name, supplier.id);
    }

    // Prepare all product data for bulk insert
    const productsToInsert = [];
    
    for (const row of limited) {
      const name = (row.name ?? row.Name ?? row['Product description'] ?? row['Product Name'] ?? "").toString().trim();
      if (!name) continue;

      const supplierName = (row.supplier ?? row.Supplier ?? row.supplierName ?? "RANKEM").toString().trim();
      const supplierId = supplierName ? supplierMap.get(supplierName) || null : null;

      const rawPrice = row.listPrice ?? row.ListPrice ?? row['List price'] ?? row.defaultPrice ?? row.price ?? row.Price;
      const cleanPrice = parseCsvNumber(rawPrice);

      productsToInsert.push({
        name,
        sku: (row.sku ?? row.SKU ?? row['Product code'] ?? "").toString().trim() || null,
        casNumber: (row.casNumber ?? row.cas ?? row.CAS ?? row['CAS No.'] ?? row['CAS No'] ?? "").toString().trim() || null,
        unit: (row.unit ?? row.Unit ?? row['Quantity'] ?? "").toString().trim() || null,
        hsnCode: (row.hsnCode ?? row.HSN ?? row['HSN code'] ?? "").toString().trim() || null,
        grade: (row.grade ?? row.Grade ?? "").toString().trim() || null,
        listPrice: cleanPrice ? new Prisma.Decimal(cleanPrice) : null,
        currency: ((row.currency ?? row.Currency ?? "INR") as string).toUpperCase(),
        supplierId,
      });
    }

    // Use createMany for blazing fast bulk inserts (won't timeout on Vercel)
    if (productsToInsert.length > 0) {
      // Note: skipDuplicates ensures we don't crash if a product happens to violate a unique constraint
      await prisma.masterProduct.createMany({
        data: productsToInsert,
        skipDuplicates: true,
      });
    }

    revalidatePath("/products");
  } catch (error) {
    console.error("CSV Import Error:", error);
    throw new Error("Failed to import CSV. Please check the file format.");
  }
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



